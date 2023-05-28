import { io } from "socket.io-client";
import Swal from 'sweetalert2'

export function newMessage(msg, sender_id, players, important = false) {
    console.log(players);
    const sender = players.find(p => p.id == sender_id);
    if (!sender) { return; }

    return {
        msg, important,
        sender_name: sender.username,
        sender_id: sender.id
    }
}

export class Card {
    constructor(id, url) {
        this.id = id; this.url = url;
        this.seted = false; this.rested = false;
        this.cores = [];
        this.selected = false;
        this.activated = false;
    }

    select() {
        this.selected = true;
        setTimeout(() => {
            this.selected = false
        }, 250);
    }

    activate() {
        this.activated = true;
        setTimeout(() => {
            this.activated = false
        }, 250);
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

        this.socket.on('hosting_room', info => {
            this.store.commit('setHostingName', info);
        });

        this.socket.on('request_duel', info => {
            this.store.commit('requestDuel', info);
        });

        this.socket.on('accept_duel', info => {
            this.socket.emit('start_duel', info);
        });

        this.socket.on('duel_start', info => {
            const { op_id, deck, op_deck, cores, op_cores, active, players } = info;
            
            this.store.dispatch('addPlayers', { op_id, players, active });
            this.store.commit('setChoosenDecks', { deck, op_deck });
            this.store.commit('setCores', { cores, op_cores });
            router.push('/game');
        });

        this.socket.on('socket_message', (msg) => {
            Swal.fire({
                title: 'Server message',
                icon: 'info',
                text: msg.msg
            })
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

        this.socket.on('reveal_top', info => {
            this.store.commit('revealTop', info);
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

        this.socket.on('change_turn', info => {
            this.store.commit('changeTurn');
        });

        this.socket.on('refresh_all', info => {
            this.store.commit('refreshAllCards', info);
            this.store.commit('refreshAllCores', info);
        });

        this.socket.on('new_message', info => {
            this.store.commit('newMessage', info);
        });

        this.socket.on('multi_return_to_bottom', info => {
            this.store.dispatch('multiReturnToBottom', info);
        });

        this.socket.on('reveal_cards', info => {
            this.store.dispatch('revealCards', info);
        });

        this.socket.on('shuffle_deck', info => {
            this.store.commit('shuffleDeck', info);
        });

        this.socket.on('activate_effect', info => {
            this.store.commit('activateEffect', info);
        });

        this.socket.on('select_card', info => {
            this.store.commit('selectCard', info);
        });
    }

    setDeck(choosen_deck) {
        this.chosen_deck = this.deck_list.find(d => d.name == choosen_deck);
    }
}
