<template>
    <div class="hand myhand" data-origin="in_hand" :data-own="own"
        @dragenter.prevent @dragover.prevent @drop="drop($event)">
        <Card v-for="c of cards" :key="c.id" :place="'in_hand'" 
        :card="c" :own="own" :setedDef="!own"  />
    </div>
</template>

<script>
import { dropCard } from '@/helpers/functions';
import Card from './Card.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: 'hand',
    props: ['own'],
    components: {
        Card
    },

    setup(props) {
        const store = useStore();
        const own = props.own;

        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;
        const cards = computed(() => store.state.cards[own?socket.id:op_id].in_hand);

        const drop = (ev) => {
            if (!own) { return; };
            dropCard(ev, socket.id, own?socket.id:op_id, 'in_hand', store)
            .then(({ moved, params }) => {
                if (!moved) { return; };
                socket.emit('move_card', { ...params, op_id });
            });
        }

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

    z-index: 30;
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
