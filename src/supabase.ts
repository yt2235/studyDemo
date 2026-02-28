// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 针对国内网络环境，如果存在代理则使用代理
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const isServer = typeof window === 'undefined';
    if (isServer && (process.env.HTTP_PROXY || process.env.HTTPS_PROXY)) {
        try {
            const { ProxyAgent } = await import('undici');
            const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
            const agent = new ProxyAgent(proxyUrl!);
            return fetch(input, { ...init, dispatcher: agent } as any);
        } catch (e) {
            console.warn('Failed to load undici ProxyAgent, falling back to default fetch', e);
        }
    }
    return fetch(input, init);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { fetch: customFetch }
})