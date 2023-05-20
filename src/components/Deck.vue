<template>
    <div class="deck_zone" @dblclick="drawCard"
    @drop="dropInDeck($event)" @dragenter.prevent @dragover.prevent>
        <span class="looking" v-if="looking">Looking deck</span>
        <div class="deck_options_container" v-if="own">
            <!--To reveal certain number of cards-->
            <div class="deck_option">
                <fai icon="magnifying-glass" />
            </div>

            <!--To view all deck-->
            <div class="deck_option" @click="showDeck">
                <fai icon="eye" />
            </div>

            <!--To mill a card-->
            <div class="deck_option">
                <fai icon="arrow-down" />
            </div>

            <!--To shuffle deck-->
            <div class="deck_option" @click="shuffleDeck">
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

export default {
    name: 'Deck',
    props: ['own'],
    setup(props) {
        const store = useStore();
        const own = props.own;
        const socket = store.state.socket;
        const op_id = store.state.op_id;
        const looking = computed(() => {
            const value = store.state.looking[own?socket.socket.id:op_id];
            return value == 'in_deck';
        });

        const shuffleDeck = () => {
            store.commit('shuffleDeck', {player_org: socket.socket.id});
        }

        const drawCard = () => {
            if (!own) { return; }
            
            store.dispatch('drawCard', {socket_id: socket.socket.id})
            .then(card => socket.socket.emit('draw_card', {op_id, card}))
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
                    origin, player_org: socket.socket.id,
                    top, card_id
                }
                store.dispatch('returnToDeck', params)
                socket.socket.emit('return_to_deck', { ...params, op_id });
            });
        }

        const showDeck = () => {
            const params = {
                origin: 'in_deck',
                status: true,
                player: socket.socket.id
            }
            store.commit('changeDisplayerStatus', params);
            store.commit('lookingSomething', {...params, op_id});
            socket.socket.emit('looking_something', {...params, op_id});
        }

        return {looking, drawCard, dropInDeck, showDeck, shuffleDeck};
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