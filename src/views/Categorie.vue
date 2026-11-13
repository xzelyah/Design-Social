<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { supabase } from '../supabase';
import { getCategorieImage } from '../lib/image';
import AjoutElement from './AjoutElement.vue';

const route = useRoute();
const categorie = ref();
const notFound = ref(false);
const elementLimit = ref(5);
const elements = ref<any[] | null>([]);

onMounted(async () => {
    const { data: categorieDB, error: errCategorie } = await supabase
        .from('Categorie')
        .select('*')
        .eq('slug', String(route.params.slug))
        .maybeSingle();

    if (errCategorie) return console.error(errCategorie);

    if (!categorieDB) {
        categorie.value = null;
        notFound.value = true;
        return;
    }

    notFound.value = false;
    categorie.value = { ...categorieDB, image: await getCategorieImage(categorieDB.slug) };

    const { data: elementDB, error: errElement } = await supabase
        .from('Element')
        .select('*')
        .eq('categorie_id', categorie.value.id)
        .order('created_at', { ascending: false })
        .limit(elementLimit.value);

    if (errElement) return console.error(errElement);

    if (!elementDB) {
        elements.value = null;
        return;
    }

    elements.value = elementDB;
});
</script>

<template>
    <section v-if="categorie">
        <div class="title-wrapper">
            <h1>{{ categorie.nom }}</h1>
        </div>
        <p><a href="/">retour</a></p>
        <AjoutElement :categorie-id="categorie.id" />
        <ul>
            <li v-for="element in elements">
                <p><a target="_blank" :href="element.url">{{ element.titre }}</a></p>
                <p>{{ element.description }}</p>
            </li>
        </ul>
    </section>
    <section v-else>
        <div class="title-wrapper">
            <h1>Catégorie pas trouvé</h1>
        </div>
    </section>
</template>
