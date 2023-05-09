<template>
  <h1>Hello world!!</h1>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: "HomeView",
  setup() {
    const socket = io('ws://127.0.0.1:3000');

    socket.on('message', (data) => {
      console.log("Hello there!!");
    });

    return {socket}
  }
}
</script>

<style>

</style>
