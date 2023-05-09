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
        <li v-for="(r, idx) of rooms" :key="idx">{{ r }}</li>
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
import Navbar from '@/components/Navbar.vue';
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
export default {
    name: "Multiplayer",
    components: {
      Navbar
    },
    setup() {
      const store = useStore();
      const router = useRouter();

      const deck_list = ref([]);
      const username = ref('Sefirot');
      const choosen_deck = ref('__none__');
      const rooms = ref([]);

      const join = () => {
        if (choosen_deck.value == '__none__') {
          alert("You need to choose a deck to join a game...");
          return;
        }

        const deck = deck_list.value.find(d => d.name == choosen_deck.value);
        store.commit('setChoosenDeck', deck);

        router.push('/game');
      }

      const host = async () => {
        if (!username.value) {
          alert("You need to provide a username...");
          return;
        }
        const resp = await fetch(`http://127.0.0.1:3000/rooms/new?roomName=${username.value}`, {
          method: 'POST'
        });
        const status = resp.status;
        if (status === 200) {
          alert("Room created!");
        }
      }

      const refresh = async () => {
        const resp = await fetch('http://127.0.0.1:3000/rooms/get_all');
        const status = resp.status;

        if (status === 200) {
          const r = await resp.json();
          console.log(r)
          rooms.value = r;
        }
      }

      onMounted(() => {
        deck_list.value = JSON.parse(localStorage.getItem('BSS_Decklist') || '[]');
      });

      return {username, choosen_deck, deck_list, rooms, host, refresh, join};
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
  background-color: rgb(192, 192, 192);
}

.buttons {
  width: 300px;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  justify-content: space-around;
}
</style>