<script setup lang="ts">
import { computed, ref } from 'vue';
import { supabase } from '../supabase';
import Categorie from './Categorie.vue';

type Element = {
    slug: string,
    titre: string,
    description: string,
    url: string
};

const { categorieId } = defineProps<{ categorieId: number }>();

const error = ref<string>('');
const loading = ref<boolean>(false);

const element = ref<Element>({ slug: '', titre: '', description: '', url: '' });

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const slug = computed(() => slugify(element.value.titre));

async function submit() {
    error.value = '';
    loading.value = true;

    try  {
        const { error: insertError } = await supabase.from('Element').insert({
            categorie_id: categorieId,
            slug: slug.value,
            titre: element.value.titre.trim(),
            description: element.value.description.trim(),
            url: element.value.url.trim(),
        });

        if (insertError) {
            error.value = insertError.code === "23505" ? "Cette catégorie existe déjà, choisissez un autre nom" : insertError.message;
            return;
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <section>
        <div class="title-wrapper">
            <h1>Ajouter une ressource à la catégorie</h1>
        </div>
        <form @submit.prevent="submit">
            <div>
                <label for="titre">Titre de la ressource :</label>
                <input type="text" name="titre" id="titre" v-model="element.titre" />
            </div>

            <div>
                <label for="description">Description :</label>
                <input type="text" name="description" id="description" v-model="element.description" />
            </div>

            <div>
                <label for="url">Url :</label>
                <input type="text" name="url" id="url" v-model="element.url" />
            </div>

            <p>{{ error }}</p>

            <button type="submit" :disabled="loading">Ajouter une catégorie</button>
        </form>
    </section>
</template>
