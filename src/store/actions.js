import { createCardsObject, createCoresObject } from '@/helpers/functions';

export default {
    moveCores({state}, payload) {
        const { player_org, player_dest, origin, destiny, 
        card_id_org, card_id_dest } = payload;
        console.log(payload);

        // Get the orogin object.
        var originObj;
        if (!card_id_org) {
            originObj = state.cores[player_org][origin]; // By reference.
        } else {
            const card = state.cards[player_org][origin].find(c => c.id == card_id_org); //By reference
            originObj = card.cores; // By reference
        }
        if (!originObj) { return; }

        // Get the destiny object.
        var destinyObj;
        if (!card_id_dest) {  // All of this was by reference
            destinyObj = state.cores[player_dest][destiny];
        } else {
            const card = state.cards[player_dest][destiny].find(c => c.id == card_id_dest);
            destinyObj = card.cores;
        }
        if (!destinyObj) { return; }

        // Get the selected cores and set the new value for originObj.
        var cores = originObj.filter(c => c.selected); // By reference
        originObj.splice(0, originObj.length, ...originObj.filter(c => !c.selected));  // By reference

        destinyObj.push(...cores);
        destinyObj.forEach(c => c.selected = false);
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
            const cores = newCard.cores;
            state.cores[player_org].in_reserve.push(...cores);
            newCard.cores.splice(0, newCard.cores.length);
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
        state.cards[state.socket.socket.id] = createCardsObject();
        state.looking[state.socket.socket.id] = '';

        state.cards[payload] = createCardsObject();
        state.looking[payload] = '';

        state.op_id = payload;
    }
}
