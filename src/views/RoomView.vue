<template>
    <div class="masterContainer">
        <div class="card_info">
            <CurrentCard />
            <button class="back_to_rooms" @click="leaveRoom">
                Leave
            </button>
        </div>
        <div class="game_section_container">
            <div class="playable">
                <CardListDisplayer />
                <TabletopVue />
            </div>
            <PhasesButtonsVue />
        </div>
        <GameChat />
    </div>
</template>

<script>
import CurrentCard from '@/components/CurrentCard.vue';
import TabletopVue from '../components/Tabletop.vue';
import Card from '@/components/Card.vue';
import CardListDisplayer from '@/components/CardListDisplayer.vue';
import PhasesButtonsVue from '../components/PhasesButtons.vue';
import GameChat from '@/components/GameChat.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: 'GameRoom',
    components: {
        CurrentCard,
        TabletopVue,
        Card,
        CardListDisplayer,
        PhasesButtonsVue,
        GameChat
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;

        const leaveRoom = () => {
            socket.emit('leave_room', { op_id });
            router.push('/rooms');
        }

        return { leaveRoom };
    }
}
</script>

<style scoped>
.playable {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.masterContainer {
    width: 100vw;
    height: 100vh;

    display: grid;
    grid-template-columns: 25% 57% 18%;

    background: url('../assets/dalle_background_croped.png');
    background-position-y: bottom;
    background-repeat: no-repeat;
    background-size: cover;

    overflow: hidden;
}

.card_info {
    height: 100%;
    background-color: rgba(84, 84, 116, 0.6);

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.back_to_rooms {
    width: 100px;
    height: 25px;
    border: 2px solid rgb(151, 151, 151);
    margin-bottom: 10px;
}

.back_to_rooms:hover {
    background-color: gray;
}

.back_to_rooms * {
    text-decoration: none;
    color: black;
    font-weight: 700;
}

.game_section_container {
    height: 100%;

    background-color: rgba(80, 80, 80, 0.4);
    
    display: grid;
    grid-template-columns: 83% 17%;
}
</style>
