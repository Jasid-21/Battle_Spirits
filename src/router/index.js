import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MultiplayerView from '../views/MultiplayerView.vue';
import RoomView from '../views/RoomView.vue';
import Cropper from '../views/Cropper.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/rooms',
    name: 'rooms',
    component: MultiplayerView
  },

  {
    path: '/game',
    name: 'game',
    component: RoomView
  },

  {
    path: '/loadDeck',
    name: 'loadDeck',
    component: Cropper
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
