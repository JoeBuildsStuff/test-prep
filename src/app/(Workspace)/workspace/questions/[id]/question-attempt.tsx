'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bookmark, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from '@/utils/supabase/client'
import { QuestionMetadata } from "./question-metadata"
import ReactMarkdown from 'react-markdown'

interface QuestionAttemptProps {
  question: {
    id: string
    question: string
    options: Record<string, string>
    correctanswer: string
    explanation: string
    markdown_explanation: string
    type: string
    section: string | null
    subsection: string | null
    tags?: string[]
    is_favorited?: boolean
  }
  testId?: string
  previousResponse?: {
    selected_answers: string[]
    is_correct: boolean
  }
}

export function QuestionAttempt({ question, testId, previousResponse }: QuestionAttemptProps) {
  const supabase = createClient()
  const router = useRouter()

  const [selectedAnswer, setSelectedAnswer] = useState<string[]>(
    previousResponse?.selected_answers || []
  )
  const [isSubmitted, setIsSubmitted] = useState(!!previousResponse)
  const [isCorrect, setIsCorrect] = useState(previousResponse?.is_correct || false)
  const [attemptError, setAttemptError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(question.is_favorited || false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAnswer.length === 0) return
    setAttemptError(null)

    let correct = false
    if (question.type === 'MULTIPLE_CHOICE') {
      // Normalize both arrays: convert to uppercase and sort
      const selectedAnswers = selectedAnswer.map((a: string) => a.toUpperCase()).sort()
      // Handle both string and array formats of correctanswer
      const correctAnswers = Array.isArray(question.correctanswer)
        ? question.correctanswer.map((a: string) => a.toUpperCase()).sort()
        : question.correctanswer
        // TODO: This is a temporary fix to handle the array format
            .replace(/[\[\]'"]/g, '') // Remove any brackets or quotes
            .split(',')
            .map(a => a.trim().toUpperCase())
            .sort()
      
      correct = selectedAnswers.join(',') === correctAnswers.join(',')
    } else if (question.type === 'SINGLE_CHOICE') {
      const correctAnswer = Array.isArray(question.correctanswer) 
        ? question.correctanswer[0] 
        : question.correctanswer.replace(/[\[\]'"]/g, '')

      correct = selectedAnswer[0].toUpperCase() === correctAnswer
    }

    try {
      // Get the current attempt number
      const { data: attempts } = await supabase
        .from('test_prep_user_responses')
        .select('attempt_number')
        .eq('question_id', question.id)
        .order('attempt_number', { ascending: false })
        .limit(1)

      const nextAttemptNumber = attempts?.[0] ? attempts[0].attempt_number + 1 : 1

      // Insert the response
      const { error } = await supabase
        .from('test_prep_user_responses')
        .insert({
          question_id: question.id,
          selected_answers: selectedAnswer.map((a: string) => a.toUpperCase()),
          is_correct: correct,
          attempt_number: nextAttemptNumber,
          test_id: testId || null
        })

      if (error) throw error

      // After successful response insertion, update the test score
      if (testId) {
        const { error: scoreError } = await supabase
          .rpc('update_test_score', { test_id_param: testId })

        if (scoreError) throw scoreError
        //refresh this page
        router.refresh()
      }

      setIsCorrect(correct)
      setIsSubmitted(true)


    } catch (error) {
      console.error('Error saving response:', error)
      setAttemptError('Failed to save your response. Please try again.')
    }
  }

  const handleOptionClick = (key: string) => {
    if (isSubmitted) return
    if (question.type === 'MULTIPLE_CHOICE') {
      // Toggle selection for multiple choice
      setSelectedAnswer((prev: string[]) => 
        prev.includes(key) 
          ? prev.filter((k: string) => k !== key)
          : [...prev, key]
      )
    } else {
      // Single choice behavior
      setSelectedAnswer([key])
    }
  }

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('test_prep_user_favorites')
          .delete()
          .eq('question_id', question.id)

        if (error) throw error
        setIsFavorited(false)
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('test_prep_user_favorites')
          .insert({
            question_id: question.id
          })

        if (error) throw error
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <Card className='prose dark:prose-invert'>
      <CardHeader>
        <div className="flex justify-between items-start">
          {question.question}
          <Button
            variant="ghost"
          
            onClick={handleFavoriteToggle}
            className={cn(
              "ml-2",
              isFavorited && "text-yellow-500 hover:text-yellow-600",
              !isFavorited && "text-gray-400 hover:text-gray-500"
            )}
          >
            <Bookmark className={cn(
              "h-5 w-5",
              isFavorited && "fill-current"
            )} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            {Object.entries(question.options).map(([key, value]) => {
              const isSelected = selectedAnswer.includes(key)
              const wasSelectedPreviously = previousResponse?.selected_answers.includes(key.toUpperCase())
              const isCorrectAnswer = question.correctanswer.includes(key.toUpperCase())
              
              return (
                <Button
                  key={key}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal text-base h-auto whitespace-normal px-4 py-3",
                    "text-foreground disabled:opacity-100",
                    isSubmitted && isCorrectAnswer && "bg-green-50 text-green-700 dark:text-green-400 dark:bg-green-900/20 ring-1 ring-inset ring-green-600/20 dark:ring-green-600/30",
                    isSubmitted && (isSelected || wasSelectedPreviously) && !isCorrectAnswer && "bg-red-50 text-red-700 dark:text-red-400 dark:bg-red-900/20 ring-1 ring-inset ring-red-600/10 dark:ring-red-600/30",
                    !isSubmitted && isSelected && "bg-blue-50 text-blue-700 dark:text-blue-400 dark:bg-blue-900/20 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-600/30"
                  )}
                  onClick={() => handleOptionClick(key)}
                  disabled={isSubmitted}
                >
                  <div className="flex gap-2">
                    <span className="">{key.toUpperCase()}.</span>
                    <span className=''>{String(value)}</span>
                  </div>
                </Button>
              )
            })}
          </div>

          <div className="flex justify-end space-x-2 mt-12">
            <Button 
              variant="outline"
              type="submit" 
              disabled={!selectedAnswer || isSubmitted}
              className="min-w-[100px]"
            >
              Submit
            </Button>
          </div>
        </form>
      </CardContent>

      {isSubmitted && (
        <CardFooter className="flex flex-col items-start space-y-4">
          <div className="space-y-6 w-full">
            <div className={cn(
              "flex items-center gap-2 p-4 rounded-lg ring-1 ring-inset",
              isCorrect 
                ? "bg-green-50 text-green-700 dark:text-green-400 dark:bg-green-900/20 ring-green-600/20 dark:ring-green-600/30"
                : "bg-red-50 text-red-700 dark:text-red-400 dark:bg-red-900/20 ring-red-600/10 dark:ring-red-600/30"
            )}>
              <Check className="h-5 w-5" />
              <span className="font-medium">
                {isCorrect ? "Correct! Well done!" : `Incorrect. The correct answer is ${question.correctanswer}.`}
              </span>
            </div>

            <QuestionMetadata
              section={question.section}
              subsection={question.subsection}
              tags={question.tags}
            />

            <div className="mt-4">
              <div className="prose dark:prose-invert">
                <ReactMarkdown>{question.markdown_explanation}</ReactMarkdown>
              </div>
            </div>
          </div>
        </CardFooter>
      )}

      {attemptError && (
        <CardFooter>
          <Alert variant="red">
            <AlertDescription>{attemptError}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  )
}