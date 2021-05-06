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

import {Utils} from '../lib';

export const Formats: FormatList = [
	{
		section: "RR Singles",
	},
	{
		name: "[Gen 8] RRDL",
		mod: 'radred',
		searchShow: false,
		ruleset: ['Standard RadRed', 'Dynamax Clause', 'Z-Move Clause'],
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
		ruleset: ['Standard RadRed', 'Species Clause', 'Dynamax Clause', 'Z-Move Clause'],
		banlist: ['Uber', 'AG', 'Moody', 'Power Construct', 'Shadow Tag', 'Arena Trap', 'Swagger', 'Baton Pass', 'Dark Hole', 'Misty Explosion'],
	},
	{
		name: "[Gen 8] Ubers",
		mod: 'radred',
		ruleset: ['Standard RadRed', 'Species Clause', 'Dynamax Clause', 'Z-Move Clause', 'Mega Rayquaza Clause'],
		banlist: ['AG', 'Baton Pass', 'Moody'],
	},
	{
		name: "[Gen 8] UU",
		mod: 'radred',
		ruleset: ['[Gen 8] OU'],
		banlist: ['OU'],
	},
	{
		name: "[Gen 8] Anything Goes",
		mod: 'radred',
		ruleset: ['Standard RadRed'],
	},
	{
		name: "[Gen 8] Monotype",
		mod: 'radred',
		ruleset: ['Standard RadRed', 'Same Type Clause', 'Species Clause', 'Dynamax Clause', 'Z-Move Clause'],
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
		battle: {trunc: Math.trunc},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	{
		section: "RR Doubles",
	},
	{
		name: "[Gen 8] RRC",
		mod: 'radred',
		gameType: 'doubles',
		ruleset: ['Standard RadRed', 'Adjust Level = 50', 'Picked Team Size = 4', 'VGC Timer', 'Item Clause', 'Species Clause', 'Dynamax Clause', 'Z-Move Clause'],
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
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
];
