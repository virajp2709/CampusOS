import React, { useState } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  Send,
  Award,
  Filter,
  FileCheck,
  MapPin,
  User,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Input, Select, Modal, Badge, ProgressBar } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import type { Practical } from '@/types';

export const PracticalsPage: React.FC = () => {
  const { user } = useAuth();
  const [subjects] = useState(() => dataManager.getSubjects());
  const [practicals, setPracticals] = useState<Practical[]>(() => dataManager.getPracticals());
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>(user?.practicalBatch || 'AI-5c');

  // Submit / Grade Practical Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedPractical, setSelectedPractical] = useState<Practical | null>(null);
  const [marks, setMarks] = useState<number>(10);
  const [submissionNotes, setSubmissionNotes] = useState('');

  const filteredPracticals = practicals.filter((p) => {
    if (selectedSubjectFilter !== 'all' && p.subjectId !== selectedSubjectFilter) return false;
    return true;
  });

  const completedCount = practicals.filter((p) => p.status === 'completed' || p.status === 'submitted').length;
  const totalCount = practicals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleOpenSubmit = (p: Practical) => {
    setSelectedPractical(p);
    setMarks(p.marks || 10);
    setSubmissionNotes(p.notes || '');
    setIsSubmitModalOpen(true);
  };

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPractical) return;
    dataManager.updatePracticalStatus(selectedPractical.id, 'submitted', Number(marks));
    setPracticals(dataManager.getPracticals());
    setIsSubmitModalOpen(false);
  };

  const handleToggleCompleted = (id: string, currentStatus: Practical['status']) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    dataManager.updatePracticalStatus(id, nextStatus);
    setPracticals(dataManager.getPracticals());
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-campus-accent-light" />
            <span>Practical & Laboratory Portfolio</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-campus-accent/20 text-campus-accent-light font-bold">
              Batch: {selectedBatch}
            </span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            Lab Experiments, Continuous Term Work Assessments (TW: 30-50 Marks), and Journal Tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs">
            <Filter className="w-3.5 h-3.5 text-campus-text-muted" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-transparent text-campus-text-primary focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-campus-bg-card">All Laboratory Courses</option>
              <option value="subj-python" className="bg-campus-bg-card">Python Programming Lab</option>
              <option value="subj-fpl" className="bg-campus-bg-card">C Programming (FPL) Lab</option>
              <option value="subj-bee" className="bg-campus-bg-card">Basic Electronics Lab</option>
              <option value="subj-chem" className="bg-campus-bg-card">Engineering Chemistry Lab</option>
              <option value="subj-eg" className="bg-campus-bg-card">Engineering Graphics / CAD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress & Batch Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-campus-primary/20 text-campus-primary-light">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-campus-text-muted">Term Work Completion</div>
            <div className="text-xl font-bold text-white">
              {completedCount} / {totalCount} Labs
            </div>
            <div className="text-[10px] text-campus-accent-light mt-0.5">{progressPercent}% verified</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-campus-text-muted">Average Lab Assessment</div>
            <div className="text-xl font-bold text-white">9.7 / 10</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Continuous Internal Assessment</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-campus-accent/20 text-campus-accent-light">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-campus-text-muted">Active Practical Batch</div>
            <div className="text-xl font-bold text-white">{selectedBatch}</div>
            <div className="text-[10px] text-campus-text-muted mt-0.5">Division AI-5 • VPKBIET</div>
          </div>
        </Card>
      </div>

      {/* Experiment List */}
      <div className="space-y-3">
        {filteredPracticals.map((prac) => {
          const subject = subjects.find((s) => s.id === prac.subjectId);
          const isSubmitted = prac.status === 'submitted';
          const isCompleted = prac.status === 'completed';

          return (
            <Card
              key={prac.id}
              className={`p-4 transition-all border-l-4 ${
                isSubmitted
                  ? 'border-l-campus-success'
                  : isCompleted
                  ? 'border-l-campus-primary'
                  : 'border-l-campus-border'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-campus-primary-light">
                      Exp #{prac.experimentNo}
                    </span>
                    <span className="text-[11px] px-2 py-0.2 rounded-full bg-campus-bg-tertiary text-campus-text-secondary font-medium">
                      {subject?.name || 'Lab Course'}
                    </span>
                    {isSubmitted && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-success/15 text-emerald-400 font-bold">
                        Submitted & Signed ({prac.marks}/10)
                      </span>
                    )}
                    {isCompleted && !isSubmitted && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-primary/15 text-campus-primary-light font-bold">
                        Completed (Ready for Submission)
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-white">{prac.title}</h4>
                  <p className="text-xs text-campus-text-muted leading-relaxed">{prac.description}</p>

                  {prac.notes && (
                    <div className="text-[11px] text-campus-accent-light mt-1 bg-campus-bg-tertiary/60 p-2 rounded-lg inline-block">
                      Note: {prac.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    size="sm"
                    variant={isCompleted || isSubmitted ? 'secondary' : 'primary'}
                    onClick={() => handleToggleCompleted(prac.id, prac.status)}
                    className="text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {isCompleted || isSubmitted ? 'Mark Pending' : 'Mark Completed'}
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleOpenSubmit(prac)}
                    className="text-xs"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    Journal Entry
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* SUBMISSION / GRADING MODAL */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Lab Journal Evaluation: Exp #${selectedPractical?.experimentNo}`}
      >
        <form onSubmit={handleSaveSubmission} className="space-y-4 pt-2">
          <div>
            <div className="font-bold text-sm text-white">{selectedPractical?.title}</div>
            <p className="text-xs text-campus-text-muted mt-0.5">{selectedPractical?.description}</p>
          </div>

          <Input
            label="Internal Assessment Score (Marks out of 10)"
            type="number"
            min="1"
            max="10"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
            required
            helperText="Faculty continuous term work marks awarded in lab journal"
          />

          <Input
            label="Faculty Remark / Observation"
            placeholder="e.g. Verified by Prof. Gaikwad. Circuit test verified."
            value={submissionNotes}
            onChange={(e) => setSubmissionNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-campus-border">
            <Button type="button" variant="secondary" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Lab Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
