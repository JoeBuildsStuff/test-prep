import { createClient } from '@/utils/supabase/server'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createNewTest } from '@/actions/test'
import { redirect } from 'next/navigation'
import { Badge } from "@/components/ui/badge"

interface Subsection {
    id: string;
    name: string;
}

interface UserResponse {
    id: string;
    is_correct: boolean;
    question: {
        id: string;
        section: { name: string } | null;
        subsection: { id: string; name: string } | null;
    } | null;
}

interface QuestionCount {
    subsection_id: number;
    subsection_name: string;
    question_count: number;
}

const handleCreateTest = async (formData: FormData) => {
    'use server'
    const result = await createNewTest(formData)
    if (result.error) {
        throw new Error(result.error)
    }
    if (result.redirect) {
        redirect(result.redirect)
    }
}

async function fetchUserResponses() {
    const supabase = await createClient()
    const { data: userResponses } = await supabase
        .from('test_prep_user_responses')
        .select(`
            *,
            question:test_prep_questions (
                id,
                section:test_prep_sections(name),
                subsection:test_prep_subsections(id, name)
            ),
            is_correct
        `)
    return userResponses
}

async function fetchQuestionCounts() {
    const supabase = await createClient()
    const { data } = await supabase.rpc('get_question_counts_by_subsection')
    return data
}

function calculateSubsectionAccuracy(
    userResponses: UserResponse[] | null,
    subsectionId: string
) {
    if (!userResponses) return 0;
    
    const subsectionResponses = userResponses.filter(
        response => String(response.question?.subsection?.id) === String(subsectionId)
    );
    
    if (subsectionResponses.length === 0) return 0;
    
    const correctAnswers = subsectionResponses.filter(response => response.is_correct).length;
    return Math.round((correctAnswers / subsectionResponses.length) * 100);
}

function countUniqueQuestionsAnswered(
    userResponses: UserResponse[] | null,
    subsectionId: string
) {
    if (!userResponses) return 0;
    
    const uniqueQuestions = new Set(
        userResponses
            .filter(response => String(response.question?.subsection?.id) === String(subsectionId))
            .map(response => response.question?.id)
    );
    
    return uniqueQuestions.size;
}

export default async function NewTestPage() {
    const supabase = await createClient()
    const [
        { data: sections },
        userResponses,
        questionCounts
    ] = await Promise.all([
        supabase
            .from('test_prep_sections')
            .select(`
                *,
                subsection:test_prep_subsections(
                    id,
                    name
                )
            `)
            .order('name'),
        fetchUserResponses(),
        fetchQuestionCounts()
    ])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Create New Test</h1>
                <Button variant="secondary" type="submit" form="create-test-form">Create Test</Button>
            </div>

            <form id="create-test-form" action={handleCreateTest} className="space-y-6">
                <div className="space-y-8">
                    <div>
                        <label className="text-lg font-medium">
                            Number of Questions
                            <Input 
                                type="number" 
                                name="questionCount" 
                                defaultValue={20}
                                min={1}
                                className="mt-1 w-32"
                            />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg font-medium">Question Selection</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <Checkbox name="includeUnused" defaultChecked />
                                <span>Unused Questions</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox name="includeIncorrect" />
                                <span>Incorrect Questions</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <Checkbox name="includeCorrect" />
                                <span>Correct Questions</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg font-medium">Section Selection</label>
                        

                    {sections?.map((section) => (
                        <Table key={section.id}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead colSpan={2}>{section.name}</TableHead>
                                    <TableHead className="text-right w-[100px]">Questions</TableHead>
                                    <TableHead className="text-right w-[100px]">Attempted</TableHead>
                                    <TableHead className="text-right w-[100px]">Accuracy</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {section.subsection?.map((sub: Subsection) => {
                                    const questionCount = questionCounts?.find(
                                        (qc: QuestionCount) => qc.subsection_name === sub.name
                                    )?.question_count || 0;
                                    
                                    const answeredCount = countUniqueQuestionsAnswered(userResponses, String(sub.id));
                                    const accuracy = calculateSubsectionAccuracy(userResponses, String(sub.id));

                                    return (
                                        <TableRow key={sub.id}>
                                            <TableCell className="w-12">
                                                <Checkbox 
                                                    name={`subsection-${sub.id}`}
                                                    defaultChecked
                                                />
                                            </TableCell>
                                            <TableCell className="w-full">{sub.name}</TableCell>
                                            <TableCell className="text-right w-[100px]">
                                                <Badge variant="outline">
                                                    {questionCount}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right w-[100px]">
                                                {answeredCount > 0 && (
                                                    <Badge variant="outline">
                                                        {answeredCount}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right w-[100px]">
                                                {answeredCount > 0 && (
                                                    <Badge 
                                                        variant={
                                                            accuracy >= 85 ? "green" : 
                                                            accuracy >= 70 ? "yellow" : 
                                                            "red"
                                                        }
                                                    >
                                                        {accuracy}%
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ))}
                                                </div>
                </div>
            </form>
        </div>
    )
}