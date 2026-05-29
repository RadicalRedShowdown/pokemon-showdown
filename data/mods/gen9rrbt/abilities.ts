export const Abilities: {[k: string]: ModdedAbilityData} = {
	familialrevenge: {
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
				this.debug('Familial Revenge bone boost');
				return this.chainModify(2);
			}
		},
		onTryHit(target, source, move) {
			if (['superfang', 'ruination', 'naturesmadness', 'guardianofalola'].includes(move.id)) {
				this.add('-message', 'LMAO we thought of that silly.');
				return null;
			}
		},
		onResidualOrder: 7,
		onResidual(pokemon) {
			if (!pokemon.status) return;
			const statusNames: {[k: string]: string} = {
				brn: 'burned',
				par: 'paralyzed',
				psn: 'poisoned',
				tox: 'poisoned',
				slp: 'asleep',
				frz: 'frozen',
			};
			const statusName = statusNames[pokemon.status] || pokemon.status;
			pokemon.cureStatus();
			this.add('-message', `${pokemon.name} is too angry to be ${statusName}.`);
		},
		name: "Familial Revenge",
		rating: 5,
		gen: 9,
		desc: "Bone moves ignore immunities and deal double damage when resisted. Super Fang, Ruination, and Nature's Madness fail against this Pokemon. At the end of each turn, this Pokemon cures its own status.",
		shortDesc: "Bone moves ignore immunities; resists take 2x. Blocks halving moves; cures status.",
	},
	radicalaura: {
		onStart(pokemon) {
			if (this.suppressingAbility(pokemon)) return;
			if (pokemon.m.radicalAuraAnnounced) return;
			pokemon.m.radicalAuraAnnounced = true;
			if (pokemon.species.id === 'houndoommega' && !pokemon.m.radicalAuraDynamaxVisual) {
				pokemon.m.radicalAuraDynamaxVisual = true;
				this.add('-start', pokemon, 'Dynamax', '[silent]');
			}
			this.add('-ability', pokemon, 'Radical Aura');
			this.add('-message', `${pokemon.name} eminates a redness aura so radical.`);
			this.field.addPseudoWeather('redmist', pokemon, this.effect);
		},
		flags: {},
		name: "Radical Aura",
		rating: 5,
		gen: 9,
		desc: "On switch-in, this Pokemon summons the permanent Red Mist field condition.",
		shortDesc: "Summons permanent Red Mist.",
	},
};
