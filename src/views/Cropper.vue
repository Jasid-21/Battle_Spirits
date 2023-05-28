<template>
  <div class="masterContainer">
    <Navbar />
    <div class="info_options">
        <div class="current_card_container">
            <img class="current_card" :src="currentCard" v-if="currentCard">
            <img class="current_card" src="../assets/cards/bss_reverse.jpg" v-else>
        </div>
        <br>
        <span>Load your deck:</span>

        <textarea class="deck_text_loader" 
        cols="30" rows="20" v-model="deck" 
        :placeholder="placeholder"></textarea>

        <button class="details_button" @click="importDeck">Import</button>
    </div>
    <div class="deck_container">
        <div class="deck_options">
            <div class="deck_selector_container">
                <label for="deck_selector">Deck Selector: </label>
                <select name="deck_selector" v-model="active_deck">
                    <option value="__none__">---</option>
                    <option :value="d.name" v-for="(d, idx) of myDecks" :key="idx">{{ d.name }}</option>
                </select>
                <button class="load_button" @click="loadDeck">Load</button>
            </div>

            <form class="deck_name_container" @submit.prevent="saveDeck">
                <label for="deck_name">Name: </label>
                <input type="text" name="deck_name" v-model="deck_name">

                <input type="submit" value="Save">
            </form>
        </div>
        <div class="deck">
            <img :src="c" class="deck_card" v-for="(c, idx) of cards" :key="idx" @mouseenter="setCurrentCard($event)">
        </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Swal from 'sweetalert2';

export default {
    name: 'DeckLoader',
    components: {Navbar},
    data() {
        return {
            placeholder: "Paste here your deck in tts format",
            currentCard: "",
            cards: [],
            deck: "",
            myDecks: [],
            active_deck: '__none__',
            deck_name: ''
        }
    },

    methods: {
        setCurrentCard(ev) {
            this.currentCard = ev.target.src;
        },

        async importDeck() {
            const mainArray = this.deck.substring(1, this.deck.length-1).split(',');

            this.cards = mainArray.map(card => `https://battlespirits-saga.com/images/cards/card/${card}.png`);
        },

        saveDeck() {
            if (this.deck.length < 50) {
                Swal.fire({
                    title: 'App message',
                    text: 'Your deck must have 50 cards'
                });
                return;
            }

            const old = JSON.parse(localStorage.getItem('BSS_Decklist') || '[]');
            const deck_index = old.findIndex(el => el.name == this.deck_name);

            if (deck_index >= 0) {
                old.splice(deck_index, 1);
            }

            const obj = {name: this.deck_name, deck: this.deck}
            old.push(obj);

            localStorage.setItem('BSS_Decklist', JSON.stringify(old));
        },

        loadDeck() {
            if (this.active_deck == '__none__') {
                alert("You must chose a deck to load...");
                return;
            }

            const deck = this.myDecks.find(deck => deck.name == this.active_deck);
            if (deck == undefined) {
                alert("Deck not found...");
                return;
            }

            const card_codes = deck.deck.substring(1, deck.deck.length - 1).split(',');
            this.cards = card_codes.map(card => `https://battlespirits-saga.com/images/cards/card/${card}.png`);
        }
    },

    mounted() {
        this.myDecks = JSON.parse(localStorage.getItem('BSS_Decklist') || '[]');
    }
}
</script>

<style scoped>
.deck_card {
    max-width: 100% !important;
    max-height: 100% !important;
    display: block;
}
.deck {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: repeat(10, 10%);
    grid-template-rows: repeat(5, 20%);
}
.deck_options {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.deck_container {
    display: grid;
    grid-template-rows: 10% 90%;
}

span {
    font-style: italic;
    font-weight: 700;
}
.details_button {
    width: 70%;
    height: 25px;

    margin-top: 5px;
    margin-bottom: 5px;
}

.deck_text_loader {
    max-height: 250px;
}
.info_options {
    background-color: rgb(218, 218, 218);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
}
.current_card {
    max-width: 100% !important;
    max-height: 100% !important;
    display: block;
}
.current_card_container {
    max-width: 60% !important;
    margin-top: 5px;

    box-shadow: 2px 2px 5px rgb(87, 87, 87);
    
    display: flex;
    justify-content: center;
    align-items: center;
}
.masterContainer {
    width: 100vw;
    height: 100vh;

    display: grid;
    grid-template-columns: 25% 75%;
    grid-template-rows: 10% 90%;
}
</style>
