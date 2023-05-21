<template>
    <div class="row" ref="row" :data-origin="origin" :data-own="own"
    @drop="drop($event)" @dragenter.prevent @dragover.prevent>
        <Card v-for="c of row_cards" :place="origin" 
        :key="c.id" :margin_left="space" :card="c" :own="own" />
    </div>
</template>

<script>
import { computed, nextTick, onMounted, onUpdated, ref } from 'vue';
import { dropCard } from '@/helpers/functions';
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

      const { origin, own } = props;

      const socket = store.state.socket.socket;
      const op_id = store.state.op_id;
      const row_cards = computed(() => {
        const cards = store.state.cards[own?socket.id:op_id];
        return cards[origin];
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
        dropCard(ev, socket.id, own?socket.id:op_id, origin, store)
        .then(({ moved, params }) => {
            if (!moved) { return; };
            socket.emit('move_card', { ...params, op_id });
        });
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