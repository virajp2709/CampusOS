import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Sparkles, Building2, BookMarked, Layers, Hash } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/routes';
import { Button, Input, Select, Card } from '@/components/ui';

export const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

  const [college, setCollege] = useState(user?.college || "Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering and Technology, Baramati");
  const [course, setCourse] = useState(user?.course || 'B.Tech');
  const [branch, setBranch] = useState(user?.branch || 'Artificial Intelligence and Data Science');
  const [division, setDivision] = useState(user?.division || 'AI-5');
  const [academicYear, setAcademicYear] = useState(user?.academicYear || '2026–2027');
  const [semester, setSemester] = useState(user?.semester || 1);
  const [rollNumber, setRollNumber] = useState(user?.rollNumber || '26107337');
  const [practicalBatch, setPracticalBatch] = useState(user?.practicalBatch || 'AI-5c');
  const [attendanceTarget, setAttendanceTarget] = useState(user?.attendanceTarget || 75);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    setSaved(true);
    setTimeout(() => {
      navigate(ROUTES.DASHBOARD);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-campus-primary/20 text-campus-primary-light mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-campus-text-primary">Configure Student Profile</h1>
        <p className="text-xs text-campus-text-muted mt-1">
          Customize your institutional affiliation, division, roll number, and practical batch.
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="College / Institute Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
            helperText="e.g. Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering and Technology, Baramati"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Course / Degree"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
            <Input
              label="Branch / Specialization"
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
              helperText="e.g. AI-5c"
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
                { value: '1', label: 'Semester I' },
                { value: '2', label: 'Semester II' },
                { value: '3', label: 'Semester III' },
                { value: '4', label: 'Semester IV' },
              ]}
            />
            <Input
              label="Target Attendance (%)"
              type="number"
              min="50"
              max="100"
              value={attendanceTarget}
              onChange={(e) => setAttendanceTarget(Number(e.target.value))}
              required
              helperText="Default threshold is 75%"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-campus-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <UserCheck className="w-4 h-4 mr-2" />
              {saved ? 'Saved!' : 'Save & Continue'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
