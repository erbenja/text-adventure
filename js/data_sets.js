import { ForestStrategy, SwampStrategy, FieldStrategy } from './strategies/environment_strategies.js'
import { GoldStrategy, KeyStrategy, SwordStrategy, PotionStrategy } from './strategies/item_strategies.js';
import { WolfBehaviour, BanditBehaviour, MonkBehaviour, TravelerBehaviour, ShopkeeperBehaviour } from './behaviours/behaviours.js';

//DATA SETS DECLARATION
export const ENVIRONMENTS = new Map([
    ['FOREST', new ForestStrategy()],
    ['SWAMP', new SwampStrategy()],
    ['FIELD', new FieldStrategy()]
]);
export const ITEMS = new Map([
    ['GOLD', { uses: 1, consumable: false, strategy: new GoldStrategy() }],
    ['KEY', { uses: 1, consumable: false, strategy: new KeyStrategy() }],
    ['SWORD', { uses: 10, consumable: true, strategy: new SwordStrategy() }],
    ['POTION', { uses: 1, consumable: true, strategy: new PotionStrategy() }]
]);
export const ENEMIES = new Map([
    ['WOLF', { hpMax: 2, damage: 2, dropMax: 1, behaviour: new WolfBehaviour(2, 1) }],
    ['BANDIT', { hpMax: 3, damage: 3, dropMax: 3, behaviour: new BanditBehaviour(3, 3) }]
]);
export const NEUTRALS = new Map([
    ['MONK', { hpMax: 5, damage: 0, dropMax: 0, behaviour: new MonkBehaviour(0, 0) }],
    ['TRAVELER', { hpMax: 15, damage: 5, dropMax: 2, behaviour: new TravelerBehaviour(5, 2) }],
    ['SHOPKEEPER', { hpMax: 20, damage: 8, dropMax: 5, behaviour: new ShopkeeperBehaviour(8, 5) }]
]);

export const ACTIONS = ['MOVE', 'PICK', 'USE', 'TALK', 'GIVE', 'HIT', 'LOOK', 'INVENTORY'];
export const PREPOSITIONS = ['UP', 'TO'];
export const DIRECTIONS = new Map([
    ['NORTH', 0],
    ['EAST', 1],
    ['SOUTH', 2],
    ['WEST', 3]
]);

export const HIGHLIGHTS = [...ITEMS.keys(), ...ENEMIES.keys(), ...NEUTRALS.keys(), ...ENVIRONMENTS.keys(), 'HP'];
export const HIGHLIGHTS_REGEX = `(${HIGHLIGHTS.join(')|(')})`;