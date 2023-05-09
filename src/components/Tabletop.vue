<template>
  <div class="tabletop">
    <img src="../assets/bs_tabletop.png" alt="Battle zone background">
    <FieldSide :own="false" />
    <FieldSide :own="true" />
  </div>
</template>

<script>
import { useStore } from 'vuex';
import FieldSide from './FieldSide.vue';

export default {
    name: 'Tabletop',
    components: {
        FieldSide
    },
    setup() {
        const store = useStore();

        return {}
    }
}
</script>

<style scoped>
.tabletop {
    margin: 0px;
    padding: 0px;

    height: 86%;
    max-height: 100vh;

    position: relative;
}

.tabletop > img {
    max-width: 100%;
    height: 100% !important;
}
</style>
