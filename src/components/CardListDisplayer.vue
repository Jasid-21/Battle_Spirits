<template>
    <div class="cardListDisplayer" v-if="show">
        <button class="close_button" @click.prevent="hide">
            <fai icon="xmark" />
        </button>
        <div class="cardDisplayer" data-own="true" :data-origin="origin">
            <Card :card="c" v-for="(c, idx) of cards" :key="idx" :own="!(player==op_id)" />
        </div>
    </div>
</template>

<script>
import { computed, watch } from 'vue';
import { useStore } from 'vuex'
import Card from './Card.vue';

export default {
    name: 'cardListDisplayer',
    components: {
        Card
    },
    setup() {
        const store = useStore();
        const socket = store.state.socket;
        const op_id = store.state.op_id;
        const origin = computed(() => store.state.cardDisplayer.origin);
        const player = computed(() => store.state.cardDisplayer.player);
        const cards = computed(() => {
            const playerCards = store.state.cards[player.value];
            if (!playerCards) { return []; }
            const inOriginCards = playerCards[origin.value];
            return inOriginCards;
        });
        const show = computed(() => store.state.cardDisplayer.showing);

        const hide = () => {
            store.commit('changeDisplayerStatus', {origin: origin.value, status: false});

            const params = {
                player: socket.socket.id,
                op_id,
                origin: null
            }
            store.commit('lookingSomething', params);
            socket.socket.emit('looking_something', params);
        }

        return { cards, show, origin, player, op_id, hide };
    }
}
</script>

<style scoped>
.close_button {
    width: 20px;
    height: 20px;

    background-color: rgb(143, 0, 0);
    color: white;
    font-weight: 700;
    text-align: center;
    border: none;
    border-radius: 5px;

    position: absolute;
    top: -5px;
    right: -5px;
    z-index: 25;
}

.cardDisplayer {
    width: 100%;
    height: 100%;
    padding: 20px 0px;

    display: flex;
    overflow-x: auto;
}
.cardListDisplayer {
    width: 100%;
    height: min-content;
    min-height: 100px;

    background-color: rgba(255, 255, 255, 0.7);
    border: 3px solid gray;
    border-radius: 10px;

    position: absolute;
    top: calc(50% - 100px);

    z-index: 20;
}

.cardDisplayer > * {
    margin-right: 10px;
}

.cardDisplayer::-webkit-scrollbar {
    bottom: 0px;
    height: 10px;
    background-color: transparent;
}

.cardDisplayer::-webkit-scrollbar-track {
    height: 10px;
    background-color: rgba(128, 128, 128, 0.8);
}

.cardDisplayer::-webkit-scrollbar-thumb {
    height: 10px;
    background-color: rgb(107, 107, 107);
    border-radius: 10px;
}
</style>