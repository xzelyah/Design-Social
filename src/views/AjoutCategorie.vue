<script setup lang="ts">
import { computed, ref } from 'vue';
import { supabase } from '../supabase';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

type Categorie = {
    slug: string,
    nom: string,
    description: string,
    image: File | null
};

const error = ref<string>('');
const loading = ref<boolean>(false);

const categorie = ref<Categorie>({ slug: '', nom: '', description: '', image: null });

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const slug = computed(() => slugify(categorie.value.nom));

function onImageUpdate(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file && file.size > MAX_IMAGE_BYTES) {
        error.value = "L'image doit être en dessous de 2MB";
        input.value = '';
        return;
    }

    error.value = '';
    categorie.value.image = file;
}

async function submit() {
    error.value = '';

    loading.value = true;

    try  {
        const { error: insertError } = await supabase.from('Categorie').insert({
            slug: slug.value,
            nom: categorie.value.nom.trim(),
            description: categorie.value.description.trim(),
        });

        if (insertError) {
            error.value = insertError.code === "23505" ? "Cette catégorie existe déjà, choisissez un autre nom" : insertError.message;
            return;
        }

        const file = categorie.value.image;

        if (file) {
            const ext = file.name.split('.').pop();
            const { error: uploadError } = await supabase.storage
                .from('images-categories')
                .upload(`${slug.value}.${ext}`, file, { contentType: file.type });

            if (uploadError) {
                error.value = `La catégorie à été créée, mais l'image n'a pas pu être envoyée : ${uploadError.message}`;
                return;
            }
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <section>
        <div class="title-wrapper">
            <h1>Ajouter une catégorie</h1>
        </div>
        <form @submit.prevent="submit">
            <div>
                <label for="nom">Catégorie :</label>
                <input type="text" name="nom" id="nom" v-model="categorie.nom" />
            </div>

            <div>
                <label for="description">Description :</label>
                <input type="text" name="description" id="description" v-model="categorie.description" />
            </div>

            <div>
                <label for="image">Image :</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/png,image/jpeg,image/webp"
                    @change="onImageUpdate"
                />
            </div>

            <p>{{ error }}</p>

            <button type="submit" :disabled="loading">Ajouter une catégorie</button>
        </form>
    </section>
</template>
