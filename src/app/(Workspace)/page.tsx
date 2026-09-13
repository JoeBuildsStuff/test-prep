import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Target } from 'lucide-react'

import { createClient } from '@/utils/supabase/server'
import { getCertSlugFromCode } from '@/lib/certifications'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type UserCertification = {
  certification_id: string
  provider: string
  name: string
  code: string
  description: string
  is_active: boolean
  is_user_active: boolean
  question_count: number
  passing_score: number | null
  exam_duration_minutes: number | null
  exam_fee_usd: number | string | null
}

function formatDuration(minutes: number | null) {
  if (!minutes) return null
  if (minutes % 60 === 0) {
    const hours = minutes / 60
    return hours === 1 ? '1 hr' : `${hours} hr`
  }
  return `${minutes} min`
}

export default async function CertificationsHubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let certifications: UserCertification[] = []

  if (user) {
    const { data, error } = await supabase
      .schema('test_prep')
      .rpc('get_user_certifications', { user_id_param: user.id })

    if (!error && data) {
      certifications = data
    }
  }

  const catalog = certifications.flatMap((certification) => {
    const slug = getCertSlugFromCode(certification.code)
    return slug ? [{ ...certification, slug }] : []
  }).sort((a, b) => Number(b.is_user_active) - Number(a.is_user_active) || a.name.localeCompare(b.name))

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
        <p className="max-w-2xl text-muted-foreground">
          Choose an exam to open its workspace. You can switch certifications anytime from the sidebar.
        </p>
      </div>

      {catalog.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No certifications available</CardTitle>
            <CardDescription>
              There are no exams to practice yet. Check back once a certification has been added.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {catalog.map((certification) => {
            const duration = formatDuration(certification.exam_duration_minutes)

            return (
              <Link
                key={certification.certification_id}
                href={`/${certification.slug}/dashboard`}
                className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="flex h-full flex-col transition-colors duration-150 ease-out group-hover:bg-accent/50">
                  <CardHeader className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">{certification.provider}</Badge>
                      {certification.is_user_active ? (
                        <Badge variant="green">Active</Badge>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <CardTitle className="text-xl leading-snug">
                        {certification.name}
                      </CardTitle>
                      <CardDescription>{certification.code}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4">
                    {certification.description ? (
                      <p className="text-sm text-muted-foreground">
                        {certification.description}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="size-4" />
                        {certification.question_count} questions
                      </span>
                      {duration ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-4" />
                          {duration}
                        </span>
                      ) : null}
                      {certification.passing_score ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Target className="size-4" />
                          Pass {certification.passing_score}
                        </span>
                      ) : null}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                      Open dashboard
                      <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
