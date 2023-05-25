<template>
    <div class="user_data">
        <div class="username">
            <label for="username">Username: </label>
            <input type="text" placeholder="Type your username" v-model="username">
        </div>
        <div class="deck_selector">
            <label for="deck_selector">Select a Deck: </label>
            <select v-model="choosen_deck">
            <option value="__none__">---</option>
            <option v-for="(o, idx) in deck_list" :key="idx" :value="o.name">{{ o.name }}</option>
            </select>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { onMounted, watch } from 'vue';

export default {
    name: 'UserData',
    setup(props, { emit }) {
        const deck_list = ref([]);
        const username = ref('Player');
        const choosen_deck = ref('__none__');

        onMounted(() => {
            deck_list.value = JSON.parse(localStorage.getItem('BSS_Decklist') || '[]');
            emit('username', username.value);
        });

        watch(choosen_deck, (oldDeck, newDeck) => {
            emit('chosenDeck', choosen_deck.value);
        });

        watch(username, (oldV, newV) => {
            emit('username', username.value);
        })

        return { username, choosen_deck, deck_list };
    }
}
</script>

<style scoped>
.user_data {
    height: 70px;
    background-color: rgb(202, 202, 202);
    border-bottom: 1px solid gray;

    display: flex;
    justify-content: center;
    align-items: center;
}

.user_data {
    font-weight: 700;
}

.username {
    margin-right: 7px;
}

.deck_selector {
    margin-left: 7px;
}
</style>