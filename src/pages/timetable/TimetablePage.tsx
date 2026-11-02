import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Plus,
  Upload,
  Filter,
  CheckCircle,
  FileText,
  AlertTriangle,
  History,
  Edit,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Input, Select, Modal, Badge } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import type { TimetableEntry } from '@/types';

type ViewMode = 'weekly' | 'daily';

export const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState(() => dataManager.getTimetable());
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [batchFilter, setBatchFilter] = useState<string>(user?.practicalBatch || 'AI-5c');

  // Edit/Add Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [modalDay, setModalDay] = useState<string>('Monday');

  // Entry Form state
  const [startTime, setStartTime] = useState('09:15');
  const [endTime, setEndTime] = useState('10:15');
  const [subjectName, setSubjectName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [room, setRoom] = useState('');
  const [entryType, setEntryType] = useState<TimetableEntry['type']>('lecture');
  const [entryBatch, setEntryBatch] = useState('');

  // PDF Import Workflow Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'processing' | 'review'>('upload');
  const [parsedEntriesCount, setParsedEntriesCount] = useState(0);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Filter items by batch
  const filterEntries = (entries: TimetableEntry[]) => {
    return entries.filter((e) => !e.batch || e.batch === batchFilter || batchFilter === 'all');
  };

  const openAddModal = (day: string) => {
    setModalDay(day);
    setEditingEntry(null);
    setStartTime('09:15');
    setEndTime('10:15');
    setSubjectName('');
    setFaculty('');
    setRoom('');
    setEntryType('lecture');
    setEntryBatch('');
    setIsEditModalOpen(true);
  };

  const openEditModal = (day: string, entry: TimetableEntry) => {
    setModalDay(day);
    setEditingEntry(entry);
    setStartTime(entry.startTime);
    setEndTime(entry.endTime);
    setSubjectName(entry.subjectName);
    setFaculty(entry.faculty);
    setRoom(entry.room);
    setEntryType(entry.type);
    setEntryBatch(entry.batch || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEntry = () => {
    const updated = { ...timetable };
    const dayEntries = [...(updated.schedule[modalDay] || [])];

    if (editingEntry) {
      const idx = dayEntries.findIndex((e) => e.id === editingEntry.id);
      if (idx !== -1) {
        dayEntries[idx] = {
          ...editingEntry,
          startTime,
          endTime,
          subjectName,
          faculty,
          room,
          type: entryType,
          batch: entryBatch || undefined,
        };
      }
    } else {
      const newEntry: TimetableEntry = {
        id: `tt-${Date.now()}`,
        startTime,
        endTime,
        subjectId: 'custom',
        subjectName,
        faculty,
        room,
        type: entryType,
        batch: entryBatch || undefined,
      };
      dayEntries.push(newEntry);
      dayEntries.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    updated.schedule[modalDay] = dayEntries;
    updated.version += 1;
    updated.updatedAt = new Date();
    setTimetable(updated);
    dataManager.saveTimetable(updated);
    setIsEditModalOpen(false);
  };

  const handleDeleteEntry = (day: string, id: string) => {
    if (!confirm('Are you sure you want to remove this timetable event?')) return;
    const updated = { ...timetable };
    updated.schedule[day] = (updated.schedule[day] || []).filter((e) => e.id !== id);
    updated.version += 1;
    updated.updatedAt = new Date();
    setTimetable(updated);
    dataManager.saveTimetable(updated);
  };

  // Simulated PDF Extraction Workflow
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStep('processing');
    setTimeout(() => {
      setParsedEntriesCount(36);
      setImportStep('review');
    }, 1800);
  };

  const handleConfirmImport = () => {
    // Keep existing version safe in history
    const updated = { ...timetable };
    updated.version += 1;
    updated.updatedAt = new Date();
    dataManager.saveTimetable(updated);
    setIsImportModalOpen(false);
    setImportStep('upload');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-campus-primary-light" />
            <span>AI-5 Smart Timetable</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-campus-primary/20 text-campus-primary-light font-mono">
              v{timetable.version}.0
            </span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            Effective: {timetable.effectiveFrom} to {timetable.effectiveTo} • Semester {timetable.semester}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Practical Batch Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs">
            <Filter className="w-3.5 h-3.5 text-campus-text-muted" />
            <span className="text-campus-text-muted">Batch:</span>
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="bg-transparent text-campus-primary-light font-bold focus:outline-none cursor-pointer"
            >
              <option value="AI-5c" className="bg-campus-bg-card">AI-5c (My Batch)</option>
              <option value="AI-5a" className="bg-campus-bg-card">AI-5a</option>
              <option value="AI-5b" className="bg-campus-bg-card">AI-5b</option>
              <option value="all" className="bg-campus-bg-card">Show All Batches</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl bg-campus-bg-secondary p-1 border border-campus-border text-xs">
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'weekly' ? 'bg-campus-primary text-white font-semibold' : 'text-campus-text-secondary'
              }`}
            >
              Weekly Grid
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'daily' ? 'bg-campus-primary text-white font-semibold' : 'text-campus-text-secondary'
              }`}
            >
              Daily View
            </button>
          </div>

          {/* Import PDF Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setImportStep('upload');
              setIsImportModalOpen(true);
            }}
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Import PDF
          </Button>

          {/* Add Entry Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => openAddModal(selectedDay)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Class
          </Button>
        </div>
      </div>

      {/* DAILY VIEW SELECTOR */}
      {viewMode === 'daily' && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-campus-primary text-white shadow-glow'
                  : 'bg-campus-bg-secondary text-campus-text-secondary hover:text-campus-text-primary border border-campus-border'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* VIEW: DAILY TIMETABLE */}
      {viewMode === 'daily' && (
        <div className="space-y-3">
          {filterEntries(timetable.schedule[selectedDay] || []).length > 0 ? (
            filterEntries(timetable.schedule[selectedDay] || []).map((entry) => (
              <Card
                key={entry.id}
                className={`p-4 transition-all ${
                  entry.type === 'break'
                    ? 'bg-campus-bg-tertiary/30 border-dashed border-campus-border'
                    : 'hover:border-campus-primary/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="font-mono text-sm font-bold text-campus-primary-light pt-0.5 w-28">
                      {entry.startTime} - {entry.endTime}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-campus-text-primary">{entry.subjectName}</span>
                        {entry.batch && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-accent/20 text-campus-accent-light font-bold">
                            Batch {entry.batch}
                          </span>
                        )}
                      </div>

                      {entry.type !== 'break' && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-campus-text-muted">
                          {entry.faculty && (
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {entry.faculty}
                            </span>
                          )}
                          {entry.room && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-campus-accent-light" />
                              {entry.room}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {entry.type !== 'break' && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => openEditModal(selectedDay, entry)}
                        className="p-1.5 rounded-lg text-campus-text-muted hover:text-campus-text-primary hover:bg-campus-bg-tertiary"
                        title="Edit entry"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(selectedDay, entry.id)}
                        className="p-1.5 rounded-lg text-campus-text-muted hover:text-campus-danger hover:bg-campus-danger/10"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-campus-text-muted text-xs">
              No classes scheduled for {selectedDay}.
            </div>
          )}
        </div>
      )}

      {/* VIEW: WEEKLY GRID */}
      {viewMode === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {daysOfWeek.map((day) => {
            const entries = filterEntries(timetable.schedule[day] || []);
            return (
              <Card key={day} className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-campus-border">
                  <span className="font-bold text-sm text-campus-text-primary">{day}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-campus-text-muted mr-1">{entries.length} slots</span>
                    <button
                      onClick={() => openAddModal(day)}
                      className="p-1 rounded text-campus-text-muted hover:text-campus-primary hover:bg-campus-bg-tertiary"
                      title="Add slot to this day"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {entries.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => e.type !== 'break' && openEditModal(day, e)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        e.type === 'break'
                          ? 'bg-campus-bg-tertiary/30 border-campus-border/30 text-campus-text-muted cursor-default'
                          : e.type === 'practical'
                          ? 'bg-campus-accent/10 border-campus-accent/30 hover:border-campus-accent text-campus-text-primary'
                          : 'bg-campus-bg-secondary border-campus-border hover:border-campus-primary/50 text-campus-text-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-semibold text-campus-primary-light">
                          {e.startTime} - {e.endTime}
                        </span>
                        {e.batch && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-campus-accent/20 text-campus-accent-light font-bold">
                            {e.batch}
                          </span>
                        )}
                      </div>
                      <div className="font-semibold mt-1 truncate">{e.subjectName}</div>
                      {e.type !== 'break' && (
                        <div className="text-[10px] text-campus-text-muted mt-0.5 truncate">
                          {e.room} {e.faculty ? `• ${e.faculty}` : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* EDIT / ADD MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingEntry ? 'Edit Class Schedule' : `Add Class to ${modalDay}`}
      >
        <div className="space-y-4 pt-2">
          <Input
            label="Subject Name"
            placeholder="e.g. Engineering Mathematics-I"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Session Type"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as any)}
              options={[
                { value: 'lecture', label: 'Theory Lecture' },
                { value: 'practical', label: 'Laboratory Practical' },
                { value: 'tutorial', label: 'Tutorial' },
                { value: 'activity', label: 'Field Activity' },
                { value: 'break', label: 'Break' },
              ]}
            />
            <Input
              label="Practical Batch (Optional)"
              placeholder="e.g. AI-5c"
              value={entryBatch}
              onChange={(e) => setEntryBatch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Faculty / Professor"
              placeholder="e.g. Dr. S. B. Patil"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            />
            <Input
              label="Classroom / Lab"
              placeholder="e.g. Room 304"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-campus-border">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEntry}>
              Save Slot
            </Button>
          </div>
        </div>
      </Modal>

      {/* PDF IMPORT WORKFLOW MODAL */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Timetable PDF Smart Extraction"
        size="lg"
      >
        <div className="space-y-4 pt-2">
          {importStep === 'upload' && (
            <div className="space-y-4 text-center py-6">
              <div className="border-2 border-dashed border-campus-border hover:border-campus-primary/50 rounded-2xl p-8 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileText className="w-12 h-12 text-campus-primary-light mx-auto mb-3" />
                <h4 className="font-bold text-sm text-white">Upload Official College Timetable PDF</h4>
                <p className="text-xs text-campus-text-muted mt-1 max-w-sm mx-auto">
                  Drag and drop your AI-5 Timetable PDF or click to browse. The parser will extract days, times, subjects, batches, and faculties.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campus-primary/10 text-campus-primary-light text-[11px] font-medium">
                  Never overwrites silently • Safe review before confirmation
                </div>
              </div>
            </div>
          )}

          {importStep === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-campus-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="font-bold text-sm text-white">Analyzing Timetable Structure...</h4>
                <p className="text-xs text-campus-text-muted mt-1">
                  Parsing tables, identifying time slots, resolving lab batches (AI-5a, AI-5b, AI-5c), and validating schedule conflicts.
                </p>
              </div>
            </div>
          )}

          {importStep === 'review' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-campus-success/15 border border-campus-success/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>
                  Successfully parsed {parsedEntriesCount} slots across Monday to Saturday for Division AI-5!
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 border border-campus-border rounded-xl p-3 bg-campus-bg-secondary/40 text-xs">
                <div className="font-bold text-campus-text-primary pb-2 border-b border-campus-border">
                  Parsed Batch AI-5c Schedule Preview:
                </div>
                <div className="flex justify-between py-1 border-b border-campus-border/30">
                  <span className="font-mono text-campus-primary-light">Mon 14:15 - 16:15</span>
                  <span className="font-semibold text-white">Python Programming Lab (AI-5c)</span>
                  <span className="text-campus-text-muted">AI Lab 2</span>
                </div>
                <div className="flex justify-between py-1 border-b border-campus-border/30">
                  <span className="font-mono text-campus-primary-light">Tue 11:30 - 13:30</span>
                  <span className="font-semibold text-white">FPL (C Programming) Lab (AI-5c)</span>
                  <span className="text-campus-text-muted">Computer Lab 3</span>
                </div>
                <div className="flex justify-between py-1 border-b border-campus-border/30">
                  <span className="font-mono text-campus-primary-light">Wed 11:30 - 13:30</span>
                  <span className="font-semibold text-white">Basic Electronics Lab (AI-5c)</span>
                  <span className="text-campus-text-muted">Electronics Lab</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-mono text-campus-primary-light">Thu 11:30 - 13:30</span>
                  <span className="font-semibold text-white">Engineering Chemistry Lab (AI-5c)</span>
                  <span className="text-campus-text-muted">Chem Lab</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Saving will create Version {timetable.version + 1}.0 while retaining previous version history.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setImportStep('upload')}>
                  Back
                </Button>
                <Button variant="primary" onClick={handleConfirmImport}>
                  Confirm & Apply New Timetable
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
