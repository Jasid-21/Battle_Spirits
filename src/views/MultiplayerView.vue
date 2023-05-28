<template>
  <div class="masterContainer">
    <Navbar />
    <UserData @username="handleUsername" @chosenDeck="handleChosenDeck" />
    <div class="rooms_and_requests_container">
      <Requests :chosen_deck="chosen_deck" />
      <Rooms :username="username" :chosen_deck="chosen_deck" />
    </div>
    <div class="hosting_username" v-if="hosting_name">
      <b>Your username.</b>
      <br>
      {{ hosting_name }}
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Rooms from '@/components/Multiplayer/Rooms.vue';
import UserData from '@/components/Multiplayer/UserData.vue';
import Requests from '@/components/Multiplayer/Requests.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
    name: "Multiplayer",
    components: {
      Navbar,
      Rooms,
      UserData,
      Requests
    },
    setup() {
      const store = useStore();
      const username = ref('');
      const chosen_deck = ref('__none__');
      const hosting_name = computed(() => store.state.hostingName);

      const handleUsername = (usrName) => {
        console.log(usrName);
        username.value = usrName;
      }

      const handleChosenDeck = (deck) => {
        chosen_deck.value = deck;
      }

      return { handleUsername, handleChosenDeck, username, chosen_deck, hosting_name };
    }
}
</script>

<style scoped>
.rooms_and_requests_container {
  width: 100%;
  height: 300px;

  display: flex;
  justify-content: space-around;
}

.hosting_username {
  margin-top: 50px;
}
</style>