// app/actions/test.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface TestCreationParams {
    questionCount: number
    includeUnused: boolean
    includeIncorrect: boolean
    includeCorrect: boolean
    sections: string[]
    subsections: string[]
}

export async function createNewTest(formData: FormData) {
    const supabase = await createClient()

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        // Parse form data
        const params: TestCreationParams = {
            questionCount: parseInt(formData.get('questionCount') as string) || 20,
            includeUnused: formData.get('includeUnused') === 'on',
            includeIncorrect: formData.get('includeIncorrect') === 'on',
            includeCorrect: formData.get('includeCorrect') === 'on',
            sections: [],
            subsections: []
        }

        // Get selected sections and subsections
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('section-') && value === 'on') {
                params.sections.push(key.replace('section-', ''))
            }
            if (key.startsWith('subsection-') && value === 'on') {
                params.subsections.push(key.replace('subsection-', ''))
            }
        }

        // Create test using RPC
        const { data: test, error: testError } = await supabase
            .rpc('create_random_test', {
                user_id_param: user?.id,
                questions_count: params.questionCount,
                section_ids: params.sections,
                subsection_ids: params.subsections,
                include_unused: params.includeUnused,
                include_incorrect: params.includeIncorrect,
                include_correct: params.includeCorrect
            })

        if (testError) throw testError

        revalidatePath('/workspace/tests')
        return { test, error: null, redirect: `/workspace/tests/${test}` }

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

  revalidatePath('/workspace/tests')
}