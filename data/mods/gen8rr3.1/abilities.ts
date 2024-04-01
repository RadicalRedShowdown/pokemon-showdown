export const Abilities: {[k: string]: ModdedAbilityData} = {
	badcompany: {
		onTryBoost(boost, target, source, effect) {
			if (source && target !== source) return;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
				}
			}
		},
		onModifyMove(move) {
			move.mindBlownRecoil = false;
		},
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		name: "Bad Company",
		rating: 4,
		gen: 8,
		shortDesc: "Prevents self-lowering stat drops and recoil.",
	},
	blademaster: {
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
		desc: "This Pokemon's blade-based attacks have their power multiplied by 1.2 and get a +1 critical hit ratio.",
		shortDesc: "Blade attacks have 1.2x power and +1 crit ratio.",
	},
	blazingsoul: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Fire' && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		name: "Blazing Soul",
		rating: 3,
		gen: 8,
		shortDesc: "If this Pokemon is at full HP, its Fire-type moves have their priority increased by 1.",
	},
	blubberdefense: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Blubber Defense weaken');
				return this.chainModify(0.5);
			}
		},
		name: "Blubber Defense",
		rating: 3.5,
		gen: 8,
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is halved.",
	},
	bonezone: {
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
		shortDesc: "Bone moves ignore immunities and deal double damage on not very effective.",
	},
	bullrush: {
		onModifyAtk(atk, attacker, defender, move) {
			if (attacker.activeMoveActions > 1) return;
			this.debug('Bull Rush attack boost');
			return this.chainModify([4915, 4096]);
		},
		onModifySpe(spe, pokemon) {
			// probably not > 1 because speed is determined before the move action is run
			if (pokemon.activeMoveActions > 0) return;
			return this.chainModify(1.5);
		},
		name: "Bull Rush",
		rating: 3.5,
		gen: 8,
		desc: "On the first turn this Pokemon is out on the field for, it gets a 1.5x Speed boost and a 1.2x Attack boost.",
		shortDesc: "On first turn out, 1.5x Speed and 1.2x Attack.",
	},
	cashsplash: {
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Cash Splash');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Cash Splash');
			}
			return false;
		},
		name: "Cash Splash",
		rating: 4.5,
		gen: 8,
		desc: "This Pokemon's attacking stat is doubled while using a Water-type attack. If a Pokemon uses a Fire-type attack against this Pokemon, that Pokemon's attacking stat is halved when calculating the damage to this Pokemon. This Pokemon cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved.",
	},
	corrosion: {
		inherit: true,
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Poison'] = true;
			}
		},
		rating: 3,
		shortDesc: "This Pokemon can hit Steel types with Poison-type moves.",
	},
	defeatist: {
		inherit: true,
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
		desc: "While this Pokemon has 1/3 or less of its maximum HP, its Attack and Special Attack are halved.",
		shortDesc: "While this Pokemon has 1/3 or less of its max HP, its Attack and Sp. Atk are halved.",
	},
	emergencyexit: {
		onBeforeTurn(pokemon) {
			pokemon.abilityState.originalHP = pokemon.hp;
		},
		onStart(pokemon) {
			pokemon.abilityState.originalHP = pokemon.hp;
		},
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2 && pokemon.abilityState.originalHP > pokemon.maxhp / 2) {
				if (!this.canSwitch(pokemon.side) || pokemon.forceSwitchFlag || pokemon.switchFlag) return;
				for (const side of this.sides) {
					for (const active of side.active) {
						active.switchFlag = false;
					}
				}
				pokemon.switchFlag = true;
				this.add('-activate', pokemon, 'ability: Emergency Exit');
			}
		},
		name: "Emergency Exit",
		rating: 1,
		num: 194,
		desc: "At the end of the turn, if this Pokemon has less than 1/2 of its maximum HP, it switches out to a chosen ally.",
		shortDesc: "If this Pokemon is below 1/2 HP at the end of the turn, it switches out.",
	},
	fatalprecision: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (defender.runEffectiveness(move) > 0) {
				this.debug('Fatal Precision boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onModifyMove(move, pokemon, target) {
			if (target && target.runEffectiveness(move) > 0) {
				move.accuracy = true;
			}
		},
		name: "Fatal Precision",
		rating: 3,
		gen: 8,
		shortDesc: "Super Effective Moves from this Pokemon can’t miss and receive a 20% damage boost.",
	},
	felineprowess: {
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.chainModify(2);
		},
		name: "Feline Prowess",
		rating: 5,
		gen: 8,
		shortDesc: "This Pokemon's Sp. Atk is doubled.",
	},
	flareboost: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'brn') {
				return false;
			}
		},
		rating: 3,
		desc: "While this Pokemon is burned, the power of its special attacks is multiplied by 1.5. Immune to burn damage.",
		shortDesc: "When burned, special attacks have 1.5x power; Immune to burn damage.",
	},
	flowergift: {
		inherit: true,
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
		desc: "If this Pokemon is a Cherrim and Sunny Day is active, it changes to Sunshine Form and its Attack and Speed are multiplied by 1.5. If this Pokemon is a Cherrim and it is holding Utility Umbrella, it remains in its regular form and its Attack and Speed stats are not boosted. If this Pokemon is a Cherrim in its Sunshine form and is given Utility Umbrella, it will immediately switch back to its regular form. If this Pokemon is a Cherrim holding Utility Umbrella and its item is removed while Sunny Day is active, it will transform into its Sunshine Form.",
		shortDesc: "If user is Cherrim and Sunny Day is active, its Attack and Speed are 1.5x.",
	},
	forecast: {
		inherit: true,
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
		desc: "If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm. If this Pokemon is holding Utility Umbrella and the weather condition is Sunny Day, Desolate Land, Rain Dance, or Primordial Sea, it will not change types. If this pokemon is holding a weather rock, it will set the weather corrosponding to the rock it is holding.",
		shortDesc: "Summons weather based on held weather rock, then changes type to match the weather.",
	},
	gulpmissile: {
		inherit: true,
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
		desc: "If this Pokemon is a Cramorant, it changes forme when it hits a target with Surf or uses the first turn of Dive successfully. It becomes Gulping Form with an Arrokuda in its mouth if it has more than 1/2 of its maximum HP remaining, or Gorging Form with a Pikachu in its mouth if it has 1/2 or less of its maximum HP remaining. If Cramorant gets hit in Gulping or Gorging Form, it spits the Arrokuda or Pikachu at its attacker, even if it has no HP remaining. The projectile deals damage equal to 1/4 of the target's maximum HP, rounded down; this damage is blocked by the Magic Guard Ability but not by a substitute. An Arrokuda also lowers the target's Speed by 1 stage, and a Pikachu paralyzes the target. Cramorant will return to normal if it spits out a projectile, switches out, or Dynamaxes.",
		shortDesc: "When hit after Surf/Dive, attacker takes 1/4 max HP and -1 Speed or paralysis.",
	},
	icebody: {
		inherit: true,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('frz', target);
				}
			}
		},
	},
	illuminate: {
		inherit: true,
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('illuminate - enhancing accuracy');
			return this.chainModify([4915, 4096]);
		},
		rating: 2.5,
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.2.",
	},
	illusion: {
		inherit: true,
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.illusion) {
				this.debug('Illusion boost');
				return this.chainModify([5325, 4096]);
			}
		},
		desc: "When this Pokemon switches in, it appears as the last unfainted Pokemon in its party until it takes direct damage from another Pokemon's attack. This Pokemon's actual level and HP are displayed instead of those of the mimicked Pokemon. This Pokemon's moves are given a 1.3x boost when disguised.",
		shortDesc: "Appears as last Pokemon in party until damaged; 1.3x power when disguised.",
	},
	innerfocus: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'surprise') {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', '[of] ' + target);
			}
		},
	},
	ironfist: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([5325, 4096]);
			}
		},
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.3.",
		shortDesc: "This Pokemon's punch-based attacks have 1.3x power.",
	},
	liquidvoice: {
		inherit: true,
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound'] && !attacker.volatiles['dynamax']) {
				return this.chainModify([4915, 4096]);
			}
		},
		desc: "This Pokemon's sound-based moves become Water-type moves and have their power multiplied by 1.2. This effect comes after other effects that change a move's type, but before Ion Deluge and Electrify's effects.",
		shortDesc: "This Pokemon's sound-based moves become Water type and have 1.2x power.",
	},
	mountaineer: {
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
		name: "Mountaineer",
		rating: 3.5,
		gen: 8,
		shortDesc: "This Pokemon is immune to Rock; Avoids Stealth Rock.",
	},
	oblivious: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'surprise') {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Oblivious', '[of] ' + target);
			}
		},
	},
	oraoraoraora: {
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
		shortDesc: "This Pokemon's punch moves hit twice. The second hit has its damage halved.",
	},
	owntempo: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'surprise') {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Own Tempo', '[of] ' + target);
			}
		},
	},
	parasiticwaste: {
		onModifyMove(move) {
			if (!move.secondaries) return;
			for (const secondary of move.secondaries) {
				if ((move.category !== 'Status') && (secondary.status === 'psn' || secondary.status === 'tox')) {
					move.drain = [1, 2];
					move.parasiticWasteBoosted = true;
				}
			}
		},
		onTryHeal(damage, target, source, effect) {
			if (effect?.id === 'drain' && this.activeMove?.parasiticWasteBoosted) {
				this.add('-activate', target, 'ability: Parasitic Waste');
			}
		},
		name: "Parasitic Waste",
		gen: 8,
		rating: 2.5,
		shortDesc: "Attacks that can poison also heal for 50% of the damage dealt.",
	},
	pheonixdown: {
		onBeforeFaint(pokemon, effect) {
			if (this.effectState.pheonixDownActivated) return;
			this.effectState.pheonixDownActivated = true;
			this.add('-activate', pokemon, 'ability: Pheonix Down', pokemon);
			pokemon.hp = this.trunc(pokemon.maxhp / 2);
			pokemon.clearStatus();
			this.add('-sethp', pokemon, pokemon.getHealth, '[silent]');
			pokemon.clearBoosts();
			this.add('-clearboost', pokemon, '[silent]');
			for (const moveSlot of pokemon.moveSlots) {
				moveSlot.pp = moveSlot.maxpp;
			}
			return false;
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Pheonix Down",
		gen: 8,
		rating: 5,
		desc: "Once per battle, this Pokemon restores 1/2 of its maximum HP, rounded down, has its non-volatile status condition cured, and has its stat stages reset to 0 instead of fainting.",
		shortDesc: "Heals to 50% hp and has stats and status reset instead of fainting; Only once per battle.",
	},
	pressure: {
		inherit: true,
		onStart(pokemon) {
			for (const action of this.queue) {
				if (
					action.choice === 'runPrimal' && action.pokemon === pokemon &&
					(pokemon.species.id === 'dialga' || pokemon.species.id === 'eternatus')
				) {
					return;
				}
				if (action.choice !== 'runSwitch' && action.choice !== 'runPrimal') break;
			}
			this.add('-ability', pokemon, 'Pressure');
		},
	},
	primalarmor: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Primal Armor neutralize');
				return this.chainModify(0.5);
			}
		},
		name: "Primal Armor",
		rating: 4,
		gen: 8,
		shortDesc: "This Pokemon receives 1/2 damage from supereffective attacks.",
	},
	quickfeet: {
		inherit: true,
		onModifySpe(spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2);
			}
		},
		rating: 3,
		desc: "If this Pokemon has a non-volatile status condition, its Speed is multiplied by 2; the Speed drop from paralysis is ignored.",
		shortDesc: "If this Pokemon is statused, its Speed is 2x; ignores Speed drop from paralysis.",
	},
	quillrush: {
		onModifyAtk(atk, attacker, defender, move) {
			if (attacker.activeMoveActions > 1) return;
			this.debug('Quill Rush attack boost');
			return this.chainModify([4915, 4096]);
		},
		onModifySpe(spe, pokemon) {
			// probably not > 1 because speed is determined before the move action is run
			if (pokemon.activeMoveActions > 0) return;
			return this.chainModify(1.5);
		},
		name: "Quill Rush",
		rating: 3.5,
		gen: 8,
		desc: "On the first turn this Pokemon is out on the field for, it gets a 1.5x Speed boost and a 1.2x Attack boost.",
		shortDesc: "On first turn out, 1.5x Speed and 1.2x Attack.",
	},
	rivalry: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.25);
				}
			}
		},
		rating: 1,
		desc: "This Pokemon's attacks have their power multiplied by 1.25 against targets of the same gender. There is no modifier if either this Pokemon or the target is genderless, or if they have different genders.",
		shortDesc: "This Pokemon's attacks do 1.25x on same gender targets.",
	},
	reckless: {
		inherit: true,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage || move.selfdestruct === 'always') {
				this.debug('Reckless boost');
				return this.chainModify([4915, 4096]);
			}
		},
	},
	sagepower: {
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
		shortDesc: "This Pokemon's Sp. Atk is 1.5x, but it can only select the first move it executes.",
	},
	schooling: {
		inherit: true,
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.species.id === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
				}
				if (pokemon.species.id === 'wishiwashisevii') {
					pokemon.formeChange('Wishiwashi-Sevii-School');
				}
			} else {
				if (pokemon.species.id === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
				}
				if (pokemon.species.id === 'wishiwashiseviischool') {
					pokemon.formeChange('Wishiwashi-Sevii');
				}
			}
		},
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.species.id === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
				}
				if (pokemon.species.id === 'wishiwashisevii') {
					pokemon.formeChange('Wishiwashi-Sevii-School');
				}
			} else {
				if (pokemon.species.id === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
				}
				if (pokemon.species.id === 'wishiwashiseviischool') {
					pokemon.formeChange('Wishiwashi-Sevii');
				}
			}
		},
	},
	scrappy: {
		inherit: true,
		onTryBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'surprise') {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Scrappy', '[of] ' + target);
			}
		},
	},
	selfsufficient: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		name: "Self Sufficient",
		rating: 3,
		gen: 8,
		shortDesc: "At the end of every turn, this Pokemon restores 1/16 of its max HP.",
	},
	shielddust: {
		inherit: true,
		rating: 3.5,
		desc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack, and is not affected by entry hazards.",
		shortDesc: "This Pokemon is unaffected by entry hazards and secondary effects of moves.",
	},
	solarpower: {
		inherit: true,
		onWeather() {},
		rating: 2.5,
		desc: "If Sunny Day is active, this Pokemon's Special Attack is multiplied by 1.5. If this Pokemon is holding Utility Umbrella, its Special Attack remains the same.",
		shortDesc: "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x.",
	},
	striker: {
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
		desc: "This Pokemon's kick-based attacks have their power multiplied by 1.3.",
		shortDesc: "This Pokemon's kick-based attacks have 1.3x power.",
	},
	surprise: {
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
		desc: "When this Pokemon enters the field, it activates one of the following effects: +1 Attack, +1 Speed, Hail, Intimidate, or Slow Start.",
		shortDesc: "Random effect on switch-in.",
	},
	toxicboost: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'tox' || effect.id === 'psn') {
				return false;
			}
		},
		rating: 3,
		desc: "While this Pokemon is poisoned, the power of its physical attacks is multiplied by 1.5. Immune to poison damage.",
		shortDesc: "When poisoned, physical attacks have 1.5x power; Immune to poison damage.",
	},
	truant: {
		inherit: true,
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
		shortDesc: "This Pokemon can only use healing moves every other turn.",
	},
	watercompaction: {
		inherit: true,
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
		desc: "This Pokemon takes 50% less damage from Water-type moves, and its Defense is raised 2 stages after it is hit by one.",
		shortDesc: "Reduces water damage by 50%; +2 def when hit by water move.",
	},
	zenmode: {
		onStart(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Darmanitan' || pokemon.transformed) {
				return;
			}
			if (!pokemon.species.name.includes('Galar')) {
				if (pokemon.species.id !== 'darmanitanzen') {
					this.add('-activate', pokemon, 'ability: Zen Mode');
					pokemon.formeChange('Darmanitan-Zen', this.effect, true);
				}
			} else {
				if (pokemon.species.id !== 'darmanitangalarzen') {
					this.add('-activate', pokemon, 'ability: Zen Mode');
					pokemon.formeChange('Darmanitan-Galar-Zen', this.effect, true);
				}
			}
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Zen Mode",
		rating: 0,
		num: 161,
		desc: "If this Pokemon is a Darmanitan or Darmanitan-Galar, it changes to Zen Mode on switch-in. This Ability cannot be removed or suppressed.",
		shortDesc: "If Darmanitan, changes to Zen Mode on switch-in.",
	},
};
