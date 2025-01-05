'use server'

import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"
import Link from 'next/link'

export default async function QuestionBankPage() {
    const supabase = await createClient()

    const { data: questions, error } = await supabase
        .from('test_prep_questions')
        .select(`
            id, 
            type,
            section:test_prep_sections(name),
            subsection:test_prep_subsections(name)
        `)
        .returns<Array<{
            id: string;
            type: string;
            section: { name: string } | null;
            subsection: { name: string } | null;
        }>>()

    if (error) {
        console.error('Error fetching questions:', error)
        return <div>Error fetching questions</div>
    }

    const sectionsArray = questions
        .map(q => q.section?.name)
        .filter(Boolean) as string[]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Question Bank</h1>
                <div className="flex gap-2">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Sections" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sections</SelectItem>
                            {[...new Set(sectionsArray)].map(section => (
                                <SelectItem key={section} value={section}>
                                    {section || 'No Section'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Total Questions", value: questions.length },
                    { 
                        label: "Question Types", 
                        value: new Set(questions.map(q => q.type)).size 
                    },
                    { 
                        label: "Sections", 
                        value: new Set(questions.map(q => q.section?.name)).size 
                    },
                    { 
                        label: "Subsections", 
                        value: new Set(questions.map(q => q.subsection?.name)).size 
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

            {/* Questions List */}
            <Card className="border-none">
                <CardContent className="p-4">
                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <>
                                <div 
                                    key={question.id} 
                                    className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">
                                                {question.type || 'No Type'}
                                            </span>
                                            <span className="text-sm text-muted-foreground">•</span>
                                            <span className="text-sm text-muted-foreground">
                                                {question.section?.name || 'No Section'}
                                            </span>
                                            {question.subsection && (
                                                <>
                                                    <span className="text-sm text-muted-foreground">•</span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {question.subsection.name}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <h3 className="font-medium">Question #{question.id}</h3>
                                    </div>
                                    <Link href={`/workspace/practice/questions/${question.id}`}>
                                        <Button size="sm" variant="secondary">Select</Button>
                                    </Link>
                                </div>
                                {index < questions.length - 1 && <Separator />}
                            </>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Empty State */}
            {questions.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                        <div className="mx-auto h-12 w-12 rounded-full bg-muted" />
                        <h3 className="mt-4 font-medium">No Questions Found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Try adjusting your filters or check back later for new questions.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}