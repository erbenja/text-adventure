import { getRandomInt } from "../utils.js";

export class GoldStrategy {
    constructor() {}

    use(player, combat = false) {
        const head = 50 < getRandomInt(100);
        return `You have flipped ${head ? 'head' : 'tail'}.`;
    }
}

export class KeyStrategy {
    constructor() {}

    use(player, combat = false) {
        return `I wonder what it is from?? Hmmm.`;
    }
}

export class PotionStrategy {
    constructor() {}

    use(player, combat = false) {
        const weird = 10 < getRandomInt(100);
        let message = '';
        if (weird) {
            message = 'You feel kind of weird, but nothing else happened.'
        } else {
            const hpBoost = getRandomInt(5, 1);
            player.hp += hpBoost;
            message = `You have healed up for ${hpBoost}.`;
        }
        return message;
    }
}

export class SwordStrategy {
    constructor() {}

    use(player, combat = false) {
        const clumsy = 70 < getRandomInt(100);
        let message = ''
        if (clumsy) {
            message = 'You have dropped your sword and it got all dirty. :('
        } else {
            message = 'You have flipped the sword behind you back and caught it on your finger. Very impressive indeed. Clap clap clap.'
        }
        return message;
    }
}