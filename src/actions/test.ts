// app/actions/test.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createNewTest() {
  const supabase = await createClient()

  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    // Start a transaction using RPC
    const { data: test, error: testError } = await supabase
      .rpc('create_random_test', {
        user_id_param: user?.id,
        questions_count: 20
      })

    if (testError) throw testError

    // Redirect to the new test
    revalidatePath('/workspace/practice/tests')
    return { test, error: null, redirect: `/workspace/practice/tests/${test}` }

  } catch (error) {
    console.error('Error creating test:', error)
    return { test: null, error: 'Failed to create test' }
  }
}

export async function deleteTest(testId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
  .from('test_prep_tests')
  .delete()
  .eq('id', testId);

if (error) {
  console.error('Error deleting test:', error);
} else {
  console.log('Test deleted successfully:', data);
}

  revalidatePath('/workspace/practice/tests')
}