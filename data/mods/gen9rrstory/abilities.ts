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
			this.add('-ability', pokemon, 'Radical Aura');
			this.add('-message', `${pokemon.name} eminates a redness aura so radical.`);
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Dark') return;
			if (!move.auraBooster?.hasAbility('Radical Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		onTryHit(target, source, move) {
			if (['endeavor', 'superfang', 'ruination', 'naturesmadness', 'guardianofalola'].includes(move.id)) {
				this.add('-message', `${target.name}'s radical aura is preventing ${move.name}.`);
				return null;
			}
		},
		onSetStatus(status, target, source, effect) {
			const statusNames: {[k: string]: string} = {
				brn: 'burn',
				par: 'paralysis',
				psn: 'poison',
				tox: 'poison',
				slp: 'sleep',
				frz: 'freeze',
			};
			this.add('-message', `${target.name}'s radical aura is preventing ${statusNames[status.id] || status.name}.`);
			return false;
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect?.effectType !== 'Move') return;
			source.m.redMistSouls = Math.min(99, (source.m.redMistSouls || 0) + length);
		},
		flags: {},
		name: "Radical Aura",
		rating: 5,
		gen: 9,
		desc: "This Pokemon has Solar Power and Dark Aura. It is immune to status and HP-halving moves, and tracks KOs for Red Mist.",
		shortDesc: "Solar Power + Dark Aura; immune to status/halving moves. Tracks KOs for Red Mist.",
	},
};
