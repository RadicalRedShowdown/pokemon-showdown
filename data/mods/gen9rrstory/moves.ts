export const Moves: {[k: string]: ModdedMoveData} = {
	bouncybubble: {
		inherit: true,
		basePower: 90,
		pp: 5,
		flags: {protect: 1, mirror: 1, heal: 1},
		onPrepareHit(target, source) {
			if (source.species.id === 'softandwet') {
				this.add('c', source.name, 'ORA ORA ORA!');
			}
		},
		isNonstandard: null,
	},
	bubbleblast: {
		num: -135,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Bubble Blast",
		pp: 20,
		priority: 0,
		flags: {protect: 1, mirror: 1, bullet: 1},
		onPrepareHit(target, source) {
			if (source.species.id === 'softandwet') {
				this.add('c', source.name, 'ORA ORA ORA!');
			}
		},
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id) return this.chainModify(1.5);
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Bubble Blast', '[of] ' + source);
					this.add('-message', `${source.name} blasted off ${target.name}'s item!`);
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Water",
		desc: "Deals more damage if the target is holding an item, then removes that item.",
		shortDesc: "Special Knock Off. Blocked by Bulletproof.",
		gen: 9,
	},
};
