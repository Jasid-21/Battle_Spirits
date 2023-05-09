<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/rooms">Multiplayer</router-link> |
    <router-link to="/loadDeck">Deck Builder</router-link>
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
  height: 100%;

  background-color: rgb(219, 121, 121);
  box-shadow: 0px 2px 5px black;

  grid-column: 1/3;
  grid-row: 1/2;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 10;
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
