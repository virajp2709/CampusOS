import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Award,
  Clock,
  Layers,
  BookMarked,
  User,
  Trash2,
  Edit,
  ExternalLink,
} from 'lucide-react';
import { Card, Button, Input, Select, Modal, Badge, ProgressBar } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import type { Subject, SyllabusUnit } from '@/types';

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => dataManager.getSubjects());
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'subj-maths-1');
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState(3);
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('First Year AI & DS');
  const [thHours, setThHours] = useState(2);
  const [prHours, setPrHours] = useState(2);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const filteredSubjects = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleUnit = (unitNo: number) => {
    if (!selectedSubject) return;
    const updatedUnits = selectedSubject.syllabusUnits.map((u) =>
      u.unitNo === unitNo ? { ...u, completed: !u.completed } : u
    );

    const updatedSubjects = subjects.map((s) =>
      s.id === selectedSubject.id ? { ...s, syllabusUnits: updatedUnits, updatedAt: new Date() } : s
    );

    setSubjects(updatedSubjects);
    dataManager.saveSubjects(updatedSubjects);
  };

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
    setCredits(3);
    setFaculty('');
    setDepartment('First Year AI & DS');
    setThHours(2);
    setPrHours(2);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subj: Subject) => {
    setEditingSubject(subj);
    setName(subj.name);
    setCode(subj.code);
    setCredits(subj.credits);
    setFaculty(subj.faculty);
    setDepartment(subj.department);
    setThHours(subj.theoryHoursPerWeek);
    setPrHours(subj.practicalHoursPerWeek);
    setIsModalOpen(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      const updated = subjects.map((s) =>
        s.id === editingSubject.id
          ? {
              ...s,
              name,
              code,
              credits: Number(credits),
              faculty,
              department,
              theoryHoursPerWeek: Number(thHours),
              practicalHoursPerWeek: Number(prHours),
              updatedAt: new Date(),
            }
          : s
      );
      setSubjects(updated);
      dataManager.saveSubjects(updated);
    } else {
      const newSubj: Subject = {
        id: `subj-${Date.now()}`,
        name,
        code,
        type: 'theory',
        credits: Number(credits),
        semester: 1,
        faculty,
        department,
        theoryHoursPerWeek: Number(thHours),
        practicalHoursPerWeek: Number(prHours),
        tutorialHoursPerWeek: 0,
        examScheme: {
          caa: 10,
          ise: 30,
          ese: 60,
          tw: 30,
          pr: 0,
          or: 0,
          total: 100,
        },
        syllabusUnits: [
          { unitNo: 1, title: 'Introduction & Foundations', hours: 6, topics: ['Basics', 'Fundamentals'], completed: false },
          { unitNo: 2, title: 'Core Theoretical Concepts', hours: 6, topics: ['Theory', 'Analysis'], completed: false },
        ],
        textbooks: [],
        referenceBooks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updated = [...subjects, newSubj];
      setSubjects(updated);
      dataManager.saveSubjects(updated);
      setSelectedSubjectId(newSubj.id);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSubject = (id: string) => {
    if (
      !confirm(
        'Warning: Deleting a subject will archive it from your active list. Academic history will be retained safely.'
      )
    )
      return;
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    dataManager.saveSubjects(updated);
    if (selectedSubjectId === id) {
      setSelectedSubjectId(updated[0]?.id || '');
    }
  };

  // Syllabus completion metrics for selected subject
  const completedUnits = selectedSubject?.syllabusUnits.filter((u) => u.completed).length || 0;
  const totalUnits = selectedSubject?.syllabusUnits.length || 0;
  const syllabusProgress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-campus-primary-light" />
            <span>Courses & Curriculum (2025 Pattern)</span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            FY B.Tech Artificial Intelligence and Data Science • Semester I & II Curriculum
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-campus-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subjects or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs text-campus-text-primary placeholder:text-campus-text-muted focus:outline-none focus:border-campus-primary w-56"
            />
          </div>

          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-1" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Main Grid: Subject List on Left, Syllabus Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subjects List */}
        <div className="lg:col-span-4 space-y-3">
          {filteredSubjects.map((s) => {
            const isSelected = s.id === selectedSubjectId;
            const completed = s.syllabusUnits.filter((u) => u.completed).length;
            const total = s.syllabusUnits.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedSubjectId(s.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-campus-bg-card border-campus-primary shadow-glow'
                    : 'bg-campus-bg-secondary/60 border-campus-border hover:border-campus-border-light'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-campus-primary-light">{s.code}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-bg-tertiary text-campus-text-secondary font-semibold">
                    {s.credits} Credits
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{s.name}</h4>
                <p className="text-[11px] text-campus-text-muted mt-1 truncate">{s.faculty}</p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-campus-text-secondary">
                  <span>Syllabus: {completed}/{total} Units</span>
                  <span className="font-bold text-campus-accent-light">{pct}%</span>
                </div>
                <div className="mt-1">
                  <ProgressBar value={pct} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Syllabus Details */}
        {selectedSubject && (
          <div className="lg:col-span-8 space-y-5">
            {/* Subject Overview Card */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-campus-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-campus-primary-light px-2 py-0.5 rounded bg-campus-primary/10">
                      {selectedSubject.code}
                    </span>
                    <span className="text-xs text-campus-text-muted">Semester {selectedSubject.semester}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {selectedSubject.credits} Credits
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedSubject.name}</h3>
                  <p className="text-xs text-campus-text-muted mt-0.5">
                    Faculty: <strong>{selectedSubject.faculty}</strong> • Department: {selectedSubject.department}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(selectedSubject)}>
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-campus-danger hover:bg-campus-danger/10"
                    onClick={() => handleDeleteSubject(selectedSubject.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Teaching and Exam Scheme Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 border-b border-campus-border text-center text-xs">
                <div className="p-2.5 rounded-xl bg-campus-bg-secondary">
                  <span className="text-campus-text-muted block text-[10px]">Teaching Scheme</span>
                  <span className="font-bold text-white">
                    {selectedSubject.theoryHoursPerWeek}h TH • {selectedSubject.practicalHoursPerWeek}h PR
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-campus-bg-secondary">
                  <span className="text-campus-text-muted block text-[10px]">In-Sem Exam (ISE)</span>
                  <span className="font-bold text-campus-accent-light">{selectedSubject.examScheme.ise} Marks</span>
                </div>
                <div className="p-2.5 rounded-xl bg-campus-bg-secondary">
                  <span className="text-campus-text-muted block text-[10px]">End-Sem Exam (ESE)</span>
                  <span className="font-bold text-campus-primary-light">{selectedSubject.examScheme.ese} Marks</span>
                </div>
                <div className="p-2.5 rounded-xl bg-campus-bg-secondary">
                  <span className="text-campus-text-muted block text-[10px]">Term Work (TW)</span>
                  <span className="font-bold text-emerald-400">{selectedSubject.examScheme.tw} Marks</span>
                </div>
              </div>

              {/* Syllabus Progress */}
              <div className="pt-4 flex items-center justify-between text-xs">
                <span className="font-bold text-campus-text-primary">
                  Syllabus Coverage: {completedUnits} of {totalUnits} Units Completed ({syllabusProgress}%)
                </span>
              </div>
            </Card>

            {/* Units Checklist */}
            <Card className="p-6">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-campus-primary-light" />
                Unit-Wise Syllabus Checklist & Topics
              </h4>

              <div className="space-y-3">
                {selectedSubject.syllabusUnits.map((unit) => (
                  <div
                    key={unit.unitNo}
                    onClick={() => handleToggleUnit(unit.unitNo)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      unit.completed
                        ? 'bg-campus-success/5 border-campus-success/30'
                        : 'bg-campus-bg-secondary border-campus-border hover:border-campus-border-light'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          className="mt-0.5 text-campus-primary-light"
                        >
                          {unit.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-5 h-5 text-campus-text-muted" />
                          )}
                        </button>

                        <div>
                          <h5
                            className={`font-bold text-sm ${
                              unit.completed ? 'text-emerald-300 line-through' : 'text-white'
                            }`}
                          >
                            Unit {unit.unitNo}: {unit.title}
                          </h5>
                          <span className="text-[10px] font-mono text-campus-text-muted">
                            Allocated Teaching Duration: {unit.hours} Hours
                          </span>

                          <ul className="mt-2 space-y-1 text-xs text-campus-text-secondary list-disc list-inside">
                            {unit.topics.map((t, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Textbooks & References from PDF */}
            {(selectedSubject.textbooks.length > 0 || selectedSubject.referenceBooks.length > 0) && (
              <Card className="p-6">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-campus-accent-light" />
                  Prescribed Textbooks & References (VPKBIET Syllabus)
                </h4>

                <div className="space-y-3 text-xs text-campus-text-secondary">
                  {selectedSubject.textbooks.length > 0 && (
                    <div>
                      <span className="font-semibold text-white block mb-1">Standard Textbooks:</span>
                      <ul className="list-decimal list-inside space-y-1 text-campus-text-muted">
                        {selectedSubject.textbooks.map((tb, idx) => (
                          <li key={idx}>{tb}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedSubject.referenceBooks.length > 0 && (
                    <div className="pt-2 border-t border-campus-border/50">
                      <span className="font-semibold text-white block mb-1">Reference Books:</span>
                      <ul className="list-decimal list-inside space-y-1 text-campus-text-muted">
                        {selectedSubject.referenceBooks.map((rb, idx) => (
                          <li key={idx}>{rb}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* ADD/EDIT COURSE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Course Details' : 'Add New Course'}
      >
        <form onSubmit={handleSaveSubject} className="space-y-4 pt-2">
          <Input
            label="Course Name"
            placeholder="e.g. Engineering Mathematics-I"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Course Code"
              placeholder="e.g. BS25101"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Input
              label="Credits"
              type="number"
              min="1"
              max="6"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Professor / Faculty"
              placeholder="e.g. Dr. S. B. Patil"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              required
            />
            <Input
              label="Department"
              placeholder="e.g. AIDS"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Theory Hours / Week"
              type="number"
              value={thHours}
              onChange={(e) => setThHours(Number(e.target.value))}
            />
            <Input
              label="Practical Hours / Week"
              type="number"
              value={prHours}
              onChange={(e) => setPrHours(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-campus-border">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
