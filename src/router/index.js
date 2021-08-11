import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/layouts/Home.vue';
import _import from './importer';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        name: 'Index',
        component: _import('index/Index'),
      },
      {
        path: 'trips',
        name: 'Trips',
        component: _import('trips/Index'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
