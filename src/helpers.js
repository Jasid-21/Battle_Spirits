import { io } from "socket.io-client";
import { Swal } from 'sweetalert2';

export function createCode(num) {
    const lower = 'abcdefghijklmnopqrstuvwxyz'; const upper = lower.toUpperCase();
    const numbers = '0123456789';               const total = lower + upper + numbers;
    var code = '';
    for (var i = 0; i < num; i++) {
        code += total[Math.floor(Math.random()*(total.length))];
    }
    return code;
}


export class socketCreator {
    constructor (deck_list, store, router) {
        this.deck_list = deck_list;
        this.chosen_deck = {};
        this.store = store;
        this.socket = new io('http://127.0.0.1:3000');

        this.socket.on('connect', () => {
            console.log("Connectd...");
        });

        this.socket.on('duel_start', (info) => {
            // Storing deck.
            store.commit('setChoosenDeck', this.chosen_deck);
    
            // Storing oponents socket id.
            const op_id = info.op_id;
            store.commit('setOpId', op_id);
    
            // Entering to the game.
            router.push('/game');
        });

        this.socket.on('socket_message', (msg) => {
            Swal.fire({
            title: 'Socket server message',
            text: msg.msg
            });
        });

        this.socket.on('summon_card', (info) => {
            const card_class = info.card_class;
            const place = info.place;

            store.dispatch('placeCard', {destiny: place, card_class});
        });

        this.socket.on('rest_unrest', ({card_id, place}) => {
            store.dispatch('restUnrest', {card_id, place});
        });
    }

    setDeck(choosen_deck) {
        this.chosen_deck = this.deck_list.find(d => d.name == choosen_deck);
    }

    sendSummonCard(place, card_class, op_id) {
        this.socket.emit('summon_card', {place, card_class, op_id});
    }

    sendRestUnrest(card_id, place, op_id) {
        this.socket.emit('rest_unrest', {card_id, place, op_id});
    }
}
