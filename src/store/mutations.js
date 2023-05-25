import { Card, newMessage } from '@/helpers/classes';
import { shuffleArray } from '@/helpers/functions';

export default {
    newMessage(state, payload) {
      const { msg, player_org, players } = payload;
      const message = newMessage(msg, player_org, state.players, players);
      if (!message) { return; }
      state.messages.push(message);
    },

    changeTurn(state) {
      state.active = !state.active;
      state.activePhase = 'Start';
    },

    refreshAllCores(state, payload) {
      const { player_org } = payload;
      const in_trash = state.cores[player_org].in_trash;
      const in_reserve = state.cores[player_org].in_reserve;

      in_reserve.push(...in_trash);
      in_trash.splice(0, in_trash.length);
    },

    setCores(state, { cores, op_cores }) {
      state.cores[state.socket.socket.id] = cores;
      state.cores[state.op_id] = op_cores;

      console.log(state.cores);
    },

    incrementCores(state, payload) {
      const { player_org, origin, core } = payload;
      state.cores[player_org][origin].push(core);
    },

    refreshAllCards(state, payload) {
      const { player_org } = payload;

      const in_front = state.cards[player_org].in_front;
      const in_middle = state.cards[player_org].in_middle;
      const in_back = state.cards[player_org].in_back;

      in_front.forEach(c => c.rested = false);
      in_middle.forEach(c => c.rested = false);
      in_back.forEach(c => c.rested = false);
    },

    revealTop(state, payload) {
      const { player_org } = payload;
      const card = state.cards[player_org].in_deck.shift();
      state.cards[player_org].in_reveal.push(card);
    },

    flipBurstCard(state, payload) {
      const { player_org } = payload;
      state.cards[player_org].in_burst.seted = !state.cards[player_org].in_burst.seted;
    },
    
    shuffleDeck(state, payload){
      const { deck, player_org } = payload;
      state.cards[player_org].in_deck = deck;
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
      state.cards[state.socket.socket.id].in_deck = deck.map(c => new Card(c.id, c.url));
      state.cards[state.op_id].in_deck = op_deck.map(c => new Card(c.id, c.url));
      
      state.cards[state.socket.socket.id].in_deck.forEach(card => {
        const img = new Image();
        img.src = card.url;
      });

      state.cards[state.op_id].in_deck.forEach(card => {
        const img = new Image();
        img.src = card.url;
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
    },

    requestDuel(state, payload) {
      state.requests.push(payload);
    }
}
