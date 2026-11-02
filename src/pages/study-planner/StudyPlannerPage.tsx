import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  History,
  Flame,
} from 'lucide-react';
import { Card, Button, Input, Select, ProgressBar } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import type { StudySession } from '@/types';

export const StudyPlannerPage: React.FC = () => {
  const [subjects] = useState(() => dataManager.getSubjects());
  const [sessions, setSessions] = useState<StudySession[]>(() => dataManager.getStudySessions());
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'subj-maths-1');

  // Pomodoro Timer State
  const [focusDurationMinutes, setFocusDurationMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isActive) {
      // Completed session
      setIsActive(false);
      handleCompleteSession();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeftSeconds]);

  const handleStartTimer = () => {
    if (!isActive) {
      setSessionStartTime(new Date());
    }
    setIsActive(true);
  };

  const handlePauseTimer = () => {
    setIsActive(false);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setTimeLeftSeconds(focusDurationMinutes * 60);
    setSessionStartTime(null);
  };

  const handleDurationChange = (mins: number) => {
    setFocusDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
    setIsActive(false);
  };

  const handleCompleteSession = () => {
    const elapsedMinutes = Math.max(
      1,
      Math.round((focusDurationMinutes * 60 - timeLeftSeconds) / 60)
    );

    const newSession = dataManager.addStudySession({
      subjectId: selectedSubjectId,
      startTime: sessionStartTime || new Date(Date.now() - elapsedMinutes * 60000),
      endTime: new Date(),
      plannedDurationMin: focusDurationMinutes,
      actualDurationMin: elapsedMinutes,
      type: 'pomodoro',
      status: 'completed',
    });

    setSessions(dataManager.getStudySessions());
    handleResetTimer();
  };

  // Metrics
  const totalMinutesStudied = sessions.reduce((acc, s) => acc + s.actualDurationMin, 0);
  const totalHours = (totalMinutesStudied / 60).toFixed(1);

  const formatTimerDisplay = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <Timer className="w-5 h-5 text-campus-primary-light" />
            <span>Study Planner & Focus Telemetry</span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            Pomodoro deep work intervals, telemetry logging, and revision streaks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span className="text-white font-bold">4 Day Streak</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold">{totalHours}h Logged</span>
          </div>
        </div>
      </div>

      {/* Main Pomodoro Clock Card */}
      <Card className="p-8 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-campus-bg-card to-campus-bg-secondary">
        <div className="flex justify-center items-center gap-3">
          <span className="text-xs text-campus-text-muted">Target Course:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            disabled={isActive}
            className="px-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs font-semibold text-campus-primary-light focus:outline-none"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id} className="bg-campus-bg-card">
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Circular Display */}
        <div className="relative w-64 h-64 mx-auto flex flex-col items-center justify-center rounded-full border-4 border-campus-primary/30 bg-campus-bg-deep/80 shadow-glow-strong">
          <span className="text-5xl font-mono font-extrabold text-white tracking-wider">
            {formatTimerDisplay(timeLeftSeconds)}
          </span>
          <span className="text-xs text-campus-text-muted mt-2 font-medium">
            {isActive ? 'Deep Work in Progress' : 'Ready to Focus'}
          </span>
        </div>

        {/* Preset Duration Buttons */}
        <div className="flex justify-center gap-2">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleDurationChange(mins)}
              disabled={isActive}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                focusDurationMinutes === mins
                  ? 'bg-campus-primary text-white shadow-glow'
                  : 'bg-campus-bg-secondary text-campus-text-secondary hover:text-white border border-campus-border'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>

        {/* Timer Control Buttons */}
        <div className="flex justify-center items-center gap-3 pt-2">
          {!isActive ? (
            <Button size="lg" variant="primary" onClick={handleStartTimer} className="px-8 font-bold">
              <Play className="w-4 h-4 mr-2 fill-white" />
              Start Focus Session
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={handlePauseTimer} className="px-8 font-bold">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}

          <Button size="lg" variant="ghost" onClick={handleResetTimer}>
            <RotateCcw className="w-4 h-4" />
          </Button>

          {isActive && (
            <Button size="lg" variant="secondary" onClick={handleCompleteSession}>
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
              Complete & Log
            </Button>
          )}
        </div>
      </Card>

      {/* Recent Study Sessions Log */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-campus-primary-light" />
            Verified Study Telemetry History
          </h3>
          <span className="text-xs text-campus-text-muted">{sessions.length} sessions logged</span>
        </div>

        <div className="space-y-2.5">
          {sessions.map((sess) => {
            const subject = subjects.find((s) => s.id === sess.subjectId);
            return (
              <div
                key={sess.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-campus-primary/10 text-campus-primary-light font-bold">
                    {sess.actualDurationMin}m
                  </div>
                  <div>
                    <div className="font-semibold text-white">{subject?.name || 'General Study'}</div>
                    <div className="text-[11px] text-campus-text-muted mt-0.5">
                      {new Date(sess.startTime).toLocaleDateString()} • {sess.type}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-success/15 text-emerald-400 font-bold uppercase">
                  {sess.status}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
