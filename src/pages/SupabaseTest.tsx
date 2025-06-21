import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function SupabaseTest() {
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    console.log('SupabaseTest mounted');
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        console.log('Supabase response:', { data, error });
        if (error) {
          setStatus('error');
          setError(error.message);
        } else {
          setStatus('success');
          setData(data);
        }
      } catch (e) {
        setStatus('error');
        setError('Unexpected error: ' + (e as Error).message);
      }
    }
    testConnection();
  }, []);

  if (status === 'loading') return <div style={{padding:32}}>Testing Supabase connection...</div>;
  if (status === 'error') return <div style={{padding:32, color:'red'}}>Supabase connection failed: {error}</div>;
  return <div style={{padding:32, color:'green'}}>Supabase connection successful!<pre>{JSON.stringify(data, null, 2)}</pre></div>;
}
