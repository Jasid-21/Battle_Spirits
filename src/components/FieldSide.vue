<template>
  <div class="masterContainer" :class="{oponents_side: !own}">
    <Hand :own="own" />
    <div class="side_zone left_zone">
      <div class="life_zone"></div>
      <div class="burst_zone"></div>
      <div class="reserve_zone"></div>
    </div>
    <div class="battle_zone">
      <BattleRow :origin="'in_front'" :own="own" />
      <BattleRow :origin="'in_middle'" :own="own" />
      <BattleRow :origin="'in_back'" :own="own" />
    </div>
    <div class="side_zone right_zone">
      <div>
        <Deck :own="own" />
        <div class="trash_zone">
          <div class="trash_cards_zone" @click="showTrash" data-origin="in_trash" :data-own="own"
          @drop="dropInTrash($event)" @dragenter.prevent @dragover.prevent>
            <img class="trash_card_img" :src="last_card_in_trash.url" v-if="last_card_in_trash">
          </div>
          <div class="trash_cores_zone"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue';
import BattleRow from './BattleRow.vue';
import Deck from './Deck.vue';
import Hand from './Hand.vue';

import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import Swal from 'sweetalert2'

export default {
    name: "FieldSide",
    props: ['own'],
    components: {
      Card,
      BattleRow,
      Deck,
      Hand
    },
    setup(props) {
      const store = useStore();
      const socket = store.state.socket;
      const op_id = store.state.op_id;

      const last_card_in_trash = computed(() => {
        const cards = store.state.cards[props.own?socket.socket.id:op_id].in_trash;
        return cards.length > 0?cards[cards.length - 1]:undefined;
      });

      const showTrash = () => {
        store.commit('changeDisplayerStatus', {origin: 'in_trash', status: true});
      }

      const dropInTrash = (ev) => {
        if (!props.own) {
          alert("You are unauthorized to drop cards into your oponents trash...");
          return;
        }

        const origin = ev.dataTransfer.getData('card_origin');
        const card_id = ev.dataTransfer.getData('card_id');
        const card_str = ev.dataTransfer.getData('card_obj');
        const card = card_str?JSON.parse(card_str):undefined;

        const params = {
          origin, destiny: 'in_trash', card,
          player_dest: props.own?socket.socket.id:op_id,
          player_org: socket.socket.id, card_id, op_id
        }

        store.dispatch('moveCard', params)
        .then(moved => {
          if (!moved) {
            console.log("Something went wrong moving the card to trash...");
            return;
          }

          socket.socket.emit('move_card', params);
        })
      }

      return {last_card_in_trash, dropInTrash, showTrash};
    }
}
</script>

<style scoped>
.trash_card_img {
  max-width: 100% !important;
  max-height: 100% !important;
}

.side_zone {
  display: flex;
  flex-direction: column;

  max-height: 100%;
  max-width: 100%;
}

.right_zone {
  align-items: flex-start;
  justify-content: center;
}

.right_zone > div {
  width: 65% !important;
  height: 79% !important;

  max-width: 65% !important;
  max-height: 79% !important;
  margin-top: -5%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.trash_zone {
  width: 100%;
  height: 56%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.trash_cards_zone {
  width: 50px;
  height: 70px;
}

.trash_cores_zone {
  width: 50px;
  height: 35px;
}

.left_zone {
  align-items: flex-end;
  justify-content: space-between;
  padding: 27px 2px;
}
.life_zone, .reserve_zone {

  width: 65%;
  height: 21%;
}

.burst_zone {
  width: 65%;
  height: 36%;
}

.battle_zone {
  width: 100%;
  height: 90%;

  margin-top: 20px;

  display: grid;
  grid-template-rows: 33% 33% 33%;
}

.masterContainer {
    width: 100%;
    height: 50%;

    position: absolute;
    bottom: 0px;

    display: grid;
    grid-template-columns: 20% 60% 20%;
}

.oponents_side {
  transform: rotateZ(180deg);
  bottom: auto;
  top: 0px;
}
</style>
