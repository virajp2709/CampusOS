import React, { useState } from 'react';
import {
  StickyNote,
  Plus,
  Search,
  Pin,
  Star,
  FileText,
  Tag,
  Folder,
  Download,
  Share2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Card, Button, Input, Select, Modal, Badge } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import type { Note } from '@/types';

export const NotesPage: React.FC = () => {
  const [subjects] = useState(() => dataManager.getSubjects());
  const [notes, setNotes] = useState<Note[]>(() => dataManager.getNotes());
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || 'subj-maths-1');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [folder, setFolder] = useState('General');

  const filtered = notes.filter((n) => {
    if (subjectFilter !== 'all' && n.subjectId !== subjectFilter) return false;
    if (
      searchQuery &&
      !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !n.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleTogglePin = (id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    setNotes(updated);
    dataManager.saveNotes(updated);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
    setNotes(updated);
    dataManager.saveNotes(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    dataManager.saveNotes(updated);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    dataManager.addNote({
      subjectId,
      title,
      content,
      type: 'text',
      tags,
      folder,
      isPinned: false,
      isFavorite: false,
      fileURL: null,
      fileName: null,
      fileSize: null,
      aiSummary: 'Personal notes for FY 2025 pattern exam revision.',
    });

    setNotes(dataManager.getNotes());
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setTagsInput('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-campus-primary-light" />
            <span>Document Vault & Syllabus Notes</span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            Subject-wise theoretical summaries, formulas, lecture scribes, and textbook extracts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-campus-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs text-campus-text-primary placeholder:text-campus-text-muted focus:outline-none focus:border-campus-primary w-52"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-border text-xs text-campus-text-primary focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Create Note
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((note) => {
          const subject = subjects.find((s) => s.id === note.subjectId);
          return (
            <Card key={note.id} className="p-5 flex flex-col justify-between hover:border-campus-primary/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-campus-primary-light">
                    {subject?.name || 'Subject'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      className={`p-1 rounded-md transition-colors ${
                        note.isPinned
                          ? 'text-campus-accent-light'
                          : 'text-campus-text-muted hover:text-campus-text-primary'
                      }`}
                      title={note.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-campus-accent-light' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(note.id)}
                      className={`p-1 rounded-md transition-colors ${
                        note.isFavorite ? 'text-amber-400' : 'text-campus-text-muted hover:text-campus-text-primary'
                      }`}
                      title="Favorite"
                    >
                      <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-white mb-2">{note.title}</h4>

                {note.aiSummary && (
                  <div className="p-2.5 rounded-xl bg-campus-primary/10 border border-campus-primary/20 text-[11px] text-campus-primary-light mb-3 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-campus-accent-light" />
                    <span>{note.aiSummary}</span>
                  </div>
                )}

                <div className="text-xs text-campus-text-muted line-clamp-4 font-mono leading-relaxed bg-campus-bg-secondary/40 p-2.5 rounded-xl border border-campus-border/50">
                  {note.content}
                </div>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-campus-bg-tertiary text-campus-text-secondary"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-campus-border/60">
                <span className="text-[10px] text-campus-text-muted">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1.5 rounded-lg text-campus-text-muted hover:text-campus-danger hover:bg-campus-danger/10"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CREATE NOTE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Academic Note / Syllabus Formula Sheet"
      >
        <form onSubmit={handleSaveNote} className="space-y-4 pt-2">
          <Select
            label="Course / Subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          />

          <Input
            label="Note Title"
            placeholder="e.g. PN Junction Diode V-I Characteristics & Formulas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-campus-text-primary mb-1.5">
              Content (Supports Markdown & Equations)
            </label>
            <textarea
              rows={6}
              placeholder="Write formulas, derivation notes, textbook excerpts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-campus-bg-secondary border border-campus-border rounded-xl px-3 py-2 text-xs text-campus-text-primary placeholder:text-campus-text-muted focus:outline-none focus:border-campus-primary font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Folder"
              placeholder="e.g. Electronics"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            />
            <Input
              label="Tags (Comma separated)"
              placeholder="Diodes, Unit1, Revision"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-campus-border">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
