<template>
    <div class="masterContainer">
        <div class="requests_container">
            <ul class="requests">
                <li v-for="r of requests" :key="r.user_id" 
                :class="{choosen: chosen_request.id == r.user_id}"
                @click="selectRequest(r.user_id, r.username)">{{ r.username }}</li>
            </ul>
        </div>
        <div class="buttons">
            <button class="refresh" @click="accept" :disabled="!chosen_request.id">
                Accept
            </button>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'Requests',
    setup(props) {
        const store = useStore();

        const socket = computed(() => store.state.socket.socket);
        const requests = computed(() => store.state.requests);
        const chosen_request = ref({ username: '__none__', id: '' });

        const selectRequest = (id, name) => {
            chosen_request.value.username = name;
            chosen_request.value.id = id;
        }

        const accept = () => {
            socket.value.emit('accept_duel', { op_id: chosen_request.value.id });
        }

        onMounted(() => {
            store.commit('clearRequests');
        })

        return { requests, chosen_request, selectRequest, accept };
    }
}
</script>

<style scoped>
.masterContainer {
    width: 400px;
    height: 100%;
    margin-top: 10px;

    display: grid;
    grid-template-rows: 85% 15%;
}
.requests_container {
    max-height: calc(100% - 24px);

    border: 2px solid black;
    border-radius: 5px;
    padding: 10px;

    overflow: auto;
}

.requests_container > ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
}

.requests_container > ul > li {
  border-bottom: 1px solid gray;
  text-align: left;
  padding-left: 10px;
}

.requests_container > ul > li:hover {
  cursor: pointer;
  background-color: rgb(202, 204, 207);
  box-shadow: 2px 2px 4px rgb(32, 88, 126);
  font-weight: 700;
}

.requests_container > ul > li.choosen {
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