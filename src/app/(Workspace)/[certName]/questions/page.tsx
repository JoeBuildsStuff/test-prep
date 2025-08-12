import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { notFound } from 'next/navigation'

// Add function to get certification by certName
async function getCertificationByCertName(certName: string) {
  const supabase = await createClient()
  
  // Map certName to certification code
  const certNameToCode: Record<string, string> = {
    'ml-engineer': 'MLA-C01',
    'cloud-practitioner': 'CLF-C02',
    // Add more mappings as needed
  }
  
  const certCode = certNameToCode[certName]
  
  if (!certCode) {
    return null
  }
  
  const { data: certification, error } = await supabase
    .schema('test_prep')
    .from('certifications')
    .select('*')
    .eq('code', certCode)
    .single()
    
  if (error || !certification) {
    return null
  }
  
  return certification
}

export default async function QuestionBankPage({
    params,
    searchParams: searchParamsPromise
}: {
    params: Promise<{ certName: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { certName } = await params
    const searchParams = await searchParamsPromise
    
    const section = searchParams.section as string | undefined
    const subsection = searchParams.subsection as string | undefined
    const questionId = searchParams.id as string | undefined

    // Get certification
    const certification = await getCertificationByCertName(certName)
    
    if (!certification) {
        notFound()
    }

    const supabase = await createClient()
    const { data: questions, error } = await supabase
        .schema('test_prep')
        .from('questions')
        .select(`
            id, 
            type,
            title_short,
            section:sections(name),
            subsection:subsections(name),
            tags:question_tags(
                tag:tags(name)
            ),
            user_responses:user_responses(
                is_correct,
                created_at,
                selected_answers
            )
        `)
        .eq('certification_id', certification.id)
        .order('id', { ascending: true })
        .returns<Array<{
            id: string;
            type: string;
            title_short: string;
            section: { name: string } | null;
            subsection: { name: string } | null;
            tags: Array<{ tag: { name: string } }> | null;
            user_responses: Array<{
                is_correct: boolean;
                created_at: string;
                selected_answers: string[];
            }> | null;
        }>>()

    if (error) {
        console.error('Error fetching questions:', error)
        return <div>Error fetching questions</div>
    }

    if (!questions) {
        return <div>No questions found</div>
    }

    // Get user favorites
    const { data: favorites } = await supabase
        .schema('test_prep')
        .from('user_favorites')
        .select('question_id');

    // Transform the data including favorites
    const transformedQuestions = questions.map(q => ({
        id: q.id,
        type: q.type,
        title: q.title_short,
        section: q.section?.name ?? '',
        subsection: q.subsection?.name ?? '',
        tags: q.tags?.map(t => t.tag.name).join(', ') ?? '',
        attempts: q.user_responses?.length ?? 0,
        accuracy: q.user_responses?.length 
            ? Math.round((q.user_responses.filter(r => r.is_correct).length / q.user_responses.length) * 100)
            : 0,
        lastResponse: q.user_responses?.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0] ?? null,
        favorite: favorites?.some(f => f.question_id === q.id) ?? false
    }))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Question Bank</h1>
                <div className="text-sm text-muted-foreground">
                    {certification.provider} - {certification.name}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Total Questions", value: questions.length },
                    { 
                        label: "Sections", 
                        value: new Set(questions.map(q => q.section?.name).filter(Boolean)).size 
                    },
                    { 
                        label: "Subsections", 
                        value: new Set(questions.map(q => q.subsection?.name).filter(Boolean)).size 
                    },
                    { 
                        label: "Tags", 
                        value: new Set(
                            questions
                                .flatMap(q => q.tags?.map(tag => tag.tag.name) || [])
                        ).size 
                    },
                ].map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 px-4 pb-4">
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DataTable 
                data={transformedQuestions} 
                columns={columns} 
                initialFilters={[
                    ...(section ? [{
                        id: 'section',
                        value: [section]
                    }] : []),
                    ...(subsection ? [{
                        id: 'subsection',
                        value: [subsection]
                    }] : []),
                    ...(questionId ? [{
                        id: 'id',
                        value: [questionId]
                    }] : []),
                    ...(searchParams.favorite ? [{
                        id: 'favorite',
                        value: [searchParams.favorite === 'true' ? 'true' : 'false']
                    }] : [])
                ]}
            />
        </div>
    )
}