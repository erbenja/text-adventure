import { getRandomMapEntry, getRandomInt } from './utils.js'
import { ENVIRONMENTS, ITEMS, DIRECTIONS, ENEMIES, NEUTRALS } from './data_sets.js'

export class Room {
    constructor(position, game) {
        //gets random environment
        this.env = new Environment();
        this.game = game;
        this.x = position.x;
        this.y = position.y;

        //setup based on given environment
        this.items = this.env.generateItems();
        this.enemies = this.env.generateEnemies();
        this.neutrals = this.env.generateNeutrals();
    }

    enemyOnPath(direction) {
        for (let [k, v] of this.enemies.entries()) {
            if (v.position === direction) {
                return k;
            }
        }
        return undefined;
    }

    toString() {
        let desc = this.env.name + ':';
        desc += "\n   enemies: ";
        this.enemies.forEach(e => desc += e.name + ", ");
        desc += "\n   neutrals: ";
        this.neutrals.forEach(e => desc += e.name + ", ");
        desc += "\n   items: ";
        this.items.forEach(e => desc += e.name + ", ");
        return desc;
    }

}

export class NPC {
    constructor(enemy = false, name = null) {
        this.enemy = enemy;
        this.position = getRandomMapEntry(DIRECTIONS).key;
        if (name == null) {
            if (enemy) {
                this.character = getRandomMapEntry(ENEMIES);
            } else {
                this.character = getRandomMapEntry(NEUTRALS);
            }
        }
        this.name = this.character.key;
        this.hp = getRandomInt(this.character.value.hpMax) + 1;
        this.behaviour = this.character.value.behaviour.getNewBehaviour();
        // console.log(this.behaviour);
    }

    getHit(damage, game) {
        // console.log(`HP: ${this.hp} > damage: ${damage}`);
        if ((this.hp - damage) <= 0) {
            return () => game.die(this);
        } else {
            this.hp -= damage;
            return () => game.hitSomeone(game.player, this);
        }
    }

    receiveItem(item, game) {
        const response = this.behaviour.receiveItem(item, game);
        if (response.action !== undefined) {
            response.action(this);
        }
        return response;
    }

    rollDamage() {
        // console.log(`${this.name} rolled ${damage}`);
        return getRandomInt(this.character.value.damage, 1);
    }
}

export class Environment {
    constructor(name = null) {
        if (name == null) {
            this.env = getRandomMapEntry(ENVIRONMENTS);
        }
        this.name = this.env.key;
    }

    generateItems() {
        return this.env.value.generateItems();
    }

    generateEnemies() {
        return this.env.value.generateEnemies();
    }

    generateNeutrals() {
        return this.env.value.generateNeutrals();
    }
}

export class Item {
    constructor(name = null) {
        if (name == null) {
            // let index = getRandomInt(ITEMS.length);
            // name = ITEMS.get('GOLD');
            this.item = getRandomMapEntry(ITEMS);
        } else {
            this.item = { key: name, value: ITEMS.get(name) };
        }
        this.name = this.item.key;
        this.uses = this.item.value.uses;
        this.strategy = this.item.value.strategy;
        this.consumable = this.item.value.consumable;
    }

    addUses(amount) {
        // console.log(`adding ${amount} to ${this.name} with ${this.uses} uses`);
        this.uses += amount;
        // console.log(`final uses: ${this.uses}`);
    }

    use(player, combat = false) {
        let message = this.strategy.use(player, combat);
        if (this.consumable) {
            this.addUses(-1);
            if (this.uses <= 0) {
                message += `\nYou have used up your ${this.name}s`;
            }
        }
        return message;
    }

    toString() {
        return `${this.name} : ${this.uses}x`;
    }
}