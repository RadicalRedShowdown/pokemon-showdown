export const Moves: {[k: string]: ModdedMoveData} = {
	redmist: {
		num: -300,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Red Mist",
		pp: 5,
		priority: 0,
		flags: {snatch: 1, heal: 1, metronome: 1},
		onTry(source) {
			return !!source.m.redMistSouls && source.hp < source.maxhp;
		},
		onHit(pokemon) {
			const souls = pokemon.m.redMistSouls || 0;
			const healAmount = Math.floor(pokemon.maxhp * souls / 5);
			pokemon.m.redMistSouls = 0;
			this.add('-message', `${pokemon.name} siphons through the red mist and receives ${souls} souls.`);
			return !!this.heal(healAmount, pokemon, pokemon);
		},
		secondary: null,
		target: "self",
		type: "Dark",
		desc: "Heals the user by 20% of its maximum HP for each KO it has scored since it last used Red Mist, then resets that count.",
		shortDesc: "Heals 20% per KO scored, then resets the count.",
		gen: 9,
	},
};
