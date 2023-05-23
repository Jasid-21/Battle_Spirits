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

export default {
    name: 'GameRoom',
    components: {
        CurrentCard,
        TabletopVue,
        Card,
        CardListDisplayer,
        PhasesButtonsVue,
        GameChat
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
}

.game_section_container {
    height: 100%;

    background-color: rgba(80, 80, 80, 0.4);
    
    display: grid;
    grid-template-columns: 83% 17%;
}
</style>
