<template>
  <div class="masterContainer" :class="{oponents_side: !own}">
    <div class="side_zone left_zone">
      <div class="life_zone"></div>
      <div class="burst_zone"></div>
      <div class="reserve_zone"></div>
    </div>
    <div class="battle_zone">
      <BattleRow :origin="'in_front'" :own="own" v-if="own" />
      <BattleRow :origin="'in_front_op'" :own="own" v-else />
      <BattleRow :origin="'in_middle'" :own="own" v-if="own" />
      <BattleRow :origin="'in_middle_op'" :own="own" v-else />
      <BattleRow :origin="'in_back'" :own="own" v-if="own" />
      <BattleRow :origin="'in_back_op'" :own="own" v-else />
    </div>
    <div class="side_zone right_zone">
      <div>
        <div class="deck_zone" @dblclick="drawCard"
        @drop="dropInDeck($event)" @dragenter.prevent @dragover.prevent>
          <img src="../assets/cards/bss_reverse.jpg" class="back_card">
        </div>
        <div class="trash_zone">
          <div class="trash_cards_zone"></div>
          <div class="trash_cores_zone"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue';
import BattleRow from './BattleRow.vue';

import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import Swal from 'sweetalert2'

export default {
    name: "FieldSide",
    props: ['own'],
    components: {
      Card,
      BattleRow
    },
    setup(props) {
      const store = useStore();
      const cards_in_deck = computed(() => store.state.cards_in_deck);

      const drawCard = () => {
        if (!props.own) {
          alert("You're unauthorized to draw cards from oponents deck...");
          return;
        }
        store.commit('drawCard');
      }

      const dropInDeck = (ev) => {
        if (!props.own) {
          alert("You are unauthorized to drop cards into your oponents deck...");
          return;
        }

        const origin = ev.dataTransfer.getData('card_origin');
        const card_id = ev.dataTransfer.getData('card_id');

        Swal.fire({
          title: "Sending card to deck",
          text: "Where do you want to send the card to",
          confirmButtonText: "Top",
          cancelButtonText: "Bottom",
          showCancelButton: true,
          focusConfirm: false
        }).then(result => {
          const top = result.isConfirmed;
          store.dispatch('returnToDeck', {origin, card_id, top});
        });
      }

      onMounted(() => {
        store.dispatch('shuffleDeck');
      })

      return {cards_in_deck, drawCard, dropInDeck};
    }
}
</script>

<style scoped>
.back_card {
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

.trash_zone > div {
  background-color: rgb(43, 148, 43);
}

.trash_cards_zone {
  width: 50px;
  height: 70px;
}

.trash_cores_zone {
  width: 50px;
  height: 35px;
}

.deck_zone {
  background-color: rgb(43, 148, 43);
  width: 90% !important;
  height: 32% !important;
  max-width: 90% !important;
  max-height: 32% !important;
  margin-top: 8%;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.left_zone {
  align-items: flex-end;
  justify-content: space-between;
  padding: 27px 2px;
}
.life_zone, .reserve_zone {
  background-color: rgb(43, 148, 43);
  width: 65%;
  height: 21%;
}

.burst_zone {
  background-color: rgb(43, 148, 43);
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
