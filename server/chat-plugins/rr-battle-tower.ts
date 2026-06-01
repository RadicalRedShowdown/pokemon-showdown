import {FS, Utils} from '../../lib';
import {Ladders} from '../ladders';
import {POKEPASTE_LEVELS} from './rr-battle-tower-levels';
import {grantRRBadge, type RRBadgeID} from './rr-custom-badges';

const FORMAT_ID = 'gen9rrbattletower';
const FORMAT_NAME = '[Gen 9] RR Battle Tower';
const BOT_NAME = 'RR BT Bot';
const BOT_AVATAR = '101';
const BT_CHALLENGER_ID = 'rrbtbot' as ID;
const BT_ACCEPT_COMMAND = '/btaccept';
// Optional override. If this file exists, it replaces DEFAULT_LEVELS below.
const LEVELS_FILE = 'config/chat-plugins/rr-battle-tower-levels.json';
const PROGRESS_FILE = 'config/chat-plugins/rr-battle-tower-progress.json';
const AI_MEMORY_FILE = 'config/chat-plugins/rr-battle-tower-ai-memory.json';
const MEDALS_FILE = 'config/chat-plugins/rr-battle-tower-medals.json';
const LEGACY_LEVELS_FILE = 'config/chat-plugins/rr-story-levels.json';
const LEGACY_PROGRESS_FILE = 'config/chat-plugins/rr-story-progress.json';
const LEGACY_AI_MEMORY_FILE = 'config/chat-plugins/rr-story-ai-memory.json';
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
	stallMoveCounters: {[ident: string]: number};
	pendingStallMoves: {[ident: string]: boolean};
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
const btMedals: {[userid: string]: BTMedalID[]} = loadBTMedals();
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
	const ready = new Ladders.BattleReady(user.id, FORMAT_ID, {
		...user.battleSettings,
		team: '',
	});
	const challenge = new Ladders.BattleChallenge(BT_CHALLENGER_ID, user.id, ready, {
		acceptCommand: command,
		message:
			`Choose a ${FORMAT_NAME} team for Battle Tower ${getBTLevelLabel(level, levelIndex)}` +
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
		connection.popup(`Select a ${FORMAT_NAME} team first.`);
		return null;
	}
	const ready = await Ladders(FORMAT_ID).prepBattle(connection, 'challenge');
	if (!ready) return null;
	return ready.settings;
}

function newHazards(): BTSideHazards {
	return {stealthrock: false, spikes: 0, toxicspikes: 0, stickyweb: false, gmaxsteelsurge: false};
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

function trackBTOutcome(line: string, parts: string[], state: BTBattleState) {
	if (line.startsWith('|move|')) {
		const actorSideid = getLineSideID(parts[2]);
		if (actorSideid !== 'p2') return;
		const actorID = getBattleIdentID(parts[2]);
		const moveid = toID(parts[3]);
		if (isStallingMove(moveid)) {
			state.pendingStallMoves[actorID] = true;
		} else {
			state.stallMoveCounters[actorID] = 1;
			delete state.pendingStallMoves[actorID];
		}
		const decision = state.lastDecisionByPokemon[actorID];
		if (!decision?.action.startsWith('move:')) return;
		state.lastBotMoveDecision = decision;
		const targetSideid = getLineSideID(parts[4]);
		if (targetSideid === 'p1') {
			state.lastBotMoveByTarget[getBattleIdentID(parts[4])] = decision;
		}
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
		if (!state.pendingStallMoves[actorID]) return;
		state.stallMoveCounters[actorID] = 1;
		delete state.pendingStallMoves[actorID];
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

function getPokemonMoveIDs(pokemonData: AnyObject) {
	const moves = pokemonData.moves || [];
	return moves.map((move: AnyObject) => toID(typeof move === 'string' ? move : move.id || move.move)).filter(Boolean);
}

function getBattleActivePokemonData(room: GameRoom, sideid: 'p1' | 'p2', index = 0) {
	const pokemon = (room.battle as AnyObject | null)?.[sideid]?.active?.[index] as Pokemon | null | undefined;
	if (!pokemon || pokemon.fainted) return null;
	return pokemon.getSwitchRequestData();
}

function getTargetPokemonData(room: GameRoom, ownSideid: 'p1' | 'p2', index = 0) {
	const foeSideid = ownSideid === 'p1' ? 'p2' : 'p1';
	const foeRequest = getFoeRequest(room, ownSideid);
	return (foeRequest ? getActivePokemonData(foeRequest, index) : null) ||
		getBattleActivePokemonData(room, foeSideid, index);
}

function getPokemonAbilityID(pokemonData: AnyObject | null) {
	if (!pokemonData) return '' as ID;
	return toID(pokemonData.ability || pokemonData.baseAbility || pokemonData.abilityData?.id);
}

function getPokemonItemID(pokemonData: AnyObject | null) {
	if (!pokemonData) return '' as ID;
	return toID(pokemonData.item);
}

function sourceIgnoresTargetAbility(sourceData: AnyObject, move: Move) {
	const ability = getPokemonAbilityID(sourceData);
	return !!(move as AnyObject).ignoreAbility || ['moldbreaker', 'teravolt', 'turboblaze'].includes(ability);
}

function moveHasSelfKO(move: Move) {
	return !!move.selfdestruct || !!(move as AnyObject).mindBlownRecoil;
}

function abilityBlocksDamagingMove(move: Move, type: string, sourceData: AnyObject, targetData: AnyObject) {
	const targetAbility = getPokemonAbilityID(targetData);
	if (!targetAbility || sourceIgnoresTargetAbility(sourceData, move)) return false;
	if (moveHasSelfKO(move) && targetAbility === 'damp') return true;
	if (type === 'Ground' && ['levitate', 'eartheater'].includes(targetAbility)) return true;
	if (type === 'Water' && ['dryskin', 'stormdrain', 'waterabsorb'].includes(targetAbility)) return true;
	if (type === 'Electric' && ['lightningrod', 'motordrive', 'voltabsorb'].includes(targetAbility)) return true;
	if (type === 'Fire' && ['flashfire', 'wellbakedbody'].includes(targetAbility)) return true;
	if (type === 'Grass' && targetAbility === 'sapsipper') return true;
	if (move.flags['bullet'] && targetAbility === 'bulletproof') return true;
	if (move.flags['sound'] && targetAbility === 'soundproof') return true;
	if (move.flags['wind'] && targetAbility === 'windrider') return true;
	return false;
}

function statusMoveBlocked(move: Move, moveid: ID, sourceData: AnyObject, targetData: AnyObject | null) {
	if (!targetData) return false;
	const targetAbility = getPokemonAbilityID(targetData);
	const targetItem = getPokemonItemID(targetData);
	const ignoresAbility = sourceIgnoresTargetAbility(sourceData, move);
	const targetsPokemon = !['all', 'allySide', 'foeSide', 'self'].includes(move.target);
	if (!ignoresAbility && targetAbility === 'goodasgold' && targetsPokemon) return true;
	if (!ignoresAbility && targetAbility === 'magicbounce' && move.flags['reflectable']) return true;
	if (!ignoresAbility && targetAbility === 'mirrorarmor' && move.flags['reflectable']) return true;
	if (!ignoresAbility && ['clearbody', 'fullmetalbody', 'whitesmoke'].includes(targetAbility)) {
		const boosts = move.boosts as SparseBoostsTable | null | undefined;
		if (boosts && Object.values(boosts).some(boost => boost < 0)) return true;
	}
	if (move.status && hasStatus(targetData)) return true;
	const targetTypes = getPokemonTypes(targetData);
	if (['spore', 'sleeppowder', 'stunspore', 'poisonpowder'].includes(moveid)) {
		if (targetTypes.includes('Grass') || targetAbility === 'overcoat' || targetItem === 'safetygoggles') return true;
	}
	if (moveid === 'toxic' || moveid === 'poisongas' || move.status === 'tox' || move.status === 'psn') {
		const sourceAbility = getPokemonAbilityID(sourceData);
		if (sourceAbility !== 'corrosion' && (targetTypes.includes('Poison') || targetTypes.includes('Steel'))) return true;
	}
	if (moveid === 'willowisp' && targetTypes.includes('Fire')) return true;
	if (moveid === 'thunderwave' && (targetTypes.includes('Electric') || targetTypes.includes('Ground'))) return true;
	if ((move.status === 'brn' || move.status === 'par' || move.status === 'psn' || move.status === 'tox') &&
		targetAbility === 'purifyingsalt') {
		return true;
	}
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

function estimateBestDamageFromPokemon(sourceData: AnyObject, targetData: AnyObject | null) {
	if (!targetData) return 0;
	let bestDamage = 0;
	for (const moveid of getPokemonMoveIDs(sourceData)) {
		const move = Dex.mod('gen9rrbt').moves.get(moveid);
		if (!move.exists || move.category === 'Status') continue;
		bestDamage = Math.max(bestDamage, estimateDamage(moveid, sourceData, targetData));
	}
	return bestDamage;
}

function scoreSwitchOption(switchOption: AnyObject, targetData: AnyObject | null, state?: BTBattleState) {
	const hpData = getHPData(switchOption);
	let score = (hpData.hp / hpData.maxhp) * 25;
	if (state) {
		score += memoryScore(getMemoryKey(state, switchOption, targetData, `switch:${getSpeciesID(switchOption)}`)) * 12;
	}
	if (!targetData) return score;
	const targetHP = getHPData(targetData);
	const damageOut = estimateBestDamageFromPokemon(switchOption, targetData);
	const damageIn = estimateBestDamageFromPokemon(targetData, switchOption);
	score += Math.min(damageOut, targetHP.hp) / targetHP.maxhp * 100;
	score -= Math.min(damageIn, hpData.hp) / hpData.maxhp * 75;
	if (damageOut >= targetHP.hp) score += 40;
	if (damageIn >= hpData.hp) score -= 40;
	return score;
}

function chooseSwitch(request: AnyObject, targetData: AnyObject | null = null, state?: BTBattleState) {
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
			const score = scoreSwitchOption(switchChoice.pokemon, targetData, state);
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
	state?: BTBattleState
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
		const score = scoreSwitchOption(switchOption, targetData, state);
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
	const ability = toID(pokemonData.ability || pokemonData.baseAbility);
	if (move.type === 'Normal') {
		if (ability === 'refrigerate') return 'Ice';
		if (ability === 'pixilate') return 'Fairy';
		if (ability === 'aerilate') return 'Flying';
		if (ability === 'galvanize') return 'Electric';
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

function getWeightBasedBasePower(weightkg: number) {
	if (weightkg >= 200) return 120;
	if (weightkg >= 100) return 100;
	if (weightkg >= 50) return 80;
	if (weightkg >= 25) return 60;
	if (weightkg >= 10) return 40;
	return 20;
}

function getBoostModifier(boost: number) {
	boost = Math.max(-6, Math.min(6, boost || 0));
	return boost >= 0 ? (2 + boost) / 2 : 2 / (2 - boost);
}

function getStat(pokemonData: AnyObject, stat: StatIDExceptHP) {
	const base = pokemonData.stats?.[stat] || 1;
	return Math.max(1, Math.floor(base * getBoostModifier(pokemonData.boosts?.[stat] || 0)));
}

function estimateDamage(moveid: ID, sourceData: AnyObject, targetData: AnyObject, useZMove = false) {
	const dex = Dex.mod('gen9rrbt');
	const sourceSpecies = dex.species.get(getSpeciesName(sourceData));
	const move = dex.moves.get(moveid);
	if (!move.exists || move.category === 'Status') return 0;
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
	const ability = getPokemonAbilityID(sourceData);
	if (moveHasSelfKO(move) && (ability === 'damp' || getPokemonAbilityID(targetData) === 'damp')) return 0;
	if (ability === 'technician' && basePower <= 60) basePower = Math.floor(basePower * 1.5);
	if (['refrigerate', 'pixilate', 'aerilate', 'galvanize'].includes(ability) && move.type === 'Normal') {
		basePower = Math.floor(basePower * 1.2);
	}
	if (ability === 'sharpness' && move.flags['slicing']) basePower = Math.floor(basePower * 1.5);
	if (ability === 'megalauncher' && move.flags['pulse']) basePower = Math.floor(basePower * 1.5);
	if (ability === 'radicalaura' && type === 'Dark') basePower = Math.floor(basePower * 5448 / 4096);

	const ignoresBoneImmunity = ability === 'familialrevenge' && move.flags['bone'];
	if (type === 'Ground' && getPokemonItemID(targetData) === 'airballoon' && !ignoresBoneImmunity) return 0;
	if (!ignoresBoneImmunity && abilityBlocksDamagingMove(move, type, sourceData, targetData)) return 0;
	let typeMod = 0;
	for (const targetType of getPokemonTypes(targetData)) {
		if (!dex.getImmunity(type, targetType)) {
			if (ignoresBoneImmunity) continue;
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
	let attack = getStat(sourceData, offensiveStat);
	const defense = getStat(targetData, defensiveStat);
	const item = toID(sourceData.item);
	if (category === 'Physical') {
		if (item === 'thickclub' && ['Cubone', 'Marowak', 'Marowak-Alola'].includes(sourceSpecies.baseSpecies)) attack *= 2;
		if (item === 'choiceband') attack *= 1.5;
		if (ability === 'hustle') attack *= 1.5;
	} else if (item === 'choicespecs') {
		attack *= 1.5;
	}
	const level = getLevel(sourceData.details || '');
	let damage = Math.floor(Math.floor(Math.floor((2 * level / 5 + 2) * basePower * attack / defense) / 50) + 2);
	if (getPokemonTypes(sourceData).includes(type)) damage = Math.floor(damage * 1.5);
	damage = Math.floor(damage * typeMultiplier);
	if (item === 'lifeorb') damage = Math.floor(damage * 1.3);
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

function getAccuracyFactor(move: Move) {
	if (move.accuracy === true) return 1;
	if (typeof move.accuracy === 'number') return Math.max(0.5, move.accuracy / 100);
	return 0.9;
}

function hasStatus(pokemonData: AnyObject | null) {
	if (!pokemonData) return false;
	return !!(pokemonData.condition || '').split(' ')[1];
}

function scoreDamagingMove(
	move: Move, damage: number, pokemonData: AnyObject, targetData: AnyObject,
	state: BTBattleState, action: string
) {
	const targetHP = getHPData(targetData);
	const targetMaxHP = Math.max(1, targetHP.maxhp);
	let score = Math.min(damage, targetHP.hp) / targetMaxHP * 120;
	if (damage >= targetHP.hp) score += 90;
	if (moveHasSelfKO(move)) {
		score += damage >= targetHP.hp ? -35 : -220;
	}
	if (move.flags['contact']) {
		const contactPenalty =
			(getPokemonItemID(targetData) === 'rockyhelmet' ? 22 : 0) +
			(['roughskin', 'ironbarbs'].includes(getPokemonAbilityID(targetData)) ? 18 : 0);
		if (contactPenalty && damage < targetHP.hp) {
			const sourceHP = getHPData(pokemonData);
			score -= sourceHP.hp <= sourceHP.maxhp / 4 ? contactPenalty * 2 : contactPenalty;
		}
	}
	if (move.priority > 0) score += 10 + move.priority * 5;
	if (move.volatileStatus === 'flinch') score += 6;
	if ((move as AnyObject).selfSwitch) score += 10;
	score *= getAccuracyFactor(move);
	score += memoryScore(getMemoryKey(state, pokemonData, targetData, action)) * 15;
	return score;
}

function scoreStatusMove(
	moveid: ID, pokemonData: AnyObject, targetData: AnyObject | null,
	ownHazards: BTSideHazards, targetHazards: BTSideHazards, state: BTBattleState,
	bestDamage: number, futureMoveActive: boolean
) {
	const move = Dex.mod('gen9rrbt').moves.get(moveid);
	if (futureMoveActive && move.flags['futuremove']) return -Infinity;
	if (statusMoveBlocked(move, moveid, pokemonData, targetData)) return -Infinity;
	const activeHP = getHPData(pokemonData);
	const hpFraction = activeHP.hp / Math.max(1, activeHP.maxhp);
	const targetHP = targetData ? getHPData(targetData).hp : 1;
	const setupKey = pokemonData.ident || getSpeciesName(pokemonData);
	let score = -Infinity;

	if (moveid === 'perishsong' && getSpeciesID(pokemonData) === 'gengar') {
		score = 115;
	} else if (isSetupMove(moveid) && !state.setupUsed[setupKey] && bestDamage > 0 && bestDamage * 2 < targetHP) {
		score = 80;
	} else if (move.flags['futuremove'] && targetData && bestDamage >= 0) {
		score = 62;
	} else if (moveid === 'defog' && hasHazards(ownHazards)) {
		score = 78;
	} else if (
		['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'].includes(moveid) &&
		canUseHazard(moveid, targetHazards)
	) {
		score = 66 - targetHazards.spikes * 4;
	} else if (
		['recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'synthesis'].includes(moveid) &&
		hpFraction < 0.55
	) {
		score = 72 + (0.55 - hpFraction) * 80;
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
	score += memoryScore(getMemoryKey(state, pokemonData, targetData, `move:${moveid}`)) * 15;
	return score;
}

function chooseBestMove(
	active: AnyObject, pokemonData: AnyObject, targetData: AnyObject | null,
	ownHazards: BTSideHazards, targetHazards: BTSideHazards, state: BTBattleState,
	futureMoveActive: boolean
) {
	const moves = active.moves
		.map((move: AnyObject, moveIndex: number) => ({slot: moveIndex + 1, move}))
		.filter(({move}: {move: AnyObject}) => !move.disabled);
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
			const damage = estimateDamage(moveid, pokemonData, targetData);
			if (damage > bestDamage) bestDamage = damage;
			const action = `move:${moveid}`;
			const score = scoreDamagingMove(move, damage, pokemonData, targetData, state, action);
			if (score > bestScore) {
				bestScore = score;
				bestDamage = damage;
				bestChoice = choice;
				bestIsZ = false;
			}
			if (zMoveSlots.has(choice.slot)) {
				if (move.flags['futuremove']) continue;
				const zDamage = estimateDamage(moveid, pokemonData, targetData, true);
				const zAction = `move:${moveid}:z`;
				const targetMaxHP = Math.max(1, getHPData(targetData).maxhp);
				const zUpgrade = Math.min(80, Math.max(0, zDamage - damage) / targetMaxHP * 80);
				const zScore = scoreDamagingMove(move, zDamage, pokemonData, targetData, state, zAction) + zUpgrade + (
					zDamage >= targetHP && damage < targetHP ? 55 : 0
				);
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
			moveid, pokemonData, targetData, ownHazards, targetHazards, state, bestDamage, futureMoveActive
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
	if (active.canMegaEvo) moveChoice += ' mega';
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
	const targetData = getTargetPokemonData(room, ownSideid);
	const futureMoveActive = hasFutureMoveOnTargetSlot(room, foeSideid, targetData);
	const pokemon = request.side.pokemon;
	const switchChoices: number[] = [];
	const choices = request.active.map((active: AnyObject, index: number) => {
		const pokemonData = getActivePokemonData(request, index) || pokemon[index];
		if (!pokemonData || pokemonData.condition.endsWith(' fnt') || pokemonData.commanding) return 'pass';
		if (!active.trapped && state.perish[ownSideid] === 1) {
			const switchSlot = chooseBestSwitchSlot(request, request.active.length, switchChoices, targetData, state);
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
			const bestDamage = estimateBestDamageFromPokemon(pokemonData, targetData);
			const targetThreat = estimateBestDamageFromPokemon(targetData, pokemonData);
			const switchSlot = chooseBestSwitchSlot(request, request.active.length, switchChoices, targetData, state);
			const switchOption = switchSlot ? request.side.pokemon[switchSlot - 1] : null;
			const switchDamage = switchOption ? estimateBestDamageFromPokemon(switchOption, targetData) : 0;
			if (switchSlot && (
				(bestDamage <= 0 && switchDamage > 0) ||
				(targetThreat >= activeHP.hp && bestDamage < targetHP.hp && switchDamage > bestDamage)
			)) {
				switchChoices.push(switchSlot);
				rememberDecision(state, switchOption, targetData, `switch:${getSpeciesID(switchOption)}`);
				return `switch ${switchSlot}`;
			}
		}
		return chooseBestMove(
			active, pokemonData, targetData,
			state.hazards[ownSideid], state.hazards[foeSideid], state, futureMoveActive
		);
	});
	return choices.join(', ');
}

function chooseBotRequest(request: AnyObject, room: GameRoom, state: BTBattleState) {
	if (request.wait) return '';
	if (request.forceSwitch) {
		const targetData = getTargetPokemonData(room, request.side.id);
		return chooseSwitch(request, targetData, state);
	}
	if (request.active) return chooseMove(request, room, state);
	return chooseTeamPreview(request, state);
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
	syncBattleState(room, state);
	const bot = battle.p2;
	if (bot.request.isWait !== false || !bot.request.request) return;
	let request: AnyObject;
	try {
		request = JSON.parse(bot.request.request);
	} catch {
		return;
	}
	const choice = chooseBotRequest(request, room, state);
	if (!choice) return;
	const rqid = bot.request.rqid;
	bot.request.isWait = true;
	bot.request.choice = choice;
	void battle.stream.write(`>p2 ${choice}`).then(() => {
		if (battle.ended || bot.request.rqid !== rqid || bot.request.choice !== choice) return;
		if ((battle.p2.choice as AnyObject).error || !battle.p2.isChoiceDone()) {
			bot.request.isWait = false;
			bot.request.choice = '';
		}
	});
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
		stallMoveCounters: {},
		pendingStallMoves: {},
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
			const cleared = getCleared(user.id);
			if (!levels.length) return this.sendReplyBox(`No Battle Tower levels are configured.`);
			const rows = levels.map((level, index) => {
				const levelNumber = index + 1;
				const status = index < cleared ? 'Cleared' : index === cleared ? 'Next' : 'Locked';
				const label = level.boss ?
					getBTLevelLabel(level, index, true) :
					`${levelNumber}. ${getBTLevelLabel(level, index)}`;
				return `${label} - ${status}`;
			});
			return this.sendReplyBox(`<strong>Battle Tower Levels</strong><br />${rows.join('<br />')}`);
		}
		if (cmd === 'format' || cmd === 'team' || cmd === 'teambuilder') {
			return this.sendReplyBox(
				`Make a team with the <strong>${FORMAT_NAME}</strong> teambuilder format, ` +
				`then use <code>/battletower</code> to open the Battle Tower team selector. ` +
				`Battle Tower Mode is not challengeable or laddered.`
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
			`Choose a ${FORMAT_NAME} team in the challenge popup to start Battle Tower ` +
			`${getBTLevelLabel(levels[levelIndex], levelIndex)}.`
		);
	},
	async btaccept(target, room, user, connection) {
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
	btcancel() {
		clearBTChallenge(this.user.id);
		this.sendReply(`Battle Tower request cancelled.`);
	},
	battletowercancel: 'btcancel',
	bthelp: 'battletowerhelp',
	battletowerhelp: [
		`/battletower - Opens the Battle Tower Mode team selector for your next Battle Tower level.`,
		`/battletower [level] - Opens the Battle Tower Mode team selector to replay an unlocked Battle Tower level.`,
		`/battletower team - Explains which teambuilder format to select.`,
		`/battletower medals [user] - Shows Battle Tower boss medals for a user.`,
		`/battletower levels - Shows Battle Tower levels and locks.`,
		`/battletower progress - Shows your current Battle Tower progress.`,
		`/battletower reset - Resets your own Battle Tower progress.`,
		`/battletower reset [user], [level] - Sets a user's next Battle Tower level. Requires: global administrator`,
		`/battletower setlevel [user], [level] - Sets a user's next Battle Tower level. Requires: global administrator`,
		`/battletower complete [user], [level|all] - Marks a user's Battle Tower progress complete through a level. Requires: global administrator`,
		`/battletower reload - Reloads Battle Tower levels from the optional config override. Requires: console permission`,
	],
};

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner) {
		const state = btBattles.get(battle.roomid);
		if (!state) return;
		clearInterval(state.timer);
		btBattles.delete(battle.roomid);
		const level = levels[state.level];
		if (!level) return;
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
