export const Abilities: {[k: string]: ModdedAbilityData} = {
	familialrevenge: {
		onStart(pokemon) {
			if (pokemon.m.familialRevengeAnnounced) return;
			pokemon.m.familialRevengeAnnounced = true;
			this.add('-ability', pokemon, 'Familial Revenge');
			this.add('-message', `${pokemon.name}'s Familial Revenge burns hotter.`);
			if (pokemon.species.id === 'marowakalola') {
				this.add('-start', pokemon, 'Dynamax', '[silent]');
			}
		},
		onFoeDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id === 'destinybond' || moveSlot.id === 'perishsong') pokemon.disableMove(moveSlot.id);
			}
		},
		onFoeBeforeMovePriority: 100,
		onFoeBeforeMove(attacker, defender, move) {
			if (move.id !== 'destinybond' && move.id !== 'perishsong') return;
			const source = this.effectState.target as Pokemon;
			this.add('cant', attacker, 'ability: Familial Revenge', move);
			this.add('-message', `${source.name}'s Familial Revenge is preventing ${move.name}.`);
			return false;
		},
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
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Familial Revenge",
		rating: 5,
		gen: 9,
		desc: "Bone moves ignore immunities and deal double damage when resisted. Destiny Bond, Perish Song, Super Fang, Ruination, and Nature's Madness fail against this Pokemon. At the end of each turn, this Pokemon cures its own status. This Ability cannot be suppressed.",
		shortDesc: "Bone moves ignore immunities; blocks cheese/status; can't be suppressed.",
	},
	radicalaura: {
		onFoeDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id === 'destinybond' || moveSlot.id === 'perishsong') pokemon.disableMove(moveSlot.id);
			}
		},
		onFoeBeforeMovePriority: 100,
		onFoeBeforeMove(attacker, defender, move) {
			if (move.id !== 'destinybond' && move.id !== 'perishsong') return;
			const source = this.effectState.target as Pokemon;
			this.add('cant', attacker, 'ability: Radical Aura', move);
			this.add('-message', `${source.name}'s Radical Aura is preventing ${move.name}.`);
			return false;
		},
		onStart(pokemon) {
			if (pokemon.m.radicalAuraAnnounced) return;
			pokemon.m.radicalAuraAnnounced = true;
			if (pokemon.species.id === 'houndoommega' && !pokemon.m.radicalAuraDynamaxVisual) {
				pokemon.m.radicalAuraDynamaxVisual = true;
				this.add('-start', pokemon, 'Dynamax', '[silent]');
			}
			this.add('-ability', pokemon, 'Radical Aura');
			this.add('-message', `${pokemon.name} eminates a redness aura so radical.`);
			if (!this.field.getPseudoWeather('redmist')) this.field.addPseudoWeather('redmist', pokemon, this.effect);
		},
		flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1},
		name: "Radical Aura",
		rating: 5,
		gen: 9,
		desc: "On switch-in, this Pokemon summons the permanent Red Mist field condition. Destiny Bond and Perish Song fail while this Pokemon is active. This Ability cannot be suppressed.",
		shortDesc: "Summons Red Mist; blocks Destiny Bond/Perish Song; can't be suppressed.",
	},
};
