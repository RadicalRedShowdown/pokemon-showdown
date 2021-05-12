export const Items: {[k: string]: ModdedItemData} = {
	// past items
	abomasite: {
		inherit: true,
		isNonstandard: null,
	},
	absolite: {
		inherit: true,
		isNonstandard: null,
	},
	adamantorb: {
		name: "Adamant Orb",
		spritenum: 4,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Dialga') {
				this.queue.insertChoice({choice: 'runPrimal', pokemon: pokemon});
			}
		},
		onPrimal(pokemon) {
			pokemon.formeChange('Dialga-Primal', this.effect, true);
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Dialga') return false;
			return true;
		},
		itemUser: ["Dialga"],
		num: 135,
		gen: 4,
		desc: "If held by a Dialga, this item triggers its Primal Reversion in battle.",
		shortDesc: "If held by a Dialga, this item triggers its Primal Reversion in battle.",
	},
	adrenalineorb: {
		inherit: true,
		onAfterBoost(boost, target, source, effect) {
			if (effect.id === 'intimidate' || effect.id === 'surprise') {
				target.useItem();
			}
		},
	},
	aerodactylite: {
		inherit: true,
		isNonstandard: null,
	},
	aggronite: {
		inherit: true,
		isNonstandard: null,
	},
	alakazite: {
		inherit: true,
		isNonstandard: null,
	},
	altarianite: {
		inherit: true,
		isNonstandard: null,
	},
	aloraichiumz: {
		inherit: true,
		isNonstandard: null,
	},
	ampharosite: {
		inherit: true,
		isNonstandard: null,
	},
	armorfossil: {
		inherit: true,
		isNonstandard: null,
	},
	audinite: {
		inherit: true,
		isNonstandard: null,
	},
	banettite: {
		inherit: true,
		isNonstandard: null,
	},
	beedrillite: {
		inherit: true,
		isNonstandard: null,
	},
	belueberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	blastoisinite: {
		inherit: true,
		isNonstandard: null,
	},
	blazikenite: {
		inherit: true,
		isNonstandard: null,
	},
	blueorb: {
		inherit: true,
		isNonstandard: null,
	},
	buggem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	buginiumz: {
		inherit: true,
		isNonstandard: null,
	},
	bugmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	cameruptite: {
		inherit: true,
		isNonstandard: null,
	},
	charizarditex: {
		inherit: true,
		isNonstandard: null,
	},
	charizarditey: {
		inherit: true,
		isNonstandard: null,
	},
	clawfossil: {
		inherit: true,
		isNonstandard: null,
	},
	cornnberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	coverfossil: {
		inherit: true,
		isNonstandard: null,
	},
	darkgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	darkiniumz: {
		inherit: true,
		isNonstandard: null,
	},
	darkmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	decidiumz: {
		inherit: true,
		isNonstandard: null,
	},
	diancite: {
		inherit: true,
		isNonstandard: null,
	},
	domefossil: {
		inherit: true,
		isNonstandard: null,
	},
	dracoplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dragongem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dragoniumz: {
		inherit: true,
		isNonstandard: null,
	},
	dragonmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dreadplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	durinberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	earthplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	eeviumz: {
		inherit: true,
		isNonstandard: null,
	},
	electricgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	electriumz: {
		inherit: true,
		isNonstandard: null,
	},
	electricmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fairiumz: {
		inherit: true,
		isNonstandard: null,
	},
	fairygem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fairymemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fightinggem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fightiniumz: {
		inherit: true,
		isNonstandard: null,
	},
	fightingmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	firegem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	firiumz: {
		inherit: true,
		isNonstandard: null,
	},
	firememory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fistplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	flameplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	flyinggem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	flyiniumz: {
		inherit: true,
		isNonstandard: null,
	},
	flyingmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	galladite: {
		inherit: true,
		isNonstandard: null,
	},
	garchompite: {
		inherit: true,
		isNonstandard: null,
	},
	gardevoirite: {
		inherit: true,
		isNonstandard: null,
	},
	gengarite: {
		inherit: true,
		isNonstandard: null,
	},
	ghostgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	ghostiumz: {
		inherit: true,
		isNonstandard: null,
	},
	ghostmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	glalitite: {
		inherit: true,
		isNonstandard: null,
	},
	grassgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	grassiumz: {
		inherit: true,
		isNonstandard: null,
	},
	grassmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	groundgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	groundiumz: {
		inherit: true,
		isNonstandard: null,
	},
	groundmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	gyaradosite: {
		inherit: true,
		isNonstandard: null,
	},
	helixfossil: {
		inherit: true,
		isNonstandard: null,
	},
	heracronite: {
		inherit: true,
		isNonstandard: null,
	},
	houndoominite: {
		inherit: true,
		isNonstandard: null,
	},
	icegem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	icicleplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	iciumz: {
		inherit: true,
		isNonstandard: null,
	},
	icememory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	inciniumz: {
		inherit: true,
		isNonstandard: null,
	},
	insectplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	ironplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	jawfossil: {
		inherit: true,
		isNonstandard: null,
	},
	kangaskhanite: {
		inherit: true,
		isNonstandard: null,
	},
	kingsrock: {
		inherit: true,
		onModifyMove() {},
		desc: "Evolves Galarian Slowpoke into Galarian Slowking when used.",
		shortDesc: "Evolves Galarian Slowpoke into Galarian Slowking when used.",
	},
	kommoniumz: {
		inherit: true,
		isNonstandard: null,
	},
	latiasite: {
		inherit: true,
		isNonstandard: null,
	},
	latiosite: {
		inherit: true,
		isNonstandard: null,
	},
	leek: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	lopunnite: {
		inherit: true,
		isNonstandard: null,
	},
	lucarionite: {
		inherit: true,
		isNonstandard: null,
	},
	luckypunch: {
		inherit: true,
		isNonstandard: null,
	},
	lunaliumz: {
		inherit: true,
		isNonstandard: null,
	},
	lycaniumz: {
		inherit: true,
		isNonstandard: null,
	},
	machobrace: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	magostberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	mail: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	manectite: {
		inherit: true,
		isNonstandard: null,
	},
	marshadiumz: {
		inherit: true,
		isNonstandard: null,
	},
	mawilite: {
		inherit: true,
		isNonstandard: null,
	},
	meadowplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	medichamite: {
		inherit: true,
		isNonstandard: null,
	},
	metagrossite: {
		inherit: true,
		isNonstandard: null,
	},
	metalcoat: {
		inherit: true,
		onBasePower() {},
		desc: "Evolves Onix into Steelix, Scyther into Scizor, Nosepass into Probopass, Meltan into Melmetal when used.",
		shortDesc: "Evolves certain species of Pokemon when used.",
	},
	mewniumz: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwonitex: {
		inherit: true,
		isNonstandard: null,
	},
	mewtwonitey: {
		inherit: true,
		isNonstandard: null,
	},
	mimikiumz: {
		inherit: true,
		isNonstandard: null,
	},
	mindplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	nanabberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	nomelberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	normaliumz: {
		inherit: true,
		isNonstandard: null,
	},
	normalgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pamtreberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pidgeotite: {
		inherit: true,
		isNonstandard: null,
	},
	pikaniumz: {
		inherit: true,
		isNonstandard: null,
	},
	pikashuniumz: {
		inherit: true,
		isNonstandard: null,
	},
	pinsirite: {
		inherit: true,
		isNonstandard: null,
	},
	plumefossil: {
		inherit: true,
		isNonstandard: null,
	},
	poisongem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	poisoniumz: {
		inherit: true,
		isNonstandard: null,
	},
	poisonmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	primariumz: {
		inherit: true,
		isNonstandard: null,
	},
	psychicgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	psychiumz: {
		inherit: true,
		isNonstandard: null,
	},
	psychicmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	rabutaberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	razorclaw: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	razorfang: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	razzberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	reapercloth: {
		name: "Reaper Cloth",
		spritenum: 385,
		fling: {
			basePower: 10,
		},
		onModifyMove(move, pokemon, target) {
			if (pokemon.baseSpecies.baseSpecies === "Dusknoir") {
				move.accuracy = true;
			}
		},
		itemUser: ["Dusknoir"],
		num: 325,
		gen: 4,
		desc: "If held by a Dusknoir, its attacks cannot miss.",
		shortDesc: "If held by a Dusknoir, its attacks cannot miss.",
	},
	redorb: {
		inherit: true,
		isNonstandard: null,
	},
	rockgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	rockiumz: {
		inherit: true,
		isNonstandard: null,
	},
	rockmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	rootfossil: {
		inherit: true,
		isNonstandard: null,
	},
	sablenite: {
		inherit: true,
		isNonstandard: null,
	},
	sailfossil: {
		inherit: true,
		isNonstandard: null,
	},
	salamencite: {
		inherit: true,
		isNonstandard: null,
	},
	sceptilite: {
		inherit: true,
		isNonstandard: null,
	},
	scizorite: {
		inherit: true,
		isNonstandard: null,
	},
	sharpedonite: {
		inherit: true,
		isNonstandard: null,
	},
	skullfossil: {
		inherit: true,
		isNonstandard: null,
	},
	skyplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	slowbronite: {
		inherit: true,
		isNonstandard: null,
	},
	snorliumz: {
		inherit: true,
		isNonstandard: null,
	},
	solganiumz: {
		inherit: true,
		isNonstandard: null,
	},
	spelonberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	splashplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	spookyplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	steelgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	steeliumz: {
		inherit: true,
		isNonstandard: null,
	},
	steelmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	steelixite: {
		inherit: true,
		isNonstandard: null,
	},
	stick: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	stoneplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	swampertite: {
		inherit: true,
		isNonstandard: null,
	},
	tapuniumz: {
		inherit: true,
		isNonstandard: null,
	},
	toxicplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	tyranitarite: {
		inherit: true,
		isNonstandard: null,
	},
	ultranecroziumz: {
		inherit: true,
		isNonstandard: null,
	},
	venusaurite: {
		inherit: true,
		isNonstandard: null,
	},
	watergem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	wateriumz: {
		inherit: true,
		isNonstandard: null,
	},
	watermemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	watmelberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	wepearberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	zapplate: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},

	// rr items
	leekstick: {
		name: "Leek Stick",
		fling: {
			basePower: 60,
		},
		spritenum: 475,
		onModifyCritRatio(critRatio, user) {
			if (this.toID(user.baseSpecies.baseSpecies) === 'farfetchd') {
				return critRatio + 1;
			}
		},
		onModifySpe(spe, user) {
			if (this.toID(user.baseSpecies.baseSpecies) === 'farfetchd') {
				return this.chainModify(1.5);
		    }
		},
		itemUser: ["Farfetch\u2019d", "Farfetch\u2019d-Galar"],
		num: -1000,
		gen: 8,
		desc: "If held by a Farfetch’d, its critical hit ratio is raised by 1 stage and it gets a 1.5x speed boost.",
		shortDesc: "If held by a Farfetch’d, +1 critical hit ratio and 1.5x speed.",
	},
	butterfrite: {
		name: "Butterfrite",
		spritenum: 592,
		megaStone: "Butterfree-Mega",
		megaEvolves: "Butterfree",
		itemUser: ["Butterfree"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1001,
		gen: 8,
		desc: "If held by a Butterfree, this item allows it to Mega Evolve in battle.",
	},
	machampite: {
		name: "Machampite",
		spritenum: 578,
		megaStone: "Machamp-Mega",
		megaEvolves: "Machamp",
		itemUser: ["Machamp"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1002,
		gen: 8,
		desc: "If held by a Machamp, this item allows it to Mega Evolve in battle.",
	},
	garbodorite: {
		name: "Garbodorite",
		spritenum: 614,
		megaStone: "Garbodor-Mega",
		megaEvolves: "Garbodor",
		itemUser: ["Garbodor"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1003,
		gen: 8,
		desc: "If held by a Garbodor, this item allows it to Mega Evolve in battle.",
	},
	kinglerite: {
		name: "Kinglerite",
		spritenum: 583,
		megaStone: "Kingler-Mega",
		megaEvolves: "Kingler",
		itemUser: ["Kingler"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1004,
		gen: 8,
		desc: "If held by a Kingler, this item allows it to Mega Evolve in battle.",
	},
	snorlaxite: {
		name: "Snorlaxite",
		spritenum: 616,
		megaStone: "Snorlax-Mega",
		megaEvolves: "Snorlax",
		itemUser: ["Snorlax"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1005,
		gen: 8,
		desc: "If held by a Snorlax, this item allows it to Mega Evolve in battle.",
	},
	laprasite: {
		name: "Laprasite",
		spritenum: 612,
		megaStone: "Lapras-Mega",
		megaEvolves: "Lapras",
		itemUser: ["Lapras"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1006,
		gen: 8,
		desc: "If held by a Lapras, this item allows it to Mega Evolve in battle.",
	},
	drednawite: {
		name: "Drednawite",
		spritenum: 575,
		megaStone: "Drednaw-Mega",
		megaEvolves: "Drednaw",
		itemUser: ["Drednaw"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1007,
		gen: 8,
		desc: "If held by a Drednaw, this item allows it to Mega Evolve in battle.",
	},
	coalossite: {
		name: "Coalossite",
		spritenum: 591,
		megaStone: "Coalossal-Mega",
		megaEvolves: "Coalossal",
		itemUser: ["Coalossal"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1008,
		gen: 8,
		desc: "If held by a Coalossal, this item allows it to Mega Evolve in battle.",
	},
	orbeetlite: {
		name: "Orbeetlite",
		spritenum: 587,
		megaStone: "Orbeetle-Mega",
		megaEvolves: "Orbeetle",
		itemUser: ["Orbeetle"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1009,
		gen: 8,
		desc: "If held by a Orbeetle, this item allows it to Mega Evolve in battle.",
	},
	toxtricitite: {
		name: "Toxtricitite",
		spritenum: 582,
		megaStone: "Toxtricity-Mega",
		megaEvolves: "Toxtricity",
		itemUser: ["Toxtricity", "Toxtricity-Low-Key"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1010,
		gen: 8,
		desc: "If held by a Toxtricity, this item allows it to Mega Evolve in battle.",
	},
	duraludonite: {
		name: "Duraludonite",
		spritenum: 577,
		megaStone: "Duraludon-Mega",
		megaEvolves: "Duraludon",
		itemUser: ["Duraludon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1011,
		gen: 8,
		desc: "If held by a Duraludon, this item allows it to Mega Evolve in battle.",
	},
	copperajite: {
		name: "Copperajite",
		spritenum: 605,
		megaStone: "Copperajah-Mega",
		megaEvolves: "Copperajah",
		itemUser: ["Copperajah"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1012,
		gen: 8,
		desc: "If held by a Copperajah, this item allows it to Mega Evolve in battle.",
	},
	centiskite: {
		name: "Centiskite",
		spritenum: 586,
		megaStone: "Centiskorch-Mega",
		megaEvolves: "Centiskorch",
		itemUser: ["Centiskorch"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1013,
		gen: 8,
		desc: "If held by a Centiskorch, this item allows it to Mega Evolve in battle.",
	},
	sandacondite: {
		name: "Sandacondite",
		spritenum: 626,
		megaStone: "Sandaconda-Mega",
		megaEvolves: "Sandaconda",
		itemUser: ["Sandaconda"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1014,
		gen: 8,
		desc: "If held by a Sandaconda, this item allows it to Mega Evolve in battle.",
	},
	flapplite: {
		name: "Flapplite",
		spritenum: 608,
		megaStone: "Flapple-Mega",
		megaEvolves: "Flapple",
		itemUser: ["Flapple"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1015,
		gen: 8,
		desc: "If held by a Flapple, this item allows it to Mega Evolve in battle.",
	},
	appletunite: {
		name: "Appletunite",
		spritenum: 608,
		megaStone: "Appletun-Mega",
		megaEvolves: "Appletun",
		itemUser: ["Appletun"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1016,
		gen: 8,
		desc: "If held by a Appletun, this item allows it to Mega Evolve in battle.",
	},
	alcremite: {
		name: "Alcremite",
		spritenum: 620,
		megaStone: "Alcremie-Mega",
		megaEvolves: "Alcremie",
		itemUser: ["Alcremie"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1017,
		gen: 8,
		desc: "If held by a Alcremie, this item allows it to Mega Evolve in battle.",
	},
};
