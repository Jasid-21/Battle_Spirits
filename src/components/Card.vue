<template>
    <div class="card_container" draggable="true" :id="cardObj.id"
    :class="{rested: cardObj.rested}" ref="card"
    @dragstart.stop="drag($event)"
    @dblclick="restUnrest"
    :style="{'margin-left': (marginLeft || 15) + 'px'}">
        <img :src="cardObj.url" @mouseenter="setAsCurrent" v-if="cardObj.url || !cardObj.seted" />
        <img src="../assets/cards/bss_reverse.jpg" @mouseenter="setAsCurrent" v-else>
    </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'Card',
    props: {
        margin_left: {type: Number},
        card: {default: {id: '', url: '', seted: false, rested: false}}
    },
    setup(props) {
        const store = useStore();

        const marginLeft = computed(() => props.margin_left);
        const cardObj = computed(() => {
            console.log(props.card);
            return props.card;
        });
        const card = ref(null);


        const setAsCurrent = () => {
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
            ev.dataTransfer.setData('card_origin', parent.getAttribute('data-origin'));
            ev.dataTransfer.setData('card_id', cardObj.value.id);
        }

        const restUnrest = () => {
            const parent = card.value.parentElement;
            if (!JSON.parse(parent.getAttribute('data-own'))) {
                alert("You are unauthorized change oponents cards state...");
                return;
            }
            cardObj.value.rested = !cardObj.value.rested;
        }

        return {marginLeft, cardObj, setAsCurrent, drag, restUnrest, card};
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