export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	bulbasaur: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Effect Spore", H: "Chlorophyll"},
	},
	ivysaur: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Effect Spore", H: "Chlorophyll"},
	},
	venusaur: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Thick Fat", H: "Chlorophyll"},
	},
	charmander: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Flame Body", H: "Solar Power"},
	},
	charmeleon: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Flame Body", H: "Solar Power"},
	},
	charizard: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Tough Claws", H: "Solar Power"},
	},
	squirtle: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Overcoat", H: "Rain Dish"},
	},
	wartortle: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Overcoat", H: "Rain Dish"},
	},
	blastoise: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Mega Launcher", H: "Rain Dish"},
	},
	butterfree: {
		inherit: true,
		baseStats: {hp: 60, atk: 45, def: 50, spa: 100, spd: 80, spe: 90},
		otherFormes: ["Butterfree-Mega"],
		formeOrder: ["Butterfree", "Butterfree-Mega"],
	},
	butterfreemega: {
		num: 12,
		name: "Butterfree-Mega",
		baseSpecies: "Butterfree",
		forme: "Mega",
		types: ["Bug", "Flying"],
		baseStats: {hp: 60, atk: 15, def: 60, spa: 160, spd: 120, spe: 110},
		abilities: {0: "Compound Eyes"},
		heightm: 17,
		weightkg: 32,
		color: "White",
		eggGroups: ["Bug"],
		requiredItem: "Butterfrenite",
		gen: 8,
	},
	beedrill: {
		inherit: true,
		baseStats: {hp: 65, atk: 100, def: 40, spa: 45, spd: 80, spe: 90},
		abilities: {0: "Swarm", 1: "Merciless", H: "Sniper"},
	},
	beedrillmega: {
		inherit: true,
		baseStats: {hp: 65, atk: 150, def: 60, spa: 15, spd: 90, spe: 145},
	},
	pidgey: {
		inherit: true,
		baseStats: {hp: 40, atk: 36, def: 40, spa: 45, spd: 35, spe: 56},
		abilities: {0: "No Guard", 1: "Tangled Feet", H: "Big Pecks"},
	},
	pidgeotto: {
		inherit: true,
		baseStats: {hp: 63, atk: 50, def: 55, spa: 60, spd: 50, spe: 71},
		abilities: {0: "No Guard", 1: "Tangled Feet", H: "Big Pecks"},
	},
	pidgeot: {
		inherit: true,
		baseStats: {hp: 83, atk: 70, def: 75, spa: 95, spd: 70, spe: 101},
		abilities: {0: "No Guard", 1: "Tangled Feet", H: "Big Pecks"},
	},
	pidgeotmega: {
		inherit: true,
		baseStats: {hp: 83, atk: 80, def: 95, spa: 135, spd: 80, spe: 121},
	},
	raticate: {
		inherit: true,
		baseStats: {hp: 55, atk: 101, def: 60, spa: 50, spd: 70, spe: 102},
		abilities: {0: "Strong Jaw", 1: "Guts", H: "Hustle"},
	},
	raticatealola: {
		inherit: true,
		baseStats: {hp: 75, atk: 86, def: 80, spa: 40, spd: 80, spe: 77},
		abilities: {0: "Gluttony", 1: "Strong Jaw", H: "Hustle"},
	},
	fearow: {
		inherit: true,
		baseStats: {hp: 65, atk: 110, def: 75, spa: 61, spd: 71, spe: 100},
		abilities: {0: "Intimidate", 1: "Keen Eye", H: "Sniper"},
	},
	arbok: {
		inherit: true,
		types: ["Poison", "Dark"],
		baseStats: {hp: 80, atk: 105, def: 79, spa: 65, spd: 79, spe: 80},
	},
	raichu: {
		inherit: true,
		baseStats: {hp: 60, atk: 90, def: 55, spa: 90, spd: 80, spe: 115},
	},
	raichualola: {
		inherit: true,
		baseStats: {hp: 65, atk: 110, def: 75, spa: 61, spd: 71, spe: 100},
		evoType: "useItem",
		evoItem: "Sun Stone",
	},
	sandslash: {
		inherit: true,
		baseStats: {hp: 95, atk: 110, def: 110, spa: 45, spd: 55, spe: 65},
	},
	sandslashalola: {
		inherit: true,
		baseStats: {hp: 95, atk: 110, def: 120, spa: 25, spd: 65, spe: 65},
	},
	ninetales: {
		inherit: true,
		types: ["Fire", "Fairy"],
		baseStats: {hp: 73, atk: 76, def: 75, spa: 91, spd: 100, spe: 100},
		abilities: {0: "Flash Fire", 1: "Pyromancy", H: "Drought"},
	},
	ninetalesalola: {
		inherit: true,
		baseStats: {hp: 73, atk: 67, def: 75, spa: 91, spd: 100, spe: 109},
	},
	jigglypuff: {
		inherit: true,
		baseStats: {hp: 105, atk: 45, def: 20, spa: 65, spd: 35, spe: 20},
		abilities: {0: "Fur Coat", 1: "Competitive", H: "Friend Guard"},
	},
	wigglytuff: {
		inherit: true,
		baseStats: {hp: 120, atk: 70, def: 45, spa: 105, spd: 65, spe: 45},
		abilities: {0: "Fur Coat", 1: "Competitive", H: "Frisk"},
	},
	vileplume: {
		inherit: true,
		baseStats: {hp: 85, atk: 60, def: 95, spa: 120, spd: 100, spe: 50},
	},
	parasect: {
		inherit: true,
		baseStats: {hp: 80, atk: 115, def: 95, spa: 60, spd: 95, spe: 30},
	},
	venomoth: {
		inherit: true,
		baseStats: {hp: 70, atk: 65, def: 60, spa: 100, spd: 75, spe: 100},
	},
	persian: {
		inherit: true,
		baseStats: {hp: 65, atk: 70, def: 60, spa: 105, spd: 65, spe: 115},
		abilities: {0: "Super Luck", 1: "Technician", H: "Sniper"},
	},
	persianalola: {
		inherit: true,
		baseStats: {hp: 65, atk: 60, def: 70, spa: 105, spd: 65, spe: 115},
	},
	golduck: {
		inherit: true,
		types: ["Water", "Psychic"],
		baseStats: {hp: 80, atk: 102, def: 78, spa: 105, spd: 80, spe: 85},
		abilities: {0: "Tough Claws", 1: "Cloud Nine", H: "Swift Swim"},
	},
	primeape: {
		inherit: true,
		baseStats: {hp: 65, atk: 115, def: 60, spa: 60, spd: 70, spe: 115},
	},
	poliwrath: {
		inherit: true,
		baseStats: {hp: 90, atk: 115, def: 95, spa: 70, spd: 90, spe: 70},
	},
	alakazam: {
		inherit: true,
		evoType: "levelFriendship",
	},
	machamp: {
		inherit: true,
		evoType: "levelFriendship",
		otherFormes: ["Machamp-Mega"],
		formeOrder: ["Machamp", "Machamp-Mega"],
	},
	machampmega: {
		num: 68,
		name: "Machamp-Mega",
		baseSpecies: "Machamp",
		forme: "Mega",
		types: ["Fighting"],
		genderRatio: {M: 0.75, F: 0.25},
		baseStats: {hp: 90, atk: 170, def: 100, spa: 65, spd: 105, spe: 75},
		abilities: {0: "Power Fists"},
		heightm: 25,
		weightkg: 130,
		color: "Gray",
		eggGroups: ["Human-Like"],
		requiredItem: "Machampite",
		gen: 8,
	},
	golem: {
		inherit: true,
		baseStats: {hp: 90, atk: 135, def: 130, spa: 55, spd: 65, spe: 40},
		evoType: "levelFriendship",
	},
	golemalola: {
		inherit: true,
		baseStats: {hp: 90, atk: 135, def: 130, spa: 55, spd: 65, spe: 40},
		evoType: "levelFriendship",
	},
	ponyta: {
		inherit: true,
		abilities: {0: "Reckless", 1: "Flash Fire", H: "Flame Body"},
	},
	rapidash: {
		inherit: true,
		baseStats: {hp: 85, atk: 110, def: 70, spa: 80, spd: 80, spe: 105},
		abilities: {0: "Reckless", 1: "Flash Fire", H: "Flame Body"},
	},
	farfetchd: {
		inherit: true,
		types: ["Fighting", "Flying"],
		baseStats: {hp: 52, atk: 90, def: 55, spa: 58, spd: 62, spe: 100},
		abilities: {0: "Super Luck", 1: "Inner Focus", H: "Defiant"},
	},
	dodrio: {
		inherit: true,
		baseStats: {hp: 80, atk: 110, def: 70, spa: 60, spd: 60, spe: 110},
		abilities: {0: "Moxie", 1: "Early Bird", H: "Tangled Feet"},
	},
	seel: {
		inherit: true,
		abilities: {0: "Fur Coat", 1: "Hydration", H: "Ice Body"},
	},
	dewgong: {
		inherit: true,
		baseStats: {hp: 90, atk: 90, def: 60, spa: 95, spd: 95, spe: 90},
		abilities: {0: "Fur Coat", 1: "Hydration", H: "Ice Body"},
	},
	gastly: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Cursed Body", H: "Cursed Body"},
	},
	haunter: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Cursed Body", H: "Cursed Body"},
	},
	gengar: {
		inherit: true,
		abilities: {0: "Levitate", 1: "Cursed Body", H: "Cursed Body"},
		evoType: "levelFriendship",
	},
	muk: {
		inherit: true,
		baseStats: {hp: 105, atk: 125, def: 75, spa: 65, spd: 100, spe: 50},
		abilities: {0: "Gooey", 1: "Sticky Hold", H: "Poison Touch"},
	},
	mukalola: {
		inherit: true,
		baseStats: {hp: 105, atk: 115, def: 85, spa: 65, spd: 100, spe: 50},
		abilities: {0: "Gooey", 1: "Sticky Hold", H: "Poison Touch"},
	},
	hypno: {
		inherit: true,
		baseStats: {hp: 95, atk: 73, def: 70, spa: 115, spd: 115, spe: 67},
	},
	kingler: {
		inherit: true,
		baseStats: {hp: 80, atk: 130, def: 115, spa: 50, spd: 50, spe: 75},
		otherFormes: ["Kingler-Mega"],
		formeOrder: ["Kingler", "Kingler-Mega"],
	},
	kinglermega: {
		num: 99,
		name: "Kingler-Mega",
		baseSpecies: "Kingler",
		forme: "Mega",
		types: ["Water"],
		baseStats: {hp: 80, atk: 170, def: 135, spa: 50, spd: 80, spe: 85},
		abilities: {0: "Tough Claws"},
		heightm: 19,
		weightkg: 60,
		color: "Red",
		eggGroups: ["Water 3"],
		requiredItem: "Kinglerite",
		gen: 8,
	},
	electrode: {
		inherit: true,
		abilities: {0: "Soundproof", 1: "Static", H: "Electric Surge"},
	},
	exeggcute: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Chloroplast", H: "Harvest"},
	},
	exeggutor: {
		inherit: true,
		abilities: {0: "Chlorophyll", 1: "Chloroplast", H: "Harvest"},
	},
	exeggutoralola: {
		inherit: true,
		abilities: {0: "Frisk", 1: "Chloroplast", H: "Harvest"},
		evoType: "useItem",
		evoItem: "Sun Stone",
	},
	marowak: {
		inherit: true,
		baseStats: {hp: 75, atk: 80, def: 110, spa: 50, spd: 80, spe: 45},
	},
	marowakalola: {
		inherit: true,
		baseStats: {hp: 75, atk: 80, def: 110, spa: 50, spd: 80, spe: 45},
		evoType: "useItem",
		evoItem: "Dusk Stone",
	},
	hitmonlee: {
		inherit: true,
		baseStats: {hp: 80, atk: 120, def: 53, spa: 35, spd: 110, spe: 87},
	},
	hitmonchan: {
		inherit: true,
		baseStats: {hp: 105, atk: 115, def: 85, spa: 65, spd: 100, spe: 50},
		abilities: {0: "Keen Eye", 1: "Iron Fist", H: "Blitz Boxer"},
	},
	weezing: {
		inherit: true,
		baseStats: {hp: 65, atk: 90, def: 120, spa: 95, spd: 70, spe: 60},
	},
	seaking: {
		inherit: true,
		baseStats: {hp: 80, atk: 112, def: 65, spa: 65, spd: 100, spe: 98},
	},
	mrmime: {
		inherit: true,
		baseStats: {hp: 40, atk: 45, def: 65, spa: 120, spd: 120, spe: 90},
	},
	jynx: {
		inherit: true,
		baseStats: {hp: 65, atk: 50, def: 35, spa: 115, spd: 95, spe: 115},
	},
	tauros: {
		inherit: true,
		baseStats: {hp: 75, atk: 120, def: 95, spa: 40, spd: 70, spe: 110},
		abilities: {0: "Intimidate", 1: "Rampage", H: "Sheer Force"},
	},
	gyarados: {
		inherit: true,
		abilities: {0: "Intimidate", 1: "Rampage", H: "Moxie"},
	},
	lapras: {
		inherit: true,
		baseStats: {hp: 130, atk: 85, def: 80, spa: 95, spd: 95, spe: 60},
		otherFormes: ["Lapras-Mega"],
		formeOrder: ["Lapras", "Lapras-Mega"],
	},
	laprasmega: {
		num: 131,
		name: "Lapras-Mega",
		baseSpecies: "Lapras",
		forme: "Mega",
		types: ["Water", "Ice"],
		baseStats: {hp: 130, atk: 105, def: 110, spa: 125, spd: 125, spe: 50},
		abilities: {0: "Ice Body"},
		heightm: 24,
		weightkg: 220,
		color: "Blue",
		eggGroups: ["Monster", "Water 1"],
		requiredItem: "Laprasite",
		gen: 8,
	},
	flareon: {
		inherit: true,
		baseStats: {hp: 95, atk: 135, def: 60, spa: 65, spd: 65, spe: 110},
	},
	kabutops: {
		inherit: true,
		abilities: {0: "Swift Swim", 1: "Keen Edge", H: "Weak Armor"},
	},
	articuno: {
		inherit: true,
		baseStats: {hp: 90, atk: 85, def: 100, spa: 125, spd: 95, spe: 85},
	},
	chikorita: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Flower Veil", H: "Triage"},
	},
	bayleef: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Flower Veil", H: "Triage"},
	},
	meganium: {
		inherit: true,
		types: ["Grass", "Fairy"],
		baseStats: {hp: 80, atk: 82, def: 100, spa: 92, spd: 100, spe: 80},
		abilities: {0: "Overgrow", 1: "Flower Veil", H: "Triage"},
	},
	cyndaquil: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Sand Rush", H: "Flash Fire"},
	},
	quilava: {
		inherit: true,
		types: ["Fire", "Ground"],
		abilities: {0: "Blaze", 1: "Sand Rush", H: "Flash Fire"},
	},
	typhlosion: {
		inherit: true,
		types: ["Fire", "Ground"],
		abilities: {0: "Blaze", 1: "Sand Rush", H: "Rampage"},
	},
	totodile: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Strong Jaw", H: "Sheer Force"},
		evoLevel: 16,
	},
	croconaw: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Strong Jaw", H: "Sheer Force"},
	},
	feraligatr: {
		inherit: true,
		types: ["Water", "Dark"],
		baseStats: {hp: 85, atk: 105, def: 100, spa: 69, spd: 83, spe: 88},
		abilities: {0: "Torrent", 1: "Strong Jaw", H: "Sheer Force"},
	},
	sentret: {
		inherit: true,
		abilities: {0: "Fur Coat", 1: "Keen Eye", H: "Frisk"},
	},
	furret: {
		inherit: true,
		baseStats: {hp: 85, atk: 76, def: 64, spa: 45, spd: 75, spe: 110},
		abilities: {0: "Fur Coat", 1: "Keen Eye", H: "Frisk"},
	},
	noctowl: {
		inherit: true,
		baseStats: {hp: 100, atk: 50, def: 70, spa: 96, spd: 96, spe: 70},
	},
	ledyba: {
		inherit: true,
		baseStats: {hp: 40, atk: 40, def: 30, spa: 20, spd: 80, spe: 55},
		abilities: {0: "Aerilate", 1: "Early Bird", H: "Rattled"},
	},
	ledian: {
		inherit: true,
		baseStats: {hp: 55, atk: 95, def: 50, spa: 35, spd: 110, spe: 105},
		abilities: {0: "Fur Coat", 1: "Keen Eye", H: "Iron Fist"},
	},
	spinarak: {
		inherit: true,
		abilities: {0: "Merciless", 1: "Insomnia", H: "Sniper"},
	},
	ariados: {
		inherit: true,
		baseStats: {hp: 80, atk: 110, def: 80, spa: 60, spd: 80, spe: 40},
		abilities: {0: "Merciless", 1: "Insomnia", H: "Sniper"},
	},
	lanturn: {
		inherit: true,
		baseStats: {hp: 125, atk: 58, def: 58, spa: 86, spd: 86, spe: 67},
	},
	xatu: {
		inherit: true,
		baseStats: {hp: 65, atk: 75, def: 70, spa: 115, spd: 70, spe: 105},
	},
	mareep: {
		inherit: true,
		abilities: {0: "Static", 1: "Mold Breaker", H: "Plus"},
	},
	flaaffy: {
		inherit: true,
		abilities: {0: "Static", 1: "Mold Breaker", H: "Plus"},
	},
	ampharos: {
		inherit: true,
		types: ["Electric", "Dragon"],
		abilities: {0: "Static", 1: "Mold Breaker", H: "Plus"},
	},
	bellossom: {
		inherit: true,
		baseStats: {hp: 90, atk: 60, def: 95, spa: 110, spd: 100, spe: 50},
		abilities: {0: "Chlorophyll", 1: "Dancer", H: "Healer"},
	},
	sudowoodo: {
		inherit: true,
		baseStats: {hp: 70, atk: 110, def: 125, spa: 30, spd: 65, spe: 30},
	},
	politoed: {
		inherit: true,
		types: ["Water", "Normal"],
		baseStats: {hp: 110, atk: 75, def: 75, spa: 100, spd: 100, spe: 70},
		evoType: "levelExtra",
		evoCondition: "while holding a King's Rock",
	},
	jumpluff: {
		inherit: true,
		baseStats: {hp: 75, atk: 75, def: 70, spa: 55, spd: 95, spe: 130},
	},
	sunflora: {
		inherit: true,
		types: ["Grass", "Fire"],
		baseStats: {hp: 95, atk: 75, def: 55, spa: 125, spd: 85, spe: 30},
		abilities: {0: "Chlorophyll", 1: "Solar Power", H: "Drought"},
	},
	quagsire: {
		inherit: true,
		baseStats: {hp: 95, atk: 95, def: 95, spa: 65, spd: 65, spe: 35},
	},
	espeon: {
		inherit: true,
		evoType: "useItem",
		evoItem: "Sun Stone",
	},
	umbreon: {
		inherit: true,
		abilities: {0: "Synchronize", 1: "Magic Guard", H: "Inner Focus"},
		evoType: "useItem",
		evoItem: "Moon Stone",
	},
	slowking: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "while holding a King's Rock",
	},
	misdreavus: {
		inherit: true,
		types: ["Ghost", "Fairy"],
		baseStats: {hp: 80, atk: 110, def: 80, spa: 60, spd: 80, spe: 40},
		abilities: {0: "Levitate", 1: "Magician", H: "Pixilate"},
	},
	girafarig: {
		inherit: true,
		baseStats: {hp: 70, atk: 90, def: 65, spa: 100, spd: 65, spe: 105},
		abilities: {0: "Strong Jaw", 1: "Contrary", H: "Sap Sipper"},
	},
	forretress: {
		inherit: true,
		baseStats: {hp: 75, atk: 100, def: 140, spa: 60, spd: 80, spe: 20},
	},
	dunsparce: {
		inherit: true,
		baseStats: {hp: 110, atk: 80, def: 80, spa: 65, spd: 75, spe: 45},
		abilities: {0: "Serene Grace", 1: "Simple", H: "Rattled"},
	},
	steelix: {
		inherit: true,
		baseStats: {hp: 75, atk: 105, def: 200, spa: 55, spd: 75, spe: 20},
		abilities: {0: "Strong Jaw", 1: "Sturdy", H: "Sheer Force"},
		evoType: "levelExtra",
		evoCondition: "while holding a Metal Coat",
	},
	steelixmega: {
		inherit: true,
		baseStats: {hp: 75, atk: 145, def: 230, spa: 55, spd: 105, spe: 20},
	},
	granbull: {
		inherit: true,
		types: ["Fairy", "Fighting"],
		baseStats: {hp: 90, atk: 130, def: 75, spa: 60, spd: 60, spe: 65},
	},
	qwilfish: {
		inherit: true,
		baseStats: {hp: 65, atk: 95, def: 115, spa: 55, spd: 55, spe: 85},
	},
	scizor: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "while holding a Metal Coat",
	},
	ursaring: {
		inherit: true,
		baseStats: {hp: 90, atk: 130, def: 75, spa: 75, spd: 75, spe: 75},
	},
	magcargo: {
		inherit: true,
		abilities: {0: "Magma Armor", 1: "Simple", H: "Weak Armor"},
	},
	corsola: {
		inherit: true,
		baseStats: {hp: 85, atk: 55, def: 95, spa: 85, spd: 95, spe: 35},
		abilities: {0: "Serene Grace", 1: "Natural Cure", H: "Regenerator"},
	},
	octillery: {
		inherit: true,
		baseStats: {hp: 75, atk: 65, def: 95, spa: 125, spd: 95, spe: 45},
	},
	delibird: {
		inherit: true,
		baseStats: {hp: 45, atk: 85, def: 45, spa: 65, spd: 45, spe: 95},
		abilities: {0: "Refrigerate", 1: "Hustle", H: "Insomnia"},
	},
	houndoom: {
		inherit: true,
		baseStats: {hp: 75, atk: 90, def: 50, spa: 110, spd: 80, spe: 105},
	},
	houndoommega: {
		inherit: true,
		baseStats: {hp: 75, atk: 100, def: 90, spa: 140, spd: 90, spe: 115},
	},
	kingdra: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "while holding a Dragon Scale",
		otherFormes: ["Kingdra-Mega"],
		formeOrder: ["Kingdra", "Kingdra-Mega"],
	},
	kingdramega: {
		num: 230,
		name: "Kingdra-Mega",
		baseSpecies: "Kingdra",
		forme: "Mega",
		types: ["Water", "Dragon"],
		baseStats: {hp: 75, atk: 105, def: 100, spa: 145, spd: 100, spe: 115},
		abilities: {0: "Swift Swim"},
		heightm: 1.8,
		weightkg: 152,
		color: "Blue",
		eggGroups: ["Water 1", "Dragon"],
		requiredItem: "Kingdranite",
		gen: 8,
	},
	donphan: {
		inherit: true,
		baseStats: {hp: 90, atk: 130, def: 130, spa: 60, spd: 60, spe: 50},
	},
	porygon2: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "while holding a Up-Grade",
	},
	stantler: {
		inherit: true,
		baseStats: {hp: 73, atk: 115, def: 62, spa: 85, spd: 65, spe: 95},
	},
	hitmontop: {
		inherit: true,
		baseStats: {hp: 80, atk: 95, def: 95, spa: 35, spd: 110, spe: 70},
		abilities: {0: "Intimidate", 1: "Technician", H: "Contrary"},
	},
	miltank: {
		inherit: true,
		baseStats: {hp: 95, atk: 100, def: 105, spa: 40, spd: 70, spe: 100},
	},
	pupitar: {
		inherit: true,
		abilities: {0: "Shed Skin", H: "Overcoat"},
	},
	treecko: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Unburden", H: "Chloroplast"},
	},
	grovyle: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Unburden", H: "Chloroplast"},
	},
	sceptile: {
		inherit: true,
		types: ["Grass", "Dragon"],
		abilities: {0: "Overgrow", 1: "Unburden", H: "Chloroplast"},
	},
	sceptilemega: {
		inherit: true,
		abilities: {0: "Chloroplast"},
	},
	torchic: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Quick Feet", H: "Speed Boost"},
	},
	combusken: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Quick Feet", H: "Speed Boost"},
	},
	blaziken: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Quick Feet", H: "Speed Boost"},
	},
	mudkip: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Damp", H: "Swift Swim"},
	},
	marshtomp: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Damp", H: "Swift Swim"},
	},
	swampert: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Damp", H: "Swift Swim"},
	},
	mightyena: {
		inherit: true,
		baseStats: {hp: 70, atk: 110, def: 70, spa: 60, spd: 60, spe: 90},
	},
	linoone: {
		inherit: true,
		baseStats: {hp: 78, atk: 100, def: 61, spa: 50, spd: 61, spe: 110},
	},
	wurmple: {
		inherit: true,
		abilities: {0: "Shield Dust", 1: "Poison Point", H: "Run Away"},
	},
	beautifly: {
		inherit: true,
		baseStats: {hp: 60, atk: 50, def: 60, spa: 110, spd: 60, spe: 85},
		abilities: {0: "Swarm", 1: "Berserk", H: "Rivalry"},
	},
	dustox: {
		inherit: true,
		baseStats: {hp: 80, atk: 30, def: 90, spa: 70, spd: 90, spe: 65},
		abilities: {0: "Shield Dust", 1: "Unaware", H: "Compound Eyes"},
	},
	ludicolo: {
		inherit: true,
		baseStats: {hp: 80, atk: 707, def: 70, spa: 100, spd: 100, spe: 80},
	},
	shiftry: {
		inherit: true,
		baseStats: {hp: 90, atk: 110, def: 60, spa: 100, spd: 60, spe: 80},
	},
	swellow: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 60, spa: 85, spd: 50, spe: 125},
	},
	gardevoir: {
		inherit: true,
		baseStats: {hp: 68, atk: 60, def: 65, spa: 125, spd: 115, spe: 100},
	},
	gardevoirmega: {
		inherit: true,
		baseStats: {hp: 68, atk: 85, def: 80, spa: 165, spd: 135, spe: 100},
	},
	masquerain: {
		inherit: true,
		baseStats: {hp: 70, atk: 60, def: 72, spa: 110, spd: 82, spe: 80},
	},
	slakoth: {
		inherit: true,
		abilities: {0: "Truant", 1: "Slow Start", H: "Stall"},
	},
	slaking: {
		inherit: true,
		abilities: {0: "Truant", 1: "Slow Start", H: "Stall"},
	},
	ninjask: {
		inherit: true,
		baseStats: {hp: 61, atk: 100, def: 45, spa: 50, spd: 50, spe: 160},
	},
	shedinja: {
		inherit: true,
		baseStats: {hp: 1, atk: 100, def: 45, spa: 100, spd: 30, spe: 40},
	},
	exploud: {
		inherit: true,
		baseStats: {hp: 104, atk: 91, def: 63, spa: 111, spd: 83, spe: 68},
	},
	hariyama: {
		inherit: true,
		baseStats: {hp: 144, atk: 130, def: 70, spa: 40, spd: 70, spe: 50},
	},
	delcatty: {
		inherit: true,
		baseStats: {hp: 70, atk: 85, def: 65, spa: 85, spd: 55, spe: 110},
	},
	sableye: {
		inherit: true,
		baseStats: {hp: 70, atk: 75, def: 80, spa: 65, spd: 70, spe: 50},
	},
	sableyemega: {
		inherit: true,
		baseStats: {hp: 70, atk: 85, def: 130, spa: 85, spd: 120, spe: 20},
	},
	mawile: {
		inherit: true,
		baseStats: {hp: 70, atk: 85, def: 95, spa: 55, spd: 55, spe: 50},
		abilities: {0: "Huge Power", 1: "Intimidate", H: "Sheer Force"},
	},
	mawilemega: {
		inherit: true,
		baseStats: {hp: 70, atk: 105, def: 130, spa: 55, spd: 100, spe: 40},
	},
	manectric: {
		inherit: true,
		baseStats: {hp: 70, atk: 75, def: 60, spa: 125, spd: 60, spe: 105},
	},
	manectricmega: {
		inherit: true,
		baseStats: {hp: 70, atk: 75, def: 90, spa: 135, spd: 90, spe: 135},
	},
	plusle: {
		inherit: true,
		baseStats: {hp: 60, atk: 50, def: 40, spa: 105, spd: 75, spe: 105},
		abilities: {0: "Plus", 1: "Battery", H: "Lighting Rod"},
	},
	minun: {
		inherit: true,
		baseStats: {hp: 60, atk: 40, def: 50, spa: 75, spd: 105, spe: 105},
		abilities: {0: "Minus", 1: "Battery", H: "Lightning Rod"},
	},
	volbeat: {
		inherit: true,
		types: ["Bug", "Electric"],
		baseStats: {hp: 65, atk: 73, def: 85, spa: 47, spd: 85, spe: 115},
	},
	illumise: {
		inherit: true,
		types: ["Bug", "Fairy"],
		baseStats: {hp: 65, atk: 47, def: 75, spa: 93, spd: 85, spe: 105},
	},
	swalot: {
		inherit: true,
		baseStats: {hp: 100, atk: 83, def: 93, spa: 83, spd: 93, spe: 55},
	},
	sharpedo: {
		inherit: true,
		baseStats: {hp: 70, atk: 120, def: 40, spa: 115, spd: 40, spe: 95},
	},
	sharpedomega: {
		inherit: true,
		baseStats: {hp: 70, atk: 150, def: 70, spa: 110, spd: 65, spe: 115},
	},
	wailord: {
		inherit: true,
		baseStats: {hp: 170, atk: 90, def: 65, spa: 90, spd: 65, spe: 60},
		abilities: {0: "Water Veil", 1: "Gluttony", H: "Drizzle"},
	},
	camerupt: {
		inherit: true,
		baseStats: {hp: 90, atk: 100, def: 80, spa: 105, spd: 85, spe: 40},
		abilities: {0: "Sheer Force", 1: "Solid Rock", H: "Anger Point"},
	},
	cameruptmega: {
		inherit: true,
		baseStats: {hp: 90, atk: 120, def: 110, spa: 145, spd: 115, spe: 20},
	},
	grumpig: {
		inherit: true,
		baseStats: {hp: 100, atk: 45, def: 65, spa: 100, spd: 110, spe: 80},
	},
	spinda: {
		inherit: true,
		baseStats: {hp: 60, atk: 90, def: 60, spa: 90, spd: 60, spe: 90},
	},
	flygon: {
		inherit: true,
		baseStats: {hp: 80, atk: 100, def: 80, spa: 100, spd: 80, spe: 100},
		abilities: {0: "Levitate", H: "Tinted Lens"},
		otherFormes: ["Flygon-Mega"],
		formeOrder: ["Flygon", "Flygon-Mega"],
	},
	flygonmega: {
		num: 330,
		name: "Flygon-Mega",
		baseSpecies: "Flygon",
		forme: "Mega",
		types: ["Ground", "Dragon"],
		baseStats: {hp: 80, atk: 130, def: 100, spa: 120, spd: 100, spe: 110},
		abilities: {0: "Sand Song"},
		heightm: 2,
		weightkg: 82,
		color: "Green",
		eggGroups: ["Bug", "Dragon"],
		requiredItem: "Flygonite",
		gen: 8,
	},
	cacturne: {
		inherit: true,
		baseStats: {hp: 70, atk: 115, def: 60, spa: 115, spd: 60, spe: 85},
		abilities: {0: "Sand Veil", 1: "Sand Rush", H: "Water Absorb"},
	},
	altaria: {
		inherit: true,
		baseStats: {hp: 75, atk: 90, def: 90, spa: 70, spd: 105, spe: 80},
	},
	altariamega: {
		inherit: true,
		baseStats: {hp: 75, atk: 110, def: 110, spa: 110, spd: 105, spe: 100},
	},
	zangoose: {
		inherit: true,
		baseStats: {hp: 73, atk: 115, def: 70, spa: 60, spd: 70, spe: 105},
	},
	seviper: {
		inherit: true,
		baseStats: {hp: 73, atk: 100, def: 60, spa: 100, spd: 60, spe: 100},
		abilities: {0: "Shed Skin", 1: "Merciless", H: "Infiltrator"},
	},
	lunatone: {
		inherit: true,
		baseStats: {hp: 90, atk: 55, def: 65, spa: 125, spd: 115, spe: 70},
	},
	solrock: {
		inherit: true,
		baseStats: {hp: 90, atk: 125, def: 115, spa: 55, spd: 65, spe: 70},
	},
	whiscash: {
		inherit: true,
		baseStats: {hp: 110, atk: 98, def: 73, spa: 76, spd: 71, spe: 60},
		abilities: {0: "Adaptability", 1: "Anticipation", H: "Hydration"},
	},
	claydol: {
		inherit: true,
		baseStats: {hp: 70, atk: 70, def: 105, spa: 90, spd: 120, spe: 75},
	},
	cradily: {
		inherit: true,
		baseStats: {hp: 96, atk: 81, def: 97, spa: 91, spd: 107, spe: 43},
	},
	armaldo: {
		inherit: true,
		baseStats: {hp: 75, atk: 125, def: 120, spa: 70, spd: 80, spe: 45},
	},
	milotic: {
		inherit: true,
		abilities: {0: "Shed Skin", 1: "Merciless", H: "Infiltrator"},
		evoType: "levelExtra",
		evoCondition: "while holding a Prism Scale",
		otherFormes: ["Milotic-Mega"],
		formeOrder: ["Milotic", "Milotic-Mega"],
	},
	miloticmega: {
		num: 350,
		name: "Milotic-Mega",
		baseSpecies: "Milotic",
		forme: "Mega",
		types: ["Water", "Fairy"],
		baseStats: {hp: 95, atk: 70, def: 109, spa: 130, spd: 155, spe: 81},
		abilities: {0: "Prism Scales"},
		heightm: 6.2,
		weightkg: 162,
		color: "Pink",
		eggGroups: ["Water 1", "Dragon"],
		requiredItem: "Miloticite",
		gen: 8,
	},
	castform: {
		inherit: true,
		baseStats: {hp: 70, atk: 70, def: 70, spa: 100, spd: 70, spe: 100},
	},
	castformrainy: {
		inherit: true,
		baseStats: {hp: 70, atk: 70, def: 70, spa: 100, spd: 70, spe: 100},
	},
	castformsnowy: {
		inherit: true,
		baseStats: {hp: 70, atk: 70, def: 70, spa: 100, spd: 70, spe: 100},
	},
	castformsunny: {
		inherit: true,
		baseStats: {hp: 70, atk: 70, def: 70, spa: 100, spd: 70, spe: 100},
	},
	kecleon: {
		inherit: true,
		baseStats: {hp: 80, atk: 100, def: 70, spa: 60, spd: 120, spe: 40},
	},
	shuppet: {
		inherit: true,
		types: ["Ghost", "Normal"],
	},
	banette: {
		inherit: true,
		types: ["Ghost", "Normal"],
		baseStats: {hp: 64, atk: 125, def: 85, spa: 65, spd: 63, spe: 83},
		abilities: {0: "Insomnia", 1: "Vengeance", H: "Cursed Body"},
	},
	banettemega: {
		inherit: true,
		types: ["Ghost", "Normal"],
		baseStats: {hp: 64, atk: 165, def: 95, spa: 75, spd: 83, spe: 103},
	},
	tropius: {
		inherit: true,
		baseStats: {hp: 99, atk: 88, def: 93, spa: 72, spd: 97, spe: 51},
		abilities: {0: "Chlorophyll", 1: "Aerilate", H: "Harvest"},
	},
	chimecho: {
		inherit: true,
		baseStats: {hp: 85, atk: 50, def: 90, spa: 95, spd: 100, spe: 65},
	},
	absol: {
		inherit: true,
		baseStats: {hp: 65, atk: 130, def: 65, spa: 75, spd: 65, spe: 85},
		abilities: {0: "Keen Edge", 1: "Super Luck", H: "Justified"},
	},
	absolmega: {
		inherit: true,
		baseStats: {hp: 65, atk: 160, def: 60, spa: 125, spd: 60, spe: 115},
	},
	glalie: {
		inherit: true,
		types: ["Ice", "Rock"],
		baseStats: {hp: 80, atk: 100, def: 70, spa: 80, spd: 70, spe: 100},
		abilities: {0: "Refrigerate", 1: "Ice Body", H: "Moody"},
		evoLevel: 30,
	},
	glaliemega: {
		inherit: true,
		types: ["Ice", "Rock"],
		baseStats: {hp: 80, atk: 130, def: 80, spa: 120, spd: 80, spe: 110},
	},
	walrein: {
		inherit: true,
		baseStats: {hp: 110, atk: 90, def: 90, spa: 95, spd: 90, spe: 65},
	},
	huntail: {
		inherit: true,
		baseStats: {hp: 55, atk: 114, def: 105, spa: 94, spd: 75, spe: 72},
		abilities: {0: "Swift Swim", 1: "Strong Jaw", H: "Water Veil"},
		evoType: "levelExtra",
		evoCondition: "while holding a Deep Sea Tooth",
	},
	gorebyss: {
		inherit: true,
		baseStats: {hp: 55, atk: 84, def: 105, spa: 124, spd: 75, spe: 72},
		abilities: {0: "Swift Swim", 1: "Storm Drain", H: "Hydration"},
		evoType: "levelExtra",
		evoCondition: "while holding a Deep Sea Scale",
	},
	relicanth: {
		inherit: true,
		baseStats: {hp: 100, atk: 110, def: 130, spa: 45, spd: 65, spe: 55},
	},
	luvdisc: {
		inherit: true,
		baseStats: {hp: 43, atk: 30, def: 55, spa: 95, spd: 65, spe: 97},
		abilities: {0: "Swift Swim", 1: "Soul-Heart", H: "Hydration"},
	},
	turtwig: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Solid Rock", H: "Sap Sipper"},
		evoLevel: 16,
	},
	grotle: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Solid Rock", H: "Sap Sipper"},
	},
	torterra: {
		inherit: true,
		baseStats: {hp: 95, atk: 109, def: 114, spa: 75, spd: 85, spe: 56},
		abilities: {0: "Overgrow", 1: "Solid Rock", H: "Sap Sipper"},
	},
	chimchar: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Iron Fist", H: "Moxie"},
	},
	monferno: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Iron Fist", H: "Moxie"},
	},
	infernape: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Iron Fist", H: "Moxie"},
	},
	piplup: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Slush Rush", H: "Competitive"},
	},
	prinplup: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Slush Rush", H: "Competitive"},
	},
	empoleon: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Slush Rush", H: "Competitive"},
	},
	bibarel: {
		inherit: true,
		baseStats: {hp: 89, atk: 85, def: 80, spa: 55, spd: 60, spe: 71},
	},
	kricketot: {
		inherit: true,
		types: ["Bug", "Normal"],
	},
	kricketune: {
		inherit: true,
		types: ["Bug", "Normal"],
		baseStats: {hp: 77, atk: 65, def: 51, spa: 100, spd: 51, spe: 85},
	},
	luxray: {
		inherit: true,
		types: ["Electric", "Dark"],
		baseStats: {hp: 90, atk: 120, def: 79, spa: 75, spd: 79, spe: 90},
		abilities: {0: "Strong Jaw", 1: "Intimidate", H: "Guts"},
	},
	cranidos: {
		inherit: true,
		abilities: {0: "Mold Breaker", 1: "Rampage", H: "Sheer Force"},
	},
	rampardos: {
		inherit: true,
		baseStats: {hp: 97, atk: 165, def: 80, spa: 65, spd: 50, spe: 58},
		abilities: {0: "Mold Breaker", 1: "Rampage", H: "Sheer Force"},
	},
	bastiodon: {
		inherit: true,
		baseStats: {hp: 80, atk: 52, def: 168, spa: 47, spd: 138, spe: 30},
	},
	wormadam: {
		inherit: true,
		baseStats: {hp: 80, atk: 59, def: 85, spa: 99, spd: 105, spe: 36},
	},
	wormadamsandy: {
		inherit: true,
		baseStats: {hp: 80, atk: 99, def: 105, spa: 59, spd: 85, spe: 36},
	},
	wormadamtrash: {
		inherit: true,
		baseStats: {hp: 80, atk: 69, def: 105, spa: 69, spd: 105, spe: 36},
	},
	mothim: {
		inherit: true,
		baseStats: {hp: 70, atk: 54, def: 70, spa: 94, spd: 70, spe: 86},
	},
	vespiquen: {
		inherit: true,
		baseStats: {hp: 70, atk: 80, def: 112, spa: 80, spd: 112, spe: 40},
		abilities: {0: "Pressure", 1: "Intimidate", H: "Unnerve"},
	},
	pachirisu: {
		inherit: true,
		baseStats: {hp: 60, atk: 45, def: 70, spa: 75, spd: 110, spe: 95},
		abilities: {0: "Fur Coat", 1: "Pickup", H: "Volt Absorb"},
	},
	floatzel: {
		inherit: true,
		baseStats: {hp: 85, atk: 120, def: 55, spa: 100, spd: 50, spe: 115},
	},
	cherubi: {
		inherit: true,
		types: ["Grass", "Fairy"],
		baseStats: {hp: 45, atk: 62, def: 45, spa: 62, spd: 53, spe: 35},
	},
	cherrim: {
		inherit: true,
		types: ["Grass", "Fairy"],
		baseStats: {hp: 70, atk: 100, def: 70, spa: 87, spd: 78, spe: 85},
	},
	cherrimsunshine: {
		inherit: true,
		types: ["Grass", "Fairy"],
		baseStats: {hp: 70, atk: 100, def: 70, spa: 87, spd: 78, spe: 115},
	},
	ambipom: {
		inherit: true,
		baseStats: {hp: 75, atk: 100, def: 66, spa: 60, spd: 66, spe: 125},
	},
	drifblim: {
		inherit: true,
		baseStats: {hp: 150, atk: 80, def: 54, spa: 90, spd: 74, spe: 80},
	},
	lopunny: {
		inherit: true,
		types: ["Normal", "Fighting"],
		baseStats: {hp: 65, atk: 96, def: 84, spa: 54, spd: 96, spe: 105},
		abilities: {0: "Cute Charm", 1: "Scrappy", H: "Limber"},
	},
	lopunnymega: {
		inherit: true,
		baseStats: {hp: 65, atk: 136, def: 94, spa: 74, spd: 96, spe: 135},
	},
	mismagius: {
		inherit: true,
		types: ["Ghost", "Fairy"],
		baseStats: {hp: 60, atk: 60, def: 60, spa: 110, spd: 110, spe: 110},
		abilities: {0: "Levitate", 1: "Magician", H: "Pixilate"},
	},
	purugly: {
		inherit: true,
		baseStats: {hp: 71, atk: 102, def: 75, spa: 64, spd: 69, spe: 119},
	},
	skuntank: {
		inherit: true,
		baseStats: {hp: 103, atk: 113, def: 67, spa: 71, spd: 61, spe: 84},
	},
	chatot: {
		inherit: true,
		baseStats: {hp: 76, atk: 65, def: 45, spa: 102, spd: 42, spe: 101},
	},
	spiritomb: {
		inherit: true,
		baseStats: {hp: 70, atk: 92, def: 108, spa: 92, spd: 108, spe: 35},
	},
	garchompmega: {
		inherit: true,
		baseStats: {hp: 108, atk: 170, def: 110, spa: 120, spd: 90, spe: 102},
	},
	drapion: {
		inherit: true,
		baseStats: {hp: 70, atk: 100, def: 120, spa: 60, spd: 75, spe: 95},
	},
	toxicroak: {
		inherit: true,
		baseStats: {hp: 83, atk: 106, def: 65, spa: 86, spd: 65, spe: 95},
	},
	abomasnow: {
		inherit: true,
		baseStats: {hp: 90, atk: 102, def: 75, spa: 102, spd: 85, spe: 60},
	},
	abomaasnowmega: {
		inherit: true,
		baseStats: {hp: 90, atk: 142, def: 105, spa: 142, spd: 105, spe: 30},
		abilities: {0: "Whiteout"},
	},
	carnivine: {
		inherit: true,
		baseStats: {hp: 74, atk: 100, def: 92, spa: 90, spd: 92, spe: 46},
	},
	finneon: {
		inherit: true,
		abilities: {0: "Swift Swim", 1: "Storm Drain", H: "Dazzling"},
	},
	lumineon: {
		inherit: true,
		baseStats: {hp: 69, atk: 69, def: 76, spa: 109, spd: 86, spe: 91},
		abilities: {0: "Swift Swim", 1: "Storm Drain", H: "Dazzling"},
	},
	lickilicky: {
		inherit: true,
		baseStats: {hp: 110, atk: 95, def: 95, spa: 90, spd: 95, spe: 30},
	},
	magnezone: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "near a special magnetic field",
	},
	rhyperior: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "while holding a Protector",
	},
	electivire: {
		inherit: true,
		types: ["Electric", "Fighting"],
		abilities: {0: "Motor Drive", 1: "Iron Fist", H: "Vital Spirit"},
		evoType: "levelExtra",
		evoCondition: "while holding a Electirizer",
	},
	magmortar: {
		inherit: true,
		baseStats: {hp: 75, atk: 95, def: 67, spa: 125, spd: 85, spe: 93},
		abilities: {0: "Flame Body", 1: "Mega Launcher", H: "Vital Spirit"},
		evoType: "levelExtra",
		evoCondition: "while holding a Magmarizer",
	},
	yanmega: {
		inherit: true,
		baseStats: {hp: 86, atk: 76, def: 86, spa: 126, spd: 56, spe: 95},
	},
	leafeon: {
		inherit: true,
		abilities: {0: "Leaf Guard", 1: "Sap Sipper", H: "Chlorophyll"},
	},
	glaceon: {
		inherit: true,
		abilities: {0: "Snow Cloak", 1: "Whiteout", H: "Slush Rush"},
	},
	porygonz: {
		inherit: true,
		types: ["Normal", "Electric"],
		abilities: {0: "Adaptability", 1: "Download", H: "Mold Breaker"},
		evoType: "levelExtra",
		evoCondition: "while holding a Dubious Disk",
	},
	gallade: {
		inherit: true,
		baseStats: {hp: 68, atk: 125, def: 65, spa: 60, spd: 115, spe: 100},
		abilities: {0: "Steadfast", 1: "Trace", H: "Justified"},
	},
	gallademega: {
		inherit: true,
		baseStats: {hp: 68, atk: 165, def: 95, spa: 65, spd: 125, spe: 115},
		abilities: {0: "Keen Edge"},
	},
	probopass: {
		inherit: true,
		baseStats: {hp: 60, atk: 55, def: 145, spa: 95, spd: 150, spe: 40},
		evoType: "useItem",
		evoItem: "Thunder Stone",
	},
	dusknoir: {
		inherit: true,
		baseStats: {hp: 45, atk: 120, def: 135, spa: 55, spd: 135, spe: 45},
		abilities: {0: "Iron Fist", 1: "Pressure", H: "Frisk"},
		evoType: "levelExtra",
		evoCondition: "while holding a Reaper Cloth",
	},
	froslass: {
		inherit: true,
		baseStats: {hp: 70, atk: 70, def: 70, spa: 110, spd: 70, spe: 110},
		abilities: {0: "Snow Cloak", 1: "Cursed Body", H: "Whiteout"},
	},
	rotomfan: {
		inherit: true,
		abilities: {0: "Motor Drive"},
	},
	regigigas: {
		inherit: true,
		abilities: {0: "Slow Start", H: "Clear Body"},
	},
	snivy: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Shed Skin", H: "Contrary"},
		evoLevel: 16,
	},
	servine: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Shed Skin", H: "Contrary"},
	},
	serperior: {
		inherit: true,
		types: ["Grass", "Dragon"],
		abilities: {0: "Overgrow", 1: "Shed Skin", H: "Contrary"},
	},
	tepig: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Gluttony", H: "Thick Fat"},
		evoLevel: 16,
	},
	pignite: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Gluttony", H: "Thick Fat"},
	},
	emboar: {
		inherit: true,
		baseStats: {hp: 110, atk: 123, def: 80, spa: 70, spd: 80, spe: 65},
		abilities: {0: "Blaze", 1: "Gluttony", H: "Reckless"},
	},
	oshawott: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Weak Armor", H: "Keen Edge"},
		evoLevel: 16,
	},
	dewott: {
		inherit: true,
		types: ["Water", "Fighting"],
		abilities: {0: "Torrent", 1: "Weak Armor", H: "Keen Edge"},
	},
	samurott: {
		inherit: true,
		types: ["Water", "Fighting"],
		abilities: {0: "Torrent", 1: "Weak Armor", H: "Keen Edge"},
	},
	watchog: {
		inherit: true,
		baseStats: {hp: 75, atk: 95, def: 79, spa: 60, spd: 79, spe: 77},
		abilities: {0: "Dazzling", 1: "Keen Eye", H: "Analytic"},
	},
	stoutland: {
		inherit: true,
		baseStats: {hp: 85, atk: 120, def: 90, spa: 45, spd: 90, spe: 80},
	},
	liepard: {
		inherit: true,
		baseStats: {hp: 64, atk: 98, def: 50, spa: 98, spd: 50, spe: 106},
	},
	simisage: {
		inherit: true,
		baseStats: {hp: 75, atk: 108, def: 63, spa: 108, spd: 63, spe: 101},
	},
	simisear: {
		inherit: true,
		baseStats: {hp: 75, atk: 108, def: 63, spa: 108, spd: 63, spe: 101},
	},
	simipour: {
		inherit: true,
		baseStats: {hp: 75, atk: 108, def: 63, spa: 108, spd: 63, spe: 101},
	},
	musharna: {
		inherit: true,
		baseStats: {hp: 116, atk: 55, def: 85, spa: 117, spd: 95, spe: 29},
		abilities: {0: "Forewarn", 1: "Synchronize", H: "Psychic Surge"},
	},
	unfezant: {
		inherit: true,
		baseStats: {hp: 100, atk: 115, def: 80, spa: 65, spd: 55, spe: 93},
		abilities: {0: "Tough Claws", 1: "Super Luck", H: "Rivalry"},
	},
	zebstrika: {
		inherit: true,
		baseStats: {hp: 85, atk: 110, def: 63, spa: 80, spd: 63, spe: 116},
	},
	roggenrola: {
		inherit: true,
		baseStats: {hp: 55, atk: 25, def: 85, spa: 75, spd: 25, spe: 15},
	},
	boldore: {
		inherit: true,
		baseStats: {hp: 70, atk: 50, def: 105, spa: 105, spd: 40, spe: 20},
	},
	gigalith: {
		inherit: true,
		baseStats: {hp: 85, atk: 60, def: 130, spa: 135, spd: 80, spe: 25},
		abilities: {0: "Sturdy", 1: "Sand Stream", H: "Solar Power"},
		evoType: "levelFriendship",
	},
	swoobat: {
		inherit: true,
		baseStats: {hp: 67, atk: 57, def: 55, spa: 97, spd: 55, spe: 114},
	},
	audino: {
		inherit: true,
		baseStats: {hp: 103, atk: 60, def: 96, spa: 80, spd: 96, spe: 50},
	},
	audinomega: {
		inherit: true,
		baseStats: {hp: 103, atk: 60, def: 126, spa: 120, spd: 126, spe: 50},
		abilities: {0: "Fairy Aura"},
	},
	conkeldurr: {
		inherit: true,
		evoType: "levelFriendship",
	},
	seismitoad: {
		inherit: true,
		baseStats: {hp: 105, atk: 105, def: 75, spa: 95, spd: 75, spe: 74},
	},
	leavanny: {
		inherit: true,
		baseStats: {hp: 75, atk: 113, def: 80, spa: 70, spd: 80, spe: 102},
	},
	petilil: {
		inherit: true,
		types: ["Grass", "Fairy"],
	},
	lilligant: {
		inherit: true,
		types: ["Grass", "Fairy"],
	},
	basculin: {
		inherit: true,
		baseStats: {hp: 70, atk: 92, def: 65, spa: 80, spd: 55, spe: 118},
	},
	basculinbluestriped: {
		inherit: true,
		baseStats: {hp: 70, atk: 92, def: 65, spa: 80, spd: 55, spe: 118},
	},
	maractus: {
		inherit: true,
		baseStats: {hp: 75, atk: 56, def: 87, spa: 106, spd: 87, spe: 60},
		abilities: {0: "Water Absorb", 1: "Huge Power", H: "Storm Drain"},
	},
	crustle: {
		inherit: true,
		baseStats: {hp: 70, atk: 115, def: 135, spa: 65, spd: 75, spe: 45},
	},
	cofagrigus: {
		inherit: true,
		types: ["Ghost", "Steel"],
	},
	carracosta: {
		inherit: true,
		baseStats: {hp: 74, atk: 128, def: 133, spa: 83, spd: 65, spe: 32},
	},
	archen: {
		inherit: true,
		abilities: {0: "Defeatist", H: "Klutz"},
	},
	archeops: {
		inherit: true,
		abilities: {0: "Defeatist", H: "Klutz"},
	},
	garbodor: {
		inherit: true,
		types: ["Poison", "Steel"],
		baseStats: {hp: 80, atk: 95, def: 102, spa: 60, spd: 82, spe: 75},
	},
	cinccino: {
		inherit: true,
		baseStats: {hp: 75, atk: 115, def: 60, spa: 65, spd: 60, spe: 115},
	},
	ducklett: {
		inherit: true,
		abilities: {0: "Competitive", 1: "Big Pecks", H: "Hydration"},
	},
	swanna: {
		inherit: true,
		baseStats: {hp: 75, atk: 87, def: 63, spa: 107, spd: 63, spe: 103},
		abilities: {0: "Competitive", 1: "Big Pecks", H: "Hydration"},
	},
	vanillish: {
		inherit: true,
		evoLevel: 25,
	},
	vanilluxe: {
		inherit: true,
		baseStats: {hp: 71, atk: 69, def: 85, spa: 120, spd: 95, spe: 95},
		evoLevel: 37,
	},
	sawsbuck: {
		inherit: true,
		baseStats: {hp: 80, atk: 110, def: 70, spa: 60, spd: 70, spe: 105},
	},
	emolga: {
		inherit: true,
		baseStats: {hp: 55, atk: 75, def: 60, spa: 105, spd: 60, spe: 113},
		abilities: {0: "Static", 1: "Lightning Rod", H: "Motor Drive"},
	},
	galvantula: {
		inherit: true,
		baseStats: {hp: 70, atk: 77, def: 60, spa: 107, spd: 60, spe: 108},
	},
	klink: {
		inherit: true,
		abilities: {0: "Motor Drive", 1: "Minus", H: "Clear Body"},
	},
	klang: {
		inherit: true,
		abilities: {0: "Motor Drive", 1: "Minus", H: "Clear Body"},
		evoLevel: 28,
	},
	klinklang: {
		inherit: true,
		abilities: {0: "Motor Drive", 1: "Minus", H: "Clear Body"},
		evoLevel: 39,
	},
	tynamo: {
		inherit: true,
		abilities: {0: "Levitate", H: "Swift Swim"},
	},
	eelektrik: {
		inherit: true,
		abilities: {0: "Levitate", H: "Swift Swim"},
		evoLevel: 20,
	},
	eelektross: {
		inherit: true,
		baseStats: {hp: 85, atk: 115, def: 90, spa: 105, spd: 90, spe: 50},
		abilities: {0: "Levitate", H: "Swift Swim"},
	},
	elgyem: {
		inherit: true,
		abilities: {0: "Telepathy", 1: "Analytic", H: "Sychronize"},
	},
	beheeyem: {
		inherit: true,
		baseStats: {hp: 75, atk: 75, def: 95, spa: 125, spd: 95, spe: 40},
		abilities: {0: "Telepathy", 1: "Analytic", H: "Psychic Surge"},
	},
	lampent: {
		inherit: true,
		evoLevel: 37,
	},
	chandelure: {
		inherit: true,
		abilities: {0: "Flash Fire", 1: "Flame Body", H: "Mold Breaker"},
	},
	beartic: {
		inherit: true,
		types: ["Ice", "Fighting"],
		baseStats: {hp: 95, atk: 130, def: 80, spa: 70, spd: 80, spe: 70},
	},
	accelgor: {
		inherit: true,
		abilities: {0: "Dry Skin", 1: "Sticky Hold", H: "Unburden"},
		evoType: "levelExtra",
		evoCondition: "with a Karrablast in party",
	},
	escavalier: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "with a Shelmet in party",
	},
	stunfisk: {
		inherit: true,
		abilities: {0: "Static", 1: "Storm Drain", H: "Electric Surge"},
	},
	mienshao: {
		inherit: true,
		evoLevel: 40,
	},
	druddigon: {
		inherit: true,
		baseStats: {hp: 97, atk: 120, def: 90, spa: 60, spd: 90, spe: 48},
	},
	golurk: {
		inherit: true,
		baseStats: {hp: 89, atk: 134, def: 90, spa: 55, spd: 90, spe: 55},
	},
	bisharp: {
		inherit: true,
		evoLevel: 42,
	},
	bouffalant: {
		inherit: true,
		baseStats: {hp: 95, atk: 120, def: 95, spa: 40, spd: 95, spe: 55},
	},
	braviary: {
		inherit: true,
		evoLevel: 34,
	},
	mandibuzz: {
		inherit: true,
		evoLevel: 34,
	},
	heatmor: {
		inherit: true,
		types: ["Fire", "Steel"],
		baseStats: {hp: 85, atk: 97, def: 96, spa: 85, spd: 96, spe: 65},
		abilities: {0: "Tough Claws", 1: "Gluttony", H: "Steelworker"},
	},
	durant: {
		inherit: true,
		baseStats: {hp: 58, atk: 109, def: 112, spa: 48, spd: 78, spe: 109},
	},
	deino: {
		inherit: true,
		abilities: {0: "Hustle", H: "Rampage"},
	},
	zweilous: {
		inherit: true,
		abilities: {0: "Hustle", H: "Rampage"},
		evoLevel: 40,
	},
	hydreigon: {
		inherit: true,
		abilities: {0: "Levitate", H: "Rampage"},
		evoLevel: 54,
	},
	volcarona: {
		inherit: true,
		evoLevel: 49,
	},
	chespin: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Sturdy", H: "Bulletproof"},
	},
	quilladin: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Sturdy", H: "Bulletproof"},
	},
	chesnaught: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Sturdy", H: "Bulletproof"},
	},
	fennekin: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Pyromancy", H: "Magic Guard"},
	},
	braixen: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Pyromancy", H: "Magic Guard"},
	},
	delphox: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Pyromancy", H: "Magic Guard"},
	},
	froakie: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Infiltrator", H: "Protean"},
	},
	frogadier: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Infiltrator", H: "Protean"},
	},
	greninja: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Infiltrator", H: "Protean", S: "Battle Bond"},
	},
	pyroar: {
		inherit: true,
		baseStats: {hp: 86, atk: 68, def: 72, spa: 129, spd: 66, spe: 106},
		abilities: {0: "Rivalry", 1: "Competitive", H: "Moxie"},
	},
	flabebe: {
		inherit: true,
		abilities: {0: "Flower Veil", 1: "Symbiosis", H: "Healer"},
	},
	floette: {
		inherit: true,
		abilities: {0: "Flower Veil", 1: "Symbiosis", H: "Healer"},
	},
	florges: {
		inherit: true,
		abilities: {0: "Flower Veil", 1: "Symbiosis", H: "Misty Surge"},
	},
	skiddo: {
		inherit: true,
		abilities: {0: "Sap Sipper", 1: "Grass Pelt", H: "Leaf Guard"},
	},
	gogoat: {
		inherit: true,
		baseStats: {hp: 123, atk: 100, def: 62, spa: 79, spd: 81, spe: 95},
		abilities: {0: "Sap Sipper", 1: "Grass Pelt", H: "Grassy Surge"},
	},
	meowstic: {
		inherit: true,
		baseStats: {hp: 94, atk: 48, def: 76, spa: 103, spd: 81, spe: 104},
		abilities: {0: "Sheer Force", 1: "Infiltrator", H: "Prankster"},
	},
	meowsticf: {
		inherit: true,
		baseStats: {hp: 74, atk: 48, def: 76, spa: 123, spd: 81, spe: 104},
		abilities: {0: "Sheer Force", 1: "Infiltrator", H: "Competitive"},
	},
	aromatisse: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "while holding a Sachet",
	},
	slurpuff: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "while holding a Whipped Dream",
	},
	dragalge: {
		inherit: true,
		evoLevel: 37,
	},
	clawitzer: {
		inherit: true,
		baseStats: {hp: 71, atk: 73, def: 108, spa: 120, spd: 89, spe: 59},
	},
	heliolisk: {
		inherit: true,
		baseStats: {hp: 62, atk: 55, def: 52, spa: 119, spd: 94, spe: 109},
	},
	tyrantrum: {
		inherit: true,
		baseStats: {hp: 82, atk: 121, def: 119, spa: 69, spd: 69, spe: 81},
	},
	aurorus: {
		inherit: true,
		baseStats: {hp: 123, atk: 77, def: 72, spa: 119, spd: 92, spe: 58},
	},
	sylveon: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "while knowing a Fairy-Type move",
	},
	dedenne: {
		inherit: true,
		baseStats: {hp: 67, atk: 58, def: 57, spa: 101, spd: 87, spe: 101},
		abilities: {0: "Pixilate", 1: "Galvanize", H: "Cheek Pouch"},
	},
	goodra: {
		inherit: true,
		types: ["Dragon", "Water"],
		baseStats: {hp: 90, atk: 100, def: 85, spa: 110, spd: 135, spe: 80},
		abilities: {0: "Hydration", 1: "Poison Heal", H: "Gooey"},
	},
	phantump: {
		inherit: true,
		abilities: {0: "Natural Cure", 1: "Harvest", H: "Frisk"},
	},
	trevenant: {
		inherit: true,
		baseStats: {hp: 85, atk: 110, def: 86, spa: 65, spd: 92, spe: 56},
		abilities: {0: "Natural Cure", 1: "Harvest", H: "Grassy Surge"},
		evoType: "levelFriendship",
	},
	pumpkaboo: {
		inherit: true,
		baseStats: {hp: 49, atk: 44, def: 70, spa: 66, spd: 55, spe: 51},
		abilities: {0: "Pickup", 1: "Flare Boost", H: "Insomnia"},
	},
	pumpkaboolarge: {
		inherit: true,
		baseStats: {hp: 49, atk: 44, def: 70, spa: 66, spd: 55, spe: 51},
		abilities: {0: "Pickup", 1: "Flare Boost", H: "Insomnia"},
	},
	pumpkaboosmall: {
		inherit: true,
		baseStats: {hp: 49, atk: 44, def: 70, spa: 66, spd: 55, spe: 51},
		abilities: {0: "Pickup", 1: "Flare Boost", H: "Insomnia"},
	},
	pumpkaboosuper: {
		inherit: true,
		baseStats: {hp: 49, atk: 44, def: 70, spa: 66, spd: 55, spe: 51},
		abilities: {0: "Pickup", 1: "Flare Boost", H: "Insomnia"},
	},
	gourgeist: {
		inherit: true,
		baseStats: {hp: 65, atk: 58, def: 122, spa: 90, spd: 75, spe: 84},
		abilities: {0: "Pickup", 1: "Flare Boost", H: "Insomnia"},
		evoType: "useItem",
		evoItem: "Moon Stone",
	},
	gourgeistlarge: {
		inherit: true,
		baseStats: {hp: 75, atk: 58, def: 122, spa: 95, spd: 75, spe: 69},
		abilities: {0: "Pickup", 1: "Flare Boost", H: "Insomnia"},
		evoType: "useItem",
		evoItem: "Moon Stone",
	},
	gourgeistsmall: {
		inherit: true,
		baseStats: {hp: 55, atk: 58, def: 122, spa: 85, spd: 75, spe: 99},
		abilities: {0: "Pickup", 1: "Flare Boost", H: "Insomnia"},
		evoType: "useItem",
		evoItem: "Moon Stone",
	},
	gourgeistsuper: {
		inherit: true,
		baseStats: {hp: 85, atk: 58, def: 122, spa: 100, spd: 75, spe: 54},
		abilities: {0: "Pickup", 1: "Flare Boost", H: "Insomnia"},
		evoType: "useItem",
		evoItem: "Moon Stone",
	},
	noivern: {
		inherit: true,
		evoType: "levelFriendship",
		evoCondition: "at night",
	},
	rowlett: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Long Reach", H: "Tinted Lens"},
		evoLevel: 16,
	},
	dartrix: {
		inherit: true,
		abilities: {0: "Overgrow", 1: "Long Reach", H: "Tinted Lens"},
	},
	decidueye: {
		inherit: true,
		baseStats: {hp: 78, atk: 107, def: 75, spa: 70, spd: 90, spe: 110},
		abilities: {0: "Overgrow", 1: "Long Reach", H: "Tinted Lens"},
	},
	litten: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Moxie", H: "Intimidate"},
		evoLevel: 16,
	},
	torracat: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Moxie", H: "Intimidate"},
	},
	incineroar: {
		inherit: true,
		abilities: {0: "Blaze", 1: "Moxie", H: "Intimidate"},
	},
	popplio: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Berserk", H: "Liquid Voice"},
		evoLevel: 16,
	},
	brionne: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Berserk", H: "Liquid Voice"},
	},
	primarina: {
		inherit: true,
		abilities: {0: "Torrent", 1: "Berserk", H: "Liquid Voice"},
	},
	toucannon: {
		inherit: true,
		baseStats: {hp: 80, atk: 120, def: 95, spa: 75, spd: 95, spe: 60},
	},
	gumshoos: {
		inherit: true,
		baseStats: {hp: 88, atk: 110, def: 80, spa: 55, spd: 80, spe: 45},
	},
	charjabug: {
		inherit: true,
		baseStats: {hp: 57, atk: 102, def: 95, spa: 55, spd: 75, spe: 36},
	},
	vikavolt: {
		inherit: true,
		baseStats: {hp: 77, atk: 95, def: 99, spa: 145, spd: 75, spe: 109},
		evoType: "levelExtra",
		evoCondition: "near a special magnetic field",
	},
	crabominable: {
		inherit: true,
		baseStats: {hp: 97, atk: 132, def: 97, spa: 62, spd: 87, spe: 43},
		evoType: "useItem",
		evoItem: "Ice Stone",
	},
	oricorio: {
		inherit: true,
		baseStats: {hp: 75, atk: 70, def: 70, spa: 108, spd: 70, spe: 103},
	},
	oricoriopau: {
		inherit: true,
		baseStats: {hp: 75, atk: 70, def: 70, spa: 108, spd: 70, spe: 103},
	},
	oricoriopompom: {
		inherit: true,
		baseStats: {hp: 75, atk: 70, def: 70, spa: 108, spd: 70, spe: 103},
	},
	oricoriosensu: {
		inherit: true,
		baseStats: {hp: 75, atk: 70, def: 70, spa: 108, spd: 70, spe: 103},
	},
	lycanroc: {
		inherit: true,
		types: ["Rock", "Ground"],
		baseStats: {hp: 75, atk: 125, def: 70, spa: 55, spd: 70, spe: 112},
	},
	lycanrocmidnight: {
		inherit: true,
		types: ["Rock", "Dark"],
		baseStats: {hp: 95, atk: 115, def: 85, spa: 55, spd: 75, spe: 82},
		abilities: {0: "Sturdy", 1: "Defiant", H: "No Guard"},
	},
	lycanrocdusk: {
		inherit: true,
		baseStats: {hp: 75, atk: 127, def: 70, spa: 55, spd: 70, spe: 110},
		evoCondition: "between 5:00 - 5:59 PM",
	},
	araquanid: {
		inherit: true,
		baseStats: {hp: 68, atk: 90, def: 92, spa: 50, spd: 132, spe: 42},
	},
	lurantis: {
		inherit: true,
		baseStats: {hp: 80, atk: 115, def: 95, spa: 80, spd: 95, spe: 45},
	},
	shiinotic: {
		inherit: true,
		baseStats: {hp: 80, atk: 45, def: 80, spa: 100, spd: 110, spe: 30},
	},
	tsareena: {
		inherit: true,
		types: ["Grass", "Fighting"],
		baseStats: {hp: 72, atk: 120, def: 90, spa: 50, spd: 90, spe: 108},
	},
	wimpod: {
		inherit: true,
		abilities: {0: "Wimp Out", H: "Run Away"},
	},
	golisopod: {
		inherit: true,
		abilities: {0: "Emergency Exit", H: "Shell Armor"},
	},
	palossand: {
		inherit: true,
		baseStats: {hp: 85, atk: 75, def: 120, spa: 100, spd: 85, spe: 35},
		abilities: {0: "Water Compaction", 1: "Sand Stream", H: "Sand Veil"},
	},
	silvally: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
		abilities: {0: "Battle Armor"},
	},
	silvallybug: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallydark: {
		inherit: true,
	},
	silvallydragon: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallyelectric: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallyfairy: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallyfighting: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallyfire: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallyflying: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallyghost: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallygrass: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallyground: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallyice: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallypoison: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallypsychic: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallyrock: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallysteel: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	silvallywater: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	komala: {
		inherit: true,
		baseStats: {hp: 85, atk: 115, def: 95, spa: 55, spd: 95, spe: 65},
	},
	turtonator: {
		inherit: true,
		baseStats: {hp: 60, atk: 78, def: 135, spa: 111, spd: 85, spe: 36},
		abilities: {0: "Shell Armor", 1: "Iron Barbs", H: "Aftermath"},
	},
	togedemaru: {
		inherit: true,
		baseStats: {hp: 65, atk: 108, def: 83, spa: 40, spd: 73, spe: 106},
	},
	dhelmise: {
		inherit: true,
		baseStats: {hp: 70, atk: 131, def: 120, spa: 76, spd: 90, spe: 40},
	},
	solgaleo: {
		inherit: true,
		evoLevel: 53,
		evoCondition: "during the day",
	},
	lunala: {
		inherit: true,
		evoLevel: 53,
		evoCondition: "during the night",
	},
	meltan: {
		inherit: true,
		evos: ["Melmetal"],
	},
	melmetal: {
		inherit: true,
		prevo: "Meltan",
		evoType: "levelExtra",
		evoCondition: "while holding a Metal Coat",
	},
	// gen 8 mons
	grookey: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	thwackey: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	rillaboom: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	scorbunny: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	raboot: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	cinderace: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	sobble: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	drizzle: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	inteleon: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	skwovet: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	greedent: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	rookidee: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	corvisquire: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	corviknight: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	blipbug: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dottler: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	orbeetle: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	nickit: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	thievul: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	gossifleur: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	edegoss: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	wooloo: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dubwool: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	chewtle: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	drednaw: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	yamper: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	boltund: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	rolycoly: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	carkol: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	coalossal: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	applin: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	flapple: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	appletun: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	silicobra: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	sandaconda: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	cramorant: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	arrokuda: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	barraskewda: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	toxel: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	toxtricity: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	sizzlipede: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	centiskorch: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	clobbopus: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	grapploct: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	sinistea: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	polteageist: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	hatenna: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	hattern: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	hatterene: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	impidimp: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	morgerm: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	grimmsnarl: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zigzagoongalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	linoonegalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	obstagoon: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	meowthgalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	perrserker: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	corsolagalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	cursola: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	farfetchdgalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	sirfetchd: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	weezinggalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	mrmimegalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	mrrime: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	darumakagalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	darmanitangalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	yamaskgalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	runerigus: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	stunfiskgalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	slowpokegalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	slowbrogalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	slowkinggalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	articunogalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zapdosgalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	moltresgalar: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	milcery: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	alcremie: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	falinks: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pincurchin: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	snom: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	frosmoth: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	stonjourner: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	eiscue: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	indeedeem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	indeedef: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	morpeko: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	cufant: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	copperajah: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dracozolt: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	arctozolt: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dracovish: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	arctovish: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	duraludon: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dreepy: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	drakloak: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dragapult: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zacian: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zaciancrowned: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zamazenta: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zamazentacrowned: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	eternatus: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	kubfu: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	urshifu: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	urshifurapidstrike: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zarude: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zarudedada: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	regieleki: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	regidrago: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	glastrier: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	spectrier: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	calyrex: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	calyrexice: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	calyrexshadow: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
};

