import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/layouts/Home.vue';
import _import from './importer';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: { name: 'Index' },
    children: [
      {
        path: '',
        name: 'Index',
        component: _import('index/Index'),
      },
      {
        path: 'travel',
        name: 'Travel',
        component: _import('travel/Index'),
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
