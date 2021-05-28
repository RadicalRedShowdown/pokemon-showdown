// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
/*
If you want to add custom formats, create a file in this folder named: "custom-formats.ts"

Paste the following code into the file and add your desired formats and their sections between the brackets:
--------------------------------------------------------------------------------
// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: FormatList = [
];
--------------------------------------------------------------------------------

If you specify a section that already exists, your format will be added to the bottom of that section.
New sections will be added to the bottom of the specified column.
The column value will be ignored for repeat sections.
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Utils} from '../lib';

export const Formats: FormatList = [
	{
		section: "RR Singles",
	},
	{
		name: "[Gen 8] Random Battle",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with sets that are generated to be competitively viable.`,

		mod: 'radred',
		team: 'randomSingles',
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Dynamax Clause'],
	},
	{
		name: "[Gen 8] Free-For-All Random Battle",

		mod: 'radred',
		team: 'random',
		gameType: 'freeforall',
		tournamentShow: false,
		rated: false,
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
	},
	{
		name: "[Gen 8] Multi Random Battle",

		mod: 'radred',
		team: 'random',
		gameType: 'multi',
		searchShow: false,
		tournamentShow: false,
		rated: false,
		ruleset: [
			'Max Team Size = 3',
			'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod',
		],
	},
	{
		name: "[Gen 8] RRDL",
		mod: 'radred',
		searchShow: false,
		ruleset: ['Standard', 'Dynamax Clause', 'Z-Move Clause'],
		banlist: [
			// mons
			'Alakazam-Mega', 'Arceus', 'Blaziken-Mega', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chandelure', 'Deoxys-Attack', 'Deoxys-Base', 'Deoxys-Speed', 'Dialga', 'Dragapult', 'Eternatus', 'Genesect', 'Gengar-Mega', 'Giratina', 'Greninja-Ash', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Latias-Mega', 'Latios-Mega', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Metagross-Mega', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Necrozma-Ultra', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Silvally', 'Solgaleo', 'Tapu Koko', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-Complete',
			// abilities
			'Moody', 'Power Construct', 'Battle Bond',
			// moves
			'Swagger', 'Dark Hole', 'Misty Explosion', 'Explosion', 'Self-Destruct',
			// complex bans
			'Blastoise-Mega + Shell Smash', 'Blaziken + Speed Boost', 'Kangaskhan-Mega + Seismic Toss', 'Greninja + Protean', 'Cinderace + Libero',
		],
	},
	{
		name: "[Gen 8] OU",
		mod: 'radred',
		ruleset: ['Standard', 'Dynamax Clause', 'Z-Move Clause'],
		banlist: ['Uber', 'AG', 'Moody', 'Power Construct', 'Shadow Tag', 'Arena Trap', 'Swagger', 'Misty Explosion'],
	},
	{
		name: "[Gen 8] Ubers",
		mod: 'radred',
		ruleset: ['Standard', 'Dynamax Clause', 'Z-Move Clause', 'Mega Rayquaza Clause'],
		banlist: ['AG', 'Moody'],
	},
	{
		name: "[Gen 8] UU",
		mod: 'radred',
		ruleset: ['[Gen 8] OU'],
		banlist: ['OU', 'UUBL',
			// items
			'Damp Rock',
		],
	},
	{
		name: "[Gen 8] Anything Goes",
		mod: 'radred',
		ruleset: ['Obtainable', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause'],
	},
	{
		name: "[Gen 8] Monotype",
		mod: 'radred',
		ruleset: ['Standard', 'Same Type Clause', 'Dynamax Clause', 'Z-Move Clause'],
		banlist: [
			'AG', 'Uber',
			'Battle Bond', 'Moody', 'Power Construct', 'Shadow Tag',
			'Damp Rock', 'Smooth Rock', 'Terrain Extender',
			'Misty Explosion',
		],
	},
	{
		name: "[Gen 8] Random Pool",
		mod: 'radred',
		ruleset: ['[Gen 8] OU'],
		searchShow: false,
		challengeShow: false,
		onValidateTeam(team, format) {
			const pool = ['Coalossal-Mega', 'Lapras-Mega', 'Garbodor-Mega', 'Sandaconda-Mega', 'Flapple-Mega'];
			let fromPool = 0;
			let stones = 0;
			for (const set of team) {
				const item = this.dex.items.get(set.item);
				const species = item.megaEvolves === set.species ? this.dex.species.get(item.megaStone).name : set.species;
				if (item.megaStone) stones++;
				if (pool.includes(species)) fromPool++;
			}
			if (stones > 1) {
				return [`Nice try guys.`];
			}
			if (fromPool === 0) {
				return [`Your team must have at least one of the following Pok\u00e9mon: ${pool.join(', ')}.`];
			}
		},
	},
	{
		name: "[Gen 8] Custom Game",
		mod: 'radred',
		searchShow: false,
		debug: true,
		battle: {trunc: Math.trunc},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	/* {
		name: "[Gen 8] OTL RRDL",
		mod: 'radred',
		searchShow: false,
		ruleset: ['Standard', 'Dynamax Clause', 'Z-Move Clause'],
		banlist: [
			// mons
			'Alakazam-Mega', 'Arceus', 'Blaziken-Mega', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chandelure', 'Darkrai', 'Deoxys-Attack', 'Deoxys-Base', 'Dialga', 'Eternatus', 'Genesect', 'Gengar-Mega', 'Giratina', 'Greninja-Ash', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Latias-Mega', 'Latios-Mega', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Metagross-Mega', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Necrozma-Ultra', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Silvally', 'Solgaleo', 'Spectrier', 'Tapu Koko', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zekrom', 'Zygarde-Complete',
			// abilities
			'Moody', 'Power Construct', 'Battle Bond',
			// moves
			'Swagger', 'Dark Hole', 'Misty Explosion', 'Explosion', 'Self-Destruct',
			// complex bans
			'Blastoise-Mega + Shell Smash', 'Blaziken + Speed Boost', 'Kangaskhan-Mega + Seismic Toss', 'Greninja + Protean', 'Cinderace + Libero',
		],
	},*/
	{
		section: "RR Doubles",
	},
	{
		name: "[Gen 8] Random Doubles Battle",

		mod: 'radred',
		gameType: 'doubles',
		team: 'random',
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Dynamax Clause'],
	},
	{
		name: "[Gen 8] RRC",
		mod: 'radred',
		gameType: 'doubles',
		ruleset: ['Standard', 'VGC Timer', 'Item Clause', 'Dynamax Clause', 'Z-Move Clause', 'Adjust Level = 50', 'Picked Team Size = 4'],
		banlist: [
			'Mewtwo',
			'Unown', 'Ho-Oh', 'Lugia',
			'Groudon', 'Kyogre', 'Rayquaza', 'Deoxys',
			'Dialga', 'Palkia', 'Heatran', 'Regigigas', 'Giratina', 'Cresselia', 'Darkrai', 'Shaymin', 'Arceus',
			'Kyurem', 'Reshiram', 'Zekrom',
			'Xerneas', 'Yveltal', 'Zygarde',
			'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma', 'Magearna', 'Marshadow',
			'Eternatus', 'Zacian', 'Zamazenta', 'Calyrex',
		],
	},
	{
		name: "[Gen 8] Doubles Custom Game",

		mod: 'radred',
		gameType: 'doubles',
		searchShow: false,
		battle: {trunc: Math.trunc},
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		section: "RR Randomized Metas",
	},
	{
		name: "[Gen 8] Monotype Random Battle",

		mod: 'radred',
		team: 'random',
		ruleset: ['Obtainable', 'Same Type Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Dynamax Clause'],
	},
	{
		name: "[Gen 8] Challenge Cup",

		mod: 'radred',
		team: 'randomCC',
		searchShow: false,
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Dynamax Clause', 'Z-Move Clause'],
	},
	{
		name: "[Gen 8] Challenge Cup 1v1",

		mod: 'radred',
		team: 'randomCC',
		ruleset: ['[Gen 8] Challenge Cup', 'Team Preview', 'Picked Team Size = 1'],
	},
	{
		name: "[Gen 8] Challenge Cup 2v2",

		mod: 'radred',
		team: 'randomCC',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['[Gen 8] Challenge Cup 1v1', '!! Picked Team Size = 2'],
	},
	{
		name: "[Gen 8] Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item.`,

		mod: 'radred',
		team: 'randomHC',
		ruleset: ['Obtainable Formes', 'HP Percentage Mod', 'Cancel Mod', 'Dynamax Clause', 'Z-Move Clause'],
	},
	{
		name: "[Gen 8] Doubles Hackmons Cup",

		mod: 'radred',
		gameType: 'doubles',
		team: 'randomHC',
		searchShow: false,
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod', 'Dynamax Clause', 'Z-Move Clause'],
	},
];
