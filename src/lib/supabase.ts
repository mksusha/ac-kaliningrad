import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey ? "OK" : "NOT FOUND");

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL или ключ не найдены! Проверь .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
