// app/actions/test.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface TestCreationParams {
    questionCount: number
    includeUnused: boolean
    includeIncorrect: boolean
    includeCorrect: boolean
    subsections: string[]
    certificationId: string
}

export async function createNewTest(formData: FormData) {
    const supabase = await createClient()

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        // Get certification ID from form data
        const certificationId = formData.get('certificationId') as string
        if (!certificationId) {
            throw new Error('Certification ID is required')
        }

        // Parse form data
        const params: TestCreationParams = {
            questionCount: parseInt(formData.get('questionCount') as string) || 20,
            includeUnused: formData.get('includeUnused') === 'on',
            includeIncorrect: formData.get('includeIncorrect') === 'on',
            includeCorrect: formData.get('includeCorrect') === 'on',
            subsections: [],
            certificationId
        }

        // Get selected sections and subsections
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('subsection-') && value === 'on') {
                params.subsections.push(key.replace('subsection-', ''))
            }
        }

        // Create test using RPC
        const { data: test, error: testError } = await supabase
            .schema('test_prep')
            .rpc('create_random_test', {
                user_id_param: user?.id,
                certification_id_param: params.certificationId,
                questions_count: params.questionCount,
                subsection_ids: params.subsections,
                include_unused: params.includeUnused,
                include_incorrect: params.includeIncorrect,
                include_correct: params.includeCorrect
            })
        if (testError) throw testError

        // Get the certification route name for redirect
        const { data: certification } = await supabase
            .schema('test_prep')
            .from('certifications')
            .select('code')
            .eq('id', params.certificationId)
            .single()

        const certNameToRoute: Record<string, string> = {
            'MLA-C01': 'ml-engineer',
            'CLF-C02': 'cloud-practitioner',
        }
        const routeName = certNameToRoute[certification?.code || ''] || 'ml-engineer'

        revalidatePath(`/${routeName}/tests`)
        return { test, error: null, redirect: `/${routeName}/tests/${test}` }

    } catch (error) {
        console.error('Error creating test:', error)
        return { test: null, error: 'Failed to create test' }
    }
}

export async function deleteTest(testId: string, certificationId?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
  .schema('test_prep')
  .from('tests')
  .delete()
  .eq('id', testId);

  if (error) {
    console.error('Error deleting test:', error);
  } else {
    console.log('Test deleted successfully:', data);
  }

  // If certificationId is provided, revalidate the specific certification route
  if (certificationId) {
    const { data: certification } = await supabase
      .schema('test_prep')
      .from('certifications')
      .select('code')
      .eq('id', certificationId)
      .single()

    const certNameToRoute: Record<string, string> = {
      'MLA-C01': 'ml-engineer',
      'CLF-C02': 'cloud-practitioner',
    }
    const routeName = certNameToRoute[certification?.code || ''] || 'ml-engineer'
    revalidatePath(`/${routeName}/tests`)
  } else {
    // Fallback to revalidating all test routes
    revalidatePath('/ml-engineer/tests')
    revalidatePath('/cloud-practitioner/tests')
  }
}