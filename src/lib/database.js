import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export const db = {
    // Create a new ID card
    async createCard(cardData, photoFile) {
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

        // 2. Insert record
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
