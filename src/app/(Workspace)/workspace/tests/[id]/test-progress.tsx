import { Progress } from "@/components/ui/progress"

interface TestProgressProps {
  totalQuestions: number
  attemptedQuestions: number
  currentScore: number | null
}

export function TestProgress({ totalQuestions, attemptedQuestions, currentScore }: TestProgressProps) {
  const progressPercentage = (attemptedQuestions / totalQuestions) * 100

  return (
    <div className="bg-background/30 backdrop-blur-sm space-y-2 border-b pb-4">
      <div className="flex justify-between items-center">
        <div>Progress: {attemptedQuestions}/{totalQuestions} questions</div>
        {currentScore !== null && (
          <div>Score: {currentScore.toFixed(1)}%</div>
        )}
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  )
}