<template>
    <div ref="core" class="core" draggable="true"
    :class="{soul: coreObj.soul, selected: coreObj.selected}"
    @click="flipSelectStatus" @dragstart.stop="drag($event)">
        <img src="../assets/soul_core.png" v-if="coreObj.soul">
        <img src="../assets/common_core.png" v-else>
    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
export default {
    name: 'Core',
    props: {
        core: { default: {id: '', soul: false, selected: false} },
        own: { type: Boolean },
        origin: { default: '', type: String }
    },
    setup(props) {
        const store = useStore();
        const core = ref(null);

        const own = props.own;
        const origin = props.origin;
        const coreObj = computed(() => props.core);
        const socket = store.state.socket;

        const flipSelectStatus = () => {
            if (!own) { return; }
            coreObj.value.selected = !coreObj.value.selected;
        }

        const drag = (ev) => {
            console.log("Drag!");
            if (!own) { return; }
            ev.dataTransfer.dropEffect = 'move';
            ev.dataTransfer.effectAllowed = 'move';

            const card_id = core.value.parentElement.getAttribute('id');
            ev.dataTransfer.setData('origin', origin);
            ev.dataTransfer.setData('player_org', socket.socket.id);

            if (card_id) {
                ev.dataTransfer.setData('card_id', card_id);
            }
        }

        return {core, coreObj, flipSelectStatus, drag};
    }
}
</script>

<style scoped>
.core > img {
    max-width: 100% !important;
    max-height: 100% !important;
}
.core.selected {
    background-color: rgba(214, 245, 255, 0.596);
}

.core.soul.selected {
    background-color: rgba(255, 214, 214, 0.596);
}

.core {
    width: 14px;
    height: 14px;
    background-color: rgba(99, 219, 255, 0.3);
    border-radius: 50%;
}

.core.soul {
    background-color: rgba(255, 85, 85, 0.5);
}
</style>