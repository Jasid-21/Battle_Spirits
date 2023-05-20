<template>
    <div ref="core" class="core" :class="{soul, selected}" draggable="true"
  @click="flipSelectStatus" @dragstart.stop="drag($event)">
        <fai icon="diamond" />
    </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
export default {
    name: 'Core',
    props: ['soul', 'own', 'origin'],
    setup(props) {
        const store = useStore();
        const core = ref(null);

        const soul = props.soul;
        const own = props.own;
        const origin = props.origin;

        const socket = store.state.socket;
        const op_id = store.state.op_id;
        const selected = ref(false);

        const flipSelectStatus = () => {
            if (!own) { return; };
            selected.value = !selected.value;

            const params = {
                inc: selected.value,
                soul
            }
            store.commit('modifyCoresCarrier', params);
        }

        const drag = (ev) => {
            console.log("Drag!");
            if (!own) { return; };
            ev.dataTransfer.dropEffect = 'move';
            ev.dataTransfer.effectAllowed = 'move';

            const card_id = core.value.parentElement.getAttribute('id');
            ev.dataTransfer.setData('origin', origin);
            ev.dataTransfer.setData('player_org', socket.socket.id);

            if (card_id) {
                ev.dataTransfer.setData('card_id', card_id);
            }
        }

        return {core, soul, selected, flipSelectStatus, drag};
    }
}
</script>

<style scoped>
.core.selected {
    color: rgb(0, 91, 177);
}
.core {
    width: 13px;
    height: 13px;
    color: rgb(0, 121, 177);
}

.core.soul {
    color: red;
}
</style>