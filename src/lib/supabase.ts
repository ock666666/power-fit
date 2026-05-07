import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ekjktmianrptxkagsifk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_C-pLVbyji_Cz861Q0TCpXg_CWG8u3Nd';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let userId: string | null = null;

export async function getUserId(): Promise<string | null> {
  if (userId) return userId;

  // Try cached session first
  const cached = localStorage.getItem('supabase_user_id');
  if (cached) {
    userId = cached;
    return userId;
  }

  // Anonymous sign-in
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    userId = data.user?.id || null;
    if (userId) localStorage.setItem('supabase_user_id', userId);
  } catch {
    console.warn('Supabase 匿名登录失败，使用本地模式');
  }

  return userId;
}
