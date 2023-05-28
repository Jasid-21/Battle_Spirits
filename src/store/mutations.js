import { Card, newMessage } from '@/helpers/classes';

export default {
  clearRequests(state) {
    if (state.requests.length <= 0) return;
    state.requests.splice(0, state.requests.length);
  },

  setHostingName(state, { username }) {
    state.hostingName = username;
  },

  activateEffect(state, payload) {
    const { card_id, origin, player_org } = payload;
    const card = state.cards[player_org][origin].find(c => c.id == card_id);

    card.activate();

    const players = state.players;
    const message = newMessage('Effect activated!', player_org, players, true);
    if (!message) { return; }
    state.messages.push(message);
  },

  selectCard(state, payload) {
    const { card_id, origin, player_org } = payload;
    const card = state.cards[player_org][origin].find(c => c.id == card_id);
    console.log(card);

    card.select();
  },

  newMessage(state, payload) {
    const { msg, player_org, important } = payload;
    const players = state.players;
    const message = newMessage(msg, player_org, players, important);
    if (!message) { return; }
    state.messages.push(message);
  },

  changeTurn(state, payload) {
    const { player_org } = payload;
    state.active = !state.active;
    state.activePhase = 'Start';

    const players = state.players;
    const message = newMessage('End turn', player_org, players, true);
    if (!message) { return; }
    state.messages.push(message);
  },

  refreshAllCores(state, payload) {
    const { player_org } = payload;
    const in_trash = state.cores[player_org].in_trash;
    const in_reserve = state.cores[player_org].in_reserve;

    in_reserve.push(...in_trash);
    in_trash.splice(0, in_trash.length);

    const players = state.players;
    const message = newMessage('Cores refreshed', player_org, players, true);
    if (!message) { return; }
    state.messages.push(message);
  },

  setCores(state, { cores, op_cores }) {
    state.cores[state.socket.socket.id] = cores;
    state.cores[state.op_id] = op_cores;

    console.log(state.cores);
  },

  incrementCores(state, payload) {
    const { player_org, origin, core } = payload;
    state.cores[player_org][origin].push(core);

    const players = state.players;
    const message = newMessage('Cores refreshed', player_org, players, true);
    if (!message) { return; }
    state.messages.push(message);
  },

  refreshAllCards(state, payload) {
    const { player_org } = payload;

    const in_front = state.cards[player_org].in_front;
    const in_middle = state.cards[player_org].in_middle;
    const in_back = state.cards[player_org].in_back;

    in_front.forEach(c => c.rested = false);
    in_middle.forEach(c => c.rested = false);
    in_back.forEach(c => c.rested = false);

    const players = state.players;
    const message = newMessage('Cards refreshed', player_org, players, true);
    if (!message) { return; }
    state.messages.push(message);
  },

  revealTop(state, payload) {
    const { player_org } = payload;
    const card = state.cards[player_org].in_deck.shift();
    state.cards[player_org].in_reveal.push(card);

    const players = state.players;
    const message = newMessage('Reveal from top', player_org, players, true);
    if (!message) { return; }
    state.messages.push(message);
  },

  flipBurstCard(state, payload) {
    const { player_org } = payload;
    state.cards[player_org].in_burst.seted = !state.cards[player_org].in_burst.seted;

    const players = state.players;
    const message = newMessage('Activate burst!', player_org, players, true);
    if (!message) { return; }
    state.messages.push(message);
  },
  
  shuffleDeck(state, payload){
    const { deck, player_org } = payload;
    state.cards[player_org].in_deck = deck;

    const players = state.players;
    const message = newMessage('Deck shuffled', player_org, players, true);
    if (!message) { return; }
    state.messages.push(message);
  },

  lookingSomething(state, payload) {
    const { player, origin } = payload;
    state.looking[player] = origin;

    const players = state.players;
    const message = newMessage('Looking deck', player, players, true);
    if (!message) { return; }
    state.messages.push(message);
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
