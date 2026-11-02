import type { AttendanceRecord, Assignment, Note, Exam, StudySession, Notification } from '@/types';

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  // Mathematics-I (Total 28 conducted, 23 attended = 82.1%)
  ...Array.from({ length: 23 }, (_, i) => ({
    id: `att-m1-p-${i}`,
    subjectId: 'subj-maths-1',
    date: `2026-0${8 + Math.floor(i / 10)}-${String((i % 25) + 1).padStart(2, '0')}`,
    status: 'present' as const,
    type: 'lecture' as const,
    createdAt: new Date(),
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `att-m1-a-${i}`,
    subjectId: 'subj-maths-1',
    date: `2026-09-${String(i * 4 + 2).padStart(2, '0')}`,
    status: 'absent' as const,
    type: 'lecture' as const,
    note: 'Medical appointment',
    createdAt: new Date(),
  })),

  // Basic Electronics Engineering (Total 22 conducted, 19 attended = 86.4%)
  ...Array.from({ length: 19 }, (_, i) => ({
    id: `att-bee-p-${i}`,
    subjectId: 'subj-bee',
    date: `2026-0${8 + Math.floor(i / 10)}-${String((i % 25) + 2).padStart(2, '0')}`,
    status: 'present' as const,
    type: 'lecture' as const,
    createdAt: new Date(),
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `att-bee-a-${i}`,
    subjectId: 'subj-bee',
    date: `2026-09-${String(i * 5 + 3).padStart(2, '0')}`,
    status: 'absent' as const,
    type: 'lecture' as const,
    createdAt: new Date(),
  })),

  // Engineering Chemistry (Total 24 conducted, 17 attended = 70.8% - BELOW 75% TARGET!)
  ...Array.from({ length: 17 }, (_, i) => ({
    id: `att-ch-p-${i}`,
    subjectId: 'subj-chem',
    date: `2026-0${8 + Math.floor(i / 10)}-${String((i % 25) + 3).padStart(2, '0')}`,
    status: 'present' as const,
    type: 'lecture' as const,
    createdAt: new Date(),
  })),
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `att-ch-a-${i}`,
    subjectId: 'subj-chem',
    date: `2026-09-${String(i * 3 + 4).padStart(2, '0')}`,
    status: 'absent' as const,
    type: 'lecture' as const,
    note: 'College transit delay',
    createdAt: new Date(),
  })),

  // Fundamentals of Programming Languages (Total 25 conducted, 24 attended = 96.0%)
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `att-fpl-p-${i}`,
    subjectId: 'subj-fpl',
    date: `2026-0${8 + Math.floor(i / 10)}-${String((i % 25) + 4).padStart(2, '0')}`,
    status: 'present' as const,
    type: 'lecture' as const,
    createdAt: new Date(),
  })),
  {
    id: 'att-fpl-a-0',
    subjectId: 'subj-fpl',
    date: '2026-09-12',
    status: 'absent' as const,
    type: 'lecture' as const,
    createdAt: new Date(),
  },

  // Introduction to Python Programming (Total 18 conducted, 16 attended = 88.9%)
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `att-py-p-${i}`,
    subjectId: 'subj-python',
    date: `2026-0${8 + Math.floor(i / 10)}-${String((i % 25) + 5).padStart(2, '0')}`,
    status: 'present' as const,
    type: 'practical' as const,
    createdAt: new Date(),
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `att-py-a-${i}`,
    subjectId: 'subj-python',
    date: `2026-09-${String(i * 7 + 6).padStart(2, '0')}`,
    status: 'absent' as const,
    type: 'practical' as const,
    createdAt: new Date(),
  })),

  // Engineering Graphics (Total 20 conducted, 18 attended = 90.0%)
  ...Array.from({ length: 18 }, (_, i) => ({
    id: `att-eg-p-${i}`,
    subjectId: 'subj-eg',
    date: `2026-0${8 + Math.floor(i / 10)}-${String((i % 25) + 6).padStart(2, '0')}`,
    status: 'present' as const,
    type: 'lecture' as const,
    createdAt: new Date(),
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `att-eg-a-${i}`,
    subjectId: 'subj-eg',
    date: `2026-09-${String(i * 8 + 7).padStart(2, '0')}`,
    status: 'absent' as const,
    type: 'lecture' as const,
    createdAt: new Date(),
  })),
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-m1-1',
    subjectId: 'subj-maths-1',
    title: 'Unit 1 Assignment: Taylor Series & Indeterminate Forms',
    description: 'Solve problem set 1.2 on Maclaurin expansion and 5 numericals of L’Hospital rule 0/0 and ∞/∞ forms.',
    dueDate: '2026-11-08',
    priority: 'high',
    status: 'in_progress',
    attachmentURLs: [],
    submissionLink: 'https://classroom.google.com/c/vpkbiet-m1',
    completedAt: null,
    reminder: '2026-11-07T18:00:00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'asg-py-1',
    subjectId: 'subj-python',
    title: 'Python Mini Project: Student CGPA & Marks Tracker',
    description: 'Build a modular CLI Python script utilizing lists, dictionaries, file handling and exception handling for academic records.',
    dueDate: '2026-11-15',
    priority: 'urgent',
    status: 'in_progress',
    attachmentURLs: [],
    submissionLink: 'https://github.com/viraj/student-cgpa-tracker',
    completedAt: null,
    reminder: '2026-11-12T09:00:00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'asg-eg-1',
    subjectId: 'subj-eg',
    title: 'AutoCAD Drafting: Machine Bracket Sectional View',
    description: 'Create A4 size AutoCAD 2D blueprint of the mechanical bracket with full sectional front view and top view.',
    dueDate: '2026-11-10',
    priority: 'medium',
    status: 'not_started',
    attachmentURLs: [],
    submissionLink: '',
    completedAt: null,
    reminder: '2026-11-09T17:00:00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'asg-chem-1',
    subjectId: 'subj-chem',
    title: 'Term Paper: Green Fuels and Hydrogen Storage Challenges',
    description: 'Submit 4-page handwritten or typed report on biodiesel transesterification and physical storage barriers of liquid H2.',
    dueDate: '2026-11-20',
    priority: 'low',
    status: 'not_started',
    attachmentURLs: [],
    submissionLink: '',
    completedAt: null,
    reminder: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'asg-fpl-1',
    subjectId: 'subj-fpl',
    title: 'Matrix Multiplication & String Reversal Algorithms',
    description: 'Implementation in ANSI C without string.h header. Document algorithm complexity.',
    dueDate: '2026-10-28',
    priority: 'high',
    status: 'submitted',
    attachmentURLs: [],
    submissionLink: 'https://classroom.google.com/c/vpkbiet-fpl',
    completedAt: '2026-10-27',
    reminder: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-m1-fourier',
    subjectId: 'subj-maths-1',
    title: 'Fourier Series Dirichlet Conditions & Formula Sheet',
    content: `### Fourier Series Formulas
A periodic function $f(x)$ of period $2\\pi$ over $(-\\pi, \\pi)$:
$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty (a_n \\cos nx + b_n \\sin nx)$$

Where:
- $a_0 = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x) dx$
- $a_n = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x) \\cos nx dx$
- $b_n = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x) \\sin nx dx$

#### Dirichlet's Conditions:
1. $f(x)$ is periodic, single-valued and bounded.
2. $f(x)$ has finite number of discontinuities in any one period.
3. $f(x)$ has finite number of maxima and minima.`,
    type: 'text',
    tags: ['Calculus', 'Formulas', 'Unit 2', 'ExamPrep'],
    folder: 'Mathematics',
    isPinned: true,
    isFavorite: true,
    fileURL: null,
    fileName: null,
    fileSize: null,
    aiSummary: 'Complete formulas for Euler coefficients and Dirichlet conditions with boundary proofs.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'note-bee-rectifiers',
    subjectId: 'subj-bee',
    title: 'Bridge Rectifier Efficiency & Ripple Factor Proof',
    content: `### Rectifier Comparison Chart
1. **Half Wave Rectifier**:
   - Efficiency $\\eta = 40.6\\%$
   - Ripple factor $\\gamma = 1.21$
   - PIV = $V_m$

2. **Full Wave Center Tapped**:
   - Efficiency $\\eta = 81.2\\%$
   - Ripple factor $\\gamma = 0.482$
   - PIV = $2V_m$

3. **Bridge Rectifier**:
   - Efficiency $\\eta = 81.2\\%$
   - Ripple factor $\\gamma = 0.482$
   - PIV = $V_m$ (Key advantage over center tapped!)`,
    type: 'text',
    tags: ['Electronics', 'Diodes', 'Unit 1'],
    folder: 'Basic Electronics',
    isPinned: true,
    isFavorite: false,
    fileURL: null,
    fileName: null,
    fileSize: null,
    aiSummary: 'Summary of rectification metrics and PIV ratings for Unit 1 exam review.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'note-py-data-structs',
    subjectId: 'subj-python',
    title: 'Python Data Structures Time Complexity Cheat Sheet',
    content: `### Complexity Overview
- **List**:
  - Append: $O(1)$
  - Pop from end: $O(1)$
  - Insert at 0: $O(N)$
  - Search: $O(N)$

- **Dict**:
  - Key lookup: $O(1)$ average
  - Insertion: $O(1)$ average

- **Set**:
  - Membership check \`x in s\`: $O(1)$ average`,
    type: 'text',
    tags: ['Python', 'DataStructures', 'InterviewPrep'],
    folder: 'Python',
    isPinned: false,
    isFavorite: true,
    fileURL: null,
    fileName: null,
    fileSize: null,
    aiSummary: 'Big-O reference for lists, tuples, sets, and dictionaries in Python 3.12.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-ise-m1',
    subjectId: 'subj-maths-1',
    title: 'In-Semester Examination (ISE-I)',
    type: 'ISE',
    date: '2026-11-24',
    startTime: '10:00',
    duration: 60,
    syllabus: ['Unit 1: Differential Calculus', 'Unit 2: Fourier Series', 'Unit 3: Partial Differentiation'],
    score: null,
    maxScore: 30,
    notes: 'Pen-and-paper examination in Drawing Hall 1.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'exam-ise-bee',
    subjectId: 'subj-bee',
    title: 'In-Semester Examination (ISE-I)',
    type: 'ISE',
    date: '2026-11-26',
    startTime: '10:00',
    duration: 60,
    syllabus: ['Unit 1: Introduction to Electronics & Diodes', 'Unit 2: Transistors & Op-Amp'],
    score: null,
    maxScore: 30,
    notes: 'Numericals on rectifiers and load-line analysis will be asked.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'exam-mock-py',
    subjectId: 'subj-python',
    title: 'Continuous Activity Assessment (CAA) Quiz',
    type: 'quiz',
    date: '2026-11-18',
    startTime: '14:30',
    duration: 30,
    syllabus: ['Python Data Types', 'Loops & Conditionals', 'List Comprehensions'],
    score: null,
    maxScore: 10,
    notes: 'Moodle online quiz in Lab 2.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const INITIAL_STUDY_SESSIONS: StudySession[] = [
  {
    id: 'sess-1',
    subjectId: 'subj-maths-1',
    startTime: new Date(Date.now() - 86400000 * 2),
    endTime: new Date(Date.now() - 86400000 * 2 + 50 * 60000),
    plannedDurationMin: 50,
    actualDurationMin: 50,
    type: 'pomodoro',
    status: 'completed',
    createdAt: new Date(),
  },
  {
    id: 'sess-2',
    subjectId: 'subj-python',
    startTime: new Date(Date.now() - 86400000),
    endTime: new Date(Date.now() - 86400000 + 45 * 60000),
    plannedDurationMin: 45,
    actualDurationMin: 45,
    type: 'pomodoro',
    status: 'completed',
    createdAt: new Date(),
  },
  {
    id: 'sess-3',
    subjectId: 'subj-bee',
    startTime: new Date(Date.now() - 3600000 * 3),
    endTime: new Date(Date.now() - 3600000 * 3 + 60 * 60000),
    plannedDurationMin: 60,
    actualDurationMin: 58,
    type: 'freeform',
    status: 'completed',
    createdAt: new Date(),
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'attendance',
    title: 'Low Attendance Warning: Engineering Chemistry',
    message: 'Your current attendance in Engineering Chemistry is 70.8%, which is below the 75% college target. You need to attend the next 4 consecutive lectures to reach 75%.',
    relatedEntity: 'subject',
    relatedId: 'subj-chem',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'notif-2',
    type: 'assignment',
    title: 'Assignment Due Soon: Taylor Series Numerical Problem Set',
    message: 'Engineering Mathematics-I assignment is due in 6 days (Nov 8, 2026).',
    relatedEntity: 'assignment',
    relatedId: 'asg-m1-1',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
  {
    id: 'notif-3',
    type: 'exam',
    title: 'In-Semester Examination Schedule Published',
    message: 'ISE-I begins on Nov 24, 2026. Mathematics-I is scheduled for 10:00 AM.',
    relatedEntity: 'exam',
    relatedId: 'exam-ise-m1',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];
