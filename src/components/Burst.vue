<template>
    <div class="burst_zone" data-origin="in_burst" :data-own="own"
    @drop="drop($event)" @dragenter.prevent @dragover.prevent>
        <div class="burst_options_container" v-if="own">
            <!--To reveal certain number of cards-->
            <div class="burst_option" @click="flipCard">
                <fai icon="arrows-rotate" />
            </div>
        </div>
        <Card :setedDef="true" :card="cardInBurst" :own="own" :place="'in_burst'"
        :margin_left="0" v-if="Object.keys(cardInBurst).length > 0" />
    </div>
</template>

<script>
import Card from './Card.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { dropCard } from '@/helpers/functions';

export default {
    name: 'burst_zone',
    props: ['own'],
    components: { Card },
    setup(props) {
        const store = useStore();
        const own = props.own;

        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;
        const cardInBurst = computed(() => store.state.cards[own?socket.id:op_id].in_burst);

        const drop = (ev) => {
            dropCard(ev, socket.id, socket.id, 'in_burst', store)
            .then(({ moved, params }) => {
                if (!moved) { return; };
                socket.emit('move_card', { ...params, op_id });
            });
        }

        const flipCard = () => {
            if (Object.keys(cardInBurst.value) == 0) {
                return;
            }
            
            store.commit('flipBurstCard', {player_org: socket.id});
            socket.emit('flip_burst_card', {player_org: socket.id, op_id});
        }

        return { cardInBurst, drop, flipCard }
    }
}
</script>

<style scoped>
.burst_option > * {
    width: 80%;
    height: 80%;
}
.burst_option {
    width: 17px;
    height: 17px;

    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 2px 2px 5px black;
}

.burst_option:hover {
    background-color: rgba(0, 183, 255, 0.6);
    color: white;
}
.burst_options_container {
    width: 30px;
    height: 100%;
    left: -20px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    position: absolute;
}

.burst_zone {
  width: 65%;
  height: 36%;
  position: relative;
}
</style>