import { createStore } from 'vuex';
import { shuffleArray, createCardsObject, createCoresObject } from '@/helpers';

export default createStore({
  state: {
    looking: {},
    chosen_deck: {},
    cards: {},
    cores: {},
    coresCarrier: {
      commons: 0,
      soul: 0
    },
    current_card: "",
    socket: {},
    op_id: '',
    board_id: '',
    cardDisplayer: {
      showing: false,
      origin: 'in_deck',
      player: ''
    }
  },
  getters: {},
  mutations: {
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


      // Taking the card from origin if origin is oponents deck.
      var newCard;
      if (card) {
        newCard = card;
        state.cards[state.op_id].in_deck--;
      }

      // Determining origin and destiny type.
      const orgType = Array.isArray(state.cards[player_org][origin])?'Array':'Object';
      const desType = Array.isArray(state.cards[player_dest][destiny])?'Array':'Object';

      // Taking card from origin if origin is not oponents deck.
      if (!card && orgType == 'Array') {
        const card_index = state.cards[player_org][origin].findIndex(el => el.id == card_id);
        if (card_index == -1) {
          alert("Card not found in origin...");
          return false;
        }

        console.log(state.cards[player_org][origin]);
        newCard = state.cards[player_org][origin].splice(card_index, 1)[0];
      }

      if (!card && orgType == 'Object') {
        newCard = Object.assign({}, state.cards[player_org][origin]);
        console.log(newCard);
        state.cards[player_org][origin] = {}
        console.log(newCard);
      }


      // Placing the card in destiny.
      // Case oponents deck
      if (destiny == 'in_deck' && player_dest == state.op_id) {
        state.cards[state.op_id].in_deck++;
        return true;
      }

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
  },
  modules: {
  }
})
