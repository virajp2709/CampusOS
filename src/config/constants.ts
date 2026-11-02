export const APP_NAME = 'CampusOS';
export const APP_TAGLINE = 'Your College. Your Schedule. Your Progress.';
export const APP_VERSION = '1.0.0';

export const DEFAULT_PROFILE = {
  college: "Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering and Technology, Baramati",
  course: 'B.Tech',
  branch: 'Artificial Intelligence and Data Science',
  division: 'AI-5',
  academicYear: '2026-2027',
  semester: 1,
  rollNumber: '26107337',
  practicalBatch: 'AI-5c',
  attendanceTarget: 75,
} as const;

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '11:15', '12:15',
  '13:15', '14:15', '15:15', '16:15',
] as const;

export const ATTENDANCE_STATUSES = ['present', 'absent', 'cancelled'] as const;
export const ASSIGNMENT_STATUSES = ['not_started', 'in_progress', 'completed', 'submitted'] as const;
export const ASSIGNMENT_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export const PRACTICAL_STATUSES = ['pending', 'completed', 'submitted'] as const;
export const NOTE_TYPES = ['text', 'pdf', 'image'] as const;
export const EXAM_TYPES = ['ISE', 'ESE', 'quiz', 'mock'] as const;
export const SESSION_TYPES = ['pomodoro', 'freeform'] as const;
