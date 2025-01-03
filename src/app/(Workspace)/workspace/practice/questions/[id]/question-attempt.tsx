'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { createClient } from '@/utils/supabase/client'

interface QuestionAttemptProps {
  question: {
    id: string
    question: string
    options: Record<string, string>
    correctanswer: string
    explanation: string
    type: string
    section: string | null
    subsection: string | null
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedAnswer.length === 0) return
    setAttemptError(null)

    let correct = false
    if (question.type === 'MULTIPLE_CHOICE') {
      // Normalize both arrays: convert to uppercase and sort
      const selectedAnswers = selectedAnswer.map(a => a.toUpperCase()).sort()
      // Handle both string and array formats of correctanswer
      const correctAnswers = Array.isArray(question.correctanswer)
        ? question.correctanswer.map(a => a.toUpperCase()).sort()
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
          selected_answers: selectedAnswer.map(a => a.toUpperCase()),
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
      setSelectedAnswer(prev => 
        prev.includes(key) 
          ? prev.filter(k => k !== key)
          : [...prev, key]
      )
    } else {
      // Single choice behavior
      setSelectedAnswer([key])
    }
  }

  return (
    <Card className='prose dark:prose-invert'>
      <CardHeader>
        <CardDescription className="text-base">
          {question.section && `${question.section} ${question.subsection ? `• ${question.subsection}` : ''}`}
        </CardDescription>
        <p className="">
          {question.question}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            {Object.entries(question.options).map(([key, value]) => {
              const isSelected = selectedAnswer.includes(key)
              const isCorrectAnswer = isSubmitted && question.correctanswer.includes(key.toUpperCase())
              
              return (
                <Button
                  key={key}
                  type="button"
                  variant={selectedAnswer.includes(key) ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left font-normal text-base h-auto whitespace-normal px-4 py-3 ${
                    isSubmitted && isCorrectAnswer
                      ? 'border-2 border-green-500 dark:border-green-400'
                      : ''
                  } ${
                    isSubmitted && isSelected && !isCorrectAnswer
                      ? 'border-2 border-red-500 dark:border-red-400'
                      : ''
                  }`}
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
          <Alert variant={isCorrect ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <AlertDescription>
                {isCorrect 
                  ? "Correct! Well done!" 
                  : `Incorrect. The correct answer is ${question.correctanswer}.`}
              </AlertDescription>
            </div>
          </Alert>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Explanation:</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {question.explanation}
            </p>
          </div>
        </CardFooter>
      )}

      {attemptError && (
        <CardFooter>
          <Alert variant="destructive">
            <AlertDescription>{attemptError}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  )
}