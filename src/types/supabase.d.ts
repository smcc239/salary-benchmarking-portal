declare module '@supabase/supabase-js' {
  export interface SupabaseClient {
    auth: {
      signIn: (credentials: { email: string; password: string }) => Promise<{ user: any; error: any }>;
      signOut: () => Promise<{ error: any }>;
      onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } };
    };
    from: (table: string) => {
      select: (columns?: string) => {
        eq: (column: string, value: any) => Promise<{ data: any; error: any }>;
        insert: (data: any) => Promise<{ data: any; error: any }>;
        update: (data: any) => Promise<{ data: any; error: any }>;
        delete: () => Promise<{ data: any; error: any }>;
      };
    };
  }

  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: {
      auth?: {
        autoRefreshToken?: boolean;
        persistSession?: boolean;
        detectSessionInUrl?: boolean;
      };
    }
  ): SupabaseClient;
} 