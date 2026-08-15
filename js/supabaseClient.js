import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(window.BGS_CONFIG.SUPABASE_URL, window.BGS_CONFIG.SUPABASE_ANON_KEY);
