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

      const { origin, own } = props;

      const socket = store.state.socket;
      const op_id = store.state.op_id;
      const row_cards = computed(() => {
        const cards = store.state.cards[own?socket.socket.id:op_id];
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
        const card_origin = ev.dataTransfer.getData('card_origin');
        const card_id = ev.dataTransfer.getData('card_id');
        const card_str = ev.dataTransfer.getData('card_obj');
        const card = card_str?JSON.parse(card_str):undefined;
        const player_dest = own?socket.socket.id:op_id;
        const player_org = socket.socket.id;

        const params = { origin: card_origin, destiny: origin, player_dest, player_org, card_id, card };
        console.log(params);
        store.dispatch('moveCard', params)
        .then(moved => {
          if (!moved) {
            alert("Something went wrong moving the card...");
            return;
          }

          socket.socket.emit('move_card', { ...params, op_id });
          adjustSpaces();
        })
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