<template>
    <div class="trash_cards_zone" data-origin="in_trash" :data-own="own"
    @drop="dropInTrash($event)" @dragenter.prevent @dragover.prevent>
        <div class="trash_options_container">
            <!--To view all trash-->
            <div class="trash_option" @click="showTrash">
                <fai icon="eye" />
            </div>
        </div>
        <img class="trash_card_img" :src="last_card_in_trash.url" v-if="last_card_in_trash">
    </div>
</template>

<script>
import { dropCard } from '@/helpers/functions';
import { computed } from 'vue';
import { useStore } from 'vuex';


export default {
    name: 'Trash_cards_zone',
    props: ['own'],
    setup(props) {
        const store = useStore();
        const own = props.own;

        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;

        const showTrash = () => {
            const params = {
                origin: 'in_trash',
                status: true,
                player: own?socket.id:op_id
            }
            store.commit('changeDisplayerStatus', params);
            store.commit('lookingSomething', {...params, op_id});
            socket.emit('looking_something', {...params, op_id});
        }

        const last_card_in_trash = computed(() => {
            const cards = store.state.cards[props.own?socket.id:op_id].in_trash;
            return cards.length > 0?cards[cards.length - 1]:undefined;
        });

        const dropInTrash = (ev) => {
            if (!props.own) { return; };
            dropCard(ev, socket.id, own?socket.id:op_id, 'in_trash', store, socket)
            .then(({ moved, params }) => {
                if (!moved) { return; };
                socket.emit('move_card', {...params, op_id});
            });
        }

        return {dropInTrash, showTrash, own, last_card_in_trash};
    }
}
</script>

<style scoped>
.trash_option > * {
    width: 80%;
    height: 80%;
}
.trash_option {
    width: 17px;
    height: 17px;

    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: 2px 2px 5px black;
}

.trash_option:hover {
    background-color: rgba(0, 183, 255, 0.6);
    color: white;
}
.trash_options_container {
    width: 30px;
    height: 100%;
    right: -40px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    position: absolute;
}
.trash_card_img {
    max-width: 100% !important;
    max-height: 100% !important;
}

.trash_cards_zone {
    width: 50px;
    height: 70px;
    position: relative;
}
</style>