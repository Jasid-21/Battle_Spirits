import { createStore } from 'vuex';
import createCard from '@/classes';

export default createStore({
  state: {
    chosen_deck: {},
    cards: {
      in_deck: [],
      in_hand: [],
      in_front: [],
      in_middle: [],
      in_back: [],
      in_front_op: [],
      in_middle_op: [],
      in_back_op: [],
      in_transh: [],
      in_rust: {}
    },
    oponents_hand: 0,
    current_card: ""
  },
  getters: {},
  mutations: {
    setCurrentCard(state, payload) {
      state.current_card = payload
    },

    setChoosenDeck(state, payload) {
      const content_str = payload.deck;
      const content = content_str.substring(1, content_str.length - 1).split(',');

      state.chosen_deck = payload;
      state.cards.in_deck = content.map((card, idx) => {
        return createCard(card + idx, `https://battlespirits-saga.com/images/cards/card/${card}.png`);
      });
      console.log(state.cards.in_deck);
    },

    drawCard(state, payload) {
      const card = state.cards.in_deck.shift();
      console.log(card);
      state.cards.in_hand.push(card);
    }
  },
  actions: {
    moveCard({commit, state}, payload) {
      const origin = payload.origin;
      const destiny = payload.destiny;
      const card_id = payload.card_id;

      if (!origin || !(origin in state.cards)) {
        alert("Card origin not found: " + origin);
        return;
      }

      if (!destiny || !(destiny in state.cards)) {
        alert("Card destiny not found: " + destiny);
        return;
      }

      const card_index = state.cards[origin].findIndex(el => el.id == card_id);
      if (card_index == -1) {
        alert("Card not found in origin...");
        return;
      }

      const card = state.cards[origin].splice(card_index, 1);
      console.log(card[0]);

      state.cards[destiny].push(card[0]);
      console.log(state.cards);
    },

    returnToDeck({state}, payload) {
      const card_id = payload.card_id;
      const origin = payload.origin;
      const top = payload.top;

      if (!origin || !(origin in state.cards)) {
        alert("Card origin not found: " + origin);
        return;
      }

      const card_index = state.cards[origin].findIndex(el => el.id == card_id);
      if (card_index == -1) {
        alert("Card not found in origin...");
        return;
      }

      const card = state.cards[origin].splice(card_index, 1);
      console.log(card[0]);
      if (top) {
        state.cards.in_deck.splice(0, 0, card[0]);
      } else {
        state.cards.in_deck.push(card[0]);
      }
    },

    shuffleDeck({state}) {
      const array = state.cards.in_deck;
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }

      state.cards.in_deck = array;
    }
  },
  modules: {
  }
})