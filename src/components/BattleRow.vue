<template>
    <div class="row" ref="row" :data-origin="origin" :data-own="own"
    @drop="drop($event)" @dragenter.prevent @dragover.prevent>
        <Card v-for="c of row_cards" 
        :key="c.id" :margin_left="space" :card="c" />
    </div>
</template>

<script>
import { computed, nextTick, onMounted, onUpdated, ref } from 'vue';
import Card from './Card.vue';
import { useStore } from 'vuex';

export default {
    name: 'BattleRow',
    props: ['origin', 'own'],
    components: {
      Card
    },
    setup(props) {
      const store = useStore();
      const row_cards = computed(() => {
        const cards = store.state.cards[props.origin];
        console.log(cards);
        return cards;
      });
      const space = ref(15);
      const row = ref(null);

      function adjustSpaces() {
          const row_width = row.value.clientWidth;
          const card_width = 50;
          const cards_count = row_cards.value.length;

          const available_space = row_width - card_width*cards_count || Infinity;
          if (available_space > cards_count*15) {
            space.value = 15;
            return;
          }

          space.value = available_space/cards_count;
      }

      function drop(ev) {
        const origin = ev.dataTransfer.getData('card_origin');
        const card_id = ev.dataTransfer.getData('card_id');

        adjustSpaces();
        store.dispatch('moveCard', {origin, destiny: props.origin, card_id});
      }

      onMounted(() => {
        window.onload = () => {
          adjustSpaces();
        }
      });

      onUpdated(() => {
        nextTick(adjustSpaces());
      });

      return {row, row_cards, space, adjustSpaces, drop};
    },
}
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>