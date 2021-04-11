export const Scripts: ModdedBattleScriptsData = {
	gen: 8,
	actions: {
		canMegaEvo(pokemon: Pokemon) {
			const species = pokemon.baseSpecies;
			const altForme = species.otherFormes && this.dex.getSpecies(species.otherFormes[0]);
			const item = pokemon.getItem();
			// Mega Rayquaza
			if (altForme?.isMega && altForme?.requiredMove &&
				pokemon.baseMoves.includes(toID(altForme.requiredMove)) && !item.zMove) {
				return altForme.name;
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
			let attackStat: StatNameExceptHP = category === 'Physical' ? 'atk' : 'spa';
			const defenseStat: StatNameExceptHP = defensiveCategory === 'Physical' ? 'def' : 'spd';
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
		hitStepStealBoosts(targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) {
			const target = targets[0]; // hardcoded
			if (move.stealsBoosts) {
				const boosts: SparseBoostsTable = {};
				let stolen = false;
				let statName: BoostName;
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
	
					let statName2: BoostName;
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
	}
};