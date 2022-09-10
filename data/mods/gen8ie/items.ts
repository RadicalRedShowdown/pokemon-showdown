export const Items: {[k: string]: ModdedItemData} = {
	lightball: {
		inherit: true,
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
				return this.chainModify(2);
			}
			if (pokemon.baseSpecies.baseSpecies === 'Raichu') {
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
				return this.chainModify(2);
			}
			if (pokemon.baseSpecies.baseSpecies === 'Raichu') {
				return this.chainModify(1.5);
			}
		},
		itemUser: ["Pikachu", "Pikachu-Cosplay", "Pikachu-Rock-Star", "Pikachu-Belle", "Pikachu-Pop-Star", "Pikachu-PhD", "Pikachu-Libre", "Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner", "Pikachu-Starter", "Pikachu-World", 'Raichu', 'Raichu-Alola'],
	},
	shellbell: {
		inherit: true,
		onAfterMoveSecondarySelfPriority: -1,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.category === "Status" || !move.hit) return;
			const missinghp = pokemon.maxhp - pokemon.hp;
			this.heal(missinghp / 3, pokemon);
		},
	},
	bigroot: {
		inherit: true,
		onTryHeal(damage, target, source, effect) {
			const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
			if (heals.includes(effect.id)) {
				return this.chainModify(1.5);
			}
		},
	},
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
		fling: {
			basePower: 60,
		},
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
	bigmushroom: {
		name: "Big Mushroom",
		spritenum: 26,
		gen: 2,
	},
	bignugget: {
		name: "Big Nugget",
		spritenum: 27,
		gen: 1,
	},
	bigpearl: {
		name: "Big Pearl",
		spritenum: 28,
		gen: 2,
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
	blueshard: {
		name: "Blue Shard",
		spritenum: 43,
		gen: 3,
	},
	brightpowder: {
		inherit: true,
		onModifyAccuracy() {},
	},
	buggem: {
		inherit: true,
		isNonstandard: null,
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
	cleansetag: {
		name: "Cleanse Tag",
		spritenum: 73,
		gen: 2,
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
		isNonstandard: null,
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
		isNonstandard: null,
	},
	dragongem: {
		inherit: true,
		isNonstandard: null,
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
		isNonstandard: null,
	},
	durinberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	earthplate: {
		inherit: true,
		isNonstandard: null,
	},
	eeviumz: {
		inherit: true,
		isNonstandard: null,
	},
	electricgem: {
		inherit: true,
		isNonstandard: null,
	},
	electriumz: {
		inherit: true,
		isNonstandard: null,
	},
	electricmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	everstone: {
		name: "Everstone",
		spritenum: 129,
		gen: 2,
	},
	fairiumz: {
		inherit: true,
		isNonstandard: null,
	},
	fairygem: {
		inherit: true,
		isNonstandard: null,
	},
	fairymemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	fightinggem: {
		inherit: true,
		isNonstandard: null,
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
		isNonstandard: null,
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
		isNonstandard: null,
	},
	flameplate: {
		inherit: true,
		isNonstandard: null,
	},
	flyinggem: {
		inherit: true,
		isNonstandard: null,
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
		isNonstandard: null,
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
		isNonstandard: null,
	},
	grassiumz: {
		inherit: true,
		isNonstandard: null,
	},
	grassmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	greenshard: {
		name: "Green Shard",
		spritenum: 176,
		gen: 3,
	},
	groundgem: {
		inherit: true,
		isNonstandard: null,
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
	heartscale: {
		name: "Heart Scale",
		spritenum: 192,
		gen: 3,
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
		isNonstandard: null,
	},
	icicleplate: {
		inherit: true,
		isNonstandard: null,
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
		isNonstandard: null,
	},
	ironplate: {
		inherit: true,
		isNonstandard: null,
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
	laxincense: {
		inherit: true,
		onModifyAccuracy() {},
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
	luckyegg: {
		name: "Lucky Egg",
		spritenum: 260,
		gen: 2,
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
		isNonstandard: null,
	},
	medichamite: {
		inherit: true,
		isNonstandard: null,
	},
	metagrossite: {
		inherit: true,
		isNonstandard: null,
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
		isNonstandard: null,
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
		isNonstandard: null,
	},
	nugget: {
		name: "Nugget",
		spritenum: 308,
		gen: 1,
	},
	pamtreberry: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	pearl: {
		name: "Pearl",
		spritenum: 331,
		gen: 2,
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
		isNonstandard: null,
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
		isNonstandard: null,
	},
	psychiumz: {
		inherit: true,
		isNonstandard: null,
	},
	psychicmemory: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	quickclaw: {
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
		inherit: true,
		isNonstandard: null,
	},
	redorb: {
		inherit: true,
		isNonstandard: null,
	},
	redshard: {
		name: "Red Shard",
		spritenum: 393,
		gen: 3,
	},
	rockgem: {
		inherit: true,
		isNonstandard: null,
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
		isNonstandard: null,
	},
	slowbronite: {
		inherit: true,
		isNonstandard: null,
	},
	smokeball: {
		name: "Smoke Ball",
		spritenum: 452,
		gen: 2,
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
		isNonstandard: null,
	},
	spookyplate: {
		inherit: true,
		isNonstandard: null,
	},
	steelgem: {
		inherit: true,
		isNonstandard: null,
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
		isNonstandard: null,
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
		isNonstandard: null,
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
		isNonstandard: null,
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
		isNonstandard: null,
	},
	// banned gen 8 items
	blunderpolicy: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	ejectpack: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	heavydutyboots: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	throatspray: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	utilityumbrella: {
		inherit: true,
		isNonstandard: "Unobtainable",
	},
	// new mega stones
	butterfrenite: {
		name: "Butterfrenite",
		spritenum: 592,
		megaStone: "Butterfree-Mega",
		megaEvolves: "Butterfree",
		itemUser: ["Butterfree"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
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
		gen: 8,
		desc: "If held by a Machamp, this item allows it to Mega Evolve in battle.",
		num: -5,
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
		gen: 8,
		desc: "If held by a Kingler, this item allows it to Mega Evolve in battle.",
		num: -6,
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
		gen: 8,
		num: -7,
		desc: "If held by a Lapras, this item allows it to Mega Evolve in battle.",
	},
	flygonite: {
		name: "Flygonite",
		megaStone: "Flygon-Mega",
		megaEvolves: "Flygon",
		itemUser: ["Flygon"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		gen: 8,
		desc: "If held by a Flygon, this item allows it to Mega Evolve in battle.",
		num: -8,
	},
	kingdranite: {
		name: "Kingdranite",
		megaStone: "Kingdra-Mega",
		megaEvolves: "Kingdra",
		itemUser: ["Kingdra"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		gen: 8,
		num: -9,
		desc: "If held by a Kingdra, this item allows it to Mega Evolve in battle.",
	},
	miloticite: {
		name: "Miloticite",
		megaStone: "Milotic-Mega",
		megaEvolves: "Milotic",
		itemUser: ["Milotic"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		gen: 8,
		num: -10,
		desc: "If held by a Milotic, this item allows it to Mega Evolve in battle.",
	},
};
