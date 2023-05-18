<template>
    <div class="burst_zone" data-origin="in_burst" :data-own="own"
    @drop="drop($event)" @dragenter.prevent @dragover.prevent>
        <div class="burst_options_container" v-if="own">
            <!--To reveal certain number of cards-->
            <div class="burst_option" @click="flipCard">
                <fai icon="arrows-rotate" />
            </div>
        </div>
        <Card :setedDef="true" :card="cardInBurst" 
        :margin_left="0" v-if="Object.keys(cardInBurst).length > 0" />
    </div>
</template>

<script>
import Card from './Card.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: 'burst_zone',
    props: ['own'],
    components: { Card },
    setup(props) {
        const store = useStore();
        const own = props.own;

        const socket = store.state.socket;
        const op_id = store.state.op_id;
        const cardInBurst = computed(() => store.state.cards[own?socket.socket.id:op_id].in_burst);

        const drop = (ev) => {
            const card_origin = ev.dataTransfer.getData('card_origin');
            const card_id = ev.dataTransfer.getData('card_id');
            const card_str = ev.dataTransfer.getData('card_obj');
            const card = card_str?JSON.parse(card_str):undefined;
            const player_dest = own?socket.socket.id:op_id;
            const player_org = socket.socket.id;

            const params = { origin: card_origin, destiny: 'in_burst', player_dest, player_org, card_id, card };
            console.log(params);
            store.dispatch('moveCard', params)
            .then(moved => {
                if (!moved) {
                    alert("Something went wrong moving the card...");
                    return;
                }

                socket.socket.emit('move_card', { ...params, op_id });
            })
        }

        const flipCard = () => {
            if (Object.keys(cardInBurst.value) == 0) {
                return;
            }
            
            store.commit('flipBurstCard', {player_org: socket.socket.id});
            socket.socket.emit('flip_burst_card', {player_org: socket.socket.id, op_id});
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