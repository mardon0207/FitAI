
const { createClient } = require('./node_modules/@supabase/supabase-js');
const supabaseUrl = 'https://vuxpysphjpqpnutpfbux.supabase.co';
const supabaseKey = 'sb_publishable_2RGeXc3sR1GE-AOTd0MyWQ_ML8KfY1L';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'abdunazarovmardon@gmail.com',
    password: 'admin123'
  });

  if (authError) return console.error('Login failed:', authError.message);
  
  console.log('User ID:', authData.user.id);
  
  const { data: profile, error: profError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();
    
  if (profError) {
    console.error('Profile fetch error:', profError);
  } else {
    console.log('Profile Data:', profile);
  }
}

run();
