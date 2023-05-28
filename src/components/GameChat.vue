<template>
    <form class="chat">
        <ul class="messages_container" ref="messagesContainer">
            <li class="message" :class="{ important: m.important }" v-for="(m, idx) of messages" :key="idx">
                <strong>{{ m.sender_id==player_id?'You':'Oponent' }}: </strong><span>{{ m.msg }}</span>
            </li>
        </ul>
        <div class="sender">
            <input class="textbox" type="text" v-model="message">
            <input type="submit" value="Send" @click.prevent="newMessage">
        </div>
    </form>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'GameChat',
    setup() {
        const store = useStore();
        const messagesContainer = ref(null);
        const socket = store.state.socket.socket;
        const players = store.state.players;
        const op_id = store.state.op_id;
        const messages = computed(() => store.state.messages);
        const message = ref("");

        const scrollMessages = () => {
            nextTick(() => {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
            })
        }

        const newMessage = () => {
            console.log(players);
            const params = { 
                msg: message.value,
                player_org: socket.id,
                players
            };
            store.commit('newMessage', params);
            socket.emit('new_message', { ...params, op_id });
            message.value = '';
        }

        onMounted(() => {
            scrollMessages();
        });

        watch(messages, (current, old) => {
            scrollMessages();
        }, {deep: true});

        return { messagesContainer, messages, message, player_id: socket.id, newMessage };
    }
}
</script>

<style scoped>
.chat {
    width: 100%;
    height: 100%;
    max-height: 100vh;

    background-color: rgba(255, 255, 255, 0.8);
    border-left: 2px solid rgb(161, 161, 161);

    display: grid;
    grid-template-rows: 80% 20%;
}

.messages_container {
    width: 100%;
    height: calc(100% - 10px);
    margin: 0px;
    padding: 0px;
    padding-top: 10px;

    overflow-y: auto;
}

.messages_container::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
}
.messages_container::-webkit-scrollbar-track {
    width: 10px;
    background-color: rgb(192, 192, 192);
}

.messages_container::-webkit-scrollbar-thumb {
    width: 10px;
    background-color: rgb(0, 0, 70);
    border-radius: 50px;
}

.message {
    font-size: 15px;
    margin-bottom: 10px;
    margin-left: 5px;
    text-align: left;
}

.message > span {
    color: rgb(65, 65, 65) !important;
}

.message.important {
    font-weight: 700;
    color: rgb(0, 0, 136);
    font-style: italic;
}

.textbox {
    width: 100%;
    height: 25px;
    border-radius: 3px;
    border: 1px solid gray;
    background-color: rgba(255, 255, 255, 0.5);
    color: rgb(48, 48, 48);
    -moz-box-sizing:border-box;
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
}

.sender {
    background-color: rgb(187, 187, 187);
    width: calc(100% - 10px);
    height: calc(100% - 5px);

    border: 2px solid gray;
    border-radius: 10px;

    align-self: flex-end;
    justify-self: center;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.sender > input[type="submit"] {
    margin-top: 5px;
    width: 100px;
    height: 25px;
}
</style>
