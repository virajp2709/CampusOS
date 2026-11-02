import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ROUTES } from './config/routes';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ProfileSetupPage } from './pages/auth/ProfileSetupPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TimetablePage } from './pages/timetable/TimetablePage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { SubjectsPage } from './pages/subjects/SubjectsPage';
import { PracticalsPage } from './pages/practicals/PracticalsPage';
import { AssignmentsPage } from './pages/assignments/AssignmentsPage';
import { NotesPage } from './pages/notes/NotesPage';
import { AITutorPage } from './pages/ai-tutor/AITutorPage';
import { ExamsPage } from './pages/exams/ExamsPage';
import { StudyPlannerPage } from './pages/study-planner/StudyPlannerPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-campus-bg-deep text-campus-text-primary gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-campus-primary to-campus-accent flex items-center justify-center text-white font-extrabold text-2xl animate-pulse">
          C
        </div>
        <p className="text-xs text-campus-text-muted">Loading CampusOS...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.PROFILE_SETUP} element={<ProfileSetupPage />} />

      {/* Authenticated Application Shell */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.TIMETABLE} element={<TimetablePage />} />
        <Route path={ROUTES.ATTENDANCE} element={<AttendancePage />} />
        <Route path={ROUTES.SUBJECTS} element={<SubjectsPage />} />
        <Route path={ROUTES.PRACTICALS} element={<PracticalsPage />} />
        <Route path={ROUTES.ASSIGNMENTS} element={<AssignmentsPage />} />
        <Route path={ROUTES.NOTES} element={<NotesPage />} />
        <Route path={ROUTES.AI_TUTOR} element={<AITutorPage />} />
        <Route path={ROUTES.EXAMS} element={<ExamsPage />} />
        <Route path={ROUTES.STUDY_PLANNER} element={<StudyPlannerPage />} />
        <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}
