import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Filter,
  Trash2,
  Edit,
} from 'lucide-react';
import { Card, Button, Input, Select, Modal, Badge } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import type { Assignment } from '@/types';

export const AssignmentsPage: React.FC = () => {
  const [subjects] = useState(() => dataManager.getSubjects());
  const [assignments, setAssignments] = useState<Assignment[]>(() => dataManager.getAssignments());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form State
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'subj-maths-1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Assignment['priority']>('medium');
  const [status, setStatus] = useState<Assignment['status']>('not_started');
  const [submissionLink, setSubmissionLink] = useState('');

  const filtered = assignments.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    setSubjectId(subjects[0]?.id || 'subj-maths-1');
    setTitle('');
    setDescription('');
    setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setPriority('medium');
    setStatus('not_started');
    setSubmissionLink('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asg: Assignment) => {
    setEditingAssignment(asg);
    setSubjectId(asg.subjectId);
    setTitle(asg.title);
    setDescription(asg.description);
    setDueDate(asg.dueDate);
    setPriority(asg.priority);
    setStatus(asg.status);
    setSubmissionLink(asg.submissionLink || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      const updated = assignments.map((a) =>
        a.id === editingAssignment.id
          ? {
              ...a,
              subjectId,
              title,
              description,
              dueDate,
              priority,
              status,
              submissionLink,
              completedAt: status === 'completed' || status === 'submitted' ? new Date().toISOString().split('T')[0] : null,
              updatedAt: new Date(),
            }
          : a
      );
      setAssignments(updated);
      dataManager.saveAssignments(updated);
    } else {
      const newAsg = dataManager.addAssignment({
        subjectId,
        title,
        description,
        dueDate,
        priority,
        status,
        attachmentURLs: [],
        submissionLink,
        completedAt: status === 'completed' || status === 'submitted' ? new Date().toISOString().split('T')[0] : null,
        reminder: null,
      });
      setAssignments(dataManager.getAssignments());
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string, current: Assignment['status']) => {
    const nextStatus = current === 'submitted' ? 'in_progress' : 'submitted';
    dataManager.updateAssignmentStatus(id, nextStatus);
    setAssignments(dataManager.getAssignments());
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    dataManager.saveAssignments(updated);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Assignment Vault & Deadlines</span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            Track coursework, problem sets, term reports, and Moodle/Google Classroom submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs text-campus-text-primary focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs text-campus-text-primary focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Add Assignment
          </Button>
        </div>
      </div>

      {/* Assignment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((asg) => {
          const subject = subjects.find((s) => s.id === asg.subjectId);
          const isSubmitted = asg.status === 'submitted';
          const isUrgent = asg.priority === 'urgent';
          const isHigh = asg.priority === 'high';

          return (
            <Card
              key={asg.id}
              className={`p-5 flex flex-col justify-between border-l-4 transition-all ${
                isSubmitted
                  ? 'border-l-campus-success'
                  : isUrgent
                  ? 'border-l-campus-danger'
                  : isHigh
                  ? 'border-l-amber-500'
                  : 'border-l-campus-primary'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-campus-primary-light">
                    {subject?.name || 'Engineering Course'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {asg.priority === 'urgent' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-danger/15 text-red-400 font-bold uppercase">
                        Urgent
                      </span>
                    )}
                    {asg.priority === 'high' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold uppercase">
                        High
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSubmitted
                          ? 'bg-campus-success/15 text-emerald-400'
                          : asg.status === 'in_progress'
                          ? 'bg-campus-primary/15 text-campus-primary-light'
                          : 'bg-campus-bg-tertiary text-campus-text-muted'
                      }`}
                    >
                      {asg.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-white mb-1">{asg.title}</h4>
                <p className="text-xs text-campus-text-muted leading-relaxed line-clamp-2">
                  {asg.description}
                </p>

                <div className="mt-3 flex items-center gap-4 text-[11px] text-campus-text-secondary">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-campus-accent-light" />
                    Due: {asg.dueDate}
                  </span>
                  {asg.submissionLink && (
                    <a
                      href={asg.submissionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-campus-primary-light hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Link
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-campus-border/50">
                <Button
                  size="sm"
                  variant={isSubmitted ? 'secondary' : 'primary'}
                  onClick={() => handleToggleStatus(asg.id, asg.status)}
                  className="text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {isSubmitted ? 'Reopen' : 'Mark as Submitted'}
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(asg)}
                    className="p-1.5 rounded-lg text-campus-text-muted hover:text-campus-text-primary hover:bg-campus-bg-tertiary"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(asg.id)}
                    className="p-1.5 rounded-lg text-campus-text-muted hover:text-campus-danger hover:bg-campus-danger/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? 'Edit Assignment' : 'Create Coursework Assignment'}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <Select
            label="Subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          />

          <Input
            label="Assignment Title"
            placeholder="e.g. Unit 1 Taylor Series Numerical Set"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Instructions & Description"
            placeholder="e.g. Solve questions 1 to 5 from chapter 2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Submission Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <Select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { value: 'urgent', label: 'Urgent' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              options={[
                { value: 'not_started', label: 'Not Started' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'submitted', label: 'Submitted' },
              ]}
            />
            <Input
              label="Submission Link / URL (Optional)"
              placeholder="https://classroom.google.com/..."
              value={submissionLink}
              onChange={(e) => setSubmissionLink(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-campus-border">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
