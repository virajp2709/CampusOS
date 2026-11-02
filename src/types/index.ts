export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  college: string;
  course: string;
  branch: string;
  division: string;
  academicYear: string;
  semester: number;
  rollNumber: string;
  practicalBatch: string;
  attendanceTarget: number;
  theme: 'dark' | 'light';
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  type: 'theory' | 'practical' | 'tutorial';
  credits: number;
  semester: number;
  faculty: string;
  department: string;
  theoryHoursPerWeek: number;
  practicalHoursPerWeek: number;
  tutorialHoursPerWeek: number;
  syllabusUnits: SyllabusUnit[];
  textbooks: string[];
  referenceBooks: string[];
  examScheme: ExamScheme;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyllabusUnit {
  unitNo: number;
  title: string;
  hours: number;
  topics: string[];
  completed: boolean;
}

export interface ExamScheme {
  caa: number;
  ise: number;
  ese: number;
  tw: number;
  pr: number;
  or: number;
  total: number;
}

export interface TimetableEntry {
  id: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  type: 'lecture' | 'practical' | 'tutorial' | 'break' | 'activity';
  faculty: string;
  room: string;
  batch?: string;
}

export interface Timetable {
  id: string;
  name: string;
  semester: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  version: number;
  isActive: boolean;
  schedule: Record<string, TimetableEntry[]>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'cancelled';
  type: 'lecture' | 'practical' | 'tutorial';
  note?: string;
  createdAt: Date;
}

export interface AttendanceSummary {
  subjectId: string;
  subjectName: string;
  totalClasses: number;
  attended: number;
  missed: number;
  cancelled: number;
  percentage: number;
  target: number;
  classesNeededForTarget: number;
  maxFutureAbsences: number;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'not_started' | 'in_progress' | 'completed' | 'submitted';
  attachmentURLs: string[];
  submissionLink: string;
  completedAt: string | null;
  reminder: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Practical {
  id: string;
  subjectId: string;
  experimentNo: number;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'submitted';
  submittedAt: string | null;
  marks: number | null;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  type: 'text' | 'pdf' | 'image';
  tags: string[];
  folder: string;
  isPinned: boolean;
  isFavorite: boolean;
  fileURL: string | null;
  fileName: string | null;
  fileSize: number | null;
  aiSummary: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  type: 'ISE' | 'ESE' | 'quiz' | 'mock';
  date: string;
  startTime: string;
  duration: number;
  syllabus: string[];
  score: number | null;
  maxScore: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  subjectId: string;
  startTime: Date;
  endTime: Date | null;
  plannedDurationMin: number;
  actualDurationMin: number;
  type: 'pomodoro' | 'freeform';
  status: 'active' | 'completed' | 'interrupted';
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'assignment' | 'exam' | 'attendance' | 'study' | 'general';
  title: string;
  message: string;
  relatedEntity?: string;
  relatedId?: string;
  isRead: boolean;
  scheduledFor?: Date;
  createdAt: Date;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}
