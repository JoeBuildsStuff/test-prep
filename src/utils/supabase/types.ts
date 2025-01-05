export type Tag = {
  id: number;    // PK (BIGINT, identity)
  name: string;  // UNIQUE
  type: string;
  count: number;
  created_at: Date;
  updated_at: Date;
};

export type Section = {
  id: number;    // PK (BIGINT, identity)
  name: string;  // UNIQUE
  description: string | null;
  count: number;
  created_at: Date;
  updated_at: Date;
};

export type Subsection = {
  id: number;    // PK (BIGINT, identity)
  section_id: number;    // FK -> sections.id
  name: string;    // UNIQUE combined with section_id
  description: string | null;
  count: number;
  created_at: Date;
  updated_at: Date;
};

export type TestPrepQuestion = {
  id: string;    // PK
  type: string;
  section_id: number | null;    // FK -> sections.id
  subsection_id: number | null;    // FK -> subsections.id
  question: string;
  options: {    // JSONB, GIN indexed
    [key in string]: string;
  };
  correctanswer: string;
  explanation: string;
  markdown_explanation: string;
  created_at: Date;
  updated_at: Date;
};

export type QuestionTag = {
  question_id: string;    // PK, FK -> test_prep_questions.id
  tag_id: number;    // PK, FK -> tags.id
  created_at: Date;
};

export type TestPrepTestQuestion = {
  id: string;    // PK (UUID)
  test_id: string;    // FK -> TestPrepTest.id, CASCADE delete
  question_id: string;    // FK -> TestPrepQuestion.id, CASCADE delete
  order: number;    // Unique combined with test_id
  created_at: Date | null;
};

export type TestPrepTest = {
  id: string;    // PK (UUID)
  user_id: string;    // FK -> auth.users.id, CASCADE delete
  created_at: Date | null;
  attempt_num: number | null;
  completed_at: Date | null;
  score: number | null;    // numeric(5,2)
};

export type TestPrepUserResponse = {
  id: string;    // PK (UUID)
  user_id: string;    // FK -> auth.users.id
  question_id: string;    // FK -> TestPrepQuestion.id
  selected_answers: string[];
  is_correct: boolean;
  attempt_number: number;    // Unique combined with user_id and question_id
  created_at: Date;
  test_id: string | null;    // FK -> TestPrepTest.id, CASCADE delete
};

// Additional utility types that might be useful
export type QuestionWithOptions = TestPrepQuestion & {
  testQuestion?: TestPrepTestQuestion;
  userResponse?: TestPrepUserResponse;
  section?: Section;
  subsection?: Subsection;
  tags?: Tag[];
};

export type TestWithQuestions = TestPrepTest & {
  questions: QuestionWithOptions[];
  userResponses: TestPrepUserResponse[];
};

// Enums for consistent type values
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  // Add other question types as needed
}

// Input types for creating/updating records
export type CreateTagInput = Omit<Tag, 'id' | 'count' | 'created_at' | 'updated_at'>;
export type CreateSectionInput = Omit<Section, 'id' | 'count' | 'created_at' | 'updated_at'>;
export type CreateSubsectionInput = Omit<Subsection, 'id' | 'count' | 'created_at' | 'updated_at'>;
export type CreateQuestionTagInput = Omit<QuestionTag, 'created_at'>;
export type CreateTestPrepQuestionInput = Omit<TestPrepQuestion, 'id' | 'created_at' | 'updated_at'>;
export type CreateTestPrepTestInput = Pick<TestPrepTest, 'user_id'>;
export type CreateTestPrepUserResponseInput = Omit<TestPrepUserResponse, 'id' | 'created_at'>;
export type UpdateTestPrepTestInput = Partial<Omit<TestPrepTest, 'id' | 'user_id' | 'created_at'>>;

// Response types for API endpoints
export type TestPrepTestResponse = {
  test: TestWithQuestions;
  totalQuestions: number;
  completedQuestions: number;
  score?: number;
};

export type TestPrepQuestionResponse = {
  question: QuestionWithOptions;
  previousAttempts?: TestPrepUserResponse[];
};

// Database error types
export type DatabaseError = {
  code: string;
  message: string;
  details?: string;
};

// Utility type for pagination
export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};