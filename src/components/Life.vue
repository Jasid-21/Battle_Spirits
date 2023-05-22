<template>
    <div class="life_zone" data-origin="in_life" :data-own="own"
    @dragenter.prevent @dragover.prevent @drop="drop($event)">
        <Core :own="own" v-for="(c, idx) of cores.filter(c => c.soul)" 
        :key="idx" :origin="'in_life'" :core="c" />
        <Core :own="own" v-for="(c, idx) of cores.filter(c => !c.soul)" 
        :key="idx" :origin="'in_life'" :core="c" />
    </div>  
</template>

<script>
import Core from './Core.vue';
import { useStore } from 'vuex'
import { dropCores } from '@/helpers/functions';
import { computed, onMounted } from 'vue';

export default {
    name: 'Life',
    components: { Core },
    props: ['own'],
    setup(props) {
        const store = useStore();
        const own = props.own;
        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;
        const cores = computed(() => store.state.cores[own?socket.id:op_id].in_life);

        const drop = (ev) => {
            dropCores(ev, undefined, own?socket.id:op_id, 'in_life', store)
            .then(({ moved, params }) => {
                if (!moved) { return; }
                socket.emit('move_cores', {...params, op_id});
            });
        }

        return { own, cores, drop };
    }
}
</script>

<style scoped>
.life_zone {
    width: 65%;
    height: 15%;
    margin-top: 7%;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 50% 50%;
}

.life_zone > div {
    align-self: center;
}
</style>