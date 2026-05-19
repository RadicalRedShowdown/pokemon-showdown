import {MoveCounter, RandomGen8Teams, TeamData} from '../gen8/random-teams';
import {PRNG, PRNGSeed} from '../../../sim/prng';
import {Utils} from '../../../lib';
import {Dex, toID} from '../../../sim/dex';

// Moves that restore HP:
const RecoveryMove = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
];
// Moves that drop stats:
const ContraryMoves = [
	'closecombat', 'leafstorm', 'overheat', 'dracometeor', 'superpower', 'vcreate', 'psychoboost',
];
// Moves that boost Attack:
const PhysicalSetup = [
	'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'poweruppunch', 'swordsdance',
];
// Moves which boost Special Attack:
const SpecialSetup = [
	'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow',
];
// Moves that boost Attack AND Special Attack:
const MixedSetup = [
	'clangoroussoul', 'growth', 'happyhour', 'holdhands', 'noretreat', 'shellsmash', 'workup',
];
// Some moves that only boost Speed:
const SpeedSetup = [
	'agility', 'autotomize', 'flamecharge', 'rockpolish',
];
// Moves that shouldn't be the only STAB moves:
const NoStab = [
	'accelerock', 'aquajet', 'beakblast', 'bounce', 'breakingswipe', 'chatter', 'clearsmog', 'dragontail', 'eruption', 'explosion',
	'fakeout', 'firstimpression', 'flamecharge', 'flipturn', 'iceshard', 'icywind', 'incinerate', 'machpunch',
	'meteorbeam', 'pluck', 'pursuit', 'quickattack', 'reversal', 'selfdestruct', 'skydrop', 'snarl', 'suckerpunch', 'uturn', 'watershuriken',
	'vacuumwave', 'voltswitch', 'waterspout',
];
// Hazard-setting moves
const Hazards = [
	'spikes', 'stealthrock', 'stickyweb', 'toxicspikes',
];

export class RandomRadicalRedTeams extends RandomGen8Teams {
	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		super(format, prng);

		this.moveEnforcementCheckers = {
			screens: (movePool, moves, abilities, types, counter, species, teamDetails) => {
				if (teamDetails.screens) return false;
				return (
					(moves.has('lightscreen') && movePool.includes('reflect')) ||
					(moves.has('reflect') && movePool.includes('lightscreen'))
				);
			},
			recovery: (movePool, moves, abilities, types, counter, species, teamDetails) => (
				!!counter.get('Status') &&
				!counter.setupType &&
				['morningsun', 'recover', 'roost', 'slackoff', 'softboiled'].some(moveid => movePool.includes(moveid)) &&
				['healingwish', 'switcheroo', 'trick', 'trickroom'].every(moveid => !moves.has(moveid))
			),
			misc: (movePool, moves, abilities, types, counter, species, teamDetails) => {
				if (movePool.includes('milkdrink') || movePool.includes('quiverdance')) return true;
				return movePool.includes('stickyweb') && !counter.setupType && !teamDetails.stickyWeb;
			},
			lead: (movePool, moves, abilities, types, counter) => (
				movePool.includes('stealthrock') &&
				!!counter.get('Status') &&
				!counter.setupType &&
				!counter.get('speedsetup') &&
				!moves.has('substitute')
			),
			leechseed: (movePool, moves) => (
				!moves.has('calmmind') &&
				['protect', 'substitute', 'spikyshield'].some(m => movePool.includes(m))
			),
			Bug: (movePool) => movePool.includes('megahorn') || movePool.includes('pinmissile'),
			Dark: (movePool, moves, abilities, types, counter) => (
				!counter.get('Dark') ||
				movePool.includes('wickedblow') ||
				(moves.has('suckerpunch') && movePool.includes('knockoff'))
			),
			Dragon: (movePool, moves, abilities, types, counter) => (
				!counter.get('Dragon') &&
				!abilities.has('Aerilate') && !abilities.has('Pixilate') &&
				!moves.has('fly') && !moves.has('rest') && !moves.has('sleeptalk')
			),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric') || movePool.includes('thunder'),
			Fairy: (movePool, moves, abilities, types, counter) => (
				!counter.get('Fairy') &&
				['dazzlinggleam', 'moonblast', 'fleurcannon', 'playrough', 'strangesteam'].some(moveid => movePool.includes(moveid))
			),
			Fighting: (movePool, moves, abilities, types, counter) => !counter.get('Fighting') || !counter.get('stab'),
			Fire: (movePool, moves, abilities, types, counter, species) => !moves.has('bellydrum') && (!counter.get('Fire')),
			Flying: (movePool, moves, abilities, types, counter) => (
				!counter.get('Flying') && !types.has('Dragon') && [
					'airslash', 'bravebird', 'dualwingbeat', 'oblivionwing',
				].some(moveid => movePool.includes(moveid))
			),
			Ghost: (movePool, moves, abilities, types, counter) => {
				if (!counter.get('Ghost') && !types.has('Dark')) return true;
				if (movePool.includes('poltergeist')) return true;
				return movePool.includes('spectralthief') && !counter.get('Dark');
			},
			Grass: (movePool, moves, abilities, types, counter, species) => {
				if (movePool.includes('leafstorm') || movePool.includes('grassyglide')) return true;
				return !counter.get('Grass') && species.baseStats.atk >= 100;
			},
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => (
				!abilities.has('Refrigerate') && (
					!counter.get('Ice') ||
					movePool.includes('iciclecrash') ||
					(abilities.has('Snow Warning') && movePool.includes('blizzard'))
				)
			),
			Normal: (movePool, moves, abilities, types, counter) => (
				(abilities.has('Guts') && movePool.includes('facade')) || (abilities.has('Pixilate') && !counter.get('Normal'))
			),
			Poison: (movePool, moves, abilities, types, counter) => {
				if (counter.get('Poison')) return false;
				return types.has('Ground') || types.has('Psychic') || types.has('Grass') || !!counter.setupType || movePool.includes('gunkshot');
			},
			Psychic: (movePool, moves, abilities, types, counter) => {
				if (counter.get('Psychic')) return false;
				if (types.has('Ghost') || types.has('Steel')) return false;
				return abilities.has('Psychic Surge') || !!counter.setupType || movePool.includes('psychicfangs');
			},
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock') && species.baseStats.atk >= 80,
			Steel: (movePool, moves, abilities, types, counter, species) => {
				if (species.baseStats.atk < 95) return false;
				if (movePool.includes('meteormash')) return true;
				return !counter.get('Steel');
			},
			Water: (movePool, moves, abilities, types, counter, species) => {
				if (!counter.get('Water') && !moves.has('hypervoice')) return true;
				if (['hypervoice', 'liquidation', 'surgingstrikes'].some(m => movePool.includes(m))) return true;
				return abilities.has('Huge Power') && movePool.includes('aquajet');
			},
		};
	}
	queryMoves(
		moves: Set<string> | null,
		types: string[],
		abilities: Set<string> = new Set(),
		movePool: string[] = []
	): MoveCounter {
		// This is primarily a helper function for random setbuilder functions.
		const counter = new MoveCounter();

		if (!moves?.size) return counter;

		const categories = {Physical: 0, Special: 0, Status: 0};

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const moveid of moves) {
			let move = this.dex.moves.get(moveid);
			if (move.id === 'naturepower') {
				if (this.gen === 5) move = this.dex.moves.get('earthquake');
			}

			let moveType = move.type;
			if (['judgment', 'multiattack', 'revelationdance'].includes(moveid)) moveType = types[0];
			if (move.damage || move.damageCallback) {
				// Moves that do a set amount of damage:
				counter.add('damage');
				counter.damagingMoves.add(move);
			} else {
				// Are Physical/Special/Status moves:
				categories[move.category]++;
			}
			// Moves that have a low base power:
			if (moveid === 'lowkick' || (move.basePower && move.basePower <= 60 && moveid !== 'rapidspin')) {
				counter.add('technician');
			}
			// Moves that hit up to 5 times:
			if (move.multihit && Array.isArray(move.multihit) && move.multihit[1] === 5) counter.add('skilllink');
			if (move.recoil || move.hasCrashDamage) counter.add('recoil');
			if (move.drain) counter.add('drain');
			// Moves which have a base power, but aren't super-weak like Rapid Spin:
			if (move.basePower > 30 || move.multihit || move.basePowerCallback || moveid === 'infestation') {
				counter.add(moveType);
				if (types.includes(moveType)) {
					// STAB:
					// Certain moves aren't acceptable as a Pokemon's only STAB attack
					if (!NoStab.includes(moveid) && (!moveid.startsWith('hiddenpower') || types.length === 1)) {
						counter.add('stab');
						// Ties between Physical and Special setup should broken in favor of STABs
						categories[move.category] += 0.1;
					}
				} else if (
					// Less obvious forms of STAB
					(moveType === 'Normal' && (['Aerilate', 'Galvanize', 'Pixilate', 'Refrigerate'].some(abil => abilities.has(abil)))) ||
					(move.priority === 0 && (abilities.has('Libero') || abilities.has('Protean')) && !NoStab.includes(moveid)) ||
					(moveType === 'Steel' && abilities.has('Steelworker')) ||
					(moveid === 'forbiddenspell' && types.includes('Psychic'))
				) {
					counter.add('stab');
				}

				if (move.flags['bite']) counter.add('strongjaw');
				if (move.flags['punch']) counter.add('ironfist');
				if (move.flags['sound']) counter.add('sound');
				if (move.flags['bone']) counter.add('bonezone');
				if (move.flags['blade']) counter.add('blademaster');
				if (move.flags['kick']) counter.add('striker');
				if (move.priority !== 0 || (moveid === 'grassyglide' && abilities.has('Grassy Surge'))) {
					counter.add('priority');
				}
				counter.damagingMoves.add(move);
			}
			// Moves with secondary effects:
			if (move.secondary) {
				counter.add('sheerforce');
				if (move.secondary.chance && move.secondary.chance >= 20 && move.secondary.chance < 100) {
					counter.add('serenegrace');
				}
			}
			// Moves with low accuracy:
			if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter.add('inaccurate');

			// Moves that change stats:
			if (RecoveryMove.includes(moveid)) counter.add('recovery');
			if (ContraryMoves.includes(moveid)) counter.add('contrary');
			if (PhysicalSetup.includes(moveid)) {
				counter.add('physicalsetup');
				counter.setupType = 'Physical';
			} else if (SpecialSetup.includes(moveid)) {
				counter.add('specialsetup');
				counter.setupType = 'Special';
			}

			if (MixedSetup.includes(moveid)) counter.add('mixedsetup');
			if (SpeedSetup.includes(moveid)) counter.add('speedsetup');
			if (Hazards.includes(moveid)) counter.add('hazards');
		}

		// Keep track of the available moves
		for (const moveid of movePool) {
			const move = this.dex.moves.get(moveid);
			if (move.damageCallback) continue;
			if (move.category === 'Physical') counter.add('physicalpool');
			if (move.category === 'Special') counter.add('specialpool');
		}

		// Choose a setup type:
		if (counter.get('mixedsetup')) {
			counter.setupType = 'Mixed';
		} else if (counter.get('physicalsetup') && counter.get('specialsetup')) {
			const pool = {
				Physical: categories['Physical'] + counter.get('physicalpool'),
				Special: categories['Special'] + counter.get('specialpool'),
			};
			if (pool.Physical === pool.Special) {
				if (categories['Physical'] > categories['Special']) counter.setupType = 'Physical';
				if (categories['Special'] > categories['Physical']) counter.setupType = 'Special';
			} else {
				counter.setupType = pool.Physical > pool.Special ? 'Physical' : 'Special';
			}
		} else if (counter.setupType === 'Physical') {
			if (
				(categories['Physical'] < 2 && (!counter.get('stab') || !counter.get('physicalpool'))) &&
				!(moves.has('rest') && moves.has('sleeptalk'))
			) {
				counter.setupType = '';
			}
		} else if (counter.setupType === 'Special') {
			if (
				(categories['Special'] < 2 && (!counter.get('stab') || !counter.get('specialpool'))) &&
				!(moves.has('rest') && moves.has('sleeptalk')) &&
				!(moves.has('wish') && moves.has('protect'))
			) {
				counter.setupType = '';
			}
		}

		counter.set('Physical', Math.floor(categories['Physical']));
		counter.set('Special', Math.floor(categories['Special']));
		counter.set('Status', categories['Status']);

		return counter;
	}

	shouldCullMove(
		move: Move,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
	): {cull: boolean, isSetup?: boolean} {
		if (isDoubles && species.baseStats.def >= 140 && movePool.includes('bodypress')) {
			// In Doubles, Pokémon with Defense stats >= 140 should always have body press
			return {cull: true};
		}
		if (
			(species.id === 'doublade' && movePool.includes('swordsdance')) ||
			(species.id === 'entei' && movePool.includes('extremespeed')) ||
			(species.id === 'genesectdouse' && movePool.includes('technoblast')) ||
			(species.id === 'golisopod' && movePool.includes('leechlife') && movePool.includes('firstimpression'))
		) {
			// Entei should always have Extreme Speed, and Genesect-Douse should always have Techno Blast
			// Golisopod should always have one of its bug moves (Leech Life or First Impression)
			return {cull: true};
		}

		const hasRestTalk = moves.has('rest') && moves.has('sleeptalk');

		// Reject moves that need support
		switch (move.id) {
		case 'acrobatics': case 'junglehealing':
			// Special case to prevent lead Acrobatics Rillaboom
			return {cull: (species.id.startsWith('rillaboom') && isLead) || (!isDoubles && !counter.setupType)};
		case 'dualwingbeat': case 'fly':
			return {cull: !types.has(move.type) && !counter.setupType && !!counter.get('Status')};
		case 'healbell':
			return {cull: movePool.includes('protect') || movePool.includes('wish')};
		case 'fireblast':
			// Special case for Togekiss, which always wants Aura Sphere
			return {cull:
				(abilities.has('Serene Grace') && (!moves.has('trick') || counter.get('Status') > 1)) ||
				(isDoubles && moves.has('heatwave')) ||
				(species.id === 'altariamega' && counter.setupType === 'Physical' && !moves.has('return')),
			};
		case 'firepunch':
			// Special case for Darmanitan-Zen-Galar, which doesn't always want Fire Punch
			return {cull: movePool.includes('bellydrum') || (moves.has('earthquake') && movePool.includes('substitute'))};
		case 'flamecharge':
			return {cull: movePool.includes('swordsdance')};
		case 'payback': case 'psychocut':
			// Special case for Type: Null and Malamar, which don't want these + RestTalk
			return {cull: !counter.get('Status') || hasRestTalk};
		case 'rest':
			const bulkySetup = !moves.has('sleeptalk') && ['bulkup', 'calmmind', 'coil', 'curse'].some(m => movePool.includes(m));
			// Registeel would otherwise get Curse sets without Rest, which are very bad generally
			return {cull: species.id !== 'registeel' && (movePool.includes('sleeptalk') || bulkySetup)};
		case 'sleeptalk':
			if (!moves.has('rest')) return {cull: true};
			if (movePool.length > 1 && !abilities.has('Contrary')) {
				const rest = movePool.indexOf('rest');
				if (rest >= 0) this.fastPop(movePool, rest);
			}
			break;
		case 'storedpower':
			return {cull: !counter.setupType};
		case 'switcheroo': case 'trick':
			return {cull: counter.get('Physical') + counter.get('Special') < 3 || moves.has('rapidspin')};
		case 'trickroom':
			const webs = !!teamDetails.stickyWeb;
			return {cull:
				isLead || webs || !!counter.get('speedsetup') ||
				counter.damagingMoves.size < 2 || movePool.includes('nastyplot'),
			};
		case 'zenheadbutt':
			// Special case for Victini, which should prefer Bolt Strike to Zen Headbutt
			return {cull: movePool.includes('boltstrike') || (species.id === 'eiscue' && moves.has('substitute'))};

		// Set up once and only if we have the moves for it
		case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
			if (counter.setupType !== 'Physical') return {cull: true}; // if we're not setting up physically this is pointless
			if (counter.get('Physical') + counter.get('physicalpool') < 2 && !hasRestTalk) return {cull: true};

			// First Impression + setup is undesirable in Doubles
			if (isDoubles && moves.has('firstimpression')) return {cull: true};
			if (move.id === 'swordsdance' && moves.has('dragondance')) return {cull: true}; // Dragon Dance is judged as better
			if (move.id === 'bulkup' && moves.has('swordsdance')) return {cull: true}; // Swords Dance is judged as better

			return {cull: false, isSetup: true};
		case 'calmmind': case 'nastyplot':
			if (counter.setupType !== 'Special') return {cull: true};
			if (
				(counter.get('Special') + counter.get('specialpool')) < 2 &&
				!hasRestTalk &&
				!(moves.has('wish') && moves.has('protect'))
			) return {cull: true};
			if (moves.has('healpulse') || move.id === 'calmmind' && moves.has('trickroom')) return {cull: true};
			return {cull: false, isSetup: true};
		case 'quiverdance':
			return {cull: false, isSetup: true};
		case 'clangoroussoul': case 'growth': case 'shellsmash': case 'workup':
			return {cull: (
				counter.setupType !== 'Mixed' ||
				counter.get('mixedsetup') > 1 ||
				counter.damagingMoves.size + counter.get('physicalpool') + counter.get('specialpool') < 2 ||
				(move.id === 'growth' && !moves.has('sunnyday'))
			), isSetup: true};
		case 'agility': case 'autotomize': case 'rockpolish': case 'shiftgear':
			if (counter.damagingMoves.size < 2 || moves.has('rest')) return {cull: true};
			if (movePool.includes('calmmind') || movePool.includes('nastyplot')) return {cull: true};
			return {cull: false, isSetup: !counter.setupType};
		case 'blizzard':
			// For Aurorus
			return {cull: moves.has('boomburst')};
		case 'focuspunch':
			return {cull: !moves.has('substitute') || counter.damagingMoves.size < 2};
		case 'perishsong':
			return {cull: !moves.has('protect')};

		// Bad after setup
		case 'coaching':
			return {cull: !!counter.setupType || this.format.gameType === 'freeforall'};
		case 'counter': case 'reversal':
			// Counter: special case for Alakazam, which doesn't want Counter + Nasty Plot
			return {cull: !!counter.setupType};
		case 'bulletpunch': case 'extremespeed': case 'rockblast':
			return {cull: (
				!!counter.get('speedsetup') ||
				(!isDoubles && moves.has('dragondance')) ||
				counter.damagingMoves.size < 2
			)};
		case 'closecombat': case 'flashcannon': case 'pollenpuff':
			const substituteCullCondition = (
				(moves.has('substitute') && !types.has('Fighting')) ||
				(moves.has('toxic') && movePool.includes('substitute'))
			);
			const preferHJKOverCCCullCondition = (
				move.id === 'closecombat' &&
				!counter.setupType &&
				(moves.has('highjumpkick') || movePool.includes('highjumpkick'))
			);
			return {cull: substituteCullCondition || preferHJKOverCCCullCondition};
		case 'defog':
			return {cull: !!counter.setupType || moves.has('healbell') || moves.has('toxicspikes') || !!teamDetails.defog};
		case 'fakeout':
			return {cull: !!counter.setupType || ['protect', 'rapidspin', 'substitute', 'uturn'].some(m => moves.has(m))};
		case 'firstimpression': case 'glare': case 'icywind': case 'tailwind': case 'waterspout':
			return {cull: !!counter.setupType || !!counter.get('speedsetup') || moves.has('rest')};
		case 'healingwish': case 'memento':
			return {cull: !!counter.setupType || !!counter.get('recovery') || moves.has('substitute') || moves.has('uturn')};
		case 'highjumpkick':
			// Special case for Hitmonlee to prevent non-Unburden Curse
			return {cull: moves.has('curse')};
		case 'partingshot':
			return {cull: !!counter.get('speedsetup') || moves.has('bulkup') || moves.has('uturn')};
		case 'protect':
			if (!isDoubles && ((counter.setupType && !moves.has('wish')) || moves.has('rest'))) return {cull: true};
			if (
				!isDoubles &&
				counter.get('Status') < 2 &&
				['Hunger Switch', 'Speed Boost', 'Moody'].every(m => !abilities.has(m))
			) return {cull: true};
			if (movePool.includes('leechseed') || (movePool.includes('toxic') && !moves.has('wish'))) return {cull: true};
			if (isDoubles && (
				['bellydrum', 'fakeout', 'shellsmash', 'spore'].some(m => movePool.includes(m)) ||
				moves.has('tailwind') || moves.has('waterspout')
			)) return {cull: true};
			return {cull: false};
		case 'rapidspin':
			const setup = ['curse', 'nastyplot', 'shellsmash'].some(m => moves.has(m));
			return {cull: !!teamDetails.rapidSpin || setup || (!!counter.setupType && counter.get('Fighting') >= 2)};
		case 'shadowsneak':
			const sneakIncompatible = ['substitute', 'trickroom', 'dualwingbeat', 'toxic'].some(m => moves.has(m));
			return {cull: hasRestTalk || sneakIncompatible || counter.setupType === 'Special'};
		case 'spikes':
			return {cull: !!counter.setupType || (!!teamDetails.spikes && teamDetails.spikes > 1)};
		case 'stealthrock':
			return {cull:
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				!!teamDetails.stealthRock ||
				['rest', 'substitute', 'trickroom', 'teleport'].some(m => moves.has(m)),
			};
		case 'stickyweb':
			return {cull: counter.setupType === 'Special' || !!teamDetails.stickyWeb};
		case 'taunt':
			return {cull: moves.has('encore') || moves.has('nastyplot') || moves.has('swordsdance')};
		case 'teleport':
			return {cull: !!counter.setupType};
		case 'thunderwave': case 'voltswitch':
			const cullInDoubles = isDoubles && (moves.has('electroweb') || moves.has('nuzzle'));
			const dedenneCull = species.id === 'dedenne' && !moves.has('risingvoltage');
			return {cull: (
				!!counter.setupType ||
				!!counter.get('speedsetup') ||
				moves.has('shiftgear') ||
				moves.has('raindance') ||
				moves.has('uturn') ||
				dedenneCull ||
				cullInDoubles
			)};
		case 'toxic':
			return {cull: !!counter.setupType || ['sludgewave', 'thunderwave', 'willowisp'].some(m => moves.has(m))};
		case 'toxicspikes':
			return {cull: !!counter.setupType || !!teamDetails.toxicSpikes};
		case 'uturn':
			return {cull: (
				(abilities.has('Speed Boost') && moves.has('protect')) ||
				(abilities.has('Protean') && counter.get('Status') > 2) ||
				!!counter.setupType ||
				!!counter.get('speedsetup') || (
					types.has('Bug') &&
					counter.get('stab') < 2 &&
					counter.damagingMoves.size > 2 &&
					!abilities.has('Adaptability') &&
					!abilities.has('Download')
				)
			)};

		/**
		 * Ineffective to have both moves together
		 *
		 * These are sorted in order of:
		 * Normal>Fire>Water>Electric>Grass>Ice>Fighting>Poison>Ground>Flying>Psychic>Bug>Rock>Ghost>Dragon>Dark>Fairy
		 * and then subsorted alphabetically.
		 * This type order is arbitrary and referenced from https://pokemondb.net/type.
		 */
		case 'explosion':
			// Rock Blast: Special case for Gigalith to prevent Stone Edge-less Choice Band sets
			const otherMoves = ['curse', 'stompingtantrum', 'rockblast', 'painsplit', 'wish'].some(m => moves.has(m));
			return {cull: !!counter.setupType || otherMoves || abilities.has('Refrigerate') && moves.has('freezedry')};
		case 'facade':
			// Special cases for Braviary and regular Snorlax, respectively
			return {cull: !!counter.get('recovery') || movePool.includes('doubleedge')};
		case 'hiddenpower':
			return {cull: moves.has('rest') || !counter.get('stab') && counter.damagingMoves.size < 2};
		case 'judgment':
			return {cull: counter.setupType !== 'Special' && counter.get('stab') > 1};
		case 'return':
			return {cull: moves.has('doubleedge')};
		case 'quickattack':
			// Diggersby wants U-turn on Choiced sets
			const diggersbyCull = counter.get('Physical') > 3 && movePool.includes('uturn');
			return {cull: !!counter.get('speedsetup') || (types.has('Rock') && !!counter.get('Status')) || diggersbyCull};
		case 'blazekick':
			return {cull: species.id === 'genesect' && counter.get('Special') >= 1};
		case 'blueflare':
			return {cull: moves.has('vcreate')};
		case 'firefang': case 'flamethrower':
			// Fire Fang: Special case for Garchomp, which doesn't want Fire Fang w/o Swords Dance
			const otherFireMoves = ['heatwave', 'overheat'].some(m => moves.has(m));
			return {cull: (moves.has('fireblast') && counter.setupType !== 'Physical') || otherFireMoves};
		case 'overheat':
			return {cull: moves.has('flareblitz') || (isDoubles && moves.has('calmmind'))};
		case 'aquatail': case 'flipturn': case 'retaliate':
			// Retaliate: Special case for Braviary to prevent Retaliate on non-Choice
			return {cull: moves.has('aquajet') || !counter.get('Status')};
		case 'hydropump':
			return {cull: (
				moves.has('liquidation') ||
				moves.has('waterfall') ||
				moves.has('snipeshot') ||
				hasRestTalk || (
					moves.has('scald') &&
					((counter.get('Special') < 4 && !moves.has('uturn')) || (species.types.length > 1 && counter.get('stab') < 3))
				)
			)};
		case 'muddywater':
			return {cull: isDoubles && (moves.has('scald') || moves.has('hydropump'))};
		case 'originpulse': case 'surf':
			return {cull: moves.has('hydropump') || moves.has('scald')};
		case 'scald':
			return {cull: ['liquidation', 'waterfall', 'snipeshot'].some(m => moves.has(m))};
		case 'thunderbolt':
			// Special case for Goodra, which only wants one move to hit Water-types
			return {cull: moves.has('powerwhip')};
		case 'thunderpunch':
			// Special case for Infernape, which prefers Pyro Ball/Close Combat
			return {cull: species.id === 'infernape' && ['bulkup', 'slackoff'].some(m => moves.has(m))};
		case 'energyball':
			// Special case to prevent Shiinotic with four Grass moves and no Sparkly Swirl
			return {cull: species.id === 'shiinotic' && !moves.has('sparklyswirl')};
		case 'gigadrain':
			// Celebi always wants Leaf Storm on its more pivoting-focused non-Nasty Plot sets
			const celebiPreferLeafStorm = species.id === 'celebi' && !counter.setupType && moves.has('uturn');
			return {cull: celebiPreferLeafStorm || (types.has('Poison') && !counter.get('Poison'))};
		case 'leafblade':
			// Special case for Virizion to prevent Leaf Blade on Assault Vest sets
			return {cull: (moves.has('leafstorm') || movePool.includes('leafstorm')) && counter.setupType !== 'Physical'};
		case 'leafstorm':
			const leafBladePossible = movePool.includes('leafblade') || moves.has('leafblade');
			return {cull:
				// Virizion should always prefer Leaf Blade to Leaf Storm on Physical sets
				(counter.setupType === 'Physical' && (species.id === 'virizion' || leafBladePossible)) ||
				(moves.has('gigadrain') && !!counter.get('Status')) ||
				(isDoubles && moves.has('energyball')),
			};
		case 'powerwhip':
			// Special case for Centiskorch, which doesn't want Assault Vest
			const centiskorchCull = moves.has('leechlife');
			// Special case for Tsareena, which prefers Striker + Trop Kick
			const tsareenaCull = !!counter.get('kick');
			return {cull: centiskorchCull || tsareenaCull};
		case 'woodhammer':
			return {cull: moves.has('hornleech') && counter.get('Physical') < 4};
		case 'freezedry':
			const betterIceMove = (
				(moves.has('blizzard') && !!counter.setupType) ||
				((moves.has('icebeam') || moves.has('freezyfrost')) && counter.get('Special') < 4)
			);
			const preferThunderWave = movePool.includes('thunderwave') && types.has('Electric');
			return {cull: betterIceMove || preferThunderWave || movePool.includes('bodyslam')};
		case 'bodypress':
			// Turtonator never wants Earthquake + Body Press, and wants EQ+Smash or Press+No Smash
			const turtonatorPressCull = species.id === 'turtonator' && moves.has('earthquake') && movePool.includes('shellsmash');
			const pressIncompatible = ['shellsmash', 'mirrorcoat', 'whirlwind'].some(m => moves.has(m));
			return {cull: turtonatorPressCull || pressIncompatible || counter.setupType === 'Special'};
		case 'drainpunch':
			return {cull: moves.has('closecombat') || (!types.has('Fighting') && movePool.includes('swordsdance'))};
		case 'dynamicpunch': case 'thunderouskick':
			// Dynamic Punch: Special case for Machamp to better split Guts and No Guard sets
			return {cull: moves.has('closecombat') || moves.has('facade')};
		case 'focusblast':
			// Special cases for Blastoise and Regice; Blastoise wants Shell Smash, and Regice wants Thunderbolt
			return {cull: movePool.includes('shellsmash') || hasRestTalk};
		case 'hammerarm':
			// Special case for Kangaskhan, which always wants Sucker Punch
			return {cull: moves.has('fakeout')};
		case 'machpunch':
			// Special case for Infernape, which prefers Pyro Ball and Close Combat as its attacking moves
			// when it has both bulk up and slack off
			return {cull: species.id === 'infernape' && ['bulkup', 'slackoff'].every(m => moves.has(m))};
		case 'superpower':
			return {
				cull: moves.has('hydropump') ||
					(counter.get('Physical') >= 4 && movePool.includes('uturn')) ||
					(moves.has('substitute') && !abilities.has('Contrary')),
				isSetup: abilities.has('Contrary'),
			};
		case 'solarbeam':
			return {cull: (
				(!abilities.has('Drought') && !moves.has('sunnyday')) ||
				moves.has('gigadrain') ||
				moves.has('leafstorm')
			)};
		case 'weatherball':
			return {cull: !moves.has('raindance') && !moves.has('sunnyday')};
		case 'poisonjab':
			return {cull: !types.has('Poison') && counter.get('Status') >= 2};
		case 'earthquake':
			const doublesCull = moves.has('earthpower') || moves.has('highhorsepower');
			// Turtonator wants Body Press when it doesn't have Shell Smash
			const turtQuakeCull = species.id === 'turtonator' && movePool.includes('bodypress') && movePool.includes('shellsmash');
			const subToxicPossible = moves.has('substitute') && movePool.includes('toxic');
			return {cull: turtQuakeCull || (isDoubles && doublesCull) || subToxicPossible || moves.has('bonemerang')};
		case 'precipiceblades':
			return {cull: moves.has('earthquake')};
		case 'scorchingsands':
			// Typhlosion always wants Eruption
			const typhloSandsCull = (species.id === 'typhlosion' && !moves.has('eruption'));
			// Special cases for Ninetales and Palossand; prevents status redundancy
			return {cull: (
				moves.has('willowisp') ||
				moves.has('earthpower') ||
				(moves.has('toxic') && movePool.includes('earthpower')) ||
				typhloSandsCull
			)};
		case 'airslash':
			return {cull:
				(species.id === 'naganadel' && moves.has('nastyplot')) ||
				(species.id === 'moltresgalar' && !counter.setupType) ||
				(species.id === 'drifblim' && !counter.setupType) ||
				hasRestTalk ||
				(abilities.has('Simple') && !!counter.get('recovery')) ||
				counter.setupType === 'Physical',
			};
		case 'bravebird':
			// Special case for Mew, which only wants Brave Bird with Swords Dance
			return {cull: moves.has('dragondance')};
		case 'hurricane':
			// Special case for Moltres-Galar, which wants Air Slash if Nasty Plot instead
			const moltresgCase = (!isDoubles && species.id === 'moltresgalar' && !!counter.setupType);
			return {cull: counter.setupType === 'Physical' || moltresgCase};
		case 'hex':
			return {cull: !moves.has('thunderwave') && !moves.has('willowisp')};
		case 'poltergeist':
			// Special case for Dhelmise in Doubles, which doesn't want both
			return {cull: moves.has('knockoff')};
		case 'shadowball':
			return {cull:
				(isDoubles && moves.has('phantomforce')) ||
				// Special case for Sylveon, which never wants Shadow Ball as its only coverage move
				(abilities.has('Pixilate') && (!!counter.setupType || counter.get('Status') > 1)) ||
				(!types.has('Ghost') && movePool.includes('focusblast')),
			};
		case 'shadowclaw':
			return {cull: types.has('Steel') && moves.has('shadowsneak') && counter.get('Physical') < 4};
		case 'futuresight':
			return {cull: !!counter.setupType || moves.has('psyshock') || moves.has('trick') || movePool.includes('teleport')};
		case 'photongeyser':
			// Special case for Necrozma-DM, which always wants Dragon Dance
			return {cull: moves.has('morningsun')};
		case 'psychic':
			return {cull: moves.has('psyshock') && (!!counter.setupType || isDoubles)};
		case 'psychicfangs':
			// Special case for Morpeko, which doesn't want 4 attacks Leftovers
			return {cull: moves.has('rapidspin')};
		case 'psyshock':
			// Special case for Sylveon which only wants Psyshock if it gets a Choice item
			const sylveonCase = abilities.has('Pixilate') && counter.get('Special') < 4;
			return {cull: moves.has('psychic') || (!counter.setupType && sylveonCase) || (isDoubles && moves.has('psychic'))};
		case 'bugbuzz':
			return {cull: moves.has('uturn') && !counter.setupType};
		case 'leechlife':
			return {cull:
				(isDoubles && moves.has('lunge')) ||
				(moves.has('uturn') && !counter.setupType) ||
				movePool.includes('spikes'),
			};
		case 'stoneedge':
			const gutsCullCondition = abilities.has('Guts') && (!moves.has('dynamicpunch') || moves.has('spikes'));
			const rockSlidePlusStatusPossible = counter.get('Status') && movePool.includes('rockslide');
			const otherRockMove = moves.has('rockblast') || moves.has('rockslide');
			return {cull: gutsCullCondition || (!isDoubles && rockSlidePlusStatusPossible) || otherRockMove};
		case 'dragonpulse': case 'spacialrend':
			return {cull: moves.has('dracometeor') && counter.get('Special') < 4};
		case 'darkpulse':
			const pulseIncompatible = ['defog', 'foulplay', 'knockoff', 'suckerpunch'].some(m => moves.has(m));
			// Special clause to prevent bugged Shiftry sets with Sucker Punch + Nasty Plot
			const shiftryCase = movePool.includes('nastyplot') && !moves.has('defog');
			return {cull: pulseIncompatible && !shiftryCase && counter.setupType !== 'Special'};
		case 'suckerpunch':
			return {cull:
				// Shiftry in No Dynamax would otherwise get Choice Scarf Sucker Punch sometimes.
				(species.id === 'shiftry' && moves.has('defog')) ||
				moves.has('rest') ||
				counter.damagingMoves.size < 2 ||
				(counter.setupType === 'Special') ||
				(counter.get('Dark') > 1 && !types.has('Dark')),
			};
		case 'dazzlinggleam':
			return {cull: ['fleurcannon', 'moonblast', 'petaldance'].some(m => moves.has(m))};
		case 'freezyfrost':
			return {cull: !!counter.setupType};

		// Status:
		case 'bodyslam': case 'clearsmog':
			const toxicCullCondition = moves.has('toxic') && !types.has('Normal');
			return {cull: moves.has('sludgebomb') || moves.has('trick') || movePool.includes('recover') || toxicCullCondition};
		case 'haze':
			// Special case for Corsola-Galar, which always wants Will-O-Wisp
			return {cull: !teamDetails.stealthRock && (moves.has('stealthrock') || movePool.includes('stealthrock'))};
		case 'hypnosis':
			// Special case for Xurkitree to properly split Blunder Policy and Choice item sets
			return {cull: moves.has('voltswitch')};
		case 'willowisp': case 'yawn':
			return {cull: moves.has('thunderwave') || moves.has('toxic')};
		case 'raindance':
			return {cull: (
				counter.get('Physical') + counter.get('Special') < 2 ||
				hasRestTalk ||
				(!types.has('Water') && !counter.get('Water'))
			)};
		case 'sunnyday':
			const cull = (
				counter.get('Physical') + counter.get('Special') < 2 ||
				(!abilities.has('Chlorophyll') && !abilities.has('Flower Gift') && !moves.has('solarbeam')) ||
				hasRestTalk
			);

			if (cull && movePool.length > 1) {
				const solarbeam = movePool.indexOf('solarbeam');
				if (solarbeam >= 0) this.fastPop(movePool, solarbeam);
				if (movePool.length > 1) {
					const weatherball = movePool.indexOf('weatherball');
					if (weatherball >= 0) this.fastPop(movePool, weatherball);
				}
			}

			return {cull};
		case 'painsplit': case 'recover': case 'synthesis':
			return {cull: moves.has('leechseed') || moves.has('rest') || moves.has('wish')};
		case 'roost':
			return {cull:
				moves.has('throatchop') ||
				// Hawlucha doesn't want Roost + 3 attacks
				(moves.has('stoneedge') && species.id === 'hawlucha') ||
				// Special cases for Salamence, Dynaless Dragonite, and Scizor to help prevent sets with poor coverage or no setup.
				(moves.has('dualwingbeat') && ((moves.has('outrage') && !moves.has('defog')) || species.id === 'scizor')),
			};
		case 'reflect': case 'lightscreen':
			return {cull: !!teamDetails.screens};
		case 'slackoff':
			// Special case to prevent Scaldless Slowking
			return {cull: species.id === 'slowking' && !moves.has('scald')};
		case 'substitute':
			const moveBasedCull = ['bulkup', 'nastyplot', 'painsplit', 'roost', 'swordsdance'].some(m => movePool.includes(m));
			// Smaller formes of Gourgeist in Doubles don't want Poltergeist as their only attack
			const doublesGourgeist = isDoubles && movePool.includes('powerwhip');
			// Calyrex wants Substitute + Leech Seed not Calm Mind + Leech Seed
			const calmMindCullCondition = !counter.get('recovery') && movePool.includes('calmmind') && species.id !== 'calyrex';
			// Eiscue wants to always have Liquidation and Belly Drum
			const eiscue = species.id === 'eiscue' && moves.has('zenheadbutt');
			return {cull: moves.has('rest') || moveBasedCull || doublesGourgeist || calmMindCullCondition || eiscue};
		case 'helpinghand':
			// Special case for Shuckle in Doubles, which doesn't want sets with no method to harm foes
			return {cull: moves.has('acupressure') || this.format.gameType === 'freeforall'};
		case 'wideguard':
			return {cull: moves.has('protect')};
		case 'grassknot':
			// Special case for Raichu and Heliolisk
			return {cull: moves.has('surf')};
		case 'icepunch':
			// Special cases for Marshadow and Lucario, respectively
			return {cull: moves.has('rocktomb') || (species.id === 'lucario' && !!counter.setupType)};
		case 'leechseed':
			// Special case for Calyrex to prevent Leech Seed + Calm Mind
			return {cull: !!counter.setupType || moves.has('sappyseed')};
		case 'strengthsap':
			// Special case for Cursola in doubles, which doesn't want strength sap on its Power Herb set
			return {cull: species.id === 'cursola' && moves.has('meteorbeam')};
		}

		return {cull: false};
	}

	shouldCullAbility(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isDoubles: boolean,
	): boolean {
		if ([
			'Hydration', 'Ice Body', 'Innards Out', 'Insomnia', 'Misty Surge', 'Battle Bond',
			'Quick Feet', 'Rain Dish', 'Snow Cloak', 'Steadfast', 'Steam Engine',
		].includes(ability)) return true;

		switch (ability) {
		// Abilities which are primarily useful for certain moves
		case 'Contrary': case 'Serene Grace': case 'Skill Link': case 'Strong Jaw':
		case 'Bone Zone': case 'Blademaster': case 'Striker':
			return !counter.get(toID(ability));
		case 'Analytic':
			return (moves.has('rapidspin') || species.nfe || isDoubles);
		case 'Blaze':
			return ((isDoubles && abilities.has('Solar Power')) || abilities.has('Magic Guard'));
		case 'Bulletproof': case 'Overcoat':
			return (!!counter.setupType && abilities.has('Soundproof'));
		case 'Bull Rush':
			return counter.damagingMoves.size < 4;
		case 'Chlorophyll':
			return (species.baseStats.spe > 105 || !counter.get('Fire') && !moves.has('sunnyday') && !teamDetails.sun);
		case 'Cloud Nine':
			return (species.id !== 'golduck');
		case 'Competitive':
			return (counter.get('Special') < 2 || (moves.has('rest') && moves.has('sleeptalk')));
		case 'Compound Eyes': case 'Illuminate': case 'No Guard':
			return !counter.get('inaccurate');
		case 'Cursed Body':
			return abilities.has('Infiltrator');
		case 'Dazzling':
			return (species.id !== 'bruxish');
 		case 'Defiant':
			return !counter.get('Physical');
		case 'Download':
			return (counter.damagingMoves.size < 3 || moves.has('trick'));
		case 'Early Bird':
			return (types.has('Grass') && isDoubles);
		case 'Feline Prowess':
			return counter.damagingMoves.size < 2;
		case 'Flash Fire':
			return (
				this.dex.getEffectiveness('Fire', species) < -1 ||
				abilities.has('Drought') ||
				abilities.has('Blazing Soul') ||
				(species.id === 'houndoommega' && !teamDetails.sun)
			);
		case 'Frisk':
			return !['pidgeot', 'pidgeotmega', 'chatot'].includes(species.id);
		case 'Galvanize':
			return species.id === 'golemalola';
		case 'Gluttony':
			return !moves.has('bellydrum');
		case 'Guts':
			return (!moves.has('facade') && !moves.has('sleeptalk') && !species.nfe);
		case 'Harvest':
			return (abilities.has('Frisk') && !isDoubles);
		case 'Hustle': case 'Inner Focus':
			return (counter.get('Physical') < 2 || abilities.has('Iron Fist') || abilities.has('Scrappy'));
		case 'Ice Scales':
			return (abilities.has('Slush Rush') && (moves.has('hail') || !!teamDetails.hail));
		case 'Infiltrator':
			return (moves.has('rest') && moves.has('sleeptalk')) || (isDoubles && abilities.has('Clear Body'));
		case 'Intimidate':
			return (
				abilities.has('Reckless') && counter.get('recoil') > 1 ||
				abilities.has('Sheer Force') && counter.get('sheerforce') > 1 ||
				species.id === 'arbok' ||
				['bodyslam', 'rest', 'bounce', 'tripleaxel', 'dragondance'].some(m => moves.has(m))
			);
		case 'Iron Fist':
			return (counter.get('ironfist') < 2 || moves.has('dynamicpunch'));
		case 'Justified':
			return (isDoubles && abilities.has('Inner Focus'));
		case 'Lightning Rod':
			return (species.types.includes('Ground') || counter.setupType === 'Physical');
		case 'Limber':
			return species.types.includes('Electric') || moves.has('facade');
		case 'Liquid Voice':
			return !moves.has('hypervoice');
		case 'Magic Guard': case 'Speed Boost':
			return (abilities.has('Tinted Lens') && (!counter.get('Status') || moves.has('uturn')));
		case 'Magician':
			return moves.has('switcheroo');
		case 'Magnet Pull':
			return species.id !== 'magnezone';
		case 'Mold Breaker':
			return (
				abilities.has('Adaptability') || abilities.has('Scrappy') || abilities.has('Technician') ||
				(abilities.has('Unburden') && !!counter.setupType) ||
				(abilities.has('Sheer Force') && !!counter.get('sheerforce'))
			);
		case 'Moxie':
			return (counter.get('Physical') < 2 || moves.has('stealthrock') || moves.has('defog'));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Own Tempo':
			return !moves.has('petaldance');
		case 'Poison Heal':
			return (abilities.has('Technician') && !!counter.get('technician'));
		case 'Power Construct':
			return (species.forme === '10%' && !isDoubles);
		case 'Prankster':
			return !counter.get('Status');
		case 'Pressure':
			return (!!counter.setupType || counter.get('Status') < 2 || isDoubles);
		case 'Refrigerate':
			return !counter.get('Normal');
		case 'Regenerator':
			// For Reuniclus
			return (abilities.has('Magic Guard') || species.id === 'slowbromega');
		case 'Reckless':
			return !counter.get('recoil') || moves.has('curse');
		case 'Rock Head':
			return !counter.get('recoil');
		case 'Sand Force': case 'Sand Veil': case 'Sand Rush':
			return !teamDetails.sand;
		case 'Sap Sipper':
			// For Drampa, which wants Berserk with Roost
			// For Sawsbuck, which wants Chlorophyll with Sunny Day
			return species.name === 'Bouffalant' || moves.has('roost') || moves.has('sunnyday');
		case 'Scrappy':
			return (moves.has('earthquake') && species.id === 'miltank');
		case 'Screen Cleaner':
			return !!teamDetails.screens;
		case 'Shadow Tag':
			return (species.name === 'Gothitelle' && !isDoubles);
		case 'Shed Skin':
			// For Scrafty
			return (moves.has('dragondance') || abilities.has('Strong Jaw') && counter.get('strongjaw') > 1);
		case 'Sheer Force':
			return (!counter.get('sheerforce') || abilities.has('Guts') || abilities.has('strongjaw'));
		case 'Shell Armor':
			return (species.id === 'omastar' && (moves.has('spikes') || moves.has('stealthrock')));
		case 'Slush Rush':
			return (!moves.has('hail') && !teamDetails.hail && !abilities.has('Swift Swim'));
		case 'Sniper':
			return (counter.get('Water') > 1 && !moves.has('focusenergy'));
		case 'Solar Power':
			return !teamDetails.sun;
		case 'Steely Spirit':
			return (moves.has('fakeout') && !isDoubles);
		case 'Sturdy':
			return (
				moves.has('bulkup') ||
				!!counter.get('recoil') ||
				abilities.has('Technician')
			);
		case 'Swarm':
			return (!counter.get('Bug') || !!counter.get('recovery'));
		case 'Sweet Veil':
			return types.has('Grass');
		case 'Swift Swim':
			const neverWantsSwim = !moves.has('raindance') && [
				'Intimidate', 'Rock Head', 'Water Absorb',
			].some(m => abilities.has(m));
			const noSwimIfNoRain = !moves.has('raindance') && [
				'Cloud Nine', 'Lightning Rod', 'Intimidate', 'Rock Head', 'Sturdy', 'Water Absorb', 'Weak Armor',
			].some(m => abilities.has(m));
			return teamDetails.rain ? neverWantsSwim : noSwimIfNoRain;
		case 'Synchronize':
			return counter.get('Status') < 3;
		case 'Technician':
			return (
				!counter.get('technician') ||
				moves.has('tailslap') ||
				abilities.has('Punk Rock') ||
				// For Doubles Alolan Persian
				movePool.includes('snarl')
			);
		case 'Tinted Lens':
			return (
				// For Sigilyph
				moves.has('defog') ||
				// For Butterfree
				(moves.has('hurricane') && abilities.has('Compound Eyes')) ||
				(counter.get('Status') > 2 && !counter.setupType)
			);
		case 'Torrent':
			// For Inteleon and Primarina
			return (moves.has('focusenergy') || moves.has('hypervoice'));
		case 'Tough Claws':
			// For Zangoose and Perrserker
			return (abilities.has('Toxic Boost') || types.has('Steel') && !moves.has('fakeout'));
		case 'Unaware':
			// For Swoobat, Clefable and Bibarel
			return (!!counter.setupType || moves.has('skullbash') || moves.has('fireblast'));
		case 'Unburden':
			return (abilities.has('Prankster') || (!counter.setupType && !moves.has('meteorbeam')) && !isDoubles);
		case 'Volt Absorb':
			return (
				this.dex.getEffectiveness('Electric', species) < -1 ||
				(abilities.has('Slush Rush') && (moves.has('hail') || !!teamDetails.hail)) ||
				(abilities.has('Prankster') && counter.get('Status') > 1)
			);
		case 'Water Absorb':
			return (
				moves.has('raindance') ||
				['Drizzle', 'Strong Jaw', 'Unaware', 'Volt Absorb'].some(abil => abilities.has(abil)) ||
				(abilities.has('Slush Rush') && (moves.has('hail') || !!teamDetails.hail))
			);
		case 'Weak Armor':
			// The Speed less than 50 case is intended for Cursola, but could apply to any slow Pokémon.
			return (
				species.baseStats.spe > 50 ||
				species.id === 'skarmory' ||
				moves.has('shellsmash') || moves.has('rapidspin')
			);
		}

		return false;
	}

	getSREffectiveness(species: Species, ability: string) {
		if (['Magic Guard', 'Shield Dust', 'Mountaineer'].includes(ability)) return 0;
		return this.dex.getEffectiveness('Rock', species);
	}

	getHighPriorityItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean
	) {
		// not undefined — we want "no item" not "go find a different item"
		if (moves.has('acrobatics') && !['Shields Down', 'Ripen'].includes(ability)) {
			return ability === 'Grassy Surge' ? 'Grassy Seed' : '';
		}
		if (moves.has('geomancy') || moves.has('meteorbeam') || moves.has('skullbash')) return 'Power Herb';
		if (moves.has('shellsmash')) {
			if (ability === 'Sturdy' && !isLead && !isDoubles) return 'Heavy-Duty Boots';
			// Shell Smash + Solid Rock is intended for Carracosta, but I think
			// any Pokémon which can take a SE hit via Solid Rock deserves to have
			// its Shell Smash considered a good enough speed setup move for WP.
			if (ability === 'Solid Rock') return 'Weakness Policy';
			return 'White Herb';
		}
		// Techno Blast should always be Water-type
		if (moves.has('technoblast')) return 'Douse Drive';
		// Species-specific logic
		if (
			['Corsola', 'Garchomp', 'Tangrowth'].includes(species.name) &&
			counter.get('Status') &&
			!counter.setupType &&
			!isDoubles
		) return 'Rocky Helmet';
		if (species.name === 'Eternatus' && counter.get('Status') < 2) return 'Metronome';
		if (species.name === 'Genesect' && moves.has('technoblast')) return 'Douse Drive';
		if (species.name === 'Froslass' && !isDoubles) return 'Wide Lens';
		if (species.name === 'Latios' && counter.get('Special') === 2 && !isDoubles) return 'Soul Dew';
		if (species.name === 'Lopunny') return isDoubles ? 'Iron Ball' : 'Toxic Orb';
		if (species.baseSpecies === 'Marowak') return 'Thick Club';
		if (species.baseSpecies === 'Pikachu') return 'Light Ball';
		if (species.name === 'Dusknoir') return 'Reaper Cloth';
		if (species.baseSpecies === 'Farfetch\u2019d' || species.name === 'Sirfetch\u2019d') return 'Leek Stick';
		if (species.name === 'Regieleki' && !isDoubles) return 'Magnet';
		if (species.name === 'Castform-Rainy') return 'Damp Rock';
		if (species.name === 'Castform-Snowy') return 'Icy Rock';
		if (species.name === 'Castform-Sunny') return 'Heat Rock';
		if (species.name === 'Aipom') return 'Choice Band';
		if (species.name === 'Roselia') return 'Choice Scarf';
		if (species.name === 'Kangaskhan' && isDoubles) return 'Silk Scarf';
		if (species.name === 'Komala' && !isDoubles) return 'Choice Band';
		if (species.name === 'Shedinja') {
			const noSash = !teamDetails.defog && !teamDetails.rapidSpin && !isDoubles;
			return noSash ? 'Heavy-Duty Boots' : 'Focus Sash';
		}
		if (species.name === 'Smeargle') return 'Focus Sash';
		if (species.name === 'Shuckle' && moves.has('stickyweb')) return 'Mental Herb';
		if (species.name === 'Unfezant' || moves.has('focusenergy')) return 'Scope Lens';
		if (species.name === 'Pincurchin') return 'Shuca Berry';
		if (species.name === 'Wobbuffet' && moves.has('destinybond')) return 'Custap Berry';
		if (moves.has('bellydrum') && moves.has('substitute')) return 'Salac Berry';

		// Misc item generation logic
		if (species.evos.length && !moves.has('uturn')) return 'Eviolite';

		// Ability based logic and miscellaneous logic
		if (species.name === 'Wobbuffet' || ['Cheek Pouch', 'Harvest', 'Ripen'].includes(ability)) return 'Sitrus Berry';
		if (ability === 'Gluttony') return this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
		if (
			ability === 'Imposter' ||
			(ability === 'Magnet Pull' && moves.has('bodypress') && !isDoubles)
		) return 'Choice Scarf';
		if (
			ability === 'Guts' &&
			(counter.get('Physical') > 2 || isDoubles)
		) {
			return types.has('Fire') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (ability === 'Magic Guard' && counter.damagingMoves.size > 1) {
			return moves.has('counter') ? 'Focus Sash' : 'Life Orb';
		}
		if (ability === 'Sheer Force' && counter.get('sheerforce')) return 'Life Orb';
		if (ability === 'Unburden') return (moves.has('closecombat') || moves.has('curse')) ? 'White Herb' : 'Sitrus Berry';
		if (ability === 'Poison Heal' || ability === 'Toxic Boost') return 'Toxic Orb';
		if (ability === 'Flare Boost') return 'Flame Orb';
		if (ability === 'Blazing Soul') {
			if (teamDetails.defog && teamDetails.rapidSpin && moves.has('eruption')) {
				return 'Choice Specs';
			} else {
				return 'Heavy-Duty Boots';
			}
		}

		// Move based logic
		if (moves.has('trick') || moves.has('switcheroo') && !isDoubles) {
			if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && !counter.get('priority') && ability !== 'Triage') {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (moves.has('rest') && !moves.has('sleeptalk') && ability !== 'Shed Skin') return 'Chesto Berry';
		if (moves.has('hypnosis') && ability === 'Beast Boost') return 'Blunder Policy';
		if (moves.has('bellydrum')) return 'Sitrus Berry';

		if (this.getSREffectiveness(species, ability) >= 2 && !isDoubles) return 'Heavy-Duty Boots';
	}

	/** Item generation specific to Random Doubles */
	getDoublesItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
	) {
		const defensiveStatTotal = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;

		if (
			(['dragonenergy', 'eruption', 'waterspout'].some(m => moves.has(m))) &&
			counter.damagingMoves.size >= 4
		) return 'Choice Scarf';
		if (moves.has('blizzard') && ability !== 'Snow Warning' && !teamDetails.hail) return 'Blunder Policy';
		if (this.getSREffectiveness(species, ability) >= 2 && !types.has('Flying')) return 'Heavy-Duty Boots';
		if (counter.get('Physical') >= 4 && ['fakeout', 'feint', 'rapidspin', 'suckerpunch'].every(m => !moves.has(m)) && (
			types.has('Dragon') || types.has('Fighting') || types.has('Rock') ||
			moves.has('flipturn') || moves.has('uturn') || ability === 'Gorilla Tactics'
		)) {
			return (
				!counter.get('priority') && !abilities.has('Speed Boost') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 100 &&
				this.randomChance(1, 2)
			) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			(
				counter.get('Special') >= 4 &&
				(types.has('Dragon') || types.has('Fighting') || types.has('Rock') || moves.has('voltswitch'))
			) || (
				(counter.get('Special') >= 3 && (moves.has('flipturn') || moves.has('uturn'))) &&
				!moves.has('acidspray') && !moves.has('electroweb')
			) || (
				ability === 'Sage Power'
			)
		) {
			return (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 100 && this.randomChance(1, 2)
			) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (counter.damagingMoves.size >= 4 && defensiveStatTotal >= 280) return 'Assault Vest';
		if (
			counter.damagingMoves.size >= 3 &&
			species.baseStats.spe >= 60 &&
			ability !== 'Multiscale' && ability !== 'Sturdy' &&
			[
				'acidspray', 'clearsmog', 'electroweb', 'fakeout', 'feint', 'icywind',
				'incinerate', 'naturesmadness', 'rapidspin', 'snarl', 'uturn',
			].every(m => !moves.has(m))
		) return (ability === 'Defeatist' || defensiveStatTotal >= 275) ? 'Sitrus Berry' : 'Life Orb';
	}

	getMediumPriorityItem(
		ability: string,
		moves: Set<string>,
		counter: MoveCounter,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
	): string | undefined {
		const defensiveStatTotal = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;

		if (
			(ability === 'Speed Boost' || ability === 'Stance Change' || species.name === 'Pheromosa') &&
			counter.get('Physical') + counter.get('Special') > 2 &&
			!moves.has('uturn')
		) {
			return 'Life Orb';
		}

		// Choice items
		if (
			!isDoubles && counter.get('Physical') >= 4 && ability !== 'Serene Grace' &&
			['fakeout', 'flamecharge', 'rapidspin'].every(m => !moves.has(m)) &&
			(!moves.has('tailslap') || moves.has('uturn'))
		) {
			const scarfReqs = (
				(species.baseStats.atk >= 100 || ability === 'Huge Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && !counter.get('priority')
			);
			return (scarfReqs && this.randomChance(2, 3)) ? 'Choice Scarf' : 'Choice Band';
		}
		if (!isDoubles && (
			(counter.get('Special') >= 4 && !moves.has('futuresight')) ||
			(counter.get('Special') >= 3 && ['flipturn', 'partingshot', 'uturn'].some(m => moves.has(m)))
		)) {
			const scarfReqs = (
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Tinted Lens' && !counter.get('Physical')
			);
			return (scarfReqs && this.randomChance(2, 3)) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (
			!isDoubles &&
			counter.get('Physical') >= 3 &&
			!moves.has('rapidspin') &&
			['copycat', 'memento', 'partingshot'].some(m => moves.has(m))
		) return 'Choice Band';
		if (
			!isDoubles &&
			((counter.get('Physical') >= 3 && moves.has('defog')) || (counter.get('Special') >= 3 && moves.has('healingwish'))) &&
			!counter.get('priority') && !moves.has('uturn')
		) return 'Choice Scarf';

		// Other items
		if (
			moves.has('raindance') || moves.has('sunnyday') ||
			(ability === 'Speed Boost' && !counter.get('hazards')) ||
			(ability === 'Stance Change' && counter.damagingMoves.size >= 3)
		) return 'Life Orb';
		if (
			!isDoubles &&
			this.getSREffectiveness(species, ability) >= 1 && (
				['Defeatist', 'Emergency Exit', 'Multiscale'].includes(ability) ||
				['courtchange', 'defog', 'rapidspin'].some(m => moves.has(m))
			)
		) return 'Heavy-Duty Boots';
		if (species.name === 'Necrozma-Dusk-Mane' || (
			this.dex.getEffectiveness('Ground', species) < 2 &&
			counter.get('speedsetup') &&
			counter.damagingMoves.size >= 3 &&
			defensiveStatTotal >= 300
		)) return 'Weakness Policy';
		if (counter.damagingMoves.size >= 4 && defensiveStatTotal >= 235) return 'Assault Vest';
		if (
			['clearsmog', 'curse', 'haze', 'healbell', 'protect', 'sleeptalk', 'strangesteam'].some(m => moves.has(m)) &&
			(ability === 'Moody' || !isDoubles)
		) return 'Leftovers';
	}

	getLowPriorityItem(
		ability: string,
		types: Set<string>,
		moves: Set<string>,
		abilities: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
	): string | undefined {
		const defensiveStatTotal = species.baseStats.hp + species.baseStats.def + species.baseStats.spd;

		if (
			isLead && !isDoubles &&
			!['Disguise', 'Sturdy'].includes(ability) && !moves.has('substitute') &&
			!counter.get('drain') && !counter.get('recoil') && !counter.get('recovery') && defensiveStatTotal < 255
		) return 'Focus Sash';
		if (!isDoubles && ability === 'Water Bubble') return 'Mystic Water';
		if (
			moves.has('clangoroussoul') ||
			// We manually check for speed-boosting moves, rather than using `counter.get('speedsetup')`,
			// because we want to check for ANY speed boosting move.
			// In particular, Shift Gear + Boomburst Toxtricity should get Throat Spray.
			(moves.has('boomburst') && Array.from(moves).some(m => Dex.moves.get(m).boosts?.spe))
		) return 'Throat Spray';

		const rockWeaknessCase = (
			this.getSREffectiveness(species, ability) >= 1 &&
			(!teamDetails.defog || ability === 'Intimidate' || moves.has('uturn') || moves.has('voltswitch'))
		);
		const spinnerCase = (moves.has('rapidspin') && (ability === 'Regenerator' || !!counter.get('recovery')));
		// Glalie and Claydol prefer Leftovers
		if (
			!isDoubles && (rockWeaknessCase || spinnerCase) &&
			!['glalie', 'claydol'].includes(species.id)
		) return 'Heavy-Duty Boots';

		if (
			!isDoubles && this.dex.getEffectiveness('Ground', species) >= 2 && !types.has('Poison') &&
			ability !== 'Levitate' && !abilities.has('Iron Barbs')
		) return 'Air Balloon';
		if (
			!isDoubles &&
			counter.damagingMoves.size >= 3 &&
			!counter.get('damage') &&
			ability !== 'Multiscale' && ability !== 'Sturdy' &&
			(species.baseStats.spe >= 90 || !moves.has('voltswitch')) &&
			['foulplay', 'rapidspin', 'substitute', 'uturn'].every(m => !moves.has(m)) && (
				counter.get('speedsetup') ||
				// No Dynamax Buzzwole doesn't want Life Orb with Bulk Up + 3 attacks
				(counter.get('drain') && (species.id !== 'buzzwole' || moves.has('roost'))) ||
				moves.has('trickroom') || moves.has('psystrike') ||
				(species.baseStats.spe > 40 && defensiveStatTotal < 275)
			)
		) return 'Life Orb';
		if (
			!isDoubles &&
			counter.damagingMoves.size >= 4 &&
			!counter.get('Dragon') &&
			!counter.get('Normal')
		) {
			return 'Expert Belt';
		}
		if (
			!isDoubles &&
			!moves.has('substitute') &&
			(moves.has('dragondance') || moves.has('swordsdance')) &&
			(moves.has('outrage') || (
				['Bug', 'Fire', 'Ground', 'Normal', 'Poison'].every(type => !types.has(type)) &&
				!['Pastel Veil', 'Storm Drain'].includes(ability)
			))
		) return 'Lum Berry';
	}

	randomSet(
		species: string | Species,
		teamDetails: RandomTeamsTypes.TeamDetails = {},
		isLead = false,
		isDoubles = false
	): RandomTeamsTypes.RandomSet {
		species = this.dex.species.get(species);
		let forme = species.name;
		let gmax = false;

		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			forme = species.battleOnly;
		}
		if (species.cosmeticFormes) {
			forme = this.sample([species.name].concat(species.cosmeticFormes));
		}
		if (species.name.endsWith('-Gmax')) {
			forme = species.name.slice(0, -5);
			gmax = true;
		}

		const randMoves =
			(isDoubles && species.randomDoubleBattleMoves) ||
			species.randomBattleMoves;
		const movePool = (randMoves || Object.keys(this.dex.species.getLearnset(species.id)!)).slice();
		if (this.format.gameType === 'multi' || this.format.gameType === 'freeforall') {
			// Random Multi Battle uses doubles move pools, but Ally Switch fails in multi battles
			// Random Free-For-All also uses doubles move pools, for now
			const allySwitch = movePool.indexOf('allyswitch');
			if (allySwitch > -1) {
				if (movePool.length > 4) {
					this.fastPop(movePool, allySwitch);
				} else {
					// Ideally, we'll never get here, but better to have a move that usually does nothing than one that always does
					movePool[allySwitch] = 'sleeptalk';
				}
			}
		}
		const rejectedPool = [];
		let ability = '';
		let item = undefined;

		const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
		const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

		const types = new Set(species.types);
		const abilities = new Set(Object.values(species.abilities));

		let availableHP = 0;
		for (const setMoveid of movePool) {
			if (setMoveid.startsWith('hiddenpower')) availableHP++;
		}

		const moves = new Set<string>();
		let counter: MoveCounter;
		// We use a special variable to track Hidden Power
		// so that we can check for all Hidden Powers at once
		let hasHiddenPower = false;

		do {
			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			const pool = (movePool.length ? movePool : rejectedPool);
			while (moves.size < 4 && pool.length) {
				const moveid = this.sampleNoReplace(pool);
				if (moveid.startsWith('hiddenpower')) {
					availableHP--;
					if (hasHiddenPower) continue;
					hasHiddenPower = true;
				}
				moves.add(moveid);
			}

			counter = this.queryMoves(moves, species.types, abilities, movePool);
			const runEnforcementChecker = (checkerName: string) => {
				if (!this.moveEnforcementCheckers[checkerName]) return false;
				return this.moveEnforcementCheckers[checkerName](
					movePool, moves, abilities, types, counter, species as Species, teamDetails
				);
			};

			// Iterate through the moves again, this time to cull them:
			for (const moveid of moves) {
				const move = this.dex.moves.get(moveid);

				let {cull, isSetup} = this.shouldCullMove(
					move, types, moves, abilities, counter,
					movePool, teamDetails, species, isLead, isDoubles
				);

				if (move.id !== 'photongeyser' && (
					(move.category === 'Physical' && counter.setupType === 'Special') ||
					(move.category === 'Special' && counter.setupType === 'Physical')
				)) {
					// Reject STABs last in case the setup type changes later on
					const stabs = counter.get(species.types[0]) + (species.types[1] ? counter.get(species.types[1]) : 0);
					if (!types.has(move.type) || stabs > 1 || counter.get(move.category) < 2) cull = true;
				}

				// Pokemon should have moves that benefit their types, stats, or ability
				const isLowBP = move.basePower && move.basePower < 50;

				// Genesect-Douse should never reject Techno Blast
				const moveIsRejectable = !(species.id === 'genesectdouse' && move.id === 'technoblast') && (
					move.category === 'Status' ||
					!types.has(move.type) ||
					(isLowBP && !move.multihit && !abilities.has('Technician'))
				);
				// Setup-supported moves should only be rejected under specific circumstances
				const notImportantSetup = (
					!counter.setupType ||
					counter.setupType === 'Mixed' ||
					(counter.get(counter.setupType) + counter.get('Status') > 3 && !counter.get('hazards')) ||
					(move.category !== counter.setupType && move.category !== 'Status')
				);

				if (moveIsRejectable && (
					!cull && !isSetup && !move.weather && !move.stallingMove && notImportantSetup && !move.damage &&
					(isDoubles ? this.unrejectableMovesInDoubles(move) : this.unrejectableMovesInSingles(move))
				)) {
					// There may be more important moves that this Pokemon needs
					if (
						// Pokemon should have at least one STAB move
						(!counter.get('stab') && counter.get('physicalpool') + counter.get('specialpool') > 0 && move.id !== 'stickyweb') ||
						// Swords Dance Mew should have Brave Bird
						(moves.has('swordsdance') && species.id === 'mew' && runEnforcementChecker('Flying')) ||
						// Dhelmise should have Anchor Shot
						(abilities.has('Steelworker') && runEnforcementChecker('Steel')) ||
						// Check for miscellaneous important moves
						(!isDoubles && runEnforcementChecker('recovery') && move.id !== 'stickyweb') ||
						runEnforcementChecker('screens') ||
						runEnforcementChecker('misc') ||
						(isLead && runEnforcementChecker('lead')) ||
						(moves.has('leechseed') && runEnforcementChecker('leechseed'))
					) {
						cull = true;
					// Pokemon should have moves that benefit their typing
					} else if (move.id !== 'stickyweb') { // Don't cull Sticky Web in type-based enforcement
						for (const type of types) {
							if (runEnforcementChecker(type)) {
								cull = true;
							}
						}
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (move.id === 'rest' && cull) {
					const sleeptalk = movePool.indexOf('sleeptalk');
					if (sleeptalk >= 0) {
						if (movePool.length < 2) {
							cull = false;
						} else {
							this.fastPop(movePool, sleeptalk);
						}
					}
				}

				// Remove rejected moves from the move list
				const moveIsHP = moveid.startsWith('hiddenpower');
				if (cull && (
					movePool.length - availableHP ||
					(availableHP && (moveIsHP || !hasHiddenPower))
				)) {
					if (
						move.category !== 'Status' &&
						!move.damage &&
						!move.flags.charge &&
						(!moveIsHP || !availableHP)
					) {
						rejectedPool.push(moveid);
					}
					if (moveIsHP) hasHiddenPower = false;
					moves.delete(moveid);
					break;
				}

				if (cull && rejectedPool.length) {
					if (moveid.startsWith('hiddenpower')) hasHiddenPower = false;
					moves.delete(moveid);
					break;
				}
			}
		} while (moves.size < 4 && (movePool.length || rejectedPool.length));

		if (moves.has('workup') && !counter.get('Special') && species.id === 'zeraora') {
			moves.delete('workup');
			moves.add('bulkup');
		}

		const battleOnly = species.battleOnly && !species.requiredAbility;
		const baseSpecies: Species = battleOnly ? this.dex.species.get(species.battleOnly as string) : species;

		const abilityData = [...new Set(Object.values(baseSpecies.abilities))].map(a => this.dex.abilities.get(a));
		Utils.sortBy(abilityData, abil => -abil.rating);

		if (abilityData[1]) {
			// Sort abilities by rating with an element of randomness
			if (abilityData[2] && abilityData[1].rating <= abilityData[2].rating && this.randomChance(1, 2)) {
				[abilityData[1], abilityData[2]] = [abilityData[2], abilityData[1]];
			}
			if (abilityData[0].rating <= abilityData[1].rating) {
				if (this.randomChance(1, 2)) [abilityData[0], abilityData[1]] = [abilityData[1], abilityData[0]];
			} else if (abilityData[0].rating - 0.6 <= abilityData[1].rating) {
				if (this.randomChance(2, 3)) [abilityData[0], abilityData[1]] = [abilityData[1], abilityData[0]];
			}

			// Start with the first abiility and work our way through, culling as we go
			ability = abilityData[0].name;
			let rejectAbility = false;
			do {
				rejectAbility = this.shouldCullAbility(
					ability, types, moves, abilities, counter, movePool, teamDetails, species, isDoubles
				);

				if (rejectAbility) {
					// Lopunny, and other Facade users, don't want Limber, even if other abilities are poorly rated,
					// since paralysis would arguably be good for them.
					const limberFacade = moves.has('facade') && ability === 'Limber';

					if (ability === abilityData[0].name && (abilityData[1].rating >= 1 || limberFacade)) {
						ability = abilityData[1].name;
					} else if (ability === abilityData[1].name && abilityData[2] && (abilityData[2].rating >= 1 || limberFacade)) {
						ability = abilityData[2].name;
					} else {
						// Default to the highest rated ability if all are rejected
						ability = abilityData[0].name;
						rejectAbility = false;
					}
				}
			} while (rejectAbility);


			// Hardcode double ability megas
			if (species.id === 'slowbromega') {
				ability = 'Oblivious';
			} else if (species.id === 'gallademega') {
				ability = 'Steadfast';
			} else if (species.id === 'absolmega' && counter.get('blademaster') < 2) {
				ability = 'Pressure';
			}

			// Hardcoded abilities for certain contexts
			if (abilities.has('Guts') && (
				species.id === 'gurdurr' ||
				moves.has('facade') || (moves.has('rest') && moves.has('sleeptalk'))
			)) {
				ability = 'Guts';
			} else if (abilities.has('Moxie') && (counter.get('Physical') > 3 || moves.has('bounce')) && !isDoubles) {
				ability = 'Moxie';
			} else if (abilities.has('Super Luck') && item === 'Scope Lens') {
				ability = 'Super Luck';
			} else if (isDoubles) {
				if (abilities.has('Competitive') && ability !== 'Shadow Tag' && ability !== 'Strong Jaw') ability = 'Competitive';
				if (abilities.has('Friend Guard')) ability = 'Friend Guard';
				if (abilities.has('Gluttony') && moves.has('recycle')) ability = 'Gluttony';
				if (abilities.has('Guts') && ability !== 'Aerilate') ability = 'Guts';
				if (abilities.has('Harvest')) ability = 'Harvest';
				if (abilities.has('Healer') && (
					abilities.has('Natural Cure') ||
					(abilities.has('Aroma Veil') && this.randomChance(1, 2))
				)) ability = 'Healer';
				if (abilities.has('Intimidate')) ability = 'Intimidate';
				if (abilities.has('Klutz') && ability === 'Limber') ability = 'Klutz';
				if (abilities.has('Magic Guard') && ability !== 'Friend Guard' && ability !== 'Unaware') ability = 'Magic Guard';
				if (abilities.has('Ripen')) ability = 'Ripen';
				if (abilities.has('Stalwart')) ability = 'Stalwart';
				if (abilities.has('Storm Drain')) ability = 'Storm Drain';
				if (abilities.has('Telepathy') && (ability === 'Pressure' || abilities.has('Analytic'))) ability = 'Telepathy';
			}
		} else {
			ability = abilityData[0].name;
		}

		// item = !isDoubles ? 'Leftovers' : 'Sitrus Berry';
		if (species.requiredItems) {
			item = this.sample(species.requiredItems);
		// First, the extra high-priority items
		} else {
			item = this.getHighPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles);
			if (item === undefined && isDoubles) {
				item = this.getDoublesItem(ability, types, moves, abilities, counter, teamDetails, species);
			}
			if (item === undefined) {
				item = this.getMediumPriorityItem(ability, moves, counter, species, isLead, isDoubles);
			}
			if (item === undefined) {
				item = this.getLowPriorityItem(
					ability, types, moves, abilities, counter, teamDetails, species, isLead, isDoubles
				);
			}

			// fallback
			if (item === undefined) item = isDoubles ? 'Sitrus Berry' : 'Leftovers';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && types.has('Poison')) {
			item = 'Black Sludge';
		}

		let level: number;
		if (isDoubles && species.randomDoubleBattleLevel) {
			level = species.randomDoubleBattleLevel;
		} else {
			level = species.randomBattleLevel || 80;
		}

		// Prepare optimal HP
		const srImmunity = ['Magic Guard', 'Mountaineer', 'Shield Dust'].includes(ability) || item === 'Heavy-Duty Boots';
		const srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			const multipleOfFourNecessary = (moves.has('substitute') && (
				item === 'Sitrus Berry' ||
				item === 'Salac Berry' ||
				ability === 'Power Construct'
			));
			if (multipleOfFourNecessary) {
				// Two Substitutes should activate Sitrus Berry
				if (hp % 4 === 0) break;
			} else if (moves.has('bellydrum') && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else if (moves.has('substitute') && moves.has('reversal')) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		if (moves.has('shellsidearm') && item === 'Choice Specs') evs.atk -= 4;

		// Minimize confusion damage
		if (!counter.get('Physical') && !moves.has('transform') && (!moves.has('shellsidearm') || !counter.get('Status'))) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		// Ensure Nihilego's Beast Boost gives it Special Attack boosts instead of Special Defense
		if (forme === 'Nihilego') evs.spd -= 32;

		if (moves.has('gyroball') || moves.has('trickroom')) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		return {
			name: species.baseSpecies,
			species: forme,
			gender: species.gender,
			shiny: this.randomChance(1, 1024),
			gigantamax: gmax,
			level,
			moves: Array.from(moves),
			ability,
			evs,
			ivs,
			item,
		};
	}

	getPokemonPool(
		type: string,
		pokemonToExclude: RandomTeamsTypes.RandomSet[] = [],
		isMonotype = false,
	) {
		const exclude = pokemonToExclude.map(p => toID(p.species));
		const pokemonPool = [];
		for (let species of this.dex.species.all()) {
			if (species.gen > this.gen || exclude.includes(species.id)) continue;
			if (isMonotype) {
				if (!species.types.includes(type)) continue;
				if (typeof species.battleOnly === 'string') {
					species = this.dex.species.get(species.battleOnly);
					if (!species.types.includes(type)) continue;
				}
			}
			pokemonPool.push(species.id);
		}
		return pokemonPool;
	}

	randomTeam() {
		const seed = this.prng.seed;
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const typePool = this.dex.types.names();
		const type = this.forceMonotype || this.sample(typePool);

		// PotD stuff
		const usePotD = global.Config && Config.potd && ruleTable.has('potd');
		const potd = usePotD ? this.dex.species.get(Config.potd) : null;

		const baseFormes: {[k: string]: number} = {};
		let hasMega = false;

		const tierCount: {[k: string]: number} = {};
		const typeCount: {[k: string]: number} = {};
		const typeComboCount: {[k: string]: number} = {};
		const teamDetails: RandomTeamsTypes.TeamDetails = {};

		const pokemonPool = this.getPokemonPool(type, pokemon, isMonotype);
		while (pokemonPool.length && pokemon.length < this.maxTeamSize) {
			let species = this.dex.species.get(this.sampleNoReplace(pokemonPool));
			if (!species.exists) continue;

			// Check if the forme has moves for random battle
			if (this.format.gameType === 'singles') {
				if (!species.randomBattleMoves) continue;
			} else {
				if (!species.randomDoubleBattleMoves) continue;
			}

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) continue;

			// Limit one Mega per team
			if (hasMega && species.isMega) continue;

			// Adjust rate for species with multiple sets
			// TODO: investigate automating this by searching for Pokémon with multiple sets
			switch (species.baseSpecies) {
			case 'Arceus': case 'Silvally':
				if (this.randomChance(8, 9) && !isMonotype) continue;
				break;
			case 'Pikachu':
				if (this.randomChance(5, 6)) continue;
				break;
			case 'Oricorio':
				if (this.randomChance(3, 4)) continue;
				break;
			case 'Castform': case 'Floette':
				if (this.randomChance(2, 3)) continue;
				break;
			case 'Necrozma': case 'Calyrex':
				if (this.randomChance(2, 3)) continue;
				break;
			case 'Zacian': case 'Zamazenta': case 'Eternatus':
			case 'Urshifu': case 'Giratina': case 'Genesect':
			case 'Kyogre': case 'Groudon': case 'Dialga':
			case 'Aegislash': case 'Basculin': case 'Gourgeist':
			case 'Meloetta': case 'Magearna': case 'Darmanitan':
			case 'Greninja':
				if (this.randomChance(1, 2)) continue;
				break;
			}
			if (species.otherFormes && !hasMega && (
				species.otherFormes.includes(species.name + '-Mega') ||
				species.otherFormes.includes(species.name + '-Mega-X')
			)) {
				continue;
			}

			// Illusion shouldn't be on the last slot
			if (species.name === 'Zoroark' && pokemon.length >= (this.maxTeamSize - 1)) continue;
			// The sixth slot should not be Zacian/Zamazenta/Eternatus if a Zoroark is present
			if (
				pokemon.some(pkmn => pkmn.species === 'Zoroark') &&
				['Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Eternatus'].includes(species.name)
			) {
				continue;
			}

			let tier = species.tier;
			if (tier === 'UU') {
				const gen8species = Dex.species.get(species.id);
				const gen7species = Dex.mod('gen7').species.get(species.id);
				if (gen8species.exists && !gen8species.isNonstandard) {
					tier = gen8species.tier;
				} else if (gen7species.exists && !gen7species.isNonstandard) {
					tier = gen7species.tier;
				}
			}
			const types = species.types;
			const typeCombo = types.slice().sort().join();
			// Dynamically scale limits for different team sizes. The default and minimum value is 1.
			const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

			// Limit one Pokemon per tier, two for Monotype
			if (tierCount[tier] >= (this.forceMonotype || isMonotype ? 2 : 1) * limitFactor) {
				continue;
			}

			if (!isMonotype && !this.forceMonotype) {
				// Limit two of any type
				let skip = false;
				for (const typeName of types) {
					if (typeCount[typeName] >= 2 * limitFactor) {
						skip = true;
						break;
					}
				}
				if (skip) continue;
			}

			// Limit one of any type combination, two in Monotype
			if (!this.forceMonotype && typeComboCount[typeCombo] >= (isMonotype ? 2 : 1) * limitFactor) continue;

			// The Pokemon of the Day
			if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;

			const set = this.randomSet(species, teamDetails, pokemon.length === 0, this.format.gameType !== 'singles');

			const item = this.dex.items.get(set.item);

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			if (pokemon.length === this.maxTeamSize) {
				// Set Zoroark's level to be the same as the last Pokemon
				const illusion = teamDetails.illusion;
				if (illusion) pokemon[illusion - 1].level = pokemon[this.maxTeamSize - 1].level;

				// Don't bother tracking details for the last Pokemon
				break;
			}

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment tier counter
			if (tierCount[tier]) {
				tierCount[tier]++;
			} else {
				tierCount[tier] = 1;
			}

			// Increment type counters
			for (const typeName of types) {
				if (typeName in typeCount) {
					typeCount[typeName]++;
				} else {
					typeCount[typeName] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Track what the team has
			if (item.megaStone) hasMega = true;
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.moves.includes('sunnyday')) teamDetails.sun = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('hail')) teamDetails.hail = 1;
			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.moves.includes('spikes')) teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			if (set.moves.includes('stealthrock')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('toxicspikes')) teamDetails.toxicSpikes = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}

			// For setting Zoroark's level
			if (set.ability === 'Illusion') teamDetails.illusion = pokemon.length;
		}
		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
		}

		return pokemon;
	}
}

export default RandomRadicalRedTeams;
