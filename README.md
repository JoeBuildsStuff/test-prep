# Test Preparation Platform

A modern web application built with Next.js for exam preparation and learning management, focusing on AWS Machine Learning certification preparation.

## Features

### Dashboard
- Overview of learning progress with key metrics
- Section-by-section breakdown of performance
- Visual indicators for accuracy rates (color-coded badges)
- Progress tracking across different domains and task statements

### Question Management
- Comprehensive question bank with filtering and sorting capabilities
- Support for multiple question types:
  - Single Choice
  - Multiple Choice
- Question metadata including:
  - Section/Domain categorization
  - Subsection/Task Statement categorization
  - Tags for better organization
  - Attempt history
  - Accuracy rates

### Response History
- Detailed history of all question attempts
- Advanced filtering capabilities:
  - By section/subsection
  - By question ID
  - By test ID
  - By correctness
- Performance analytics including:
  - Total responses
  - Unique questions attempted
  - Overall accuracy rates
  - Attempt counts

### Test Taking
- Interactive question interface
- Real-time feedback on answers
- Detailed explanations for correct answers
- Progress tracking within test sessions
- Navigation between questions
- Option to favorite questions for later review

### Analytics
- Comprehensive performance metrics
- Section-wise progress tracking
- Accuracy trends
- Attempt statistics

## Technical Stack

- **Frontend Framework**: Next.js
- **Database**: Supabase
- **Authentication**: Built-in auth system
- **UI Components**: Custom component library
- **Data Tables**: TanStack Table (React Table)
- **Styling**: Tailwind CSS

## Data Structure

### Database Schema

The application uses a relational database with the following key tables:

#### Core Content Tables
1. **Questions** (`test_prep_questions`)
   - Unique text identifier
   - Question content and type
   - Options stored as JSONB
   - Correct answer(s)
   - Detailed explanations
   - Links to sections and subsections

2. **Sections** (`test_prep_sections`)
   - Hierarchical organization of content
   - Section name and description
   - Question count tracking
   
3. **Subsections** (`test_prep_subsections`)
   - Further content categorization
   - Links to parent sections
   - Detailed descriptions
   - Question count tracking

4. **Tags** (`test_prep_tags`, `test_prep_question_tags`)
   - Flexible categorization system
   - Many-to-many relationship with questions
   - Tag types and usage tracking

#### User Interaction Tables
5. **Tests** (`test_prep_tests`)
   - Test session tracking
   - User performance metrics
   - Completion status
   - Overall scoring

6. **Test Questions** (`test_prep_test_questions`)
   - Question sequencing within tests
   - Links tests to specific questions

7. **User Responses** (`test_prep_user_responses`)
   - Detailed attempt history
   - Selected answers
   - Correctness tracking
   - Test session reference

8. **User Favorites** (`test_prep_user_favorites`)
   - Bookmark functionality
   - Personal question collections

### Key Relationships
- Questions are organized into Sections and Subsections
- Questions can have multiple Tags
- Users can create multiple Test sessions
- Each Test contains an ordered set of Questions
- User progress is tracked through Responses
- Users can maintain their Favorite questions

## Getting Started

[Add installation and setup instructions here]

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]
