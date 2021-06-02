export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen8',
	actions: {
		canMegaEvo(pokemon: Pokemon) {
			const species = pokemon.baseSpecies;
			const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
			const item = pokemon.getItem();
			// Mega Rayquaza
			if (altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(this.battle.toID(altForme.requiredMove)) && !item.zMove) {
				return altForme.name;
			}
			// prevent Galarian Slowbro from mega evolving
			if (item.id === "slowbronite" && species.name === "Slowbro-Galar") {
				return null;
			}
			// allow low key toxtricity to mega evolve
			if (item.id === "toxtricitite" && species.name === "Toxtricity-Low-Key") {
				return "Toxtricity-Mega";
			}
			// a hacked-in Megazard X can mega evolve into Megazard Y, but not into Megazard X
			if (item.megaEvolves === species.baseSpecies && item.megaStone !== species.name) {
				return item.megaStone;
			}
			return null;
		},
		getDamage(
			pokemon: Pokemon, target: Pokemon, move: string | number | ActiveMove,
			suppressMessages = false
		): number | undefined | null | false {
			if (typeof move === 'string') move = this.dex.getActiveMove(move);

			if (typeof move === 'number') {
				const basePower = move;
				move = new Dex.Move({
					basePower,
					type: '???',
					category: 'Physical',
					willCrit: false,
				}) as ActiveMove;
				move.hit = 0;
			}

			if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
				if (!target.runImmunity(move.type, !suppressMessages)) {
					return false;
				}
			}

			if (move.ohko) return target.maxhp;
			if (move.damageCallback) return move.damageCallback.call(this.battle, pokemon, target);
			if (move.damage === 'level') {
				return pokemon.level;
			} else if (move.damage) {
				return move.damage;
			}

			const category = this.battle.getCategory(move);
			const defensiveCategory = move.defensiveCategory || category;

			let basePower: number | false | null = move.basePower;
			if (move.basePowerCallback) {
				basePower = move.basePowerCallback.call(this.battle, pokemon, target, move);
			}
			if (!basePower) return basePower === 0 ? undefined : basePower;
			basePower = this.battle.clampIntRange(basePower, 1);

			let critMult;
			let critRatio = this.battle.runEvent('ModifyCritRatio', pokemon, target, move, move.critRatio || 0);
			if (this.battle.gen <= 5) {
				critRatio = this.battle.clampIntRange(critRatio, 0, 5);
				critMult = [0, 16, 8, 4, 3, 2];
			} else {
				critRatio = this.battle.clampIntRange(critRatio, 0, 4);
				if (this.battle.gen === 6) {
					critMult = [0, 16, 8, 2, 1];
				} else {
					critMult = [0, 24, 8, 2, 1];
				}
			}

			const moveHit = target.getMoveHitData(move);
			moveHit.crit = move.willCrit || false;
			if (move.willCrit === undefined) {
				if (critRatio) {
					moveHit.crit = this.battle.randomChance(1, critMult[critRatio]);
				}
			}

			if (moveHit.crit) {
				moveHit.crit = this.battle.runEvent('CriticalHit', target, null, move);
			}

			// happens after crit calculation
			basePower = this.battle.runEvent('BasePower', pokemon, target, move, basePower, true);

			if (!basePower) return 0;
			basePower = this.battle.clampIntRange(basePower, 1);

			const level = pokemon.level;

			const attacker = pokemon;
			const defender = target;
			let attackStat: StatIDExceptHP = category === 'Physical' ? 'atk' : 'spa';
			const defenseStat: StatIDExceptHP = defensiveCategory === 'Physical' ? 'def' : 'spd';
			if (move.useSourceDefensiveAsOffensive) {
				attackStat = defenseStat;
				// Body press really wants to use the def stat,
				// so it switches stats to compensate for Wonder Room.
				// Of course, the game thus miscalculates the boosts...
				if ('wonderroom' in this.battle.field.pseudoWeather) {
					if (attackStat === 'def') {
						attackStat = 'spd';
					} else if (attackStat === 'spd') {
						attackStat = 'def';
					}
					if (attacker.boosts['def'] || attacker.boosts['spd']) {
						this.battle.hint("Body Press uses Sp. Def boosts when Wonder Room is active.");
					}
				}
			}

			const statTable = {atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe'};
			let attack;
			let defense;

			let atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
			let defBoosts = defender.boosts[defenseStat];

			let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
			let ignorePositiveDefensive = !!move.ignorePositiveDefensive;

			if (moveHit.crit) {
				ignoreNegativeOffensive = true;
				ignorePositiveDefensive = true;
			}
			const ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
			const ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));

			if (ignoreOffensive) {
				this.battle.debug('Negating (sp)atk boost/penalty.');
				atkBoosts = 0;
			}
			if (ignoreDefensive) {
				this.battle.debug('Negating (sp)def boost/penalty.');
				defBoosts = 0;
			}

			if (move.useTargetOffensive) {
				attack = defender.calculateStat(attackStat, atkBoosts);
			} else {
				attack = attacker.calculateStat(attackStat, atkBoosts);
			}

			attackStat = (category === 'Physical' ? 'atk' : 'spa');
			defense = defender.calculateStat(defenseStat, defBoosts);

			// Apply Stat Modifiers
			attack = this.battle.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
			defense = this.battle.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

			if (['explosion', 'selfdestruct'].includes(move.id) && defenseStat === 'def') {
				defense = this.battle.clampIntRange(Math.floor(defense / 2), 1);
			}
			if (move.id === 'mistyexplosion' && defenseStat === 'spd') {
				defense = this.battle.clampIntRange(Math.floor(defense / 2), 1);
			}

			const tr = this.battle.trunc;

			// int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
			const baseDamage = tr(tr(tr(tr(2 * level / 5 + 2) * basePower * attack) / defense) / 50);

			// Calculate damage modifiers separately (order differs between generations)
			return this.modifyDamage(baseDamage, pokemon, target, move, suppressMessages);
		},
		modifyDamage(
			baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages = false
		) {
			const tr = this.battle.trunc;
			if (!move.type) move.type = '???';
			const type = move.type;

			baseDamage += 2;

			if (move.spreadHit) {
				// multi-target modifier (doubles only)
				const spreadModifier = move.spreadModifier || (this.battle.gameType === 'freeforall' ? 0.5 : 0.75);
				this.battle.debug('Spread modifier: ' + spreadModifier);
				baseDamage = this.battle.modify(baseDamage, spreadModifier);
			} else if (move.multihitType === 'parentalbond' && move.hit > 1) {
				// Parental Bond modifier
				const bondModifier = this.battle.gen > 6 ? 0.25 : 0.5;
				this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
				baseDamage = this.battle.modify(baseDamage, bondModifier);
			} else if (move.multihitType === 'oraoraoraora' && move.hit > 1) {
				// ORAORAORAORA modifier
				this.battle.debug(`ORAORAORAROA modifier: 0.5`);
				baseDamage = this.battle.modify(baseDamage, 0.5);
			}

			// weather modifier
			baseDamage = this.battle.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

			// crit - not a modifier
			const isCrit = target.getMoveHitData(move).crit;
			if (isCrit) {
				baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
			}

			// random factor - also not a modifier
			baseDamage = this.battle.randomizer(baseDamage);

			// STAB
			if (move.forceSTAB || (type !== '???' && pokemon.hasType(type))) {
				// The "???" type never gets STAB
				// Not even if you Roost in Gen 4 and somehow manage to use
				// Struggle in the same turn.
				// (On second thought, it might be easier to get a MissingNo.)
				baseDamage = this.battle.modify(baseDamage, move.stab || 1.5);
			}
			// types
			let typeMod = target.runEffectiveness(move);
			typeMod = this.battle.clampIntRange(typeMod, -6, 6);
			target.getMoveHitData(move).typeMod = typeMod;
			if (typeMod > 0) {
				if (!suppressMessages) this.battle.add('-supereffective', target);

				for (let i = 0; i < typeMod; i++) {
					baseDamage *= 2;
				}
			}
			if (typeMod < 0) {
				if (!suppressMessages) this.battle.add('-resisted', target);

				for (let i = 0; i > typeMod; i--) {
					baseDamage = tr(baseDamage / 2);
				}
			}

			if (isCrit && !suppressMessages) this.battle.add('-crit', target);

			if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
				if (this.battle.gen < 6 || move.id !== 'facade') {
					baseDamage = this.battle.modify(baseDamage, 0.5);
				}
			}

			// Generation 5, but nothing later, sets damage to 1 before the final damage modifiers
			if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;

			// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
			baseDamage = this.battle.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

			if (move.isZOrMaxPowered && target.getMoveHitData(move).zBrokeProtect) {
				baseDamage = this.battle.modify(baseDamage, 0.25);
				this.battle.add('-zbroken', target);
			}

			// Generation 6-7 moves the check for minimum 1 damage after the final modifier...
			if (this.battle.gen !== 5 && !baseDamage) return 1;

			// ...but 16-bit truncation happens even later, and can truncate to 0
			return tr(baseDamage, 16);
		},
		hitStepStealBoosts(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
			const target = targets[0]; // hardcoded
			if (move.stealsBoosts) {
				const boosts: SparseBoostsTable = {};
				let stolen = false;
				let statName: BoostID;
				for (statName in target.boosts) {
					const stage = target.boosts[statName];
					if (stage > 0) {
						boosts[statName] = stage;
						stolen = true;
					}
				}
				if (stolen) {
					this.battle.attrLastMove('[still]');
					this.battle.add('-clearpositiveboost', target, pokemon, 'move: ' + move.name);
					this.battle.boost(boosts, pokemon, pokemon);

					let statName2: BoostID;
					for (statName2 in boosts) {
						boosts[statName2] = 0;
					}
					target.setBoost(boosts);
					if (move.id === 'soulrobbery') this.battle.addMove('-anim', pokemon, "Soul Robbery", target);
					else this.battle.addMove('-anim', pokemon, "Spectral Thief", target);
				}
			}
			return undefined;
		},
	},
};
