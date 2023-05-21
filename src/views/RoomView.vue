<template>
    <div class="masterContainer">
        <div class="card_info">
            <CurrentCard />
        </div>
        <div class="game_section_container">
            <div class="playable">
                <CardListDisplayer />
                <TabletopVue />
            </div>
            <div class="phases_and_options">
                <div class="phases">
                    <button v-for="(b, idx) of phases" :key="idx">{{ b }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CurrentCard from '@/components/CurrentCard.vue';
import TabletopVue from '../components/Tabletop.vue';
import Card from '@/components/Card.vue';
import CardListDisplayer from '@/components/CardListDisplayer.vue';

import { useStore } from 'vuex';
export default {
    name: 'GameRoom',
    components: {
        CurrentCard,
        TabletopVue,
        Card,
        CardListDisplayer,
    },

    setup() {
        const phases = ['Start', 'Core', 'Draw', 'Refresh', 'Main', 'Attack', 'End'];

        const store = useStore();

        return { phases };
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
    grid-template-columns: 30% 70%;

    background: url('../assets/dalle_background_croped.png');
    background-position-y: bottom;
    background-repeat: no-repeat;
    background-size: cover;

    overflow: hidden;
}

.card_info {
    height: 100%;

    background-color: rgba(84, 84, 116, 0.6);
}

.game_section_container {
    height: 100%;

    background-color: rgba(80, 80, 80, 0.4);
    
    display: grid;
    grid-template-columns: 85% 15%;
}

.phases_and_options {
    width: 100%;
    height: 100%;
    background-color: rgba(189, 189, 189, 0.0);

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.phases {
    width: 70px;

    background-color: rgba(223, 223, 223, 0.4);
    border: 2px solid rgb(41, 41, 41);
    border-radius: 10px;
    padding: 10px;
    padding-bottom: 0px;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.phases > button {
    width: 100%;
    height: 25px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid gray;
}
</style>
