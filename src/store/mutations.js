import { shuffleArray, createCardsObject, createCoresObject } from '@/helpers';

export default {
    clearCarrier(state) {
      state.coresCarrier.commons = 0;
      state.coresCarrier.soul = 0;
    },

    incrementCores(state, payload) {
      const { player_org, origin } = payload;
      state.cores[player_org][origin].commons++
    },

    modifyCoresCarrier(state, { inc, soul }) {
      if (inc) {
        state.coresCarrier[soul?'soul':'commons']++;
        return;
      }

      state.coresCarrier[soul?'soul':'commons']--;
    },

    flipBurstCard(state, payload) {
      const { player_org } = payload;
      state.cards[player_org].in_burst.seted = !state.cards[player_org].in_burst.seted;
    },
    shuffleDeck(state, payload){
      const { player_org } = payload;
      const deck = shuffleArray(state.cards[player_org].in_deck);
      state.cards[player_org].in_deck = deck;
      console.log("Deck shuffled!");
    },

    lookingSomething(state, payload) {
      const { player, origin } = payload;
      state.looking[player] = origin;
    },

    changeDisplayerStatus(state, payload) {
      const {status, origin, player} = payload;

      if (origin == 'in_deck' && player == state.op_id) {
        alert("Unauthorized action!");
        return;
      }

      if (!status) {
        state.cardDisplayer.showing = !state.cardDisplayer.showing;
        return;
      }

      state.cardDisplayer.showing = status;
      state.cardDisplayer.origin = origin;
      state.cardDisplayer.player = player;

    },

    setBoardId(state, payload) {
      console.log(payload);
      state.board_id = payload;
    },

    setSocket(state, payload) {
      if (!payload) {
        alert("Socket not found...");
        return;
      }

      state.socket = payload;
    },

    setCurrentCard(state, payload) {
      state.current_card = payload
    },

    setChoosenDecks(state, { deck, op_deck }) {
      state.cards[state.socket.socket.id].in_deck = deck;
      state.cards[state.op_id].in_deck = op_deck;
      
      state.cards[state.socket.socket.id].in_deck.forEach(card => {
        const img = new Image();
        img.src = card.url;
        img.onload = async () => {
          console.log("Done");
        }
      });

      state.cards[state.op_id].in_deck.forEach(card => {
        const img = new Image();
        img.src = card.url;
        img.onload = async () => {
          console.log("Done");
        }
      });
    },

    restUnrest(state, payload) {
      const { card_id, place } = payload;
      const card = state.cards[state.op_id][place].find(c => c.id == card_id);
      card.rested = !card.rested;
    },

    setAllHand(state, payload) {
      console.log(state.cards[payload].in_hand);
      state.cards[payload].in_hand.forEach(card => card.seted = true);
    }
}
