import { io } from "socket.io-client";
import { Swal } from 'sweetalert2';

export function createCardsObject(own, num = 0) {
    return {
        in_deck: own?[]:num, in_hand: [], in_front: [],
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

class Card {
    constructor(id, url, seted = false, rested = false) {
        this.id = id;
        this.url = url;
        this.seted = seted;
        this.rested = rested;
        this.cores = {
            commons: 0,
            soul: 0
        }
    }

    restUnrest() {
        this.rested = !this.rested;
    }

    setReveal() {
        this.seted = !this.seted;
    }
}

export function createCard(id, url, seted = false, rested = false) {
    return new Card(id, url, seted, rested);
}

export class socketCreator {
    constructor (deck_list, store, router) {
        this.deck_list = deck_list;
        this.chosen_deck = {};
        this.store = store;
        this.socket = new io('http://127.0.0.1:3000');

        this.socket.on('connect', () => {
            console.log("Connectd: ", this.socket.id);
        });

        this.socket.on('duel_start', ({ op_id, deck }) => {
            this.store.dispatch('addPlayers', op_id);
            this.store.commit('setChoosenDeck', deck);
            router.push('/game');
        });

        this.socket.on('socket_message', (msg) => {
            alert(msg.msg);
        });

        this.socket.on('draw_card', ({card, op_id}) => {
            store.dispatch('drawCard', {card, socket_id: op_id});
        });

        this.socket.on('move_card', info => {
            if (info.card) {
                info.card = createCard(info.card.id, info.card.url);
            }
            this.store.dispatch('moveCard', info);
        });

        this.socket.on('return_to_deck', info => {
            this.store.dispatch('returnToDeck', info);
        });

        this.socket.on('rest_unrest', info => {
            this.store.commit('restUnrest', info);
        });

        this.socket.on('looking_something', info => {
            this.store.commit('lookingSomething', info);
        });

        this.socket.on('flip_burst_card', info => {
            this.store.commit('flipBurstCard', info);
        });

        this.socket.on('move_cores', info => {
            this.store.dispatch('moveCores', info);
        });

        this.socket.on('increment_cores', info => {
            this.store.commit('incrementCores', info);
        });
    }

    setDeck(choosen_deck) {
        this.chosen_deck = this.deck_list.find(d => d.name == choosen_deck);
    }
}
