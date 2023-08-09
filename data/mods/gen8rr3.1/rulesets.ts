export const Rulesets: {[k: string]: ModdedFormatData} = {
	arceusformeclause: {
		name: "Arceus Forme Clause",
		effectType: "ValidatorRule",
		desc: "Allows Arceus plates to be used in battle.",
		unbanlist: ['Flame Plate', 'Splash Plate', 'Zap Plate', 'Meadow Plate', 'Icicle Plate', 'Fist Plate', 'Toxic Plate', 'Earth Plate', 'Sky Plate', 'Mind Plate', 'Insect Plate', 'Stone Plate', 'Spooky Plate', 'Draco Plate', 'Dread Plate', 'Iron Plate', 'Pixie Plate'],
	},
	'2abilityclause': {
		inherit: true,
		onValidateTeam(team) {
			const abilityTable = new Map<string, number>();
			const base: {[k: string]: string} = {
				airlock: 'cloudnine',
				battlearmor: 'shellarmor',
				bullrush: 'quillrush',
				clearbody: 'whitesmoke',
				dazzling: 'queenlymajesty',
				filter: 'solidrock',
				gooey: 'tanglinghair',
				insomnia: 'vitalspirit',
				ironbarbs: 'roughskin',
				libero: 'protean',
				minus: 'plus',
				moxie: 'chillingneigh',
				multiscale: 'blubberdefense',
				powerofalchemy: 'receiver',
				propellertail: 'stalwart',
				teravolt: 'moldbreaker',
				turboblaze: 'moldbreaker',
				waterbubble: 'cashsplash',
			};
			for (const set of team) {
				let ability = this.toID(set.ability);
				if (!ability) continue;
				if (ability in base) ability = base[ability] as ID;
				if ((abilityTable.get(ability) || 0) >= 2) {
					return [
						`You are limited to two of each ability by 2 Ability Clause.`,
						`(You have more than two ${this.dex.abilities.get(ability).name} variants)`,
					];
				}
				abilityTable.set(ability, (abilityTable.get(ability) || 0) + 1);
			}
		},
	},
};
