export const Scripts: ModdedBattleScriptsData = {
	inherit: 'gen9rr',
	field: {
		removePseudoWeather(status) {
			status = this.battle.dex.conditions.get(status);
			if (status.id === 'redmist') return false;
			const state = this.pseudoWeather[status.id];
			if (!state) return false;
			this.battle.singleEvent('FieldEnd', status, state, this);
			delete this.pseudoWeather[status.id];
			return true;
		},
	},
};
