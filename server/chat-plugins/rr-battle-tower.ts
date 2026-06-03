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
const LEGACY_LEVELS_FILE = 'config/chat-plugins/rr-story-levels.json';
const LEGACY_PROGRESS_FILE = 'config/chat-plugins/rr-story-progress.json';
const LEGACY_AI_MEMORY_FILE = 'config/chat-plugins/rr-story-ai-memory.json';
const LEGACY_OPPONENT_MEMORY_FILE = 'config/chat-plugins/rr-story-opponent-memory.json';
const LEGACY_MEDALS_FILE = 'config/chat-plugins/rr-story-medals.json';

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
const WEATHER_SPEED_ABILITIES: {[k: string]: ID} = {
	chlorophyll: 'sunnyday' as ID,
	sandrush: 'sandstorm' as ID,
	swiftswim: 'raindance' as ID,
};

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
	setupUsed: {[ident: string]: boolean};
	decisions: BTDecision[];
	lastDecisionByPokemon: {[ident: string]: BTDecision};
	lastBotMoveDecision: BTDecision | null;
	lastBotMoveByTarget: {[ident: string]: BTDecision};
	lastLoggedMoveWasBot: boolean;
	lastLoggedMoveDecision: BTDecision | null;
	stallMoveCounters: {[ident: string]: number};
	pendingStallMoves: {[ident: string]: boolean};
	playerStyle: BTPlayerStyle;
	pendingPlayerAction: BTPendingPlayerAction | null;
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

interface BTDecision {
	key: string;
	actor: string;
	action: string;
}

interface BTAIMemoryEntry {
	score: number;
	uses: number;
}

interface BTOpponentMemoryEntry {
	moves: {[moveid: string]: number};
	abilities: {[abilityid: string]: number};
	items: {[itemid: string]: number};
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

Gengar @ Gengarite
Ability: Levitate
Level: 150
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
Level: 150
Tera Type: Dark
EVs: 252 HP / 252 Atk / 4 Def
Adamant Nature
- Knock Off
- Double-Edge
- U-turn
- Quick Attack

Rotom-Wash @ Choice Scarf
Ability: Levitate
Level: 150
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
Level: 150
Tera Type: Dragon
EVs: 252 Atk / 252 Spe
Jolly Nature
- Spirit Shackle
- U-turn
- Psychic Fangs
- Dragon Darts

Weavile @ Heavy-Duty Boots
Ability: Pressure
Level: 150
Tera Type: Dark
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Swords Dance
- Knock Off
- Triple Axel
- Low Kick
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
const btMedals: {[userid: string]: BTMedalID[]} = loadBTMedals();
const btAccess = new Set<ID>(loadBTAccess());
const btBattles = new Map<RoomID, BTBattleState>();
const btRequests = new Map<ID, {level: number, replay: boolean}>();

function readConfigFile(path: string, legacyPath: string) {
	return FS(path).readIfExistsSync() || FS(legacyPath).readIfExistsSync();
}

function loadLevels() {
	const data = readConfigFile(LEVELS_FILE, LEGACY_LEVELS_FILE);
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
		const parsed = JSON.parse(readConfigFile(PROGRESS_FILE, LEGACY_PROGRESS_FILE) || "{}");
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
		const parsed = JSON.parse(readConfigFile(MEDALS_FILE, LEGACY_MEDALS_FILE) || "{}");
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
		const parsed = JSON.parse(readConfigFile(AI_MEMORY_FILE, LEGACY_AI_MEMORY_FILE) || "{}");
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
		const parsed = JSON.parse(readConfigFile(OPPONENT_MEMORY_FILE, LEGACY_OPPONENT_MEMORY_FILE) || "{}");
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
		const result: {[speciesid: string]: BTOpponentMemoryEntry} = {};
		for (const [speciesid, entry] of Object.entries(parsed)) {
			if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
			const learned: BTOpponentMemoryEntry = {moves: {}, abilities: {}, items: {}};
			for (const field of ['moves', 'abilities', 'items'] as const) {
				const values = (entry as AnyObject)[field];
				if (!values || typeof values !== 'object' || Array.isArray(values)) continue;
				for (const [id, count] of Object.entries(values)) {
					const value = Number(count);
					if (toID(id) && Number.isFinite(value) && value > 0) learned[field][toID(id)] = Math.floor(value);
				}
			}
			if (Object.keys(learned.moves).length || Object.keys(learned.abilities).length || Object.keys(learned.items).length) {
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

function countMemoryValue(table: {[id: string]: number}, id: ID) {
	if (!id) return false;
	table[id] = Math.min(9999, (table[id] || 0) + 1);
	return true;
}

function getOpponentMemoryEntry(speciesid: ID) {
	if (!opponentMemory[speciesid]) opponentMemory[speciesid] = {moves: {}, abilities: {}, items: {}};
	return opponentMemory[speciesid];
}

function learnOpponentPokemonData(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	const speciesid = getSpeciesID(pokemonData);
	if (!speciesid || speciesid === 'none') return false;
	const entry = getOpponentMemoryEntry(speciesid);
	let changed = false;
	for (const moveid of getPokemonMoveIDsFromData(pokemonData)) {
		changed = countMemoryValue(entry.moves, moveid) || changed;
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

function learnOpponentMemoryValue(
	room: GameRoom, state: BTBattleState, ident: string | undefined, field: keyof BTOpponentMemoryEntry, value: string | undefined
) {
	const id = toID(value);
	if (!id) return;
	const pokemon = getBattlePokemonByIdent(room, ident);
	if (!pokemon) return;
	const entry = getOpponentMemoryEntry(pokemon.species.id);
	if (countMemoryValue(entry[field], id)) state.memoryChanged = true;
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
	return Teams.pack(importedTeam);
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

function trackBTOutcome(line: string, parts: string[], state: BTBattleState) {
	if (line.startsWith('|move|')) {
		const actorSideid = getLineSideID(parts[2]);
		if (actorSideid !== 'p2') {
			if (actorSideid === 'p1') recordPlayerAction(state, false);
			state.lastLoggedMoveWasBot = false;
			state.lastLoggedMoveDecision = null;
			return;
		}
		const actorID = getBattleIdentID(parts[2]);
		const moveid = toID(parts[3]);
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
			return;
		}
		state.lastBotMoveDecision = decision;
		state.lastLoggedMoveWasBot = true;
		state.lastLoggedMoveDecision = decision;
		const targetSideid = getLineSideID(parts[4]);
		if (targetSideid === 'p1') {
			state.lastBotMoveByTarget[getBattleIdentID(parts[4])] = decision;
		}
		return;
	}
	if (line.startsWith('|switch|') && getLineSideID(parts[2]) === 'p1') {
		recordPlayerAction(state, true);
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
		if (state.lastLoggedMoveWasBot) rewardDecision(state, state.lastLoggedMoveDecision, -0.45);
		if (!state.pendingStallMoves[actorID]) return;
		state.stallMoveCounters[actorID] = 1;
		delete state.pendingStallMoves[actorID];
		return;
	}
	if (line.startsWith('|-immune|')) {
		if (state.lastLoggedMoveWasBot) rewardDecision(state, state.lastLoggedMoveDecision, -0.55);
		return;
	}
	if (!line.startsWith('|faint|')) return;
	const faintedSideid = getLineSideID(parts[2]);
	const faintedID = getBattleIdentID(parts[2]);
	if (faintedSideid === 'p1') {
		const decision = state.lastBotMoveByTarget[faintedID] || state.lastBotMoveDecision;
		rewardDecision(state, decision, decision?.action.endsWith(':z') ? 0.85 : 0.6);
		delete state.lastBotMoveByTarget[faintedID];
	} else if (faintedSideid === 'p2') {
		delete state.lastDecisionByPokemon[faintedID];
		delete state.pendingStallMoves[faintedID];
		delete state.stallMoveCounters[faintedID];
	}
}

function syncBattleState(room: GameRoom, state: BTBattleState) {
	const logs = room.log.log;
	for (let i = state.logIndex; i < logs.length; i++) {
		const line = logs[i];
		const parts = line.split('|');
		trackBTOutcome(line, parts, state);
		learnPublicAbilityFromLine(room, state, parts);
		if (line.startsWith('|move|')) {
			if (getLineSideID(parts[2]) === 'p1') {
				learnOpponentMemoryValue(room, state, parts[2], 'moves', parts[3]);
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

function chooseTeamPreview(request: AnyObject, state: BTBattleState) {
	if (levels[state.level]?.medal === 'marowak') {
		const pokemon = request.side?.pokemon || [];
		const leadIndex = pokemon.findIndex((pokemonData: AnyObject) => toID(getSpeciesName(pokemonData)) === 'gengar');
		if (leadIndex >= 0) {
			const order = [leadIndex + 1];
			for (let i = 0; i < pokemon.length; i++) {
				if (i !== leadIndex) order.push(i + 1);
			}
			return `team ${order.join(', ')}`;
		}
	}
	return 'default';
}

function getFoeRequest(room: GameRoom, sideid: 'p1' | 'p2') {
	const foeSideid = sideid === 'p1' ? 'p2' : 'p1';
	const foe = room.battle?.[foeSideid];
	try {
		if (foe?.request.request) return JSON.parse(foe.request.request);
	} catch {}
	return null;
}

function getAIContext(room: GameRoom, request?: AnyObject): BTAIContext {
	const field = (room.battle as AnyObject | null)?.field || {};
	const ownSideid = request?.side?.id as 'p1' | 'p2' | undefined;
	const foeSideid = ownSideid === 'p1' ? 'p2' : 'p1';
	const ownSide = ownSideid ? getBattleSidePokemonData(room, ownSideid, 'own') : request?.side?.pokemon;
	let targetSide = ownSideid ? getBattleSidePokemonData(room, foeSideid, 'opponent') : [];
	if (!targetSide.length && ownSideid) targetSide = getSanitizedFoeRequestSideData(room, ownSideid);
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

function getPokemonMoveIDs(pokemonData: AnyObject) {
	const moveids = getPokemonMoveIDsFromData(pokemonData);
	if (moveids.length) return moveids;

	const dex = Dex.mod('gen9rrbt');
	const species = dex.species.get(getSpeciesName(pokemonData));
	const memoryMoves = getRankedMemoryIDs(opponentMemory[species.id]?.moves);
	if (memoryMoves.length) return memoryMoves;
	const formatsData = dex.data.FormatsData[species.id] || dex.data.FormatsData[toID(species.baseSpecies)] || {};
	return ((formatsData.randomBattleMoves || formatsData.randomDoubleBattleMoves || []) as string[])
		.map(move => toID(move)).filter(Boolean);
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

function getSanitizedOpponentPokemonData(pokemon: Pokemon) {
	const estimatedMaxHP = Math.max(1, getEstimatedStat(pokemon.species.baseStats.hp, pokemon.level || 100, true));
	const hpFraction = pokemon.maxhp > 0 ? pokemon.hp / pokemon.maxhp : 0;
	const estimatedHP = pokemon.fainted ? 0 : Math.max(1, Math.round(estimatedMaxHP * hpFraction));
	return {
		ident: pokemon.fullname,
		details: pokemon.details,
		condition: pokemon.fainted ? '0 fnt' : `${estimatedHP}/${estimatedMaxHP}`,
		active: pokemon.position < pokemon.side.active.length,
		stats: getEstimatedStats(pokemon),
		boosts: {...pokemon.boosts},
		moves: [],
		item: '',
		ability: '',
		baseAbility: '',
	};
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
		visibility === 'own' ? pokemon.getSwitchRequestData(true) : getSanitizedOpponentPokemonData(pokemon)
	));
}

function getBattlePokemonByIdent(room: GameRoom, ident: string | undefined) {
	if (!ident || !room.battle) return null;
	const sideid = getLineSideID(ident);
	if (sideid !== 'p1' && sideid !== 'p2') return null;
	const side = room.battle[sideid];
	return side?.pokemon?.find((pokemon: Pokemon) => pokemon.fullname === ident) || null;
}

function getBattleActivePokemon(room: GameRoom, sideid: 'p1' | 'p2', index = 0) {
	const pokemon = (room.battle as AnyObject | null)?.[sideid]?.active?.[index] as Pokemon | null | undefined;
	if (!pokemon || pokemon.fainted) return null;
	return pokemon;
}

function getBattleActivePokemonData(room: GameRoom, sideid: 'p1' | 'p2', index = 0, visibility: 'own' | 'opponent' = 'own') {
	const pokemon = getBattleActivePokemon(room, sideid, index);
	if (!pokemon || pokemon.fainted) return null;
	return visibility === 'own' ? pokemon.getSwitchRequestData(true) : getSanitizedOpponentPokemonData(pokemon);
}

function getTargetPokemon(room: GameRoom, ownSideid: 'p1' | 'p2', index = 0) {
	const foeSideid = ownSideid === 'p1' ? 'p2' : 'p1';
	return getBattleActivePokemon(room, foeSideid, index);
}

function getTargetPokemonData(room: GameRoom, ownSideid: 'p1' | 'p2', index = 0) {
	const foeSideid = ownSideid === 'p1' ? 'p2' : 'p1';
	const battleData = getBattleActivePokemonData(room, foeSideid, index, 'opponent');
	if (battleData) return battleData;
	const foeRequest = getFoeRequest(room, ownSideid);
	const requestData = foeRequest ? getActivePokemonData(foeRequest, index) : null;
	return requestData ? getSanitizedRequestPokemonData(requestData) : null;
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

function hasWeather(context: BTAIContext | undefined, weather: ID) {
	if (!context?.weather) return false;
	if (weather === 'sunnyday') return ['sunnyday', 'desolateland'].includes(context.weather);
	if (weather === 'raindance') return ['raindance', 'primordialsea'].includes(context.weather);
	return context.weather === weather;
}

function pokemonIsGrounded(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	if (getPokemonItemID(pokemonData) === 'airballoon') return false;
	if (pokemonCanHaveAbility(pokemonData, 'levitate' as ID)) return false;
	return !getPokemonTypes(pokemonData).includes('Flying');
}

function countFaintedAllies(context: BTAIContext | undefined) {
	if (!context?.sourceSide) return 0;
	return context.sourceSide.filter(pokemonData => pokemonData.condition?.endsWith(' fnt')).length;
}

function sourceIgnoresTargetAbility(sourceData: AnyObject, move: Move) {
	return !!(move as AnyObject).ignoreAbility ||
		(['moldbreaker', 'teravolt', 'turboblaze'] as ID[]).some(ability => pokemonCanHaveAbility(sourceData, ability));
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
	if (type === 'Ground' && (['levitate', 'eartheater'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Water' && (['dryskin', 'stormdrain', 'waterabsorb'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Electric' && (['lightningrod', 'motordrive', 'voltabsorb'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Fire' && (['flashfire', 'wellbakedbody'] as ID[]).some(targetHasAbility)) return true;
	if (type === 'Grass' && targetHasAbility('sapsipper' as ID)) return true;
	if (move.flags['bullet'] && targetHasAbility('bulletproof' as ID)) return true;
	if (move.flags['sound'] && targetHasAbility('soundproof' as ID)) return true;
	if (move.flags['wind'] && targetHasAbility('windrider' as ID)) return true;
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

function statusMoveBlocked(
	move: Move, moveid: ID, sourceData: AnyObject, targetData: AnyObject | null, targetPokemon: Pokemon | null = null,
	context?: BTAIContext
) {
	if (!targetData) return false;
	const targetItem = getPokemonItemID(targetData);
	const ignoresAbility = sourceIgnoresTargetAbility(sourceData, move);
	const targetHasAbility = (ability: ID) => pokemonCanHaveAbility(targetData, ability);
	const targetsPokemon = !['all', 'allySide', 'foeSide', 'self'].includes(move.target);
	if (move.status && pokemonIsGrounded(targetData)) {
		if (context?.terrain === 'mistyterrain') return true;
		if (context?.terrain === 'electricterrain' && move.status === 'slp') return true;
	}
	if (!ignoresAbility && targetHasAbility('goodasgold' as ID) && targetsPokemon) return true;
	if (!ignoresAbility && targetHasAbility('magicbounce' as ID) && move.flags['reflectable']) return true;
	if (!ignoresAbility && targetHasAbility('mirrorarmor' as ID) && move.flags['reflectable']) return true;
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
		const sourceAbility = getPokemonAbilityID(sourceData);
		if ((['magicguard', 'poisonheal', 'radicalaura', 'familialrevenge'] as ID[]).some(targetHasAbility)) return true;
		if (sourceAbility !== 'corrosion' && pokemonHasAnyType(targetData, targetPokemon, ['Poison', 'Steel'])) return true;
	}
	if (moveid === 'willowisp' && pokemonHasType(targetData, targetPokemon, 'Fire')) return true;
	if (moveid === 'thunderwave' && pokemonHasAnyType(targetData, targetPokemon, ['Electric', 'Ground'])) return true;
	if (moveid === 'leechseed' && pokemonHasType(targetData, targetPokemon, 'Grass')) return true;
	if (pokemonHasVolatile(targetPokemon, move.volatileStatus)) return true;
	if (['leechseed', 'taunt', 'encore', 'torment'].includes(moveid) && pokemonHasVolatile(targetPokemon, moveid)) {
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

function hasFutureMoveOnTargetSlot(room: GameRoom, targetSideid: 'p1' | 'p2', targetData: AnyObject | null) {
	const side = (room.battle as AnyObject | null)?.[targetSideid];
	const position = getPositionFromIdent(targetData?.ident);
	return !!side?.slotConditions?.[position]?.futuremove;
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

function estimateMovePriority(move: Move, pokemonData: AnyObject) {
	let priority = move.priority || 0;
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

function scoreSwitchOption(
	switchOption: AnyObject, targetData: AnyObject | null, state?: BTBattleState, context?: BTAIContext
) {
	const hpData = getHPData(switchOption);
	let score = (hpData.hp / hpData.maxhp) * 25;
	if (state) {
		score += memoryScore(getMemoryKey(state, switchOption, targetData, `switch:${getSpeciesID(switchOption)}`)) * 12;
	}
	if (!targetData) return score;
	const targetHP = getHPData(targetData);
	const damageOut = estimateBestDamageFromPokemon(switchOption, targetData, context);
	const damageIn = estimateBestDamageFromPokemon(targetData, switchOption, context ? {...context, sourceSide: undefined} : undefined);
	score += Math.min(damageOut, targetHP.hp) / targetHP.maxhp * 100;
	score -= Math.min(damageIn, hpData.hp) / hpData.maxhp * 75;
	if (damageOut >= targetHP.hp) score += 40;
	if (damageIn >= hpData.hp) score -= 40;
	if (getPokemonAbilityID(switchOption) === 'intimidate') {
		const threatContext = context ? {...context, sourceSide: undefined} : undefined;
		const physicalThreat = estimateBestDamageByCategory(targetData, switchOption, 'Physical', threatContext);
		const specialThreat = estimateBestDamageByCategory(targetData, switchOption, 'Special', threatContext);
		if (physicalThreat > 0 && physicalThreat >= specialThreat) score += 18;
	}
	return score;
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
			!pokemon[i].reviving
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
			switchOption.reviving
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

function getModifiedMoveType(move: Move, pokemonData: AnyObject) {
	if (pokemonCanHaveAbility(pokemonData, 'liquidvoice' as ID) && move.flags['sound']) return 'Water';
	if (move.type === 'Normal') {
		if (pokemonCanHaveAbility(pokemonData, 'refrigerate' as ID)) return 'Ice';
		if (pokemonCanHaveAbility(pokemonData, 'pixilate' as ID)) return 'Fairy';
		if (pokemonCanHaveAbility(pokemonData, 'aerilate' as ID)) return 'Flying';
		if (pokemonCanHaveAbility(pokemonData, 'galvanize' as ID)) return 'Electric';
	}
	return move.type;
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

function abilityBoostIsActive(ability: ID, pokemonData: AnyObject, context?: BTAIContext) {
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
		if (abilityBoostIsActive(ability, pokemonData, context) && getBoosterBoostedStat(pokemonData) === 'spe') speed *= 1.5;
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

function estimateDamage(
	moveid: ID, sourceData: AnyObject, targetData: AnyObject, useZMove = false, context?: BTAIContext
) {
	const dex = Dex.mod('gen9rrbt');
	const sourceSpecies = dex.species.get(getSpeciesName(sourceData));
	const move = dex.moves.get(moveid);
	if (!move.exists || move.category === 'Status') return 0;
	if (context?.terrain === 'psychicterrain' && move.priority > 0 && pokemonIsGrounded(targetData)) return 0;
	let basePower = move.basePower || 0;
	if (useZMove) {
		if (!move.zMove?.basePower) return 0;
		basePower = move.zMove.basePower;
	}
	if (!useZMove && ['lowkick', 'grassknot'].includes(moveid)) {
		basePower = getWeightBasedBasePower(getPokemonWeight(targetData));
	}
	if (!useZMove && moveid === 'knockoff' && targetData.item) {
		basePower = Math.floor(basePower * 1.5);
	}
	if (move.multihit === 2) basePower *= 2;
	if (moveid === 'tripleaxel') basePower = 120;
	const type = getModifiedMoveType(move, sourceData);
	const sourceHasAbility = (abilityid: ID) => pokemonCanHaveAbility(sourceData, abilityid);
	const targetHasAbility = (abilityid: ID) => pokemonCanHaveAbility(targetData, abilityid);
	if (moveHasSelfKO(move) && (sourceHasAbility('damp' as ID) || targetHasAbility('damp' as ID))) return 0;
	if (sourceHasAbility('technician' as ID) && basePower <= 60) basePower = Math.floor(basePower * 1.5);
	if ((['refrigerate', 'pixilate', 'aerilate', 'galvanize'] as ID[]).some(sourceHasAbility) && move.type === 'Normal') {
		basePower = Math.floor(basePower * 1.2);
	}
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
	if (type === 'Ground' && getPokemonItemID(targetData) === 'airballoon' && !ignoresBoneImmunity) return 0;
	if (!ignoresBoneImmunity && abilityBlocksDamagingMove(move, type, sourceData, targetData)) return 0;
	let typeMod = 0;
	for (const targetType of getPokemonTypes(targetData)) {
		if (!dex.getImmunity(type, targetType)) {
			if (
				ignoresBoneImmunity ||
				(sourceHasAbility('scrappy' as ID) && targetType === 'Ghost' && ['Normal', 'Fighting'].includes(type))
			) continue;
			return 0;
		}
		const effectiveness = dex.getEffectiveness(type, targetType);
		typeMod += effectiveness;
	}
	if (ignoresBoneImmunity && typeMod < 0) typeMod++;
	const typeMultiplier = Math.pow(2, typeMod);
	const category = move.category;
	const offensiveStat = (move as AnyObject).overrideOffensiveStat || (category === 'Physical' ? 'atk' : 'spa');
	const defensiveStat = (move as AnyObject).overrideDefensiveStat || (category === 'Physical' ? 'def' : 'spd');
	let attack = getStat(sourceData, offensiveStat, targetHasAbility('unaware' as ID));
	for (const abilityid of getPossiblePokemonAbilityIDs(sourceData)) {
		if (abilityBoostIsActive(abilityid, sourceData, context) && getBoosterBoostedStat(sourceData) === offensiveStat) {
			attack *= 1.3;
			break;
		}
	}
	if (targetHasAbility('vesselofruin' as ID) && category === 'Special' && !sourceHasAbility('vesselofruin' as ID)) attack *= 0.75;
	const defense = getStat(targetData, defensiveStat, sourceHasAbility('unaware' as ID));
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
	if (targetHasAbility('purifyingsalt' as ID) && type === 'Ghost' && !sourceHasAbility('moldbreaker' as ID)) {
		damage = Math.floor(damage * 0.5);
	}
	if (item === 'lifeorb') damage = Math.floor(damage * 1.3);
	if (sturdyPreventsOHKO(move, sourceData, targetData, damage, useZMove)) {
		damage = Math.max(0, getHPData(targetData).hp - 1);
	}
	return Math.max(0, damage);
}

function isSetupMove(moveid: ID) {
	return [
		'swordsdance', 'dragondance', 'nastyplot', 'calmmind', 'bulkup',
		'quiverdance', 'victorydance', 'shellsmash',
	].includes(moveid);
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

function shouldSwitchForAbility(activeData: AnyObject, switchDamage: number, activeDamage: number) {
	const ability = getPokemonAbilityID(activeData);
	const hp = getHPData(activeData);
	const hpFraction = hp.hp / Math.max(1, hp.maxhp);
	if (ability === 'zerotohero' && getSpeciesID(activeData) === 'palafin') return true;
	if (ability === 'regenerator' && hpFraction < 0.67 && switchDamage >= activeDamage) return true;
	if (ability === 'naturalcure' && hasStatus(activeData) && switchDamage >= activeDamage * 0.75) return true;
	return false;
}

function getAccuracyFactor(move: Move, pokemonData: AnyObject) {
	if (move.accuracy === true) return 1;
	let factor = typeof move.accuracy === 'number' ? Math.max(0.5, move.accuracy / 100) : 0.9;
	const ability = getPokemonAbilityID(pokemonData);
	if (ability === 'victorystar') factor *= 1.1;
	if (ability === 'hustle' && move.category === 'Physical') factor *= 0.8;
	return Math.min(1.1, factor);
}

function hasStatus(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	return !!(pokemonData.condition || '').split(' ')[1];
}

function pokemonCanRecover(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	return getPokemonMoveIDs(pokemonData).some(moveid => RECOVERY_MOVE_IDS.has(moveid));
}

function moveAppliesHealBlock(move: Move, moveid: ID) {
	return moveid === 'psychicnoise' || (move.secondary as AnyObject | null)?.volatileStatus === 'healblock';
}

function pokemonKnowsMove(pokemonData: AnyObject | null, moveid: ID) {
	if (!pokemonData) return false;
	return getPokemonMoveIDs(pokemonData).includes(moveid);
}

function sideHasAbility(side: AnyObject[] | undefined, ability: ID) {
	return !!side?.some(pokemonData => getHPData(pokemonData).hp > 0 && pokemonCanHaveAbility(pokemonData, ability));
}

function remainingSidePokemon(side: AnyObject[] | undefined) {
	return (side || []).filter(pokemonData => getHPData(pokemonData).hp > 0);
}

function sideHasLowHPAlly(side: AnyObject[] | undefined, threshold = 0.5) {
	return remainingSidePokemon(side).some(pokemonData => {
		const hp = getHPData(pokemonData);
		return hp.hp < hp.maxhp * threshold;
	});
}

function hasTauntThreat(sourceData: AnyObject, targetData: AnyObject | null, context?: BTAIContext) {
	if (!targetData || !pokemonKnowsMove(targetData, 'taunt' as ID)) return false;
	return estimateSpeed(targetData, context ? {...context, sourceSide: undefined} : undefined) >= estimateSpeed(sourceData, context);
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

function scoreDamagingMove(
	move: Move, moveid: ID, damage: number, pokemonData: AnyObject, targetData: AnyObject, targetPokemon: Pokemon | null,
	state: BTBattleState, action: string, context?: BTAIContext, useZMove = false
) {
	const targetHP = getHPData(targetData);
	const targetMaxHP = Math.max(1, targetHP.maxhp);
	let score = Math.min(damage, targetHP.hp) / targetMaxHP * 120;
	if (damage >= targetHP.hp) score += 90;
	const switchChance = getSwitchPredictionChance(state, pokemonData, targetData, context);
	const predictedSwitch = switchChance ? getPredictedSwitchTarget(pokemonData, targetData, context) : null;
	if (predictedSwitch) {
		const switchHP = getHPData(predictedSwitch);
		const switchDamage = estimateDamage(moveid, pokemonData, predictedSwitch, useZMove, context);
		const currentValue = Math.min(damage, targetHP.hp) / targetMaxHP;
		const switchValue = Math.min(switchDamage, switchHP.hp) / Math.max(1, switchHP.maxhp);
		score += (switchValue - currentValue) * 120 * switchChance;
		if (damage >= targetHP.hp && switchDamage < switchHP.hp) score -= 65 * switchChance;
		if (switchDamage >= switchHP.hp) score += 45 * switchChance;
		if ((move as AnyObject).selfSwitch) score += 14 * switchChance;
	}
	if (moveHasSelfKO(move)) {
		score += damage >= targetHP.hp ? -35 : -220;
	}
	const sourceAbility = getPokemonAbilityID(pokemonData);
	if (moveHasRecoilOrCrash(move) && !['magicguard', 'rockhead'].includes(sourceAbility) && damage < targetHP.hp) {
		const sourceHP = getHPData(pokemonData);
		score -= sourceHP.hp <= sourceHP.maxhp / 3 ? 28 : 14;
	}
	if (move.flags['contact']) {
		const targetAbility = getPokemonAbilityID(targetData);
		const contactPenalty =
			(getPokemonItemID(targetData) === 'rockyhelmet' ? 22 : 0) +
			(CONTACT_DAMAGE_ABILITIES.has(targetAbility) ? 18 : 0) +
			(CONTACT_STATUS_ABILITIES.has(targetAbility) ? 12 : 0);
		if (contactPenalty && damage < targetHP.hp) {
			const sourceHP = getHPData(pokemonData);
			score -= sourceHP.hp <= sourceHP.maxhp / 4 ? contactPenalty * 2 : contactPenalty;
		}
	}
	if (move.priority > 0) score += 10 + move.priority * 5;
	if (move.priority <= 0) {
		if (estimateSpeed(pokemonData, context) > estimateSpeed(targetData, context)) {
			score += 8;
		} else if (damage < targetHP.hp) {
			score -= 4;
		}
	}
	if (move.volatileStatus === 'flinch') score += 6;
	if (sourceAbility === 'serenegrace' && (move.secondaries || move.secondary)) score += 8;
	if (sourceAbility === 'contrary' && Object.values((move.self as AnyObject | null)?.boosts || {}).some(boost => (boost as number) < 0)) {
		score += 18;
	}
	if (damage >= targetHP.hp && ['battlebond', 'beastboost'].includes(sourceAbility)) score += 22;
	if (moveAppliesHealBlock(move, moveid) && pokemonCanRecover(targetData) && !pokemonHasVolatile(targetPokemon, 'healblock')) {
		score += 28;
	}
	if ((move as AnyObject).selfSwitch) score += 10;
	if (moveid === 'rapidspin' && context?.ownHazards && hasHazards(context.ownHazards) && damage > 0) {
		score += 58;
	}
	score *= getAccuracyFactor(move, pokemonData);
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
	let score = -Infinity;

	if (moveid === 'perishsong' && getSpeciesID(pokemonData) === 'gengar') {
		score = 115;
	} else if (isSetupMove(moveid) && !state.setupUsed[setupKey] && bestDamage > 0 && bestDamage * 2 < targetHP) {
		score = 80;
		if (targetThreat < activeHP.hp * 0.3) score += 34;
		if (targetThreat >= activeHP.hp * 0.7) score -= 48;
		score += estimateSetupSweepPotential(moveid, pokemonData, context) * 10;
	} else if (move.flags['futuremove'] && targetData && bestDamage >= 0) {
		score = 62;
	} else if (
		moveid === 'defog' &&
		hasHazards(ownHazards) &&
		!pokemonCanHaveAbility(targetData, 'goodasgold' as ID)
	) {
		score = 78;
	} else if (
		['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'].includes(moveid) &&
		canUseHazard(moveid, targetHazards)
	) {
		score = 66 - targetHazards.spikes * 4;
		if (sideHasAbility(context?.targetSide, 'magicbounce' as ID)) score -= 18;
	} else if (
		['recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'synthesis'].includes(moveid) &&
		hpFraction < 0.55
	) {
		score = 72 + (0.55 - hpFraction) * 80;
	} else if (moveid === 'wish' && (hpFraction < 0.68 || sideHasLowHPAlly(context?.ownSide))) {
		score = hpFraction < 0.5 ? 86 : 68;
		if (pokemonKnowsMove(pokemonData, 'protect' as ID)) score += 10;
	} else if (moveid === 'protect' && pokemonKnowsMove(pokemonData, 'wish' as ID) && hpFraction < 0.8) {
		const counter = state.stallMoveCounters[getPokemonDecisionID(pokemonData)] || 1;
		score = 58 / counter;
	} else if (['toxic', 'willowisp', 'thunderwave'].includes(moveid) && targetData && !hasStatus(targetData)) {
		score = 52;
	} else if (['taunt', 'encore', 'torment'].includes(moveid) && targetData) {
		score = 38;
	} else if (isStallingMove(moveid) && hpFraction > 0.35) {
		const counter = state.stallMoveCounters[getPokemonDecisionID(pokemonData)] || 1;
		score = 26 / counter;
	} else if (moveid === 'substitute' && hpFraction > 0.35) {
		score = 26;
	}
	if (score > -Infinity && move.category === 'Status') {
		if (hasTauntThreat(pokemonData, targetData, context)) score -= 28;
		if (move.flags['reflectable'] && sideHasAbility(context?.targetSide, 'magicbounce' as ID)) score -= 16;
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
	let bestDamage = -1;
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
			if (damage > bestDamage) bestDamage = damage;
			const action = `move:${moveid}`;
			const score = scoreDamagingMove(move, moveid, damage, pokemonData, targetData, targetPokemon, state, action, context);
			if (score > bestScore) {
				bestScore = score;
				bestDamage = damage;
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
					move, moveid, zDamage, pokemonData, targetData, targetPokemon, state, zAction, context, true
				) + zUpgrade + (
					zDamage >= targetHP && damage < targetHP ? 55 : 0
				) - zMoveConservationPenalty(damage, zDamage, targetData, context);
				if (zScore > bestScore) {
					bestScore = zScore;
					bestDamage = zDamage;
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
		bestChoice = moves.find(({move}: {move: AnyObject}) => {
			const dexMove = Dex.mod('gen9rrbt').moves.get(move.id);
			return !(futureMoveActive && dexMove.flags['futuremove']);
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
		...getAIContext(room, request),
		ownHazards: state.hazards[ownSideid],
		targetHazards: state.hazards[foeSideid],
	};
	const targetData = getTargetPokemonData(room, ownSideid);
	const targetPokemon = getTargetPokemon(room, ownSideid);
	const futureMoveActive = hasFutureMoveOnTargetSlot(room, foeSideid, targetData);
	const pokemon = request.side.pokemon;
	const primaryActive = getActivePokemonData(request, 0) || pokemon[0];
	state.pendingPlayerAction = targetData && primaryActive ? {
		target: getPokemonDecisionID(targetData),
		threatened: targetIsThreatenedByPokemon(primaryActive, targetData, context),
	} : null;
	const switchChoices: number[] = [];
	const choices = request.active.map((active: AnyObject, index: number) => {
		const pokemonData = getActivePokemonData(request, index) || pokemon[index];
		if (!pokemonData || pokemonData.condition.endsWith(' fnt') || pokemonData.commanding) return 'pass';
		if (!active.trapped && state.perish[ownSideid] === 1) {
			const switchSlot = chooseBestSwitchSlot(request, request.active.length, switchChoices, targetData, state, context);
			if (switchSlot) {
				switchChoices.push(switchSlot);
				const switchOption = request.side.pokemon[switchSlot - 1];
				rememberDecision(state, switchOption, targetData, `switch:${getSpeciesID(switchOption)}`);
				return `switch ${switchSlot}`;
			}
		}
		if (!active.trapped && targetData) {
			const targetHP = getHPData(targetData);
			const activeHP = getHPData(pokemonData);
			const hasAvailableMoves = (active.moves || []).some((move: AnyObject) => isAvailableMoveChoice(move));
			const bestDamage = estimateBestDamageFromActive(active, pokemonData, targetData, futureMoveActive, context);
			const targetThreat = estimateBestDamageFromPokemon(targetData, pokemonData, {...context, sourceSide: undefined});
			const switchSlot = chooseBestSwitchSlot(request, request.active.length, switchChoices, targetData, state, context);
			const switchOption = switchSlot ? request.side.pokemon[switchSlot - 1] : null;
			const switchDamage = switchOption ? estimateBestDamageFromPokemon(switchOption, targetData, context) : 0;
			if (switchSlot && (
				!hasAvailableMoves ||
				(bestDamage <= 0 && switchDamage > 0) ||
				shouldSwitchForBetterMatchup(pokemonData, targetData, bestDamage, switchDamage, targetThreat) ||
				(
					targetThreat >= activeHP.hp && bestDamage < targetHP.hp &&
					shouldSwitchOutOfLethalThreat(pokemonData, targetData, switchOption, bestDamage, switchDamage, targetThreat, context)
				)
				|| shouldSwitchForAbility(pokemonData, switchDamage, bestDamage)
			)) {
				switchChoices.push(switchSlot);
				rememberDecision(state, switchOption, targetData, `switch:${getSpeciesID(switchOption)}`);
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
		const targetData = getTargetPokemonData(room, request.side.id);
		return chooseSwitch(request, targetData, state, getAIContext(room, request));
	}
	if (request.active) return chooseMove(request, room, state);
	return chooseTeamPreview(request, state);
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
		if (state) clearInterval(state.timer);
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
		setupUsed: {},
		decisions: [],
		lastDecisionByPokemon: {},
		lastBotMoveDecision: null,
		lastBotMoveByTarget: {},
		lastLoggedMoveWasBot: false,
		lastLoggedMoveDecision: null,
		stallMoveCounters: {},
		pendingStallMoves: {},
		playerStyle: newPlayerStyle(),
		pendingPlayerAction: null,
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
	rrstory: 'story',
	story() {
		this.commandDoesNotExist();
	},
	storyhelp() {
		throw new Chat.ErrorMessage(`The command "/story" does not exist.`);
	},
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
				return this.sendReply(`Battle Tower progress reset for ${targetID}: ${getBTProgressLabel(cleared)}.`);
			}
			delete progress[user.id];
			saveProgress();
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
		if (state.memoryChanged) saveOpponentMemory();
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
