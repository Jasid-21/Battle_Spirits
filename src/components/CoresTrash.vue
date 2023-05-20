<template>
  <div class="trash_cores_zone" data-origin="in_trash" :data-own="own"
    @drop="drop($event)" @dragenter.prevent @dragover.prevent>
    <Core :soul="true" :own="own" :origin="'in_trash'" v-for="s of Array(soul)" :key="s" />
    <Core :soul="false" :own="own" :origin="'in_trash'" v-for="s of Array(commons)" :key="s" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import Core from './Core.vue';

export default {
    name: 'CoresTrash',
    props: ['own'],
    components: {
      Core
    },
    setup(props) {
        const own = props.own;
        const store = useStore();
        const socket = store.state.socket;
        const op_id = store.state.op_id;
        const commons = computed(() => store.state.cores[own?socket.socket.id:op_id].in_trash.commons);
        const soul = computed(() => store.state.cores[own?socket.socket.id:op_id].in_trash.soul);
        const carrier = computed(() => store.state.coresCarrier);

        const drop = (ev) => {
          console.log("Drop!");
          const origin = ev.dataTransfer.getData('origin');
          const player_org = ev.dataTransfer.getData('player_org');
          const card_id_org = ev.dataTransfer.getData('card_id');
          const card_id_dest = undefined;
          const player_dest = own?socket.socket.id:op_id;
          const destiny = 'in_trash';
          const commons = carrier.value.commons;
          const soul = carrier.value.soul;


          const params = { player_org, player_dest, origin, destiny, 
            card_id_org, card_id_dest, commons, soul }
          store.dispatch('moveCores', params);
          socket.socket.emit('move_cores', {...params, op_id});
        }

        return {own, commons, soul, drop};
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
