<template>
    <div class="phases_and_options">
        <div class="phases">
            <button v-for="(b, idx) of phases" :key="idx" 
            :class="{selected: b == activePhase, active}"
            @click="setAsSelected(b)">
                {{ b }}
            </button>
            <button class="end_turn" :class="{ active }" @click="endTurn">
                End turn
            </button>
        </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'PhasesButtons',
    setup() {
        const store = useStore();
        const socket = store.state.socket.socket;
        const op_id = store.state.op_id;
        const activePhase = computed(() => store.state.activePhase);
        const active = computed(() => store.state.active);
        const phases = ref(['Start', 'Core', 'Draw', 'Refresh', 'Main', 'Attack', 'End']);

        const setAsSelected = (name) => {
            if (!active.value) { return; }
            store.dispatch('changePhase', { name });

            socket.emit('change_phase', { name, op_id });
        }

        const endTurn = () => {
            if (!active.value) { return; }
            store.commit('changeTurn');
            socket.emit('change_turn', { player_org: socket.id, op_id});
        }

        return { active, activePhase, phases, setAsSelected, endTurn };
    }
}
</script>

<style scoped>
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
    font-weight: 700;
}

button.selected {
    background-color: rgb(155, 48, 48);
}

button.selected.active {
    background-color: rgb(48, 125, 155);
}
.phases > button.active:hover {
    background-color: rgb(81, 171, 207);
}

button.end_turn {
    width: 120%;
    margin-top: 10px;
    background-color: rgb(255, 91, 159);
    border: 2px solid rgb(180, 0, 84);
}

button.end_turn.active:hover {
    background-color: rgb(212, 49, 125);
    color: white;
}
</style>