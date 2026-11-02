import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  ClipboardCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, ProgressBar } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import { calculateAttendancePercentage } from '@/utils/attendance-calc';

export const AnalyticsPage: React.FC = () => {
  const [subjects] = useState(() => dataManager.getSubjects());
  const [attendance] = useState(() => dataManager.getAttendance());
  const [assignments] = useState(() => dataManager.getAssignments());
  const [practicals] = useState(() => dataManager.getPracticals());
  const [studySessions] = useState(() => dataManager.getStudySessions());

  // Attendance Metrics
  const totalConducted = attendance.filter((a) => a.status !== 'cancelled').length;
  const totalAttended = attendance.filter((a) => a.status === 'present').length;
  const overallAttendance = calculateAttendancePercentage(totalAttended, totalConducted);

  // Assignment Metrics
  const totalAssignments = assignments.length;
  const submittedAssignments = assignments.filter((a) => a.status === 'submitted').length;
  const assignmentRate = totalAssignments > 0 ? Math.round((submittedAssignments / totalAssignments) * 100) : 0;

  // Study hours
  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.actualDurationMin, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // Subject study distribution
  const studyDistribution = subjects.map((s, idx) => {
    const mins = studySessions
      .filter((sess) => sess.subjectId === s.id)
      .reduce((acc, sess) => acc + sess.actualDurationMin, 0);
    return {
      name: s.code,
      fullName: s.name,
      value: mins || 30, // fallback for chart visibility
    };
  });

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-campus-primary-light" />
          <span>Academic Performance Analytics</span>
        </h2>
        <p className="text-xs text-campus-text-muted mt-0.5">
          Longitudinal academic health metrics, attendance compliance, and study telemetry.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-campus-primary">
          <div className="text-xs text-campus-text-muted font-medium">Cumulative Attendance</div>
          <div className="text-2xl font-bold text-white mt-1">{overallAttendance}%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Above 75% target threshold</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-campus-accent">
          <div className="text-xs text-campus-text-muted font-medium">Assignment Completion</div>
          <div className="text-2xl font-bold text-white mt-1">
            {submittedAssignments} / {totalAssignments}
          </div>
          <div className="text-[10px] text-campus-accent-light mt-1">{assignmentRate}% submitted</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-xs text-campus-text-muted font-medium">Verified Study Hours</div>
          <div className="text-2xl font-bold text-white mt-1">{totalStudyHours} Hours</div>
          <div className="text-[10px] text-emerald-400 mt-1">Across Semester I</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-xs text-campus-text-muted font-medium">Total Course Credits</div>
          <div className="text-2xl font-bold text-white mt-1">22.0 Credits</div>
          <div className="text-[10px] text-amber-400 mt-1">FY B.Tech AI & DS Pattern 2025</div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Breakdown */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-campus-primary-light" />
            Subject Attendance Overview
          </h3>

          <div className="space-y-4">
            {subjects.map((s) => {
              const recs = attendance.filter((a) => a.subjectId === s.id && a.status !== 'cancelled');
              const attended = recs.filter((a) => a.status === 'present').length;
              const pct = calculateAttendancePercentage(attended, recs.length);

              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">{s.name}</span>
                    <span className={`font-mono font-bold ${pct >= 75 ? 'text-emerald-400' : 'text-campus-danger'}`}>
                      {pct}% ({attended}/{recs.length})
                    </span>
                  </div>
                  <ProgressBar value={pct} variant={pct >= 75 ? 'primary' : 'danger'} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Study Time Allocation */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-campus-accent-light" />
            Subject Study Time Allocation
          </h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studyDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {studyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-campus-bg-card border border-campus-border p-2 rounded-xl text-xs">
                          <div className="font-bold text-white">{data.fullName}</div>
                          <div className="text-campus-primary-light font-mono mt-0.5">{data.value} minutes</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
