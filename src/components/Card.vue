<template>
    <div class="card_container" :id="cardObj.id"
    :class="{rested: cardObj.rested}" ref="card"
    @dragenter.prevent @dragover.prevent draggable="true"
    :style="{marginLeft: margin_left + 'px'}"
    @dragstart.stop="drag($event)" @dblclick="restUnrest" @drop.stop="drop($event)">
        <img :src="cardObj.url" @mouseenter="setAsCurrent" v-if="cardObj.url && !cardObj.seted" />
        <img src="../assets/cards/bss_reverse.jpg" @mouseenter="setAsCurrent" v-else>
        <div class="cores_container" :id="cardObj.id">
            <Core :own="own" v-for="(c, idx) of cardObj.cores.filter(c => c.soul)" 
            :key="idx" :origin="place" :core="c" />
            <Core :own="own" v-for="(c, idx) of cardObj.cores.filter(c => !c.soul)" 
            :key="idx" :origin="place" :core="c" />
        </div>
    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { dropCores } from '@/helpers/functions';
import Core from './Core.vue';

export default {
    name: 'Card',
    props: {
        margin_left: {type: Number, default: 15},
        card: {
            default: {
                id: '', url: '', seted: false, 
                rested: false, cores: {soul: 0, commons: 0}
            }
        },
        setedDef: {default: false, type: Boolean},
        restedDef: {default: false, type: Boolean},
        place: {default: '', type: String},
        own: {type: Boolean}
    },
    components: { Core },
    setup(props) {
        const store = useStore();
        const card = ref(null);

        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;

        const marginLeft = computed(() => props.margin_left);
        const cardObj = computed(() => props.card);

        const setedDef = props.setedDef;
        const restedDef = props.restedDef;
        const own = props.own;
        const place = props.place;

        const drop = (ev) => {
          dropCores(ev, cardObj.value.id, own?socket.id:op_id, place, store)
          .then(({ moved, params, core_ids }) => {
            if (!moved) { return; }
            socket.emit('move_cores', {...params, op_id, core_ids});
          });
        }

        const setAsCurrent = () => {
            if (!own && cardObj.value.seted) { return; };
            store.commit('setCurrentCard', cardObj.value.url);
        }

        const drag = (ev) => {
            console.log("Dragging card");
            const parent = card.value.parentElement;
            console.log(own);
            if (!own) { return; }

            ev.dataTransfer.dropEffect = 'move';
            ev.dataTransfer.effectAllowed = 'move';

            const origin = place;
            ev.dataTransfer.setData('player_org', socket.id);
            ev.dataTransfer.setData('card_origin', origin);
            ev.dataTransfer.setData('card_id', cardObj.value.id);

            if (origin == 'in_deck') {
                const card = JSON.stringify({...cardObj.value});
                ev.dataTransfer.setData('card_obj', card);
            }
        }

        const restUnrest = () => {
            const parent = card.value.parentElement;
            if (!own) { return; }
            cardObj.value.rested = !cardObj.value.rested;
            socket.emit('rest_unrest', {
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
.cores_container {
    max-width: 100% !important;
    position: absolute;
    left: 0px;
    top: 50%;

    display: flex;
    flex-wrap: wrap;
}

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