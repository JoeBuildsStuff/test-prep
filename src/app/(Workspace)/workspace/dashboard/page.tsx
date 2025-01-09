import { createClient } from '@/utils/supabase/server'

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

export default async function DashboardPage() {
  const userResponses = await fetchUserResponses()
  const sections = await fetchAllSectionsAndSubsections()
  const questionCounts = await fetchQuestionCounts()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
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
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle>{section.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subsection</TableHead>
                        <TableHead className="text-right">Total Questions</TableHead>
                        <TableHead className="text-right">Attempted</TableHead>
                        <TableHead className="text-right">Accuracy</TableHead>
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
                            <TableCell>{subsection.name}</TableCell>
                            <TableCell className="text-right">{questionCount}</TableCell>
                            <TableCell className="text-right">{answeredCount}</TableCell>
                            <TableCell className="text-right">
                              {answeredCount > 0 ? (
                                <Badge variant={
                                  accuracy >= 70 ? "green" : 
                                  accuracy >= 50 ? "yellow" : 
                                  "red"
                                }>
                                  {accuracy}%
                                </Badge>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="font-medium">
                        <TableCell>Section Total</TableCell>
                        <TableCell className="text-right">{totalQuestions}</TableCell>
                        <TableCell className="text-right">{totalAttempted}</TableCell>
                        <TableCell className="text-right">
                          {totalAttempted > 0 ? (
                            <Badge variant={
                              sectionAccuracy >= 70 ? "green" : 
                              sectionAccuracy >= 50 ? "yellow" : 
                              "red"
                            }>
                              {sectionAccuracy}%
                            </Badge>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  )
}