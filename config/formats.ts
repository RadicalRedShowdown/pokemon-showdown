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

export const Formats: FormatList = [
	{
		section: "RR Singles",
	},
	{
		name: "[Gen 8] RRDL",
		mod: 'rrdl',
		searchShow: false,
		ruleset: ['Standard RadRed', 'OHKO Clause', 'Evasion Moves Clause', 'Species Clause', 'Sleep Clause Mod', 'Dynamax Clause', 'Z-Move Clause'],
		banlist: [
			// mons
			'Alakazam-Mega', 'Arceus', 'Blaziken-Mega', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chandelure', 'Deoxys-Attack', 'Deoxys-Base', 'Deoxys-Speed', 'Dialga', 'Dragapult', 'Eternatus', 'Genesect', 'Gengar-Mega', 'Giratina', 'Greninja-Ash', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Latias-Mega', 'Latios-Mega', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Metagross-Mega', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Necrozma-Ultra', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Silvally', 'Solgaleo', 'Tapu Koko', 'Xerneas', 'Yveltal', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Zygarde-Complete',
			// abilities
			'Moody', 'Power Construct', 'Battle Bond',
			// moves
			'Swagger', 'Baton Pass', 'Dark Hole', 'Misty Explosion', 'Explosion', 'Self-Destruct',
			// complex bans
			'Darkrai + Dark Hole', 'Blastoise-Mega + Shell Smash', 'Blaziken + Speed Boost', 'Kangaskhan-Mega + Seismic Toss', 'Greninja + Protean', 'Cinderace + Libero',
		],
	},
	{
		name: "[Gen 8] OU",
		mod: 'radred',
		ruleset: ['Standard RadRed', 'OHKO Clause', 'Evasion Moves Clause', 'Species Clause', 'Sleep Clause Mod', 'Dynamax Clause', 'Z-Move Clause'],
		banlist: ['Uber', 'AG', 'Moody', 'Power Construct', 'Shadow Tag', 'Arena Trap', 'Swagger', 'Baton Pass', 'Dark Hole', 'Misty Explosion'],
	},
	{
		name: "[Gen 8] Ubers",
		mod: 'radred',
		ruleset: ['Standard RadRed', 'OHKO Clause', 'Evasion Moves Clause', 'Species Clause', 'Sleep Clause Mod', 'Dynamax Clause', 'Z-Move Clause', 'Mega Rayquaza Clause'],
		banlist: ['AG', 'Baton Pass', 'Dark Hole', 'Moody'],
	},
	{
		name: "[Gen 8] UU",
		mod: 'radred',
		ruleset: ['[Gen 8] OU'],
		banlist: ['OU'],
	},
	{
		name: "[Gen 8] Anything Goes",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672423/">National Dex AG</a>`,
		],
		mod: 'radred',
		ruleset: ['Standard RadRed'],
	},
	{
		name: "[Gen 8] Monotype",
		mod: 'radred',
		ruleset: ['Standard RadRed', 'Same Type Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Species Clause', 'Sleep Clause Mod', 'Dynamax Clause', 'Z-Move Clause'],
		banlist: [
			'AG', 'Uber',
			'Battle Bond', 'Moody', 'Power Construct', 'Shadow Tag', 'Damp Rock', 'Smooth Rock', 'Terrain Extender', 'Baton Pass',
			'Misty Explosion',
		],
	},
	{
		name: "[Gen 8] Custom Game",
		mod: 'radred',
		searchShow: false,
		debug: true,
		maxLevel: 9999,
		battle: {trunc: Math.trunc},
		defaultLevel: 100,
		teamLength: {
			validate: [1, 24],
			battle: 24,
		},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},
	{
		section: "RR Doubles",
	},
	{
		name: "[Gen 8] RRC",
		mod: 'radred',
		gameType: 'doubles',
		ruleset: ['Standard RadRed', 'VGC Timer', 'Item Clause', 'Species Clause', 'Dynamax Clause', 'Z-Move Clause'],
		banlist: [
			'Arceus', 'Cosmoem', 'Cosmog', 'Calyrex', 'Cresselia', 'Darkrai', 'Deoxys', 'Dialga', 'Eternatus', 'Giratina', 'Groudon', 'Heatran', 'Ho-Oh', 'Kyogre', 'Kyurem', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Regigigas', 'Mewtwo', 'Necrozma', 'Palkia', 'Rayquaza', 'Reshiram', 'Shaymin', 'Solgaleo', 'Unown', 'Xerneas', 'Yveltal', 'Zacian', 'Zamazenta', 'Zekrom', 'Zygarde',
		],
		forcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
	},
	{
		name: "[Gen 8] Doubles Custom Game",

		mod: 'radred',
		gameType: 'doubles',
		searchShow: false,
		maxLevel: 9999,
		battle: {trunc: Math.trunc},
		defaultLevel: 100,
		debug: true,
		teamLength: {
			validate: [2, 24],
			battle: 24,
		},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},
];
