import { createCardsObject, createCoresObject } from '@/helpers/functions';

export default {
    moveCores({state, commit}, payload) {
        const { player_org, player_dest, origin, destiny, 
        card_id_org, card_id_dest, commons, soul } = payload;
        console.log(payload);

        if (!card_id_org) {
            const c_prev = state.cores[player_org][origin].commons;
            const s_prev = state.cores[player_org][origin].soul;

            state.cores[player_org][origin].commons = c_prev - commons;
            state.cores[player_org][origin].soul = s_prev - soul;

        } else {
            const card = state.cards[player_org][origin].find(c => c.id == card_id_org);
            const c_prev = card.cores.commons;
            const s_prev = card.cores.soul;

            card.cores.commons = c_prev - commons;
            card.cores.soul = s_prev - soul;
        }
        

        if (!card_id_dest) {
            const c_prev = state.cores[player_dest][destiny].commons;
            const s_prev = state.cores[player_dest][destiny].soul;

            state.cores[player_dest][destiny].commons = c_prev + commons;
            state.cores[player_dest][destiny].soul = s_prev + soul;
        } else {
            const card = state.cards[player_dest][destiny].find(c => c.id == card_id_dest);
            const c_prev = card.cores.commons;
            const s_prev = card.cores.soul;

            card.cores.commons = c_prev + commons;
            card.cores.soul = s_prev + soul;
        }

        console.log(state.cores);
        commit('clearCarrier');
    },

    returnToDeck({state}, payload) {
        const { origin, player_org, top, card_id } = payload;
        const card_idx = state.cards[player_org][origin].findIndex(c => c.id == card_id);
        const card = state.cards[player_org][origin].splice(card_idx, 1)[0];

        if (top) {
            state.cards[player_org].in_deck.splice(0, 0, card);
            return;
        }

        state.cards[player_org].in_deck.push(card);
    },

    drawCard({state}, { player_org }) {
        console.log(state.cards);
        const card = state.cards[player_org].in_deck.shift();
        state.cards[player_org].in_hand.push(card);
        console.log(card);
        return card;
    },

    moveCard({state}, payload) {
        const { origin, destiny, player_dest, player_org, card_id } = payload;
        console.log(payload);

        // Validating complete information.
        if (!player_org || !player_dest) {
            console.log("Missing player origin/destiny...");
            return;
        }

        if (!origin || !destiny) {
            console.log("Missing origin/destiny...");
            return;
        }

        if (!card_id && !card) {
            console.log("Missing card/card_id...");
            return;
        }

        // Determining origin and destiny type.
        var newCard = {};
        const orgType = Array.isArray(state.cards[player_org][origin])?'Array':'Object';
        const desType = Array.isArray(state.cards[player_dest][destiny])?'Array':'Object';

        if (desType == 'Object' && Object.keys(state.cards[player_dest][destiny]).length) { return; };
        if (desType == 'Array' && state.cards[player_dest][destiny].some(c => c.id == card_id)) { return; };

        // Taking card from origin if origin is not oponents deck.
        if (orgType == 'Array') {
            const card_index = state.cards[player_org][origin].findIndex(el => el.id == card_id);
            if (card_index == -1) {
                alert("Card not found in origin...");
                return false;
            }
            newCard = state.cards[player_org][origin].splice(card_index, 1)[0];
        }

        if (orgType == 'Object') {
            newCard = Object.assign({}, state.cards[player_org][origin]);
            state.cards[player_org][origin] = {}
        }


        //Returning cores to reserve.
        if (!['in_front', 'in_middle', 'in_back'].some(p => p == destiny)) {
            const prev_c = state.cores[player_org].in_reserve.commons;
            const prev_s = state.cores[player_org].in_reserve.soul;

            state.cores[player_org].in_reserve.commons = prev_c + newCard.cores.commons;
            state.cores[player_org].in_reserve.soul = prev_s + newCard.cores.soul;

            newCard.cores.commons = 0;
            newCard.cores.soul = 0;
        }

        // Placing the card in destiny.
        // Case Array.
        if (desType == 'Array') {
            state.cards[player_dest][destiny].push(newCard);
            return true;
        }

        // Case Object.
        if (desType == 'Object') {
            state.cards[player_dest][destiny] = newCard;
            return true;
        }
    },

    addPlayers({state}, payload) {
        state.cards[state.socket.socket.id] = createCardsObject(true);
        state.cores[state.socket.socket.id] = createCoresObject();
        state.looking[state.socket.socket.id] = '';

        state.cards[payload] = createCardsObject(false, 40);
        state.cores[payload] = createCoresObject();
        state.looking[payload] = '';

        state.op_id = payload;
    }
}
