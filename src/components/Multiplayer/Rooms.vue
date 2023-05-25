<template>
    <div class="masterContainer">
        <div class="avaliable_rooms_container">
            <ul class="avaliable_rooms">
                <li v-for="r of rooms" :key="r.id" 
                :class="{ choosen: choosen_room.id == r.id }"
                @click="selectRoom(r.id, r.username)">{{ r.username }}</li>
            </ul>
        </div>
        <div class="buttons">
            <button class="refresh" @click="refresh">Refresh</button>
            <button class="host" @click="host">Host</button>
            <button class="request" @click="request">request</button>
        </div>
    </div>
</template>

<script>
import { socketCreator } from '@/helpers/classes';
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, onMounted, watch } from 'vue';
import Swal from 'sweetalert2'

export default {
    name: 'Rooms',
    props: ['own', 'username', 'chosen_deck'],
    setup(props) {
        const store = useStore();
        const router = useRouter();

        const username = computed(() => props.username);
        const choosen_deck = computed(() => props.chosen_deck);


        var socket;
        const deck_list = ref([]);
        const rooms = ref([]);
        const choosen_room = ref({name: '', id: ''});

        const request = () => {
            if (choosen_deck.value == '__none__') {
                Swal.fire({
                    title: 'App message',
                    html: 'You need to select a <strong>deck</strong> to request a duel...'
                });

                return;
            }

            if (choosen_room.value.id == -1) {
                Swal.fire({
                    title: 'App message',
                    html: 'You need to select a <strong>room</strong> to request a duel...'
                });

                return;
            }

            const deck = deck_list.value.find(d => d.name == choosen_deck.value).deck;

            socket.socket.emit('request_duel', {
                username: username.value,
                board_id: choosen_room.value.id,
                deckString: deck
            });
        }

        const host = async () => {
            if (!username.value) {
            Swal.fire({
                title: 'App message',
                html: 'Please, provide an <strong>username</strong> before hosting...'
            });
            return;
            }

            if (choosen_deck.value == '__none__') {
            Swal.fire({
                title: 'App message',
                html: 'You need to select a <strong>deck</strong> to start hosting...'
            });

            return;
            }
            const deck = deck_list.value.find(d => d.name == choosen_deck.value).deck;

            socket.socket.emit('host_room', {username: username.value, deck});
        }

        const refresh = async () => {
            const resp = await fetch('http://127.0.0.1:3000/rooms/getAll');
            const status = resp.status;

            if (status === 200) {
            const r = await resp.json();
            console.log(r)
            rooms.value = r.rooms;
            }
        }

        const selectRoom = (id, name) => {
            choosen_room.value.id = id;
            choosen_room.value.name = name;
        }

        onMounted(() => {
            deck_list.value = JSON.parse(localStorage.getItem('BSS_Decklist') || '[]');
            socket = new socketCreator(deck_list.value, store, router);
            store.commit('setSocket', socket);
        });

        watch(choosen_deck, (oldDeck, newDeck) => {
            console.log("Chosen deck changed");
            socket.setDeck(choosen_deck);
        })

        return {username, choosen_deck, deck_list, rooms, choosen_room, selectRoom, host, refresh, request};
    }

}
</script>

<style scoped>
.masterContainer {
    width: 500px;
    height: 100%;
    margin-top: 10px;

    display: grid;
    grid-template-rows: 85% 15%;
}
.avaliable_rooms_container {
    max-height: calc(100% - 24px);

    border: 2px solid black;
    border-radius: 5px;
    padding: 10px;

    overflow: auto;
}

.avaliable_rooms_container > ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
}

.avaliable_rooms_container > ul > li {
  border-bottom: 1px solid gray;
  text-align: left;
  padding-left: 10px;
}

.avaliable_rooms_container > ul > li:hover {
  cursor: pointer;
  background-color: rgb(202, 204, 207);
  box-shadow: 2px 2px 4px rgb(32, 88, 126);
  font-weight: 700;
}

.avaliable_rooms_container > ul > li.choosen {
  background-color: rgb(106, 145, 197);
  color: white;
  font-weight: 700;
}

.buttons {
    width: 100%;
    height: min-content;

    align-self: flex-end;
    display: flex;
    justify-content: space-around;
}

.buttons > button {
    height: 25px;
    font-weight: 700;
}
</style>