<template>
  <div class="masterContainer" :class="{oponents_side: !own}">
    <Hand :own="own" />
    <div class="side_zone left_zone">
      <div class="life_zone"></div>
      <Burst :own="own" />
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
          <TrashCards :own="own" />
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
import Trash from './Trash.vue';
import Burst from './Burst.vue';
import { ref } from 'vue';

export default {
    name: "FieldSide",
    props: ['own'],
    components: {
      Card,
      BattleRow,
      Deck,
      TrashCards: Trash,
      Hand,
      Burst
    },
    setup(props) {
      const cardInBurst = ref({});

      return {cardInBurst};
    }
}
</script>

<style scoped>
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
