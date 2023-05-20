export function createCardsObject() {
    return {
        in_deck: [], in_hand: [], in_front: [],
        in_middle: [], in_back: [], in_trash: [],
        in_burst: {}
    }
};

export function createCoresObject() {
    return {
        in_trash: {
            soul: 0,
            commons: 0
        },

        in_reserve: {
            commons: 3,
            soul: 1
        }
    }
}

export function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

export function createCode(num) {
    const lower = 'abcdefghijklmnopqrstuvwxyz'; const upper = lower.toUpperCase();
    const numbers = '0123456789';               const total = lower + upper + numbers;
    var code = '';
    for (var i = 0; i < num; i++) {
        code += total[Math.floor(Math.random()*(total.length))];
    }
    return code;
}



export function createCard(id, url, seted = false, rested = false) {
    return new Card(id, url, seted, rested);
}