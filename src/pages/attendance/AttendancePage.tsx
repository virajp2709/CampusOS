import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Calculator,
  Plus,
  History,
  TrendingUp,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Input, Select, Modal, ProgressBar } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import {
  calculateAttendancePercentage,
  classesNeededForTarget,
  maxFutureAbsences,
} from '@/utils/attendance-calc';
import type { AttendanceRecord } from '@/types';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [subjects] = useState(() => dataManager.getSubjects());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => dataManager.getAttendance());
  const targetThreshold = user?.attendanceTarget || 75;

  // Selected subject for detailed view & what-if calculator
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'subj-maths-1');

  // Manual Attendance Modal
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [markSubjectId, setMarkSubjectId] = useState<string>(subjects[0]?.id || 'subj-maths-1');
  const [markStatus, setMarkStatus] = useState<'present' | 'absent'>('present');
  const [markType, setMarkType] = useState<'lecture' | 'practical' | 'tutorial'>('lecture');
  const [markDate, setMarkDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [markNote, setMarkNote] = useState<string>('');

  // What-if Calculator State
  const [whatIfFutureClasses, setWhatIfFutureClasses] = useState<number>(10);
  const [whatIfAttending, setWhatIfAttending] = useState<number>(8);

  // Compute metrics per subject
  const subjectSummaries = subjects.map((subj) => {
    const records = attendance.filter((a) => a.subjectId === subj.id && a.status !== 'cancelled');
    const total = records.length;
    const attended = records.filter((a) => a.status === 'present').length;
    const missed = records.filter((a) => a.status === 'absent').length;
    const percentage = calculateAttendancePercentage(attended, total);
    const needed = classesNeededForTarget(attended, total, targetThreshold);
    const maxMiss = maxFutureAbsences(attended, total, targetThreshold, 10);

    return {
      ...subj,
      total,
      attended,
      missed,
      percentage,
      needed,
      maxMiss,
    };
  });

  const selectedSummary = subjectSummaries.find((s) => s.id === selectedSubjectId) || subjectSummaries[0];

  // What-If projected calculation
  const hypotheticalTotal = (selectedSummary?.total || 0) + Number(whatIfFutureClasses);
  const hypotheticalAttended = (selectedSummary?.attended || 0) + Number(whatIfAttending);
  const hypotheticalPercentage = calculateAttendancePercentage(hypotheticalAttended, hypotheticalTotal);

  const handleMarkAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    dataManager.addAttendanceRecord({
      subjectId: markSubjectId,
      status: markStatus,
      type: markType,
      date: markDate,
      note: markNote || undefined,
    });
    setAttendance(dataManager.getAttendance());
    setIsMarkModalOpen(false);
    setMarkNote('');
  };

  const handleQuickMark = (subjectId: string, status: 'present' | 'absent') => {
    dataManager.addAttendanceRecord({
      subjectId,
      status,
      type: 'lecture',
      date: new Date().toISOString().split('T')[0],
    });
    setAttendance(dataManager.getAttendance());
  };

  const chartData = subjectSummaries.map((s) => ({
    name: s.code,
    fullName: s.name,
    percentage: s.percentage,
    target: targetThreshold,
  }));

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-campus-primary-light" />
            <span>Attendance Intelligence & Analytics</span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            Formula: Attendance % = (Classes Attended / Classes Conducted) × 100 • College Target Threshold: {targetThreshold}%
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsMarkModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Log Class Attendance
        </Button>
      </div>

      {/* Official Disclaimer Note */}
      <div className="p-3 rounded-2xl bg-campus-bg-secondary/70 border border-campus-border text-[11px] text-campus-text-secondary flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-campus-primary-light flex-shrink-0 mt-0.5" />
        <span>
          <strong>Student Integrity Notice:</strong> CampusOS logs and projections represent your personal verified academic attendance tracker. Official eligibility records are retained by the college examination department.
        </span>
      </div>

      {/* Subject-wise Bar Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-campus-text-primary flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-campus-accent-light" />
            Subject Attendance Distribution vs {targetThreshold}% Target
          </h3>
          <span className="text-[11px] text-campus-text-muted">Target Line: {targetThreshold}%</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3352" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-campus-bg-card border border-campus-border p-2.5 rounded-xl shadow-card text-xs">
                        <div className="font-bold text-white">{data.fullName}</div>
                        <div className="text-campus-primary-light font-mono mt-1">Code: {data.name}</div>
                        <div className="text-emerald-400 font-bold mt-1">Attendance: {data.percentage}%</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={targetThreshold} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: `Target (${targetThreshold}%)`, fill: '#f59e0b', fontSize: 10, position: 'top' }} />
              <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.percentage >= targetThreshold ? '#6366f1' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjectSummaries.map((subj) => {
          const isBelow = subj.percentage < targetThreshold;
          return (
            <Card
              key={subj.id}
              className={`p-4 flex flex-col justify-between border-t-4 transition-all cursor-pointer ${
                selectedSubjectId === subj.id ? 'ring-2 ring-campus-primary shadow-glow' : ''
              } ${isBelow ? 'border-t-campus-danger' : 'border-t-campus-success'}`}
              onClick={() => setSelectedSubjectId(subj.id)}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-campus-primary-light font-bold">
                    {subj.code}
                  </span>
                  <span
                    className={`font-bold text-xs ${
                      isBelow ? 'text-campus-danger' : 'text-emerald-400'
                    }`}
                  >
                    {subj.percentage}%
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white line-clamp-1">{subj.name}</h4>
                <p className="text-[11px] text-campus-text-muted mt-0.5">{subj.faculty}</p>

                <div className="my-3">
                  <ProgressBar
                    value={subj.percentage}
                    variant={isBelow ? 'danger' : 'primary'}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-campus-border/60 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-campus-text-muted block">Conducted</span>
                    <span className="font-bold text-white">{subj.total}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-campus-text-muted block">Attended</span>
                    <span className="font-bold text-emerald-400">{subj.attended}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-campus-text-muted block">Missed</span>
                    <span className="font-bold text-red-400">{subj.missed}</span>
                  </div>
                </div>

                {/* Mathematical Insight Projections */}
                <div className="mt-3 text-[11px] space-y-1">
                  {isBelow ? (
                    <div className="flex items-center gap-1.5 text-campus-danger font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Must attend next <strong>{subj.needed}</strong> classes consecutively!</span>
                    </div>
                  ) : (
                    <div className="text-campus-text-secondary">
                      Can miss up to <strong>{subj.maxMiss}</strong> of next 10 classes without falling below {targetThreshold}%.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Log Buttons */}
              <div className="flex items-center gap-2 pt-4 mt-3 border-t border-campus-border/40">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 justify-center text-xs py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickMark(subj.id, 'present');
                  }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  + Present
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 justify-center text-xs py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickMark(subj.id, 'absent');
                  }}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  + Absent
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* WHAT-IF ATTENDANCE SIMULATOR */}
      {selectedSummary && (
        <Card className="p-6 border border-campus-primary/40 bg-gradient-to-r from-campus-bg-card to-campus-bg-secondary">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-campus-primary-light" />
            <div>
              <h3 className="text-sm font-bold text-white">
                What-If Attendance Scenario Simulator — {selectedSummary.name}
              </h3>
              <p className="text-[11px] text-campus-text-muted">
                Simulate your future attendance percentage based on upcoming class participation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-3">
              <Input
                label="Number of upcoming future classes conducted"
                type="number"
                min="1"
                max="50"
                value={whatIfFutureClasses}
                onChange={(e) => setWhatIfFutureClasses(Number(e.target.value))}
              />
              <Input
                label="How many will you attend?"
                type="number"
                min="0"
                max={whatIfFutureClasses}
                value={whatIfAttending}
                onChange={(e) => setWhatIfAttending(Number(e.target.value))}
              />
            </div>

            <div className="p-4 rounded-2xl bg-campus-bg-deep border border-campus-border text-center space-y-1">
              <span className="text-xs text-campus-text-muted block">Projected Attendance</span>
              <div
                className={`text-3xl font-extrabold ${
                  hypotheticalPercentage >= targetThreshold ? 'text-emerald-400' : 'text-campus-danger'
                }`}
              >
                {hypotheticalPercentage}%
              </div>
              <div className="text-[11px] text-campus-text-secondary">
                {hypotheticalAttended} attended / {hypotheticalTotal} total
              </div>
            </div>

            <div className="text-xs space-y-2 text-campus-text-secondary leading-relaxed">
              <div className="font-semibold text-white">Mathematical Explanation:</div>
              <p>
                Currently at <strong>{selectedSummary.percentage}%</strong> ({selectedSummary.attended}/{selectedSummary.total}).
              </p>
              <p>
                If you attend {whatIfAttending} out of next {whatIfFutureClasses} classes, your total will reach{' '}
                {hypotheticalAttended}/{hypotheticalTotal} = <strong>{hypotheticalPercentage}%</strong>.
              </p>
              {hypotheticalPercentage >= targetThreshold ? (
                <div className="text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-4 h-4" /> Meets examination threshold!
                </div>
              ) : (
                <div className="text-campus-danger font-semibold flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-4 h-4" /> Below required {targetThreshold}% threshold!
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* LOG MODAL */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Record Class Attendance Entry"
      >
        <form onSubmit={handleMarkAttendance} className="space-y-4 pt-2">
          <Select
            label="Subject"
            value={markSubjectId}
            onChange={(e) => setMarkSubjectId(e.target.value)}
            options={subjects.map((s) => ({ value: s.id, label: `${s.code} - ${s.name}` }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Attendance Status"
              value={markStatus}
              onChange={(e) => setMarkStatus(e.target.value as any)}
              options={[
                { value: 'present', label: 'Present (Attended)' },
                { value: 'absent', label: 'Absent (Missed)' },
              ]}
            />
            <Select
              label="Session Type"
              value={markType}
              onChange={(e) => setMarkType(e.target.value as any)}
              options={[
                { value: 'lecture', label: 'Theory Lecture' },
                { value: 'practical', label: 'Lab Practical' },
                { value: 'tutorial', label: 'Tutorial' },
              ]}
            />
          </div>

          <Input
            label="Class Date"
            type="date"
            value={markDate}
            onChange={(e) => setMarkDate(e.target.value)}
            required
          />

          <Input
            label="Note / Reason (Optional)"
            placeholder="e.g. Leave for sports tournament or illness"
            value={markNote}
            onChange={(e) => setMarkNote(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-campus-border">
            <Button type="button" variant="secondary" onClick={() => setIsMarkModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Log Attendance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
