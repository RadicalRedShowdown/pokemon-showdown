function getRedMistSouls(pokemon: Pokemon) {
	const storedSouls = pokemon.m.redMistSouls || 0;
	const faintedSinceMist = Math.max(
		0, pokemon.side.foe.totalFainted - (pokemon.m.redMistFoeFaintedSpent || 0)
	);
	return Math.min(99, Math.max(storedSouls, faintedSinceMist));
}

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
			return !!getRedMistSouls(source) && source.hp < source.maxhp;
		},
		onHit(pokemon) {
			const souls = getRedMistSouls(pokemon);
			if (!souls) return false;
			const healAmount = Math.floor(pokemon.maxhp * souls / 4);
			pokemon.m.redMistSouls = 0;
			pokemon.m.redMistFoeFaintedSpent = pokemon.side.foe.totalFainted;
			this.add('-message', `${pokemon.name} siphons through the red mist and receives ${souls} ${souls === 1 ? 'soul' : 'souls'}.`);
			return !!this.heal(healAmount, pokemon, pokemon);
		},
		secondary: null,
		target: "self",
		type: "Dark",
		desc: "Heals the user by 25% of its maximum HP for each KO it has scored since it last used Red Mist, then resets that count.",
		shortDesc: "Heals 25% per KO scored, then resets the count.",
		gen: 9,
	},
};
