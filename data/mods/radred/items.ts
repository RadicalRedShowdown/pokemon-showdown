export const Items: {[k: string]: ModdedItemData} = {
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
	bugmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	darkmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	dragonmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	electricmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fairymemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fightingmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	firememory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	flyingmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	ghostmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	grassmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	groundmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	icememory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	kingsrock: {
		inherit: true,
		onModifyMove() {},
		desc: "Evolves Galarian Slowpoke into Galarian Slowking when used.",
		shortDesc: "Evolves Galarian Slowpoke into Galarian Slowking when used.",
	},
	leek: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	metalcoat: {
		inherit: true,
		onBasePower() {},
		desc: "Evolves Onix into Steelix, Scyther into Scizor, Nosepass into Probopass, Meltan into Melmetal when used.",
		shortDesc: "Evolves certain species of Pokemon when used.",
	},
	normalgem: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	poisonmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	psychicmemory: {
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
	rockmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	steelmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	stick: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	watermemory: {
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
