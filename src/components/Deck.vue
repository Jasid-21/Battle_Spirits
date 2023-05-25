<template>
    <div class="deck_zone" @dblclick="drawCard(1)"
    @drop="dropInDeck($event)" @dragenter.prevent @dragover.prevent>
        <span class="looking" v-if="looking">Looking deck</span>
        <div class="deck_options_container" v-if="own">
            <!--To draw 5 cards-->
            <div class="deck_option" @click="drawCard(4)" @dblclick.stop>
                <fai icon="4" />
            </div>

            <!--To look the entire deck-->
            <div class="deck_option" @click="showDeck" @dblclick.stop>
                <fai icon="eye" />
            </div>

            <!--To view or reveal cards from top-->
            <div class="deck_option" @click="revealTop" @dblclick.stop>
                <fai icon="right-from-bracket" />
            </div>

            <!--To shuffle deck-->
            <div class="deck_option" @click="shuffleDeck" @dblclick.stop>
                <fai icon="shuffle" />
            </div>
        </div>
        <img src="../assets/cards/bss_reverse.jpg" class="back_card">
    </div>
</template>

<script>
import { useStore } from 'vuex';
import Swal from 'sweetalert2'
import { computed } from 'vue';
import { showCardDisplayer } from '@/helpers/functions';

export default {
    name: 'Deck',
    props: ['own'],
    setup(props) {
        const store = useStore();
        const own = props.own;
        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;
        const looking = computed(() => {
            const value = store.state.looking[own?socket.id:op_id];
            return value == 'in_deck';
        });

        const revealTop = () => {
            store.commit('revealTop', { player_org: socket.id });
            socket.emit('reveal_top', {player_org: socket.id, op_id});
        }

        const shuffleDeck = () => {
            const deck = store.state.cards[socket.id].in_deck;
            socket.emit('shuffle_deck', { deck, player_org: socket.id, op_id });
        }

        const drawCard = (num) => {
            if (!own) { return; }
            
            store.dispatch('drawCard', {num, player_org: socket.id})
            .then(() => socket.emit('draw_card', { op_id, num }))
            .catch(err => console.log(err));
        }

        const dropInDeck = (ev) => {
            if (!props.own) {
            alert("You are unauthorized to drop cards into your oponents deck...");
            return;
            }

            const origin = ev.dataTransfer.getData('card_origin');
            const card_id = ev.dataTransfer.getData('card_id');

            Swal.fire({
                title: "Sending card to deck",
                text: "Where do you want to send the card to",
                confirmButtonText: "Top",
                cancelButtonText: "Bottom",
                showCancelButton: true,
                focusConfirm: false
            }).then(result => {
                const top = result.isConfirmed;
                const params = {
                    origin, player_org: socket.id,
                    top, card_id
                }
                store.dispatch('returnToDeck', params)
                socket.emit('return_to_deck', { ...params, op_id });
            });
        }

        const showDeck = () => {
            showCardDisplayer('in_deck', socket.id, store, socket, op_id);
        }

        return {looking, drawCard, dropInDeck, showDeck, shuffleDeck, revealTop};
    }
}
</script>

<style scoped>
.looking {
    position: absolute;
    color: blue;
    text-shadow: 2px 2px 4px white;
    
    font-weight: bold;
}
.deck_option > * {
    width: 80%;
    height: 80%;
}
.deck_option {
    width: 17px;
    height: 17px;

    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 2px 2px 5px black;
}

.deck_option:hover {
    background-color: rgba(0, 183, 255, 0.6);
    color: white;
}
.deck_options_container {
    width: 30px;
    height: 130%;
    right: -40px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    position: absolute;
}
.deck_zone {
  width: 90% !important;
  height: 32% !important;
  max-width: 90% !important;
  max-height: 32% !important;
  margin-top: 8%;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

.back_card {
  max-width: 100% !important;
  max-height: 100% !important;
}
</style>