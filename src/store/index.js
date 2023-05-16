import { createStore } from 'vuex';
import { createCode } from '@/helpers';

const cards_obj = {
  in_deck: [], in_hand: [], in_front: [],
  in_middle: [], in_back: [], in_trash: [],
  in_rust: {}
};
const cards_obj_2 = {
  in_deck: [], in_hand: [], in_front: [],
  in_middle: [], in_back: [], in_trash: [],
  in_rust: {}
};

export default createStore({
  state: {
    chosen_deck: {},
    cards: {},
    current_card: "",
    socket: {},
    op_id: '',
    board_id: '',
    cardDisplayer: true
  },
  getters: {},
  mutations: {
    changeDisplayerStatus(state, payload) {
      if (!payload) {
        state.cardDisplayer = !state.cardDisplayer;
        return;
      }

      state.cardDisplayer = payload;
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

    setChoosenDeck(state, payload) {
      state.cards[state.socket.socket.id].in_deck = payload;
      state.cards[state.op_id].in_deck = 40;
      
      state.cards[state.socket.socket.id].in_deck.forEach(card => {
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
  },
  actions: {
    returnToDeck({state}, payload) {
      const { origin, player_org, top, card_id } = payload;
      const card_idx = state.cards[player_org][origin].findIndex(c => c.id == card_id);
      const card = state.cards[player_org][origin].splice(card_idx, 1)[0];

      if (player_org != state.socket.socket.id) {
        console.log(player_org + ', ', state.socket.socket.id);
        return;
      }

      if (top) {
        state.cards[player_org].in_deck.splice(0, 0, card);
        return;
      }

      state.cards[player_org].in_deck.push(card);
    },

    drawCard({state}, {card, socket_id}) {
      console.log(card);
      if (!card) {
        card = state.cards[socket_id].in_deck.shift();
      }

      state.cards[socket_id].in_hand.push(card);
      console.log(card);
      return card;
    },

    moveCard({state}, payload) {
      const { origin, destiny, player_dest, player_org, card_id, card } = payload;
      console.log(payload);
      var newCard = card;
      if (player_org != state.op_id || origin != 'in_deck') {
        const card_index = state.cards[player_org][origin].findIndex(el => el.id == card_id);
        if (card_index == -1) {
          alert("Card not found in origin...");
          return false;
        }

        console.log(state.cards[player_org][origin]);

        newCard = state.cards[player_org][origin].splice(card_index, 1)[0];
      }

      newCard.seted = false;
      console.log(newCard);

      state.cards[player_dest][destiny].push(newCard);
      console.log(state.cards[player_dest][destiny]);

      return true;
    },

    addPlayers({state}, payload) {
      state.cards[state.socket.socket.id] = Object.assign({}, cards_obj);
      state.cards[payload] = Object.assign({}, cards_obj_2);
      state.op_id = payload;

      console.log(Object.keys(state.cards));
    }
  },
  modules: {
  }
})
