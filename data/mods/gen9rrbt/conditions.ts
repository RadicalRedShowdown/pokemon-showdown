function isRedMistHoundoom(pokemon: Pokemon | null | undefined, source: Pokemon | null | undefined) {
	return !!pokemon && pokemon === source && !pokemon.fainted && pokemon.species.id === 'houndoommega';
}

export const Conditions: {[k: string]: ModdedConditionData} = {
	redmist: {
		name: "Red Mist",
		onFieldStart(field, source, effect) {
			this.effectState.souls = 0;
			this.add('-fieldstart', 'move: Red Mist', '[from] ability: ' + (effect?.name || 'Radical Aura'), '[of] ' + source);
			this.add('-message', 'The red mist spreads across the battlefield.');
		},
		onFaint(pokemon) {
			const source = this.effectState.source as Pokemon | undefined;
			if (pokemon === source) return;
			this.effectState.souls = Math.min(99, (this.effectState.souls || 0) + 1);
			this.add('-message', 'The red mist claims another soul.');
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (!isRedMistHoundoom(pokemon, this.effectState.source)) return;
			if (['sunnyday', 'desolateland'].includes(this.field.weather)) {
				return this.chainModify(1.5);
			}
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (!isRedMistHoundoom(source, this.effectState.source)) return;
			if (target === source || move.category === 'Status' || move.type !== 'Dark') return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		onTryHit(target, source, move) {
			if (!isRedMistHoundoom(target, this.effectState.source)) return;
			if (['endeavor', 'superfang', 'ruination', 'naturesmadness', 'guardianofalola'].includes(move.id)) {
				this.add('-message', `The red mist is preventing ${move.name}.`);
				return null;
			}
		},
		onAnyTryMove(pokemon, target, move) {
			const source = this.effectState.source as Pokemon | undefined;
			if (!isRedMistHoundoom(source, source) || !source.isActive) return;
			if (!['destinybond', 'perishsong'].includes(move.id)) return;
			this.attrLastMove('[still]');
			this.add('-message', `The red mist is preventing ${move.name}.`);
			return false;
		},
		onSetStatus(status, target, source, effect) {
			if (!isRedMistHoundoom(target, this.effectState.source)) return;
			const statusNames: {[k: string]: string} = {
				brn: 'burn',
				par: 'paralysis',
				psn: 'poison',
				tox: 'poison',
				slp: 'sleep',
				frz: 'freeze',
			};
			this.add('-message', `The red mist is preventing ${statusNames[status.id] || status.name}.`);
			return false;
		},
		onTryBoost(boost, target, source, effect) {
			if (!isRedMistHoundoom(target, this.effectState.source)) return;
			if (source && target === source) return;
			let blocked = false;
			let stat: BoostID;
			for (stat in boost) {
				if (boost[stat]! < 0) {
					delete boost[stat];
					blocked = true;
				}
			}
			if (blocked) this.add('-message', 'The red mist is preventing stat drops.');
		},
		onFieldResidualOrder: 29,
		onFieldResidual() {
			const pokemon = this.effectState.source as Pokemon | undefined;
			const souls = this.effectState.souls || 0;
			if (!pokemon || !souls || !isRedMistHoundoom(pokemon, this.effectState.source) || !pokemon.isActive) return;
			if (pokemon.hp > pokemon.maxhp / 4) return;
			const healAmount = Math.floor(pokemon.maxhp * souls / 5);
			this.effectState.souls = 0;
			this.add('-message', `${pokemon.name} siphons through the red mist and consumes ${souls} ${souls === 1 ? 'soul' : 'souls'}.`);
			this.heal(healAmount, pokemon, pokemon);
		},
	},
};
