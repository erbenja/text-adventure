//UTILS FOR GAME CREATING
export function getRandomMapEntry(map) {
    let index = getRandomInt(map.size);
    for (let key of map.keys()) {
        if (index <= 0) {
            return { key, value: map.get(key) };
        }
        index--;
    }
}

export function getRandomInt(max, min = 0) {
    return Math.max(Math.floor(Math.random() * Math.floor(max)), min);
}

export function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}