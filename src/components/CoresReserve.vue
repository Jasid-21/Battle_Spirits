<template>
    <div class="reserve_zone" :data-own="own" data-origin="in_reserve"
    @drop="drop($event)" @dragenter.prevent @dragover.prevent @dblclick="incrementCores">
        <Core :own="own" v-for="(c, idx) of cores.filter(c => c.soul)" 
        :key="idx" :origin="'in_reserve'" :core="c" />
        <Core :own="own" v-for="(c, idx) of cores.filter(c => !c.soul)" 
        :key="idx" :origin="'in_reserve'" :core="c" />
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, onMounted } from 'vue';
import { dropCores } from '@/helpers/functions';
import Core from './Core.vue';

export default {
    name: 'reserve_zone',
    props: ['own'],
    components: { Core },
    setup(props) {
        const store = useStore();
        const own = props.own;
        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;
        const cores = computed(() => store.state.cores[own?socket.id:op_id].in_reserve);

        const drop = (ev) => {
          dropCores(ev, undefined, own?socket.id:op_id, 'in_reserve', store)
          .then(({ moved, params, core_ids }) => {
            if (!moved) { return; }
            socket.emit('move_cores', {...params, op_id, core_ids});
          });
        }

        const incrementCores = () => {
            if (!own) { return };
            const params = { player_org: socket.id, origin: 'in_reserve', op_id }
            socket.emit('increment_cores', params);
        }

        return { own, cores, drop, incrementCores };
    }
}
</script>

<style scoped>
.reserve_zone > div {
    align-self: center;
}
.reserve_zone {
    width: 65%;
    height: 21%;
    cursor: pointer;

    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(3, 33%);

    overflow: hidden;
}
</style>
