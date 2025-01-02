import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type Question = {
  title: string
  topic: string
}

type UserResponse = {
  id: string
  is_correct: boolean
  attempt_number: number
  questions: Question
  created_at: string
}

type TopicStat = {
  is_correct: boolean
  questions: {
    topic: string
  }
}

async function getStudyStats() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get total attempts and correct answers
  const { data: stats } = await supabase
    .from('test_prep_user_responses')
    .select('is_correct')
    .eq('user_id', user.id)

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from('user_responses')
    .select<string, UserResponse>(`
      *,
      questions (
        title,
        topic
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get performance by topic
  const { data: topicStats } = await supabase
    .from('user_responses')
    .select<string, TopicStat>(`
      is_correct,
      questions (
        topic
      )
    `)
    .eq('user_id', user.id)

  return { stats, recentActivity, topicStats }
}

export default async function DashboardPage() {
  const data = await getStudyStats()
  if (!data) return <div>Please log in to view your dashboard</div>

  const { stats, recentActivity, topicStats } = data

  // Calculate overall statistics
  const totalAttempts = stats?.length || 0
  const correctAttempts = stats?.filter(s => s.is_correct).length || 0
  const accuracyRate = totalAttempts ? (correctAttempts / totalAttempts) * 100 : 0

  // Calculate topic performance
  const topicPerformance = topicStats?.reduce((acc, curr) => {
    const topic = curr.questions.topic
    if (!acc[topic]) {
      acc[topic] = { total: 0, correct: 0 }
    }
    acc[topic].total++
    if (curr.is_correct) acc[topic].correct++
    return acc
  }, {} as Record<string, { total: number; correct: number }>)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        {/* Study Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Overall Accuracy</p>
              <div className="mt-2 space-y-2">
                <Progress value={accuracyRate} />
                <p className="text-sm text-muted-foreground">
                  {accuracyRate.toFixed(1)}% ({correctAttempts}/{totalAttempts} correct)
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Topic Performance</p>
              <div className="space-y-2">
                {Object.entries(topicPerformance || {}).map(([topic, data]) => (
                  <div key={topic} className="space-y-1">
                    <p className="text-sm">{topic}</p>
                    <Progress 
                      value={(data.correct / data.total) * 100} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`p-3 rounded-lg ${
                    activity.is_correct 
                      ? 'bg-green-100 dark:bg-green-900/20' 
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}
                >
                  <p className="font-medium">{activity.questions.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.questions.topic} • Attempt #{activity.attempt_number}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">{totalAttempts}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="text-2xl font-bold">{correctAttempts}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Topics Covered</p>
                  <p className="text-2xl font-bold">
                    {Object.keys(topicPerformance || {}).length}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{accuracyRate.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}