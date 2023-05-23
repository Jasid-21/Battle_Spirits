<template>
  <div class="masterContainer">
    <Navbar />
    <div class="user_data">
      <div class="username">
        <label for="username">Username: </label>
        <input type="text" v-model="username">
      </div>
      <div class="deck_selector">
        <label for="deck_selector">Select a Deck:</label>
        <select v-model="choosen_deck">
          <option value="__none__">---</option>
          <option v-for="(o, idx) in deck_list" :key="idx" :value="o.name">{{ o.name }}</option>
        </select>
      </div>
    </div>
    <br>
    <hr>
    <div class="avaliable_rooms_container">
      <ul class="avaliable_rooms">
        <li v-for="(r, idx) of rooms" :key="idx" 
        :class="{choosen: choosen_room.id == idx}"
        @click="selectRoom(idx)">{{ r }}</li>
      </ul>
    </div>
    <br>
    <div class="buttons">
      <button class="refresh" @click="refresh">Refresh</button>
      <button class="host" @click="host">Host</button>
      <button class="join" @click="join">Join</button>
    </div>
  </div>
</template>

<script>
import { socketCreator } from '@/helpers/classes';
import Navbar from '@/components/Navbar.vue';
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';
import Swal from 'sweetalert2'

export default {
    name: "Multiplayer",
    components: {
      Navbar
    },
    setup() {
      const store = useStore();
      const router = useRouter();

      var socket;
      const deck_list = ref([]);
      const username = ref('Player');
      const choosen_deck = ref('__none__');
      const rooms = ref([]);
      const choosen_room = ref({name: '', id: -1, board_id: ''});

      const join = () => {
        if (choosen_deck.value == '__none__') {
          Swal.fire({
            title: 'App message',
            html: 'You need to select a <strong>deck</strong> to join into a room...'
          });

          return;
        }

        if (choosen_room.value.id == -1) {
          Swal.fire({
            title: 'App message',
            html: 'You need to select a <strong>room</strong> to join into it...'
          });

          return;
        }

        socket.socket.emit('start_duel', {
          username: username.value,
          board_name: choosen_room.value.name,
          deckString: deck_list.value.find(d => d.name == choosen_deck.value).deck
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

      const selectRoom = (idx) => {
        choosen_room.value.id = idx;
        choosen_room.value.name = rooms.value[idx];
      }

      onMounted(() => {
        deck_list.value = JSON.parse(localStorage.getItem('BSS_Decklist') || '[]');
        socket = new socketCreator(deck_list.value, store, router);
        store.commit('setSocket', socket);
      });

      watch(choosen_deck, (oldDeck, newDeck) => {
        console.log("Chosen deck changed");
        socket.setDeck(choosen_deck.value);
      })

      return {username, choosen_deck, deck_list, rooms, choosen_room, selectRoom, host, refresh, join};
    }
}
</script>

<style scoped>
.avaliable_rooms_container {
  width: min-content;
  min-width: 500px;
  height: 300px;

  margin-left: auto;
  margin-right: auto;

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
  padding-top: 10px;
  border-bottom: 1px solid gray;
  text-align: left;
  padding-left: 10px;
}

.avaliable_rooms_container > ul > li:hover {
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
  width: 300px;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  justify-content: space-around;
}
</style>