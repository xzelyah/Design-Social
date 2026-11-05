import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Categorie from "./views/Categorie.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/categorie/:slug', component: Categorie },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
