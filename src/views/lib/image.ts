import { supabase } from "../../supabase";

export async function getCategorieImage(slug: string): Promise<string | null> {
    const bucket = supabase.storage.from('images-categories');

    const { data, error } = await bucket.list('', {
        limit: 10,
        search: slug,
    });

    if (error || !data) return null;

    const file = data.find(
        (f) => f.name !== '.emptyFolderPlaceholder' && f.name.replace(/\.[^.]+$/, '')
    );

    if (!file) return null;

    return bucket.getPublicUrl(file.name).data.publicUrl;
}
