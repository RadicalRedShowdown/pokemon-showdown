import {FS, Utils} from '../../lib';
import {TeamValidatorAsync} from '../team-validator-async';

const FORMAT_ID = 'gen9rrstory';
const BOT_NAME = 'RR Story Bot';
// Optional override. If this file exists, it replaces DEFAULT_LEVELS below.
const LEVELS_FILE = 'config/chat-plugins/rr-story-levels.json';
const PROGRESS_FILE = 'config/chat-plugins/rr-story-progress.json';

interface StoryLevel {
	name: string;
	team: string;
}

interface StoryBattleState {
	userid: ID;
	level: number;
	timer: NodeJS.Timer;
}

const DEFAULT_LEVELS: StoryLevel[] = [
	{
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
	},
	{
		name: "Marowak-Alola-Boss",
		team: `
Marowak-Alola-Boss (Marowak-Alola-Boss) @ Thick Club
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
Tera Type: Ghost
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
IVs: 0 Atk
- Perish Song
`,
	},
];

let levels = loadLevels();
const progress: {[userid: string]: number} = loadProgress();
const storyBattles = new Map<RoomID, StoryBattleState>();

function loadLevels() {
	const data = FS(LEVELS_FILE).readIfExistsSync();
	if (!data) return DEFAULT_LEVELS.slice();
	try {
		const parsed = JSON.parse(data);
		if (!Array.isArray(parsed)) throw new Error(`Expected an array`);
		const loaded = parsed.filter(level => (
			level && typeof level.name === 'string' && typeof level.team === 'string'
		));
		return loaded as StoryLevel[];
	} catch (e: any) {
		Monitor.warn(`Could not load ${LEVELS_FILE}: ${e.message}`);
		return DEFAULT_LEVELS.slice();
	}
}

function loadProgress() {
	try {
		const parsed = JSON.parse(FS(PROGRESS_FILE).readIfExistsSync() || "{}");
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

function getCleared(userid: ID) {
	return progress[userid] || 0;
}

function getCurrentStoryBattle(userid: ID) {
	for (const [roomid, state] of storyBattles) {
		const room = Rooms.get(roomid);
		if (!room?.battle || room.battle.ended) continue;
		if (state.userid === userid) return room;
	}
	return null;
}

function packStoryTeam(level: StoryLevel) {
	const importedTeam = Teams.import(level.team);
	if (!importedTeam) throw new Chat.ErrorMessage(`Story level "${level.name}" does not have a valid team.`);
	return Teams.pack(importedTeam);
}

async function validatePackedTeam(team: string, user?: ID) {
	const result = await TeamValidatorAsync.get(FORMAT_ID).validateTeam(team, user ? {user} : undefined);
	if (result.charAt(0) !== '1') throw new Chat.ErrorMessage(result.slice(1));
	return result.slice(1);
}

function chooseRandom<T>(choices: T[]) {
	return choices[Math.floor(Math.random() * choices.length)];
}

function chooseTeamPreview() {
	return 'default';
}

function chooseSwitch(request: AnyObject) {
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
		const slot = chooseRandom(switches).slot;
		chosen.push(slot);
		return `switch ${slot}`;
	});
	return choices.join(', ');
}

function chooseMove(request: AnyObject) {
	const pokemon = request.side.pokemon;
	const choices = request.active.map((active: AnyObject, index: number) => {
		const pokemonData = pokemon[index];
		if (!pokemonData || pokemonData.condition.endsWith(' fnt') || pokemonData.commanding) return 'pass';
		const moves = active.moves
			.map((move: AnyObject, moveIndex: number) => ({slot: moveIndex + 1, move}))
			.filter(({move}: {move: AnyObject}) => !move.disabled);
		if (!moves.length) return 'pass';
		return `move ${chooseRandom(moves).slot}`;
	});
	return choices.join(', ');
}

function chooseBotRequest(request: AnyObject) {
	if (request.wait) return '';
	if (request.forceSwitch) return chooseSwitch(request);
	if (request.active) return chooseMove(request);
	return chooseTeamPreview();
}

function advanceBot(room: GameRoom) {
	const battle = room.battle;
	if (!battle || battle.ended) {
		const state = storyBattles.get(room.roomid);
		if (state) clearInterval(state.timer);
		storyBattles.delete(room.roomid);
		return;
	}
	const bot = battle.p2;
	if (bot.request.isWait !== false || !bot.request.request) return;
	let request: AnyObject;
	try {
		request = JSON.parse(bot.request.request);
	} catch {
		return;
	}
	const choice = chooseBotRequest(request);
	if (!choice) return;
	bot.request.isWait = true;
	bot.request.choice = choice;
	void battle.stream.write(`>p2 ${choice}`);
}

function attachBot(room: GameRoom, botTeam: string, userid: ID, level: number) {
	const battle = room.battle;
	if (!battle) throw new Chat.ErrorMessage(`Story battle could not be created.`);
	battle.p2.name = BOT_NAME;
	battle.p2.active = true;
	battle.p2.knownActive = true;
	battle.p2.hasTeam = true;
	battle.room.title = `${battle.p1.name} vs. ${BOT_NAME}`;
	battle.room.send(`|title|${battle.room.title}`);
	void battle.stream.write(`>player p2 ${JSON.stringify({name: BOT_NAME, team: botTeam})}`);
	battle.started = true;
	Rooms.global.onCreateBattleRoom([Users.get(userid)!], room, {rated: 0});
	battle.checkActive();
	const timer = setInterval(() => advanceBot(room), 500);
	storyBattles.set(room.roomid, {userid, level, timer});
}

async function startStoryBattle(
	context: Chat.CommandContext, user: User, levelIndex: number, replay: boolean
) {
	const level = levels[levelIndex];
	const playerTeam = await validatePackedTeam(user.battleSettings.team, user.id);
	const botTeam = packStoryTeam(level);
	const battleRoom = Rooms.createBattle({
		format: FORMAT_ID,
		players: [{
			user,
			team: playerTeam,
			hidden: user.battleSettings.hidden,
			inviteOnly: user.battleSettings.inviteOnly,
		}],
		delayedStart: true,
		rated: 0,
	});
	if (!battleRoom) return;
	attachBot(battleRoom, botTeam, user.id, levelIndex);
	battleRoom.add(
		`|-message|Story Level ${levelIndex + 1}: ${level.name}${replay ? ' (replay)' : ''}`
	).update();
	context.sendReply(`Starting Story Level ${levelIndex + 1}: ${level.name}.`);
}

export const commands: Chat.ChatCommands = {
	rrstory: 'story',
	async story(target, room, user) {
		target = target.trim();
		const cmd = toID(target);
		if (cmd === 'help') return this.parse('/help story');
		if (cmd === 'progress' || cmd === 'status') {
			const cleared = getCleared(user.id);
			const next = levels[cleared];
			if (!levels.length || !next) {
				return this.sendReply(`You've done all available levels.`);
			}
			return this.sendReply(`Story progress: ${cleared} cleared. Next: Level ${cleared + 1}: ${next.name}.`);
		}
		if (cmd === 'levels' || cmd === 'list') {
			this.runBroadcast();
			const cleared = getCleared(user.id);
			if (!levels.length) return this.sendReplyBox(`No Story levels are configured.`);
			const rows = levels.map((level, index) => {
				const levelNumber = index + 1;
				const status = index < cleared ? 'Cleared' : index === cleared ? 'Next' : 'Locked';
				return `${levelNumber}. ${Utils.escapeHTML(level.name)} - ${status}`;
			});
			return this.sendReplyBox(`<strong>Story Levels</strong><br />${rows.join('<br />')}`);
		}
		if (cmd === 'reset') {
			delete progress[user.id];
			saveProgress();
			return this.sendReply(`Story progress reset.`);
		}
		if (cmd === 'reload') {
			this.checkCan('hotpatch');
			levels = loadLevels();
			return this.sendReply(`Reloaded ${levels.length} Story level${levels.length === 1 ? '' : 's'}.`);
		}

		const activeBattle = getCurrentStoryBattle(user.id);
		if (activeBattle) {
			return this.errorReply(`You already have an active Story battle: ${activeBattle.title}`);
		}

		const cleared = getCleared(user.id);
		const levelIndex = target ? parseInt(target) - 1 : cleared;
		if (isNaN(levelIndex) || levelIndex < 0) return this.parse('/help story');
		if (!levels.length || levelIndex >= levels.length) {
			return this.sendReply(`You've done all available levels.`);
		}
		if (levelIndex > cleared) {
			return this.errorReply(
				`You have not unlocked Level ${levelIndex + 1} yet. Your next level is Level ${cleared + 1}.`
			);
		}
		const replay = levelIndex < cleared;
		await startStoryBattle(this, user, levelIndex, replay);
	},
	storyhelp: [
		`/story - Starts your next Story level.`,
		`/story [level] - Replays an unlocked Story level.`,
		`/story levels - Shows Story levels and locks.`,
		`/story progress - Shows your current Story progress.`,
		`/story reset - Resets your own Story progress.`,
		`/story reload - Reloads story levels from the optional config override. Requires: hotpatch permission`,
	],
};

export const handlers: Chat.Handlers = {
	onBattleEnd(battle, winner) {
		const state = storyBattles.get(battle.roomid);
		if (!state) return;
		clearInterval(state.timer);
		storyBattles.delete(battle.roomid);
		const level = levels[state.level];
		if (!level) return;
		if (winner !== state.userid) {
			battle.room.add(`|-message|Story Level ${state.level + 1} was not cleared.`).update();
			return;
		}
		const cleared = getCleared(state.userid);
		if (state.level === cleared) {
			progress[state.userid] = cleared + 1;
			saveProgress();
			const next = levels[cleared + 1];
			if (next) {
				battle.room.add(
					`|-message|Story Level ${state.level + 1} cleared. Level ${cleared + 2}: ${next.name} unlocked.`
				).update();
			} else {
				battle.room.add(`|-message|Story Level ${state.level + 1} cleared. You've done all available levels.`).update();
			}
		} else {
			battle.room.add(`|-message|Story Level ${state.level + 1} replay cleared. Progress unchanged.`).update();
		}
	},
};
