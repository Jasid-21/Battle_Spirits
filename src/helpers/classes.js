import { io } from "socket.io-client";

export class Card {
    constructor(id, url) {
        this.id = id; this.url = url;
        this.seted = false; this.rested = false;
        this.cores = []
    }

    restUnrest() {
        this.rested = !this.rested;
    }

    setReveal() {
        this.seted = !this.seted;
    }
}

export class Core {
    constructor(id, soul = false) {
        this.id = id;
        this.soul = soul;
        this.selected = false;
    }
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

        this.socket.on('duel_start', ({ op_id, deck, op_deck, cores, op_cores, active }) => {
            this.store.dispatch('addPlayers', { op_id, active });
            this.store.commit('setChoosenDecks', { deck, op_deck });
            this.store.commit('setCores', { cores, op_cores });
            router.push('/game');
        });

        this.socket.on('socket_message', (msg) => {
            alert(msg.msg);
        });

        this.socket.on('draw_card', info => {
            store.dispatch('drawCard', info);
        });

        this.socket.on('move_card', info => {
            console.log(info);
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

        this.socket.on('change_phase', info => {
            this.store.dispatch('changePhase', info);
        });

        this.socket.on('change_turn', () => {
            this.store.commit('changeTurn');
        });

        this.socket.on('refresh_all', info => {
            this.store.commit('refreshAllCards', info);
            this.store.commit('refreshAllCores', info);
        });
    }

    setDeck(choosen_deck) {
        this.chosen_deck = this.deck_list.find(d => d.name == choosen_deck);
    }
}
