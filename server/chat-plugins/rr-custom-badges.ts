import {FS, Utils} from '../../lib';

const BADGE_FILE = 'config/chat-plugins/rr-custom-badges.json';
const BADGE_FORMAT = 'rrcustom';
const MAX_DISPLAYED_BADGES = 3;

export const RR_BADGES = {
	rrgt: {name: "RRGT Champion"},
	rrgt2: {name: "RRGT II Champion"},
	rrgt3: {name: "RRGT III Champion"},
	rrgt4: {name: "RRGT IV Champion"},
	rrgt5: {name: "RRGT V Champion"},
	rrgt6: {name: "RRGT VI Champion"},
	rrsp: {name: "RR Summer Preview Champion"},
	rrsp2: {name: "RR Summer Preview II Champion"},
	rrbh: {name: "RR Balanced Hackmons Champion"},
	rrwl: {name: "RR Winter League Champion"},
	rram: {name: "RR August Madness Champion"},
	rrc: {name: "RR Championship Champion"},
	rrdlcommissioner: {name: "RRDL Commissioner Badge"},
	council: {name: "Council Badge"},
	clementino: {name: "Clementino Badge"},
	marowakboss: {name: "Marowak-Alola Boss Badge"},
	houndoomboss: {name: "Mega Houndoom Boss Badge"},
	dhelmise1: {name: "Dhelmise Season I Champion"},
	dhelmise2: {name: "Dhelmise Season II Champion"},
	dhelmise3: {name: "Dhelmise Season III Champion"},
	dhelmise4: {name: "Dhelmise Season IV Champion"},
	mantine2: {name: "Mantine Season II Champion"},
	mantine3: {name: "Mantine Season III Champion"},
	mantine4: {name: "Mantine Season IV Champion"},
	wishiwashi2: {name: "Wishiwashi Season II Champion"},
	wishiwashi3: {name: "Wishiwashi Season III Champion"},
	wishiwashi4: {name: "Wishiwashi Season IV Champion"},
	feebas3: {name: "Feebas Season III Champion"},
	feebas4: {name: "Feebas Season IV Champion"},
} as const;

export type RRBadgeID = keyof typeof RR_BADGES;

interface RRBadgeEntry {
	owned: RRBadgeID[];
	display: RRBadgeID[];
	hidden?: boolean;
}

interface RRBadgeStore {
	[userid: string]: RRBadgeEntry;
}

const BADGE_ALIASES: {[k: string]: RRBadgeID} = {
	rrgt1: 'rrgt',
	rrgti: 'rrgt',
	rrgtii: 'rrgt2',
	rrgtiii: 'rrgt3',
	rrgtiv: 'rrgt4',
	rrgtv: 'rrgt5',
	rrgtvi: 'rrgt6',
	rrsp1: 'rrsp',
	rrspi: 'rrsp',
	rrsummerpreview: 'rrsp',
	rrsummerpreview1: 'rrsp',
	rrsummerpreviewi: 'rrsp',
	rrsummerpreview2: 'rrsp2',
	rrsummerpreviewii: 'rrsp2',
	rrspii: 'rrsp2',
	rrbalancedhackmons: 'rrbh',
	balancedhackmons: 'rrbh',
	rrwinterleague: 'rrwl',
	winterleague: 'rrwl',
	rraugustmadness: 'rram',
	augustmadness: 'rram',
	rrchampionship: 'rrc',
	championship: 'rrc',
	rrdl: 'rrdlcommissioner',
	rrdlcommissionerbadge: 'rrdlcommissioner',
	commissioner: 'rrdlcommissioner',
	commissionerbadge: 'rrdlcommissioner',
	councilbadge: 'council',
	rrcouncil: 'council',
	clementinobadge: 'clementino',
	melmetal: 'clementino',
	alolanmarowak: 'marowakboss',
	alolanmarowakboss: 'marowakboss',
	marowak: 'marowakboss',
	marowakalola: 'marowakboss',
	marowakalolaboss: 'marowakboss',
	marowakbossbadge: 'marowakboss',
	rrbtmarowak: 'marowakboss',
	houndoom: 'houndoomboss',
	houndoombossbadge: 'houndoomboss',
	megahoundoom: 'houndoomboss',
	megahoundoomboss: 'houndoomboss',
	radicalred: 'houndoomboss',
	radicalredboss: 'houndoomboss',
	radicalredbadge: 'houndoomboss',
	rrbthoundoom: 'houndoomboss',
	dhelmiseseason1: 'dhelmise1',
	dhelmiseseasoni: 'dhelmise1',
	dhelmiseseason2: 'dhelmise2',
	dhelmiseseasonii: 'dhelmise2',
	dhelmiseseason3: 'dhelmise3',
	dhelmiseseasoniii: 'dhelmise3',
	dhelmiseseason4: 'dhelmise4',
	dhelmiseseasoniv: 'dhelmise4',
	mantineseason2: 'mantine2',
	mantineseasonii: 'mantine2',
	mantineseason3: 'mantine3',
	mantineseasoniii: 'mantine3',
	mantineseason4: 'mantine4',
	mantineseasoniv: 'mantine4',
	wishiwashiseason2: 'wishiwashi2',
	wishiwashiseasonii: 'wishiwashi2',
	wishiwashiseason3: 'wishiwashi3',
	wishiwashiseasoniii: 'wishiwashi3',
	wishiwashiseason4: 'wishiwashi4',
	wishiwashiseasoniv: 'wishiwashi4',
	feebasseason3: 'feebas3',
	feebasseasoniii: 'feebas3',
	feebasseason4: 'feebas4',
	feebasseasoniv: 'feebas4',
};

let rrBadgeStore: RRBadgeStore = loadRRBadgeStore();

function isRRBadgeID(badge: string): badge is RRBadgeID {
	return badge in RR_BADGES;
}

function normalizeBadgeEntry(entry: Partial<RRBadgeEntry> | null | undefined): RRBadgeEntry {
	const owned = new Set<RRBadgeID>();
	for (const badge of entry?.owned || []) {
		if (isRRBadgeID(badge)) owned.add(badge);
	}
	const display: RRBadgeID[] = [];
	for (const badge of entry?.display || []) {
		if (owned.has(badge) && !display.includes(badge) && display.length < MAX_DISPLAYED_BADGES) {
			display.push(badge);
		}
	}
	const hidden = !!entry?.hidden;
	return {owned: [...owned], display, hidden};
}

function loadRRBadgeStore() {
	try {
		const parsed = JSON.parse(FS(BADGE_FILE).readIfExistsSync() || "{}");
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
		const result: RRBadgeStore = {};
		for (const [userid, entry] of Object.entries(parsed)) {
			const normalized = normalizeBadgeEntry(entry as Partial<RRBadgeEntry>);
			if (normalized.owned.length) result[toID(userid)] = normalized;
		}
		return result;
	} catch (e: any) {
		Monitor.warn(`Could not load ${BADGE_FILE}: ${e.message}`);
		return {};
	}
}

function saveRRBadgeStore() {
	FS(BADGE_FILE).writeUpdate(() => JSON.stringify(rrBadgeStore, null, 2));
}

function getRRBadgeEntry(userid: ID) {
	return rrBadgeStore[userid] || {owned: [], display: []};
}

function setRRBadgeEntry(userid: ID, entry: RRBadgeEntry) {
	const normalized = normalizeBadgeEntry(entry);
	if (!normalized.owned.length) {
		delete rrBadgeStore[userid];
	} else {
		rrBadgeStore[userid] = normalized;
	}
	saveRRBadgeStore();
}

function resolveRRBadge(text: string) {
	let id = toID(text);
	if (id.endsWith('champion')) id = id.slice(0, -'champion'.length);
	if (isRRBadgeID(id)) return id;
	return BADGE_ALIASES[id] || null;
}

function parseBadgeList(text: string) {
	const parts = text.split(',').map(part => part.trim()).filter(Boolean);
	if (!parts.length) return [];
	const badges: RRBadgeID[] = [];
	for (const part of parts) {
		const badge = resolveRRBadge(part);
		if (!badge) throw new Chat.ErrorMessage(`Unknown RR badge "${part}". Use /rrbadges available to see valid badges.`);
		if (!badges.includes(badge)) badges.push(badge);
	}
	return badges;
}

function parseUserAndBadges(target: string) {
	const parts = target.split(',').map(part => part.trim()).filter(Boolean);
	if (parts.length < 2) {
		throw new Chat.ErrorMessage(`Usage: /rrbadges give [user], [badge]`);
	}
	const targetID = toID(parts.shift()!);
	if (!targetID) throw new Chat.ErrorMessage(`User not found.`);
	const badges = parseBadgeList(parts.join(','));
	if (!badges.length) throw new Chat.ErrorMessage(`Badge not found.`);
	return {targetID, badges};
}

function getDisplayedRRBadges(userid: ID) {
	const entry = getRRBadgeEntry(userid);
	if (entry.hidden) return [];
	if (entry.display.length) return entry.display.filter(badge => entry.owned.includes(badge)).slice(0, MAX_DISPLAYED_BADGES);
	return entry.owned.slice(0, MAX_DISPLAYED_BADGES);
}

export function grantRRBadge(userid: ID, badge: RRBadgeID) {
	const targetID = toID(userid);
	if (!targetID) return false;
	const entry = getRRBadgeEntry(targetID);
	if (entry.owned.includes(badge)) return false;
	const owned = [...entry.owned, badge];
	const display = entry.display.slice();
	if (!entry.hidden && display.length && display.length < MAX_DISPLAYED_BADGES && !display.includes(badge)) display.push(badge);
	setRRBadgeEntry(targetID, {owned, display, hidden: entry.hidden});
	return true;
}

function badgeHTML(badge: RRBadgeID) {
	return `<code>${badge}</code> - ${Utils.escapeHTML(RR_BADGES[badge].name)}`;
}

function badgeListHTML(badges: RRBadgeID[]) {
	if (!badges.length) return `None.`;
	return badges.map(badgeHTML).join('<br />');
}

export const commands: Chat.ChatCommands = {
	rrbadge: 'rrbadges',
	rrbadges(target, room, user) {
		target = target.trim();
		const [cmdTarget = ""] = target.split(' ');
		const cmd = toID(cmdTarget);
		const cmdArgs = target.slice(cmdTarget.length).trim();

		if (!cmd || cmd === 'list' || cmd === 'owned') {
			const targetID = toID(cmdArgs) || user.id;
			const entry = getRRBadgeEntry(targetID);
			return this.sendReplyBox(
				`<strong>RR Badges for ${Utils.escapeHTML(Users.get(targetID)?.name || targetID)}</strong><br />` +
				`<em>Displayed</em><br />${badgeListHTML(getDisplayedRRBadges(targetID))}<br /><br />` +
				`<em>Owned</em><br />${badgeListHTML(entry.owned)}`
			);
		}
		if (cmd === 'available' || cmd === 'all') {
			return this.sendReplyBox(
				`<strong>Available RR Badges</strong><br />${badgeListHTML(Object.keys(RR_BADGES) as RRBadgeID[])}`
			);
		}
		if (cmd === 'give' || cmd === 'grant' || cmd === 'add') {
			this.checkCan('bypassall');
			const {targetID, badges} = parseUserAndBadges(cmdArgs);
			const entry = getRRBadgeEntry(targetID);
			const owned = new Set(entry.owned);
			for (const badge of badges) owned.add(badge);
			const display = entry.display.filter(badge => owned.has(badge));
			for (const badge of badges) {
				if (!entry.hidden && display.length < MAX_DISPLAYED_BADGES && !display.includes(badge)) display.push(badge);
			}
			setRRBadgeEntry(targetID, {owned: [...owned], display, hidden: entry.hidden});
			return this.sendReply(`Gave ${badges.map(badge => RR_BADGES[badge].name).join(', ')} to ${targetID}.`);
		}
		if (cmd === 'remove' || cmd === 'revoke' || cmd === 'delete') {
			this.checkCan('bypassall');
			const {targetID, badges} = parseUserAndBadges(cmdArgs);
			const entry = getRRBadgeEntry(targetID);
			const remove = new Set(badges);
			setRRBadgeEntry(targetID, {
				owned: entry.owned.filter(badge => !remove.has(badge)),
				display: entry.display.filter(badge => !remove.has(badge)),
				hidden: entry.hidden,
			});
			return this.sendReply(`Removed ${badges.map(badge => RR_BADGES[badge].name).join(', ')} from ${targetID}.`);
		}
		if (cmd === 'display' || cmd === 'show' || cmd === 'order' || cmd === 'set') {
			const entry = getRRBadgeEntry(user.id);
			if (!cmdArgs) {
				return this.sendReplyBox(
					`<strong>Your displayed RR Badges</strong><br />${badgeListHTML(getDisplayedRRBadges(user.id))}`
				);
			}
			if (['clear', 'none', 'hide', 'off'].includes(toID(cmdArgs))) {
				setRRBadgeEntry(user.id, {owned: entry.owned, display: [], hidden: true});
				return this.sendReply(`Your RR badge display was hidden.`);
			}
			if (['auto', 'default', 'reset'].includes(toID(cmdArgs))) {
				setRRBadgeEntry(user.id, {owned: entry.owned, display: [], hidden: false});
				return this.sendReply(`Your RR badge display was reset to your first ${MAX_DISPLAYED_BADGES} owned badges.`);
			}
			const [displayCmdTarget = ""] = cmdArgs.split(' ');
			const displayCmd = toID(displayCmdTarget);
			if (displayCmd === 'remove' || displayCmd === 'delete' || displayCmd === 'hide') {
				const badges = parseBadgeList(cmdArgs.slice(displayCmdTarget.length).trim());
				const remove = new Set(badges);
				const display = getDisplayedRRBadges(user.id).filter(badge => !remove.has(badge));
				setRRBadgeEntry(user.id, {owned: entry.owned, display, hidden: !display.length});
				return this.sendReply(`Your RR badge display was updated.`);
			}
			const badges = parseBadgeList(cmdArgs);
			if (badges.length > MAX_DISPLAYED_BADGES) {
				throw new Chat.ErrorMessage(`You can only display ${MAX_DISPLAYED_BADGES} RR badges at a time.`);
			}
			const missing = badges.filter(badge => !entry.owned.includes(badge));
			if (missing.length) {
				throw new Chat.ErrorMessage(`You do not own: ${missing.map(badge => RR_BADGES[badge].name).join(', ')}.`);
			}
			setRRBadgeEntry(user.id, {owned: entry.owned, display: badges, hidden: false});
			return this.sendReply(`Your RR badge display was updated.`);
		}
		return this.parse('/help rrbadges');
	},
	rrbadgeshelp: [
		`/rrbadges - Shows your owned and displayed RR badges.`,
		`/rrbadges [user] - Shows another user's RR badges.`,
		`/rrbadges available - Lists all RR badge IDs.`,
		`/rrbadges display [badge], [badge], [badge] - Chooses up to 3 of your RR badges to show in battles.`,
		`/rrbadges display remove [badge] - Removes a badge from your current battle display without revoking it.`,
		`/rrbadges display none - Shows no RR badges in battles.`,
		`/rrbadges display auto - Shows your first 3 owned badges in battles.`,
		`/rrbadges give [user], [badge] - Gives a badge. Requires: global administrator.`,
		`/rrbadges remove [user], [badge] - Removes a badge. Requires: global administrator.`,
	],
};

export const handlers: Chat.Handlers = {
	onBattleStart(user, room) {
		if (!room.battle) return;
		const badges = getDisplayedRRBadges(user.id);
		if (!badges.length) return;
		const slot = room.battle.playerTable[user.id]?.slot;
		if (!slot) return;
		for (const badge of badges.slice(0, MAX_DISPLAYED_BADGES)) {
			room.add(`|badge|${slot}|custom|${BADGE_FORMAT}|${badge}`);
		}
		room.update();
	},
};
