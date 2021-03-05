import { Item } from "../generic_models.js";
import { NPC } from '../generic_models.js';


export class EnvironmentStrategy {
    constructor(itemCount = 1, enemyCount = 1, neutralCount = 1) {
        this.itemCount = itemCount;
        this.enemyCount = enemyCount;
        this.neutralCount = neutralCount;
    }

    generateItems() {
        const items = new Map();
        let itemCount = this.itemCount;
        while (itemCount > 0) {
            const newItem = new Item();
            if (!items.has(newItem.name)) {
                items.set(newItem.name, newItem);
            }
            itemCount -= 1;
        }
        return items;
    }

    generateEnemies() {
        const enemies = new Map();
        let enemyCount = this.enemyCount;
        while (enemyCount > 0) {
            const newNPC = new NPC(true);
            if (!enemies.has(newNPC.name)) {
                enemies.set(newNPC.name, newNPC);
            }
            enemyCount -= 1;
        }
        return enemies;
    }

    generateNeutrals() {
        const neutrals = new Map();
        let neutralCount = this.neutralCount;
        while (neutralCount > 0) {
            // debugger;
            const newNPC = new NPC(false);
            if (!neutrals.has(newNPC.name)) {
                neutrals.set(newNPC.name, newNPC);
            }
            neutralCount -= 1;
        }
        return neutrals;
    }
}



export class ForestStrategy extends EnvironmentStrategy {
    constructor(itemCount = 2, enemyCount = 3, neutralCount = 1) {
        super(itemCount, enemyCount, neutralCount);
    }
}

export class SwampStrategy extends EnvironmentStrategy {
    constructor(itemCount = 1, enemyCount = 4, neutralCount = 1) {
        super(itemCount, enemyCount, neutralCount);
    }
}

export class FieldStrategy extends EnvironmentStrategy {
    constructor(itemCount = 2, enemyCount = 1, neutralCount = 1) {
        super(itemCount, enemyCount, neutralCount);
    }
}