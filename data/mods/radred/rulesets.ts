export const Rulesets: {[k: string]: FormatData} = {
	standardradred: {
		effectType: 'ValidatorRule',
		name: 'Standard RadRed',
		desc: "The standard ruleset for all Radical Red tiers",
		ruleset: [
			'Obtainable', 'Team Preview', 'Nickname Clause', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause',
			// rr in game mechanics
			'Sleep Clause Mod', 'Evasion Moves Clause', 'OHKO Clause',
		],
	},
};
