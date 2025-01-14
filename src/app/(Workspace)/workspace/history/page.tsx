import { createClient } from '@/utils/supabase/server'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { UserResponse } from './components/schema'

export default async function HistoryPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const section = searchParams.section as string | undefined
    const subsection = searchParams.subsection as string | undefined
    const testId = searchParams.test_id as string | undefined
    const isCorrect = searchParams.is_correct as string | undefined

    const supabase = await createClient()

    const { data: userResponses, error } = await supabase
        .from('test_prep_user_responses')
        .select(`
            id,
            user_id,
            question_id,
            selected_answers,
            is_correct,
            attempt_number,
            created_at,
            test_id,
            question:test_prep_questions (
                title_short,
                section:test_prep_sections(name),
                subsection:test_prep_subsections(id, name)
            )
        `)
        .order('id', { ascending: true })
        .returns<Array<UserResponse>>()
        
    if (error) {
        console.error('Error fetching questions:', error)
        return <div>Error fetching questions</div>
    }

    if (!userResponses) {
        return <div>No user responses found</div>
    }

    console.log(userResponses)

    return (
        <div className="space-y-6">
                        <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Question History</h1>
            </div>
            <DataTable 
                data={userResponses} 
                columns={columns} 
                initialFilters={[
                    ...(section ? [{
                        id: 'question.section.name',
                        value: [section]
                    }] : []),
                    ...(subsection ? [{
                        id: 'question.subsection.name',
                        value: [subsection]
                    }] : []),
                    ...(testId ? [{
                        id: 'test_id',
                        value: [testId]
                    }] : []),
                    ...(isCorrect ? [{
                        id: 'is_correct',
                        value: [isCorrect === 'true' ? 'true' : 'false']
                    }] : [])
                ]}
            />
        </div>
    )
}