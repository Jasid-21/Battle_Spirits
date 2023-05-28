<template>
  <div class="masterContainer">
    <Navbar />
    <Instructions />
    <footer>
      <div>
        <strong>Contact and feedback: </strong> siternet.21@gmail.com
      </div>
      <div>
        <strong>Privacy Policy: </strong>This website does not store or use information from visitors.
      </div>
      <div>
        This web application is a nonprofit fanmade Online version for Bandai's Battle Spirits Saga tcg.
      </div>
      <div>
        Card design & artwork are <b>© BNP/BANDAI</b> and used without permission under fair use.
      </div>
      <div>
        Please support the official release.
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Instructions from '@/components/HomeComponent/Instructions.vue';

export default {
  name: "HomeView",
  components: {
    Navbar,
    Instructions
  },
  setup() {

    return {};
  }
}
</script>

<style scoped>
.masterContainer {
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

footer {
  width: 100%;
  height: 100px;
  background-color: black;
  padding: 10px 0px;

  font-size: 15px;
  text-align: center;
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
