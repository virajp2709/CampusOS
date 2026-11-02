import React, { useState } from 'react';
import {
  Save,
  User,
  Shield,
  Download,
  Trash2,
  CheckCircle,
  Database,
  Smartphone,
  Info,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button, Input, Select, Card, Toggle } from '@/components/ui';

export const SettingsPage: React.FC = () => {
  const { user, updateUserProfile, signOut } = useAuth();
  const { mode, toggleTheme } = useTheme();

  const [college, setCollege] = useState(user?.college || "Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering and Technology, Baramati");
  const [course, setCourse] = useState(user?.course || 'B.Tech');
  const [branch, setBranch] = useState(user?.branch || 'Artificial Intelligence and Data Science');
  const [division, setDivision] = useState(user?.division || 'AI-5');
  const [academicYear, setAcademicYear] = useState(user?.academicYear || '2026–2027');
  const [semester, setSemester] = useState(user?.semester || 1);
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || '26107337');
  const [practicalBatch, setPracticalBatch] = useState(user?.practicalBatch || 'AI-5c');
  const [attendanceTarget, setAttendanceTarget] = useState(user?.attendanceTarget || 75);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      college,
      course,
      branch,
      division,
      academicYear,
      semester: Number(semester),
      rollNumber,
      practicalBatch,
      attendanceTarget: Number(attendanceTarget),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const exportData = {
      profile: user,
      exportDate: new Date().toISOString(),
      platform: 'CampusOS Web/Android v1.0',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusOS_Data_Backup_${user?.rollNumber || '26107337'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-campus-text-primary">System & Student Settings</h2>
        <p className="text-xs text-campus-text-muted">
          Manage your academic profile, practical batches, theme, and data security.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-campus-success/15 border border-campus-success/30 text-emerald-400 text-xs animate-slide-up">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Profile configuration successfully saved to your cloud workspace!</span>
        </div>
      )}

      {/* Profile Configuration Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-campus-border">
          <User className="w-5 h-5 text-campus-primary-light" />
          <div>
            <h3 className="text-sm font-semibold text-campus-text-primary">Student Academic Configuration</h3>
            <p className="text-[11px] text-campus-text-muted">All timetable and batch calculations dynamically derive from these fields.</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="College / Institute Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Course / Degree"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
            <Input
              label="Branch / Discipline"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Division"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              required
              helperText="e.g. AI-5"
            />
            <Input
              label="Practical Batch"
              value={practicalBatch}
              onChange={(e) => setPracticalBatch(e.target.value)}
              required
              helperText="e.g. AI-5c (also supports AI-5a, AI-5b)"
            />
            <Input
              label="Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Academic Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              required
            />
            <Select
              label="Semester"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              options={[
                { value: '1', label: 'Semester I (Active)' },
                { value: '2', label: 'Semester II' },
                { value: '3', label: 'Semester III' },
                { value: '4', label: 'Semester IV' },
              ]}
            />
            <Input
              label="Attendance Threshold (%)"
              type="number"
              min="50"
              max="100"
              value={attendanceTarget}
              onChange={(e) => setAttendanceTarget(Number(e.target.value))}
              required
              helperText="Threshold for low-attendance warnings"
            />
          </div>

          <div className="flex justify-end pt-3">
            <Button type="submit" variant="primary">
              <Save className="w-4 h-4 mr-2" />
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Preferences & Theme */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-campus-text-primary mb-4">Interface Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-campus-border/50">
            <div>
              <div className="text-xs font-medium text-campus-text-primary">Dark Mode Theme</div>
              <div className="text-[11px] text-campus-text-muted">High-contrast dark theme optimized for long study sessions</div>
            </div>
            <Toggle checked={mode === 'dark'} onChange={toggleTheme} />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs font-medium text-campus-text-primary">Practical Batch Filter</div>
              <div className="text-[11px] text-campus-text-muted">Show only {practicalBatch} sessions on smart timetable by default</div>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
        </div>
      </Card>

      {/* Security & Data Portability */}
      <Card className="p-6">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-campus-border">
          <Shield className="w-5 h-5 text-campus-success" />
          <div>
            <h3 className="text-sm font-semibold text-campus-text-primary">Data Privacy & Portability</h3>
            <p className="text-[11px] text-campus-text-muted">You own your academic records. Stored in isolated Firestore collections.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export My Academic Data (JSON)
          </Button>

          <Button
            variant="ghost"
            className="text-campus-danger hover:bg-campus-danger/10"
            onClick={() => {
              if (confirm('Are you sure you want to log out and clear active session?')) {
                signOut();
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Local Session & Sign Out
          </Button>
        </div>
      </Card>

      {/* App & Device Info */}
      <div className="flex items-center gap-2 text-[11px] text-campus-text-muted px-2">
        <Info className="w-3.5 h-3.5" />
        <span>CampusOS v1.0.0 • React + TypeScript + Vite + Tailwind + Capacitor Android (com.viraj.campusos)</span>
      </div>
    </div>
  );
};
