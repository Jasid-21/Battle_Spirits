<template>
    <div class="reveal_zone" data-origin="in_reveal" :data-own="own"
    @dragenter.prevent @dragover.prevent @drop="drop($event)">
        <div class="cards_container">
            <Card v-for="(c, idx) of cards" :key="idx" :own="own" :margin_left="10"
            :setedDef="!own" :restedDef="true" :card="c" :place="'in_reveal'" />
        </div>

        <div class="reveal_options_container" v-if="own">
            <!--To draw 5 cards-->
            <div class="reveal_option" @click="returnToBottom">
                <fai icon="arrow-down" />
            </div>

            <!--To look the entire deck-->
            <div class="reveal_option" @click="revealCards">
                <fai icon="eye" />
            </div>
        </div>
    </div>
</template>

<script>
import Card from './Card.vue';
import { dropCard } from '@/helpers/functions';

import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'RevealZone',
    props: ['own'],
    components: {Card},
    setup(props) {
        const store = useStore();
        const own = props.own;

        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;
        const cards = computed(() => store.state.cards[own?socket.id:op_id].in_reveal);

        const drop = (ev) => {
            dropCard(ev, socket.id, own?socket.id:op_id, 'in_reveal', store)
            .then(({ params, moved }) => {
                if (!moved) { return; }

                socket.emit('move_card', { ...params, op_id });
            })
        }

        const returnToBottom = () => {
            store.dispatch('multiReturnToBottom', { player_org: socket.id });
            socket.emit('multi_return_to_bottom', { player_org: socket.id, op_id });
        }

        const revealCards = () => {
            socket.emit('reveal_cards', { op_id });
        }

        return { own, cards, drop, returnToBottom, revealCards };
    }
}
</script>

<style scoped>
.reveal_option > * {
    width: 80%;
    height: 80%;
}
.reveal_option {
    width: 17px;
    height: 17px;

    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 2px 2px 5px black;
}

.reveal_option:hover {
    background-color: rgba(0, 183, 255, 0.6);
    color: white;
}
.reveal_options_container {
    height: 30px;
    width: 100%;

    position: absolute;
    bottom: -30px;

    display: flex;
    justify-content: space-around;
}

.cards_container {
    width: calc(100% - 6px);
    height: 100%;

    padding-left: 5px;
    
    overflow-y: auto;
    overflow-x: hidden;
}

.reveal_zone {
    width: 80px;
    height: calc(100% - 10px); 

    position: absolute;
    right: -83px;

    background-color: rgba(255, 255, 255, 0.8);
    border: 2px solid rgb(167, 167, 167);
    border-radius: 10px;
}

.cards_container::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
}

.cards_container::-webkit-scrollbar-track {
    width: 6px;
    background-color: rgb(182, 182, 182);
}

.cards_container::-webkit-scrollbar-thumb {
    width: 6px;
    background-color: rgb(0, 0, 54);
    border-radius: 5px;
}
</style>
