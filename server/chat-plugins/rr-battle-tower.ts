import {FS, Utils} from '../../lib';
import {Ladders} from '../ladders';
import {POKEPASTE_LEVELS} from './rr-battle-tower-levels';
import {grantRRBadge, type RRBadgeID} from './rr-custom-badges';

const FORMAT_ID = 'gen9rrbattletower';
const FORMAT_NAME = '[Gen 9] RR Battle Tower';
const TEAMBUILDER_FORMAT_ID = 'gen9ou';
const TEAMBUILDER_FORMAT_NAME = '[Gen 9] OU';
const BOT_NAME = 'RR BT Bot';
const BOT_AVATAR = '101';
const BT_CHALLENGER_ID = 'rrbtbot' as ID;
const BT_ACCEPT_COMMAND = '/btaccept';
// Optional override. If this file exists, it replaces DEFAULT_LEVELS below.
const LEVELS_FILE = 'config/chat-plugins/rr-battle-tower-levels.json';
const PROGRESS_FILE = 'config/chat-plugins/rr-battle-tower-progress.json';
const AI_MEMORY_FILE = 'config/chat-plugins/rr-battle-tower-ai-memory.json';
const OPPONENT_MEMORY_FILE = 'config/chat-plugins/rr-battle-tower-opponent-memory.json';
const MEDALS_FILE = 'config/chat-plugins/rr-battle-tower-medals.json';
const ACCESS_FILE = 'config/chat-plugins/rr-battle-tower-access.json';
const RR_RANDOM_SETS_FILE = 'data/mods/gen9rr/random-sets.json';

const BT_MEDALS = {
	marowak: {
		name: "Marowak Boss Medal",
		desc: "Cleared Boss Battle: Marowak-Alola.",
		badgeType: "silver",
		badgeDetail: "marowak-boss",
	},
	radicalred: {
		name: "Radical Red Medal",
		desc: "Cleared Boss Battle: The Radical Red.",
		badgeType: "gold",
		badgeDetail: "radical-red-boss",
	},
} as const;

type BTMedalID = keyof typeof BT_MEDALS;

const BT_CUSTOM_BADGES: {[k in BTMedalID]: RRBadgeID} = {
	marowak: 'marowakboss',
	radicalred: 'houndoomboss',
};

const RECOVERY_MOVE_IDS = new Set([
	'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'synthesis',
	'morningsun', 'moonlight', 'milkdrink', 'healorder', 'lifedew',
]);
const STAT_DROP_PUNISHING_ABILITIES = new Set([
	'clearbody', 'contrary', 'defiant', 'fullmetalbody', 'mirrorarmor', 'radicalaura', 'whitesmoke',
]);
const STATUS_PUNISHING_ABILITIES = new Set(['familialrevenge', 'purifyingsalt', 'radicalaura']);
const CONTACT_DAMAGE_ABILITIES = new Set(['ironbarbs', 'roughskin']);
const CONTACT_STATUS_ABILITIES = new Set(['flamebody', 'static', 'tanglinghair']);
const PRIORITY_BLOCKING_ABILITIES = new Set<ID>(['armortail' as ID, 'dazzling' as ID, 'queenlymajesty' as ID]);
const PHASING_MOVE_IDS = new Set<ID>([
	'roar' as ID, 'whirlwind' as ID, 'dragontail' as ID, 'circlethrow' as ID,
]);
const HAZARD_MOVE_IDS = new Set<ID>([
	'stealthrock' as ID, 'spikes' as ID, 'toxicspikes' as ID, 'stickyweb' as ID,
	'ceaselessedge' as ID, 'stoneaxe' as ID,
]);
const HAZARD_REMOVAL_MOVE_IDS = new Set<ID>([
	'defog' as ID, 'rapidspin' as ID, 'mortalspin' as ID, 'tidyup' as ID, 'courtchange' as ID,
]);
const SELF_SWITCH_MOVE_IDS = new Set<ID>([
	'flipturn' as ID, 'uturn' as ID, 'voltswitch' as ID, 'teleport' as ID, 'chillyreception' as ID,
	'partingshot' as ID, 'shedtail' as ID,
]);
const DISRUPTION_MOVE_IDS = new Set<ID>([
	...PHASING_MOVE_IDS, 'haze' as ID, 'clearsmog' as ID,
	'taunt' as ID, 'encore' as ID, 'torment' as ID,
]);
const SETUP_PAYOFF_MOVE_IDS = new Set<ID>(['storedpower' as ID, 'powertrip' as ID, 'bodypress' as ID]);
const FIRST_ACTIVE_MOVE_ONLY_IDS = new Set<ID>(['fakeout' as ID, 'firstimpression' as ID]);
const ANTI_ATTACK_PRIORITY_MOVE_IDS = new Set<ID>(['suckerpunch' as ID, 'thunderclap' as ID]);
const STATUS_AILMENT_IDS = new Set<ID>(['brn' as ID, 'par' as ID, 'psn' as ID, 'tox' as ID, 'slp' as ID, 'frz' as ID]);
const BOOSTER_STAT_IDS = new Set<StatIDExceptHP>(['atk', 'def', 'spa', 'spd', 'spe']);
const WEATHER_SPEED_ABILITIES: {[k: string]: ID} = {
	chlorophyll: 'sunnyday' as ID,
	sandrush: 'sandstorm' as ID,
	slushrush: 'snow' as ID,
	swiftswim: 'raindance' as ID,
};
const WEATHER_SETTER_ABILITIES: {[k: string]: ID} = {
	deltastream: 'deltastream' as ID,
	desolateland: 'desolateland' as ID,
	drizzle: 'raindance' as ID,
	drought: 'sunnyday' as ID,
	primordialsea: 'primordialsea' as ID,
	sandstream: 'sandstorm' as ID,
	snowwarning: 'snow' as ID,
};
const CHOICE_ITEM_IDS = new Set<ID>(['choiceband' as ID, 'choicescarf' as ID, 'choicespecs' as ID]);
const GRASSY_TERRAIN_WEAKENED_MOVES = new Set<ID>(['bulldoze' as ID, 'earthquake' as ID, 'magnitude' as ID]);
const SLEEP_INDUCING_MOVE_IDS = new Set<ID>([
	'darkvoid' as ID, 'grasswhistle' as ID, 'hypnosis' as ID, 'lovelykiss' as ID,
	'relicsong' as ID, 'sing' as ID, 'sleeppowder' as ID, 'spore' as ID, 'yawn' as ID,
]);
const TYPE_BOOSTING_ITEMS: {[type: string]: ID[]} = {
	Bug: ['silverpowder' as ID, 'insectplate' as ID],
	Dark: ['blackglasses' as ID, 'dreadplate' as ID],
	Dragon: ['dragonfang' as ID, 'dracoplate' as ID],
	Electric: ['magnet' as ID, 'zapplate' as ID],
	Fairy: ['pixieplate' as ID],
	Fighting: ['blackbelt' as ID, 'fistplate' as ID],
	Fire: ['charcoal' as ID, 'flameplate' as ID],
	Flying: ['sharpbeak' as ID, 'skyplate' as ID],
	Ghost: ['spelltag' as ID, 'spookyplate' as ID],
	Grass: ['miracleseed' as ID, 'meadowplate' as ID],
	Ground: ['softsand' as ID, 'earthplate' as ID],
	Ice: ['nevermeltice' as ID, 'icicleplate' as ID],
	Normal: ['silkscarf' as ID],
	Poison: ['poisonbarb' as ID, 'toxicplate' as ID],
	Psychic: ['twistedspoon' as ID, 'mindplate' as ID],
	Rock: ['hardstone' as ID, 'stoneplate' as ID],
	Steel: ['metalcoat' as ID, 'ironplate' as ID],
	Water: ['mysticwater' as ID, 'splashplate' as ID],
};
let damagingPriorityMoveIDs: Set<ID> | null = null;
const learnsetPriorityMoveCache = new Map<ID, ID[]>();
type BTMoveTag = 'disruption' | 'hazard' | 'priority' | 'setup' | 'status';
type BTTeamArchetype = 'weather' | 'stall' | 'hyperoffense' | 'bulkyoffense' | 'balance';

interface BTLevel {
	name: string;
	team: string;
	boss?: boolean;
	medal?: BTMedalID;
}

interface BTBattleState {
	userid: ID;
	level: number;
	replay: boolean;
	timer: NodeJS.Timer;
	logIndex: number;
	hazards: {
		p1: BTSideHazards,
		p2: BTSideHazards,
	};
	perish: {
		p1: number,
		p2: number,
	};
	futureMoves: BTFutureMoveState;
	setupUsed: {[ident: string]: boolean};
	decisions: BTDecision[];
	lastDecisionByPokemon: {[ident: string]: BTDecision};
	lastBotMoveDecision: BTDecision | null;
	lastBotMoveByTarget: {[ident: string]: BTDecision};
	lastBotMoveOutcome: BTMoveOutcome | null;
	lastBotMoveOutcomeByTarget: {[ident: string]: BTMoveOutcome};
	lastLoggedMoveWasBot: boolean;
	lastLoggedMoveDecision: BTDecision | null;
	lastBotSwitch: BTSwitchDecision | null;
	pivotPunishedSwitches: {[key: string]: number};
	stallMoveCounters: {[ident: string]: number};
	pendingStallMoves: {[ident: string]: boolean};
	pendingWishes: {
		p1: BTPendingWish | null,
		p2: BTPendingWish | null,
	};
	playerStyle: BTPlayerStyle;
	pendingPlayerAction: BTPendingPlayerAction | null;
	publicItems: {[ident: string]: ID};
	consumedItems: {[ident: string]: ID};
	observedPlayerSets: {[ident: string]: BTObservedPlayerSet};
	lastPlayerMoveByIdent: {[ident: string]: ID};
	hpByIdent: {[ident: string]: BTHPState};
	lastMoveEvent: BTLoggedMove | null;
	inferredStats: {[ident: string]: Partial<Record<StatIDExceptHP, number>>};
	turnMoved: {[sideid: string]: boolean};
	boostsByIdent: {[ident: string]: SparseBoostsTable};
	volatilesByIdent: {[ident: string]: {[volatileid: string]: boolean}};
	boosterBoostsByIdent: {[ident: string]: StatIDExceptHP};
	hiddenPowerTypesByIdent: {[ident: string]: string};
	antiAttackPriorityFailures: {[key: string]: number};
	turn: number;
	lastBotError: string;
	memoryChanged: boolean;
}

interface BTSideHazards {
	stealthrock: boolean;
	spikes: number;
	toxicspikes: number;
	stickyweb: boolean;
	gmaxsteelsurge: boolean;
}

interface BTFutureMoveState {
	p1: boolean[];
	p2: boolean[];
}

interface BTDecision {
	key: string;
	actor: string;
	action: string;
}

interface BTSwitchDecision {
	fromSpecies: ID;
	toSpecies: ID;
	toIdent: string;
	targetSpecies: ID;
}

interface BTMoveOutcome {
	decision: BTDecision;
	moveid: ID;
	target: string;
	crit: boolean;
	missed: boolean;
	status: boolean;
	flinch: boolean;
	secondary: boolean;
}

interface BTPendingWish {
	wisher: string;
	heal: number;
	healTurn: number;
}

interface BTAIMemoryEntry {
	score: number;
	uses: number;
}

interface BTOpponentMemoryEntry {
	moves: {[moveid: string]: number};
	abilities: {[abilityid: string]: number};
	items: {[itemid: string]: number};
	tags: {[tagid: string]: number};
	sets: {[setid: string]: number};
}

interface BTObservedPlayerSet {
	speciesid: ID;
	moves: {[moveid: string]: true};
	abilities: {[abilityid: string]: true};
	items: {[itemid: string]: true};
}

interface BTHPState {
	hp: number;
	maxhp: number;
}

interface BTLoggedMove {
	sourceIdent: string;
	targetIdent: string;
	sourceSideid: string;
	targetSideid: string;
	moveid: ID;
	targetHPBefore?: number;
}

interface BTPlayerStyle {
	threatenedSwitches: number;
	threatenedStays: number;
	neutralSwitches: number;
	neutralStays: number;
}

interface BTPendingPlayerAction {
	target: string;
	threatened: boolean;
}

interface BTAIContext {
	weather: ID;
	terrain: ID;
	sourceSide?: AnyObject[];
	ownSide?: AnyObject[];
	targetSide?: AnyObject[];
	ownHazards?: BTSideHazards;
	targetHazards?: BTSideHazards;
}

const INITIAL_LEVEL: BTLevel = {
	name: "Level 1",
	team: `
Lawsuit plushie (Chillet) @ Choice Band
Ability: Refrigerate
Tera Type: Ice
EVs: 252 Atk / 252 Spe
Adamant Nature
- Extreme Speed
- U-turn
- Knock Off
- Dragon Claw

ZZZZZZ (Hippowdon) @ Heavy-Duty Boots
Ability: Sand Stream
Tera Type: Ghost
EVs: 152 HP / 148 Def / 208 Spe
Jolly Nature
- High Horsepower
- Stealth Rock
- Toxic
- Slack Off

Big PECKS (Moltres) @ Heavy-Duty Boots
Ability: Flame Body
Tera Type: Fire
EVs: 120 HP / 252 SpA / 136 Spe
Modest Nature
IVs: 0 Atk
- Scorching Sands
- Fire Blast
- Roost
- Defog

Sabrina Meloni (Primarina) @ Assault Vest
Ability: Liquid Voice
Tera Type: Water
EVs: 124 HP / 144 SpA / 140 SpD / 100 Spe
Timid Nature
- Misty Explosion
- Moonblast
- Flip Turn
- Psychic Noise

Dw its a friend (Dragapult) @ Ghostium Z
Ability: Clear Body
Tera Type: Dragon
EVs: 252 Atk / 4 Def / 252 Spe
Jolly Nature
- Spirit Shackle
- Dragon Dance
- Dragon Darts
- Will-O-Wisp

Old Reliable (Scizor) @ Scizorite
Ability: Technician
Tera Type: Bug
EVs: 248 HP / 16 Def / 244 SpD
Impish Nature
- Swords Dance
- Bullet Punch
- U-turn
- Roost
`,
};

const MAROWAK_LEVEL: BTLevel = {
	name: "Marowak-Alola",
	boss: true,
	medal: 'marowak',
	team: `
Gengar @ Gengarite
Ability: Levitate
Level: 125
Tera Type: Ghost
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
IVs: 0 Atk
- Perish Song
- Sludge Wave
- Shadow Ball
- Taunt

Raticate-Alola @ Life Orb
Ability: Hustle
Level: 125
Tera Type: Dark
EVs: 252 HP / 252 Atk / 4 Def
Adamant Nature
- Knock Off
- Double-Edge
- U-turn
- Quick Attack

Rotom-Wash @ Choice Scarf
Ability: Levitate
Level: 125
Tera Type: Electric
EVs: 252 HP / 4 SpD / 252 Spe
Timid Nature
IVs: 0 Atk
- Volt Switch
- Hydro Pump
- Defog
- Scald

Dragapult @ Ghostium Z
Ability: Infiltrator
Level: 125
Tera Type: Dragon
EVs: 252 Atk / 252 Spe
Jolly Nature
- Spirit Shackle
- U-turn
- Psychic Fangs
- Dragon Darts

Weavile @ Heavy-Duty Boots
Ability: Pressure
Level: 125
Tera Type: Dark
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Swords Dance
- Knock Off
- Triple Axel
- Low Kick

Marowak-Alola @ Thick Club
Ability: Familial Revenge
Level: 200
Tera Type: Fire
EVs: 252 HP / 252 Atk / 252 Def / 252 SpD
Adamant Nature
- Bonemerang
- Shadow Bone
- Flare Blitz
- Knock Off
`,
};

const RADICAL_RED_LEVEL: BTLevel = {
	name: "The Radical Red",
	boss: true,
	medal: 'radicalred',
	team: `
The Radical Red (Houndoom-Mega) @ Houndoominite
Ability: Radical Aura
Level: 222
Tera Type: Dark
EVs: 252 HP / 252 SpA / 252 Spe
Modest Nature
IVs: 0 Atk
- Fiery Wrath
- Fire Blast
- Scorching Sands
- Nasty Plot
`,
};

const DEFAULT_LEVELS: BTLevel[] = [
	INITIAL_LEVEL,
	...POKEPASTE_LEVELS.slice(0, 15),
	MAROWAK_LEVEL,
	...POKEPASTE_LEVELS.slice(15),
	RADICAL_RED_LEVEL,
];
let levels = loadLevels();
const progress: {[userid: string]: number} = loadProgress();
const aiMemory: {[key: string]: BTAIMemoryEntry} = loadAIMemory();
const opponentMemory: {[speciesid: string]: BTOpponentMemoryEntry} = loadOpponentMemory();
const rrRandomSetMoves: {[speciesid: string]: ID[]} = loadRRRandomSetMoves();
const btMedals: {[userid: string]: BTMedalID[]} = loadBTMedals();
const btAccess = new Set<ID>(loadBTAccess());
const btBattles = new Map<RoomID, BTBattleState>();
const btRequests = new Map<ID, {level: number, replay: boolean}>();

function readConfigFile(path: string) {
	return FS(path).readIfExistsSync();
}

function loadLevels() {
	const data = readConfigFile(LEVELS_FILE);
	if (!data) return DEFAULT_LEVELS.slice();
	try {
		const parsed = JSON.parse(data);
		if (!Array.isArray(parsed)) throw new Error(`Expected an array`);
		const loaded = parsed.filter(level => (
			level && typeof level.name === 'string' && typeof level.team === 'string'
		));
		for (const level of loaded) {
			if (level.medal && !isBTMedalID(level.medal)) delete level.medal;
		}
		return loaded as BTLevel[];
	} catch (e: any) {
		Monitor.warn(`Could not load ${LEVELS_FILE}: ${e.message}`);
		return DEFAULT_LEVELS.slice();
	}
}

function loadProgress() {
	try {
		const parsed = JSON.parse(readConfigFile(PROGRESS_FILE) || "{}");
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
		const result: {[userid: string]: number} = {};
		for (const [userid, cleared] of Object.entries(parsed)) {
			if (typeof cleared === 'number' && cleared > 0) result[userid] = Math.floor(cleared);
		}
		return result;
	} catch (e: any) {
		Monitor.warn(`Could not load ${PROGRESS_FILE}: ${e.message}`);
		return {};
	}
}

function saveProgress() {
	FS(PROGRESS_FILE).writeUpdate(() => JSON.stringify(progress, null, 2));
}

function isBTMedalID(medal: string): medal is BTMedalID {
	return medal in BT_MEDALS;
}

function loadBTMedals() {
	try {
		const parsed = JSON.parse(readConfigFile(MEDALS_FILE) || "{}");
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
		const result: {[userid: string]: BTMedalID[]} = {};
		for (const [userid, medals] of Object.entries(parsed)) {
			if (!Array.isArray(medals)) continue;
			const validMedals = medals.filter(medal => typeof medal === 'string' && isBTMedalID(medal));
			if (validMedals.length) result[toID(userid)] = [...new Set(validMedals)];
		}
		return result;
	} catch (e: any) {
		Monitor.warn(`Could not load ${MEDALS_FILE}: ${e.message}`);
		return {};
	}
}

function saveBTMedals() {
	FS(MEDALS_FILE).writeUpdate(() => JSON.stringify(btMedals, null, 2));
}

function loadBTAccess() {
	try {
		const parsed = JSON.parse(FS(ACCESS_FILE).readIfExistsSync() || "[]");
		const users = Array.isArray(parsed) ? parsed : parsed?.users;
		if (!Array.isArray(users)) return [] as ID[];
		return users.map(userid => toID(userid)).filter(Boolean);
	} catch (e: any) {
		Monitor.warn(`Could not load ${ACCESS_FILE}: ${e.message}`);
		return [] as ID[];
	}
}

function saveBTAccess() {
	FS(ACCESS_FILE).writeUpdate(() => JSON.stringify([...btAccess].sort(), null, 2));
}

function userCanUseBT(user: User) {
	return user.can('bypassall') || btAccess.has(user.id);
}

function checkBTAccess(context: Chat.CommandContext, user: User) {
	if (userCanUseBT(user)) return true;
	context.commandDoesNotExist();
	return false;
}

function loadAIMemory() {
	try {
		const parsed = JSON.parse(readConfigFile(AI_MEMORY_FILE) || "{}");
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
		const result: {[key: string]: BTAIMemoryEntry} = {};
		for (const [key, entry] of Object.entries(parsed)) {
			if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
			const score = Number((entry as AnyObject).score);
			const uses = Number((entry as AnyObject).uses);
			if (Number.isFinite(score) && Number.isFinite(uses)) {
				result[key] = {score, uses};
			}
		}
		return result;
	} catch (e: any) {
		Monitor.warn(`Could not load ${AI_MEMORY_FILE}: ${e.message}`);
		return {};
	}
}

function saveAIMemory() {
	FS(AI_MEMORY_FILE).writeUpdate(() => JSON.stringify(aiMemory, null, 2));
}

function loadOpponentMemory() {
	try {
		const parsed = JSON.parse(readConfigFile(OPPONENT_MEMORY_FILE) || "{}");
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
		const result: {[speciesid: string]: BTOpponentMemoryEntry} = {};
		for (const [speciesid, entry] of Object.entries(parsed)) {
			if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
			const learned: BTOpponentMemoryEntry = {moves: {}, abilities: {}, items: {}, tags: {}, sets: {}};
			for (const field of ['moves', 'abilities', 'items', 'tags', 'sets'] as const) {
				const values = (entry as AnyObject)[field];
				if (!values || typeof values !== 'object' || Array.isArray(values)) continue;
				for (const [id, count] of Object.entries(values)) {
					const value = Number(count);
					const key = field === 'sets' ? id : toID(id);
					if (key && Number.isFinite(value) && value > 0) learned[field][key] = Math.floor(value);
				}
			}
			if (
				Object.keys(learned.moves).length || Object.keys(learned.abilities).length ||
				Object.keys(learned.items).length || Object.keys(learned.tags).length ||
				Object.keys(learned.sets).length
			) {
				result[toID(speciesid)] = learned;
			}
		}
		return result;
	} catch (e: any) {
		Monitor.warn(`Could not load ${OPPONENT_MEMORY_FILE}: ${e.message}`);
		return {};
	}
}

function saveOpponentMemory() {
	FS(OPPONENT_MEMORY_FILE).writeUpdate(() => JSON.stringify(opponentMemory, null, 2));
}

function flushOpponentMemory(state: BTBattleState) {
	if (!state.memoryChanged) return;
	saveOpponentMemory();
	state.memoryChanged = false;
}

function loadRRRandomSetMoves() {
	try {
		const parsed = JSON.parse(FS(RR_RANDOM_SETS_FILE).readIfExistsSync() || "{}");
		const result: {[speciesid: string]: ID[]} = {};
		for (const [speciesid, sets] of Object.entries(parsed)) {
			if (!Array.isArray(sets)) continue;
			const moveids = new Set<ID>();
			for (const set of sets) {
				const moves = (set as AnyObject)?.moves;
				if (!Array.isArray(moves)) continue;
				for (const move of moves) {
					const moveid = toID(move);
					if (moveid) moveids.add(moveid);
				}
			}
			if (moveids.size) result[toID(speciesid)] = [...moveids];
		}
		return result;
	} catch (e: any) {
		Monitor.warn(`Could not load ${RR_RANDOM_SETS_FILE}: ${e.message}`);
		return {};
	}
}

function countMemoryValue(table: {[id: string]: number}, id: ID) {
	if (!id) return false;
	table[id] = Math.min(9999, (table[id] || 0) + 1);
	return true;
}

function countTableValue(table: {[id: string]: number}, id: string, amount = 1) {
	if (!id) return false;
	table[id] = Math.min(9999, (table[id] || 0) + amount);
	return true;
}

function getOpponentMemoryEntry(speciesid: ID) {
	if (!opponentMemory[speciesid]) opponentMemory[speciesid] = {moves: {}, abilities: {}, items: {}, tags: {}, sets: {}};
	if (!opponentMemory[speciesid].tags) opponentMemory[speciesid].tags = {};
	if (!opponentMemory[speciesid].sets) opponentMemory[speciesid].sets = {};
	return opponentMemory[speciesid];
}

function getObservedPlayerSet(
	state: BTBattleState, ident: string | undefined, speciesid: ID
) {
	if (!state.observedPlayerSets) state.observedPlayerSets = {};
	const identID = getBattleIdentID(ident);
	if (!state.observedPlayerSets[identID]) {
		state.observedPlayerSets[identID] = {speciesid, moves: {}, abilities: {}, items: {}};
	}
	return state.observedPlayerSets[identID];
}

function rememberObservedPlayerSetValue(
	state: BTBattleState, ident: string | undefined, speciesid: ID,
	field: 'moves' | 'abilities' | 'items', value: ID
) {
	if (!value) return;
	const observed = getObservedPlayerSet(state, ident, speciesid);
	observed[field][value] = true;
}

function getObservedSetSignature(observed: BTObservedPlayerSet) {
	const moves = Object.keys(observed.moves).sort();
	const abilities = Object.keys(observed.abilities).sort();
	const items = Object.keys(observed.items).sort();
	if (!moves.length && !abilities.length && !items.length) return '';
	return `m=${moves.join(',')};a=${abilities.join(',')};i=${items.join(',')}`;
}

function learnObservedPlayerSets(state: BTBattleState) {
	let changed = false;
	for (const observed of Object.values(state.observedPlayerSets)) {
		const signature = getObservedSetSignature(observed);
		if (!signature) continue;
		const entry = getOpponentMemoryEntry(observed.speciesid);
		changed = countTableValue(entry.sets, signature) || changed;
	}
	if (changed) state.memoryChanged = true;
}

function learnOpponentPokemonData(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	const speciesid = getSpeciesID(pokemonData);
	if (!speciesid || speciesid === 'none') return false;
	const entry = getOpponentMemoryEntry(speciesid);
	let changed = false;
	for (const moveid of getPokemonMoveIDsFromData(pokemonData)) {
		changed = countMemoryValue(entry.moves, moveid) || changed;
		for (const tag of getMoveTags(moveid)) {
			changed = countMemoryValue(entry.tags, tag as ID) || changed;
		}
	}
	for (const abilityid of getPossiblePokemonAbilityIDsFromData(pokemonData)) {
		changed = countMemoryValue(entry.abilities, abilityid) || changed;
	}
	const itemid = getPokemonItemID(pokemonData);
	if (itemid) changed = countMemoryValue(entry.items, itemid) || changed;
	return changed;
}

function getRankedMemoryIDs(table: {[id: string]: number} | undefined, limit = 8) {
	if (!table) return [] as ID[];
	return Object.entries(table)
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([id]) => toID(id))
		.filter(Boolean);
}

function getRankedMemoryKeys(table: {[id: string]: number} | undefined, limit = 5) {
	if (!table) return [] as string[];
	return Object.entries(table)
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([id]) => id)
		.filter(Boolean);
}

function getCommonSetMoveIDs(speciesid: ID) {
	const moveids: ID[] = [];
	for (const setid of getRankedMemoryKeys(opponentMemory[speciesid]?.sets)) {
		const moveMatch = /(?:^|;)m=([^;]*)/.exec(setid);
		if (!moveMatch?.[1]) continue;
		for (const moveid of moveMatch[1].split(',').map(move => toID(move)).filter(Boolean)) {
			moveids.push(moveid);
		}
	}
	return moveids;
}

function getLikelyMemoryItemID(pokemonData: AnyObject | null) {
	if (!pokemonData) return '' as ID;
	return getRankedMemoryIDs(opponentMemory[getSpeciesID(pokemonData)]?.items, 1)[0] || '' as ID;
}

function learnOpponentMemoryValue(
	room: GameRoom, state: BTBattleState, ident: string | undefined, field: keyof BTOpponentMemoryEntry, value: string | undefined
) {
	const id = toID(value);
	if (!id) return;
	const pokemon = getBattlePokemonByIdent(room, ident);
	if (!pokemon) return;
	const entry = getOpponentMemoryEntry(pokemon.species.id);
	if (countMemoryValue(entry[field], id)) state.memoryChanged = true;
	if (field === 'moves' || field === 'abilities' || field === 'items') {
		rememberObservedPlayerSetValue(state, ident, pokemon.species.id, field, id);
	}
	if (field === 'moves') {
		for (const tag of getMoveTags(id)) {
			if (countMemoryValue(entry.tags, tag as ID)) state.memoryChanged = true;
		}
	}
}

function learnPublicAbilityFromLine(room: GameRoom, state: BTBattleState, parts: string[]) {
	const abilityPart = parts.find(part => /^\[from\] ability:/i.test(part));
	if (!abilityPart) return;
	const ability = abilityPart.replace(/^\[from\] ability:\s*/i, '');
	const ownerPart = parts.find(part => /^\[of\] /i.test(part));
	const ownerIdent = ownerPart ? ownerPart.replace(/^\[of\] /i, '') : parts[2];
	if (getLineSideID(ownerIdent) !== 'p1') return;
	learnOpponentMemoryValue(room, state, ownerIdent, 'abilities', ability);
}

function memoryScore(key: string) {
	return aiMemory[key]?.score || 0;
}

function applyAIMemoryDelta(key: string, delta: number) {
	const entry = aiMemory[key] || {score: 0, uses: 0};
	entry.score = Math.max(-3, Math.min(3, entry.score + delta));
	entry.uses++;
	aiMemory[key] = entry;
}

function updateAIMemory(decisions: BTDecision[], won: boolean) {
	if (!decisions.length) return;
	const seen = new Set<string>();
	const delta = won ? 0.35 : -0.2;
	for (const decision of decisions) {
		if (seen.has(decision.key)) continue;
		seen.add(decision.key);
		applyAIMemoryDelta(decision.key, delta);
	}
	saveAIMemory();
}

function rewardDecision(state: BTBattleState, decision: BTDecision | null | undefined, delta: number) {
	if (!decision) return;
	applyAIMemoryDelta(decision.key, delta);
	state.memoryChanged = true;
}

function adjustOutcomeReward(outcome: BTMoveOutcome | null | undefined, delta: number) {
	if (!outcome) return delta;
	let adjusted = delta;
	if (adjusted > 0) {
		if (outcome.crit) adjusted *= 0.35;
		if (outcome.flinch) adjusted *= 0.75;
		if (outcome.status) adjusted *= 0.85;
		if (outcome.missed) adjusted = 0;
	} else if (adjusted < 0 && outcome.missed) {
		adjusted *= 0.25;
	}
	return adjusted;
}

function rewardMoveOutcome(
	state: BTBattleState, outcome: BTMoveOutcome | null | undefined, delta: number, adjust = true
) {
	if (!outcome) return;
	rewardDecision(state, outcome.decision, adjust ? adjustOutcomeReward(outcome, delta) : delta);
}

function getLastBotOutcomeForTarget(state: BTBattleState, ident: string | undefined) {
	return state.lastBotMoveOutcomeByTarget[getBattleIdentID(ident)] || state.lastBotMoveOutcome;
}

function getCleared(userid: ID) {
	return progress[userid] || 0;
}

function getMarowakCheckpoint() {
	const marowakIndex = levels.findIndex(level => level.medal === 'marowak');
	return marowakIndex >= 0 ? marowakIndex + 1 : 0;
}

function getBTMedals(userid: ID) {
	return btMedals[userid] || [];
}

function awardBTMedal(userid: ID, medal: BTMedalID) {
	grantRRBadge(userid, BT_CUSTOM_BADGES[medal]);
	const medals = new Set(getBTMedals(userid));
	if (medals.has(medal)) return false;
	medals.add(medal);
	btMedals[userid] = [...medals];
	saveBTMedals();
	return true;
}

function awardBTMedalsThrough(userid: ID, cleared: number) {
	let awarded = false;
	for (let i = 0; i < Math.min(cleared, levels.length); i++) {
		const medal = levels[i].medal;
		if (medal) awarded = awardBTMedal(userid, medal) || awarded;
	}
	return awarded;
}

function getBTMedalsHTML(userid: ID) {
	const medals = getBTMedals(userid);
	if (!medals.length) return `No Battle Tower medals yet.`;
	return medals.map(medalid => {
		const medal = BT_MEDALS[medalid];
		return `<strong>${Utils.escapeHTML(medal.name)}</strong> - ${Utils.escapeHTML(medal.desc)}`;
	}).join('<br />');
}

function syncBTMedalsFromProgress() {
	let changed = false;
	for (const [userid, cleared] of Object.entries(progress)) {
		const targetID = toID(userid);
		const medals = new Set(getBTMedals(targetID));
		for (let i = 0; i < Math.min(cleared, levels.length); i++) {
			const medal = levels[i].medal;
			if (medal && !medals.has(medal)) {
				medals.add(medal);
				changed = true;
			}
		}
		if (medals.size) btMedals[targetID] = [...medals];
	}
	if (changed) saveBTMedals();
}

syncBTMedalsFromProgress();

function syncBTMedalsToRRBadges() {
	for (const [userid, medals] of Object.entries(btMedals)) {
		for (const medal of medals) {
			grantRRBadge(toID(userid), BT_CUSTOM_BADGES[medal]);
		}
	}
}

syncBTMedalsToRRBadges();

function getBTLevelLabel(level: BTLevel, index: number, html = false) {
	const name = html ? Utils.escapeHTML(level.name) : level.name;
	if (level.boss) return `Boss Battle: ${name}`;
	return `Level ${index + 1}`;
}

function getBTLevelPageBounds(page: number) {
	const marowakIndex = levels.findIndex(level => level.medal === 'marowak');
	if (page === 1) {
		return {
			start: 0,
			end: marowakIndex >= 0 ? marowakIndex + 1 : levels.length,
			desc: marowakIndex >= 0 ? `through Marowak-Alola` : `all configured levels`,
		};
	}
	return {
		start: marowakIndex >= 0 ? marowakIndex + 1 : levels.length,
		end: levels.length,
		desc: `through the final boss`,
	};
}

function getBTLevelSpritesHTML(level: BTLevel) {
	const importedTeam = Teams.import(level.team);
	if (!importedTeam?.length) return '';
	const dex = Dex.mod('gen9rrbt');
	return importedTeam.map(set => {
		const species = dex.species.get(set.species || set.name);
		const pokemonid = species.exists ? species.id : toID(set.species || set.name);
		const title = Utils.escapeHTML(set.name || species.name || set.species || pokemonid);
		const bossSprite = (
			(level.medal === 'marowak' && pokemonid === 'marowakalola') ||
			(level.medal === 'radicalred' && pokemonid === 'houndoommega')
		);
		const style = bossSprite ?
			` style="vertical-align:-12px;margin:0 10px;transform:scale(1.7);transform-origin:center center"` :
			``;
		return `<span title="${title}"><psicon pokemon="${pokemonid}"${style} /></span>`;
	}).join(' ');
}

function getBTLevelsPageHTML(userid: ID, page: number) {
	const cleared = getCleared(userid);
	const bounds = getBTLevelPageBounds(page);
	const rows = [];
	for (let index = bounds.start; index < bounds.end; index++) {
		const level = levels[index];
		const levelNumber = index + 1;
		const status = index < cleared ? 'Cleared' : index === cleared ? 'Next' : 'Locked';
		const label = level.boss ?
			getBTLevelLabel(level, index, true) :
			`${levelNumber}. ${getBTLevelLabel(level, index)}`;
		const sprites = index < cleared ? getBTLevelSpritesHTML(level) : '';
		rows.push(`${label} - ${status}${sprites ? ` ${sprites}` : ''}`);
	}
	const otherPage = page === 1 ? 2 : 1;
	const header = `<strong>Battle Tower Levels - Page ${page}</strong> <em>(${bounds.desc})</em>`;
	const nav = `Use <code>/bt levels ${otherPage}</code> for page ${otherPage}.`;
	return `${header}<br />${rows.length ? rows.join('<br />') : `No levels on this page.`}<br /><br />${nav}`;
}

function getCurrentBTBattle(userid: ID) {
	for (const [roomid, state] of btBattles) {
		const room = Rooms.get(roomid);
		if (!room?.battle || room.battle.ended) continue;
		if (state.userid === userid) return room;
	}
	return null;
}

function packBTTeam(level: BTLevel) {
	const importedTeam = Teams.import(level.team);
	if (!importedTeam) throw new Chat.ErrorMessage(`Battle Tower level "${level.name}" does not have a valid team.`);
	normalizeBTTeam(importedTeam);
	reorderMarowakBossTeam(level, importedTeam);
	return Teams.pack(importedTeam);
}

function reorderMarowakBossTeam(level: BTLevel, importedTeam: PokemonSet[]) {
	if (level.medal !== 'marowak') return;
	const marowakIndex = importedTeam.findIndex(set => toID(set.species) === 'marowakalola');
	if (marowakIndex >= 0) {
		const [marowak] = importedTeam.splice(marowakIndex, 1);
		importedTeam.push(marowak);
	}
	const gengarIndex = importedTeam.findIndex(set => toID(set.species) === 'gengar');
	if (gengarIndex > 0) {
		const [gengar] = importedTeam.splice(gengarIndex, 1);
		importedTeam.unshift(gengar);
	}
}

function normalizeBTTeam(importedTeam: PokemonSet[]) {
	const dex = Dex.mod('gen9rrbt');
	for (const set of importedTeam) {
		const species = dex.species.get(set.species);
		if (!species.isMega) continue;
		if (toID(set.name) === 'theradicalred' && species.id === 'houndoommega') continue;
		const item = dex.items.get(set.item);
		const canMegaFromItem = item.megaStone === species.name;
		const canMegaFromMove = species.requiredMove && set.moves.some(move => toID(move) === toID(species.requiredMove));
		if (!canMegaFromItem && !canMegaFromMove) continue;
		const baseSpecies = dex.species.get(species.baseSpecies);
		if (!baseSpecies.exists) continue;
		set.species = baseSpecies.name;
		if (!Object.values(baseSpecies.abilities).some(ability => toID(ability) === toID(set.ability))) {
			set.ability = baseSpecies.abilities['0'];
		}
	}
}

function isBTChallenge(challenge: Ladders.Challenge) {
	return challenge.from === BT_CHALLENGER_ID && challenge.acceptCommand?.startsWith(`${BT_ACCEPT_COMMAND} `);
}

function clearBTChallenge(userid: ID) {
	btRequests.delete(userid);
	const challenges = Ladders.challenges.get(userid);
	if (!challenges) return;
	for (const challenge of [...challenges]) {
		if (isBTChallenge(challenge) || (
			challenge.from === userid && challenge.to === userid &&
			challenge.acceptCommand?.startsWith(`${BT_ACCEPT_COMMAND} `)
		)) {
			Ladders.challenges.remove(challenge);
		}
	}
}

function sendBTTeamRequest(user: User, levelIndex: number, replay: boolean) {
	clearBTChallenge(user.id);
	user.battleSettings.team = '';
	btRequests.set(user.id, {level: levelIndex, replay});
	const level = levels[levelIndex];
	const command = `${BT_ACCEPT_COMMAND} ${levelIndex + 1}`;
	const ready = new Ladders.BattleReady(user.id, TEAMBUILDER_FORMAT_ID, {
		...user.battleSettings,
		team: '',
	});
	const challenge = new Ladders.BattleChallenge(BT_CHALLENGER_ID, user.id, ready, {
		acceptCommand: command,
		message:
			`Choose a ${TEAMBUILDER_FORMAT_NAME} team for Battle Tower ${getBTLevelLabel(level, levelIndex)}` +
			`${replay ? ' (replay)' : ''}.`,
		acceptButton: 'Start Battle Tower',
		rejectButton: 'Cancel',
	});
	Ladders.challenges.add(challenge);
}

function resolveBTRequest(user: User, target: string) {
	const requestedLevel = parseInt(target);
	if (!isNaN(requestedLevel)) {
		const level = requestedLevel - 1;
		const request = btRequests.get(user.id);
		if (request?.level !== level) return null;
		return request;
	}
	return btRequests.get(user.id) || null;
}

async function prepareBTTeam(connection: Connection) {
	if (!connection.user.battleSettings.team) {
		connection.popup(`Select a ${TEAMBUILDER_FORMAT_NAME} team first.`);
		return null;
	}
	const ready = await Ladders(FORMAT_ID).prepBattle(connection, 'challenge');
	if (!ready) return null;
	return ready.settings;
}

function newHazards(): BTSideHazards {
	return {stealthrock: false, spikes: 0, toxicspikes: 0, stickyweb: false, gmaxsteelsurge: false};
}

function newFutureMoveState(): BTFutureMoveState {
	return {p1: [], p2: []};
}

function newPlayerStyle(): BTPlayerStyle {
	return {
		threatenedSwitches: 2,
		threatenedStays: 1,
		neutralSwitches: 1,
		neutralStays: 3,
	};
}

function toHazardID(name: string) {
	return toID(name.replace(/^move:\s*/i, '')) as keyof BTSideHazards;
}

function updateHazardState(
	state: BTBattleState, sideid: 'p1' | 'p2', hazardid: keyof BTSideHazards, started: boolean
) {
	const hazards = state.hazards[sideid];
	if (!hazards || !(hazardid in hazards)) return;
	const mutableHazards = hazards as AnyObject;
	if (!started) {
		if (typeof hazards[hazardid] === 'number') {
			mutableHazards[hazardid] = 0;
		} else {
			mutableHazards[hazardid] = false;
		}
		return;
	}
	if (hazardid === 'spikes') {
		hazards.spikes = Math.min(3, hazards.spikes + 1);
	} else if (hazardid === 'toxicspikes') {
		hazards.toxicspikes = Math.min(2, hazards.toxicspikes + 1);
	} else {
		mutableHazards[hazardid] = true;
	}
}

function getLineSideID(ident: string | undefined) {
	const match = /^(p[1-4])[a-z]?:/.exec(ident || '');
	return match?.[1] || '';
}

function recordPlayerAction(state: BTBattleState, switched: boolean) {
	const pending = state.pendingPlayerAction;
	if (!pending) return;
	const style = state.playerStyle;
	if (pending.threatened) {
		if (switched) {
			style.threatenedSwitches++;
		} else {
			style.threatenedStays++;
		}
	} else if (switched) {
		style.neutralSwitches++;
	} else {
		style.neutralStays++;
	}
	state.pendingPlayerAction = null;
}

function trackPivotPunishedSwitch(state: BTBattleState, parts: string[], moveid: ID) {
	const lastSwitch = state.lastBotSwitch;
	if (!lastSwitch) return;
	if (getBattleIdentID(parts[4]) !== lastSwitch.toIdent) return;
	const move = Dex.mod('gen9rrbt').moves.get(moveid) as AnyObject;
	if (move.selfSwitch) {
		if (!state.pivotPunishedSwitches) state.pivotPunishedSwitches = {};
		countTableValue(state.pivotPunishedSwitches, getPivotPunishKey(lastSwitch.targetSpecies, lastSwitch.toSpecies));
	}
	state.lastBotSwitch = null;
}

function clampInferenceMultiplier(value: number) {
	return Math.max(0.65, Math.min(1.75, value));
}

function getPossibleStatRange(pokemonData: AnyObject, stat: StatIDExceptHP) {
	const species = Dex.mod('gen9rrbt').species.get(getSpeciesName(pokemonData));
	const level = getLevel(pokemonData.details || '');
	const base = species.baseStats[stat] || 1;
	const minRaw = Math.floor(((2 * base) * level) / 100) + 5;
	const maxRaw = Math.floor(((2 * base + 31 + 63) * level) / 100) + 5;
	return {
		min: Math.max(1, Math.floor(minRaw * 0.9)),
		max: Math.max(1, Math.floor(maxRaw * 1.1)),
	};
}

function setInferredStatMultiplier(
	state: BTBattleState, ident: string | undefined, stat: StatIDExceptHP, multiplier: number, pokemonData?: AnyObject
) {
	if (!Number.isFinite(multiplier) || multiplier <= 0) return;
	if (!state.inferredStats) state.inferredStats = {};
	const identID = getBattleIdentID(ident);
	if (!state.inferredStats[identID]) state.inferredStats[identID] = {};
	if (pokemonData?.stats?.[stat]) {
		const range = getPossibleStatRange(pokemonData, stat);
		const baseline = Math.max(1, pokemonData.stats[stat]);
		multiplier = Math.max(range.min / baseline, Math.min(range.max / baseline, multiplier));
	}
	const old = state.inferredStats[identID][stat] || 1;
	const next = stat === 'spe' ? Math.max(old, multiplier) : (old * 2 + multiplier) / 3;
	state.inferredStats[identID][stat] = clampInferenceMultiplier(next);
}

function getInferenceContext(room: GameRoom, sourceSideid: string, state: BTBattleState): BTAIContext | undefined {
	if (sourceSideid !== 'p1' && sourceSideid !== 'p2') return undefined;
	const targetSideid = sourceSideid === 'p1' ? 'p2' : 'p1';
	const field = (room.battle as AnyObject | null)?.field || {};
	const sourceSide = getBattleSidePokemonData(room, sourceSideid, sourceSideid === 'p2' ? 'own' : 'opponent')
		.map(pokemonData => addPublicPokemonState(pokemonData, state))
		.filter(Boolean) as AnyObject[];
	const targetSide = getBattleSidePokemonData(room, targetSideid, targetSideid === 'p2' ? 'own' : 'opponent')
		.map(pokemonData => addPublicPokemonState(pokemonData, state))
		.filter(Boolean) as AnyObject[];
	return {
		weather: toID(field.weather),
		terrain: toID(field.terrain),
		sourceSide,
		ownSide: sourceSide,
		targetSide,
	};
}

function learnInferredItem(room: GameRoom, state: BTBattleState, ident: string | undefined, itemid: ID) {
	if (!itemid) return;
	learnOpponentMemoryValue(room, state, ident, 'items', itemid);
}

function learnInferredAbility(room: GameRoom, state: BTBattleState, ident: string | undefined, abilityid: ID) {
	if (!abilityid) return;
	learnOpponentMemoryValue(room, state, ident, 'abilities', abilityid);
}

function getPrimaryTypeBoostingItem(type: string) {
	return ((TYPE_BOOSTING_ITEMS[type] || [])[0] || '') as ID;
}

function inferOffensiveItemFromDamage(
	room: GameRoom, state: BTBattleState, event: BTLoggedMove, move: Move,
	sourceData: AnyObject, targetData: AnyObject, normalizedRatio: number, context?: BTAIContext
) {
	if (event.sourceSideid !== 'p1' || getPokemonItemID(sourceData)) return false;
	const type = getModifiedMoveType(move, sourceData, context);
	const typeMod = getMoveTypeModAgainstPokemon(move, type, sourceData, targetData);
	if (normalizedRatio >= 1.38 && move.category === 'Physical') {
		learnInferredItem(room, state, event.sourceIdent, 'choiceband' as ID);
		return true;
	}
	if (normalizedRatio >= 1.38 && move.category === 'Special') {
		learnInferredItem(room, state, event.sourceIdent, 'choicespecs' as ID);
		return true;
	}
	if (normalizedRatio >= 1.24 && normalizedRatio <= 1.37) {
		learnInferredItem(room, state, event.sourceIdent, 'lifeorb' as ID);
		return true;
	}
	if (normalizedRatio >= 1.08 && normalizedRatio <= 1.25) {
		learnInferredItem(room, state, event.sourceIdent, typeMod > 0 ? 'expertbelt' as ID : getPrimaryTypeBoostingItem(type));
		return true;
	}
	return false;
}

function inferOffensiveAbilityFromDamage(
	room: GameRoom, state: BTBattleState, event: BTLoggedMove, move: Move,
	sourceData: AnyObject, targetData: AnyObject, normalizedRatio: number, context?: BTAIContext
) {
	if (event.sourceSideid !== 'p1') return false;
	const type = getModifiedMoveType(move, sourceData, context);
	const maybeLearn = (abilityid: ID, min: number, max: number) => {
		if (normalizedRatio < min || normalizedRatio > max) return false;
		if (!pokemonCanHaveAbility(sourceData, abilityid)) return false;
		learnInferredAbility(room, state, event.sourceIdent, abilityid);
		return true;
	};
	let learned = false;
	if (move.flags['contact']) learned = maybeLearn('toughclaws' as ID, 1.18, 1.43) || learned;
	if (move.flags['punch']) learned = maybeLearn('ironfist' as ID, 1.12, 1.4) || learned;
	if (move.flags['bite']) learned = maybeLearn('strongjaw' as ID, 1.35, 1.7) || learned;
	if (move.flags['pulse']) learned = maybeLearn('megalauncher' as ID, 1.35, 1.7) || learned;
	if (move.flags['slicing']) learned = maybeLearn('sharpness' as ID, 1.35, 1.7) || learned;
	if (moveHasRecoilOrCrash(move)) learned = maybeLearn('reckless' as ID, 1.1, 1.34) || learned;
	if (type === 'Electric') learned = maybeLearn('transistor' as ID, 1.18, 1.45) || learned;
	if (type === 'Dragon') learned = maybeLearn('dragonsmaw' as ID, 1.35, 1.7) || learned;
	if (getSourceTypesForMove(sourceData, type).includes(type)) {
		learned = maybeLearn('adaptability' as ID, 1.22, 1.47) || learned;
	}
	return learned;
}

function inferStatsFromDamage(
	state: BTBattleState, event: BTLoggedMove, move: Move, normalizedRatio: number,
	sourceData: AnyObject, targetData: AnyObject
) {
	if (event.sourceSideid === 'p1' && (move.category === 'Physical' || move.category === 'Special')) {
		const stat = move.category === 'Physical' ? 'atk' : 'spa';
		if (normalizedRatio >= 0.82 && normalizedRatio <= 1.28) {
			setInferredStatMultiplier(state, event.sourceIdent, stat, normalizedRatio, sourceData);
		}
	}
	if (event.targetSideid === 'p1' && (move.category === 'Physical' || move.category === 'Special')) {
		const stat = move.category === 'Physical' ? 'def' : 'spd';
		if (normalizedRatio <= 0.82 || normalizedRatio >= 1.18) {
			setInferredStatMultiplier(state, event.targetIdent, stat, 1 / normalizedRatio, targetData);
		}
	}
}

function inferDamageFromHPDrop(
	room: GameRoom, state: BTBattleState, event: BTLoggedMove, actualDamage: number
) {
	if (actualDamage <= 0) return;
	if (event.sourceSideid !== 'p1' && event.targetSideid !== 'p1') return;
	const move = Dex.mod('gen9rrbt').moves.get(event.moveid);
	if (!move.exists || move.category === 'Status') return;
	const sourceData = getBattlePokemonDataByIdent(room, event.sourceIdent, state);
	const targetData = getBattlePokemonDataByIdent(room, event.targetIdent, state);
	if (!sourceData || !targetData) return;
	const context = getInferenceContext(room, event.sourceSideid, state);
	const expectedDamage = estimateDamage(event.moveid, sourceData, targetData, false, context);
	if (expectedDamage <= 0) return;
	const normalizedRatio = actualDamage / Math.max(1, expectedDamage * 0.925);
	const learnedAbility = inferOffensiveAbilityFromDamage(
		room, state, event, move, sourceData, targetData, normalizedRatio, context
	);
	if (!learnedAbility) {
		inferOffensiveItemFromDamage(room, state, event, move, sourceData, targetData, normalizedRatio, context);
	}
	inferStatsFromDamage(state, event, move, normalizedRatio, sourceData, targetData);
}

function estimateMaxUnboostedSpeed(pokemonData: AnyObject) {
	const species = Dex.mod('gen9rrbt').species.get(getSpeciesName(pokemonData));
	const level = getLevel(pokemonData.details || '');
	const baseSpeed = species.baseStats.spe || 1;
	const maxSpeed = Math.floor((Math.floor(((2 * baseSpeed + 31 + 63) * level) / 100) + 5) * 1.1);
	return Math.floor(maxSpeed * getBoostModifier(pokemonData.boosts?.spe || 0));
}

function inferSpeedFromMoveOrder(room: GameRoom, state: BTBattleState, parts: string[]) {
	const sideid = getLineSideID(parts[2]);
	if (sideid !== 'p1' || state.turnMoved?.p2) return;
	const sourceData = getBattlePokemonDataByIdent(room, parts[2], state);
	const targetData = getBattleActivePokemonData(room, 'p2', 0, 'own');
	if (!sourceData || !targetData) return;
	const context = getInferenceContext(room, 'p1', state);
	const reverseContext = getReverseContext(context);
	const move = Dex.mod('gen9rrbt').moves.get(parts[3]);
	if (!move.exists) return;
	const sourcePriority = estimateMovePriority(move, sourceData, targetData);
	const botDecision = state.lastDecisionByPokemon[getPokemonDecisionID(targetData)];
	let botPriority = 0;
	if (botDecision?.action.startsWith('move:')) {
		const botMoveID = toID(botDecision.action.split(':')[1]);
		const botMove = Dex.mod('gen9rrbt').moves.get(botMoveID);
		if (botMove.exists) botPriority = estimateMovePriority(botMove, targetData, sourceData);
	}
	if (sourcePriority !== botPriority) return;
	const botSpeed = estimateSpeed(targetData, reverseContext);
	const maxUnboostedSpeed = estimateMaxUnboostedSpeed(sourceData);
	if (maxUnboostedSpeed >= botSpeed) return;
	const speedMultiplier = Math.max(1.05, botSpeed / Math.max(1, maxUnboostedSpeed) * 1.05);
	setInferredStatMultiplier(state, parts[2], 'spe', speedMultiplier, sourceData);
	const possibleSpeedAbilities = ['chlorophyll', 'swiftswim', 'sandrush', 'slushrush', 'surgesurfer', 'unburden'] as ID[];
	const learnedAbility = possibleSpeedAbilities.find(ability => pokemonCanHaveAbility(sourceData, ability));
	if (learnedAbility) {
		learnInferredAbility(room, state, parts[2], learnedAbility);
	} else if (!getPokemonItemID(sourceData)) {
		learnInferredItem(room, state, parts[2], 'choicescarf' as ID);
	}
}

function trackBTOutcome(room: GameRoom, line: string, parts: string[], state: BTBattleState) {
	if (!state.turnMoved) state.turnMoved = {};
	if (!state.pendingWishes) state.pendingWishes = {p1: null, p2: null};
	if (!state.boostsByIdent) state.boostsByIdent = {};
	if (!state.volatilesByIdent) state.volatilesByIdent = {};
	if (!state.boosterBoostsByIdent) state.boosterBoostsByIdent = {};
	if (!state.hiddenPowerTypesByIdent) state.hiddenPowerTypesByIdent = {};
	if (!state.antiAttackPriorityFailures) state.antiAttackPriorityFailures = {};
	if (typeof state.turn !== 'number') state.turn = 0;
	if (line.startsWith('|turn|')) {
		state.turn = parseInt(parts[2]) || state.turn || 0;
		for (const sideid of ['p1', 'p2'] as const) {
			const pendingWish = state.pendingWishes?.[sideid];
			if (pendingWish && pendingWish.healTurn < state.turn) state.pendingWishes[sideid] = null;
		}
		state.turnMoved = {};
		state.lastMoveEvent = null;
		return;
	}
	if (line.startsWith('|switch|') || line.startsWith('|drag|')) {
		updateTrackedHP(state, parts[2], parts[4]);
		resetTrackedBoosts(state, parts[2]);
		resetTrackedVolatiles(state, parts[2]);
		resetTrackedBoosterBoost(state, parts[2]);
	}
	if (line.startsWith('|-damage|') || line.startsWith('|-heal|')) {
		const targetID = getBattleIdentID(parts[2]);
		const beforeHP = state.hpByIdent?.[targetID]?.hp;
		const after = parseHPState(parts[3]);
		if (
			line.startsWith('|-damage|') &&
			after &&
			typeof beforeHP === 'number' &&
			state.lastMoveEvent?.targetIdent === parts[2] &&
			!parts.some(part => /^\[from\]/.test(part))
		) {
			inferDamageFromHPDrop(room, state, state.lastMoveEvent, beforeHP - after.hp);
		}
		updateTrackedHP(state, parts[2], parts[3]);
		if (line.startsWith('|-heal|') && parts.some(part => /^\[from\] move: Wish$/i.test(part))) {
			const sideid = getLineSideID(parts[2]);
			if (sideid === 'p1' || sideid === 'p2') state.pendingWishes[sideid] = null;
		}
	}
	if (line.startsWith('|move|')) {
		const actorSideid = getLineSideID(parts[2]);
		inferSpeedFromMoveOrder(room, state, parts);
		state.turnMoved[actorSideid] = true;
		const loggedTargetID = getBattleIdentID(parts[4]);
		state.lastMoveEvent = {
			sourceIdent: parts[2],
			targetIdent: parts[4] || '',
			sourceSideid: actorSideid,
			targetSideid: getLineSideID(parts[4]),
			moveid: toID(parts[3]),
			targetHPBefore: state.hpByIdent?.[loggedTargetID]?.hp,
		};
		if (actorSideid !== 'p2') {
			if (actorSideid === 'p1') {
				recordPlayerAction(state, false);
				trackPivotPunishedSwitch(state, parts, toID(parts[3]));
			}
			state.lastLoggedMoveWasBot = false;
			state.lastLoggedMoveDecision = null;
			state.lastBotMoveOutcome = null;
			state.lastBotMoveOutcomeByTarget = {};
			return;
		}
		const actorID = getBattleIdentID(parts[2]);
		state.lastBotSwitch = null;
		const moveid = toID(parts[3]);
		if (moveid === 'wish' && (actorSideid === 'p1' || actorSideid === 'p2')) {
			const sourceData = getBattlePokemonDataByIdent(room, parts[2], state);
			const sourceHP = sourceData ? getHPData(sourceData) : null;
			state.pendingWishes[actorSideid] = {
				wisher: actorID,
				heal: sourceHP ? Math.max(1, Math.floor(sourceHP.maxhp / 2)) : 1,
				healTurn: (state.turn || 0) + 1,
			};
		}
		if (isStallingMove(moveid)) {
			state.pendingStallMoves[actorID] = true;
		} else {
			state.stallMoveCounters[actorID] = 1;
			delete state.pendingStallMoves[actorID];
		}
		const decision = state.lastDecisionByPokemon[actorID];
		if (!decision?.action.startsWith('move:')) {
			state.lastLoggedMoveWasBot = false;
			state.lastLoggedMoveDecision = null;
			state.lastBotMoveOutcome = null;
			state.lastBotMoveOutcomeByTarget = {};
			return;
		}
		const targetID = getBattleIdentID(parts[4]);
		const outcome: BTMoveOutcome = {
			decision,
			moveid,
			target: targetID,
			crit: false,
			missed: false,
			status: false,
			flinch: false,
			secondary: false,
		};
		state.lastBotMoveDecision = decision;
		state.lastBotMoveOutcome = outcome;
		state.lastBotMoveOutcomeByTarget = {};
		state.lastLoggedMoveWasBot = true;
		state.lastLoggedMoveDecision = decision;
		const targetSideid = getLineSideID(parts[4]);
		if (targetSideid === 'p1') {
			state.lastBotMoveByTarget[getBattleIdentID(parts[4])] = decision;
			state.lastBotMoveOutcomeByTarget[targetID] = outcome;
		}
		return;
	}
	if (line.startsWith('|switch|') && getLineSideID(parts[2]) === 'p1') {
		recordPlayerAction(state, true);
		state.lastBotSwitch = null;
		state.lastLoggedMoveWasBot = false;
		state.lastLoggedMoveDecision = null;
		state.lastBotMoveOutcome = null;
		state.lastBotMoveOutcomeByTarget = {};
		return;
	}
	if (line.startsWith('|-singleturn|')) {
		const actorID = getBattleIdentID(parts[2]);
		if (!state.pendingStallMoves[actorID]) return;
		const nextCounter = (state.stallMoveCounters[actorID] || 1) * 3;
		state.stallMoveCounters[actorID] = Math.min(nextCounter, 729);
		delete state.pendingStallMoves[actorID];
		return;
	}
	if (line.startsWith('|-fail|')) {
		const actorID = getBattleIdentID(parts[2]);
		if (state.lastLoggedMoveWasBot) {
			rememberAntiAttackPriorityFailure(state, state.lastBotMoveOutcome);
			rewardMoveOutcome(state, state.lastBotMoveOutcome, -0.45, false);
		}
		if (!state.pendingStallMoves[actorID]) return;
		state.stallMoveCounters[actorID] = 1;
		delete state.pendingStallMoves[actorID];
		return;
	}
	if (line.startsWith('|-immune|')) {
		if (state.lastLoggedMoveWasBot) rewardMoveOutcome(state, getLastBotOutcomeForTarget(state, parts[2]), -0.55, false);
		return;
	}
	if (line.startsWith('|-miss|')) {
		if (getLineSideID(parts[2]) === 'p2') {
			const outcome = state.lastBotMoveOutcome;
			if (outcome) {
				outcome.missed = true;
				rewardMoveOutcome(state, outcome, -0.04, false);
			}
		}
		return;
	}
	if (line.startsWith('|-crit|')) {
		if (getLineSideID(parts[2]) === 'p1') {
			const outcome = getLastBotOutcomeForTarget(state, parts[2]);
			if (outcome) outcome.crit = true;
		}
		return;
	}
	if (line.startsWith('|-status|') && getLineSideID(parts[2]) === 'p1') {
		const outcome = getLastBotOutcomeForTarget(state, parts[2]);
		if (outcome) {
			outcome.status = true;
			outcome.secondary = true;
			rewardMoveOutcome(state, outcome, 0.14, false);
		}
		return;
	}
	if (line.startsWith('|-activate|') && getLineSideID(parts[2]) === 'p1' && toID(parts[3]) === 'moveflinch') {
		const outcome = getLastBotOutcomeForTarget(state, parts[2]);
		if (outcome) {
			outcome.flinch = true;
			outcome.secondary = true;
			rewardMoveOutcome(state, outcome, 0.12, false);
		}
		return;
	}
	if (line.startsWith('|-start|') || line.startsWith('|-end|')) {
		trackVolatileUpdate(state, line, parts);
		trackBoosterBoostUpdate(state, line, parts);
	}
	if (line.startsWith('|-clearallboost|')) {
		state.boostsByIdent = {};
		return;
	}
	if (
		line.startsWith('|-boost|') || line.startsWith('|-unboost|') ||
		line.startsWith('|-setboost|') || line.startsWith('|-clearboost|') ||
		line.startsWith('|-clearpositiveboost|') || line.startsWith('|-clearnegativeboost|') ||
		line.startsWith('|-invertboost|')
	) {
		trackBoostUpdate(state, line, parts);
		const sideid = getLineSideID(parts[2]);
		if (
			state.lastLoggedMoveWasBot &&
			(line.startsWith('|-boost|') || line.startsWith('|-unboost|')) &&
			(sideid === 'p1' || sideid === 'p2')
		) {
			const outcome = sideid === 'p1' ? getLastBotOutcomeForTarget(state, parts[2]) : state.lastBotMoveOutcome;
			if (outcome) {
				outcome.secondary = true;
				rewardMoveOutcome(state, outcome, 0.08, false);
			}
		}
		return;
	}
	if (!line.startsWith('|faint|')) return;
	const faintedSideid = getLineSideID(parts[2]);
	const faintedID = getBattleIdentID(parts[2]);
	if (faintedSideid === 'p1') {
		const outcome = state.lastBotMoveOutcomeByTarget[faintedID] || state.lastBotMoveOutcome;
		const decision = outcome?.decision || state.lastBotMoveByTarget[faintedID] || state.lastBotMoveDecision;
		const delta = decision?.action.endsWith(':z') ? 0.85 : 0.6;
		outcome ? rewardMoveOutcome(state, outcome, delta) : rewardDecision(state, decision, delta);
		delete state.lastBotMoveByTarget[faintedID];
		delete state.lastBotMoveOutcomeByTarget[faintedID];
	} else if (faintedSideid === 'p2') {
		delete state.lastDecisionByPokemon[faintedID];
		delete state.pendingStallMoves[faintedID];
		delete state.stallMoveCounters[faintedID];
	}
	delete state.boostsByIdent?.[faintedID];
	delete state.volatilesByIdent?.[faintedID];
	delete state.boosterBoostsByIdent?.[faintedID];
}

function syncBattleState(room: GameRoom, state: BTBattleState) {
	const logs = room.log.log;
	for (let i = state.logIndex; i < logs.length; i++) {
		const line = logs[i];
		const parts = line.split('|');
		trackBTOutcome(room, line, parts, state);
		learnPublicAbilityFromLine(room, state, parts);
		if (line.startsWith('|move|')) {
			trackHiddenPowerUse(room, state, parts[2], parts[3]);
			if (getLineSideID(parts[2]) === 'p1') {
				const hiddenPowerType = state.hiddenPowerTypesByIdent?.[getBattleIdentID(parts[2])];
				const moveName = toID(parts[3]) === 'hiddenpower' && hiddenPowerType ?
					`Hidden Power ${hiddenPowerType}` : parts[3];
				learnOpponentMemoryValue(room, state, parts[2], 'moves', moveName);
				state.lastPlayerMoveByIdent[getBattleIdentID(parts[2])] = toID(moveName);
			}
		} else if (line.startsWith('|-ability|')) {
			if (getLineSideID(parts[2]) === 'p1') {
				learnOpponentMemoryValue(room, state, parts[2], 'abilities', parts[3]);
			}
		} else if (line.startsWith('|-activate|')) {
			if (getLineSideID(parts[2]) === 'p1') {
				const abilityMatch = /^ability:\s*(.*)$/i.exec(parts[3] || '');
				if (abilityMatch) learnOpponentMemoryValue(room, state, parts[2], 'abilities', abilityMatch[1]);
			}
		} else if (line.startsWith('|-item|') || line.startsWith('|-enditem|')) {
			if (getLineSideID(parts[2]) === 'p1') {
				const identID = getBattleIdentID(parts[2]);
				if (line.startsWith('|-item|')) {
					state.publicItems[identID] = toID(parts[3]);
					delete state.consumedItems[identID];
				} else {
					delete state.publicItems[identID];
					state.consumedItems[identID] = toID(parts[3]);
				}
				learnOpponentMemoryValue(room, state, parts[2], 'items', parts[3]);
			}
		}
		if (line.startsWith('|-sidestart|') || line.startsWith('|-sideend|')) {
			const sideid = parts[2]?.slice(0, 2);
			if (sideid !== 'p1' && sideid !== 'p2') continue;
			const hazardid = toHazardID(parts[3] || '');
			updateHazardState(state, sideid, hazardid, line.startsWith('|-sidestart|'));
		} else if (line.startsWith('|-start|')) {
			const sideid = parts[2]?.slice(0, 2);
			if (sideid !== 'p1' && sideid !== 'p2') continue;
			const perishMatch = /^perish([0-3])$/.exec(parts[3] || '');
			if (perishMatch) state.perish[sideid] = parseInt(perishMatch[1]);
			if (isFutureMoveEffect(parts[3])) {
				const targetSideid = sideid === 'p1' ? 'p2' : 'p1';
				setTrackedFutureMove(state, targetSideid, 0, true);
			}
		} else if (line.startsWith('|-end|')) {
			const sideid = parts[2]?.slice(0, 2);
			if (sideid !== 'p1' && sideid !== 'p2') continue;
			if (isFutureMoveEffect(parts[3])) {
				setTrackedFutureMove(state, sideid, getPositionFromIdent(parts[2]), false);
			}
		} else if (line.startsWith('|switch|') || line.startsWith('|faint|')) {
			const sideid = parts[2]?.slice(0, 2);
			if (sideid === 'p1' || sideid === 'p2') state.perish[sideid] = 0;
			if (sideid === 'p2') {
				const actorID = getBattleIdentID(parts[2]);
				delete state.pendingStallMoves[actorID];
				delete state.stallMoveCounters[actorID];
			}
		}
	}
	state.logIndex = logs.length;
}

function hasHazards(hazards: BTSideHazards) {
	return !!(
		hazards.stealthrock || hazards.spikes || hazards.toxicspikes ||
		hazards.stickyweb || hazards.gmaxsteelsurge
	);
}

function pokemonAvoidsEntryHazards(pokemonData: AnyObject | null) {
	return !!pokemonData && (
		getPokemonItemID(pokemonData) === 'heavydutyboots' ||
		pokemonCanHaveAbility(pokemonData, 'shielddust' as ID)
	);
}

function estimateHazardDamage(pokemonData: AnyObject | null, hazards?: BTSideHazards) {
	if (!pokemonData || !hazards || pokemonAvoidsEntryHazards(pokemonData)) return 0;
	const hp = getHPData(pokemonData);
	let damage = 0;
	if (hazards.stealthrock) {
		const dex = Dex.mod('gen9rrbt');
		let typeMod = 0;
		for (const type of getPokemonTypes(pokemonData)) {
			typeMod += dex.getEffectiveness('Rock', type);
		}
		damage += Math.floor(hp.maxhp * Math.pow(2, typeMod) / 8);
	}
	if (hazards.spikes && pokemonIsGrounded(pokemonData)) {
		const divisor = hazards.spikes >= 3 ? 4 : hazards.spikes === 2 ? 6 : 8;
		damage += Math.floor(hp.maxhp / divisor);
	}
	if (hazards.gmaxsteelsurge) damage += Math.floor(hp.maxhp / 8);
	return Math.max(0, damage);
}

function getHazardDamageFraction(pokemonData: AnyObject | null, hazards?: BTSideHazards) {
	if (!pokemonData) return 0;
	const hp = getHPData(pokemonData);
	return estimateHazardDamage(pokemonData, hazards) / Math.max(1, hp.maxhp);
}

function pokemonHasHazardRemovalMove(pokemonData: AnyObject | null) {
	return !!pokemonData && getPokemonMoveIDs(pokemonData).some(moveid => HAZARD_REMOVAL_MOVE_IDS.has(moveid));
}

function getSideHazardPressure(side: AnyObject[] | undefined, hazards?: BTSideHazards) {
	if (!side || !hazards || !hasHazards(hazards)) return {score: 0, critical: 0, total: 0};
	let total = 0;
	let critical = 0;
	for (const pokemonData of remainingSidePokemon(side)) {
		const hp = getHPData(pokemonData);
		const damage = estimateHazardDamage(pokemonData, hazards);
		if (!damage) continue;
		const fraction = damage / Math.max(1, hp.maxhp);
		total += fraction;
		if (damage >= hp.hp || fraction >= 0.24 || damage >= hp.hp * 0.45) critical++;
	}
	return {
		score: Math.min(140, total * 48 + critical * 26),
		critical,
		total,
	};
}

function getHazardRemovalUrgency(pokemonData: AnyObject, hazards: BTSideHazards | undefined, context?: BTAIContext) {
	if (!hazards || !hasHazards(hazards)) return 0;
	const pressure = getSideHazardPressure(context?.ownSide, hazards);
	const selfFraction = getHazardDamageFraction(pokemonData, hazards);
	let score = pressure.score + selfFraction * 95;
	if (pressure.critical) score += 28;
	if (pokemonIsHazardSensitiveSweeper(pokemonData, context) && selfFraction >= 0.16) score += 22;
	return Math.min(165, score);
}

function pokemonIsHazardSensitiveSweeper(pokemonData: AnyObject | null, context?: BTAIContext) {
	if (!pokemonData || pokemonAvoidsEntryHazards(pokemonData) || pokemonCanRecover(pokemonData)) return false;
	const species = Dex.mod('gen9rrbt').species.get(getSpeciesName(pokemonData));
	const item = getPokemonItemID(pokemonData);
	if (item === 'leftovers' || getPokemonAbilityID(pokemonData) === 'regenerator') return false;
	const offensiveStat = Math.max(species.baseStats.atk || 0, species.baseStats.spa || 0);
	const speed = species.baseStats.spe || 0;
	return (
		speed >= 105 ||
		offensiveStat >= 120 ||
		((['swiftswim', 'chlorophyll', 'sandrush', 'slushrush'] as ID[]).some(ability => pokemonCanHaveAbility(pokemonData, ability)) &&
			!!context?.weather)
	);
}

function getHazardSwitchPenalty(
	switchOption: AnyObject, targetData: AnyObject | null, entryDamage: number, damageIn: number,
	damageOut: number, hazards?: BTSideHazards, context?: BTAIContext
) {
	if (!hazards || !hasHazards(hazards) || !entryDamage) return 0;
	const hp = getHPData(switchOption);
	const targetHP = targetData ? getHPData(targetData) : null;
	const entryFraction = entryDamage / Math.max(1, hp.maxhp);
	const remainingAfterEntry = Math.max(1, hp.hp - entryDamage);
	const projectedAfterHit = remainingAfterEntry - damageIn;
	let penalty = entryFraction * 95;
	if (entryFraction >= 0.2) penalty += 28;
	if (pokemonIsHazardSensitiveSweeper(switchOption, context)) penalty += entryFraction >= 0.18 ? 52 : 22;
	if (projectedAfterHit > 0 && estimateHazardDamage(switchOption, hazards) >= projectedAfterHit) {
		penalty += targetHP && damageOut >= targetHP.hp ? 18 : 92;
	}
	if (damageIn >= remainingAfterEntry * 0.65 && (!targetHP || damageOut < targetHP.hp)) penalty += 58;
	return Math.min(185, penalty);
}

function scoreLeadIntoTarget(leadData: AnyObject, targetData: AnyObject, context: BTAIContext) {
	const leadHP = getHPData(leadData);
	const targetHP = getHPData(targetData);
	const damageOut = estimateBestDamageFromPokemon(leadData, targetData, context);
	const damageIn = estimateBestDamageFromPokemon(targetData, leadData, getReverseContext(context));
	const priorityOut = estimateBestPriorityDamageFromPokemon(leadData, targetData, context);
	let score =
		Math.min(damageOut, targetHP.hp) / Math.max(1, targetHP.maxhp) * 95 -
		Math.min(damageIn, leadHP.hp) / Math.max(1, leadHP.maxhp) * 90;
	if (damageOut >= targetHP.hp) score += 30;
	if (damageIn >= leadHP.hp) score -= 42;
	if (priorityOut.damage > 0) {
		score += Math.min(22, priorityOut.damage / Math.max(1, targetHP.maxhp) * 36);
	}
	if (pokemonHasMoveTag(leadData, 'hazard') && !sideHasAbility(context.targetSide, 'magicbounce' as ID)) score += 8;
	if (getBestSelfSwitchThreat(leadData, targetData, context).hasPivot) score += 10;
	return score;
}

function scoreLeadOption(
	leadData: AnyObject, targetSide: AnyObject[], state: BTBattleState, context: BTAIContext
) {
	if (!targetSide.length) return memoryScore(getMemoryKey(state, leadData, null, 'lead')) * 18;
	let total = 0;
	let worst = Infinity;
	let best = -Infinity;
	for (const targetData of targetSide) {
		const hp = getHPData(targetData);
		if (hp.hp <= 0) continue;
		const score = scoreLeadIntoTarget(leadData, targetData, context);
		total += score;
		worst = Math.min(worst, score);
		best = Math.max(best, score);
	}
	const count = Math.max(1, targetSide.length);
	let score = total / count + (Number.isFinite(worst) ? worst * 0.35 : 0) + (Number.isFinite(best) ? best * 0.15 : 0);
	score += memoryScore(getMemoryKey(state, leadData, null, 'lead')) * 18;
	const archetype = getTeamArchetype(targetSide, context);
	if (archetype === 'hyperoffense' && estimateBestPriorityDamageFromPokemon(leadData, targetSide[0], context).damage > 0) {
		score += 8;
	}
	return score;
}

function chooseMatchupLeadOrder(request: AnyObject, room: GameRoom, state: BTBattleState) {
	const pokemon = request.side?.pokemon || [];
	if (!pokemon.length) return 'default';
	const targetSide = getBattleSidePokemonData(room, 'p1', 'opponent').map(pokemonData => addPublicPokemonState(pokemonData, state));
	const context: BTAIContext = {
		weather: '' as ID,
		terrain: '' as ID,
		sourceSide: pokemon,
		ownSide: pokemon,
		targetSide,
	};
	const scored = pokemon.map((pokemonData: AnyObject, index: number) => ({
		index,
		score: scoreLeadOption(pokemonData, targetSide, state, context),
	}));
	scored.sort((a, b) => b.score - a.score);
	const lead = scored[0];
	if (lead) rememberDecision(state, pokemon[lead.index], null, 'lead');
	return `team ${scored.map(entry => entry.index + 1).join(', ')}`;
}

function chooseTeamPreview(request: AnyObject, state: BTBattleState, room: GameRoom) {
	if (levels[state.level]?.medal === 'marowak') {
		const pokemon = request.side?.pokemon || [];
		const leadIndex = pokemon.findIndex((pokemonData: AnyObject) => toID(getSpeciesName(pokemonData)) === 'gengar');
		const marowakIndex = pokemon.findIndex((pokemonData: AnyObject) => getSpeciesID(pokemonData) === 'marowakalola');
		if (leadIndex >= 0) {
			const order = [leadIndex + 1];
			for (let i = 0; i < pokemon.length; i++) {
				if (i !== leadIndex && i !== marowakIndex) order.push(i + 1);
			}
			if (marowakIndex >= 0) order.push(marowakIndex + 1);
			return `team ${order.join(', ')}`;
		}
	}
	return chooseMatchupLeadOrder(request, room, state);
}

function getFoeRequest(room: GameRoom, sideid: 'p1' | 'p2') {
	const foeSideid = sideid === 'p1' ? 'p2' : 'p1';
	const foe = room.battle?.[foeSideid];
	try {
		if (foe?.request.request) return JSON.parse(foe.request.request);
	} catch {}
	return null;
}

function getAIContext(room: GameRoom, request?: AnyObject, state?: BTBattleState): BTAIContext {
	const field = (room.battle as AnyObject | null)?.field || {};
	const ownSideid = request?.side?.id as 'p1' | 'p2' | undefined;
	const foeSideid = ownSideid === 'p1' ? 'p2' : 'p1';
	const rawOwnSide = ownSideid ? getBattleSidePokemonData(room, ownSideid, 'own') : request?.side?.pokemon;
	const ownSide = rawOwnSide?.map((pokemonData: AnyObject) => addTrackedStateToPokemonData(pokemonData, state));
	let targetSide = ownSideid ? getBattleSidePokemonData(room, foeSideid, 'opponent') : [];
	if (!targetSide.length && ownSideid) targetSide = getSanitizedFoeRequestSideData(room, ownSideid);
	targetSide = targetSide.map(pokemonData => addPublicPokemonState(pokemonData, state));
	return {
		weather: toID(field.weather),
		terrain: toID(field.terrain),
		sourceSide: ownSide || request?.side?.pokemon,
		ownSide,
		targetSide,
	};
}

function getPokemonMoveIDsFromData(pokemonData: AnyObject) {
	const moves = pokemonData.moves || [];
	return moves.map((move: AnyObject) => toID(typeof move === 'string' ? move : move.id || move.move)).filter(Boolean);
}

function getDamagingPriorityMoveIDs() {
	if (damagingPriorityMoveIDs) return damagingPriorityMoveIDs;
	const dex = Dex.mod('gen9rrbt');
	damagingPriorityMoveIDs = new Set<ID>();
	for (const moveid of Object.keys(dex.data.Moves)) {
		const move = dex.moves.get(moveid);
		if (move.exists && move.priority > 0 && move.category !== 'Status') {
			damagingPriorityMoveIDs.add(move.id);
		}
	}
	return damagingPriorityMoveIDs;
}

function getLearnsetSpeciesIDs(species: Species) {
	const dex = Dex.mod('gen9rrbt');
	const ids: ID[] = [];
	const seen = new Set<ID>();
	const addSpeciesLine = (startSpecies: Species) => {
		let curSpecies = startSpecies;
		while (curSpecies.exists && !seen.has(curSpecies.id)) {
			seen.add(curSpecies.id);
			ids.push(curSpecies.id);
			if (!curSpecies.prevo) break;
			curSpecies = dex.species.get(curSpecies.prevo);
		}
	};
	addSpeciesLine(species);
	const baseSpecies = dex.species.get(species.baseSpecies);
	addSpeciesLine(baseSpecies);
	return ids;
}

function getLearnsetPriorityMoveIDs(pokemonData: AnyObject | null) {
	if (!pokemonData) return [] as ID[];
	const dex = Dex.mod('gen9rrbt');
	const species = dex.species.get(getSpeciesName(pokemonData));
	if (!species.exists) return [] as ID[];
	if (learnsetPriorityMoveCache.has(species.id)) return learnsetPriorityMoveCache.get(species.id)!;
	const priorityMoves = getDamagingPriorityMoveIDs();
	const moveids = new Set<ID>();
	for (const speciesid of getLearnsetSpeciesIDs(species)) {
		const learnset = dex.data.Learnsets[speciesid]?.learnset || {};
		for (const moveid of Object.keys(learnset)) {
			const id = toID(moveid);
			if (priorityMoves.has(id)) moveids.add(id);
		}
	}
	const result = [...moveids];
	learnsetPriorityMoveCache.set(species.id, result);
	return result;
}

function getPokemonMoveIDs(pokemonData: AnyObject) {
	const moveids = getPokemonMoveIDsFromData(pokemonData);
	if (moveids.length) return moveids;

	const dex = Dex.mod('gen9rrbt');
	const species = dex.species.get(getSpeciesName(pokemonData));
	const commonSetMoves = getCommonSetMoveIDs(species.id);
	const memoryMoves = getRankedMemoryIDs(opponentMemory[species.id]?.moves);
	const knownRandomSetMoves = rrRandomSetMoves[species.id] || rrRandomSetMoves[toID(species.baseSpecies)] || [];
	const formatsData = dex.data.FormatsData[species.id] || dex.data.FormatsData[toID(species.baseSpecies)] || {};
	const randomMoves = ((formatsData.randomBattleMoves || formatsData.randomDoubleBattleMoves || []) as string[])
		.map(move => toID(move)).filter(Boolean);
	const priorityMoves = getLearnsetPriorityMoveIDs(pokemonData);
	return [...new Set([...commonSetMoves, ...memoryMoves, ...knownRandomSetMoves, ...randomMoves, ...priorityMoves])];
}

function getEstimatedStat(base: number, level: number, hp = false) {
	if (hp) return Math.floor(((2 * base + 31 + 21) * level) / 100) + level + 10;
	return Math.floor(((2 * base + 31 + 21) * level) / 100) + 5;
}

function getEstimatedStatsForSpecies(species: Species, level: number) {
	return {
		atk: getEstimatedStat(species.baseStats.atk, level),
		def: getEstimatedStat(species.baseStats.def, level),
		spa: getEstimatedStat(species.baseStats.spa, level),
		spd: getEstimatedStat(species.baseStats.spd, level),
		spe: getEstimatedStat(species.baseStats.spe, level),
	};
}

function getEstimatedStats(pokemon: Pokemon) {
	const species = pokemon.species;
	const level = pokemon.level || 100;
	return getEstimatedStatsForSpecies(species, level);
}

function addBattlePokemonState(data: AnyObject, pokemon: Pokemon) {
	return {
		...data,
		boosts: {...pokemon.boosts},
		volatileState: Object.fromEntries(Object.entries(pokemon.volatiles).map(([id, volatile]) => [
			id, {
				bestStat: (volatile as AnyObject).bestStat,
				fromBooster: !!(volatile as AnyObject).fromBooster,
			},
		])),
		activeTurns: pokemon.activeTurns,
		activeMoveActions: pokemon.activeMoveActions,
		timesAttacked: pokemon.timesAttacked,
		newlySwitched: pokemon.newlySwitched,
	};
}

function addPublicPokemonState(data: AnyObject | null, state?: BTBattleState) {
	if (!data || !state) return data;
	const decisionID = getPokemonDecisionID(data);
	const publicItem = state.publicItems[decisionID];
	const consumedItem = state.consumedItems?.[decisionID];
	let result = publicItem ? {...data, item: publicItem} : data;
	result = addTrackedStateToPokemonData(result, state);
	const observedMoves = Object.keys(state.observedPlayerSets?.[decisionID]?.moves || {}) as ID[];
	if (observedMoves.length >= 4) result = {...result, moves: observedMoves};
	if (!result.item) {
		const memoryItem = getLikelyMemoryItemID(result);
		if (memoryItem && memoryItem !== consumedItem) result = {...result, item: memoryItem};
	}
	const inferredStats = state.inferredStats?.[getPokemonDecisionID(result)];
	if (inferredStats && result.stats) {
		const stats = {...result.stats};
		for (const [stat, multiplier] of Object.entries(inferredStats)) {
			if (typeof multiplier !== 'number' || !(stats as AnyObject)[stat]) continue;
			(stats as AnyObject)[stat] = Math.max(1, Math.floor((stats as AnyObject)[stat] * multiplier));
		}
		result = {...result, stats};
	}
	return result;
}

function getSanitizedOpponentPokemonData(pokemon: Pokemon) {
	const estimatedMaxHP = Math.max(1, getEstimatedStat(pokemon.species.baseStats.hp, pokemon.level || 100, true));
	const hpFraction = pokemon.maxhp > 0 ? pokemon.hp / pokemon.maxhp : 0;
	const estimatedHP = pokemon.fainted ? 0 : Math.max(1, Math.round(estimatedMaxHP * hpFraction));
	return addBattlePokemonState({
		ident: pokemon.fullname,
		details: pokemon.details,
		condition: pokemon.fainted ? '0 fnt' : `${estimatedHP}/${estimatedMaxHP}`,
		active: pokemon.position < pokemon.side.active.length,
		stats: getEstimatedStats(pokemon),
		moves: [],
		item: '',
		ability: '',
		baseAbility: '',
	}, pokemon);
}

function getSanitizedRequestPokemonData(pokemonData: AnyObject) {
	const species = Dex.mod('gen9rrbt').species.get(getSpeciesName(pokemonData));
	const level = getLevel(pokemonData.details || '');
	return {
		ident: pokemonData.ident,
		details: pokemonData.details,
		condition: pokemonData.condition,
		active: !!pokemonData.active,
		stats: getEstimatedStatsForSpecies(species, level),
		boosts: {...(pokemonData.boosts || {})},
		moves: [],
		item: '',
		ability: '',
		baseAbility: '',
	};
}

function getSanitizedFoeRequestSideData(room: GameRoom, ownSideid: 'p1' | 'p2') {
	const foeRequest = getFoeRequest(room, ownSideid);
	return (foeRequest?.side?.pokemon || []).map((pokemonData: AnyObject) => getSanitizedRequestPokemonData(pokemonData));
}

function getBattleSidePokemonData(room: GameRoom, sideid: 'p1' | 'p2', visibility: 'own' | 'opponent' = 'own') {
	const side = room.battle?.[sideid];
	if (!side?.pokemon) return [];
	return side.pokemon.map((pokemon: Pokemon) => (
		visibility === 'own' ? addBattlePokemonState(pokemon.getSwitchRequestData(true), pokemon) : getSanitizedOpponentPokemonData(pokemon)
	));
}

function getBattlePokemonByIdent(room: GameRoom, ident: string | undefined) {
	if (!ident || !room.battle) return null;
	const sideid = getLineSideID(ident);
	if (sideid !== 'p1' && sideid !== 'p2') return null;
	const side = room.battle[sideid];
	return side?.pokemon?.find((pokemon: Pokemon) => pokemon.fullname === ident) || null;
}

function getBattlePokemonDataByIdent(room: GameRoom, ident: string | undefined, state?: BTBattleState) {
	const pokemon = getBattlePokemonByIdent(room, ident);
	if (!pokemon) return null;
	const sideid = getLineSideID(ident);
	const data = sideid === 'p2' ?
		addBattlePokemonState(pokemon.getSwitchRequestData(true), pokemon) :
		getSanitizedOpponentPokemonData(pokemon);
	return addPublicPokemonState(data, state);
}

function getBattleActivePokemon(room: GameRoom, sideid: 'p1' | 'p2', index = 0) {
	const pokemon = (room.battle as AnyObject | null)?.[sideid]?.active?.[index] as Pokemon | null | undefined;
	if (!pokemon || pokemon.fainted) return null;
	return pokemon;
}

function getBattleActivePokemonData(room: GameRoom, sideid: 'p1' | 'p2', index = 0, visibility: 'own' | 'opponent' = 'own') {
	const pokemon = getBattleActivePokemon(room, sideid, index);
	if (!pokemon || pokemon.fainted) return null;
	return visibility === 'own' ? addBattlePokemonState(pokemon.getSwitchRequestData(true), pokemon) : getSanitizedOpponentPokemonData(pokemon);
}

function getTargetPokemon(room: GameRoom, ownSideid: 'p1' | 'p2', index = 0) {
	const foeSideid = ownSideid === 'p1' ? 'p2' : 'p1';
	return getBattleActivePokemon(room, foeSideid, index);
}

function getTargetPokemonData(room: GameRoom, ownSideid: 'p1' | 'p2', index = 0, state?: BTBattleState) {
	const foeSideid = ownSideid === 'p1' ? 'p2' : 'p1';
	const battleData = getBattleActivePokemonData(room, foeSideid, index, 'opponent');
	if (battleData) return addPublicPokemonState(battleData, state);
	const foeRequest = getFoeRequest(room, ownSideid);
	const requestData = foeRequest ? getActivePokemonData(foeRequest, index) : null;
	return requestData ? addPublicPokemonState(getSanitizedRequestPokemonData(requestData), state) : null;
}

function getPokemonAbilityID(pokemonData: AnyObject | null) {
	if (!pokemonData) return '' as ID;
	return toID(pokemonData.ability || pokemonData.baseAbility || pokemonData.abilityData?.id);
}

function getPossiblePokemonAbilityIDsFromData(pokemonData: AnyObject | null) {
	const knownAbility = getPokemonAbilityID(pokemonData);
	if (knownAbility) return [knownAbility];
	return [] as ID[];
}

function getPossiblePokemonAbilityIDs(pokemonData: AnyObject | null) {
	const knownAbilities = getPossiblePokemonAbilityIDsFromData(pokemonData);
	if (knownAbilities.length) return knownAbilities;
	if (!pokemonData) return [];
	const species = Dex.mod('gen9rrbt').species.get(getSpeciesName(pokemonData));
	const memoryAbilities = getRankedMemoryIDs(opponentMemory[species.id]?.abilities);
	const speciesAbilities = Object.values(species.abilities).map(ability => toID(ability)).filter(Boolean);
	return [...new Set([...memoryAbilities, ...speciesAbilities])];
}

function pokemonCanHaveAbility(pokemonData: AnyObject | null, ability: ID) {
	return getPossiblePokemonAbilityIDs(pokemonData).includes(ability);
}

function speciesCanHaveAbility(pokemonData: AnyObject | null, ability: ID) {
	if (!pokemonData) return false;
	const species = Dex.mod('gen9rrbt').species.get(getSpeciesName(pokemonData));
	return Object.values(species.abilities).some(speciesAbility => toID(speciesAbility) === ability);
}

function getPokemonItemID(pokemonData: AnyObject | null) {
	if (!pokemonData) return '' as ID;
	return toID(pokemonData.item);
}

function itemUserMatchesPokemon(item: AnyObject, species: AnyObject) {
	const itemUsers = ((item.itemUser || []) as string[]).map(itemUser => toID(itemUser));
	const speciesIDs = [species.id, toID(species.name), toID(species.baseSpecies)];
	return itemUsers.some(itemUser => speciesIDs.includes(itemUser));
}

function pokemonItemCanBeKnockedOff(pokemonData: AnyObject | null) {
	const itemid = getPokemonItemID(pokemonData);
	if (!itemid || !pokemonData) return false;
	const dex = Dex.mod('gen9rrbt');
	const item = dex.items.get(itemid) as AnyObject;
	if (!item.exists) return false;
	if (item.onTakeItem === false || item.megaStone || item.zMove) return false;
	const species = dex.species.get(getSpeciesName(pokemonData)) as AnyObject;
	if (item.forcedForme && (itemUserMatchesPokemon(item, species) || toID(species.baseSpecies) === 'ogerpon')) {
		return false;
	}
	if (typeof item.onTakeItem === 'function' && itemUserMatchesPokemon(item, species)) return false;
	if (item.megaEvolves && toID(item.megaEvolves) === toID(species.baseSpecies)) return false;
	return true;
}

function normalizeWeather(weather: string | undefined) {
	const weatherid = toID(weather);
	if (weatherid === 'hail') return 'snow' as ID;
	if (weatherid === 'raindance' || weatherid === 'rain') return 'raindance' as ID;
	if (weatherid === 'sunnyday' || weatherid === 'sun') return 'sunnyday' as ID;
	return weatherid;
}

function getWeatherGroup(weather: string | undefined) {
	const weatherid = normalizeWeather(weather);
	if (weatherid === 'desolateland') return 'sunnyday' as ID;
	if (weatherid === 'primordialsea') return 'raindance' as ID;
	return weatherid;
}

function hasWeather(context: BTAIContext | undefined, weather: ID) {
	if (!context?.weather) return false;
	return getWeatherGroup(context.weather) === getWeatherGroup(weather);
}

function weatherCanOverride(currentWeather: ID, nextWeather: ID) {
	if (!nextWeather || getWeatherGroup(currentWeather) === getWeatherGroup(nextWeather)) return false;
	const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
	return !strongWeathers.includes(currentWeather) || strongWeathers.includes(nextWeather);
}

function applyWeatherContext(context: BTAIContext | undefined, weather: ID) {
	if (!weather) return context;
	const currentWeather = normalizeWeather(context?.weather);
	if (!weatherCanOverride(currentWeather, weather)) return context;
	return {...(context || {terrain: '' as ID}), weather} as BTAIContext;
}

function getMoveWeather(move: Move) {
	return normalizeWeather((move as AnyObject).weather);
}

function getPokemonWeatherAbilityWeather(pokemonData: AnyObject | null) {
	for (const abilityid of getPossiblePokemonAbilityIDs(pokemonData)) {
		const weather = WEATHER_SETTER_ABILITIES[abilityid];
		if (weather) return weather;
	}
	return '' as ID;
}

function getWeatherContextAfterPokemonSwitch(pokemonData: AnyObject | null, context?: BTAIContext) {
	return applyWeatherContext(context, getPokemonWeatherAbilityWeather(pokemonData));
}

function pokemonIsGrounded(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	if (getPokemonItemID(pokemonData) === 'ironball') return true;
	if (pokemonDataHasVolatile(pokemonData, 'ingrain') || pokemonDataHasVolatile(pokemonData, 'smackdown')) return true;
	if (getPokemonItemID(pokemonData) === 'airballoon') return false;
	if (pokemonDataHasVolatile(pokemonData, 'magnetrise') || pokemonDataHasVolatile(pokemonData, 'telekinesis')) return false;
	if (pokemonCanHaveAbility(pokemonData, 'levitate' as ID)) return false;
	return !getPokemonTypes(pokemonData).includes('Flying');
}

function pokemonCanIgnoreTrapping(pokemonData: AnyObject | null) {
	if (!pokemonData) return true;
	if (getPokemonItemID(pokemonData) === 'shedshell') return true;
	return getPokemonTypes(pokemonData).includes('Ghost');
}

function pokemonIsTrappedByTarget(pokemonData: AnyObject | null, targetData: AnyObject | null) {
	if (!pokemonData || !targetData || pokemonCanIgnoreTrapping(pokemonData)) return false;
	if (pokemonCanHaveAbility(targetData, 'arenatrap' as ID) && pokemonIsGrounded(pokemonData)) return true;
	if (pokemonCanHaveAbility(targetData, 'magnetpull' as ID) && getPokemonTypes(pokemonData).includes('Steel')) return true;
	if (pokemonCanHaveAbility(targetData, 'shadowtag' as ID) && !pokemonCanHaveAbility(pokemonData, 'shadowtag' as ID)) {
		return true;
	}
	return false;
}

function countFaintedAllies(context: BTAIContext | undefined) {
	if (!context?.sourceSide) return 0;
	return context.sourceSide.filter(pokemonData => pokemonData.condition?.endsWith(' fnt')).length;
}

function sourceIgnoresTargetAbility(sourceData: AnyObject, move: Move) {
	return !!(move as AnyObject).ignoreAbility ||
		(['moldbreaker', 'teravolt', 'turboblaze'] as ID[]).some(ability => pokemonCanHaveAbility(sourceData, ability));
}

function moveIgnoresTypeImmunity(move: Move, type: string, sourceData: AnyObject, targetType?: string) {
	if (move.flags['futuremove']) return false;
	const ignoreImmunity = (move as AnyObject).ignoreImmunity;
	if (ignoreImmunity === true) return true;
	if (ignoreImmunity && typeof ignoreImmunity === 'object' && ignoreImmunity[type]) return true;
	if (
		targetType === 'Ghost' &&
		['Normal', 'Fighting'].includes(type) &&
		pokemonCanHaveAbility(sourceData, 'scrappy' as ID)
	) return true;
	if (targetType === 'Steel' && type === 'Poison' && pokemonCanHaveAbility(sourceData, 'corrosion' as ID)) {
		return true;
	}
	return false;
}

function moveHasSelfKO(move: Move) {
	return !!move.selfdestruct || !!(move as AnyObject).mindBlownRecoil;
}

function moveCanHitThroughSturdy(move: Move, sourceData: AnyObject, useZMove = false) {
	if (!useZMove) {
		const multihit = move.multihit as number | number[] | null | undefined;
		if (typeof multihit === 'number' && multihit > 1) return true;
		if (Array.isArray(multihit) && multihit[1] > 1) return true;
		if (pokemonCanHaveAbility(sourceData, 'parentalbond' as ID)) return true;
	}
	return false;
}

function sturdyPreventsOHKO(move: Move, sourceData: AnyObject, targetData: AnyObject, damage: number, useZMove = false) {
	const targetHP = getHPData(targetData);
	if (targetHP.hp < targetHP.maxhp) return false;
	if (damage < targetHP.hp) return false;
	if (!speciesCanHaveAbility(targetData, 'sturdy' as ID)) return false;
	if (sourceIgnoresTargetAbility(sourceData, move)) return false;
	if (moveCanHitThroughSturdy(move, sourceData, useZMove)) return false;
	return true;
}

function abilityBlocksDamagingMove(move: Move, type: string, sourceData: AnyObject, targetData: AnyObject) {
	if (sourceIgnoresTargetAbility(sourceData, move)) return false;
	const targetHasAbility = (ability: ID) => pokemonCanHaveAbility(targetData, ability);
	if (moveHasSelfKO(move) && targetHasAbility('damp' as ID)) return true;
	if (estimateMovePriority(move, sourceData, targetData) > 0 && [...PRIORITY_BLOCKING_ABILITIES].some(targetHasAbility)) {
		return true;
	}
	if (type === 'Ground' && targetHasAbility('levitate' as ID) && !moveIgnoresTypeImmunity(move, type, sourceData)) return true;
	if (type === 'Ground' && targetHasAbility('eartheater' as ID)) return true;
	if (type === 'Water' && (['dryskin', 'stormdrain', 'waterabsorb'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Electric' && (['lightningrod', 'motordrive', 'voltabsorb'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Fire' && (['flashfire', 'wellbakedbody'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Grass' && targetHasAbility('sapsipper' as ID)) return true;
	if (move.flags['bullet'] && targetHasAbility('bulletproof' as ID)) return true;
	if (move.flags['sound'] && targetHasAbility('soundproof' as ID)) return true;
	if (move.flags['wind'] && targetHasAbility('windrider' as ID)) return true;
	return false;
}

function abilityBlocksMoveType(move: Move, type: string, sourceData: AnyObject, targetData: AnyObject) {
	if (sourceIgnoresTargetAbility(sourceData, move)) return false;
	const targetHasAbility = (ability: ID) => pokemonCanHaveAbility(targetData, ability);
	if (type === 'Ground' && targetHasAbility('levitate' as ID) && !moveIgnoresTypeImmunity(move, type, sourceData)) return true;
	if (type === 'Ground' && targetHasAbility('eartheater' as ID)) return true;
	if (type === 'Water' && (['dryskin', 'stormdrain', 'waterabsorb'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Electric' && (['lightningrod', 'motordrive', 'voltabsorb'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Fire' && (['flashfire', 'wellbakedbody'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Grass' && targetHasAbility('sapsipper' as ID)) return true;
	return false;
}

function pokemonHasType(pokemonData: AnyObject, pokemon: Pokemon | null, type: string) {
	return !!pokemon?.hasType(type) || getPokemonTypes(pokemonData).includes(type);
}

function pokemonHasAnyType(pokemonData: AnyObject, pokemon: Pokemon | null, types: string[]) {
	return types.some(type => pokemonHasType(pokemonData, pokemon, type));
}

function pokemonHasStatus(pokemonData: AnyObject, pokemon: Pokemon | null) {
	return !!pokemon?.status || hasStatus(pokemonData);
}

function pokemonHasVolatile(pokemon: Pokemon | null, volatile: string | undefined) {
	return !!(volatile && pokemon?.volatiles?.[volatile]);
}

function pokemonDataHasVolatile(pokemonData: AnyObject | null, volatile: string | undefined) {
	return !!(volatile && pokemonData?.volatileState?.[volatile]);
}

function pokemonOrDataHasVolatile(pokemonData: AnyObject | null, pokemon: Pokemon | null, volatile: string | undefined) {
	return pokemonHasVolatile(pokemon, volatile) || pokemonDataHasVolatile(pokemonData, volatile);
}

function moveCanInflictMajorStatus(move: Move, moveid: ID) {
	if (move.status && STATUS_AILMENT_IDS.has(move.status as ID)) return true;
	if (SLEEP_INDUCING_MOVE_IDS.has(moveid)) return true;
	const secondary = move.secondary as AnyObject | null;
	if (secondary?.status && STATUS_AILMENT_IDS.has(toID(secondary.status))) return true;
	return !!move.secondaries?.some(secondaryData => (
		secondaryData.status && STATUS_AILMENT_IDS.has(toID(secondaryData.status))
	));
}

function moveCanInflictSleep(move: Move, moveid: ID) {
	if (move.status === 'slp' || SLEEP_INDUCING_MOVE_IDS.has(moveid)) return true;
	const secondary = move.secondary as AnyObject | null;
	if (toID(secondary?.status) === 'slp') return true;
	return !!move.secondaries?.some(secondaryData => toID(secondaryData.status) === 'slp');
}

function statusMoveTypeBlocked(
	move: Move, moveid: ID, type: string, sourceData: AnyObject,
	targetData: AnyObject, targetPokemon: Pokemon | null, targetsPokemon: boolean
) {
	const targetHasAbility = (ability: ID) => pokemonCanHaveAbility(targetData, ability);
	const powderMove = !!move.flags['powder'] || ['spore', 'sleeppowder', 'stunspore', 'poisonpowder'].includes(moveid);
	if (
		targetsPokemon &&
		(['Electric', 'Fire', 'Grass', 'Water'] as string[]).includes(type) &&
		abilityBlocksMoveType(move, type, sourceData, targetData)
	) return true;
	if (powderMove) {
		if (
			pokemonHasType(targetData, targetPokemon, 'Grass') ||
			targetHasAbility('overcoat' as ID) ||
			getPokemonItemID(targetData) === 'safetygoggles'
		) return true;
	}
	if (move.status === 'par' && pokemonHasType(targetData, targetPokemon, 'Electric')) return true;
	if (move.status === 'brn' && pokemonHasType(targetData, targetPokemon, 'Fire')) return true;
	if (
		(move.status === 'psn' || move.status === 'tox') &&
		!pokemonCanHaveAbility(sourceData, 'corrosion' as ID) &&
		pokemonHasAnyType(targetData, targetPokemon, ['Poison', 'Steel'])
	) return true;
	if (type === 'Electric' && moveid === 'thunderwave') {
		if (!moveIgnoresTypeImmunity(move, type, sourceData) && pokemonHasType(targetData, targetPokemon, 'Ground')) return true;
	}
	if (type === 'Fire' && (move.status === 'brn' || moveid === 'willowisp')) {
		if (abilityBlocksMoveType(move, type, sourceData, targetData)) return true;
	}
	if (type === 'Grass' && (powderMove || moveid === 'leechseed')) {
		if (abilityBlocksMoveType(move, type, sourceData, targetData)) return true;
	}
	return false;
}

function statusMoveBlocked(
	move: Move, moveid: ID, sourceData: AnyObject, targetData: AnyObject | null, targetPokemon: Pokemon | null = null,
	context?: BTAIContext
) {
	if (!targetData) return false;
	const targetItem = getPokemonItemID(targetData);
	const ignoresAbility = sourceIgnoresTargetAbility(sourceData, move);
	const targetHasAbility = (ability: ID) => pokemonCanHaveAbility(targetData, ability);
	const targetsPokemon = !['all', 'allySide', 'foeSide', 'self'].includes(move.target);
	const type = getModifiedMoveType(move, sourceData, context);
	if (move.category === 'Status' && pokemonDataHasVolatile(sourceData, 'taunt')) return true;
	if (targetsPokemon && pokemonIsGrounded(targetData)) {
		if (context?.terrain === 'mistyterrain' && moveCanInflictMajorStatus(move, moveid)) return true;
		if (context?.terrain === 'electricterrain' && moveCanInflictSleep(move, moveid)) return true;
		if (context?.terrain === 'psychicterrain' && estimateMovePriority(move, sourceData, targetData) > 0) {
			return true;
		}
	}
	if (statusMoveTypeBlocked(move, moveid, type, sourceData, targetData, targetPokemon, targetsPokemon)) return true;
	if (
		!ignoresAbility &&
		targetsPokemon &&
		estimateMovePriority(move, sourceData, targetData) > 0 &&
		getPossiblePokemonAbilityIDs(targetData).some(ability => PRIORITY_BLOCKING_ABILITIES.has(ability))
	) return true;
	if (!ignoresAbility && targetHasAbility('goodasgold' as ID) && targetsPokemon) return true;
	if (!ignoresAbility && targetHasAbility('magicbounce' as ID) && move.flags['reflectable']) return true;
	if (!ignoresAbility && targetHasAbility('mirrorarmor' as ID) && move.flags['reflectable']) return true;
	if (!ignoresAbility && move.flags['bullet'] && targetHasAbility('bulletproof' as ID) && targetsPokemon) return true;
	if (!ignoresAbility && move.flags['wind'] && targetHasAbility('windrider' as ID) && targetsPokemon) return true;
	if (!ignoresAbility && move.flags['sound'] && targetHasAbility('soundproof' as ID)) return true;
	if (
		!ignoresAbility &&
		targetsPokemon &&
		move.category === 'Status' &&
		pokemonCanHaveAbility(sourceData, 'prankster' as ID) &&
		pokemonHasType(targetData, targetPokemon, 'Dark')
	) return true;
	if (!ignoresAbility && getPossiblePokemonAbilityIDs(targetData).some(ability => STAT_DROP_PUNISHING_ABILITIES.has(ability))) {
		const boosts = move.boosts as SparseBoostsTable | null | undefined;
		if (boosts && Object.values(boosts).some(boost => boost < 0)) return true;
	}
	if (
		move.status &&
		(pokemonHasStatus(targetData, targetPokemon) ||
		getPossiblePokemonAbilityIDs(targetData).some(ability => STATUS_PUNISHING_ABILITIES.has(ability)))
	) return true;
	if (['spore', 'sleeppowder', 'stunspore', 'poisonpowder'].includes(moveid)) {
		if (pokemonHasType(targetData, targetPokemon, 'Grass') || targetHasAbility('overcoat' as ID) || targetItem === 'safetygoggles') {
			return true;
		}
	}
	if (moveid === 'toxic' || moveid === 'poisongas' || move.status === 'tox' || move.status === 'psn') {
		if ((['magicguard', 'poisonheal', 'radicalaura', 'familialrevenge'] as ID[]).some(targetHasAbility)) return true;
		if (!pokemonCanHaveAbility(sourceData, 'corrosion' as ID) && pokemonHasAnyType(targetData, targetPokemon, ['Poison', 'Steel'])) {
			return true;
		}
	}
	if (!ignoresAbility && move.status === 'slp' && (['comatose', 'insomnia', 'sweetveil', 'vitalspirit'] as ID[]).some(targetHasAbility)) {
		return true;
	}
	if (!ignoresAbility && move.status === 'par' && targetHasAbility('limber' as ID)) return true;
	if (!ignoresAbility && move.status === 'brn' && (['thermalexchange', 'waterbubble', 'waterveil'] as ID[]).some(targetHasAbility)) {
		return true;
	}
	if (!ignoresAbility && (move.status === 'tox' || move.status === 'psn') && (['immunity', 'pastelveil'] as ID[]).some(targetHasAbility)) {
		return true;
	}
	if (!ignoresAbility && move.status === 'frz' && targetHasAbility('magmaarmor' as ID)) return true;
	if (moveid === 'willowisp' && pokemonHasType(targetData, targetPokemon, 'Fire')) return true;
	if (moveid === 'thunderwave' && pokemonHasAnyType(targetData, targetPokemon, ['Electric', 'Ground'])) return true;
	if (moveid === 'leechseed' && pokemonHasType(targetData, targetPokemon, 'Grass')) return true;
	if (pokemonOrDataHasVolatile(targetData, targetPokemon, move.volatileStatus)) return true;
	if (['leechseed', 'taunt', 'encore', 'torment'].includes(moveid) && pokemonOrDataHasVolatile(targetData, targetPokemon, moveid)) {
		return true;
	}
	if (
		(move.status === 'brn' || move.status === 'par' || move.status === 'psn' || move.status === 'tox') &&
		targetHasAbility('purifyingsalt' as ID)
	) {
		return true;
	}
	if (moveid === 'taunt' && targetHasAbility('oblivious' as ID)) return true;
	return false;
}

function getPositionFromIdent(ident: string | undefined) {
	const match = /^p[1-4]([a-z])?:/.exec(ident || '');
	return match?.[1] ? match[1].charCodeAt(0) - 97 : 0;
}

function getFutureMoveID(effectName: string | undefined) {
	return toID((effectName || '').replace(/^move:\s*/i, ''));
}

function isFutureMoveEffect(effectName: string | undefined) {
	return ['futuresight', 'doomdesire'].includes(getFutureMoveID(effectName));
}

function setTrackedFutureMove(state: BTBattleState, targetSideid: 'p1' | 'p2', position: number, active: boolean) {
	if (!state.futureMoves) state.futureMoves = newFutureMoveState();
	state.futureMoves[targetSideid][Math.max(0, position)] = active;
}

function hasFutureMoveOnTargetSlot(
	room: GameRoom, targetSideid: 'p1' | 'p2', targetData: AnyObject | null, state?: BTBattleState
) {
	const side = (room.battle as AnyObject | null)?.[targetSideid];
	const position = getPositionFromIdent(targetData?.ident);
	if (state && !state.futureMoves) state.futureMoves = newFutureMoveState();
	return !!side?.slotConditions?.[position]?.futuremove || !!state?.futureMoves[targetSideid]?.[position];
}

function estimateBestDamageFromPokemon(sourceData: AnyObject, targetData: AnyObject | null, context?: BTAIContext) {
	if (!targetData) return 0;
	let bestDamage = 0;
	for (const moveid of getPokemonMoveIDs(sourceData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (!move.exists || move.category === 'Status') continue;
		bestDamage = Math.max(bestDamage, estimateDamage(moveid, sourceData, targetData, false, context));
	}
	return bestDamage;
}

function getPlayerSwitchRate(state: BTBattleState, threatened: boolean) {
	const style = state.playerStyle;
	const switches = threatened ? style.threatenedSwitches : style.neutralSwitches;
	const stays = threatened ? style.threatenedStays : style.neutralStays;
	return switches / Math.max(1, switches + stays);
}

function targetIsThreatenedByPokemon(sourceData: AnyObject, targetData: AnyObject | null, context?: BTAIContext) {
	if (!targetData) return false;
	const hp = getHPData(targetData);
	if (hp.hp <= 0) return false;
	const damage = estimateBestDamageFromPokemon(sourceData, targetData, context);
	return damage >= hp.hp || damage >= hp.maxhp * 0.55 || damage >= hp.hp * 0.7;
}

function getSwitchPredictionChance(
	state: BTBattleState, sourceData: AnyObject, targetData: AnyObject | null, context?: BTAIContext
) {
	if (!targetData) return 0;
	const candidates = getPredictedSwitchCandidates(targetData, context);
	if (!candidates.length) return 0;
	const threatened = targetIsThreatenedByPokemon(sourceData, targetData, context);
	const hp = getHPData(targetData);
	const bestDamage = estimateBestDamageFromPokemon(sourceData, targetData, context);
	let chance = getPlayerSwitchRate(state, threatened);
	if (threatened && bestDamage >= hp.hp) chance += 0.12;
	if (!threatened && bestDamage < hp.maxhp * 0.3) chance -= 0.08;
	return Math.max(0.08, Math.min(0.88, chance));
}

function getPredictedSwitchCandidates(targetData: AnyObject | null, context?: BTAIContext) {
	if (!targetData || !context?.targetSide) return [] as AnyObject[];
	const activeID = getPokemonDecisionID(targetData);
	return context.targetSide.filter(pokemonData => {
		const hp = getHPData(pokemonData);
		return hp.hp > 0 && !pokemonData.active && getPokemonDecisionID(pokemonData) !== activeID;
	});
}

function getPredictedSwitchTarget(sourceData: AnyObject, targetData: AnyObject | null, context?: BTAIContext) {
	const candidates = getPredictedSwitchCandidates(targetData, context);
	if (!candidates.length) return null;
	const sourceHP = getHPData(sourceData);
	let bestCandidate = candidates[0];
	let bestScore = -Infinity;
	for (const candidate of candidates) {
		const candidateHP = getHPData(candidate);
		const damageTaken = estimateBestDamageFromPokemon(sourceData, candidate, context);
		const threatBack = estimateBestDamageFromPokemon(candidate, sourceData, context ? {...context, sourceSide: undefined} : undefined);
		const score =
			(candidateHP.hp / candidateHP.maxhp) * 18 -
			Math.min(damageTaken, candidateHP.hp) / candidateHP.maxhp * 95 +
			Math.min(threatBack, sourceHP.hp) / sourceHP.maxhp * 70;
		if (score > bestScore) {
			bestScore = score;
			bestCandidate = candidate;
		}
	}
	return bestCandidate;
}

function estimateBestDamageByCategory(
	sourceData: AnyObject, targetData: AnyObject | null, category: MoveCategory, context?: BTAIContext
) {
	if (!targetData) return 0;
	let bestDamage = 0;
	for (const moveid of getPokemonMoveIDs(sourceData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (!move.exists || move.category !== category) continue;
		bestDamage = Math.max(bestDamage, estimateDamage(moveid, sourceData, targetData, false, context));
	}
	return bestDamage;
}

function firstActiveMoveOnlyIsAvailable(moveid: ID, pokemonData: AnyObject | null) {
	if (!FIRST_ACTIVE_MOVE_ONLY_IDS.has(moveid)) return true;
	if (!pokemonData) return true;
	if (typeof pokemonData.activeMoveActions === 'number') return pokemonData.activeMoveActions < 1;
	if (pokemonData.active === false) return true;
	return true;
}

function moveTargetsFoePokemon(move: Move) {
	return !['all', 'allySide', 'self'].includes(move.target);
}

function pranksterBoostApplies(move: Move, sourceData: AnyObject, targetData?: AnyObject | null) {
	if (move.category !== 'Status') return false;
	if (!pokemonCanHaveAbility(sourceData, 'prankster' as ID)) return false;
	if (targetData && moveTargetsFoePokemon(move) && getPokemonTypes(targetData).includes('Dark')) return false;
	return true;
}

function estimateMovePriority(move: Move, pokemonData: AnyObject, targetData?: AnyObject | null) {
	if (!firstActiveMoveOnlyIsAvailable(move.id, pokemonData)) return 0;
	let priority = move.priority || 0;
	if (pranksterBoostApplies(move, pokemonData, targetData)) priority++;
	const hp = getHPData(pokemonData);
	if (
		pokemonCanHaveAbility(pokemonData, 'galewings' as ID) &&
		move.type === 'Flying' &&
		hp.hp >= hp.maxhp
	) {
		priority++;
	}
	if (pokemonCanHaveAbility(pokemonData, 'triage' as ID) && (move.flags['heal'] || move.drain)) {
		priority += 3;
	}
	return priority;
}

function estimateBestPriorityDamageFromPokemon(
	sourceData: AnyObject, targetData: AnyObject | null, context?: BTAIContext
) {
	if (!targetData) return {damage: 0, priority: 0, moveid: '' as ID};
	let best = {damage: 0, priority: 0, moveid: '' as ID};
	for (const moveid of getPokemonMoveIDs(sourceData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (!move.exists || move.category === 'Status') continue;
		const priority = estimateMovePriority(move, sourceData);
		if (priority <= 0) continue;
		const damage = estimateDamage(moveid, sourceData, targetData, false, context);
		if (damage > best.damage || (damage === best.damage && priority > best.priority)) {
			best = {damage, priority, moveid};
		}
	}
	return best;
}

function estimateHighestMovePriorityFromPokemon(
	sourceData: AnyObject, targetData: AnyObject | null, context?: BTAIContext, foeMoveCategory?: MoveCategory
) {
	if (!targetData) return 0;
	let priority = 0;
	for (const moveid of getPokemonMoveIDs(sourceData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (!move.exists) continue;
		if (ANTI_ATTACK_PRIORITY_MOVE_IDS.has(moveid) && foeMoveCategory === 'Status') continue;
		if (estimateDamage(moveid, sourceData, targetData, false, context) <= 0 && move.category !== 'Status') continue;
		priority = Math.max(priority, estimateMovePriority(move, sourceData, targetData));
	}
	return priority;
}

function estimateBestDamageActingBefore(
	sourceData: AnyObject, targetData: AnyObject | null, foePriority: number, context?: BTAIContext
) {
	if (!targetData) return 0;
	let bestDamage = 0;
	for (const moveid of getPokemonMoveIDs(sourceData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (!move.exists || move.category === 'Status') continue;
		const priority = estimateMovePriority(move, sourceData);
		const actsFirst = priority > foePriority || (
			priority === foePriority && estimateSpeed(sourceData, context) >= estimateSpeed(targetData, context)
		);
		if (!actsFirst) continue;
		bestDamage = Math.max(bestDamage, estimateDamage(moveid, sourceData, targetData, false, context));
	}
	return bestDamage;
}

function getBestSelfSwitchThreat(sourceData: AnyObject | null, targetData: AnyObject | null, context?: BTAIContext) {
	if (!sourceData || !targetData) return {hasPivot: false, damage: 0};
	let hasPivot = false;
	let damage = 0;
	for (const moveid of getPokemonMoveIDs(sourceData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid) as AnyObject;
		if (!move.exists || !move.selfSwitch) continue;
		hasPivot = true;
		if (move.category !== 'Status') {
			damage = Math.max(damage, estimateDamage(moveid, sourceData, targetData, false, context));
		}
	}
	return {hasPivot, damage};
}

function getReverseContext(context?: BTAIContext) {
	if (!context) return undefined;
	return {
		...context,
		sourceSide: context.targetSide,
		ownSide: context.targetSide,
		targetSide: context.ownSide,
	};
}

function sideWeatherSpeedValue(side: AnyObject[] | undefined, weather: ID) {
	if (!side?.length) return 0;
	let value = 0;
	for (const pokemonData of side) {
		const hp = getHPData(pokemonData);
		if (hp.hp <= 0) continue;
		for (const [ability, abilityWeather] of Object.entries(WEATHER_SPEED_ABILITIES)) {
			if (getWeatherGroup(abilityWeather) === getWeatherGroup(weather) && pokemonCanHaveAbility(pokemonData, ability as ID)) {
				value += 18;
				break;
			}
		}
	}
	return value;
}

function pokemonSetsWeather(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	if (getPokemonWeatherAbilityWeather(pokemonData)) return true;
	return getPokemonMoveIDs(pokemonData).some(moveid => getMoveWeather(Dex.mod('gen9rrbt').moves.get(moveid)));
}

function pokemonBenefitsFromWeather(pokemonData: AnyObject | null, weather: ID) {
	if (!pokemonData || !weather) return false;
	const weatherGroup = getWeatherGroup(weather);
	for (const [ability, abilityWeather] of Object.entries(WEATHER_SPEED_ABILITIES)) {
		if (getWeatherGroup(abilityWeather) === weatherGroup && pokemonCanHaveAbility(pokemonData, ability as ID)) return true;
	}
	const weatherAbilityMap: {[k: string]: ID[]} = {
		raindance: ['dryskin', 'hydration', 'raindish'],
		sunnyday: ['flowergift', 'leafguard', 'solarpower'],
		sandstorm: ['sandforce', 'sandrush', 'sandveil'],
		snow: ['icebody', 'snowcloak', 'slushrush'],
	};
	return (weatherAbilityMap[weatherGroup] || []).some(ability => pokemonCanHaveAbility(pokemonData, ability as ID));
}

function sideHasWeatherPlan(side: AnyObject[] | undefined, context?: BTAIContext) {
	if (!side?.length) return false;
	const currentWeather = normalizeWeather(context?.weather);
	if (currentWeather && side.some(pokemonData => pokemonBenefitsFromWeather(pokemonData, currentWeather))) return true;
	const setterWeather = side.map(pokemonData => getPokemonWeatherAbilityWeather(pokemonData)).find(Boolean);
	if (setterWeather && side.some(pokemonData => pokemonBenefitsFromWeather(pokemonData, setterWeather))) return true;
	return side.some(pokemonData => pokemonSetsWeather(pokemonData)) &&
		side.some(pokemonData => getPossiblePokemonAbilityIDs(pokemonData).some(ability => (
			ability in WEATHER_SPEED_ABILITIES ||
			['dryskin', 'flowergift', 'hydration', 'icebody', 'leafguard', 'raindish', 'sandforce', 'snowcloak', 'solarpower'].includes(ability)
		)));
}

function getSideAverages(side: AnyObject[] | undefined, context?: BTAIContext) {
	const alive = remainingSidePokemon(side);
	if (!alive.length) return {speed: 0, offense: 0, bulk: 0};
	let speed = 0;
	let offense = 0;
	let bulk = 0;
	for (const pokemonData of alive) {
		const hp = getHPData(pokemonData);
		speed += estimateSpeed(pokemonData, context);
		offense += Math.max(getStat(pokemonData, 'atk'), getStat(pokemonData, 'spa'));
		bulk += hp.maxhp + getStat(pokemonData, 'def') + getStat(pokemonData, 'spd');
	}
	return {speed: speed / alive.length, offense: offense / alive.length, bulk: bulk / alive.length};
}

function getTeamArchetype(side: AnyObject[] | undefined, context?: BTAIContext): BTTeamArchetype {
	const alive = remainingSidePokemon(side);
	if (!alive.length) return 'balance';
	if (sideHasWeatherPlan(alive, context)) return 'weather';
	let recovery = 0;
	let passive = 0;
	let setup = 0;
	let hazards = 0;
	let damaging = 0;
	for (const pokemonData of alive) {
		if (pokemonCanRecover(pokemonData)) recovery++;
		if (pokemonHasMoveTag(pokemonData, 'setup')) setup++;
		if (pokemonHasMoveTag(pokemonData, 'hazard')) hazards++;
		const moves = getPokemonMoveIDs(pokemonData);
		for (const moveid of moves) {
			const move = Dex.mod('gen9rrbt').moves.get(moveid);
			if (!move.exists) continue;
			if (move.category === 'Status') passive++;
			if (move.category !== 'Status') damaging++;
		}
	}
	const avg = getSideAverages(alive, context);
	if (recovery >= 3 || (recovery >= 2 && passive >= damaging)) return 'stall';
	if ((setup + hazards >= 3 && avg.speed >= 230) || (avg.speed >= 270 && avg.offense > avg.bulk / 3)) return 'hyperoffense';
	if (avg.bulk >= 650 && avg.offense >= 220) return 'bulkyoffense';
	return 'balance';
}

function targetIsWeatherBreaker(targetData: AnyObject | null, context?: BTAIContext) {
	if (!targetData) return false;
	const weather = normalizeWeather(context?.weather);
	return !!weather && pokemonBenefitsFromWeather(targetData, weather);
}

function scoreWeatherChangeForMatchup(
	actorData: AnyObject, targetData: AnyObject | null, currentContext?: BTAIContext, nextContext?: BTAIContext
) {
	const nextWeather = normalizeWeather(nextContext?.weather);
	if (!nextWeather || getWeatherGroup(nextWeather) === getWeatherGroup(currentContext?.weather)) return 0;
	let score = 12;
	if (targetData) {
		const targetHP = getHPData(targetData);
		const actorHP = getHPData(actorData);
		const currentReverse = getReverseContext(currentContext);
		const nextReverse = getReverseContext(nextContext);
		const ownBefore = estimateBestDamageFromPokemon(actorData, targetData, currentContext);
		const ownAfter = estimateBestDamageFromPokemon(actorData, targetData, nextContext);
		const targetBefore = estimateBestDamageFromPokemon(targetData, actorData, currentReverse);
		const targetAfter = estimateBestDamageFromPokemon(targetData, actorData, nextReverse);
		score += (ownAfter - ownBefore) / Math.max(1, targetHP.maxhp) * 70;
		score += (targetBefore - targetAfter) / Math.max(1, actorHP.maxhp) * 90;
	}
	const currentWeather = normalizeWeather(currentContext?.weather);
	if (currentWeather) {
		score += Math.max(0, sideWeatherSpeedValue(currentContext?.targetSide, currentWeather) - sideWeatherSpeedValue(currentContext?.ownSide, currentWeather));
	}
	score += sideWeatherSpeedValue(nextContext?.ownSide, nextWeather) - sideWeatherSpeedValue(nextContext?.targetSide, nextWeather);
	return score;
}

function scoreWeatherMove(
	move: Move, pokemonData: AnyObject, targetData: AnyObject | null, targetThreat: number, context?: BTAIContext
) {
	const weather = getMoveWeather(move);
	if (!weather) return -Infinity;
	const nextContext = applyWeatherContext(context, weather);
	if (!nextContext || getWeatherGroup(nextContext.weather) === getWeatherGroup(context?.weather)) return -Infinity;
	let score = 42 + scoreWeatherChangeForMatchup(pokemonData, targetData, context, nextContext);
	const activeHP = getHPData(pokemonData);
	if (targetThreat >= activeHP.hp * 0.7) score -= 22;
	if ((move as AnyObject).selfSwitch) score += 18;
	return score;
}

function getSwitchPivotPenalty(
	switchOption: AnyObject | null, targetData: AnyObject | null, state?: BTBattleState, context?: BTAIContext
) {
	if (!switchOption || !targetData) return 0;
	const threatContext = context ? {...context, sourceSide: undefined} : undefined;
	const pivot = getBestSelfSwitchThreat(targetData, switchOption, threatContext);
	if (!pivot.hasPivot) return 0;
	const switchHP = getHPData(switchOption);
	let penalty = 18;
	if (pivot.damage > 0) {
		penalty += Math.min(65, Math.min(pivot.damage, switchHP.hp) / Math.max(1, switchHP.maxhp) * 110);
	}
	const key = getPivotPunishKeyForPokemon(targetData, switchOption);
	const punishCount = key && state?.pivotPunishedSwitches ? state.pivotPunishedSwitches[key] || 0 : 0;
	if (punishCount) penalty += Math.min(95, punishCount * 38);
	return penalty;
}

function getMoveTypeModAgainstPokemon(move: Move, type: string, sourceData: AnyObject, targetData: AnyObject) {
	const dex = Dex.mod('gen9rrbt');
	let typeMod = 0;
	for (const targetType of getPokemonTypes(targetData)) {
		if (!dex.getImmunity(type, targetType)) {
			if (moveIgnoresTypeImmunity(move, type, sourceData, targetType)) continue;
			return -Infinity;
		}
		typeMod += dex.getEffectiveness(type, targetType);
	}
	return typeMod;
}

function pokemonHasConfirmedMove(pokemonData: AnyObject | null, moveid: ID) {
	if (!pokemonData) return false;
	if (getPokemonMoveIDsFromData(pokemonData).includes(moveid)) return true;
	const speciesid = getSpeciesID(pokemonData);
	return !!opponentMemory[speciesid]?.moves?.[moveid];
}

function getSwitchKnownThreatPenalty(
	switchOption: AnyObject | null, targetData: AnyObject | null, context?: BTAIContext
) {
	if (!switchOption || !targetData) return 0;
	const hpData = getHPData(switchOption);
	let penalty = 0;
	for (const moveid of getPokemonMoveIDs(targetData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (!move.exists || move.category === 'Status') continue;
		const damage = estimateDamage(moveid, targetData, switchOption, false, context);
		if (damage <= 0) continue;
		const type = getModifiedMoveType(move, targetData, context);
		const typeMod = getMoveTypeModAgainstPokemon(move, type, targetData, switchOption);
		const damageFraction = Math.min(damage, hpData.hp) / Math.max(1, hpData.maxhp);
		const confirmed = pokemonHasConfirmedMove(targetData, moveid);
		let movePenalty = 0;
		if (typeMod > 0) movePenalty += typeMod * (confirmed ? 28 : 14);
		if (damageFraction >= 0.33) movePenalty += damageFraction * (confirmed ? 95 : 45);
		if (damage >= hpData.hp) movePenalty += confirmed ? 60 : 28;
		if (confirmed && typeMod > 0) movePenalty += 18;
		penalty = Math.max(penalty, movePenalty);
	}
	return Math.min(140, penalty);
}

function isPivotBaitSwitch(
	activeData: AnyObject, targetData: AnyObject, switchOption: AnyObject | null,
	activeDamage: number, switchDamage: number, targetThreat: number, pivotPenalty: number
) {
	if (!switchOption || pivotPenalty < 35) return false;
	const activeHP = getHPData(activeData);
	const targetHP = getHPData(targetData);
	if (targetThreat >= activeHP.hp && activeDamage < targetHP.hp) return false;
	if (switchDamage >= targetHP.hp && pivotPenalty < 60) return false;
	return true;
}

function getSupremeOverlordReserve(side: AnyObject[] | undefined, activeData: AnyObject | null) {
	const activeID = getPokemonDecisionID(activeData);
	let bestReserve: AnyObject | null = null;
	let bestScore = -Infinity;
	for (const ally of remainingSidePokemon(side)) {
		if (getPokemonDecisionID(ally) === activeID) continue;
		if (!pokemonCanHaveAbility(ally, 'supremeoverlord' as ID)) continue;
		const hpData = getHPData(ally);
		const hpFraction = hpData.hp / Math.max(1, hpData.maxhp);
		const score = hpFraction * 100 + (getSpeciesID(ally) === 'kingambit' ? 25 : 0);
		if (score > bestScore) {
			bestScore = score;
			bestReserve = ally;
		}
	}
	return bestReserve;
}

function shouldTacticalSackForSupremeOverlord(
	activeData: AnyObject, targetData: AnyObject, switchOption: AnyObject | null,
	activeDamage: number, switchDamage: number, targetThreat: number, switchDamageIn: number, context?: BTAIContext
) {
	if (pokemonCanHaveAbility(activeData, 'supremeoverlord' as ID)) return false;
	const reserve = getSupremeOverlordReserve(context?.ownSide, activeData);
	if (!reserve) return false;
	const fallen = Math.min(countFaintedAllies(context), 5);
	if (fallen >= 5) return false;
	const activeHP = getHPData(activeData);
	const targetHP = getHPData(targetData);
	if (targetThreat < activeHP.hp) return false;
	if (activeDamage <= 0) return false;
	const priorityThreat = estimateBestPriorityDamageFromPokemon(targetData, activeData, getReverseContext(context));
	if (priorityThreat.priority > 0 && priorityThreat.damage >= activeHP.hp) {
		const immediateDamage = estimateBestDamageActingBefore(activeData, targetData, priorityThreat.priority, context);
		if (immediateDamage <= 0) return false;
	}
	const reserveHP = getHPData(reserve);
	if (reserveHP.hp <= reserveHP.maxhp * 0.25) return false;
	const activeDamageFraction = activeDamage / Math.max(1, targetHP.maxhp);
	if (activeDamage >= targetHP.hp) return true;
	if (switchOption) {
		const switchHP = getHPData(switchOption);
		const switchEntryDamage = estimateHazardDamage(switchOption, context?.ownHazards);
		const effectiveSwitchHP = Math.max(1, switchHP.hp - switchEntryDamage);
		if (switchDamage >= targetHP.hp && switchDamageIn < effectiveSwitchHP) return false;
		if (
			getPokemonDecisionID(switchOption) === getPokemonDecisionID(reserve) &&
			fallen < 3 &&
			switchDamageIn >= effectiveSwitchHP * 0.45 &&
			activeDamageFraction >= 0.15
		) {
			return true;
		}
	}
	const activeHPFraction = activeHP.hp / Math.max(1, activeHP.maxhp);
	const reserveFutureValue = getFutureCoverageValue(reserve, context);
	if (activeHPFraction <= 0.35 && activeDamageFraction >= 0.18) return true;
	if (activeDamageFraction >= 0.32 && reserveFutureValue >= 35) return true;
	return reserveFutureValue >= 65 && activeDamageFraction >= 0.12;
}

function scoreSwitchOption(
	switchOption: AnyObject, targetData: AnyObject | null, state?: BTBattleState, context?: BTAIContext
) {
	const hpData = getHPData(switchOption);
	const entryDamage = estimateHazardDamage(switchOption, context?.ownHazards);
	if (entryDamage >= hpData.hp) return -Infinity;
	const effectiveHP = {...hpData, hp: Math.max(1, hpData.hp - entryDamage)};
	let score = (effectiveHP.hp / effectiveHP.maxhp) * 25;
	if (entryDamage) {
		score -= Math.min(85, entryDamage / Math.max(1, hpData.maxhp) * 120);
		if (entryDamage >= hpData.hp * 0.5) score -= 28;
	}
	if (state) {
		score += memoryScore(getMemoryKey(state, switchOption, targetData, `switch:${getSpeciesID(switchOption)}`)) * 12;
	}
	if (!targetData) return score;
	const switchContext = getWeatherContextAfterPokemonSwitch(switchOption, context) || context;
	const targetHP = getHPData(targetData);
	const damageOut = estimateBestDamageFromPokemon(switchOption, targetData, switchContext);
	const damageIn = estimateBestDamageFromPokemon(targetData, switchOption, getReverseContext(switchContext));
	const setupPressure = getSetupThreatPressure(targetData);
	if (setupPressure) {
		const disruptionValue = getAntiSetupDisruptionValue(switchOption, targetData, null, null, switchContext);
		if (disruptionValue) {
			score += Math.min(165, disruptionValue);
			if (damageIn < effectiveHP.hp) score += 24;
			if (damageIn >= effectiveHP.hp && damageOut < targetHP.hp) score -= 70;
		} else if (getDefensiveBoostPressure(targetData) >= 4 && damageOut < targetHP.hp * 0.35) {
			score -= Math.min(70, setupPressure * 0.45);
		}
	}
	if (pokemonHasHazardRemovalMove(switchOption) && context?.ownHazards && hasHazards(context.ownHazards)) {
		const urgency = getHazardRemovalUrgency(switchOption, context.ownHazards, context);
		if (damageIn < effectiveHP.hp) score += 32 + Math.min(95, urgency);
	}
	score -= getHazardSwitchPenalty(
		switchOption, targetData, entryDamage, damageIn, damageOut, context?.ownHazards, switchContext
	);
	score += Math.min(damageOut, targetHP.hp) / targetHP.maxhp * 100;
	score -= Math.min(damageIn, effectiveHP.hp) / effectiveHP.maxhp * 75;
	const switchHeal = getGrassyTerrainHeal(switchOption, switchContext);
	if (switchHeal) score += Math.min(18, switchHeal / effectiveHP.maxhp * 90);
	const targetHeal = getGrassyTerrainHeal(targetData, switchContext);
	if (targetHeal && damageOut < targetHP.hp) score -= Math.min(18, targetHeal / targetHP.maxhp * 90);
	score -= getSwitchKnownThreatPenalty(switchOption, targetData, getReverseContext(switchContext));
	score += scoreWeatherChangeForMatchup(switchOption, targetData, context, switchContext);
	score -= getSwitchPivotPenalty(switchOption, targetData, state, switchContext);
	if (damageOut >= targetHP.hp) score += 40;
	if (damageIn >= effectiveHP.hp) score -= 40;
	if (pokemonCanHaveAbility(switchOption, 'supremeoverlord' as ID)) {
		const fallen = Math.min(countFaintedAllies(context), 5);
		score += fallen * 14;
		if (damageOut >= targetHP.hp) score += 18 + fallen * 4;
		if (fallen < 2 && damageIn >= effectiveHP.hp && damageOut < targetHP.hp) score -= 45;
		const futureValue = getFutureCoverageValue(switchOption, switchContext);
		if (futureValue) score += Math.min(35, futureValue * 0.25);
	}
	if (pokemonCanHaveAbility(switchOption, 'magicbounce' as ID)) {
		const reflectableValue = getReflectableHazardOrStatusValue(targetData);
		if (reflectableValue) {
			score += reflectableValue;
			if (damageIn < hpData.hp * 0.45) score += 20;
		}
	}
	if (getPokemonAbilityID(switchOption) === 'intimidate') {
		const threatContext = context ? {...context, sourceSide: undefined} : undefined;
		const physicalThreat = estimateBestDamageByCategory(targetData, switchOption, 'Physical', threatContext);
		const specialThreat = estimateBestDamageByCategory(targetData, switchOption, 'Special', threatContext);
		if (physicalThreat > 0 && physicalThreat >= specialThreat) score += 18;
	}
	return score;
}

function shouldReserveMarowakBoss(pokemonData: AnyObject | null, state?: BTBattleState, side?: AnyObject[]) {
	if (!pokemonData || levels[state?.level || 0]?.medal !== 'marowak') return false;
	if (getSpeciesID(pokemonData) !== 'marowakalola') return false;
	return remainingSidePokemon(side).some(ally => (
		getPokemonDecisionID(ally) !== getPokemonDecisionID(pokemonData) &&
		getSpeciesID(ally) !== 'marowakalola'
	));
}

function chooseSwitch(
	request: AnyObject, targetData: AnyObject | null = null, state?: BTBattleState, context?: BTAIContext
) {
	const pokemon = request.side.pokemon;
	const chosen: number[] = [];
	const choices = request.forceSwitch.map((mustSwitch: boolean, i: number) => {
		if (!mustSwitch) return 'pass';
		const switches = pokemon.map((pokemonData: AnyObject, index: number) => ({
			slot: index + 1,
			pokemon: pokemonData,
		})).filter(({slot, pokemon: switchOption}: {slot: number, pokemon: AnyObject}) => (
			slot > request.forceSwitch.length &&
			!chosen.includes(slot) &&
			!switchOption.active &&
			!switchOption.condition.endsWith(' fnt') &&
			!pokemon[i].reviving &&
			!shouldReserveMarowakBoss(switchOption, state, pokemon)
		));
		if (!switches.length) return 'pass';
		let bestSwitch = switches[0];
		let bestScore = -Infinity;
		for (const switchChoice of switches) {
			const score = scoreSwitchOption(switchChoice.pokemon, targetData, state, context);
			if (score > bestScore) {
				bestScore = score;
				bestSwitch = switchChoice;
			}
		}
		const slot = bestSwitch.slot;
		chosen.push(slot);
		if (state) rememberDecision(state, bestSwitch.pokemon, targetData, `switch:${getSpeciesID(bestSwitch.pokemon)}`);
		return `switch ${slot}`;
	});
	return choices.join(', ');
}

function chooseBestSwitchSlot(
	request: AnyObject, activeSlots: number, chosen: number[] = [], targetData: AnyObject | null = null,
	state?: BTBattleState, context?: BTAIContext
) {
	const pokemon = request.side.pokemon;
	let bestSlot = 0;
	let bestScore = -Infinity;
	for (const [index, switchOption] of pokemon.entries()) {
		const slot = index + 1;
		if (
			slot <= activeSlots ||
			chosen.includes(slot) ||
			switchOption.active ||
			switchOption.condition.endsWith(' fnt') ||
			switchOption.commanding ||
			switchOption.reviving ||
			shouldReserveMarowakBoss(switchOption, state, context?.ownSide || pokemon)
		) {
			continue;
		}
		const score = scoreSwitchOption(switchOption, targetData, state, context);
		if (score > bestScore) {
			bestSlot = slot;
			bestScore = score;
		}
	}
	return bestSlot;
}

function getActivePokemonData(request: AnyObject, index = 0) {
	const activePokemon = request.side.pokemon.filter((pokemon: AnyObject) => pokemon.active);
	return activePokemon[index] || request.side.pokemon[index];
}

function getHPData(pokemonData: AnyObject) {
	const condition = pokemonData.condition || '';
	if (condition.endsWith(' fnt')) return {hp: 0, maxhp: 1};
	const [hpText, maxhpText] = condition.split(' ')[0].split('/');
	const hp = parseInt(hpText) || 1;
	const maxhp = parseInt(maxhpText) || hp || 1;
	return {hp, maxhp};
}

function parseHPState(condition: string | undefined) {
	if (!condition) return null;
	if (condition.endsWith(' fnt') || condition === '0 fnt') return {hp: 0, maxhp: 1};
	const [hpText, maxhpText] = condition.split(' ')[0].split('/');
	const hp = parseInt(hpText);
	const maxhp = parseInt(maxhpText);
	if (!Number.isFinite(hp)) return null;
	return {hp, maxhp: Number.isFinite(maxhp) && maxhp > 0 ? maxhp : Math.max(1, hp)};
}

function updateTrackedHP(state: BTBattleState, ident: string | undefined, condition: string | undefined) {
	const identID = getBattleIdentID(ident);
	const hpState = parseHPState(condition);
	if (!hpState) return;
	if (hpState.maxhp === 1 && hpState.hp === 0 && state.hpByIdent?.[identID]?.maxhp) {
		hpState.maxhp = state.hpByIdent[identID].maxhp;
	}
	if (!state.hpByIdent) state.hpByIdent = {};
	state.hpByIdent[identID] = hpState;
}

function getLevel(details: string) {
	const match = /(?:^|, )L(\d+)/.exec(details);
	return match ? parseInt(match[1]) : 100;
}

function getSpeciesName(pokemonData: AnyObject) {
	return (pokemonData.details || pokemonData.ident || '').split(',')[0].replace(/^p\d[a-z]?: /, '');
}

function getBattleIdentID(ident: string | undefined) {
	if (!ident) return 'unknown';
	const match = /^(p[1-4])[a-z]?:\s*(.*)$/.exec(ident);
	if (match) return `${match[1]}:${toID(match[2])}`;
	return toID(ident);
}

const TRACKED_BOOST_IDS = ['atk', 'def', 'spa', 'spd', 'spe', 'accuracy', 'evasion'] as BoostID[];

function clampBoostStage(boost: number) {
	return Math.max(-6, Math.min(6, boost || 0));
}

function getTrackedBoostTable(state: BTBattleState, ident: string | undefined) {
	if (!state.boostsByIdent) state.boostsByIdent = {};
	const identID = getBattleIdentID(ident);
	if (!state.boostsByIdent[identID]) state.boostsByIdent[identID] = {};
	return state.boostsByIdent[identID];
}

function addTrackedBoostsToPokemonData(pokemonData: AnyObject | null, state?: BTBattleState) {
	if (!pokemonData || !state?.boostsByIdent) return pokemonData;
	const decisionID = getPokemonDecisionID(pokemonData);
	const trackedBoosts = state.boostsByIdent[decisionID];
	if (!trackedBoosts || !Object.values(trackedBoosts).some(boost => boost)) return pokemonData;
	return {...pokemonData, boosts: {...(pokemonData.boosts || {}), ...trackedBoosts}};
}

function addTrackedVolatilesToPokemonData(pokemonData: AnyObject | null, state?: BTBattleState) {
	if (!pokemonData || !state?.volatilesByIdent) return pokemonData;
	const decisionID = getPokemonDecisionID(pokemonData);
	const trackedVolatiles = state.volatilesByIdent[decisionID];
	if (!trackedVolatiles || !Object.values(trackedVolatiles).some(Boolean)) return pokemonData;
	const volatileState = {...(pokemonData.volatileState || {})};
	for (const [volatileid, active] of Object.entries(trackedVolatiles)) {
		if (active) volatileState[volatileid] = volatileState[volatileid] || {};
	}
	return {...pokemonData, volatileState};
}

function getBoosterStatFromEffect(effectName: string | undefined) {
	const match = /^(?:protosynthesis|quarkdrive)(atk|def|spa|spd|spe)$/.exec(toID(effectName));
	if (!match || !BOOSTER_STAT_IDS.has(match[1] as StatIDExceptHP)) return null;
	return match[1] as StatIDExceptHP;
}

function trackBoosterBoostUpdate(state: BTBattleState, line: string, parts: string[]) {
	if (!state.boosterBoostsByIdent) state.boosterBoostsByIdent = {};
	const identID = getBattleIdentID(parts[2]);
	if (line.startsWith('|-start|')) {
		const stat = getBoosterStatFromEffect(parts[3]);
		if (stat) state.boosterBoostsByIdent[identID] = stat;
	} else if (['protosynthesis', 'quarkdrive'].includes(toID(parts[3]))) {
		delete state.boosterBoostsByIdent[identID];
	}
}

function addTrackedBoosterBoostToPokemonData(pokemonData: AnyObject | null, state?: BTBattleState) {
	if (!pokemonData || !state?.boosterBoostsByIdent) return pokemonData;
	const trackedStat = state.boosterBoostsByIdent[getPokemonDecisionID(pokemonData)];
	if (!trackedStat) return pokemonData;
	return {...pokemonData, boosterBoostedStat: trackedStat};
}

function addTrackedHiddenPowerTypeToPokemonData(pokemonData: AnyObject | null, state?: BTBattleState) {
	if (!pokemonData || !state?.hiddenPowerTypesByIdent) return pokemonData;
	const hpType = state.hiddenPowerTypesByIdent[getPokemonDecisionID(pokemonData)];
	if (!hpType) return pokemonData;
	return {...pokemonData, hpType};
}

function addTrackedStateToPokemonData(pokemonData: AnyObject | null, state?: BTBattleState) {
	return addTrackedHiddenPowerTypeToPokemonData(
		addTrackedBoosterBoostToPokemonData(
			addTrackedVolatilesToPokemonData(addTrackedBoostsToPokemonData(pokemonData, state), state),
			state
		),
		state
	);
}

function resetTrackedBoosts(state: BTBattleState, ident: string | undefined) {
	if (!state.boostsByIdent) state.boostsByIdent = {};
	state.boostsByIdent[getBattleIdentID(ident)] = {};
}

function resetTrackedBoosterBoost(state: BTBattleState, ident: string | undefined) {
	if (!state.boosterBoostsByIdent) state.boosterBoostsByIdent = {};
	delete state.boosterBoostsByIdent[getBattleIdentID(ident)];
}

const TRACKED_VOLATILE_IDS = new Set<ID>([
	'taunt' as ID, 'encore' as ID, 'torment' as ID, 'leechseed' as ID, 'healblock' as ID,
]);

function getTrackedVolatileID(effectName: string | undefined) {
	const volatileid = toID((effectName || '').replace(/^move:\s*/i, ''));
	return TRACKED_VOLATILE_IDS.has(volatileid) ? volatileid : '' as ID;
}

function resetTrackedVolatiles(state: BTBattleState, ident: string | undefined) {
	if (!state.volatilesByIdent) state.volatilesByIdent = {};
	state.volatilesByIdent[getBattleIdentID(ident)] = {};
}

function trackVolatileUpdate(state: BTBattleState, line: string, parts: string[]) {
	const volatileid = getTrackedVolatileID(parts[3]);
	if (!volatileid) return;
	if (!state.volatilesByIdent) state.volatilesByIdent = {};
	const identID = getBattleIdentID(parts[2]);
	if (!state.volatilesByIdent[identID]) state.volatilesByIdent[identID] = {};
	if (line.startsWith('|-start|')) {
		state.volatilesByIdent[identID][volatileid] = true;
	} else {
		delete state.volatilesByIdent[identID][volatileid];
	}
}

function trackBoostUpdate(state: BTBattleState, line: string, parts: string[]) {
	const ident = parts[2];
	if (!ident) return;
	const boosts = getTrackedBoostTable(state, ident);
	if (line.startsWith('|-clearboost|')) {
		resetTrackedBoosts(state, ident);
		return;
	}
	if (line.startsWith('|-clearpositiveboost|')) {
		for (const stat of TRACKED_BOOST_IDS) {
			if ((boosts[stat] || 0) > 0) boosts[stat] = 0;
		}
		return;
	}
	if (line.startsWith('|-clearnegativeboost|')) {
		for (const stat of TRACKED_BOOST_IDS) {
			if ((boosts[stat] || 0) < 0) boosts[stat] = 0;
		}
		return;
	}
	if (line.startsWith('|-invertboost|')) {
		for (const stat of TRACKED_BOOST_IDS) {
			boosts[stat] = clampBoostStage(-(boosts[stat] || 0));
		}
		return;
	}
	const stat = parts[3] as BoostID;
	if (!TRACKED_BOOST_IDS.includes(stat)) return;
	const amount = parseInt(parts[4]) || 0;
	if (line.startsWith('|-setboost|')) {
		boosts[stat] = clampBoostStage(amount);
	} else if (line.startsWith('|-boost|')) {
		boosts[stat] = amount > 0 ? clampBoostStage((boosts[stat] || 0) + amount) : 6;
	} else if (line.startsWith('|-unboost|')) {
		boosts[stat] = amount > 0 ? clampBoostStage((boosts[stat] || 0) - amount) : -6;
	}
}

function getHiddenPowerTypeFromMoveName(moveName: string | undefined) {
	const match = /^Hidden Power(?: \[?([A-Za-z]+)\]?)?$/i.exec(moveName || '');
	if (!match?.[1]) return '';
	const type = Dex.mod('gen9rrbt').types.get(match[1]);
	return type.exists ? type.name : '';
}

function trackHiddenPowerUse(room: GameRoom, state: BTBattleState, ident: string | undefined, moveName: string | undefined) {
	const moveid = toID(moveName);
	if (!moveid.startsWith('hiddenpower')) return;
	let hpType = getHiddenPowerTypeFromMoveName(moveName);
	if (!hpType) {
		const pokemon = getBattlePokemonByIdent(room, ident);
		hpType = pokemon?.hpType || '';
	}
	if (!hpType) return;
	if (!state.hiddenPowerTypesByIdent) state.hiddenPowerTypesByIdent = {};
	state.hiddenPowerTypesByIdent[getBattleIdentID(ident)] = hpType;
}

function getPokemonDecisionID(pokemonData: AnyObject | null) {
	if (!pokemonData) return 'unknown';
	return getBattleIdentID(pokemonData.ident || getSpeciesName(pokemonData));
}

function getSpeciesID(pokemonData: AnyObject | null) {
	if (!pokemonData) return 'none';
	return toID(getSpeciesName(pokemonData));
}

function getMemoryKey(state: BTBattleState, pokemonData: AnyObject, targetData: AnyObject | null, action: string) {
	return `${state.level + 1}|${getSpeciesID(pokemonData)}|${getSpeciesID(targetData)}|${action}`;
}

function getPivotPunishKey(targetSpecies: ID, switchSpecies: ID) {
	return `${targetSpecies}|${switchSpecies}`;
}

function getPivotPunishKeyForPokemon(targetData: AnyObject | null, switchOption: AnyObject | null) {
	if (!targetData || !switchOption) return '';
	return getPivotPunishKey(getSpeciesID(targetData), getSpeciesID(switchOption));
}

function parseBTCompleteArgs(target: string, user: User) {
	let targetName = '';
	let levelText = '';
	const parts = target.split(',').map(part => part.trim()).filter(Boolean);
	if (parts.length >= 2) {
		if (/^(?:all|\d+)$/i.test(parts[0])) {
			levelText = parts[0];
			targetName = parts.slice(1).join(',');
		} else {
			targetName = parts[0];
			levelText = parts[1];
		}
	} else if (parts.length === 1) {
		const match = /^(.*)\s+(all|\d+)$/i.exec(parts[0]);
		if (match && toID(match[1])) {
			targetName = match[1];
			levelText = match[2];
		} else if (/^(?:all|\d+)$/i.test(parts[0])) {
			levelText = parts[0];
		} else {
			targetName = parts[0];
		}
	}
	const targetID = toID(targetName) || user.id;
	let cleared = levels.length;
	if (levelText && toID(levelText) !== 'all') {
		cleared = parseInt(levelText);
		if (isNaN(cleared) || cleared < 1 || cleared > levels.length) {
			throw new Chat.ErrorMessage(`Battle Tower level must be between 1 and ${levels.length}, or "all".`);
		}
	}
	return {targetID, cleared};
}

function parseBTSetLevelArgs(target: string, user: User) {
	let targetName = '';
	let levelText = '1';
	const parts = target.split(',').map(part => part.trim()).filter(Boolean);
	if (parts.length >= 2) {
		if (/^(?:all|\d+)$/i.test(parts[0])) {
			levelText = parts[0];
			targetName = parts.slice(1).join(',');
		} else {
			targetName = parts[0];
			levelText = parts[1];
		}
	} else if (parts.length === 1) {
		const match = /^(.*)\s+(all|\d+)$/i.exec(parts[0]);
		if (match && toID(match[1])) {
			targetName = match[1];
			levelText = match[2];
		} else if (/^(?:all|\d+)$/i.test(parts[0])) {
			levelText = parts[0];
		} else {
			targetName = parts[0];
		}
	}
	const targetID = toID(targetName) || user.id;
	if (toID(levelText) === 'all') return {targetID, cleared: levels.length};
	const nextLevel = parseInt(levelText);
	if (isNaN(nextLevel) || nextLevel < 1 || nextLevel > levels.length + 1) {
		throw new Chat.ErrorMessage(`Battle Tower level must be between 1 and ${levels.length + 1}, or "all".`);
	}
	return {targetID, cleared: nextLevel - 1};
}

function getBTProgressLabel(cleared: number) {
	if (cleared >= levels.length) return 'all available levels cleared';
	return `next level is ${getBTLevelLabel(levels[cleared], cleared)}`;
}

function rememberDecision(
	state: BTBattleState, pokemonData: AnyObject, targetData: AnyObject | null, action: string
) {
	const decision = {
		key: getMemoryKey(state, pokemonData, targetData, action),
		actor: getPokemonDecisionID(pokemonData),
		action,
	};
	state.decisions.push(decision);
	state.lastDecisionByPokemon[decision.actor] = decision;
}

function rememberBotSwitch(
	state: BTBattleState, activeData: AnyObject, switchOption: AnyObject, targetData: AnyObject | null
) {
	state.lastBotSwitch = {
		fromSpecies: getSpeciesID(activeData),
		toSpecies: getSpeciesID(switchOption),
		toIdent: getPokemonDecisionID(switchOption),
		targetSpecies: getSpeciesID(targetData),
	};
}

function getHeldItemTypeProperty(pokemonData: AnyObject, property: 'onPlate' | 'onMemory' | 'onDrive') {
	const itemid = getPokemonItemID(pokemonData);
	if (!itemid) return '';
	const item = Dex.mod('gen9rrbt').items.get(itemid) as AnyObject;
	return typeof item[property] === 'string' ? item[property] as string : '';
}

function getNaturalGiftData(pokemonData: AnyObject) {
	const itemid = getPokemonItemID(pokemonData);
	if (!itemid) return null;
	const item = Dex.mod('gen9rrbt').items.get(itemid) as AnyObject;
	return item.naturalGift || null;
}

function getSpeciesFormeMoveType(pokemonData: AnyObject, formes: {[speciesid: string]: string}) {
	const species = Dex.mod('gen9rrbt').species.get(getSpeciesName(pokemonData));
	return formes[species.id] || '';
}

function getModifiedMoveType(move: Move, pokemonData: AnyObject, context?: BTAIContext) {
	if (move.id === 'hiddenpower') return pokemonData.hpType || move.type;
	if (move.id === 'ivycudgel') {
		const type = getSpeciesFormeMoveType(pokemonData, {
			ogerponwellspring: 'Water',
			ogerponwellspringtera: 'Water',
			ogerponhearthflame: 'Fire',
			ogerponhearthflametera: 'Fire',
			ogerponcornerstone: 'Rock',
			ogerponcornerstonetera: 'Rock',
		});
		if (type) return type;
	}
	if (move.id === 'judgment') {
		const plateType = getHeldItemTypeProperty(pokemonData, 'onPlate');
		if (plateType) return plateType;
		const species = Dex.mod('gen9rrbt').species.get(getSpeciesName(pokemonData));
		if (species.baseSpecies === 'Arceus') return getPokemonTypes(pokemonData)[0] || move.type;
	}
	if (move.id === 'multiattack') {
		const memoryType = getHeldItemTypeProperty(pokemonData, 'onMemory');
		if (memoryType) return memoryType;
		const species = Dex.mod('gen9rrbt').species.get(getSpeciesName(pokemonData));
		if (species.baseSpecies === 'Silvally') return getPokemonTypes(pokemonData)[0] || move.type;
	}
	if (move.id === 'technoblast') {
		const driveType = getHeldItemTypeProperty(pokemonData, 'onDrive');
		if (driveType) return driveType;
		const type = getSpeciesFormeMoveType(pokemonData, {
			genesectburn: 'Fire',
			genesectdouse: 'Water',
			genesectshock: 'Electric',
			genesectchill: 'Ice',
		});
		if (type) return type;
	}
	if (move.id === 'naturalgift') {
		const naturalGift = getNaturalGiftData(pokemonData);
		if (naturalGift?.type) return naturalGift.type;
	}
	if (move.id === 'revelationdance') return getPokemonTypes(pokemonData)[0] || move.type;
	if (move.id === 'ragingbull') {
		const type = getSpeciesFormeMoveType(pokemonData, {
			taurospaldeacombat: 'Fighting',
			taurospaldeablaze: 'Fire',
			taurospaldeaaqua: 'Water',
		});
		if (type) return type;
	}
	if (move.id === 'aurawheel') {
		return getSpeciesFormeMoveType(pokemonData, {morpekohangry: 'Dark'}) || 'Electric';
	}
	if (move.id === 'terablast' && pokemonData.terastallized) return pokemonData.terastallized;
	if (move.id === 'terastarstorm' && getSpeciesID(pokemonData) === 'terapagosstellar') return 'Stellar';
	if (move.id === 'terrainpulse' && context?.terrain && pokemonIsGrounded(pokemonData)) {
		if (context.terrain === 'electricterrain') return 'Electric';
		if (context.terrain === 'grassyterrain') return 'Grass';
		if (context.terrain === 'mistyterrain') return 'Fairy';
		if (context.terrain === 'psychicterrain') return 'Psychic';
	}
	if (move.id === 'weatherball') {
		if (hasWeather(context, 'sunnyday' as ID)) return 'Fire';
		if (hasWeather(context, 'raindance' as ID)) return 'Water';
		if (hasWeather(context, 'sandstorm' as ID)) return 'Rock';
		if (hasWeather(context, 'snow' as ID)) return 'Ice';
	}
	if (pokemonCanHaveAbility(pokemonData, 'liquidvoice' as ID) && move.flags['sound']) return 'Water';
	if (pokemonCanHaveAbility(pokemonData, 'normalize' as ID) && move.id !== 'struggle') return 'Normal';
	if (move.type === 'Normal') {
		if (pokemonCanHaveAbility(pokemonData, 'refrigerate' as ID)) return 'Ice';
		if (pokemonCanHaveAbility(pokemonData, 'pixilate' as ID)) return 'Fairy';
		if (pokemonCanHaveAbility(pokemonData, 'aerilate' as ID)) return 'Flying';
		if (pokemonCanHaveAbility(pokemonData, 'galvanize' as ID)) return 'Electric';
	}
	return move.type;
}

function moveTypeWasAbilityModified(move: Move, pokemonData: AnyObject, context?: BTAIContext) {
	return move.type === 'Normal' && getModifiedMoveType(move, pokemonData, context) !== move.type;
}

function getPokemonTypes(pokemonData: AnyObject) {
	if (pokemonData.terastallized) return [pokemonData.terastallized];
	const dex = Dex.mod('gen9rrbt');
	return dex.species.get(getSpeciesName(pokemonData)).types;
}

function getPokemonWeight(pokemonData: AnyObject) {
	const dex = Dex.mod('gen9rrbt');
	return dex.species.get(getSpeciesName(pokemonData)).weightkg || 0;
}

function getSourceTypesForMove(pokemonData: AnyObject, type: string) {
	if (pokemonCanHaveAbility(pokemonData, 'protean' as ID) && !pokemonData.terastallized) return [type];
	return getPokemonTypes(pokemonData);
}

function getWeightBasedBasePower(weightkg: number) {
	if (weightkg >= 200) return 120;
	if (weightkg >= 100) return 100;
	if (weightkg >= 50) return 80;
	if (weightkg >= 25) return 60;
	if (weightkg >= 10) return 40;
	return 20;
}

function moveHasRecoilOrCrash(move: Move) {
	return !!move.recoil || !!(move as AnyObject).hasCrashDamage || move.selfdestruct === 'always';
}

function moveWillAlwaysCrit(move: Move) {
	return !!(move as AnyObject).willCrit;
}

function getBoosterBoostedStat(pokemonData: AnyObject) {
	let bestStat: StatIDExceptHP = 'atk';
	let bestValue = 0;
	for (const stat of ['atk', 'def', 'spa', 'spd', 'spe'] as StatIDExceptHP[]) {
		const value = pokemonData.stats?.[stat] || 0;
		if (value > bestValue) {
			bestValue = value;
			bestStat = stat;
		}
	}
	return bestStat;
}

function getActiveBoosterBoostedStat(ability: ID, pokemonData: AnyObject) {
	if (BOOSTER_STAT_IDS.has(pokemonData.boosterBoostedStat)) return pokemonData.boosterBoostedStat as StatIDExceptHP;
	const bestStat = pokemonData.volatileState?.[ability]?.bestStat;
	if (['atk', 'def', 'spa', 'spd', 'spe'].includes(bestStat)) return bestStat as StatIDExceptHP;
	return getBoosterBoostedStat(pokemonData);
}

function abilityBoostIsActive(ability: ID, pokemonData: AnyObject, context?: BTAIContext) {
	if (pokemonData.volatileState?.[ability]) return true;
	if (ability === 'protosynthesis') {
		return hasWeather(context, 'sunnyday' as ID) || getPokemonItemID(pokemonData) === 'boosterenergy';
	}
	if (ability === 'quarkdrive') {
		return context?.terrain === 'electricterrain' || getPokemonItemID(pokemonData) === 'boosterenergy';
	}
	return false;
}

function estimateSpeed(pokemonData: AnyObject, context?: BTAIContext) {
	const hasAbility = (ability: ID) => pokemonCanHaveAbility(pokemonData, ability);
	let speed = getStat(pokemonData, 'spe');
	for (const ability in WEATHER_SPEED_ABILITIES) {
		if (hasAbility(ability as ID) && hasWeather(context, WEATHER_SPEED_ABILITIES[ability])) speed *= 2;
	}
	for (const ability of getPossiblePokemonAbilityIDs(pokemonData)) {
		if (abilityBoostIsActive(ability, pokemonData, context) && getActiveBoosterBoostedStat(ability, pokemonData) === 'spe') {
			speed *= 1.5;
		}
	}
	if (hasAbility('unburden' as ID) && !getPokemonItemID(pokemonData)) speed *= 2;
	if (getPokemonItemID(pokemonData) === 'choicescarf') speed *= 1.5;
	return speed;
}

function getBoostModifier(boost: number) {
	boost = Math.max(-6, Math.min(6, boost || 0));
	return boost >= 0 ? (2 + boost) / 2 : 2 / (2 - boost);
}

function getStat(pokemonData: AnyObject, stat: StatIDExceptHP, ignoreBoosts = false) {
	const base = pokemonData.stats?.[stat] || 1;
	return Math.max(1, Math.floor(base * getBoostModifier(ignoreBoosts ? 0 : pokemonData.boosts?.[stat] || 0)));
}

function getCritAdjustedStat(
	pokemonData: AnyObject, stat: StatIDExceptHP, ignoreBoosts: boolean,
	criticalHit: boolean, offensive: boolean
) {
	const boost = pokemonData.boosts?.[stat] || 0;
	const critIgnoresBoost = criticalHit && (offensive ? boost < 0 : boost > 0);
	return getStat(pokemonData, stat, ignoreBoosts || critIgnoresBoost);
}

function getFixedMoveDamage(move: Move, sourceData: AnyObject) {
	const fixedDamage = (move as AnyObject).damage;
	if (fixedDamage === 'level') return getLevel(sourceData.details || '');
	if (typeof fixedDamage === 'number') return fixedDamage;
	return null;
}

function estimateDamage(
	moveid: ID, sourceData: AnyObject, targetData: AnyObject, useZMove = false, context?: BTAIContext
) {
	const dex = Dex.mod('gen9rrbt');
	const sourceSpecies = dex.species.get(getSpeciesName(sourceData));
	const move = dex.moves.get(moveid);
	if (!move.exists || move.category === 'Status') return 0;
	if (!firstActiveMoveOnlyIsAvailable(moveid, sourceData)) return 0;
	if (
		context?.terrain === 'psychicterrain' &&
		estimateMovePriority(move, sourceData, targetData) > 0 &&
		pokemonIsGrounded(targetData)
	) return 0;
	let basePower = move.basePower || 0;
	if (useZMove) {
		if (!move.zMove?.basePower) return 0;
		basePower = move.zMove.basePower;
	}
	if (!useZMove && ['storedpower', 'powertrip'].includes(moveid)) {
		basePower = move.basePower + 20 * getPositiveBoostCount(sourceData);
	}
	if (!useZMove && ['lowkick', 'grassknot'].includes(moveid)) {
		basePower = getWeightBasedBasePower(getPokemonWeight(targetData));
	}
	if (!useZMove && move.id === 'naturalgift') {
		const naturalGift = getNaturalGiftData(sourceData);
		if (!naturalGift?.basePower) return 0;
		basePower = naturalGift.basePower;
	}
	if (!useZMove && move.id === 'terrainpulse' && context?.terrain && pokemonIsGrounded(sourceData)) {
		basePower = 100;
	}
	if (!useZMove && move.id === 'terablast' && sourceData.terastallized === 'Stellar') {
		basePower = 100;
	}
	if (
		!useZMove &&
		moveid === 'weatherball' &&
		(['sunnyday', 'raindance', 'sandstorm', 'snow'] as ID[]).some(weather => hasWeather(context, weather))
	) {
		basePower = 100;
	}
	if (!useZMove && moveid === 'knockoff' && pokemonItemCanBeKnockedOff(targetData)) {
		basePower = Math.floor(basePower * 1.5);
	}
	if (!useZMove && ['solarbeam', 'solarblade'].includes(moveid) && context?.weather && !hasWeather(context, 'sunnyday' as ID)) {
		basePower = Math.floor(basePower * 0.5);
	}
	if (move.multihit === 2) basePower *= 2;
	if (moveid === 'tripleaxel') basePower = 120;
	if (moveid === 'ragefist') basePower = Math.min(350, 50 + 50 * (sourceData.timesAttacked || 0));
	if (
		context?.terrain === 'grassyterrain' &&
		GRASSY_TERRAIN_WEAKENED_MOVES.has(moveid) &&
		pokemonIsGrounded(targetData)
	) {
		basePower = Math.floor(basePower * 0.5);
	}
	const type = getModifiedMoveType(move, sourceData, context);
	const sourceHasAbility = (abilityid: ID) => pokemonCanHaveAbility(sourceData, abilityid);
	const targetHasAbility = (abilityid: ID) => pokemonCanHaveAbility(targetData, abilityid);
	if (moveHasSelfKO(move) && (sourceHasAbility('damp' as ID) || targetHasAbility('damp' as ID))) return 0;
	if (sourceHasAbility('technician' as ID) && basePower <= 60) basePower = Math.floor(basePower * 1.5);
	if ((['refrigerate', 'pixilate', 'aerilate', 'galvanize'] as ID[]).some(sourceHasAbility) && move.type === 'Normal') {
		basePower = Math.floor(basePower * 1.2);
	}
	if (sourceHasAbility('normalize' as ID) && move.id !== 'struggle') basePower = Math.floor(basePower * 1.2);
	if (sourceHasAbility('liquidvoice' as ID) && move.flags['sound']) basePower = Math.floor(basePower * 1.2);
	if (sourceHasAbility('sharpness' as ID) && move.flags['slicing']) basePower = Math.floor(basePower * 1.5);
	if (sourceHasAbility('megalauncher' as ID) && move.flags['pulse']) basePower = Math.floor(basePower * 1.5);
	if (sourceHasAbility('ironfist' as ID) && move.flags['punch']) basePower = Math.floor(basePower * 1.3);
	if (sourceHasAbility('strongjaw' as ID) && move.flags['bite']) basePower = Math.floor(basePower * 1.5);
	if (sourceHasAbility('toughclaws' as ID) && move.flags['contact']) basePower = Math.floor(basePower * 1.3);
	if (sourceHasAbility('reckless' as ID) && moveHasRecoilOrCrash(move)) basePower = Math.floor(basePower * 1.2);
	if (sourceHasAbility('dragonsmaw' as ID) && type === 'Dragon') basePower = Math.floor(basePower * 1.5);
	if (sourceHasAbility('transistor' as ID) && type === 'Electric') basePower = Math.floor(basePower * 1.3);
	if (sourceHasAbility('sandforce' as ID) && hasWeather(context, 'sandstorm' as ID) && ['Rock', 'Ground', 'Steel'].includes(type)) {
		basePower = Math.floor(basePower * 1.3);
	}
	if (sourceHasAbility('swarm' as ID) && type === 'Bug') {
		const hp = getHPData(sourceData);
		if (hp.hp <= hp.maxhp / 3) basePower = Math.floor(basePower * 1.5);
	}
	if (sourceHasAbility('overgrow' as ID) && type === 'Grass') {
		const hp = getHPData(sourceData);
		if (hp.hp <= hp.maxhp / 3) basePower = Math.floor(basePower * 1.5);
	}
	if (sourceHasAbility('supremeoverlord' as ID)) {
		const fallen = Math.min(countFaintedAllies(context), 5);
		if (fallen) basePower = Math.floor(basePower * (4096 + 410 * fallen) / 4096);
	}
	if (sourceHasAbility('radicalaura' as ID) && type === 'Dark') basePower = Math.floor(basePower * 5448 / 4096);
	if (hasWeather(context, 'sunnyday' as ID)) {
		if (type === 'Fire') basePower = Math.floor(basePower * 1.5);
		if (type === 'Water') basePower = Math.floor(basePower * 0.5);
	} else if (hasWeather(context, 'raindance' as ID)) {
		if (type === 'Water') basePower = Math.floor(basePower * 1.5);
		if (type === 'Fire') basePower = Math.floor(basePower * 0.5);
	}
	if (context?.terrain === 'grassyterrain' && type === 'Grass' && pokemonIsGrounded(sourceData)) {
		basePower = Math.floor(basePower * 1.3);
	}
	if (context?.terrain === 'electricterrain' && type === 'Electric' && pokemonIsGrounded(sourceData)) {
		basePower = Math.floor(basePower * 1.3);
	}
	if (context?.terrain === 'psychicterrain' && type === 'Psychic' && pokemonIsGrounded(sourceData)) {
		basePower = Math.floor(basePower * 1.3);
	}
	if (context?.terrain === 'mistyterrain' && type === 'Dragon' && pokemonIsGrounded(targetData)) {
		basePower = Math.floor(basePower * 0.5);
	}

	const ignoresBoneImmunity = sourceHasAbility('familialrevenge' as ID) && move.flags['bone'];
	if (
		type === 'Ground' &&
		getPokemonItemID(targetData) === 'airballoon' &&
		!ignoresBoneImmunity &&
		!moveIgnoresTypeImmunity(move, type, sourceData)
	) return 0;
	if (!ignoresBoneImmunity && abilityBlocksDamagingMove(move, type, sourceData, targetData)) return 0;
	let typeMod = 0;
	for (const targetType of getPokemonTypes(targetData)) {
		if (!dex.getImmunity(type, targetType)) {
			if (
				ignoresBoneImmunity ||
				moveIgnoresTypeImmunity(move, type, sourceData, targetType)
			) continue;
			return 0;
		}
		const effectiveness = dex.getEffectiveness(type, targetType);
		typeMod += effectiveness;
	}
	if (ignoresBoneImmunity && typeMod < 0) typeMod++;
	const typeMultiplier = Math.pow(2, typeMod);
	if (
		targetHasAbility('wonderguard' as ID) &&
		typeMultiplier <= 1 &&
		!sourceIgnoresTargetAbility(sourceData, move)
	) return 0;
	const fixedDamage = getFixedMoveDamage(move, sourceData);
	if (fixedDamage !== null) {
		let damage = Math.max(0, Math.floor(fixedDamage));
		if (sturdyPreventsOHKO(move, sourceData, targetData, damage, useZMove)) {
			damage = Math.max(0, getHPData(targetData).hp - 1);
		}
		return damage;
	}
	let category = move.category;
	if (
		!useZMove &&
		['terablast', 'terastarstorm'].includes(move.id) &&
		sourceData.terastallized &&
		getStat(sourceData, 'atk', true) > getStat(sourceData, 'spa', true)
	) {
		category = 'Physical';
	}
	const offensiveStat = (move as AnyObject).overrideOffensiveStat || (category === 'Physical' ? 'atk' : 'spa');
	const defensiveStat = (move as AnyObject).overrideDefensiveStat || (category === 'Physical' ? 'def' : 'spd');
	const criticalHit = !useZMove && moveWillAlwaysCrit(move);
	let attack = getCritAdjustedStat(sourceData, offensiveStat, targetHasAbility('unaware' as ID), criticalHit, true);
	for (const abilityid of getPossiblePokemonAbilityIDs(sourceData)) {
		if (abilityBoostIsActive(abilityid, sourceData, context) && getActiveBoosterBoostedStat(abilityid, sourceData) === offensiveStat) {
			attack *= 1.3;
			break;
		}
	}
	if (category === 'Special' && sourceHasAbility('solarpower' as ID) && hasWeather(context, 'sunnyday' as ID)) attack *= 1.5;
	if (targetHasAbility('vesselofruin' as ID) && category === 'Special' && !sourceHasAbility('vesselofruin' as ID)) attack *= 0.75;
	let defense = getCritAdjustedStat(targetData, defensiveStat, sourceHasAbility('unaware' as ID), criticalHit, false);
	for (const abilityid of getPossiblePokemonAbilityIDs(targetData)) {
		if (abilityBoostIsActive(abilityid, targetData, context) && getActiveBoosterBoostedStat(abilityid, targetData) === defensiveStat) {
			defense *= 1.3;
			break;
		}
	}
	if (category === 'Physical' && hasWeather(context, 'snow' as ID) && getPokemonTypes(targetData).includes('Ice')) {
		defense *= 1.5;
	}
	if (category === 'Special' && hasWeather(context, 'sandstorm' as ID) && getPokemonTypes(targetData).includes('Rock')) {
		defense *= 1.5;
	}
	const item = toID(sourceData.item);
	if (category === 'Physical') {
		if (item === 'thickclub' && ['Cubone', 'Marowak', 'Marowak-Alola'].includes(sourceSpecies.baseSpecies)) attack *= 2;
		if (item === 'choiceband') attack *= 1.5;
		if (sourceHasAbility('hustle' as ID)) attack *= 1.5;
	} else if (item === 'choicespecs') {
		attack *= 1.5;
	}
	const level = getLevel(sourceData.details || '');
	let damage = Math.floor(Math.floor(Math.floor((2 * level / 5 + 2) * basePower * attack / defense) / 50) + 2);
	if (getSourceTypesForMove(sourceData, type).includes(type)) damage = Math.floor(damage * 1.5);
	damage = Math.floor(damage * typeMultiplier);
	if (criticalHit) {
		damage = Math.floor(damage * 1.5);
		if (sourceHasAbility('sniper' as ID)) damage = Math.floor(damage * 1.5);
	}
	const sourceStatus = getPokemonStatusID(sourceData);
	if (sourceStatus === 'brn' && category === 'Physical' && !sourceHasAbility('guts' as ID) && moveid !== 'facade') {
		damage = Math.floor(damage * 0.5);
	}
	if (sourceStatus === 'frz' && category === 'Special' && moveid !== 'facade') {
		damage = Math.floor(damage * 0.5);
	}
	if (targetHasAbility('purifyingsalt' as ID) && type === 'Ghost' && !sourceHasAbility('moldbreaker' as ID)) {
		damage = Math.floor(damage * 0.5);
	}
	if (item === 'lifeorb') damage = Math.floor(damage * 1.3);
	if (item === 'expertbelt' && typeMultiplier > 1) damage = Math.floor(damage * 1.2);
	if ((TYPE_BOOSTING_ITEMS[type] || []).includes(item as ID)) damage = Math.floor(damage * 1.2);
	if (sturdyPreventsOHKO(move, sourceData, targetData, damage, useZMove)) {
		damage = Math.max(0, getHPData(targetData).hp - 1);
	}
	return Math.max(0, damage);
}

function isSetupMove(moveid: ID) {
	return [
		'swordsdance', 'dragondance', 'nastyplot', 'calmmind', 'bulkup',
		'quiverdance', 'victorydance', 'shellsmash', 'coil', 'curse',
		'growth', 'honeclaws', 'workup', 'shiftgear', 'agility', 'rockpolish',
		'autotomize', 'irondefense', 'acidarmor', 'barrier', 'amnesia',
		'cosmicpower', 'cottonguard', 'defendorder', 'stockpile',
	].includes(moveid);
}

function moveCanCauseStatusAilment(move: Move) {
	if (move.status && STATUS_AILMENT_IDS.has(move.status as ID)) return true;
	const secondary = move.secondary as AnyObject | null;
	if (secondary?.status && STATUS_AILMENT_IDS.has(toID(secondary.status))) return true;
	return !!move.secondaries?.some(secondaryData => (
		secondaryData.status && STATUS_AILMENT_IDS.has(toID(secondaryData.status))
	));
}

function getMoveTags(moveid: ID) {
	const move = Dex.mod('gen9rrbt').moves.get(moveid);
	if (!move.exists) return [] as BTMoveTag[];
	const tags: BTMoveTag[] = [];
	if (DISRUPTION_MOVE_IDS.has(moveid)) tags.push('disruption');
	if (HAZARD_MOVE_IDS.has(moveid) || move.sideCondition && HAZARD_MOVE_IDS.has(toID(move.sideCondition))) {
		tags.push('hazard');
	}
	if (isSetupMove(moveid)) tags.push('setup');
	if (getDamagingPriorityMoveIDs().has(moveid)) tags.push('priority');
	if (moveCanCauseStatusAilment(move)) tags.push('status');
	return tags;
}

function isStallingMove(moveid: ID) {
	return !!(Dex.mod('gen9rrbt').moves.get(moveid) as AnyObject).stallingMove;
}

function canUseHazard(moveid: ID, targetHazards: BTSideHazards) {
	if (moveid === 'stealthrock') return !targetHazards.stealthrock;
	if (moveid === 'spikes') return targetHazards.spikes < 3;
	if (moveid === 'toxicspikes') return targetHazards.toxicspikes < 2;
	if (moveid === 'stickyweb') return !targetHazards.stickyweb;
	return true;
}

function isAvailableMoveChoice(move: AnyObject) {
	return !move.disabled && move.pp !== 0;
}

function estimateBestDamageFromActive(
	active: AnyObject, sourceData: AnyObject, targetData: AnyObject | null, futureMoveActive: boolean,
	context?: BTAIContext
) {
	if (!targetData) return 0;
	let bestDamage = 0;
	for (const activeMove of active.moves || []) {
		if (!isAvailableMoveChoice(activeMove)) continue;
		const moveid = activeMove.id as ID;
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (!move.exists || move.category === 'Status' || (futureMoveActive && move.flags['futuremove'])) continue;
		bestDamage = Math.max(bestDamage, estimateDamage(moveid, sourceData, targetData, false, context));
	}
	return bestDamage;
}

function shouldSwitchForBetterMatchup(
	activeData: AnyObject, targetData: AnyObject,
	activeDamage: number, switchDamage: number, targetThreat: number
) {
	if (switchDamage <= activeDamage || switchDamage <= 0) return false;
	const activeHP = getHPData(activeData);
	const targetHP = getHPData(targetData);
	const targetRemaining = Math.max(1, targetHP.hp);
	const activeDamageFraction = activeDamage / targetRemaining;
	const switchDamageFraction = switchDamage / targetRemaining;
	const threatFraction = targetThreat / Math.max(1, activeHP.hp);
	if (switchDamage >= targetRemaining && activeDamage * 2 < targetRemaining) return true;
	if (activeDamageFraction < 0.25 && switchDamageFraction >= activeDamageFraction + 0.3) return true;
	return activeDamageFraction < 0.34 && switchDamageFraction >= 0.5 && threatFraction >= 0.25;
}

function shouldSwitchOutOfBadPriorityMatchup(
	activeData: AnyObject, targetData: AnyObject, switchOption: AnyObject | null,
	activeDamage: number, switchDamage: number, targetThreat: number, context?: BTAIContext
) {
	if (!switchOption) return false;
	const activePriority = estimateBestPriorityDamageFromPokemon(activeData, targetData, context);
	if (activePriority.priority <= 0) return false;
	const activeHP = getHPData(activeData);
	const targetHP = getHPData(targetData);
	if (activeDamage >= targetHP.hp) return false;
	const priorityFraction = activePriority.damage / Math.max(1, targetHP.maxhp);
	const activeDamageFraction = activeDamage / Math.max(1, targetHP.maxhp);
	const targetThreatFraction = targetThreat / Math.max(1, activeHP.maxhp);
	if (priorityFraction >= 0.35 || targetThreatFraction < 0.35) return false;
	const switchHP = getHPData(switchOption);
	const switchThreat = estimateBestDamageFromPokemon(targetData, switchOption, getReverseContext(context));
	const switchThreatFraction = switchThreat / Math.max(1, switchHP.maxhp);
	if (switchThreat >= switchHP.hp && switchDamage < targetHP.hp) return false;
	return (
		switchThreatFraction + 0.18 < targetThreatFraction &&
		(switchDamage >= activeDamage * 0.75 || activeDamageFraction < 0.45)
	);
}

function shouldSwitchOutOfPriorityThreat(
	activeData: AnyObject, targetData: AnyObject, switchOption: AnyObject | null,
	activeDamage: number, switchDamage: number, context?: BTAIContext
) {
	if (!switchOption) return false;
	const activeHP = getHPData(activeData);
	const targetHP = getHPData(targetData);
	if (activeDamage >= targetHP.hp) return false;
	const reverseContext = getReverseContext(context);
	const priorityThreat = estimateBestPriorityDamageFromPokemon(targetData, activeData, reverseContext);
	if (priorityThreat.priority <= 0 || priorityThreat.damage <= 0) return false;
	if (priorityThreat.damage < activeHP.hp * 0.35 && priorityThreat.damage < activeHP.maxhp * 0.28) return false;
	const switchHP = getHPData(switchOption);
	const switchPriorityDamage = estimateDamage(priorityThreat.moveid, targetData, switchOption, false, reverseContext);
	const switchDamageIn = estimateBestDamageFromPokemon(targetData, switchOption, reverseContext);
	if (switchPriorityDamage >= switchHP.hp && switchDamage < targetHP.hp) return false;
	return switchPriorityDamage < priorityThreat.damage * 0.55 || switchDamageIn < priorityThreat.damage * 0.75;
}

function shouldStayToTrade(activeData: AnyObject, targetData: AnyObject, activeDamage: number, targetThreat: number) {
	const activeHP = getHPData(activeData);
	const targetHP = getHPData(targetData);
	const targetRemaining = Math.max(1, targetHP.hp);
	const damageFraction = activeDamage / targetRemaining;
	if (activeDamage >= targetHP.hp) return true;
	if (targetThreat < activeHP.hp) return false;
	if (damageFraction >= 0.55) return true;
	const activeFraction = activeHP.hp / Math.max(1, activeHP.maxhp);
	return activeFraction <= 0.35 && damageFraction >= 0.35;
}

function shouldSwitchOutOfLethalThreat(
	activeData: AnyObject, targetData: AnyObject, switchOption: AnyObject | null,
	activeDamage: number, switchDamage: number, targetThreat: number, context?: BTAIContext
) {
	if (!switchOption) return false;
	const activeHP = getHPData(activeData);
	const targetHP = getHPData(targetData);
	const threatContext = context ? {...context, sourceSide: undefined} : undefined;
	const priorityThreat = estimateBestPriorityDamageFromPokemon(targetData, activeData, threatContext);
	const lethalPriorityThreat = priorityThreat.priority > 0 && priorityThreat.damage >= activeHP.hp;
	if (lethalPriorityThreat) {
		const activeImmediateDamage = estimateBestDamageActingBefore(
			activeData, targetData, priorityThreat.priority, context
		);
		if (activeImmediateDamage >= targetHP.hp) return false;
	} else if (shouldStayToTrade(activeData, targetData, activeDamage, targetThreat)) {
		return false;
	}
	const switchHP = getHPData(switchOption);
	const switchThreat = estimateBestDamageFromPokemon(targetData, switchOption, threatContext);
	if (lethalPriorityThreat) {
		const switchPriorityThreat = estimateDamage(priorityThreat.moveid, targetData, switchOption, false, threatContext);
		if (switchPriorityThreat < switchHP.hp) return true;
	}
	if (switchThreat >= switchHP.hp && switchDamage < getHPData(targetData).hp) return false;
	return switchDamage >= activeDamage * 1.25 || switchThreat < targetThreat * 0.75;
}

function shouldSwitchOutOfNoProgress(
	activeData: AnyObject, targetData: AnyObject, switchOption: AnyObject | null,
	activeDamage: number, switchDamage: number, targetThreat: number, context?: BTAIContext
) {
	if (!switchOption || activeDamage > 0 || targetThreat <= 0) return false;
	const activeHP = getHPData(activeData);
	const switchHP = getHPData(switchOption);
	const switchThreat = estimateBestDamageFromPokemon(targetData, switchOption, getReverseContext(context));
	if (switchThreat >= switchHP.hp && targetThreat < activeHP.hp) return false;
	if (switchDamage > 0) return true;
	if (CHOICE_ITEM_IDS.has(getPokemonItemID(activeData))) return true;
	return targetThreat >= activeHP.maxhp * 0.35 || targetThreat >= activeHP.hp * 0.55;
}

function shouldSwitchForAbility(activeData: AnyObject, switchDamage: number, activeDamage: number) {
	const ability = getPokemonAbilityID(activeData);
	const hp = getHPData(activeData);
	const hpFraction = hp.hp / Math.max(1, hp.maxhp);
	if (ability === 'zerotohero' && getSpeciesID(activeData) === 'palafin') return true;
	if (ability === 'regenerator' && hpFraction < 0.67 && switchDamage >= activeDamage) return true;
	if (ability === 'naturalcure' && hasStatus(activeData) && switchDamage >= activeDamage * 0.75) return true;
	return false;
}

function shouldSwitchToDisruptSetup(
	activeData: AnyObject, targetData: AnyObject, switchOption: AnyObject | null,
	activeDamage: number, switchDamage: number, targetThreat: number, context?: BTAIContext
) {
	if (!switchOption) return false;
	const setupPressure = getSetupThreatPressure(targetData);
	if (setupPressure < 55) return false;
	const activeUtility = getAntiSetupDisruptionValue(activeData, targetData, null, null, context);
	const switchContext = getWeatherContextAfterPokemonSwitch(switchOption, context) || context;
	const switchUtility = getAntiSetupDisruptionValue(switchOption, targetData, null, null, switchContext);
	if (switchUtility < Math.max(70, activeUtility + 28)) return false;
	const targetHP = getHPData(targetData);
	const switchHP = getHPData(switchOption);
	const switchThreat = estimateBestDamageFromPokemon(targetData, switchOption, getReverseContext(switchContext));
	if (switchThreat >= switchHP.hp && switchDamage < targetHP.hp * 0.55) return false;
	const activeHP = getHPData(activeData);
	if (targetThreat >= activeHP.hp && activeDamage >= targetHP.hp * 0.55 && !getDefensiveBoostPressure(targetData)) {
		return false;
	}
	return true;
}

function getAccuracyFactor(move: Move, pokemonData: AnyObject, context?: BTAIContext) {
	if (move.accuracy === true) return 1;
	let factor = typeof move.accuracy === 'number' ? Math.max(0.5, move.accuracy / 100) : 0.9;
	if (['thunder', 'hurricane'].includes(move.id)) {
		if (hasWeather(context, 'raindance' as ID)) factor = 1;
		if (hasWeather(context, 'sunnyday' as ID)) factor = 0.5;
	}
	if (move.id === 'blizzard' && hasWeather(context, 'snow' as ID)) factor = 1;
	const ability = getPokemonAbilityID(pokemonData);
	if (ability === 'victorystar') factor *= 1.1;
	if (ability === 'hustle' && move.category === 'Physical') factor *= 0.8;
	return Math.min(1.1, factor);
}

function hasStatus(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	return !!(pokemonData.condition || '').split(' ')[1];
}

function getPokemonStatusID(pokemonData: AnyObject | null) {
	if (!pokemonData) return '' as ID;
	return toID((pokemonData.condition || '').split(' ')[1] || '');
}

function pokemonCanRecover(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	return getPokemonMoveIDs(pokemonData).some(moveid => RECOVERY_MOVE_IDS.has(moveid));
}

function moveAppliesHealBlock(move: Move, moveid: ID) {
	return moveid === 'psychicnoise' || (move.secondary as AnyObject | null)?.volatileStatus === 'healblock';
}

function estimateRecoveryAmount(moveid: ID, pokemonData: AnyObject, context?: BTAIContext) {
	const hp = getHPData(pokemonData);
	let fraction = 0.5;
	if (['morningsun', 'moonlight', 'synthesis'].includes(moveid)) {
		if (hasWeather(context, 'sunnyday' as ID)) {
			fraction = 2 / 3;
		} else if (context?.weather) {
			fraction = 0.25;
		}
	}
	return Math.max(1, Math.floor(hp.maxhp * fraction));
}

function pokemonKnowsMove(pokemonData: AnyObject | null, moveid: ID) {
	if (!pokemonData) return false;
	return getPokemonMoveIDs(pokemonData).includes(moveid);
}

function pokemonHasAntiAttackPriority(pokemonData: AnyObject | null) {
	return !!pokemonData && getPokemonMoveIDs(pokemonData).some(moveid => ANTI_ATTACK_PRIORITY_MOVE_IDS.has(moveid));
}

function isAntiAttackPriorityMove(moveid: ID) {
	return ANTI_ATTACK_PRIORITY_MOVE_IDS.has(moveid);
}

function getAntiAttackPriorityFailureKeyFromSpecies(actorSpecies: ID, targetSpecies: ID, moveid: ID) {
	return `${actorSpecies}|${targetSpecies}|${moveid}`;
}

function getAntiAttackPriorityFailureKey(pokemonData: AnyObject, targetData: AnyObject | null, moveid: ID) {
	return getAntiAttackPriorityFailureKeyFromSpecies(getSpeciesID(pokemonData), getSpeciesID(targetData), moveid);
}

function getAntiAttackPriorityFailureCount(
	state: BTBattleState, pokemonData: AnyObject, targetData: AnyObject | null, moveid: ID
) {
	return state.antiAttackPriorityFailures?.[getAntiAttackPriorityFailureKey(pokemonData, targetData, moveid)] || 0;
}

function rememberAntiAttackPriorityFailure(state: BTBattleState, outcome: BTMoveOutcome | null | undefined) {
	if (!outcome || !isAntiAttackPriorityMove(outcome.moveid)) return;
	if (!state.antiAttackPriorityFailures) state.antiAttackPriorityFailures = {};
	const parts = outcome.decision.key.split('|');
	const actorSpecies = toID(parts[1]);
	const targetSpecies = toID(parts[2]);
	if (!actorSpecies || !targetSpecies) return;
	const key = getAntiAttackPriorityFailureKeyFromSpecies(actorSpecies, targetSpecies, outcome.moveid);
	state.antiAttackPriorityFailures[key] = Math.min(9, (state.antiAttackPriorityFailures[key] || 0) + 1);
}

function targetLikelyProtectingAfterWish(state: BTBattleState, targetData: AnyObject | null) {
	if (!targetData || !pokemonKnowsMove(targetData, 'protect' as ID)) return false;
	return state.lastPlayerMoveByIdent?.[getPokemonDecisionID(targetData)] === 'wish';
}

function pokemonHasMoveTag(pokemonData: AnyObject | null, tag: BTMoveTag) {
	if (!pokemonData) return false;
	for (const moveid of getPokemonMoveIDs(pokemonData)) {
		if (getMoveTags(moveid).includes(tag)) return true;
	}
	const speciesid = getSpeciesID(pokemonData);
	return !!opponentMemory[speciesid]?.tags?.[tag];
}

function getPositiveBoostCount(pokemonData: AnyObject | null) {
	if (!pokemonData?.boosts) return 0;
	let boosts = 0;
	for (const boost of Object.values(pokemonData.boosts)) {
		if ((boost as number) > 0) boosts += boost as number;
	}
	return boosts;
}

function getDefensiveBoostPressure(pokemonData: AnyObject | null) {
	if (!pokemonData?.boosts) return 0;
	const defBoost = Math.max(0, pokemonData.boosts.def || 0);
	const spdBoost = Math.max(0, pokemonData.boosts.spd || 0);
	const evasionBoost = Math.max(0, pokemonData.boosts.evasion || 0);
	return defBoost * 2 + spdBoost * 2 + evasionBoost * 3;
}

function pokemonHasSetupPayoffMove(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	return getPokemonMoveIDs(pokemonData).some(moveid => SETUP_PAYOFF_MOVE_IDS.has(moveid));
}

function getSetupThreatPressure(targetData: AnyObject | null) {
	if (!targetData) return 0;
	const positiveBoosts = getPositiveBoostCount(targetData);
	const defensivePressure = getDefensiveBoostPressure(targetData);
	let pressure = positiveBoosts * 12 + defensivePressure * 8;
	if (pokemonHasMoveTag(targetData, 'setup')) pressure += 34;
	if (pokemonHasSetupPayoffMove(targetData)) pressure += 28 + defensivePressure * 5;
	if (pokemonCanRecover(targetData) && positiveBoosts) pressure += 20;
	return pressure;
}

function targetLooksLikeSetupThreat(targetData: AnyObject | null) {
	return getPositiveBoostCount(targetData) > 0 || pokemonHasMoveTag(targetData, 'setup');
}

function pokemonCanPivotOut(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	for (const moveid of getPokemonMoveIDs(pokemonData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid) as AnyObject;
		if (SELF_SWITCH_MOVE_IDS.has(moveid) || move.selfSwitch) return true;
	}
	return false;
}

function getPivotPriorityRevengeThreat(
	setupData: AnyObject, targetData: AnyObject | null, context?: BTAIContext
) {
	if (!targetData || !pokemonCanPivotOut(targetData) || !context?.targetSide?.length) {
		return {damage: 0, priority: 0, moveid: '' as ID};
	}
	const setupHP = getHPData(setupData);
	let best = {damage: 0, priority: 0, moveid: '' as ID};
	for (const foe of remainingBacklinePokemon(context.targetSide, targetData)) {
		const threat = estimateBestPriorityDamageFromPokemon(foe, setupData, getReverseContext(context));
		if (threat.priority <= 0 || threat.damage <= 0) continue;
		const damageFraction = threat.damage / Math.max(1, setupHP.maxhp);
		if (damageFraction < 0.35 && threat.damage < setupHP.hp * 0.45) continue;
		if (threat.damage > best.damage || (threat.damage === best.damage && threat.priority > best.priority)) {
			best = threat;
		}
	}
	return best;
}

function isReflectableHazardOrStatusMove(moveid: ID) {
	const move = Dex.mod('gen9rrbt').moves.get(moveid);
	if (!move.exists || !move.flags['reflectable']) return false;
	const tags = getMoveTags(moveid);
	return tags.includes('hazard') || tags.includes('status');
}

function getReflectableHazardOrStatusValue(pokemonData: AnyObject | null) {
	if (!pokemonData) return 0;
	let value = 0;
	for (const moveid of getPokemonMoveIDs(pokemonData)) {
		if (!isReflectableHazardOrStatusMove(moveid)) continue;
		const tags = getMoveTags(moveid);
		value += tags.includes('hazard') ? 42 : 30;
	}
	return Math.min(value, 84);
}

function pokemonBlocksPhazing(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	return pokemonCanHaveAbility(pokemonData, 'suctioncups' as ID) ||
		pokemonCanHaveAbility(pokemonData, 'guarddog' as ID);
}

function getPhazerContext(context?: BTAIContext) {
	if (!context) return undefined;
	return {
		...context,
		sourceSide: context.targetSide,
		ownSide: context.targetSide,
		targetSide: context.ownSide,
	};
}

function phazingMoveCanForceOut(
	moveid: ID, phazerData: AnyObject, setupData: AnyObject, phazerPokemon: Pokemon | null, context?: BTAIContext
) {
	if (pokemonBlocksPhazing(setupData)) return false;
	const move = Dex.mod('gen9rrbt').moves.get(moveid);
	if (!move.exists) return false;
	if (move.category === 'Status') {
		if (pokemonHasVolatile(phazerPokemon, 'taunt')) return false;
		if (move.flags['sound'] && pokemonCanHaveAbility(setupData, 'soundproof' as ID)) return false;
		if (move.flags['wind'] && pokemonCanHaveAbility(setupData, 'windrider' as ID)) return false;
		if (move.flags['reflectable'] && pokemonCanHaveAbility(setupData, 'magicbounce' as ID)) return false;
		return true;
	}
	return estimateDamage(moveid, phazerData, setupData, false, getPhazerContext(context)) > 0;
}

function getSetupPhazingThreat(
	setupData: AnyObject, phazerData: AnyObject | null, phazerPokemon: Pokemon | null, context?: BTAIContext
) {
	if (!phazerData) return '' as ID;
	for (const moveid of getPokemonMoveIDs(phazerData)) {
		if (!PHASING_MOVE_IDS.has(moveid)) continue;
		if (phazingMoveCanForceOut(moveid, phazerData, setupData, phazerPokemon, context)) return moveid;
	}
	return '' as ID;
}

function getAntiSetupDisruptionValue(
	sourceData: AnyObject | null, targetData: AnyObject | null, sourcePokemon: Pokemon | null = null,
	targetPokemon: Pokemon | null = null, context?: BTAIContext
) {
	if (!sourceData || !targetData) return 0;
	const pressure = getSetupThreatPressure(targetData);
	if (!pressure) return 0;
	const positiveBoosts = getPositiveBoostCount(targetData);
	const defensivePressure = getDefensiveBoostPressure(targetData);
	let best = 0;
	for (const moveid of getPokemonMoveIDs(sourceData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (!move.exists) continue;
		if (PHASING_MOVE_IDS.has(moveid)) {
			if (phazingMoveCanForceOut(moveid, sourceData, targetData, sourcePokemon, context)) {
				best = Math.max(best, 96 + pressure + defensivePressure * 6);
			}
		} else if (moveid === 'haze') {
			if (!statusMoveBlocked(move, moveid, sourceData, targetData, targetPokemon, context) && positiveBoosts) {
				best = Math.max(best, 112 + pressure + defensivePressure * 6);
			}
		} else if (moveid === 'clearsmog') {
			if (positiveBoosts && estimateDamage(moveid, sourceData, targetData, false, context) > 0) {
				best = Math.max(best, 104 + pressure + defensivePressure * 5);
			}
		} else if (moveid === 'taunt') {
			if (!statusMoveBlocked(move, moveid, sourceData, targetData, targetPokemon, context)) {
				let tauntValue = 48;
				if (pokemonHasMoveTag(targetData, 'setup')) tauntValue += 34;
				if (pokemonCanRecover(targetData)) tauntValue += 24;
				if (pokemonHasSetupPayoffMove(targetData)) tauntValue += 18;
				if (positiveBoosts) tauntValue += Math.min(65, positiveBoosts * 8 + defensivePressure * 5);
				best = Math.max(best, tauntValue);
			}
		} else if (moveid === 'encore') {
			if (!statusMoveBlocked(move, moveid, sourceData, targetData, targetPokemon, context)) {
				best = Math.max(best, 42 + Math.min(60, pressure));
			}
		}
	}
	return best;
}

function sideHasAbility(side: AnyObject[] | undefined, ability: ID) {
	return !!side?.some(pokemonData => getHPData(pokemonData).hp > 0 && pokemonCanHaveAbility(pokemonData, ability));
}

function remainingSidePokemon(side: AnyObject[] | undefined) {
	return (side || []).filter(pokemonData => getHPData(pokemonData).hp > 0);
}

function remainingBacklinePokemon(side: AnyObject[] | undefined, activeTarget: AnyObject | null) {
	const activeID = getPokemonDecisionID(activeTarget);
	return remainingSidePokemon(side).filter(pokemonData => (
		!pokemonData.active && getPokemonDecisionID(pokemonData) !== activeID
	));
}

function getFutureCoverageValue(pokemonData: AnyObject | null, context?: BTAIContext) {
	if (!pokemonData || !context?.targetSide?.length || !context.ownSide?.length) return 0;
	const ownID = getPokemonDecisionID(pokemonData);
	let value = 0;
	for (const target of remainingBacklinePokemon(context.targetSide, null)) {
		const targetHP = getHPData(target);
		const ownDamage = estimateBestDamageFromPokemon(pokemonData, target, context);
		if (ownDamage <= 0) continue;
		let bestOtherDamage = 0;
		for (const ally of remainingSidePokemon(context.ownSide)) {
			if (getPokemonDecisionID(ally) === ownID) continue;
			bestOtherDamage = Math.max(bestOtherDamage, estimateBestDamageFromPokemon(ally, target, context));
		}
		const targetThreatToTeam = remainingSidePokemon(context.ownSide).reduce((best, ally) => {
			if (getPokemonDecisionID(ally) === ownID) return best;
			const allyHP = getHPData(ally);
			const damage = estimateBestDamageFromPokemon(target, ally, getReverseContext(context));
			return Math.max(best, damage / Math.max(1, allyHP.maxhp));
		}, 0);
		if (ownDamage >= targetHP.hp && bestOtherDamage < targetHP.hp) {
			value += targetThreatToTeam >= 0.55 ? 58 : 38;
		} else if (ownDamage >= targetHP.maxhp * 0.55 && bestOtherDamage < ownDamage * 0.6) {
			value += targetThreatToTeam >= 0.55 ? 34 : 22;
		}
	}
	return Math.min(120, value);
}

function shouldPreserveForFutureMatchup(
	activeData: AnyObject, targetData: AnyObject, switchOption: AnyObject | null,
	activeDamage: number, switchDamage: number, targetThreat: number, context?: BTAIContext
) {
	if (!switchOption) return false;
	const futureValue = getFutureCoverageValue(activeData, context);
	if (futureValue < 45) return false;
	const activeHP = getHPData(activeData);
	const targetHP = getHPData(targetData);
	if (activeDamage >= targetHP.hp) return false;
	const switchThreat = estimateBestDamageFromPokemon(targetData, switchOption, getReverseContext(context));
	const switchHP = getHPData(switchOption);
	if (switchThreat >= switchHP.hp && switchDamage < targetHP.hp) return false;
	return targetThreat >= activeHP.hp * 0.35 || activeDamage < targetHP.maxhp * 0.35;
}

function hasChoiceResetOption(pokemonData: AnyObject, context?: BTAIContext) {
	const activeID = getPokemonDecisionID(pokemonData);
	return remainingSidePokemon(context?.ownSide).some(ally => (
		!ally.active && getPokemonDecisionID(ally) !== activeID
	));
}

function sideHasLowHPAlly(side: AnyObject[] | undefined, threshold = 0.5) {
	return remainingSidePokemon(side).some(pokemonData => {
		const hp = getHPData(pokemonData);
		return hp.hp < hp.maxhp * threshold;
	});
}

function getViableSelfSwitchBenchPokemon(pokemonData: AnyObject, context?: BTAIContext) {
	const activeID = getPokemonDecisionID(pokemonData);
	return remainingSidePokemon(context?.ownSide).filter(ally => {
		if (ally.active || getPokemonDecisionID(ally) === activeID) return false;
		const hp = getHPData(ally);
		return estimateHazardDamage(ally, context?.ownHazards) < hp.hp;
	});
}

function getPokemonSideID(pokemonData: AnyObject | null) {
	const sideid = getLineSideID(pokemonData?.ident);
	return sideid === 'p1' || sideid === 'p2' ? sideid : null;
}

function getPendingWishForPokemon(state: BTBattleState, pokemonData: AnyObject | null) {
	const sideid = getPokemonSideID(pokemonData);
	if (!sideid) return null;
	return state.pendingWishes?.[sideid] || null;
}

function getWishSelfHealScore(state: BTBattleState, pokemonData: AnyObject) {
	const pendingWish = getPendingWishForPokemon(state, pokemonData);
	if (!pendingWish) return 0;
	const hp = getHPData(pokemonData);
	const missing = Math.max(0, hp.maxhp - hp.hp);
	if (!missing) return 0;
	let score = Math.min(missing, pendingWish.heal) / Math.max(1, hp.maxhp) * 145;
	if (hp.hp <= hp.maxhp * 0.5) score += 28;
	if (hp.hp <= hp.maxhp * 0.25) score += 22;
	return score;
}

function getBestWishPassScore(state: BTBattleState, pokemonData: AnyObject, context?: BTAIContext) {
	const pendingWish = getPendingWishForPokemon(state, pokemonData);
	if (!pendingWish) return 0;
	const activeID = getPokemonDecisionID(pokemonData);
	let bestScore = 0;
	for (const ally of remainingSidePokemon(context?.ownSide)) {
		const allyID = getPokemonDecisionID(ally);
		if (allyID === activeID || ally.active) continue;
		const hp = getHPData(ally);
		const entryDamage = estimateHazardDamage(ally, context?.ownHazards);
		const entryHP = hp.hp - entryDamage;
		if (entryHP <= 0) continue;
		const missing = Math.max(0, hp.maxhp - entryHP);
		if (!missing) continue;
		let score = Math.min(missing, pendingWish.heal) / Math.max(1, hp.maxhp) * 150;
		if (entryHP <= hp.maxhp * 0.5) score += 26;
		if (entryHP <= hp.maxhp * 0.25) score += 24;
		bestScore = Math.max(bestScore, score);
	}
	return bestScore;
}

function activeHasAvailableMove(active: AnyObject, moveid: ID) {
	return (active.moves || []).some((move: AnyObject) => move.id === moveid && isAvailableMoveChoice(move));
}

function shouldStayForPendingWish(
	active: AnyObject, pokemonData: AnyObject, targetData: AnyObject | null,
	state: BTBattleState, targetThreat: number, context?: BTAIContext
) {
	if (!getPendingWishForPokemon(state, pokemonData)) return false;
	if (activeHasAvailableMove(active, 'protect' as ID) && getWishSelfHealScore(state, pokemonData) >= 30) {
		return true;
	}
	if (activeHasAvailableMove(active, 'teleport' as ID) && getBestWishPassScore(state, pokemonData, context) >= 35) {
		const hp = getHPData(pokemonData);
		return targetThreat < hp.hp || !targetData;
	}
	return false;
}

function getGrassyTerrainHeal(pokemonData: AnyObject | null, context?: BTAIContext) {
	if (!pokemonData || context?.terrain !== 'grassyterrain' || !pokemonIsGrounded(pokemonData)) return 0;
	const hp = getHPData(pokemonData);
	if (hp.hp >= hp.maxhp) return 0;
	return Math.max(1, Math.floor(hp.maxhp / 16));
}

function hasTauntThreat(sourceData: AnyObject, targetData: AnyObject | null, context?: BTAIContext) {
	if (!targetData || !pokemonKnowsMove(targetData, 'taunt' as ID)) return false;
	const taunt = Dex.mod('gen9rrbt').moves.get('taunt');
	const reverseContext = getReverseContext(context);
	if (statusMoveBlocked(taunt, 'taunt' as ID, targetData, sourceData, null, reverseContext)) return false;
	const targetPriority = estimateMovePriority(taunt, targetData, sourceData);
	return targetPriority > 0 ||
		estimateSpeed(targetData, reverseContext) >= estimateSpeed(sourceData, context);
}

function getSetupBoosts(moveid: ID): SparseBoostsTable | null {
	const move = Dex.mod('gen9rrbt').moves.get(moveid);
	return (move.boosts || (move.self as AnyObject | null)?.boosts || null) as SparseBoostsTable | null;
}

function cloneWithBoosts(pokemonData: AnyObject, boosts: SparseBoostsTable) {
	const clone = {...pokemonData, boosts: {...(pokemonData.boosts || {})}};
	for (const [stat, boost] of Object.entries(boosts)) {
		clone.boosts[stat] = Math.max(-6, Math.min(6, (clone.boosts[stat] || 0) + (boost as number)));
	}
	return clone;
}

function setupMoveHasBoostRoom(pokemonData: AnyObject, boosts: SparseBoostsTable | null) {
	if (!boosts) return false;
	for (const [stat, boost] of Object.entries(boosts)) {
		const amount = boost as number;
		const current = pokemonData.boosts?.[stat] || 0;
		if (amount > 0 && current < 6) return true;
		if (amount < 0 && current > -6) return true;
	}
	return false;
}

function estimateSetupSweepPotential(moveid: ID, pokemonData: AnyObject, context?: BTAIContext) {
	const boosts = getSetupBoosts(moveid);
	if (!boosts || !context?.targetSide?.length) return 0;
	const boostedData = cloneWithBoosts(pokemonData, boosts);
	let score = 0;
	for (const target of remainingSidePokemon(context.targetSide)) {
		const targetHP = getHPData(target);
		const damage = estimateBestDamageFromPokemon(boostedData, target, context);
		if (damage >= targetHP.hp) {
			score += 2;
		} else if (damage >= targetHP.hp * 0.7) {
			score += 1;
		}
	}
	return score;
}

function shouldConserveZMove(
	damage: number, zDamage: number, targetData: AnyObject, context?: BTAIContext
) {
	const targetHP = getHPData(targetData);
	if (damage >= targetHP.hp) return true;
	const remainingTargets = remainingSidePokemon(context?.targetSide).length;
	if (remainingTargets <= 1) return false;
	const targetMaxHP = Math.max(1, targetHP.maxhp);
	const upgradeFraction = Math.max(0, zDamage - damage) / targetMaxHP;
	if (zDamage < targetHP.hp && upgradeFraction < 0.45) return true;
	return false;
}

function zMoveConservationPenalty(
	damage: number, zDamage: number, targetData: AnyObject, context?: BTAIContext
) {
	if (!shouldConserveZMove(damage, zDamage, targetData, context)) return 0;
	if (damage >= getHPData(targetData).hp) return 120;
	return 45;
}

function getPostKOCleanupData(pokemonData: AnyObject) {
	const ability = getPokemonAbilityID(pokemonData);
	if (!['beastboost', 'battlebond'].includes(ability)) return pokemonData;
	if (ability === 'beastboost') {
		const stat = getBoosterBoostedStat(pokemonData);
		return cloneWithBoosts(pokemonData, {[stat]: 1} as SparseBoostsTable);
	}
	if (ability === 'battlebond') return cloneWithBoosts(pokemonData, {atk: 1, spa: 1, spe: 1});
	return pokemonData;
}

function getCleanupCoverageScore(
	moveid: ID, move: Move, damage: number, pokemonData: AnyObject, targetData: AnyObject,
	context?: BTAIContext, useZMove = false
) {
	const targetHP = getHPData(targetData);
	if (damage < targetHP.hp) return 0;
	const backline = remainingBacklinePokemon(context?.targetSide, targetData);
	if (!backline.length) return 0;
	const choiceLocked = CHOICE_ITEM_IDS.has(getPokemonItemID(pokemonData));
	const choiceLockMustSweep = choiceLocked && !hasChoiceResetOption(pokemonData, context);
	const cleanupData = getPostKOCleanupData(pokemonData);
	let score = 0;
	for (const backTarget of backline) {
		const backHP = getHPData(backTarget);
		const moveDamage = estimateDamage(moveid, cleanupData, backTarget, useZMove, context);
		const bestDamage = estimateBestDamageFromPokemon(cleanupData, backTarget, context);
		const moveFraction = Math.min(moveDamage, backHP.hp) / Math.max(1, backHP.maxhp);
		const bestFraction = Math.min(bestDamage, backHP.hp) / Math.max(1, backHP.maxhp);
		if (moveDamage >= backHP.hp) {
			score += choiceLockMustSweep ? 30 : 14;
			continue;
		}
		if (moveDamage <= 0 && bestDamage > 0) {
			score -= choiceLockMustSweep ? 145 : 55;
			continue;
		}
		if (bestDamage >= backHP.hp && moveDamage < backHP.hp) {
			score -= choiceLockMustSweep ? 95 : 38;
		} else if (bestFraction >= moveFraction + 0.35) {
			score -= choiceLockMustSweep ? 62 : 24;
		}
		const type = getModifiedMoveType(move, cleanupData, context);
		const typeMod = getMoveTypeModAgainstPokemon(move, type, cleanupData, backTarget);
		if (typeMod < 0 && bestDamage > moveDamage) score -= choiceLockMustSweep ? 45 : 16;
	}
	return score;
}

function shouldMegaEvolve(
	active: AnyObject, pokemonData: AnyObject, targetData: AnyObject | null, context?: BTAIContext
) {
	if (!active.canMegaEvo || !targetData) return !!active.canMegaEvo;
	const megaSpecies = Dex.mod('gen9rrbt').species.get(active.canMegaEvo);
	if (!megaSpecies.exists) return true;
	const currentThreat = estimateBestDamageFromPokemon(targetData, pokemonData, context ? {...context, sourceSide: undefined} : undefined);
	const megaData = {
		...pokemonData,
		details: (pokemonData.details || getSpeciesName(pokemonData)).replace(getSpeciesName(pokemonData), megaSpecies.name),
		ability: megaSpecies.abilities['0'],
		baseAbility: megaSpecies.abilities['0'],
	};
	const megaThreat = estimateBestDamageFromPokemon(targetData, megaData, context ? {...context, sourceSide: undefined} : undefined);
	const hp = getHPData(pokemonData);
	if (megaThreat >= hp.hp && currentThreat < hp.hp) return false;
	if (megaThreat > currentThreat * 1.35 && currentThreat > 0) return false;
	return true;
}

function getSecondaryChance(effect: AnyObject, sourceAbility: ID) {
	let chance = typeof effect.chance === 'number' ? effect.chance / 100 : 1;
	if (sourceAbility === 'serenegrace' && typeof effect.chance === 'number') chance = Math.min(1, chance * 2);
	return chance;
}

function getStatusEffectValue(status: ID, sourceData: AnyObject, targetData: AnyObject, context?: BTAIContext) {
	if (status === 'brn') {
		const physical = estimateBestDamageByCategory(targetData, sourceData, 'Physical', getPhazerContext(context));
		const special = estimateBestDamageByCategory(targetData, sourceData, 'Special', getPhazerContext(context));
		return (physical >= special ? 30 : 16) + 10;
	}
	if (status === 'par') {
		return estimateSpeed(targetData, getPhazerContext(context)) > estimateSpeed(sourceData, context) ? 28 : 18;
	}
	if (status === 'tox') return 30;
	if (status === 'psn') return 18;
	if (status === 'slp') return 38;
	if (status === 'frz') {
		const special = estimateBestDamageByCategory(targetData, sourceData, 'Special', getPhazerContext(context));
		const physical = estimateBestDamageByCategory(targetData, sourceData, 'Physical', getPhazerContext(context));
		return (special >= physical ? 34 : 20) + 12;
	}
	return 12;
}

function getStatusPressureScore(
	moveid: ID, pokemonData: AnyObject, targetData: AnyObject | null,
	bestDamage: number, targetThreat: number, context?: BTAIContext
) {
	if (!targetData) return 0;
	const targetHP = getHPData(targetData);
	const activeHP = getHPData(pokemonData);
	const sourceSpeed = estimateSpeed(pokemonData, context);
	const targetSpeed = estimateSpeed(targetData, getReverseContext(context));
	const targetPhysicalThreat = estimateBestDamageByCategory(targetData, pokemonData, 'Physical', getReverseContext(context));
	const targetSpecialThreat = estimateBestDamageByCategory(targetData, pokemonData, 'Special', getReverseContext(context));
	const cannot2HKO = bestDamage > 0 && bestDamage * 2 < targetHP.hp;
	const cannot3HKO = bestDamage > 0 && bestDamage * 3 < targetHP.hp;
	const targetBoosts = getPositiveBoostCount(targetData);
	let score = 0;
	if (cannot2HKO) score += 24;
	if (cannot3HKO) score += 16;
	if (pokemonCanRecover(targetData)) score += 18;
	if (targetLooksLikeSetupThreat(targetData)) score += 20 + Math.min(30, targetBoosts * 7);
	if (targetThreat >= activeHP.hp * 0.5 && bestDamage < targetHP.hp) score += 12;
	if (moveid === 'toxic') {
		if (cannot2HKO || pokemonCanRecover(targetData) || targetLooksLikeSetupThreat(targetData)) score += 34;
		if (targetBoosts >= 2) score += 22;
		if (targetThreat < activeHP.hp * 0.35) score += 12;
	}
	if (moveid === 'willowisp') {
		if (targetPhysicalThreat > 0) score += 18;
		if (targetPhysicalThreat >= targetSpecialThreat) score += 22;
		if (targetPhysicalThreat >= activeHP.hp * 0.45) score += 22;
		if ((targetData.boosts?.atk || 0) > 0) score += 18 + (targetData.boosts.atk || 0) * 6;
	}
	if (moveid === 'thunderwave') {
		if (targetSpeed > sourceSpeed) score += 24;
		if (targetThreat >= activeHP.hp * 0.45) score += 14;
		if (targetLooksLikeSetupThreat(targetData)) score += 12;
		if (targetSpeed > sourceSpeed && targetThreat > 0) {
			score += Math.min(30, targetThreat / Math.max(1, activeHP.hp) * 90 * 0.33);
		}
	}
	return score;
}

function scoreBoostTable(boosts: SparseBoostsTable | null | undefined, positive: boolean) {
	if (!boosts) return 0;
	let score = 0;
	for (const boost of Object.values(boosts)) {
		const value = boost as number;
		if (positive && value > 0) score += value * 10;
		if (!positive && value < 0) score += Math.abs(value) * 9;
	}
	return score;
}

function scoreMoveEffects(
	move: Move, moveid: ID, pokemonData: AnyObject, targetData: AnyObject, targetPokemon: Pokemon | null,
	sourceActsBeforeTarget: boolean, context?: BTAIContext
) {
	const sourceAbility = getPokemonAbilityID(pokemonData);
	let score = 0;
	const effects: AnyObject[] = [];
	if (move.secondary) effects.push(move.secondary as AnyObject);
	if (move.secondaries) effects.push(...move.secondaries as AnyObject[]);
	if (move.volatileStatus) effects.push({volatileStatus: move.volatileStatus, chance: 100});
	if ((move as AnyObject).self?.boosts) effects.push({self: (move as AnyObject).self, chance: 100});
	for (const effect of effects) {
		const chance = getSecondaryChance(effect, sourceAbility);
		if (effect.volatileStatus === 'flinch' && sourceActsBeforeTarget && !pokemonHasVolatile(targetPokemon, 'flinch')) {
			score += 24 * chance;
		}
		if (effect.status) {
			const status = toID(effect.status);
			const statusMove = {...move, status} as Move;
			if (!statusMoveBlocked(statusMove, moveid, pokemonData, targetData, targetPokemon, context)) {
				score += getStatusEffectValue(status, pokemonData, targetData, context) * chance;
			}
		}
		if (effect.boosts && !getPossiblePokemonAbilityIDs(targetData).some(ability => STAT_DROP_PUNISHING_ABILITIES.has(ability))) {
			score += scoreBoostTable(effect.boosts, false) * chance;
		}
		if (effect.self?.boosts) score += scoreBoostTable(effect.self.boosts, true) * chance;
	}
	if ((move as AnyObject).critRatio && (move as AnyObject).critRatio > 1) {
		score += Math.min(14, ((move as AnyObject).critRatio - 1) * 5);
	}
	return score;
}

function getSelfSwitchPositioningScore(
	move: Move, damage: number, pokemonData: AnyObject, targetData: AnyObject,
	state: BTBattleState, sourceActsBeforeTarget: boolean, context?: BTAIContext
) {
	if (!(move as AnyObject).selfSwitch) return 0;
	const bench = getViableSelfSwitchBenchPokemon(pokemonData, context);
	if (!bench.length) return 0;
	const activeHP = getHPData(pokemonData);
	const targetHP = getHPData(targetData);
	const targetThreat = estimateBestDamageFromPokemon(targetData, pokemonData, getReverseContext(context));
	if (targetThreat >= activeHP.hp && !sourceActsBeforeTarget) return -90;
	const activeDamage = estimateBestDamageFromPokemon(pokemonData, targetData, context);
	const opponentArchetype = getTeamArchetype(context?.targetSide, context);
	let score = 0;
	if (damage > 0 && damage < targetHP.hp) score += 16;
	if (targetThreat >= activeHP.hp * 0.35 && damage < targetHP.hp) score += 24;
	if (targetIsWeatherBreaker(targetData, context)) score += 34;
	if (opponentArchetype === 'weather') score += 14;
	if (opponentArchetype === 'hyperoffense') score += 10;
	let bestBenchGain = 0;
	for (const switchOption of bench) {
		const switchContext = getWeatherContextAfterPokemonSwitch(switchOption, context) || context;
		const switchDamage = estimateBestDamageFromPokemon(switchOption, targetData, switchContext);
		const switchThreat = estimateBestDamageFromPokemon(targetData, switchOption, getReverseContext(switchContext));
		const switchHP = getHPData(switchOption);
		const entryDamage = estimateHazardDamage(switchOption, context?.ownHazards);
		const effectiveSwitchHP = Math.max(1, switchHP.hp - entryDamage);
		const damageGain = (switchDamage - activeDamage) / Math.max(1, targetHP.maxhp) * 75;
		const safetyGain = (targetThreat / Math.max(1, activeHP.maxhp) - switchThreat / Math.max(1, switchHP.maxhp)) * 70;
		const setupUtility = getAntiSetupDisruptionValue(switchOption, targetData, null, null, switchContext) * 0.55;
		const forcedLossPenalty = switchThreat >= effectiveSwitchHP && switchDamage < targetHP.hp ? 105 : 0;
		bestBenchGain = Math.max(bestBenchGain, damageGain + safetyGain + setupUtility - forcedLossPenalty);
	}
	if (bestBenchGain > 0) score += Math.min(42, bestBenchGain);
	if (bestBenchGain < -20 && damage < targetHP.hp) score += Math.max(-70, bestBenchGain);
	return score;
}

function getStatusSelfSwitchPositioningScore(
	pokemonData: AnyObject, targetData: AnyObject, state: BTBattleState,
	bestDamage: number, targetThreat: number, context?: BTAIContext
) {
	const bench = getViableSelfSwitchBenchPokemon(pokemonData, context);
	if (!bench.length) return -Infinity;
	const activeHP = getHPData(pokemonData);
	const targetHP = getHPData(targetData);
	const activeDamage = estimateBestDamageFromPokemon(pokemonData, targetData, context);
	let bestBenchGain = -Infinity;
	for (const switchOption of bench) {
		const switchContext = getWeatherContextAfterPokemonSwitch(switchOption, context) || context;
		const switchHP = getHPData(switchOption);
		const entryDamage = estimateHazardDamage(switchOption, context?.ownHazards);
		const effectiveSwitchHP = Math.max(1, switchHP.hp - entryDamage);
		const switchDamage = estimateBestDamageFromPokemon(switchOption, targetData, switchContext);
		const switchThreat = estimateBestDamageFromPokemon(targetData, switchOption, getReverseContext(switchContext));
		let gain =
			(switchDamage - activeDamage) / Math.max(1, targetHP.maxhp) * 85 +
			(targetThreat / Math.max(1, activeHP.maxhp) - switchThreat / Math.max(1, switchHP.maxhp)) * 80;
		gain += getAntiSetupDisruptionValue(switchOption, targetData, null, null, switchContext) * 0.65;
		if (switchThreat >= effectiveSwitchHP && switchDamage < targetHP.hp) gain -= 135;
		if (entryDamage) gain -= Math.min(45, entryDamage / Math.max(1, switchHP.maxhp) * 120);
		bestBenchGain = Math.max(bestBenchGain, gain);
	}
	if (bestBenchGain === -Infinity) return -Infinity;
	if (
		bestBenchGain < -28 &&
		!targetLikelyProtectingAfterWish(state, targetData) &&
		!getBestWishPassScore(state, pokemonData, context)
	) {
		return -Infinity;
	}
	let score = 28 + bestBenchGain;
	if (bestDamage <= 0) score += 18;
	return score;
}

function getSetupArchetypeAdjustment(
	moveid: ID, pokemonData: AnyObject, targetData: AnyObject | null, targetThreat: number,
	bestDamage: number, sweepPotential: number, context?: BTAIContext
) {
	if (!targetData) return 0;
	const opponentArchetype = getTeamArchetype(context?.targetSide, context);
	const activeHP = getHPData(pokemonData);
	const targetHP = getHPData(targetData);
	const boosts = getSetupBoosts(moveid);
	const boostedData = boosts ? cloneWithBoosts(pokemonData, boosts) : pokemonData;
	const boostedDamage = estimateBestDamageFromPokemon(boostedData, targetData, context);
	const createsImmediateThreat = boostedDamage >= targetHP.hp || sweepPotential >= 3;
	let adjustment = 0;
	if (targetThreat >= activeHP.hp * 0.45 && !createsImmediateThreat) adjustment -= 54;
	if (targetThreat >= activeHP.hp * 0.7 && boostedDamage < targetHP.hp) adjustment -= 45;
	if (targetIsWeatherBreaker(targetData, context) && !createsImmediateThreat) adjustment -= 70;
	if (opponentArchetype === 'weather' && !createsImmediateThreat) adjustment -= 24;
	if (opponentArchetype === 'hyperoffense' && targetThreat >= activeHP.hp * 0.4 && !createsImmediateThreat) adjustment -= 26;
	if (opponentArchetype === 'stall' && targetThreat < activeHP.hp * 0.45) adjustment += 34;
	if (opponentArchetype === 'bulkyoffense' && bestDamage * 2 < targetHP.hp && targetThreat < activeHP.hp * 0.5) adjustment += 10;
	return adjustment;
}

function scoreDamagingMove(
	move: Move, moveid: ID, damage: number, pokemonData: AnyObject, targetData: AnyObject, targetPokemon: Pokemon | null,
	state: BTBattleState, action: string, context?: BTAIContext, useZMove = false, bestCurrentDamage = 0
) {
	const targetHP = getHPData(targetData);
	const targetMaxHP = Math.max(1, targetHP.maxhp);
	const sourceHP = getHPData(pokemonData);
	const movePriority = estimateMovePriority(move, pokemonData);
	const accuracyFactor = getAccuracyFactor(move, pokemonData, context);
	const sourceSpeed = estimateSpeed(pokemonData, context);
	const reverseContext = getReverseContext(context);
	const targetSpeed = estimateSpeed(targetData, reverseContext);
	const targetPriority = estimateHighestMovePriorityFromPokemon(targetData, pokemonData, reverseContext, move.category);
	const sourceActsBeforeTarget = movePriority > targetPriority || (movePriority === targetPriority && sourceSpeed > targetSpeed);
	const targetMovesFirst = targetPriority > movePriority || (movePriority === targetPriority && targetSpeed > sourceSpeed);
	let score = Math.min(damage, targetHP.hp) / targetMaxHP * 120;
	if (damage >= targetHP.hp) score += 90;
	if (PHASING_MOVE_IDS.has(moveid) && phazingMoveCanForceOut(moveid, pokemonData, targetData, targetPokemon, context)) {
		const positiveBoosts = getPositiveBoostCount(targetData);
		const setupPressure = getSetupThreatPressure(targetData);
		if (positiveBoosts) {
			score += 70 + positiveBoosts * 14 + setupPressure * 0.55;
		} else if (targetLooksLikeSetupThreat(targetData)) {
			score += 34 + setupPressure * 0.35;
		}
	}
	if (moveid === 'clearsmog' && getPositiveBoostCount(targetData) && damage > 0) {
		score += 90 + getSetupThreatPressure(targetData) * 0.65;
	}
	if (damage >= targetHP.hp && (sourceActsBeforeTarget || targetMovesFirst)) {
		const targetThreat = estimateBestDamageFromPokemon(targetData, pokemonData, reverseContext);
		if (sourceActsBeforeTarget) {
			score += 42;
			if (targetSpeed > sourceSpeed) score += 28;
			if (targetThreat >= sourceHP.hp) score += 55;
		} else if (targetThreat >= sourceHP.hp) {
			score -= 95;
		} else {
			score -= 28;
		}
	}
	const bestCurrentValue = bestCurrentDamage > 0 ? Math.min(bestCurrentDamage, targetHP.hp) / targetMaxHP : 0;
	const currentValue = Math.min(damage, targetHP.hp) / targetMaxHP;
	const targetTerrainHeal = getGrassyTerrainHeal(targetData, context);
	if (targetTerrainHeal && damage > 0 && damage < targetHP.hp) {
		score -= Math.min(26, targetTerrainHeal / targetMaxHP * 110);
	}
	const sourceTerrainHeal = getGrassyTerrainHeal(pokemonData, context);
	if (sourceTerrainHeal && sourceHP.hp < sourceHP.maxhp && damage < targetHP.hp) {
		score += Math.min(16, sourceTerrainHeal / Math.max(1, sourceHP.maxhp) * 85);
	}
	if (bestCurrentValue > currentValue && damage < targetHP.hp) {
		score -= Math.min(80, (bestCurrentValue - currentValue) * 105);
		if (accuracyFactor < 0.95) score -= Math.min(34, (0.95 - accuracyFactor) * 120 + 10);
	} else if (bestCurrentValue > 0 && currentValue >= bestCurrentValue - 0.03 && accuracyFactor >= 0.99) {
		score += 18;
	}
	const switchChance = getSwitchPredictionChance(state, pokemonData, targetData, context);
	const predictedSwitch = switchChance ? getPredictedSwitchTarget(pokemonData, targetData, context) : null;
	let predictedSwitchDamage = 0;
	let predictedSwitchHP: {hp: number, maxhp: number} | null = null;
	if (predictedSwitch) {
		predictedSwitchHP = getHPData(predictedSwitch);
		predictedSwitchDamage = estimateDamage(moveid, pokemonData, predictedSwitch, useZMove, context);
		const switchValue = Math.min(predictedSwitchDamage, predictedSwitchHP.hp) / Math.max(1, predictedSwitchHP.maxhp);
		let predictionWeight = switchChance;
		if (bestCurrentDamage > 0 && damage < bestCurrentDamage * 0.85 && damage < targetHP.hp) predictionWeight *= 0.3;
		score += (switchValue - currentValue) * 120 * predictionWeight;
		if (damage >= targetHP.hp && predictedSwitchDamage < predictedSwitchHP.hp) score -= 65 * predictionWeight;
		if (predictedSwitchDamage >= predictedSwitchHP.hp) score += 45 * predictionWeight;
		if ((move as AnyObject).selfSwitch) score += 14 * predictionWeight;
	}
	if (damage <= 0) {
		const usefulPredictedSwitchHit = !!(
			predictedSwitch &&
			predictedSwitchHP &&
			predictedSwitchDamage > 0 &&
			switchChance >= 0.35
		);
		if (!usefulPredictedSwitchHit) return -Infinity;
		if ((move as AnyObject).selfSwitch) score -= 90;
	}
	if (isAntiAttackPriorityMove(moveid)) {
		const failCount = getAntiAttackPriorityFailureCount(state, pokemonData, targetData, moveid);
		if (failCount) score -= Math.min(240, 115 * failCount);
		if (switchChance >= 0.35 && damage < targetHP.hp) score -= 45 + switchChance * 65;
		const fasterAttackingPriority = estimateHighestMovePriorityFromPokemon(targetData, pokemonData, reverseContext, 'Physical');
		if (fasterAttackingPriority > movePriority) {
			const priorityThreat = estimateBestPriorityDamageFromPokemon(targetData, pokemonData, reverseContext);
			score -= priorityThreat.damage >= sourceHP.hp ? 120 : 70;
		}
		if (pokemonCanPivotOut(targetData) && damage < targetHP.hp) score -= 42;
	}
	if (!useZMove && moveid === 'knockoff' && getPokemonItemID(targetData) && !pokemonItemCanBeKnockedOff(targetData)) {
		const damageFraction = Math.min(damage, targetHP.hp) / targetMaxHP;
		const predictsUsefulSwitch =
			!!predictedSwitch &&
			(pokemonItemCanBeKnockedOff(predictedSwitch) ||
				Math.min(predictedSwitchDamage, predictedSwitchHP?.hp || 0) / Math.max(1, predictedSwitchHP?.maxhp || 1) >= 0.35);
		if (!predictsUsefulSwitch && damage < targetHP.hp) {
			score -= damageFraction >= 0.35 ? 18 : 52;
		}
	}
	if (moveHasSelfKO(move)) {
		score += damage >= targetHP.hp ? -35 : -220;
	}
	const sourceAbility = getPokemonAbilityID(pokemonData);
	if (moveHasRecoilOrCrash(move) && !['magicguard', 'rockhead'].includes(sourceAbility) && damage < targetHP.hp) {
		score -= sourceHP.hp <= sourceHP.maxhp / 3 ? 28 : 14;
	}
	if (move.flags['contact']) {
		const targetAbility = getPokemonAbilityID(targetData);
		const contactPenalty =
			(getPokemonItemID(targetData) === 'rockyhelmet' ? 22 : 0) +
			(CONTACT_DAMAGE_ABILITIES.has(targetAbility) ? 18 : 0) +
			(CONTACT_STATUS_ABILITIES.has(targetAbility) ? 12 : 0) +
			(getPossiblePokemonAbilityIDs(targetData).some(ability => CONTACT_DAMAGE_ABILITIES.has(ability)) ? 10 : 0) +
			(getPossiblePokemonAbilityIDs(targetData).some(ability => CONTACT_STATUS_ABILITIES.has(ability)) ? 8 : 0);
		if (contactPenalty && damage < targetHP.hp) {
			score -= sourceHP.hp <= sourceHP.maxhp / 4 ? contactPenalty * 2 : contactPenalty;
		}
	}
	if (movePriority > 0) score += 10 + movePriority * 5;
	if (movePriority > 0 && moveTypeWasAbilityModified(move, pokemonData, context)) {
		const modifiedType = getModifiedMoveType(move, pokemonData, context);
		const typeMod = getMoveTypeModAgainstPokemon(move, modifiedType, pokemonData, targetData);
		score += 18;
		if (getSourceTypesForMove(pokemonData, modifiedType).includes(modifiedType)) score += 14;
		if (typeMod > 0) score += typeMod * 16;
	}
	if (movePriority > 0 && targetIsWeatherBreaker(targetData, context) && damage > 0) score += 18;
	if (movePriority <= 0) {
		if (sourceSpeed > targetSpeed) {
			score += 8;
		} else if (damage < targetHP.hp) {
			score -= 4;
		}
	}
	score += scoreMoveEffects(move, moveid, pokemonData, targetData, targetPokemon, sourceActsBeforeTarget, context);
	if (sourceAbility === 'serenegrace' && (move.secondaries || move.secondary)) score += 8;
	if (sourceAbility === 'contrary' && Object.values((move.self as AnyObject | null)?.boosts || {}).some(boost => (boost as number) < 0)) {
		score += 18;
	}
	if (damage >= targetHP.hp && ['battlebond', 'beastboost'].includes(sourceAbility)) score += 22;
	score += getCleanupCoverageScore(moveid, move, damage, pokemonData, targetData, context, useZMove);
	if (moveAppliesHealBlock(move, moveid) && pokemonCanRecover(targetData) && !pokemonOrDataHasVolatile(targetData, targetPokemon, 'healblock')) {
		score += 28;
	}
	if ((move as AnyObject).selfSwitch) score += 10;
	score += getSelfSwitchPositioningScore(move, damage, pokemonData, targetData, state, sourceActsBeforeTarget, context);
	if (HAZARD_REMOVAL_MOVE_IDS.has(moveid) && context?.ownHazards && hasHazards(context.ownHazards) && damage > 0) {
		score += 58 + getHazardRemovalUrgency(pokemonData, context.ownHazards, context);
	}
	if (targetLikelyProtectingAfterWish(state, targetData)) {
		if ((move as AnyObject).selfSwitch) {
			score += 42;
		} else {
			score -= 58;
		}
	}
	score *= accuracyFactor;
	score += memoryScore(getMemoryKey(state, pokemonData, targetData, action)) * 15;
	return score;
}

function scoreStatusMove(
	moveid: ID, pokemonData: AnyObject, targetData: AnyObject | null, targetPokemon: Pokemon | null,
	ownHazards: BTSideHazards, targetHazards: BTSideHazards, state: BTBattleState,
	bestDamage: number, futureMoveActive: boolean, context?: BTAIContext
) {
	const move = Dex.mod('gen9rrbt').moves.get(moveid);
	if (futureMoveActive && move.flags['futuremove']) return -Infinity;
	if (statusMoveBlocked(move, moveid, pokemonData, targetData, targetPokemon, context)) return -Infinity;
	const activeHP = getHPData(pokemonData);
	const hpFraction = activeHP.hp / Math.max(1, activeHP.maxhp);
	const targetHP = targetData ? getHPData(targetData).hp : 1;
	const setupKey = pokemonData.ident || getSpeciesName(pokemonData);
	const targetThreat = targetData ?
		estimateBestDamageFromPokemon(targetData, pokemonData, context ? {...context, sourceSide: undefined} : undefined) : 0;
	const opponentArchetype = getTeamArchetype(context?.targetSide, context);
	const movePriority = targetData ? estimateMovePriority(move, pokemonData, targetData) : estimateMovePriority(move, pokemonData);
	const sourceActsBeforeStatusTarget = !!targetData && (
		movePriority > 0 || (movePriority === 0 && estimateSpeed(pokemonData, context) > estimateSpeed(targetData, getReverseContext(context)))
	);
	let score = -Infinity;

	if (moveid === 'perishsong' && getSpeciesID(pokemonData) === 'gengar') {
		score = 115;
	} else if (isSetupMove(moveid) && targetData && bestDamage > 0 && bestDamage < targetHP) {
		const sweepPotential = estimateSetupSweepPotential(moveid, pokemonData, context);
		const boosts = getSetupBoosts(moveid);
		if (!setupMoveHasBoostRoom(pokemonData, boosts)) return -Infinity;
		const boostedData = boosts ? cloneWithBoosts(pokemonData, boosts) : pokemonData;
		const boostedDamage = estimateBestDamageFromPokemon(boostedData, targetData, context);
		const alreadySetUp = !!state.setupUsed[setupKey];
		const positiveBoosts = getPositiveBoostCount(pokemonData);
		const currentTwoHKO = bestDamage * 2 >= targetHP;
		const currentThreeHKO = bestDamage * 3 >= targetHP;
		if (alreadySetUp && currentTwoHKO) return -Infinity;
		const pivotPriorityThreat = getPivotPriorityRevengeThreat(pokemonData, targetData, context);
		score = alreadySetUp ? 50 : 80;
		if (boostedDamage <= bestDamage && sweepPotential <= 0) score -= 80;
		if (bestDamage * 2 < targetHP) score += 16;
		if (boostedDamage >= targetHP && bestDamage < targetHP) score += 48;
		if (pivotPriorityThreat.damage) {
			const revengeFraction = pivotPriorityThreat.damage / Math.max(1, activeHP.maxhp);
			score -= revengeFraction >= 0.65 ? 105 : 68;
			if (alreadySetUp) score -= 28;
		}
		if (currentTwoHKO) score -= 65;
		if (alreadySetUp && currentThreeHKO && targetThreat >= activeHP.hp * 0.35) score -= 80;
		if (targetThreat < activeHP.hp * 0.3) score += alreadySetUp ? 42 : 34;
		if (targetThreat < activeHP.hp * 0.18 && boostedDamage > bestDamage * 1.2) score += 22;
		if (targetThreat >= activeHP.hp * 0.7) score -= alreadySetUp ? 72 : 48;
		if (alreadySetUp && targetThreat >= activeHP.hp * 0.45 && boostedDamage < targetHP) score -= 34;
		if (positiveBoosts >= 4 && currentTwoHKO) score -= 100;
		if (positiveBoosts >= 6) score -= 120;
		if (positiveBoosts >= 10) score -= 70;
		if (getSetupPhazingThreat(pokemonData, targetData, targetPokemon, context)) score -= 120;
		if (getPokemonAbilityID(pokemonData) === 'radicalaura' && moveid === 'nastyplot') {
			score += 42;
			if (targetThreat < activeHP.hp * 0.55) score += 24;
		}
		score += sweepPotential * 10;
		score += getSetupArchetypeAdjustment(
			moveid, pokemonData, targetData, targetThreat, bestDamage, sweepPotential, context
		);
	} else if (
		PHASING_MOVE_IDS.has(moveid) &&
		targetData &&
		phazingMoveCanForceOut(moveid, pokemonData, targetData, targetPokemon, context)
	) {
		const positiveBoosts = getPositiveBoostCount(targetData);
		const setupPressure = getSetupThreatPressure(targetData);
		score = positiveBoosts ?
			118 + positiveBoosts * 18 + setupPressure * 0.75 :
			targetLooksLikeSetupThreat(targetData) ? 78 + setupPressure * 0.45 : 24;
		if (targetThreat >= activeHP.hp * 0.7) score += 16;
		if (opponentArchetype === 'hyperoffense' || opponentArchetype === 'weather') score += 14;
	} else if (moveid === 'haze' && targetData && getPositiveBoostCount(targetData)) {
		score = 118 + getPositiveBoostCount(targetData) * 16 + getSetupThreatPressure(targetData) * 0.7;
		if (getDefensiveBoostPressure(targetData)) score += 28;
	} else if (move.flags['futuremove'] && targetData && bestDamage >= 0) {
		score = 62;
	} else if (
		HAZARD_REMOVAL_MOVE_IDS.has(moveid) &&
		hasHazards(ownHazards) &&
		(moveid !== 'defog' || !pokemonCanHaveAbility(targetData, 'goodasgold' as ID))
	) {
		score = 78 + getHazardRemovalUrgency(pokemonData, ownHazards, context);
	} else if (
		['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'].includes(moveid) &&
		canUseHazard(moveid, targetHazards)
	) {
		score = 66 - targetHazards.spikes * 4;
		if (sideHasAbility(context?.targetSide, 'magicbounce' as ID)) score -= 60;
		if (opponentArchetype === 'weather' || opponentArchetype === 'hyperoffense') score += 12;
		if (opponentArchetype === 'stall') score += 8;
	} else if (getMoveWeather(move)) {
		score = scoreWeatherMove(move, pokemonData, targetData, targetThreat, context);
		if (opponentArchetype === 'weather') score += 28;
	} else if ((move as AnyObject).selfSwitch && targetData) {
		score = getStatusSelfSwitchPositioningScore(pokemonData, targetData, state, bestDamage, targetThreat, context);
		if (targetLikelyProtectingAfterWish(state, targetData)) score += 48;
		const wishPassScore = getBestWishPassScore(state, pokemonData, context);
		if (wishPassScore) {
			score += 72 + wishPassScore;
			if (targetThreat >= activeHP.hp) score -= 90;
		}
		if (opponentArchetype === 'stall' || opponentArchetype === 'bulkyoffense') score += 10;
	} else if (
		['recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'synthesis'].includes(moveid) &&
		hpFraction < 0.55
	) {
		const recoveryAmount = estimateRecoveryAmount(moveid, pokemonData, context);
		score = 72 + (0.55 - hpFraction) * 80;
		if (targetData && targetThreat > 0) {
			const targetIsBeingStalled = hasStatus(targetData);
			if (bestDamage <= 0 && !targetIsBeingStalled) score -= 105;
			if (targetThreat >= recoveryAmount * 0.9 && bestDamage < targetHP * 0.25) score -= 78;
			if (targetThreat >= activeHP.hp && bestDamage < targetHP) score -= 34;
		}
	} else if (moveid === 'wish' && (hpFraction < 0.68 || sideHasLowHPAlly(context?.ownSide))) {
		score = hpFraction < 0.5 ? 86 : 68;
		if (pokemonKnowsMove(pokemonData, 'protect' as ID)) score += 18;
		if (pokemonKnowsMove(pokemonData, 'teleport' as ID) && sideHasLowHPAlly(context?.ownSide)) score += 34;
		if (targetThreat >= activeHP.hp && !pokemonKnowsMove(pokemonData, 'protect' as ID)) score -= 70;
	} else if (moveid === 'protect' && getPendingWishForPokemon(state, pokemonData)) {
		const counter = state.stallMoveCounters[getPokemonDecisionID(pokemonData)] || 1;
		score = (90 + getWishSelfHealScore(state, pokemonData)) / counter;
		if (targetThreat >= activeHP.hp * 0.45) score += 24;
	} else if (moveid === 'protect' && pokemonKnowsMove(pokemonData, 'wish' as ID) && hpFraction < 0.8) {
		const counter = state.stallMoveCounters[getPokemonDecisionID(pokemonData)] || 1;
		score = 58 / counter;
	} else if (
		['toxic', 'willowisp', 'thunderwave'].includes(moveid) &&
		targetData &&
		!hasStatus(targetData) &&
		bestDamage < targetHP
	) {
		score = 52 + getStatusPressureScore(moveid, pokemonData, targetData, bestDamage, targetThreat, context);
		if (opponentArchetype === 'bulkyoffense' || opponentArchetype === 'stall') score += 10;
		if (opponentArchetype === 'weather' && targetIsWeatherBreaker(targetData, context)) score += 16;
	} else if (['taunt', 'encore', 'torment'].includes(moveid) && targetData) {
		const setupPressure = getSetupThreatPressure(targetData);
		score = 38;
		if (moveid === 'taunt') {
			if (setupPressure) score += Math.min(130, 34 + setupPressure);
			if (pokemonCanRecover(targetData)) score += 24;
			if (pokemonHasSetupPayoffMove(targetData)) score += 18;
		} else if (moveid === 'encore') {
			const lastPlayerMove = state.lastPlayerMoveByIdent?.[getPokemonDecisionID(targetData)];
			if (lastPlayerMove && (isSetupMove(lastPlayerMove) || RECOVERY_MOVE_IDS.has(lastPlayerMove))) {
				score += 110;
			} else if (setupPressure) {
				score += Math.min(80, setupPressure * 0.55);
			}
		} else if (setupPressure) {
			score += Math.min(45, setupPressure * 0.3);
		}
		if (opponentArchetype === 'stall') score += 42;
		if (opponentArchetype === 'hyperoffense' && targetLooksLikeSetupThreat(targetData)) score += 28;
	} else if (isStallingMove(moveid) && hpFraction > 0.35) {
		const counter = state.stallMoveCounters[getPokemonDecisionID(pokemonData)] || 1;
		score = 26 / counter;
	} else if (moveid === 'substitute' && hpFraction > 0.35) {
		score = 26;
	}
	if (score > -Infinity && move.category === 'Status') {
		if (hasTauntThreat(pokemonData, targetData, context)) score -= 28;
		if (targetData && ['taunt', 'encore', 'torment'].includes(moveid)) {
			if (sourceActsBeforeStatusTarget) {
				score += movePriority > 0 ? 18 : 8;
			} else if (targetThreat >= activeHP.hp * 0.65) {
				score -= 24;
			}
		} else if (targetData && move.status && sourceActsBeforeStatusTarget) {
			score += movePriority > 0 ? 10 : 4;
		}
		if (targetData && pokemonHasAntiAttackPriority(targetData)) score += 22;
		if (move.flags['reflectable'] && sideHasAbility(context?.targetSide, 'magicbounce' as ID)) {
			score -= getMoveTags(moveid).some(tag => tag === 'hazard' || tag === 'status') ? 55 : 24;
		}
	}
	score += memoryScore(getMemoryKey(state, pokemonData, targetData, `move:${moveid}`)) * 15;
	return score;
}

function chooseBestMove(
	active: AnyObject, pokemonData: AnyObject, targetData: AnyObject | null, targetPokemon: Pokemon | null,
	ownHazards: BTSideHazards, targetHazards: BTSideHazards, state: BTBattleState,
	futureMoveActive: boolean, context?: BTAIContext
) {
	const moves = active.moves
		.map((move: AnyObject, moveIndex: number) => ({slot: moveIndex + 1, move}))
		.filter(({move}: {move: AnyObject}) => isAvailableMoveChoice(move));
	if (!moves.length) return 'pass';
	const damagingMoves = targetData ? moves.filter(({move}: {move: AnyObject}) => (
		Dex.mod('gen9rrbt').moves.get(move.id).category !== 'Status'
	)) : [];
	const zMoveSlots = new Map<number, AnyObject>();
	if (active.canZMove) {
		for (const [i, zMove] of active.canZMove.entries()) {
			if (zMove) zMoveSlots.set(i + 1, zMove);
		}
	}
	const targetHP = targetData ? getHPData(targetData).hp : 1;
	let bestDamage = 0;
	if (targetData) {
		for (const choice of damagingMoves) {
			const move = Dex.mod('gen9rrbt').moves.get(choice.move.id);
			const moveid = choice.move.id as ID;
			if (futureMoveActive && move.flags['futuremove']) continue;
			bestDamage = Math.max(bestDamage, estimateDamage(moveid, pokemonData, targetData, false, context));
		}
	}
	let bestChoice = moves[0];
	let bestIsZ = false;
	let bestScore = -Infinity;
	const setupKey = pokemonData.ident || getSpeciesName(pokemonData);
	if (targetData) {
		for (const choice of damagingMoves) {
			const move = Dex.mod('gen9rrbt').moves.get(choice.move.id);
			const moveid = choice.move.id as ID;
			if (futureMoveActive && move.flags['futuremove']) continue;
			const damage = estimateDamage(moveid, pokemonData, targetData, false, context);
			const action = `move:${moveid}`;
			const score = scoreDamagingMove(
				move, moveid, damage, pokemonData, targetData, targetPokemon, state, action, context, false, bestDamage
			);
			if (score > bestScore) {
				bestScore = score;
				bestChoice = choice;
				bestIsZ = false;
			}
			if (zMoveSlots.has(choice.slot)) {
				if (move.flags['futuremove']) continue;
				const zDamage = estimateDamage(moveid, pokemonData, targetData, true, context);
				const zAction = `move:${moveid}:z`;
				const targetMaxHP = Math.max(1, getHPData(targetData).maxhp);
				const zUpgrade = Math.min(80, Math.max(0, zDamage - damage) / targetMaxHP * 80);
				const zScore = scoreDamagingMove(
					move, moveid, zDamage, pokemonData, targetData, targetPokemon, state, zAction, context, true, bestDamage
				) + zUpgrade + (
					zDamage >= targetHP && damage < targetHP ? 55 : 0
				) - zMoveConservationPenalty(damage, zDamage, targetData, context);
				if (zScore > bestScore) {
					bestScore = zScore;
					bestChoice = choice;
					bestIsZ = true;
				}
			}
		}
	}
	for (const choice of moves) {
		const moveid = choice.move.id as ID;
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (move.category !== 'Status') continue;
		const score = scoreStatusMove(
			moveid, pokemonData, targetData, targetPokemon, ownHazards, targetHazards, state, bestDamage, futureMoveActive,
			context
		);
		if (score > bestScore) {
			bestScore = score;
			bestChoice = choice;
			bestIsZ = false;
		}
	}
	if (bestScore === -Infinity) {
		const activeHP = getHPData(pokemonData);
		const hpFraction = activeHP.hp / Math.max(1, activeHP.maxhp);
		bestChoice = moves.find(({move}: {move: AnyObject}) => {
			const dexMove = Dex.mod('gen9rrbt').moves.get(move.id);
			return !(futureMoveActive && dexMove.flags['futuremove']) &&
				!(RECOVERY_MOVE_IDS.has(move.id) && hpFraction > 0.85);
		}) || moves[0];
		bestIsZ = false;
	}
	let moveChoice = `move ${bestChoice.slot}`;
	if (bestIsZ) moveChoice += ' zmove';
	if (active.canMegaEvo && shouldMegaEvolve(active, pokemonData, targetData, context)) moveChoice += ' mega';
	if (isSetupMove(bestChoice.move.id)) state.setupUsed[setupKey] = true;
	rememberDecision(
		state, pokemonData, targetData,
		bestIsZ ? `move:${bestChoice.move.id}:z` : `move:${bestChoice.move.id}`
	);
	return moveChoice;
}

function chooseMove(request: AnyObject, room: GameRoom, state: BTBattleState) {
	const ownSideid = request.side.id as 'p1' | 'p2';
	const foeSideid = ownSideid === 'p1' ? 'p2' : 'p1';
	const context = {
		...getAIContext(room, request, state),
		ownHazards: state.hazards[ownSideid],
		targetHazards: state.hazards[foeSideid],
	};
	const targetData = getTargetPokemonData(room, ownSideid, 0, state);
	const targetPokemon = getTargetPokemon(room, ownSideid);
	const futureMoveActive = hasFutureMoveOnTargetSlot(room, foeSideid, targetData, state);
	const pokemon = request.side.pokemon;
	const primaryActive = addTrackedStateToPokemonData(
		getBattleActivePokemonData(room, ownSideid, 0, 'own') || getActivePokemonData(request, 0) || pokemon[0],
		state
	);
	state.pendingPlayerAction = targetData && primaryActive ? {
		target: getPokemonDecisionID(targetData),
		threatened: targetIsThreatenedByPokemon(primaryActive, targetData, context),
	} : null;
	const switchChoices: number[] = [];
	const choices = request.active.map((active: AnyObject, index: number) => {
		const pokemonData = addTrackedStateToPokemonData(
			getBattleActivePokemonData(room, ownSideid, index, 'own') || getActivePokemonData(request, index) || pokemon[index],
			state
		);
		if (!pokemonData || pokemonData.condition.endsWith(' fnt') || pokemonData.commanding) return 'pass';
		const trapped = !!active.trapped || pokemonIsTrappedByTarget(pokemonData, targetData);
		if (!trapped && state.perish[ownSideid] === 1) {
			const switchSlot = chooseBestSwitchSlot(request, request.active.length, switchChoices, targetData, state, context);
			if (switchSlot) {
				switchChoices.push(switchSlot);
				const switchOption = request.side.pokemon[switchSlot - 1];
				rememberDecision(state, switchOption, targetData, `switch:${getSpeciesID(switchOption)}`);
				rememberBotSwitch(state, pokemonData, switchOption, targetData);
				return `switch ${switchSlot}`;
			}
		}
		if (!trapped && targetData) {
			const targetHP = getHPData(targetData);
			const activeHP = getHPData(pokemonData);
			const hasAvailableMoves = (active.moves || []).some((move: AnyObject) => isAvailableMoveChoice(move));
			const activeWouldDieOnReentry = estimateHazardDamage(pokemonData, state.hazards[ownSideid]) >= activeHP.hp;
			const bestDamage = estimateBestDamageFromActive(active, pokemonData, targetData, futureMoveActive, context);
			const targetThreat = estimateBestDamageFromPokemon(targetData, pokemonData, {...context, sourceSide: undefined});
			const switchSlot = chooseBestSwitchSlot(request, request.active.length, switchChoices, targetData, state, context);
			const switchOption = switchSlot ? request.side.pokemon[switchSlot - 1] : null;
			const switchContext = switchOption ? getWeatherContextAfterPokemonSwitch(switchOption, context) || context : context;
			const switchDamage = switchOption ? estimateBestDamageFromPokemon(switchOption, targetData, switchContext) : 0;
			const switchDamageIn = switchOption ?
				estimateBestDamageFromPokemon(targetData, switchOption, getReverseContext(switchContext)) : 0;
			const hazardSwitchPenalty = switchOption ? getHazardSwitchPenalty(
				switchOption, targetData, estimateHazardDamage(switchOption, state.hazards[ownSideid]),
				switchDamageIn, switchDamage, state.hazards[ownSideid], switchContext
			) : 0;
			const lethalSwitch = !!(
				switchOption &&
				targetThreat >= activeHP.hp && bestDamage < targetHP.hp &&
				shouldSwitchOutOfLethalThreat(pokemonData, targetData, switchOption, bestDamage, switchDamage, targetThreat, switchContext)
			);
			const pivotPenalty = switchOption ? getSwitchPivotPenalty(switchOption, targetData, state, switchContext) : 0;
			const pivotBait = isPivotBaitSwitch(
				pokemonData, targetData, switchOption, bestDamage, switchDamage, targetThreat, pivotPenalty
			);
			const progressSwitch =
				(bestDamage <= 0 && switchDamage > 0) ||
				shouldSwitchOutOfNoProgress(pokemonData, targetData, switchOption, bestDamage, switchDamage, targetThreat, switchContext) ||
				shouldSwitchOutOfBadPriorityMatchup(pokemonData, targetData, switchOption, bestDamage, switchDamage, targetThreat, switchContext) ||
				shouldSwitchOutOfPriorityThreat(pokemonData, targetData, switchOption, bestDamage, switchDamage, switchContext) ||
				shouldSwitchToDisruptSetup(pokemonData, targetData, switchOption, bestDamage, switchDamage, targetThreat, context) ||
				shouldPreserveForFutureMatchup(pokemonData, targetData, switchOption, bestDamage, switchDamage, targetThreat, switchContext) ||
				(targetLikelyProtectingAfterWish(state, targetData) && switchDamage >= bestDamage * 0.75) ||
				shouldSwitchForBetterMatchup(pokemonData, targetData, bestDamage, switchDamage, targetThreat) ||
				shouldSwitchForAbility(pokemonData, switchDamage, bestDamage);
			let shouldSwitch = !hasAvailableMoves || lethalSwitch || (!pivotBait && progressSwitch);
			if (
				shouldSwitch &&
				hasAvailableMoves &&
				shouldTacticalSackForSupremeOverlord(
					pokemonData, targetData, switchOption, bestDamage, switchDamage, targetThreat, switchDamageIn, context
				)
			) {
				shouldSwitch = false;
			}
			if (
				shouldSwitch &&
				switchOption &&
				hasAvailableMoves &&
				hazardSwitchPenalty >= 90 &&
				bestDamage >= targetHP.hp * 0.3 &&
				(!lethalSwitch || bestDamage >= targetHP.hp * 0.45)
			) {
				shouldSwitch = false;
			}
			if (
				shouldSwitch &&
				hasAvailableMoves &&
				shouldStayForPendingWish(active, pokemonData, targetData, state, targetThreat, context)
			) {
				shouldSwitch = false;
			}
			if (
				shouldSwitch &&
				activeWouldDieOnReentry &&
				!lethalSwitch &&
				hasAvailableMoves &&
				bestDamage > 0 &&
				targetThreat < activeHP.hp
			) {
				shouldSwitch = false;
			}
			if (switchSlot && shouldSwitch) {
				switchChoices.push(switchSlot);
				rememberDecision(state, switchOption, targetData, `switch:${getSpeciesID(switchOption)}`);
				rememberBotSwitch(state, pokemonData, switchOption, targetData);
				return `switch ${switchSlot}`;
			}
		}
		return chooseBestMove(
			active, pokemonData, targetData, targetPokemon,
			state.hazards[ownSideid], state.hazards[foeSideid], state, futureMoveActive, context
		);
	});
	return choices.join(', ');
}

function chooseBotRequest(request: AnyObject, room: GameRoom, state: BTBattleState) {
	if (request.wait) return '';
	if (request.forceSwitch) {
		const targetData = getTargetPokemonData(room, request.side.id, 0, state);
		return chooseSwitch(request, targetData, state, getAIContext(room, request, state));
	}
	if (request.active) return chooseMove(request, room, state);
	return chooseTeamPreview(request, state, room);
}

function getBotUser() {
	return Users.get(BT_CHALLENGER_ID) || {
		id: BT_CHALLENGER_ID,
		name: BOT_NAME,
		popup() {},
	} as User;
}

function submitBotChoice(battle: AnyObject, room: GameRoom, choice: string) {
	const bot = battle.p2;
	const rqid = bot.request.rqid;
	battle.choose(getBotUser(), `${choice}|${rqid}`);
	if (bot.request.rqid === rqid && bot.request.isWait === false) {
		bot.request.isWait = true;
		bot.request.choice = choice;
		void battle.stream.write(`>p2 ${choice}`).then(() => {
			if (battle.ended || bot.request.rqid !== rqid || bot.request.choice !== choice) return;
			if ((battle.p2.choice as AnyObject)?.error || !battle.p2.isChoiceDone?.()) {
				bot.request.isWait = false;
				bot.request.choice = '';
			}
		});
	}
}

function getReadyBotRequest(bot: AnyObject) {
	if (!bot.request.request) return null;
	let request: AnyObject;
	try {
		request = JSON.parse(bot.request.request);
	} catch {
		return null;
	}
	if (request.wait) return null;
	if (bot.request.isWait !== false) {
		if (bot.request.choice) return null;
		bot.request.isWait = false;
	}
	return request;
}

function advanceBot(room: GameRoom) {
	const battle = room.battle;
	if (!battle || battle.ended) {
		const state = btBattles.get(room.roomid);
		if (state) {
			try {
				syncBattleState(room, state);
				learnObservedPlayerSets(state);
				flushOpponentMemory(state);
			} catch (e: any) {
				Monitor.warn(`${BOT_NAME} cleanup memory sync error in ${room.roomid}: ${e?.message || e}`);
			}
			clearInterval(state.timer);
		}
		btBattles.delete(room.roomid);
		return;
	}
	const state = btBattles.get(room.roomid);
	if (!state) return;
	try {
		syncBattleState(room, state);
	} catch (e: any) {
		Monitor.warn(`${BOT_NAME} state sync error in ${room.roomid}: ${e?.message || e}`);
	}
	const bot = battle.p2;
	try {
		const request = getReadyBotRequest(bot);
		if (!request) return;
		const choice = chooseBotRequest(request, room, state);
		if (!choice) return;
		submitBotChoice(battle, room, choice);
		state.lastBotError = '';
	} catch (e: any) {
		const message = e?.message || String(e);
		if (state.lastBotError !== message) {
			state.lastBotError = message;
			room.add(`|-message|${BOT_NAME} hit an AI error: ${message}`);
			room.update();
			Monitor.warn(`${BOT_NAME} AI error in ${room.roomid}: ${message}`);
		}
	}
}

function attachBot(room: GameRoom, botTeam: string, userid: ID, level: number, replay: boolean) {
	const battle = room.battle;
	if (!battle) throw new Chat.ErrorMessage(`Battle Tower battle could not be created.`);
	(battle.p2 as AnyObject).id = BT_CHALLENGER_ID;
	battle.p2.name = BOT_NAME;
	battle.p2.active = true;
	battle.p2.knownActive = true;
	battle.p2.hasTeam = true;
	battle.p2.invite = '';
	battle.playerTable[BT_CHALLENGER_ID] = battle.p2;
	room.auth.set(BT_CHALLENGER_ID, Users.PLAYER_SYMBOL);
	battle.room.title = `${battle.p1.name} vs. ${BOT_NAME}`;
	battle.room.send(`|title|${battle.room.title}`);
	void battle.stream.write(`>player p2 ${JSON.stringify({name: BOT_NAME, avatar: BOT_AVATAR, team: botTeam})}`);
	battle.started = true;
	Rooms.global.onCreateBattleRoom([Users.get(userid)!], room, {rated: 0});
	battle.checkActive();
	const timer = setInterval(() => advanceBot(room), 500);
	btBattles.set(room.roomid, {
		userid,
		level,
		replay,
		timer,
		logIndex: room.log.log.length,
		hazards: {p1: newHazards(), p2: newHazards()},
		perish: {p1: 0, p2: 0},
		futureMoves: newFutureMoveState(),
		setupUsed: {},
		decisions: [],
		lastDecisionByPokemon: {},
		lastBotMoveDecision: null,
		lastBotMoveByTarget: {},
		lastBotMoveOutcome: null,
		lastBotMoveOutcomeByTarget: {},
		lastLoggedMoveWasBot: false,
		lastLoggedMoveDecision: null,
		lastBotSwitch: null,
		pivotPunishedSwitches: {},
		stallMoveCounters: {},
		pendingStallMoves: {},
		pendingWishes: {p1: null, p2: null},
		playerStyle: newPlayerStyle(),
		pendingPlayerAction: null,
		publicItems: {},
		consumedItems: {},
		observedPlayerSets: {},
		lastPlayerMoveByIdent: {},
		hpByIdent: {},
		lastMoveEvent: null,
		inferredStats: {},
		turnMoved: {},
		boostsByIdent: {},
		volatilesByIdent: {},
		boosterBoostsByIdent: {},
		hiddenPowerTypesByIdent: {},
		antiAttackPriorityFailures: {},
		turn: 0,
		lastBotError: '',
		memoryChanged: false,
	});
}

async function startBTBattle(
	context: Chat.CommandContext, user: User, connection: Connection, levelIndex: number, replay: boolean
) {
	const level = levels[levelIndex];
	const playerSettings = await prepareBTTeam(connection);
	if (!playerSettings) return;
	const botTeam = packBTTeam(level);
	const battleRoom = Rooms.createBattle({
		format: FORMAT_ID,
		players: [{
			user,
			team: playerSettings.team,
			hidden: playerSettings.hidden,
			inviteOnly: playerSettings.inviteOnly,
		}],
		delayedStart: true,
		rated: 0,
	});
	if (!battleRoom) return;
	attachBot(battleRoom, botTeam, user.id, levelIndex, replay);
	battleRoom.add(
		`|-message|Battle Tower ${getBTLevelLabel(level, levelIndex)}${replay ? ' (replay)' : ''}`
	).update();
	context.sendReply(`Starting Battle Tower ${getBTLevelLabel(level, levelIndex)}.`);
}

export const commands: Chat.ChatCommands = {
	bt: 'battletower',
	battletower(target, room, user) {
		if (!checkBTAccess(this, user)) return;
		target = target.trim();
		const [cmdTarget = ""] = target.split(' ');
		const cmd = toID(cmdTarget);
		const cmdArgs = target.slice(cmdTarget.length).trim();
		if (cmd === 'help') return this.parse('/help battletower');
		if (cmd === 'progress' || cmd === 'status') {
			const cleared = getCleared(user.id);
			const next = levels[cleared];
			if (!levels.length || !next) {
				return this.sendReply(`You've cleared all available Battle Tower levels.`);
			}
			return this.sendReply(`Battle Tower progress: ${cleared} cleared. Next: ${getBTLevelLabel(next, cleared)}.`);
		}
		if (cmd === 'medals' || cmd === 'medal') {
			const targetID = toID(cmdArgs) || user.id;
			const targetName = Users.get(targetID)?.name || targetID;
			return this.sendReplyBox(
				`<strong>Battle Tower Medals for ${Utils.escapeHTML(targetName)}</strong><br />` +
				getBTMedalsHTML(targetID)
			);
		}
		if (cmd === 'levels' || cmd === 'list') {
			this.runBroadcast();
			if (!levels.length) return this.sendReplyBox(`No Battle Tower levels are configured.`);
			const page = cmdArgs ? parseInt(cmdArgs) : 1;
			if (page !== 1 && page !== 2) return this.errorReply(`Battle Tower levels only has pages 1 and 2.`);
			return this.sendReplyBox(getBTLevelsPageHTML(user.id, page));
		}
		if (cmd === 'format' || cmd === 'team' || cmd === 'teambuilder') {
			return this.sendReplyBox(
				`Make a team with the <strong>${TEAMBUILDER_FORMAT_NAME}</strong> teambuilder format, ` +
				`then use <code>/battletower</code> to open the Battle Tower team selector. ` +
				`Battle Tower Mode is hidden, not challengeable, and not laddered.`
			);
		}
		if (cmd === 'reset') {
			if (cmdArgs) {
				this.checkCan('bypassall');
				if (!levels.length) return this.sendReply(`No Battle Tower levels are configured.`);
				const {targetID, cleared} = parseBTSetLevelArgs(cmdArgs, user);
				if (cleared) {
					progress[targetID] = cleared;
				} else {
					delete progress[targetID];
				}
				saveProgress();
				clearBTChallenge(targetID);
				return this.sendReply(`Battle Tower progress reset for ${targetID}: ${getBTProgressLabel(cleared)}.`);
			}
			delete progress[user.id];
			saveProgress();
			clearBTChallenge(user.id);
			return this.sendReply(`Battle Tower progress reset.`);
		}
		if (cmd === 'setlevel' || cmd === 'set') {
			this.checkCan('bypassall');
			if (!levels.length) return this.sendReply(`No Battle Tower levels are configured.`);
			const {targetID, cleared} = parseBTSetLevelArgs(cmdArgs, user);
			if (cleared) {
				progress[targetID] = cleared;
			} else {
				delete progress[targetID];
			}
			saveProgress();
			clearBTChallenge(targetID);
			return this.sendReply(`Battle Tower progress set for ${targetID}: ${getBTProgressLabel(cleared)}.`);
		}
		if (cmd === 'reload') {
			this.checkCan('console');
			levels = loadLevels();
			return this.sendReply(`Reloaded ${levels.length} Battle Tower level${levels.length === 1 ? '' : 's'}.`);
		}
		if (cmd === 'complete') {
			this.checkCan('bypassall');
			if (!levels.length) return this.sendReply(`No Battle Tower levels are configured.`);
			const {targetID, cleared} = parseBTCompleteArgs(cmdArgs, user);
			progress[targetID] = Math.max(getCleared(targetID), cleared);
			saveProgress();
			clearBTChallenge(targetID);
			awardBTMedalsThrough(targetID, progress[targetID]);
			return this.sendReply(`Battle Tower progress completed for ${targetID}: ${getBTProgressLabel(progress[targetID])}.`);
		}

		const activeBattle = getCurrentBTBattle(user.id);
		if (activeBattle) {
			return this.errorReply(`You already have an active Battle Tower battle: ${activeBattle.title}`);
		}

		const cleared = getCleared(user.id);
		const levelIndex = target ? parseInt(target) - 1 : cleared;
		if (isNaN(levelIndex) || levelIndex < 0) return this.parse('/help battletower');
		if (!levels.length || levelIndex >= levels.length) {
			return this.sendReply(`You've cleared all available Battle Tower levels.`);
		}
		if (levelIndex > cleared) {
			return this.errorReply(
				`You have not unlocked ${getBTLevelLabel(levels[levelIndex], levelIndex)} yet. ` +
				`Your next level is ${getBTLevelLabel(levels[cleared], cleared)}.`
			);
		}
		const replay = levelIndex < cleared;
		sendBTTeamRequest(user, levelIndex, replay);
		this.sendReply(
			`Choose a ${TEAMBUILDER_FORMAT_NAME} team in the challenge popup to start Battle Tower ` +
			`${getBTLevelLabel(levels[levelIndex], levelIndex)}.`
		);
	},
	async btaccept(target, room, user, connection) {
		if (!checkBTAccess(this, user)) return;
		const request = resolveBTRequest(user, target);
		if (!request) {
			return this.errorReply(`Battle Tower team request not found. Use /battletower to open the Battle Tower Mode team selector.`);
		}
		const levelIndex = request.level;
		btRequests.delete(user.id);
		for (const challenge of Ladders.challenges.get(user.id) || []) {
			if (isBTChallenge(challenge)) Ladders.challenges.remove(challenge, true);
		}

		const activeBattle = getCurrentBTBattle(user.id);
		if (activeBattle) {
			return this.errorReply(`You already have an active Battle Tower battle: ${activeBattle.title}`);
		}

		const cleared = getCleared(user.id);
		if (isNaN(levelIndex) || levelIndex < 0 || !levels.length || levelIndex >= levels.length) {
			return this.sendReply(`You've cleared all available Battle Tower levels.`);
		}
		if (levelIndex > cleared) {
			return this.errorReply(
				`You have not unlocked ${getBTLevelLabel(levels[levelIndex], levelIndex)} yet. ` +
				`Your next level is ${getBTLevelLabel(levels[cleared], cleared)}.`
			);
		}
		const expectedReplay = levelIndex < cleared;
		if (request.replay !== expectedReplay) {
			return this.errorReply(`That Battle Tower team request is outdated. Use /battletower again to start your current level.`);
		}
		await startBTBattle(this, user, connection, levelIndex, request.replay);
	},
	btcancel(target, room, user) {
		if (!checkBTAccess(this, user)) return;
		clearBTChallenge(this.user.id);
		this.sendReply(`Battle Tower request cancelled.`);
	},
	battletowercancel: 'btcancel',
	btaccess(target, room, user) {
		if (!user.can('bypassall')) return this.commandDoesNotExist();
		const [cmdTarget = ""] = target.trim().split(' ');
		const cmd = toID(cmdTarget);
		const cmdArgs = target.trim().slice(cmdTarget.length).trim();
		if (cmd === 'add' || cmd === 'grant' || cmd === 'allow') {
			const targetID = toID(cmdArgs);
			if (!targetID) throw new Chat.ErrorMessage(`Usage: /btaccess add [user]`);
			btAccess.add(targetID);
			saveBTAccess();
			return this.sendReply(`Battle Tower access granted to ${targetID}.`);
		}
		if (cmd === 'remove' || cmd === 'revoke' || cmd === 'delete' || cmd === 'deny') {
			const targetID = toID(cmdArgs);
			if (!targetID) throw new Chat.ErrorMessage(`Usage: /btaccess remove [user]`);
			btAccess.delete(targetID);
			btRequests.delete(targetID);
			saveBTAccess();
			return this.sendReply(`Battle Tower access removed from ${targetID}.`);
		}
		if (cmd === 'list' || cmd === 'show' || cmd === '') {
			return this.sendReplyBox(
				`<strong>Battle Tower access</strong><br />${[...btAccess].sort().join('<br />') || '<em>No users allowed.</em>'}`
			);
		}
		return this.sendReply(`/btaccess add [user], /btaccess remove [user], /btaccess list`);
	},
	bthelp: 'battletowerhelp',
	battletowerhelp(target, room, user) {
		if (!checkBTAccess(this, user)) return;
		this.sendReplyBox([
			`/battletower - Opens the Battle Tower Mode team selector for your next Battle Tower level.`,
			`/battletower [level] - Opens the Battle Tower Mode team selector to replay an unlocked Battle Tower level.`,
			`/battletower team - Explains which teambuilder format to select.`,
			`/battletower medals [user] - Shows Battle Tower boss medals for a user.`,
			`/battletower levels [1|2] - Shows Battle Tower levels and locks. Page 1 ends at Marowak-Alola; page 2 ends at the final boss.`,
			`/battletower progress - Shows your current Battle Tower progress.`,
			`/battletower reset - Resets your own Battle Tower progress.`,
			`/battletower reset [user], [level] - Sets a user's next Battle Tower level. Requires: global administrator`,
			`/battletower setlevel [user], [level] - Sets a user's next Battle Tower level. Requires: global administrator`,
			`/battletower complete [user], [level|all] - Marks a user's Battle Tower progress complete through a level. Requires: global administrator`,
			`/battletower reload - Reloads Battle Tower levels from the optional config override. Requires: console permission`,
		].join('<br />'));
	},
};

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner) {
		const state = btBattles.get(battle.roomid);
		if (!state) return;
		clearInterval(state.timer);
		btBattles.delete(battle.roomid);
		const level = levels[state.level];
		if (!level) return;
		try {
			syncBattleState(battle.room, state);
			learnObservedPlayerSets(state);
		} catch (e: any) {
			Monitor.warn(`${BOT_NAME} final state sync error in ${battle.roomid}: ${e?.message || e}`);
		}
		flushOpponentMemory(state);
		updateAIMemory(state.decisions, winner !== state.userid);
		if (winner !== state.userid) {
			if (!state.replay) {
				const checkpoint = getMarowakCheckpoint();
				const newCleared = getCleared(state.userid) >= checkpoint ? checkpoint : 0;
				if (newCleared) {
					progress[state.userid] = newCleared;
				} else {
					delete progress[state.userid];
				}
				saveProgress();
				clearBTChallenge(state.userid);
				battle.room.add(`|-message|Battle Tower progress reset. ${getBTProgressLabel(newCleared)}.`);
			}
			battle.room.add(`|-message|Battle Tower ${getBTLevelLabel(level, state.level)} was not cleared.`).update();
			return;
		}
		const medalAwarded = level.medal ? awardBTMedal(state.userid, level.medal) : false;
		const medalMessage = medalAwarded ? ` ${BT_MEDALS[level.medal!].name} awarded.` : ``;
		const cleared = getCleared(state.userid);
		if (state.level === cleared) {
			progress[state.userid] = cleared + 1;
			saveProgress();
			clearBTChallenge(state.userid);
			const next = levels[cleared + 1];
			if (next) {
				battle.room.add(
					`|-message|Battle Tower ${getBTLevelLabel(level, state.level)} cleared. ` +
					`${getBTLevelLabel(next, cleared + 1)} unlocked.${medalMessage}`
				).update();
			} else {
				battle.room.add(
					`|-message|Battle Tower ${getBTLevelLabel(level, state.level)} cleared. You've cleared all available Battle Tower levels.${medalMessage}`
				).update();
			}
		} else {
			battle.room.add(
				`|-message|Battle Tower ${getBTLevelLabel(level, state.level)} replay cleared. Progress unchanged.${medalMessage}`
			).update();
		}
	},
};
