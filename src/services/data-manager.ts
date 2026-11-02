import { INITIAL_SEMESTER_1_SUBJECTS } from '@/data/syllabus';
import { INITIAL_TIMETABLE_AI5 } from '@/data/timetable';
import { INITIAL_PRACTICALS } from '@/data/practicals';
import {
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTES,
  INITIAL_EXAMS,
  INITIAL_STUDY_SESSIONS,
  INITIAL_NOTIFICATIONS,
} from '@/data/mock-academic-data';
import type {
  Subject,
  Timetable,
  Practical,
  AttendanceRecord,
  Assignment,
  Note,
  Exam,
  StudySession,
  Notification,
} from '@/types';

class DataManager {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`campusos_${key}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
    }
    return defaultValue;
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`campusos_${key}`, JSON.stringify(value));
      // Dispatch custom event for cross-component reactive updates
      window.dispatchEvent(new CustomEvent('campusos_data_updated', { detail: { key } }));
    } catch (e) {
      console.warn(`Error writing ${key} to storage:`, e);
    }
  }

  // Subjects
  getSubjects(): Subject[] {
    return this.getStorage('subjects', INITIAL_SEMESTER_1_SUBJECTS);
  }

  saveSubjects(subjects: Subject[]): void {
    this.setStorage('subjects', subjects);
  }

  // Timetable
  getTimetable(): Timetable {
    return this.getStorage('timetable', INITIAL_TIMETABLE_AI5);
  }

  saveTimetable(timetable: Timetable): void {
    this.setStorage('timetable', timetable);
  }

  // Attendance
  getAttendance(): AttendanceRecord[] {
    return this.getStorage('attendance', INITIAL_ATTENDANCE_RECORDS);
  }

  saveAttendance(attendance: AttendanceRecord[]): void {
    this.setStorage('attendance', attendance);
  }

  addAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'createdAt'>): AttendanceRecord {
    const list = this.getAttendance();
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date(),
    };
    this.saveAttendance([newRecord, ...list]);
    return newRecord;
  }

  // Practicals
  getPracticals(): Practical[] {
    return this.getStorage('practicals', INITIAL_PRACTICALS);
  }

  savePracticals(practicals: Practical[]): void {
    this.setStorage('practicals', practicals);
  }

  updatePracticalStatus(id: string, status: Practical['status'], marks?: number | null): void {
    const list = this.getPracticals().map((p) =>
      p.id === id
        ? {
            ...p,
            status,
            marks: marks !== undefined ? marks : p.marks,
            submittedAt: status === 'submitted' ? new Date().toISOString().split('T')[0] : p.submittedAt,
            updatedAt: new Date(),
          }
        : p
    );
    this.savePracticals(list);
  }

  // Assignments
  getAssignments(): Assignment[] {
    return this.getStorage('assignments', INITIAL_ASSIGNMENTS);
  }

  saveAssignments(assignments: Assignment[]): void {
    this.setStorage('assignments', assignments);
  }

  addAssignment(asg: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>): Assignment {
    const list = this.getAssignments();
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saveAssignments([newAsg, ...list]);
    return newAsg;
  }

  updateAssignmentStatus(id: string, status: Assignment['status']): void {
    const list = this.getAssignments().map((a) =>
      a.id === id
        ? {
            ...a,
            status,
            completedAt: status === 'completed' || status === 'submitted' ? new Date().toISOString().split('T')[0] : null,
            updatedAt: new Date(),
          }
        : a
    );
    this.saveAssignments(list);
  }

  // Notes
  getNotes(): Note[] {
    return this.getStorage('notes', INITIAL_NOTES);
  }

  saveNotes(notes: Note[]): void {
    this.setStorage('notes', notes);
  }

  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const list = this.getNotes();
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.saveNotes([newNote, ...list]);
    return newNote;
  }

  // Exams
  getExams(): Exam[] {
    return this.getStorage('exams', INITIAL_EXAMS);
  }

  saveExams(exams: Exam[]): void {
    this.setStorage('exams', exams);
  }

  // Study Sessions
  getStudySessions(): StudySession[] {
    return this.getStorage('study_sessions', INITIAL_STUDY_SESSIONS);
  }

  saveStudySessions(sessions: StudySession[]): void {
    this.setStorage('study_sessions', sessions);
  }

  addStudySession(session: Omit<StudySession, 'id' | 'createdAt'>): StudySession {
    const list = this.getStudySessions();
    const newSession: StudySession = {
      ...session,
      id: `sess-${Date.now()}`,
      createdAt: new Date(),
    };
    this.saveStudySessions([newSession, ...list]);
    return newSession;
  }

  // Notifications
  getNotifications(): Notification[] {
    return this.getStorage('notifications', INITIAL_NOTIFICATIONS);
  }

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.setStorage('notifications', list);
  }
}

export const dataManager = new DataManager();
