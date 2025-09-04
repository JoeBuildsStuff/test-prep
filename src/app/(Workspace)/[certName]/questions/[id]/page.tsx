import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { QuestionAttempt } from './question-attempt'
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TestPrepQuestion } from '@/utils/supabase/types'

const formatQuestionId = (num: number): string => {
  return `Q${num.toString().padStart(3, '0')}`
}

const getQuestionNumber = (id: string): number => {
  return parseInt(id.replace('Q', ''))
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string; certName: string }>
}) {
  const { id, certName } = await params
  const supabase = await createClient()

  const { data: question, error } = await supabase
    .schema('test_prep')
    .from('questions')
    .select(`
      *,
      section:sections(name),
      subsection:subsections(name),
      tags:question_tags(
        tag:tags(name)
      ),
      user_favorites(id)
    `)
    .eq('id', id)
    .single<TestPrepQuestion & {
      section: { name: string } | null;
      subsection: { name: string } | null;
      tags: { tag: { name: string } }[];
      user_favorites: { id: string }[];
    }>()

  if (error || !question) {
    notFound()
  }

  const currentNum = getQuestionNumber(id)
  const prevId = currentNum > 1 ? formatQuestionId(currentNum - 1) : null
  const nextId = formatQuestionId(currentNum + 1)

  const { data: nextExists } = await supabase
    .schema('test_prep')
    .from('questions')
    .select('id')
    .eq('id', nextId)
    .single()

  const questionForAttempt = {
    ...question,
    section: question.section?.name || null,
    subsection: question.subsection?.name || null,
    tags: question.tags.map(({ tag }) => tag.name),
    is_favorited: (question.user_favorites?.length ?? 0) > 0,
    // Parse options if it's a string (fix for JSONB being returned as string)
    options: typeof question.options === 'string' 
      ? JSON.parse(question.options) 
      : question.options
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href={prevId ? `/${certName}/questions/${prevId}` : '#'}>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!prevId}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        </Link>
        <Link href={nextExists ? `/${certName}/questions/${nextId}` : '#'}>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!nextExists}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Question #{question.id}</h1>
      </div>

      <QuestionAttempt question={questionForAttempt} />

      <div className="flex items-center justify-between">
        <Link href={prevId ? `/${certName}/questions/${prevId}` : '#'}>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!prevId}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        </Link>
        <Link href={nextExists ? `/${certName}/questions/${nextId}` : '#'}>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!nextExists}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}