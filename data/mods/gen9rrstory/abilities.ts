export const Abilities: {[k: string]: ModdedAbilityData} = {
	gobeyond: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Go Beyond');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		flags: {breakable: 1},
		name: "Go Beyond",
		rating: 4,
		num: -135,
		desc: "This Pokemon's moves ignore abilities, and this Pokemon ignores other Pokemon's stat changes when taking or dealing damage.",
		shortDesc: "Mold Breaker + Unaware.",
	},
	familialrevenge: {
		onStart(pokemon) {
			if (pokemon.species.id === 'marowakalolaboss') {
				this.add('-start', pokemon, 'Dynamax');
			}
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
			if (['superfang', 'ruination', 'naturesmadness'].includes(move.id)) {
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
		shortDesc: "Bone Zone plus blocks halving moves; cures status at end of turn.",
	},
};
