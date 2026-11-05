<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '../supabase';
import { getCategorieImage } from '../lib/image';

const categories = ref<any[]>([]);

onMounted(async () => {
    const { data, error } = await supabase
        .from('Categorie')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) return console.error(error);

    categories.value = await Promise.all(
        data.map(async (categorie) => {
            const image = await getCategorieImage(categorie.slug);
            return { ...categorie, image: image ?? null }
        })
    );
});
</script>

<template>
<div class="title-wrapper">
    <h1>Ressources Design Social</h1>
</div>

    <h2>Ce site est une ressource permettant de regroupper de nombreux sites et références pour les élèves de design social. 
        Vous pouvez ajouter vos propres sources pour que la comuneauté en profite! :]</h2>

    <section class="gallery">
        <ul>
            <li v-for="categorie in categories" :key="`categorie-${categorie.nom}`">
                <a :href="`/categorie/${categorie.slug}`">
                    <figure>
                        <img v-if="categorie.image" :src="categorie.image" alt="Image 1">
                        <figcaption>{{ categorie.nom }}</figcaption>
                    </figure>
                </a>
            </li>
        </ul>
    </section>
</template>
