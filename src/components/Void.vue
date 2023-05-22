<template>
    <div class="void_zone" @drop="drop($event)"
    @dragenter.prevent @dragover.prevent>
        <span>Void</span>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { dropCores } from '@/helpers/functions';
export default {
    name: 'Void',
    props: ['own'],
    setup(props) {
        const store = useStore();
        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;
        const own = props.own;

        const drop = (ev) => {
            dropCores(ev, undefined, own?socket.id:op_id, 'in_void', store)
            .then(({ moved, params, core_ids }) => {
                if (!moved) { return; }
                socket.emit('move_cores', { ...params, op_id, core_ids });
            })
        }

        return { own, drop };
    }
}
</script>

<style scoped>
.void_zone > span {
    color: rgb(204, 204, 204);
    font-weight: 700;
    display: table-cell;
    vertical-align: middle;
}
.void_zone {
    width: 60px;
    height: 100px;

    background-color: rgba(0, 0, 0, 0.8);
    border: 2px solid rgb(77, 77, 77);
    border-radius: 15px;

    position: absolute;
    left: -64px;
    bottom: 60px;
    
    display: table;
}
</style>