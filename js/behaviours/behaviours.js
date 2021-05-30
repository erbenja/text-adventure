import { getRandomInt } from "../utils.js";

export class Behaviour {
    constructor(dialogs, damage, dropMax) {
        // console.log(`dmg: ${damage} | dropMax: ${dropMax}`);
        this.dialogs = dialogs;
        this.damage = damage;
        this.dropMax = dropMax;
        this.dropGold = getRandomInt(this.dropMax + 1, 1);
    }

    attack() {
        return getRandomInt(this.damage + 1);
    };

    talk() {
        return this.dialogs[getRandomInt(this.dialogs.length)];
    };

    receiveItem(item, game) {
        console.log('---UNCHANGED RECEIVE ITEM---');
    };

    die() {
        return this.dropGold;
    };
}


export class WolfBehaviour extends Behaviour {
    constructor(damage, dropMax) {
        const dialogs = ['Woof', 'Howl'];
        super(dialogs, damage, dropMax);
    }

    receiveItem(item, game) {
        if (item === 'POTION') {
            return { message: 'Howl......', action: (char) => game.die(char) };
        }
        return { message: 'Woof!! Woof!' };
    }

    //to have random gold drop count
    getNewBehaviour() {
        return new WolfBehaviour(this.damage, this.dropMax);
    };
}

export class BanditBehaviour extends Behaviour {
    constructor(damage, dropMax) {
        const dialogs = [
            'Give me all your money!!!',
            'Life or gold. Your choice. oX'
        ];
        super(dialogs, damage, dropMax);
    }

    receiveItem(item, game) {
        if (item === 'GOLD' || item === 'SWORD') {
            return { message: 'Bandit has peacefully left this area.', action: (char) => game.leave(char) };
        }
        return { message: 'Are you making a joke of me?' };
    }

    //to have random gold drop count
    getNewBehaviour() {
        return new BanditBehaviour(this.damage, this.dropMax);
    };
}

export class TravelerBehaviour extends Behaviour {
    constructor(damage, dropMax) {
        const dialogs = [
            'I have journeyed many worlds but this one seems particularly interesting.',
            'Traveling is my life.',
            'I feel weak. Vital boost would be great.'
        ];
        super(dialogs, damage, dropMax);
    }

    receiveItem(item, game) {
        if (item === 'POTION') {
            return {
                message: 'That is what i needed. Here have my sword as a thanks.',
                action: () => game.player.addItem(new Item('SWORD'))
            };
        }
        return { message: 'Thank you for you precious gift.' };
    }

    //to have random gold drop count
    getNewBehaviour() {
        return new TravelerBehaviour(this.damage, this.dropMax);
    };
}

export class MonkBehaviour extends Behaviour {
    constructor(damage, dropMax) {
        const dialogs = [
            'Bless you.',
            'Some paths on our journeys are locked some are not.',
            'Our church needs every help it can get.'
        ];
        super(dialogs, damage, dropMax);
    }

    receiveItem(item, game) {
        if (item === 'KEY') {
            return {
                message: 'Is that THE KEY?... Here have some boost.',
                action: () => game.player.addItem(new Item('POTION'))
            };
        }
        if (item === 'GOLD') {
            return {
                message: 'Let this blessing keep you on your feet.',
                action: () => game.player.hp += 2
            }
        }
        return { message: 'Thank you for you precious gift. But i do not have much of a use for it' };
    }

    //to have random gold drop count
    getNewBehaviour() {
        return new MonkBehaviour(this.damage, this.dropMax);
    };
}

export class ShopkeeperBehaviour extends Behaviour {
    constructor(damage, dropMax) {
        const dialogs = [
            'Welcome to my little shop.',
            'I will buy anything. But pricing may vary region by region.'
        ];
        super(dialogs, damage, dropMax);
    }

    receiveItem(item, game) {
        if (item === 'KEY') {
            return {
                message: 'Kind of rusty but still a nice pice of metal. Here have 1x GOLD',
                action: () => this.giveCoins(2, game)
            };
        }
        if (item === 'GOLD') {
            return {
                message: 'Coin for coin. That is weird but deal is a deal',
                action: () => this.giveCoins(1, game)
            };
        }
        if (item === 'SWORD') {
            return {
                message: 'That is beautiful craftsmanship. Here have 3x GOLD',
                action: () => this.giveCoins(3, game)
            };
        }
        if (item === 'POTION') {
            return {
                message: 'Drug are hard to come by in this part of world. Here have 2x GOLD',
                action: () => this.giveCoins(2, game)
            };
        }
        return { message: 'Let me have a look on it.' };
    }

    giveCoins(amount, game) {
        while (amount > 0) {
            game.player.addItem(new Item('GOLD'));
            amount -= 1;
        }
    }

    //to have random gold drop count
    getNewBehaviour() {
        return new ShopkeeperBehaviour(this.damage, this.dropMax);
    }
}