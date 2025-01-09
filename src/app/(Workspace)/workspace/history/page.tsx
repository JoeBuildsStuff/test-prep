import { createClient } from '@/utils/supabase/server'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { UserResponse } from './components/schema'

export default async function HistoryPage() {
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
        <div>
            <DataTable data={userResponses} columns={columns} />

        </div>
    )
}