<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { supabase } from '../supabase';
import { getCategorieImage } from '../lib/image';

const route = useRoute();
const categorie = ref();
const notFound = ref(false);

onMounted(async () => {
    const { data, error } = await supabase
        .from('Categorie')
        .select('*')
        .eq('slug', String(route.params.slug))
        .maybeSingle();

    if (error) return console.error(error);

    if (error) return console.error(error);

    if (!data) {
        categorie.value = null;
        notFound.value = true;
        return;
    }

    notFound.value = false;
    categorie.value = { ...data, image: await getCategorieImage(data.slug) };
});
</script>

<template>
    <section v-if="categorie">
        <div class="title-wrapper">
            <h1>{{ categorie.nom }}</h1>
        </div>
        <p><a href="/">retour</a></p>
    </section>
    <section v-else>
        <div class="title-wrapper">
            <h1>Catégorie pas trouvé</h1>
        </div>
    </section>
</template>
