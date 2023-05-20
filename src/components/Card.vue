<template>
    <div class="card_container" draggable="true" :id="cardObj.id"
    :class="{rested: cardObj.rested}" ref="card"
    @dragstart.stop="drag($event)"
    @dblclick="restUnrest"
    @drop.stop="drop($event)" @dragenter.prevent @dragover.prevent
    :style="{'margin-left': marginLeft + 'px'}">
        <img :src="cardObj.url" @mouseenter="setAsCurrent" v-if="cardObj.url && !cardObj.seted" />
        <img src="../assets/cards/bss_reverse.jpg" @mouseenter="setAsCurrent" v-else>
        <div class="cores_container" :id="cardObj.id">
            <Core :soul="true" :origin="place" :own="own" 
            v-for="c of Array(cardObj.cores.soul)" :key="c" />
            <Core :soul="false" :origin="place" :own="own" 
            v-for="c of Array(cardObj.cores.commons)" :key="c" />
        </div>
    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Core from './Core.vue';

export default {
    name: 'Card',
    props: {
        margin_left: {type: Number, default: 15},
        card: {default: {id: '', url: '', seted: false, rested: false, cores: {soul: 0, commons: 0}}},
        setedDef: {default: false, type: Boolean},
        restedDef: {default: false, type: Boolean},
        place: {default: '', type: String},
        own: {type: Boolean}
    },
    components: { Core },
    setup(props) {
        const store = useStore();
        const card = ref(null);

        const socket = store.state.socket;
        const op_id = store.state.op_id;

        const marginLeft = computed(() => props.margin_left);
        const cardObj = computed(() => props.card);
        const carrier = computed(() => store.state.coresCarrier);

        const setedDef = props.setedDef;
        const restedDef = props.restedDef;
        const own = props.own;
        const place = props.place;

        const drop = (ev) => {
          const origin = ev.dataTransfer.getData('origin');
          const player_org = ev.dataTransfer.getData('player_org');
          const card_id_org = ev.dataTransfer.getData('card_id');
          const card_id_dest = cardObj.value.id;
          const player_dest = own?socket.socket.id:op_id;
          const destiny = place;
          const commons = carrier.value.commons;
          const soul = carrier.value.soul;


          const params = { player_org, player_dest, origin, destiny, 
            card_id_org, card_id_dest, commons, soul }
          store.dispatch('moveCores', params);
          socket.socket.emit('move_cores', {...params, op_id});
        }

        const setAsCurrent = () => {
            const parent = card.value.parentElement;
            if (!JSON.parse(parent.getAttribute('data-own')) && cardObj.value.seted) {
                return;
            }

            store.commit('setCurrentCard', cardObj.value.url);
        }

        const drag = (ev) => {
            const parent = card.value.parentElement;
            if (!JSON.parse(parent.getAttribute('data-own'))) {
                alert("You are unauthorized to drag oponents cards...");
                return;
            }

            ev.dataTransfer.dropEffect = 'move';
            ev.dataTransfer.effectAllowed = 'move';

            const origin = parent.getAttribute('data-origin');
            ev.dataTransfer.setData('card_origin', origin);
            ev.dataTransfer.setData('card_id', cardObj.value.id);

            if (origin == 'in_deck') {
                const card = JSON.stringify({...cardObj.value});
                ev.dataTransfer.setData('card_obj', card);
            }
        }

        const restUnrest = () => {
            const parent = card.value.parentElement;
            if (!JSON.parse(parent.getAttribute('data-own'))) {
                alert("You are unauthorized change oponents cards state...");
                return;
            }
            cardObj.value.rested = !cardObj.value.rested;
            socket.socket.emit('rest_unrest', {
                card_id: cardObj.value.id, 
                place: parent.getAttribute('data-origin'),
                op_id
            });
        }

        onMounted(() => {
            cardObj.value.seted = setedDef;
            cardObj.value.rested = restedDef;
        })

        return {marginLeft, cardObj, setAsCurrent, drag, drop, restUnrest, card};
    }
}
</script>

<style scoped>
.card_container {
    --sq_width: 50px;
    --sq_height: 70px;

    max-width: var(--sq_width) !important;
    max-height: var(--sq_height) !important;
    min-width: var(--sq_width) !important;
    min-height: var(--sq_height) !important;
    width: var(--sq_width) !important;
    height: var(--sq_height) !important;

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    transition: transform 250ms ease;

    z-index: 20;
}

.card_container.rested {
    transform: rotateZ(-90deg);
}

img {
    max-width: 100% !important;
    max-height: 100% !important;
    display: block;
}
</style>