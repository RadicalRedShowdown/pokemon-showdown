export const Abilities: {[k: string]: ModdedAbilityData} = {
	badcompany: {
		shortDesc: "Prevents self-lowering stat drops and recoil.",
		onModifyMove(move) {
			move.mindBlownRecoil = false;
		},
		onBoost(boost, target, source, effect) {
			if (source && target !== source) return;
			let i: BoostName;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
				}
			}
		},
		name: "Bad Company",
		num: 301,
		rating: 4,
	},
	blademaster: {
		shortDesc: "Boosts Cutting moves by 20% and +1 crit chance",
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
		num: 271,
	},
	blazingsoul: {
		shortDesc: "If this Pokemon is at full HP, its Fire-type moves have their priority increased by 1.",
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Fire' && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		name: "Blazing Soul",
		rating: 3,
		num: 272,
	},
	bonezone: {
		shortDesc: "Bone moves ignore immunities and deal double damage on not very effective.",
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (move.flags['bone']) {
				if (!move.ignoreImmunity) move.ignoreImmunity = {};
				if (move.ignoreImmunity !== true) {
					move.ignoreImmunity['Ground'] = true;
					move.ignoreImmunity['Ghost'] = true;
				}
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (move.flags['bone'] && (target.getMoveHitData(move).typeMod < 0)) {
				this.debug('Welcome to the Bone Zone');
				return this.chainModify(2);
			}
		},
		name: "Bone Zone",
		rating: 3,
		num: 290,
	},
	bullrush: {
		shortDesc: "The first move this Pokemon's uses gets a 1.5x damage boost.",
		onModifyDamage(damage, source, target, move) {
			if (source.activeMoveActions > 1) {
				return;
			} else {
				return this.chainModify(1.5);
			}
		},
		name: "Bull Rush",
		rating: 2,
		num: 273,
	},
	corrosion: {
		inherit: true,
		shortDesc: "This Pokemon can use poison type moves on other Pokemon regardless of their typing.",
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
		onModifyDamage(damage, source, target, move) {
			if (target && this.dex.getEffectiveness(move, target.types) > 0) {
				return this.chainModify([4915, 4096]);
			}
		},
		onModifyMove(move, pokemon, target) {
			if (target && this.dex.getEffectiveness(move, target.types) > 0) {
				move.accuracy = true;
			}
		},
		name: "Fatal Precision",
		rating: 4,
		num: 269,
	},
	felinepower: {
		shortDesc: "This Pokemon's Sp. Atk is doubled.",
		onModifySpAPriority: 5,
		onModifySpA(atk) {
			return this.chainModify(2);
		},
		name: "Feline Power",
		rating: 5,
		num: 277,
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
			if (this.effectData.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onModifySpe(spe, pokemon) {
			if (this.effectData.target.baseSpecies.baseSpecies !== 'Cherrim') return;
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
		shortDesc: "This Pokemon appears as the last Pokemon in the party until it takes direct damage; 1.3x damage to moves when disguised.",
		onModifyDamage(damage, pokemon) {
			if (pokemon.illusion) {
				return this.chainModify([5328, 4096]);
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
				return this.chainModify([5328, 4096]);
			}
		},
	},
	moldbreaker: {
		inherit: true,
		desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dazzling, Disguise, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Mountaineer, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Primal Armor, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
	},
	mountaineer: {
		shortDesc: "This Pokemon is immune to Rock; Avoids Stealth Rock.",
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(pokemon, target, move) {
			if (target !== pokemon && move.type === 'Rock') {
				this.add('-immune', pokemon, '[from] ability: Mountaineer');
				return null;
			}
		},
		name: "Mountaineer",
		rating: 3,
		num: 270,
	},
	mummy: {
		inherit: true,
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihitType === 'parentalbond' && move.hit > 1) return this.chainModify(0.25);
			if (move.multihitType === 'oraoraoraora' && move.hit > 1) return this.chainModify(0.5);
		},
	},
	oraoraoraora: {
		shortDesc: "This Pokemon's punch moves hit twice. The second hit has its damage halved.",
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.selfdestruct || move.multihit) return;
			if (move.flags['punch'] && !move.spreadHit && !move.isZ && !move.isMax) {
				move.multihit = 2;
				move.multihitType = 'oraoraoraora';
			}
		},
		onBasePowerPriority: 7,
		onBasePower(basePower, pokemon, target, move) {
			if (move.multihitType === 'oraoraoraora' && move.hit > 1) return this.chainModify(0.5);
		},
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'oraoraoraora' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		name: "ORAORAORAORA",
		rating: 5,
		num: 280,
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
		num: 300,
		rating: 2.5,
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
		num: 275,
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
			pokemon.abilityData.choiceLock = "";
		},
		onBeforeMove(pokemon, target, move) {
			if (move.isZOrMaxPowered || move.id === 'struggle') return;
			if (pokemon.abilityData.choiceLock && pokemon.abilityData.choiceLock !== move.id) {
				// Fails unless ability is being ignored (these events will not run), no PP lost.
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Sage Power");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.abilityData.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') return;
			pokemon.abilityData.choiceLock = move.id;
		},
		onModifySpAPriority: 1,
		onModifySpA(atk, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			// PLACEHOLDER
			this.debug('Sage Power SpA Boost');
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.abilityData.choiceLock) return;
			if (pokemon.volatiles['dynamax']) return;
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== pokemon.abilityData.choiceLock) {
					pokemon.disableMove(moveSlot.id, false, this.effectData.sourceEffect);
				}
			}
		},
		onEnd(pokemon) {
			pokemon.abilityData.choiceLock = "";
		},
		name: "Sage Power",
		rating: 4.5,
		num: 278,
	},
	selfsufficient: {
		shortDesc: "At the end of every turn, this Pokemon restores 1/16 of its max HP.",
		onResidualPriority: -1,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		name: "Self Sufficient",
		rating: 2.5,
		num: 273,
	},
	shielddust: {
		inherit: true,
		desc: "This Pokemon is not affected by the secondary effect of another Pokemon's attack, and is not affected by entry hazards.",
		shortDesc: "This Pokemon is unaffected by entry hazards and secondary effects of moves.",
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
				return this.chainModify([5328, 4096]);
			}
		},
		name: "Striker",
		rating: 3,
		num: 268,
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
				this.add('-ability', pokemon, 'Surprise!');
				pokemon.setAbility("Intimidate");
				break;
			case 4:
				this.add('-ability', pokemon, 'Surprise!');
				pokemon.setAbility("Slow Start");
				break;
			}
		},
		name: "Surprise!",
		rating: 2,
		num: 291,
	},
	teravolt: {
		inherit: true,
		desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dazzling, Disguise, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Mountaineer, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Primal Armor, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
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
	turboblaze: {
		inherit: true,
		desc: "This Pokemon's moves and their effects ignore certain Abilities of other Pokemon. The Abilities that can be negated are Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dazzling, Disguise, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Mountaineer, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Primal Armor, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard, and Wonder Skin. This affects every other Pokemon on the field, whether or not it is a target of this Pokemon's move, and whether or not their Ability is beneficial to this Pokemon.",
	},
	watercompaction: {
		inherit: true,
		desc: "This Pokemon's Defense is raised 2 stages after it is damaged by a Water-type move; Reduces water damage by 50%.",
		shortDesc: "Raises defense by 2 stages when damaged by water-type move; Reduces water damage by 50%.",
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(0.5);
			}
		},
	},
};
