import { getRandomInt, createArray } from './utils.js'
import { Item, Room } from './generic_models.js'
import { DIRECTIONS, ACTIONS, PREPOSITIONS, HIGHLIGHTS_REGEX } from './data_sets.js'

//Document Elements
const PLAYER_INPUT = document.querySelector('#command-input');
const RESPONSE_BOX = document.querySelector('#response-box');
const DIFFICULTY_SLIDER = document.querySelector('#difficulty-slider');
const NEW_GAME = document.querySelector('#new-game-button');

PLAYER_INPUT.addEventListener('keyup', function(e) {
    if (PLAYER_INPUT.focus) {
        if (e.key === 'Enter') {
            const inputText = PLAYER_INPUT.value;
            if (inputText !== '') {
                addTextToBox('> ' + inputText);
                PLAYER_INPUT.value = '';
                if (typeof game !== 'undefined') {
                    game.handleCommand(inputText);
                } else {
                    alert('Please reload the game. Something broke down. ' +
                        '\nIf the issue persist please contact the developer.');
                }
                addTextToBox('');
            }
        }
    }
});

NEW_GAME.addEventListener('click', function() {
    const difficulty = DIFFICULTY_SLIDER.value;
    const maxDif = DIFFICULTY_SLIDER.max;
    if (confirm(`Do you want to start a new game?\n Chosen difficulty: ${difficulty} / ${maxDif}`)) {
        game = new Game(difficulty);
    }
    // game.printGrid();
});


function resetResponseBox() {
    RESPONSE_BOX.innerHTML = '';
}

function highlight_text(text, regExp = HIGHLIGHTS_REGEX) {
    return text.replace(new RegExp(regExp, 'gi'), tag => `<${tag}>${tag}</${tag}>`);
}

function addTextToBox(text) {
    // const highlightedText = string.replace('GOLD', "<gold>GOLD</gold>")
    const div = document.createElement('div');
    div.classList.add('post');
    if (Array.isArray(text)) {
        text.forEach(arr => {
            const subDiv = document.createElement('div');
            if (Array.isArray(arr)) {
                console.log(arr);
                arr.forEach((item, index) => {
                    const endChar = index === 0 ? ':' : index < arr.length - 1 ? ',' : '';
                    subDiv.innerHTML += `${highlight_text(item)}${endChar} `;
                })
            } else {
                subDiv.innerHTML += highlight_text(arr);
            }
            div.appendChild(subDiv);
        })
    } else {
        div.innerHTML += highlight_text(text);
    }

    RESPONSE_BOX.appendChild(div);
    RESPONSE_BOX.scrollTop = RESPONSE_BOX.scrollHeight;
}


//GAME 'ENGINE'
class Game {
    constructor(difficulty, size = 10) {
        resetResponseBox();
        this.size = size;
        this.grid = createArray(size, size);
        this.roomCount = Math.floor((size * size) / 5);

        //generating random rooms
        const position = this.travelerRoomFiller(this.roomCount);
        this.roomCount = this.grid.flat().filter(a => a !== undefined).length;

        this.winGoldCount = this.roomCount * difficulty;

        this.player = new Player(position, this);
        // console.log(this.player.position);
        // this.randomRoomFiller();
        addTextToBox(`Welcome adventurer! ` +
            `\n Your goal is to collect ${this.winGoldCount} pieces of GOLD. ` +
            `You can hustle, kill, steal or be nice to everyone but everything comes with a price. ` +
            `Once you finish you journey you will be crowned the king of this world. ` +
            `\n  Your start with ${this.player.hp} HP and empty pockets. ` +
            `\n  Good luck \n`);
    }

    //general for creating new Command instance and then resolving action
    handleCommand(string) {
        //fixing touch input
        if (string[string.length - 1] === ' ') {
            string = string.substring(0, string.length - 1);
        }

        const command = new Command(string, this);
        if (command.isValid()) {
            // console.log(command);
            command.act();
        } else {
            addTextToBox('Command is not valid');
        }
    }

    //--ACTING IN GAME WORLD--
    //most of them are for player interaction

    //checking if move is possible then moving or not
    movePlayer(position, direction) {
        const room = this.getRoom(this.player.position);
        const enemy = room.enemyOnPath(direction);
        if (enemy === undefined) {
            if (this.isPositionInBound(position)) {
                if (this.isThereRoom(position)) {
                    addTextToBox('You have moved to desired location');
                    this.player.setPosition(position);
                } else {
                    addTextToBox('There is nothing but emptiness and despair');
                }
            } else {
                addTextToBox('Seems like you have traveled to the end of the world');
            }
        } else {
            addTextToBox(`There is ${enemy} blocking further travel`);
        }
    }

    pickUpItem(item) {
        const pos = this.player.position;
        const room = this.grid[pos.x][pos.y];
        if (room.items.has(item)) {
            const itemInst = room.items.get(item);
            this.player.addItem(itemInst);
            room.items.delete(item);
            addTextToBox(`You have picked up a ${item}`);
        } else {
            addTextToBox(`There is not a ${item} nowhere near you`);
        }
    }

    giveItem(item, receiver) {
        const room = this.getRoom(this.player.position);
        const char = this.getCharInRoom(receiver, room);
        if (char !== undefined) {
            const response = this.player.giveItem(item);
            if (response) {
                addTextToBox(`You gave up your ${item} to ${receiver}`);
                const response = char.receiveItem(item, this);
                addTextToBox(response.message);
            } else {
                addTextToBox(`You carry no ${item} in you pockets`);
            }
        } else {
            addTextToBox(`There is no ${receiver} near you.`)
        }
    }

    useItem(item) {
        const response = this.player.useItem(item);
        addTextToBox(response.message);
    }

    hitSomeone(target, attacker) {
        // console.log(attacker);
        // debugger;
        const damage = attacker.rollDamage();
        if (attacker === this.player) {
            const room = this.getRoom(this.player.position);
            const targetChar = this.getCharInRoom(target, room);
            if (targetChar !== undefined) {
                addTextToBox(`You have hit ${target} for ${damage} damage`);
                const responseAction = targetChar.getHit(damage, this);
                // room.enemies.get(target).getHit(damage, this);
                responseAction();
                // } else if (room.neutrals.has(target)) {
                //     room.neutrals.get(target).getHit(damage, this);
                //     addTextToBox(`You have hit ${target} for ${damage} damage`);
            } else {
                addTextToBox(`There is no ${target} in this ${room.env.name}`);
            }
        } else {
            addTextToBox(`${attacker.name} hit you for ${damage} damage`);
            this.player.getHit(damage, this);
        }
    }

    talkToSomeone(target) {
        const pos = this.player.position;
        const room = this.getRoom(pos);
        const char = this.getCharInRoom(target, room)
        if (char !== undefined) {
            const response = char.behaviour.talk();
            addTextToBox(`${target}: ${response}`);
        } else {
            addTextToBox(`There is not a ${target} nowhere near you`);
        }
    }

    showInventory() {
        const desc = this.player.getInventoryDesc();
        const prefix = 'Inventory: ';
        addTextToBox(prefix + desc);
    }

    lookAround() {
        const pos = this.player.position;
        const desc = this.grid[pos.x][pos.y].toString();
        addTextToBox(desc);
    }


    //--GAME STATE CHANGING--

    gameOver() {
        addTextToBox('');
        addTextToBox('YOU DIED - next journey might be the ONE');
        PLAYER_INPUT.disabled = true;
    }

    gameWin() {
        addTextToBox('');
        addTextToBox('YOU WON - may your legend live forever');
        PLAYER_INPUT.disabled = true;
    }

    checkWinCondition() {
        if (this.player.inventory.has('GOLD')) {
            const goldCount = this.player.inventory.get('GOLD').uses;
            if (goldCount >= this.winGoldCount) {
                this.gameWin();
            }
        }
    }


    //NPC died player gets reward
    die(char) {
        const goldCount = char.character.value.behaviour.die();
        addTextToBox(`You have ${char.enemy ? 'defeated' : 'murdered'} ${char.name}. Looted the corpse for ${goldCount}x GOLD.`);

        this.removeNPCFromPlayerRoom(char);

        const gold = new Item('GOLD');
        for (let i = 0; i < goldCount; i++) {
            // console.log(`adding gold`);
            this.player.addItem(gold);
        }
    }

    //NPC left the world without reward
    leave(char) {
        addTextToBox(`${char.name} has left this room.`);
        this.removeNPCFromPlayerRoom(char);
    }

    removeNPCFromPlayerRoom(char) {
        const room = this.getRoom(this.player.position);
        if (room.enemies.has(char.name)) {
            room.enemies.delete(char.name);
        } else {
            room.neutrals.delete(char.name);
        }
    }

    //GENERATING ROOMS IN WORLD
    travelerRoomFiller(roomCount) {
        let x = Math.floor(this.size / 2);
        let y = x;

        while (roomCount > 0) {
            const direction = getRandomInt(4);
            let newPos = { x, y };
            switch (direction) {
                case 0:
                    {
                        newPos = { x, y: y + 1 };
                        break;
                    }
                case 1:
                    {
                        newPos = { x: x + 1, y };
                        break;
                    }
                case 2:
                    {
                        newPos = { x, y: y - 1 };
                        break;
                    }
                case 3:
                    {
                        newPos = { x: x - 1, y };
                        break;
                    }
            }

            if (this.isPositionInBound(newPos)) {
                if (!this.isThereRoom(newPos)) {
                    x = newPos.x;
                    y = newPos.y;
                    this.grid[x][y] = new Room({ x, y }, this);

                    if (this.isTrapped({ x, y })) {
                        break;
                    }
                    roomCount -= 1;
                }
            }
        }
        return { x, y };
    }

    //for rooms generating travelerRoomFiller()
    isTrapped(pos) {
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                let curPosition = { x: pos.x + x, y: pos.y + y };
                if (this.isPositionInBound(curPosition)) {
                    if (!this.isThereRoom(curPosition)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //unused generating rooms in world
    randomRoomFiller() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const createRoom = getRandomInt(10) > 5;
                if (createRoom) {
                    this.grid[x][y] = new Room({ x, y }, this);
                }
            }
        }
    }

    isPositionInBound(pos) {
        return pos.x < this.size &&
            pos.x >= 0 &&
            pos.y < this.size &&
            pos.y >= 0;
    }

    isThereRoom(pos) {
        return this.getRoom(pos) !== undefined
    }

    getRoom(pos) {
        return this.grid[pos.x][pos.y];
    }

    getCharInRoom(receiver, room) {
        if (room.enemies.has(receiver)) {
            return room.enemies.get(receiver);
        } else if (room.neutrals.has(receiver)) {
            return room.neutrals.get(receiver);
        }
        return undefined;
    }

    //DEV ONLY
    printGrid() {
        for (let y = this.size - 1; y >= 0; y--) {
            let string = '';
            for (let x = 0; x < this.size; x++) {
                if (this.isThereRoom({ x, y })) {
                    string += `[${x},${y}]`;
                } else {
                    string += `[ , ]`;
                }
            }
            console.log(string);
        }
    }
}

//PLAYER CHARACTER
class Player {
    constructor(pos, game) {
        this.inventory = new Map();
        this.hp = 5;
        this.position = pos;
        this.game = game;
    }

    setPosition(newPos) {
        this.position.x = newPos.x;
        this.position.y = newPos.y;
    }

    giveItem(item) {
        if (this.inventory.has(item)) {
            const i = this.inventory.get(item);
            i.addUses(-1);
            if (i.uses <= 0 || item === 'SWORD') {
                this.inventory.delete(item);
            }
            return true;
        } else {
            return false;
        }
    }

    addItem(item) {
        // console.log('adding item');
        // console.log(item);
        if (this.inventory.has(item.name)) {
            const i = this.inventory.get(item.name);
            i.addUses(item.uses);
        } else {
            this.inventory.set(item.name, item);
        }

        if (item.name === 'GOLD') {
            this.game.checkWinCondition();
        }
    }

    useItem(item, combat = false) {
        if (this.inventory.has(item)) {
            const i = this.inventory.get(item);
            const message = i.use(this, combat);
            if (i.uses === 0) {
                this.inventory.delete(item);
            }
            return { result: true, message };
        } else {
            return { result: false, message: `You carry no ${item} in you pockets` };
        }
    }


    //intetory to text
    getInventoryDesc() {
        let desc = '';
        if (this.inventory.size <= 0) {
            return 'nothing in your pockets';
        }
        this.inventory.forEach((v, k) => {
            desc += `\n   ${v.toString()}`;
        });
        return desc;
    }

    getHit(damage, game) {
        if ((this.hp - damage) <= 0) {
            game.gameOver();
        } else {
            this.hp -= damage;
        }
    }

    rollDamage() {
        let damage;
        if (this.useItem('SWORD', true).result) {
            damage = getRandomInt(5, 3);
        } else {
            damage = getRandomInt(2, 1);
        }
        // console.log(`You have rolled ${damage}`);
        return damage;
    }
}


//COMMAND HANDLING CLASS
class Command {
    constructor(string, game) {
        this.valid = true;
        this.game = game;
        string = string.toUpperCase();
        const parsed = string.split(' ');
        this.actionString = parsed[0];
        if (!ACTIONS.includes(this.actionString)) {
            this.valid = false;
            return;
        }
        switch (this.actionString) {
            case 'MOVE':
                {
                    if (parsed.length === 2) {
                        this.direction = parsed[1];

                        if (DIRECTIONS.has(this.direction)) {
                            const newPos = { x: this.game.player.position.x, y: this.game.player.position.y };
                            switch (this.direction) {
                                case 'NORTH':
                                    {
                                        newPos.y += 1;
                                        break;
                                    }
                                case 'EAST':
                                    {
                                        newPos.x += 1;
                                        break;
                                    }
                                case 'SOUTH':
                                    {
                                        newPos.y -= 1;
                                        break;
                                    }
                                case 'WEST':
                                    {
                                        newPos.x -= 1;
                                        break;
                                    }
                            }

                            // console.log('Player position:')
                            // console.log(this.game.player.position);
                            // console.log(newPos);

                            this.act = () => {
                                this.game.movePlayer(newPos, this.direction);
                            };
                            break;
                        }
                    }
                    this.valid = false;
                    break;
                }
            case 'LOOK':
                {
                    if (parsed.length === 1) {
                        this.act = () => {
                            this.game.lookAround();
                        };
                        break;
                    }
                    this.valid = false;
                    break;
                }
            case 'HIT':
                {
                    if (parsed.length === 2) {
                        this.target = parsed[1];
                        this.act = () => {
                            this.game.hitSomeone(this.target, this.game.player);
                        };
                        break;
                    }
                    this.valid = false;
                    break;
                }
            case 'TALK':
                {
                    if (parsed.length === 3) {
                        this.junction = parsed[1];
                        if (PREPOSITIONS.includes(this.junction)) {
                            if (this.junction === 'TO') {
                                this.target = parsed[2];
                                this.act = () => {
                                    this.game.talkToSomeone(this.target);
                                };
                                break;
                            }
                        }
                    }
                    this.valid = false;
                    break;
                }
            case 'INVENTORY':
                {
                    if (parsed.length === 1) {
                        this.act = () => {
                            this.game.showInventory();
                        };
                        break;
                    }
                    this.valid = false;
                    break;
                }
            case 'PICK':
                {
                    if (parsed.length === 3) {
                        this.junction = parsed[1];
                        if (PREPOSITIONS.includes(this.junction)) {
                            if (this.junction === 'UP') {
                                this.item = parsed[2];
                                this.act = () => {
                                    this.game.pickUpItem(this.item);
                                };
                                break;
                            }
                        }
                    }
                    this.valid = false;
                    break;
                }
            case 'USE':
                {
                    if (parsed.length === 2) {
                        this.item = parsed[1];
                        this.act = () => {
                            this.game.useItem(this.item);
                        };
                        break;
                    }
                    this.valid = false;
                    break;
                }
            case 'GIVE':
                {
                    if (parsed.length === 4) {
                        this.item = parsed[1];
                        if (parsed[2] === 'TO') {
                            this.receiver = parsed[3];
                            this.act = () => {
                                this.game.giveItem(this.item, this.receiver);
                            };
                            break;
                        }
                    }
                    this.valid = false;
                    break;
                }
            default:
                {
                    this.valid = false;
                }
        }
    }

    isValid() {
        return this.valid;
    }

    //THIS METHOD SHOULD BE OVERRIDEN WHEN COMMAND IS HANDLED
    act() {
        console.log('UNCHANGED ACT METHOD IN COMMAND');
    }
}


//GAME INIT
let game = new Game(DIFFICULTY_SLIDER.value, 10);