<template>
    <div class="card">
        <img :src="image" v-if="image != ''">
        <img src="../assets/cards/bss_reverse.jpg" v-else>
    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'Card',
    setup() {
        const store = useStore();
        const image = computed(() => {
            const src = store.state.current_card;
            return src;
        });

        return {image}
    }
}
</script>

<style scoped>
.card {
    --width: 250px;
    width: var(--width);
    height: calc(var(--width) * 1.4);

    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
}

.card > img {
    width: 100%;
    height: 100%;
}
</style>
