import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { QuestionAttempt } from './question-attempt'
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface QuestionOptions {
  [key: string]: string;
}

interface Question {
  id: string;
  type: string;
  section: string | null;
  subsection: string | null;
  difficulty: string | null;
  question: string;
  options: QuestionOptions;
  correctanswer: string;
  explanation: string;
  created_at: string;
  updated_at: string;
}

const formatQuestionId = (num: number): string => {
  return `Q${num.toString().padStart(3, '0')}`
}

const getQuestionNumber = (id: string): number => {
  return parseInt(id.replace('Q', ''))
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: question, error } = await supabase
    .from('test_prep_questions')
    .select('*')
    .eq('id', id)
    .single<Question>()

  if (error || !question) {
    notFound()
  }

  const currentNum = getQuestionNumber(id)
  const prevId = currentNum > 1 ? formatQuestionId(currentNum - 1) : null
  const nextId = formatQuestionId(currentNum + 1)

  const { data: nextExists } = await supabase
    .from('test_prep_questions')
    .select('id')
    .eq('id', nextId)
    .single()

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href={prevId ? `/workspace/practice/questions/${prevId}` : '#'}>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!prevId}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        </Link>
        <Link href={nextExists ? `/workspace/practice/questions/${nextId}` : '#'}>
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
        <div className="flex items-center gap-2">
          {question.difficulty && (
            <Badge variant={
              question.difficulty.toLowerCase() === 'hard' 
                ? 'destructive'
                : question.difficulty.toLowerCase() === 'medium'
                ? 'outline'
                : 'default'
            }>
              {question.difficulty}
            </Badge>
          )}
          <Badge variant="secondary">{question.type}</Badge>
        </div>
      </div>

      <QuestionAttempt question={question} />

      <div className="flex items-center justify-between">
        <Link href={prevId ? `/workspace/practice/questions/${prevId}` : '#'}>
          <Button 
            variant="outline" 
            size="sm"
            disabled={!prevId}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        </Link>
        <Link href={nextExists ? `/workspace/practice/questions/${nextId}` : '#'}>
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