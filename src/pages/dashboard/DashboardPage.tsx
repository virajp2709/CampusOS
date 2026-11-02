import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Play,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/routes';
import { Card, Button, ProgressBar } from '@/components/ui';
import { getGreeting, formatDate } from '@/utils/helpers';
import { dataManager } from '@/services/data-manager';
import { calculateAttendancePercentage } from '@/utils/attendance-calc';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [subjects] = useState(() => dataManager.getSubjects());
  const [timetable] = useState(() => dataManager.getTimetable());
  const [attendance] = useState(() => dataManager.getAttendance());
  const [assignments, setAssignments] = useState(() => dataManager.getAssignments());
  const [practicals] = useState(() => dataManager.getPracticals());
  const [exams] = useState(() => dataManager.getExams());
  const [studySessions] = useState(() => dataManager.getStudySessions());

  // Clock ticker for real-time countdown
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Today's Schedule
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[currentTime.getDay()];
  const todaySchedule = (timetable.schedule[todayName] || []).filter(
    (item) => !item.batch || item.batch === (user?.practicalBatch || 'AI-5c')
  );

  // Next Lecture calculation
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentMinutesOfDay = currentHours * 60 + currentMinutes;

  const nextLecture = todaySchedule.find((item) => {
    if (item.type === 'break') return false;
    const [h, m] = item.startTime.split(':').map(Number);
    return h * 60 + m > currentMinutesOfDay;
  }) || todaySchedule.find((item) => item.type !== 'break');

  // Next lecture countdown text
  let countdownText = 'No more lectures today';
  if (nextLecture) {
    const [h, m] = nextLecture.startTime.split(':').map(Number);
    const lectureMinutesOfDay = h * 60 + m;
    const diff = lectureMinutesOfDay - currentMinutesOfDay;
    if (diff > 0) {
      const hoursLeft = Math.floor(diff / 60);
      const minsLeft = diff % 60;
      countdownText = hoursLeft > 0 ? `Starts in ${hoursLeft}h ${minsLeft}m` : `Starts in ${minsLeft}m`;
    } else {
      countdownText = 'Class currently in session';
    }
  }

  // Attendance metrics
  const totalConducted = attendance.filter((a) => a.status !== 'cancelled').length;
  const totalAttended = attendance.filter((a) => a.status === 'present').length;
  const overallPercentage = calculateAttendancePercentage(totalAttended, totalConducted);

  // Subject-wise attendance calculation
  const subjectsWithLowAttendance = subjects.filter((s) => {
    const subjRecs = attendance.filter((a) => a.subjectId === s.id && a.status !== 'cancelled');
    if (subjRecs.length === 0) return false;
    const attended = subjRecs.filter((a) => a.status === 'present').length;
    const pct = calculateAttendancePercentage(attended, subjRecs.length);
    return pct < (user?.attendanceTarget || 75);
  });

  // Pending assignments
  const pendingAssignments = assignments
    .filter((a) => a.status !== 'submitted')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Today's Practical
  const todayPracticalEvent = todaySchedule.find((item) => item.type === 'practical');

  // Study streak & today's focus
  const todayStudyMinutes = studySessions
    .filter((s) => {
      const d = new Date(s.startTime);
      return (
        d.getDate() === currentTime.getDate() &&
        d.getMonth() === currentTime.getMonth() &&
        d.getFullYear() === currentTime.getFullYear()
      );
    })
    .reduce((acc, s) => acc + s.actualDurationMin, 0);

  const studyTargetMinutes = 120; // 2 hours
  const studyProgress = Math.min(100, Math.round((todayStudyMinutes / studyTargetMinutes) * 100));

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-r from-campus-bg-card via-campus-bg-secondary to-campus-bg-tertiary border border-campus-border shadow-card">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-campus-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-campus-primary-light text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Calendar className="w-4 h-4 text-campus-accent-light" />
              <span>{formatDate(currentTime)}</span>
              <span className="text-campus-border">•</span>
              <span className="font-mono text-campus-text-secondary">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {user?.displayName || 'Viraj'}
            </h2>
            <p className="text-xs md:text-sm text-campus-text-secondary mt-1">
              {user?.branch} • Division <span className="text-campus-primary-light font-bold">{user?.division}</span> (Batch{' '}
              <span className="text-campus-accent-light font-bold">{user?.practicalBatch}</span>) • Semester {user?.semester}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-campus-bg-deep/70 border border-campus-border">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Flame className="w-5 h-5 fill-amber-400/20 animate-bounce" />
              </div>
              <div>
                <div className="text-xs text-campus-text-muted font-medium">Study Streak</div>
                <div className="text-base font-bold text-white">4 Days</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-campus-bg-deep/70 border border-campus-border">
              <div className="p-2 rounded-xl bg-campus-primary/10 text-campus-primary-light">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-campus-text-muted font-medium">Attendance</div>
                <div className={`text-base font-bold ${overallPercentage >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {overallPercentage}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. "MY COLLEGE DAY" SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-campus-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-campus-text-primary">
              My College Day — Executive Briefing
            </h3>
          </div>
          <span className="text-[11px] text-campus-text-muted font-mono">{todayName}'s Live Agenda</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Next Lecture */}
          <Card className="p-4 border-l-4 border-l-campus-primary">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-campus-text-muted uppercase">Next Lecture</span>
              <Clock className="w-4 h-4 text-campus-primary-light" />
            </div>
            {nextLecture ? (
              <div>
                <div className="font-bold text-sm text-white truncate">{nextLecture.subjectName}</div>
                <div className="text-xs text-campus-text-secondary mt-0.5">
                  {nextLecture.startTime} - {nextLecture.endTime} • {nextLecture.room}
                </div>
                <div className="mt-2 text-[10px] inline-flex items-center px-2 py-0.5 rounded-full bg-campus-primary/15 text-campus-primary-light font-medium">
                  {countdownText}
                </div>
              </div>
            ) : (
              <div className="text-xs text-campus-text-muted py-2">No more lectures scheduled today.</div>
            )}
          </Card>

          {/* Card 2: Today's Practical */}
          <Card className="p-4 border-l-4 border-l-campus-accent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-campus-text-muted uppercase">Today's Practical</span>
              <FlaskConical className="w-4 h-4 text-campus-accent-light" />
            </div>
            {todayPracticalEvent ? (
              <div>
                <div className="font-bold text-sm text-white truncate">{todayPracticalEvent.subjectName}</div>
                <div className="text-xs text-campus-text-secondary mt-0.5">
                  {todayPracticalEvent.startTime} - {todayPracticalEvent.endTime}
                </div>
                <div className="mt-2 text-[10px] inline-flex items-center px-2 py-0.5 rounded-full bg-campus-accent/15 text-campus-accent-light font-medium truncate max-w-full">
                  Lab: {todayPracticalEvent.room}
                </div>
              </div>
            ) : (
              <div className="text-xs text-campus-text-muted py-2">No lab session scheduled for today.</div>
            )}
          </Card>

          {/* Card 3: Pending Deliverables */}
          <Card className="p-4 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-campus-text-muted uppercase">Pending Work</span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            {pendingAssignments.length > 0 ? (
              <div>
                <div className="font-bold text-sm text-white truncate">{pendingAssignments[0].title}</div>
                <div className="text-xs text-amber-400 mt-0.5">Due: {pendingAssignments[0].dueDate}</div>
                <div className="mt-2 text-[10px] text-campus-text-muted">
                  +{pendingAssignments.length - 1} more assignments due
                </div>
              </div>
            ) : (
              <div className="text-xs text-emerald-400 py-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                All assignments submitted!
              </div>
            )}
          </Card>

          {/* Card 4: Recommended Study Topic */}
          <Card className="p-4 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-campus-text-muted uppercase">Study Target</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-sm text-white truncate">Engineering Chemistry</div>
              <div className="text-xs text-campus-text-secondary mt-0.5">
                Revise: EDTA Titration Numericals
              </div>
              <div className="mt-2 text-[10px] inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                Unit 1 • Attendance critical
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Main Dashboard Grid (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Lecture Timetable */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-campus-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-campus-primary-light" />
                <h3 className="text-sm font-bold text-campus-text-primary">
                  Today's Timetable ({todayName})
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.TIMETABLE)}
                className="text-xs text-campus-primary-light hover:underline"
              >
                Full Week View <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
              </Button>
            </div>

            {todaySchedule.length > 0 ? (
              <div className="space-y-2.5">
                {todaySchedule.map((entry) => {
                  const isBreak = entry.type === 'break';
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isBreak
                          ? 'bg-campus-bg-tertiary/40 border-campus-border/40 text-campus-text-muted text-xs'
                          : 'bg-campus-bg-secondary/70 border-campus-border hover:border-campus-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-mono text-xs font-semibold text-campus-primary-light w-24">
                          {entry.startTime} - {entry.endTime}
                        </div>
                        <div>
                          <div className={`font-semibold text-xs ${isBreak ? 'text-campus-text-muted italic' : 'text-campus-text-primary'}`}>
                            {entry.subjectName}
                          </div>
                          {!isBreak && (
                            <div className="text-[11px] text-campus-text-muted">
                              {entry.faculty} • {entry.room} {entry.batch ? `(${entry.batch})` : ''}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        {entry.type === 'practical' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-accent/20 text-campus-accent-light font-medium">
                            Practical
                          </span>
                        )}
                        {entry.type === 'tutorial' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                            Tutorial
                          </span>
                        )}
                        {entry.type === 'activity' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                            Field Activity
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-campus-text-muted text-xs">
                No classes scheduled for today. Enjoy your day!
              </div>
            )}
          </Card>

          {/* Pending Assignments */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-campus-border">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-campus-text-primary">Pending Course Deliverables</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.ASSIGNMENTS)}
                className="text-xs text-campus-primary-light hover:underline"
              >
                All Assignments ({assignments.length}) <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
              </Button>
            </div>

            <div className="space-y-3">
              {pendingAssignments.slice(0, 3).map((asg) => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl bg-campus-bg-secondary/60 border border-campus-border flex items-center justify-between hover:border-campus-border-light transition-all"
                >
                  <div className="space-y-1 max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-campus-text-primary truncate">{asg.title}</span>
                      {asg.priority === 'urgent' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-campus-danger/20 text-red-400 font-bold uppercase">
                          Urgent
                        </span>
                      )}
                      {asg.priority === 'high' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-semibold uppercase">
                          High
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-campus-text-muted line-clamp-1">{asg.description}</p>
                    <div className="text-[10px] text-campus-text-secondary">Due by: {asg.dueDate}</div>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      dataManager.updateAssignmentStatus(asg.id, 'submitted');
                      setAssignments(dataManager.getAssignments());
                    }}
                    className="text-xs"
                  >
                    Mark Done
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Attendance Alerts & Study & AI Assist */}
        <div className="space-y-6">
          {/* Attendance Health Widget */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-campus-text-primary flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-campus-primary-light" />
                Attendance Intelligence
              </h3>
              <span className={`text-xs font-bold ${overallPercentage >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {overallPercentage}%
              </span>
            </div>

            <ProgressBar value={overallPercentage} className="mb-3" />

            {subjectsWithLowAttendance.length > 0 ? (
              <div className="p-3 rounded-xl bg-campus-danger/10 border border-campus-danger/30 text-campus-danger text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Below 75% Threshold Alert</span>
                </div>
                <p className="text-[11px] text-campus-text-secondary leading-relaxed">
                  {subjectsWithLowAttendance.map((s) => s.name).join(', ')} attendance is below target! Attend next 4 classes without miss.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-campus-success/10 border border-campus-success/30 text-emerald-400 text-xs">
                All subject attendances safely exceed the 75% threshold!
              </div>
            )}

            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-center mt-3 text-xs"
              onClick={() => navigate(ROUTES.ATTENDANCE)}
            >
              Open What-If Calculator
            </Button>
          </Card>

          {/* Today's Focus Session */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-campus-text-primary">Today's Focus Goal</h3>
              <span className="text-xs font-mono text-campus-text-muted">
                {todayStudyMinutes}m / {studyTargetMinutes}m
              </span>
            </div>
            <ProgressBar value={studyProgress} className="mb-4" />

            <Button
              variant="primary"
              className="w-full justify-center text-xs"
              onClick={() => navigate(ROUTES.STUDY_PLANNER)}
            >
              <Play className="w-3.5 h-3.5 mr-1.5 fill-white" />
              Launch Pomodoro Session
            </Button>
          </Card>

          {/* Upcoming Exams Countdown */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-campus-text-primary flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-campus-accent-light" />
                Examinations
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.EXAMS)}
                className="text-[11px] text-campus-primary-light"
              >
                View
              </Button>
            </div>

            <div className="space-y-2">
              {exams.slice(0, 2).map((ex) => (
                <div key={ex.id} className="p-2.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs">
                  <div className="font-semibold text-white truncate">{ex.title}</div>
                  <div className="text-[11px] text-campus-text-muted mt-0.5">
                    Date: {ex.date} • {ex.maxScore} Marks
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Ask AI Tutor */}
          <div className="rounded-2xl p-4 bg-gradient-to-br from-campus-primary/15 via-campus-accent/10 to-transparent border border-campus-primary/30 space-y-2">
            <div className="flex items-center gap-2 text-campus-accent-light text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>VPKBIET AI Engineering Tutor</span>
            </div>
            <p className="text-[11px] text-campus-text-secondary leading-relaxed">
              Have doubts in Taylor series, PN junction diodes, or C pointers? The AI tutor is grounded in your FY 2025 syllabus.
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="w-full justify-center text-xs"
              onClick={() => navigate(ROUTES.AI_TUTOR)}
            >
              Start Subject Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
