import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

//fetch sections
async function fetchUserResponses() {
  const supabase = await createClient()

  const { data: userResponses, error } = await supabase
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
    .returns<Array<{
      id: string;
      is_correct: boolean;
      question: {
        id: string;
        section: { name: string } | null;
        subsection: { id: string; name: string } | null;
      } | null;
    }>>()

  if (error) {
    console.error('Error fetching questions:', error)
    return null
  }

  return userResponses
}

async function fetchAllSectionsAndSubsections() {
  const supabase = await createClient()

  const { data: sections, error } = await supabase
    .from('test_prep_sections')
    .select(`
      *,
      subsection:test_prep_subsections(
        id,
        name
      )
    `)

  if (error) {
    console.error('Error fetching sections:', error)
    return null
  }

  return sections 
}

async function fetchQuestionCounts() {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_question_counts_by_subsection');

  if (error) {
      console.error('Error fetching question counts:', error);
  }

  return data
}

// Add interfaces for the types
interface Section {
  id: string;
  name: string;
  subsection: Subsection[];
}

interface Subsection {
  id: string;
  name: string;
}

interface QuestionCount {
  subsection_id: number;
  subsection_name: string;
  question_count: number;
}

// Add a helper function to calculate accuracy
function calculateSubsectionAccuracy(
  userResponses: Awaited<ReturnType<typeof fetchUserResponses>>,
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

// Add a helper function to count unique questions answered
function countUniqueQuestionsAnswered(
  userResponses: Awaited<ReturnType<typeof fetchUserResponses>>,
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

// Add helper functions for section totals
function calculateSectionTotals(
  section: Section,
  questionCounts: QuestionCount[],
  userResponses: Awaited<ReturnType<typeof fetchUserResponses>>
) {
  if (!section.subsection) return { totalQuestions: 0, totalAttempted: 0, sectionAccuracy: 0 };

  // Total questions in section
  const totalQuestions = section.subsection.reduce((sum: number, subsection: Subsection) => {
    const count = questionCounts?.find(
      (qc: QuestionCount) => qc.subsection_name === subsection.name
    )?.question_count || 0;
    return sum + count;
  }, 0);

  // Total attempted questions in section
  const totalAttempted = section.subsection.reduce((sum: number, subsection: Subsection) => {
    return sum + countUniqueQuestionsAnswered(userResponses, String(subsection.id));
  }, 0);

  // Section-wide accuracy
  if (!userResponses) return { totalQuestions, totalAttempted, sectionAccuracy: 0 };
  
  const sectionResponses = userResponses.filter(
    response => section.subsection.some(
      (sub: Subsection) => String(response.question?.subsection?.id) === String(sub.id)
    )
  );
  
  const sectionAccuracy = sectionResponses.length > 0
    ? Math.round((sectionResponses.filter(response => response.is_correct).length / sectionResponses.length) * 100)
    : 0;

  return { totalQuestions, totalAttempted, sectionAccuracy };
}

// Add this helper function near your other helpers
function calculateOverallStats(
  sections: Section[] | null,
  questionCounts: QuestionCount[],
  userResponses: Awaited<ReturnType<typeof fetchUserResponses>>
) {
  if (!sections) return { totalQuestions: 0, totalAttempted: 0, overallAccuracy: 0 };

  const stats = sections.map(section => calculateSectionTotals(section, questionCounts, userResponses));
  
  const totalQuestions = stats.reduce((sum, stat) => sum + stat.totalQuestions, 0);
  const totalAttempted = stats.reduce((sum, stat) => sum + stat.totalAttempted, 0);
  
  // Calculate overall accuracy from all responses
  const overallAccuracy = userResponses && userResponses.length > 0
    ? Math.round((userResponses.filter(r => r.is_correct).length / userResponses.length) * 100)
    : 0;

  return { totalQuestions, totalAttempted, overallAccuracy };
}

export default async function DashboardPage() {
  const userResponses = await fetchUserResponses()
  const sections = await fetchAllSectionsAndSubsections()
  const questionCounts = await fetchQuestionCounts()

  // Add this right after the fetch calls
  const { totalQuestions, totalAttempted, overallAccuracy } = calculateOverallStats(
    sections,
    questionCounts,
    userResponses
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Add Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm text-muted-foreground">Total Questions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="text-2xl font-bold">{totalQuestions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm text-muted-foreground">Questions Attempted</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="text-2xl font-bold">{totalAttempted}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalAttempted / totalQuestions) * 100)}% Complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm text-muted-foreground">Overall Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="text-2xl font-bold">{overallAccuracy}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm text-muted-foreground">Active Sections</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="text-2xl font-bold">{sections?.length ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {sections
          ?.sort((a, b) => a.name.localeCompare(b.name))
          ?.map((section) => {
            const { totalQuestions, totalAttempted, sectionAccuracy } = calculateSectionTotals(
              section,
              questionCounts,
              userResponses
            );

            // Sort subsections alphabetically
            const sortedSubsections = [...(section.subsection || [])].sort((a, b) => 
              a.name.localeCompare(b.name)
            );

            return (
              <Card key={section.id} className="p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-full text-foreground text-lg font-bold">{section.name}</TableHead>
                        <TableHead className="text-right w-fit">Questions</TableHead>
                        <TableHead className="text-right w-fit">Attempted</TableHead>
                        <TableHead className="text-right w-fit">Accuracy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedSubsections.map((subsection: Subsection) => {
                        const questionCount = questionCounts?.find(
                          (qc: QuestionCount) => qc.subsection_name === subsection.name
                        )?.question_count || 0;
                        
                        const accuracy = calculateSubsectionAccuracy(userResponses, String(subsection.id));
                        const answeredCount = countUniqueQuestionsAnswered(userResponses, String(subsection.id));

                        return (
                          <TableRow key={subsection.id}>
                            <TableCell className="w-full">{subsection.name}</TableCell>
                            <TableCell className="text-right w-fit">
                              <Link 
                                href={`/workspace/questions?section=${encodeURIComponent(section.name)}&subsection=${encodeURIComponent(subsection.name)}`}
                                className="hover:underline cursor-pointer"
                              >
                                <Badge 
                                  className="cursor-pointer hover:opacity-80"
                                  variant="outline"
                                >
                                  {questionCount}
                                </Badge>
                              </Link>
                            </TableCell>
                            <TableCell className="text-right w-fit">
                              {answeredCount > 0 ? (
                                <Link href={`/workspace/history?section=${encodeURIComponent(section.name)}&subsection=${encodeURIComponent(subsection.name)}`}>
                                  <Badge 
                                    className="cursor-pointer hover:opacity-80"
                                    variant="outline"
                                  >
                                    {answeredCount}
                                  </Badge>
                                </Link>
                              ) : null}
                            </TableCell>
                            <TableCell className="text-right w-fit">
                              {answeredCount > 0 ? (
                                <Link href={`/workspace/history?section=${encodeURIComponent(section.name)}&subsection=${encodeURIComponent(subsection.name)}`}>
                                  <Badge 
                                    className="cursor-pointer hover:opacity-80"
                                    variant={
                                      accuracy >= 85 ? "green" : 
                                      accuracy >= 70 ? "yellow" : 
                                      "red"
                                    }
                                  >
                                    {accuracy}%
                                  </Badge>
                                </Link>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="font-medium">
                        <TableCell className="w-full">Section Total</TableCell>
                        <TableCell className="text-right w-fit">
                          <Link 
                            href={`/workspace/questions?section=${encodeURIComponent(section.name)}`}
                            className="hover:underline cursor-pointer"
                          ><Badge 
                          className="cursor-pointer hover:opacity-80"
                          variant="outline"
                        >
                            {totalQuestions}
                            </Badge>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right w-fit">
                          {totalAttempted > 0 ? (
                            <Link href={`/workspace/history?section=${encodeURIComponent(section.name)}`}>
                              <Badge 
                                className="cursor-pointer hover:opacity-80"
                                variant="outline"
                              >
                                {totalAttempted}
                              </Badge>
                            </Link>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-right w-fit">
                          {totalAttempted > 0 ? (
                            <Link href={`/workspace/history?section=${encodeURIComponent(section.name)}`}>
                              <Badge 
                                className="cursor-pointer hover:opacity-80"
                                variant={
                                  sectionAccuracy >= 85 ? "green" : 
                                  sectionAccuracy >= 70 ? "yellow" : 
                                  "red"
                                }
                              >
                                {sectionAccuracy}%
                              </Badge>
                            </Link>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
              </Card>
            );
          })}
      </div>
    </div>
  )
}