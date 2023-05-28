const droppeableForCards = ['in_hand', 'in_front', 'in_middle', 
'in_back', 'in_burst', 'in_deck', 'in_trash', 'in_reveal'];
const droppeableForCores = ['in_trash', 'in_reserve', 'in_life', 'in_void'];

export function createCardsObject() {
    return {
        in_deck: [], in_hand: [], in_front: [],
        in_middle: [], in_back: [], in_trash: [],
        in_reveal: [], in_burst: {}
    }
};

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

export function dropCard(ev, player_org, player_dest, destiny, store) {
    return new Promise((resolve, reject) => {
        const validPlace = droppeableForCards.some(p => p == destiny);
        if (!validPlace) { return; };

        const player_org = ev.dataTransfer.getData('player_org');
        const origin = ev.dataTransfer.getData('card_origin');
        const card_id = ev.dataTransfer.getData('card_id');

        const params = { origin, destiny, player_dest, player_org, card_id };
        store.dispatch('moveCard', params)
        .then(moved => resolve({ moved, params }));
    });
}

export function dropCores(ev, card_id_dest, player_dest, destiny, store) {
    return new Promise((resolve, reject) => {
        const validPlace = droppeableForCores.some(p => p == destiny);
        if (!validPlace && !card_id_dest) { return; };

        const origin = ev.dataTransfer.getData('origin');
        const player_org = ev.dataTransfer.getData('player_org');
        const card_id_org = ev.dataTransfer.getData('card_id');

        const params = { player_org, player_dest, origin, destiny, 
        card_id_org, card_id_dest };
        store.dispatch('moveCores', params)
        .then(({ moved, core_ids }) => resolve({ moved, params, core_ids }));
    });
}

export function showCardDisplayer(origin, player, store, socket, op_id) {
    const params = { origin, status: true, player };

    store.commit('changeDisplayerStatus', params);
    store.commit('lookingSomething', {...params, op_id});
    socket.emit('looking_something', {...params, op_id});
}
