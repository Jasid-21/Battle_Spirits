<template>
    <div class="cardListDisplayer" v-if="show">
        <button class="close_button" @click.prevent="hide">
            <fai icon="xmark" />
        </button>
        <div class="cardDisplayer" data-own="true" data-origin="in_deck">
            <Card :card="c" v-for="(c, idx) of deck" :key="idx" />
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
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
        const deck = computed(() => store.state.cards[socket.socket.id].in_deck);
        const show = computed(() => store.state.cardDisplayer);

        const hide = () => {
            store.commit('changeDisplayerStatus');
        }

        return { deck, show, hide };
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
    overflow-x: scroll;
}
.cardListDisplayer {
    width: 100%;
    height: min-content;

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