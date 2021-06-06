export const Abilities: {[k: string]: ModdedAbilityData} = {
	badcompany: {
		shortDesc: "Prevents self-lowering stat drops and recoil.",
		onModifyMove(move) {
			move.mindBlownRecoil = false;
		},
		onBoost(boost, target, source, effect) {
			if (source && target !== source) return;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
				}
			}
		},
		name: "Bad Company",
		rating: 4,
		gen: 8,
	},
	blademaster: {
		desc: "This Pokemon's blade-based attacks have their power multiplied by 1.2 and get a +1 critical hit ratio.",
		shortDesc: "Blade attacks have 1.2x power and +1 crit ratio.",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['blade']) {
				this.debug('Blademaster boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onModifyCritRatio(critRatio, source, target, move: ActiveMove) {
			if (move.flags['blade']) {
				return (critRatio + 1);
			}
		},
		name: "Blademaster",
		rating: 3.5,
		gen: 8,
	},
	blazingsoul: {
		shortDesc: "If this Pokemon is at full HP, its Fire-type moves have their priority increased by 1.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Fire' && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		name: "Blazing Soul",
		rating: 3,
		gen: 8,
	},
	bonezone: {
		shortDesc: "Bone moves ignore immunities and deal double damage on not very effective.",
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (move.flags['bone']) {
				if (!move.ignoreImmunity) move.ignoreImmunity = {};
				if (move.ignoreImmunity !== true) {
					move.ignoreImmunity[move.type] = true;
				}
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (move.flags['bone'] && target.getMoveHitData(move).typeMod < 0) {
				this.debug('Welcome to the Bone Zone');
				return this.chainModify(2);
			}
		},
		name: "Bone Zone",
		rating: 4,
		gen: 8,
	},
	bullrush: {
		shortDesc: "The first move this Pokemon's uses gets a 1.5x damage boost.",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.activeMoveActions > 1) {
				return;
			}
			this.debug('Bull Rush boost');
			return this.chainModify(1.5);
		},
		name: "Bull Rush",
		rating: 2,
		gen: 8,
	},
	corrosion: {
		inherit: true,
		shortDesc: "This Pokemon can use poison type moves on other Pokemon regardless of their typing.",
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
	},
	defeatist: {
		inherit: true,
		desc: "While this Pokemon has 1/3 or less of its maximum HP, its Attack and Special Attack are halved.",
		shortDesc: "While this Pokemon has 1/3 or less of its max HP, its Attack and Sp. Atk are halved.",
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				return this.chainModify(0.5);
			}
		},
		onModifySpA(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 3) {
				return this.chainModify(0.5);
			}
		},
	},
	fatalprecision: {
		shortDesc: "Super Effective Moves from this Pokemon can’t miss and receive a 20% damage boost.",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (defender && this.dex.getEffectiveness(move, defender.types) > 0) {
				this.debug('Fatal Precision boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onModifyMove(move, pokemon, target) {
			if (target && this.dex.getEffectiveness(move, target.types) > 0) {
				move.accuracy = true;
			}
		},
		name: "Fatal Precision",
		rating: 3,
		gen: 8,
	},
	felinepower: {
		shortDesc: "This Pokemon's Sp. Atk is doubled.",
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.chainModify(2);
		},
		name: "Feline Power",
		rating: 5,
		gen: 8,
	},
	flareboost: {
		inherit: true,
		desc: "While this Pokemon is burned, the power of its special attacks is multiplied by 1.5. Immune to burn damage.",
		shortDesc: "While this Pokemon is burned, its special attacks have 1.5x power; Immune to burn damage.",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'brn') {
				return false;
			}
		},
	},
	flowergift: {
		inherit: true,
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and its Attack and Speed are multiplied by 1.5. If this Pokemon is a Cherrim and it is holding Utility Umbrella, it remains in its regular form and its Attack and Speed stats are not boosted. If this Pokemon is a Cherrim in its Sunshine form and is given Utility Umbrella, it will immediately switch back to its regular form. If this Pokemon is a Cherrim holding Utility Umbrella and its item is removed while Sunny Day is active, it will transform into its Sunshine Form.",
		shortDesc: "If user is Cherrim and Sunny Day is active, its Attack and Speed are 1.5x.",
		onModifyAtk(atk, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifyAtk() {},
		onAllyModifySpD() {},
	},
	forecast: {
		inherit: true,
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm. If this Pokemon is holding Utility Umbrella and the weather condition is Sunny Day, Desolate Land, Rain Dance, or Primordial Sea, it will not change types. If this pokemon is holding a weather rock, it will set the weather corrosponding to the rock it is holding.",
		shortDesc: "Castform's type changes to the current weather condition's type, except Sandstorm. Summons weather if holding weather rock.",
		onStart(pokemon) {
			if (pokemon.hasItem('damprock')) {
				this.field.setWeather('raindance');
			} else if (pokemon.hasItem('heatrock')) {
				this.field.setWeather('sunnyday');
			} else if (pokemon.hasItem('smoothrock')) {
				this.field.setWeather('sandstorm');
			} else if (pokemon.hasItem('icyrock')) {
				this.field.setWeather('hail');
			}
		},
	},
	gulpmissile: {
		inherit: true,
		desc: "If this Pokemon is a Cramorant, it changes forme when it hits a target with Surf or uses the first turn of Dive successfully. It becomes Gulping Form with an Arrokuda in its mouth if it has more than 1/2 of its maximum HP remaining, or Gorging Form with a Pikachu in its mouth if it has 1/2 or less of its maximum HP remaining. If Cramorant gets hit in Gulping or Gorging Form, it spits the Arrokuda or Pikachu at its attacker, even if it has no HP remaining. The projectile deals damage equal to 1/4 of the target's maximum HP, rounded down; this damage is blocked by the Magic Guard Ability but not by a substitute. An Arrokuda also lowers the target's Speed by 1 stage, and a Pikachu paralyzes the target. Cramorant will return to normal if it spits out a projectile, switches out, or Dynamaxes.",
		shortDesc: "When hit after Surf/Dive, attacker takes 1/4 max HP and -1 Speed or paralysis.",
		onDamagingHit(damage, target, source, move) {
			if (!source.hp || !source.isActive || target.transformed || target.isSemiInvulnerable()) return;
			if (['cramorantgulping', 'cramorantgorging'].includes(target.species.id)) {
				this.damage(source.baseMaxhp / 4, source, target);
				if (target.species.id === 'cramorantgulping') {
					this.boost({spe: -1}, source, target, null, true);
				} else {
					source.trySetStatus('par', target, move);
				}
				target.formeChange('cramorant', move);
			}
		},
	},
	illusion: {
		inherit: true,
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon. This Pokemon's moves are given a 1.3x boost when disguised.",
		shortDesc: "Appears as last Pokemon in party until damaged; 1.3x power when disguised.",
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.illusion) {
				this.debug('Illusion boost');
				return this.chainModify([5325, 4096]);
			}
		},
	},
	innerfocus: {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'surprise') {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', '[of] ' + target);
			}
		},
	},
	ironfist: {
		inherit: true,
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.3.",
		shortDesc: "This Pokemon's punch-based attacks have 1.3x power.",
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([5325, 4096]);
			}
		},
	},
	mountaineer: {
		shortDesc: "This Pokemon is immune to Rock; Avoids Stealth Rock.",
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Rock') {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
		isBreakable: true,
		name: "Mountaineer",
		rating: 4,
		gen: 8,
	},
	oblivious: {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'surprise') {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Oblivious', '[of] ' + target);
			}
		},
	},
	oraoraoraora: {
		shortDesc: "This Pokemon's punch moves hit twice. The second hit has its damage halved.",
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.selfdestruct || move.multihit) return;
			if (move.flags['punch'] && !move.flags['charge'] && !move.spreadHit && !move.isZ && !move.isMax) {
				move.multihit = 2;
				move.multihitType = 'oraoraoraora';
			}
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'oraoraoraora' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		name: "ORAORAORAORA",
		rating: 5,
		gen: 8,
	},
	owntempo: {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'surprise') {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Own Tempo', '[of] ' + target);
			}
		},
	},
	parasiticwaste: {
		shortDesc: "Attacks that can poison also heal for 50% of the damage dealt.",
		onModifyMove(move) {
			if (!move.secondaries) move.secondaries = [];
			for (const secondary of move.secondaries) {
				if ((move.category !== 'Status') && (secondary.status === 'psn' || secondary.status === 'tox')) {
					move.drain = [1, 2];
				}
			}
		},
		name: "Parasitic Waste",
		rating: 2.5,
		gen: 8,
	},
	primalarmor: {
		shortDesc: "This Pokemon receives 1/2 damage from supereffective attacks.",
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Primal Armor neutralize');
				return this.chainModify(0.5);
			}
		},
		name: "Primal Armor",
		rating: 3,
		gen: 8,
	},
	quickfeet: {
		inherit: true,
		desc: "If this Pokemon has a non-volatile status condition, its Speed is multiplied by 2; the Speed drop from paralysis is ignored.",
		shortDesc: "If this Pokemon is statused, its Speed is 2x; ignores Speed drop from paralysis.",
		onModifySpe(spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2);
			}
		},
	},
	rivalry: {
		inherit: true,
		desc: "This Pokemon's attacks have their power multiplied by 1.25 against targets of the same gender. There is no modifier if either this Pokemon or the target is genderless, or if they have different genders.",
		shortDesc: "This Pokemon's attacks do 1.25x on same gender targets.",
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.25);
				}
			}
		},
	},
	sagepower: {
		shortDesc: "This Pokemon's Sp. Atk is 1.5x, but it can only select the first move it executes.",
		onStart(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		onBeforeMove(pokemon, target, move) {
			if (move.isZOrMaxPowered || move.id === 'struggle') return;
			if (pokemon.abilityState.choiceLock && pokemon.abilityState.choiceLock !== move.id) {
				// Fails unless ability is being ignored (these events will not run), no PP lost.
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Sage Power");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.abilityState.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') return;
			pokemon.abilityState.choiceLock = move.id;
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			// PLACEHOLDER
			this.debug('Sage Power SpA Boost');
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.abilityState.choiceLock) return;
			if (pokemon.volatiles['dynamax']) return;
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== pokemon.abilityState.choiceLock) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
		onEnd(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		name: "Sage Power",
		rating: 4.5,
		gen: 8,
	},
	scrappy: {
		inherit: true,
		onBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'surprise') {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Scrappy', '[of] ' + target);
			}
		},
	},
	selfsufficient: {
		shortDesc: "At the end of every turn, this Pokemon restores 1/16 of its max HP.",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		name: "Self Sufficient",
		rating: 2.5,
		gen: 8,
	},
	shielddust: {
		inherit: true,
		desc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack, and is not affected by entry hazards.",
		shortDesc: "This Pokemon is unaffected by entry hazards and secondary effects of moves.",
		rating: 3.5,
	},
	solarpower: {
		inherit: true,
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 1.5 and its defenses are multiplied by 1.33. If this Pokemon is holding Utility Umbrella, its Special Attack remains the same and it does not gain a defense boost.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x and defenses are 1.33x.",
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.33);
			}
		},
		onWeather() {},
	},
	striker: {
		desc: "This Pokemon's kick-based attacks have their power multiplied by 1.3.",
		shortDesc: "This Pokemon's kick-based attacks have 1.3x power.",
		onBasePowerPriority: 43,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['kick']) {
				this.debug('Striker Boost');
				return this.chainModify([5325, 4096]);
			}
		},
		name: "Striker",
		rating: 3,
		gen: 8,
	},
	surprise: {
		shortDesc: "Random effect on switch-in.",
		onStart(pokemon) {
			const effectNum = this.random(5);
			switch (effectNum) {
			case 0:
				this.boost({spe: 1}, pokemon);
				break;
			case 1:
				this.boost({atk: 1}, pokemon);
				break;
			case 2:
				this.field.setWeather('hail');
				break;
			case 3:
				let activated = false;
				for (const target of pokemon.adjacentFoes()) {
					if (!activated) {
						this.add('-ability', pokemon, 'Surprise!', 'boost');
						activated = true;
					}
					if (target.volatiles['substitute']) {
						this.add('-immune', target);
					} else {
						this.boost({atk: -1}, target, pokemon, null, true);
					}
				}
				break;
			case 4:
				this.add('-ability', pokemon, 'Surprise!');
				pokemon.addVolatile('slowstart');
				break;
			}
		},
		name: "Surprise!",
		rating: 2,
		gen: 8,
	},
	toxicboost: {
		inherit: true,
		desc: "While this Pokemon is poisoned, the power of its physical attacks is multiplied by 1.5. Immune to poison damage.",
		shortDesc: "While this Pokemon is poisoned, its physical attacks have 1.5x power; Immune to poison damage.",
		onDamage(damage, target, source, effect) {
			if (effect.id === 'tox' || effect.id === 'psn') {
				return false;
			}
		},
	},
	truant: {
		inherit: true,
		shortDesc: "This Pokemon can only use healing moves every other turn.",
		onBeforeMove(pokemon, target, move) {
			if (pokemon.removeVolatile('truant')) {
				if (!move.heal) {
					this.add('cant', pokemon, 'ability: Truant');
					return false;
				}
				return true;
			}
			pokemon.addVolatile('truant');
		},
	},
	watercompaction: {
		inherit: true,
		desc: "This Pokemon's Defense is raised 2 stages after it is damaged by a Water-type move; Reduces water damage by 50%.",
		shortDesc: "Raises defense by 2 stages when damaged by water-type move; Reduces water damage by 50%.",
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
	},
};
