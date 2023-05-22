<template>
  <div class="trash_cores_zone" data-origin="in_trash" :data-own="own"
    @drop="drop($event)" @dragenter.prevent @dragover.prevent>
    <Core :own="own" :origin="'in_trash'" 
    v-for="(c, idx) of cores.filter(c => c.soul)" :key="idx" :core="c" />
    <Core :own="own" :origin="'in_trash'" 
    v-for="(c, idx) of cores.filter(c => !c.soul)" :key="idx" :core="c" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import Core from './Core.vue';
import { dropCores } from '@/helpers/functions';

export default {
    name: 'CoresTrash',
    props: ['own'],
    components: {
      Core
    },
    setup(props) {
        const own = props.own;
        const store = useStore();
        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;
        const cores = computed(() => store.state.cores[own?socket.id:op_id].in_trash);

        const drop = (ev) => {
          dropCores(ev, undefined, own?socket.id:op_id, 'in_trash', store)
          .then(({ moved, params }) => {
            if (!moved) { return; }
            socket.emit('move_cores', {...params, op_id});
          });
        }

        return {own, cores, drop};
    }
}
</script>

<style scoped>
.trash_cores_zone {
  width: 50px;
  height: 35px;
  cursor: pointer;

  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(3, 33%);

  overflow: hidden;
}
</style>
