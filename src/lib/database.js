import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export const db = {
    // Create a new ID card
    async createCard(cardData, photoFile, signatureFile) {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error('User not authenticated');

        // 1. Upload photo
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${user.id}/${uuidv4()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('id-card-photos')
            .upload(fileName, photoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('id-card-photos')
            .getPublicUrl(fileName);

        // 2. Upload signature if exists
        let signatureUrl = null;
        if (signatureFile) {
            const sigExt = signatureFile.name.split('.').pop();
            const sigName = `${user.id}/${uuidv4()}_sig.${sigExt}`;

            const { error: sigUploadError } = await supabase.storage
                .from('id-card-photos')
                .upload(sigName, signatureFile);

            if (sigUploadError) throw sigUploadError;

            const { data: { publicUrl: sigPublicUrl } } = supabase.storage
                .from('id-card-photos')
                .getPublicUrl(sigName);

            signatureUrl = sigPublicUrl;
        }

        // 3. Insert record
        const { data, error } = await supabase
            .from('id_cards')
            .insert([
                {
                    user_id: user.id,
                    full_name: cardData.fullName,
                    dob: cardData.dob,
                    phone_number: cardData.phoneNumber,
                    email: cardData.email,
                    photo_url: publicUrl,
                    organization_name: cardData.organizationName,
                    signature_url: signatureUrl,
                    id_number: `ID-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`, // Simple unique ID gen
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get all cards for current user
    async getCards() {
        const { data, error } = await supabase
            .from('id_cards')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get single card
    async getCard(id) {
        const { data, error } = await supabase
            .from('id_cards')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }
};
