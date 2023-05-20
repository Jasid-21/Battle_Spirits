<template>
    <div class="reserve_zone" :data-own="own" data-origin="in_reserve"
    @drop="drop($event)" @dragenter.prevent @dragover.prevent @dblclick="incrementCores">
        <CoreVue :soul="true" v-for="c of Array(soul)" 
        :key="c" :origin="'in_reserve'" :own="own" />
        <CoreVue :soul="false" v-for="c of Array(commons)" 
        :origin="'in_reserve'" :own="own" :key="c" />
    </div>
</template>

<script>
import { useStore } from 'vuex';
import CoreVue from './Core.vue';

import Swal from 'sweetalert2';
import { computed } from 'vue';

export default {
    name: 'reserve_zone',
    props: ['own'],
    components: { CoreVue },
    setup(props) {
        const store = useStore();
        const own = props.own;
        const socket = store.state.socket;
        const op_id = store.state.op_id;
        const commons = computed(() => store.state.cores[own?socket.socket.id:op_id].in_reserve.commons);
        const soul = computed(() => store.state.cores[own?socket.socket.id:op_id].in_reserve.soul);
        const carrier = computed(() => store.state.coresCarrier);

        const drop = (ev) => {
          console.log("Drop!");
          const origin = ev.dataTransfer.getData('origin');
          const player_org = ev.dataTransfer.getData('player_org');
          const card_id_org = ev.dataTransfer.getData('card_id');
          const card_id_dest = undefined;
          const player_dest = own?socket.socket.id:op_id;
          const destiny = 'in_reserve';
          const commons = carrier.value.commons;
          const soul = carrier.value.soul;


          const params = { player_org, player_dest, origin, destiny, 
            card_id_org, card_id_dest, commons, soul }
          store.dispatch('moveCores', params);
          socket.socket.emit('move_cores', {...params, op_id});
        }

        const incrementCores = () => {
            if (!own) { return };
            const params = { player_org: socket.socket.id, origin: 'in_reserve' }
            store.commit('incrementCores', params);
            socket.socket.emit('increment_cores', {...params, op_id});
        }

        return { own, commons, soul, drop, incrementCores };
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
