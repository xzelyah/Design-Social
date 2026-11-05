import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Categorie from "./views/Categorie.vue";
import AjoutCategorie from "./views/AjoutCategorie.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/ajouter-categorie', component: AjoutCategorie },
    { path: '/categorie/:slug', component: Categorie },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;
