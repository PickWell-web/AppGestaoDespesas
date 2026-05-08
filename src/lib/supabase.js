import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfqyryzusjbuxjesiozy.supabase.co';
const supabaseAnonKey = 'sb_publishable_sIM50TWMMpzqHnTy133dPw_kEa64OAw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
