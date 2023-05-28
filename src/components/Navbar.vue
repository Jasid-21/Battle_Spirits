<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/rooms">Multiplayer</router-link> |
    <router-link to="/loadDeck">Deck Builder</router-link>

    <a class="to_shop" href="https://www.tcgplayer.com/" target="_blank">
      Shop Cards 
      <fai icon="shop" />
    </a>
  </nav>
</template>

<script>
export default {
    name: 'navbar'
}
</script>

<style scoped>
nav {
  width: 100%;
  height: 70px;

  background-color: rgb(219, 121, 121);
  box-shadow: 0px 2px 5px black;
  position: relative;

  grid-column: 1/3;
  grid-row: 1/2;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 20;
}

.to_shop {
  position: absolute;
  right: 10px;
}

.to_shop:hover {
  color: rgb(0, 0, 153);
}

nav a {
  font-weight: bold;
  color: #2c3e50;

  margin-left: 10px;
  margin-right: 10px;

  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #052b7c;
}
</style>
