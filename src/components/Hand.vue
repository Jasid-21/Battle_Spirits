<template>
    <div class="hand myhand" data-origin="in_hand" :data-own="own"
        @dragenter.prevent @dragover.prevent @drop="drop($event)">
        <Card v-for="c of cards" :key="c.id" :card="c" />
    </div>
</template>

<script>
import Card from './Card.vue';
import { useStore } from 'vuex';
import { computed, watch } from 'vue';

export default {
    name: 'hand',
    props: ['own'],
    components: {
        Card
    },

    setup(props) {
        const store = useStore();
        const own = props.own;

        const socket = store.state.socket;
        const op_id = store.state.op_id;
        const cards = computed(() => store.state.cards[own?socket.socket.id:op_id].in_hand);

        const drop = (ev) => {
            if (!own) {
                console.log("Unauthorized action");
                return;
            }

            const card_origin = ev.dataTransfer.getData('card_origin');
            const card_id = ev.dataTransfer.getData('card_id');
            const card_str = ev.dataTransfer.getData('card_obj');
            const card = card_str?JSON.parse(card_str):undefined;
            const player_dest = socket.socket.id;
            const player_org = socket.socket.id;

            const params = { 
                origin: card_origin, destiny: 'in_hand', 
                player_dest, player_org, card_id, card
            };
            console.log(params);
            store.dispatch('moveCard', params)
            .then(moved => {
                if (!moved) {
                    alert("Something went wrong moving the card...");
                    return;
                }

                socket.socket.emit('move_card', { ...params, op_id });
            });
        }

        watch(cards.value, (oldVal, newVal) => {
            if (own) {
                return;
            }

            setTimeout(() => {
                console.log("Hidding card");
                store.commit('setAllHand', op_id);
            }, 1500);
        })

        return {cards, drop}
    }
}
</script>

<style scoped>
.hand {
    width: 100%;
    height: 76px;
    background: rgba(255, 255, 255, 0.2);

    position: absolute;
    bottom: -40px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.myhand::-webkit-scrollbar,
.myhand::-webkit-scrollbar-track {
    height: 5px;
    background-color: transparent;
}

.myhand::-webkit-scrollbar-thumb {
    width: 5px;
    background-color: rgb(0, 0, 83);
    border-radius: 5px;
}
</style>