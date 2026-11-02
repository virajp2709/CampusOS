import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  FileQuestion,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Card, Button, Input, Select, Modal, ProgressBar } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import type { Exam } from '@/types';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const SAMPLE_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Which of the following is Dirichlet's condition for Fourier series expansion?",
    options: [
      'Function must be infinite and continuously diverging',
      'Function must be periodic, single-valued and bounded',
      'Function must only have negative values',
      'Function must have an infinite number of discontinuities',
    ],
    correct: 1,
    explanation:
      "Dirichlet's condition requires the function to be periodic, single-valued, bounded, with a finite number of finite discontinuities.",
  },
  {
    id: 2,
    question: 'In EDTA titration for water hardness, which indicator is used at pH = 10?',
    options: ['Phenolphthalein', 'Methyl Orange', 'Eriochrome Black T (EBT)', 'Thymol Blue'],
    correct: 2,
    explanation: 'EBT is used in ammonia buffer (pH=10) and transitions from wine-red to steel blue at the endpoint.',
  },
  {
    id: 3,
    question: 'What is the theoretical maximum rectification efficiency of a bridge rectifier?',
    options: ['40.6%', '50.0%', '81.2%', '100%'],
    correct: 2,
    explanation: 'Both full-wave center-tapped and bridge rectifiers have a theoretical maximum efficiency of 81.2%.',
  },
  {
    id: 4,
    question: 'In C programming, what is the default parameter passing mechanism for primitive variables?',
    options: ['Call by Reference', 'Call by Value', 'Call by Name', 'Call by Pointer'],
    correct: 1,
    explanation: 'In C, all arguments to functions are passed by value unless explicitly passed via pointers.',
  },
];

export const ExamsPage: React.FC = () => {
  const [subjects] = useState(() => dataManager.getSubjects());
  const [exams, setExams] = useState<Exam[]>(() => dataManager.getExams());

  // Interactive Quiz State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleStartQuiz = () => {
    setIsQuizActive(true);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setScore(0);
  };

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQIndex]: optIdx }));
  };

  const handleNextQ = () => {
    if (currentQIndex < SAMPLE_QUIZ.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Calculate score
      let sc = 0;
      SAMPLE_QUIZ.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) sc += 1;
      });
      setScore(sc);
      setQuizFinished(true);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-campus-accent-light" />
            <span>Examination Centre & Mock Practice</span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            In-Semester Examinations (ISE: 30 Marks), End-Semester (ESE: 60 Marks), and Question Bank.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleStartQuiz}>
          <Play className="w-3.5 h-3.5 mr-1.5" />
          Start Quick Mock Quiz
        </Button>
      </div>

      {/* Examination Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exams.map((ex) => {
          const subject = subjects.find((s) => s.id === ex.subjectId);
          return (
            <Card key={ex.id} className="p-5 border-t-4 border-t-campus-primary space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-campus-primary-light">
                  {subject?.code || 'EXAM'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-campus-primary/20 text-campus-primary-light font-bold">
                  {ex.type} ({ex.maxScore} Marks)
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white">{ex.title}</h4>
                <p className="text-xs text-campus-text-muted mt-0.5">{subject?.name}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-campus-text-secondary pt-2 border-t border-campus-border">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-campus-accent-light" />
                  {ex.date}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-campus-text-muted" />
                  {ex.startTime} ({ex.duration}m)
                </span>
              </div>

              <div className="text-[11px] text-campus-text-muted bg-campus-bg-secondary p-2 rounded-xl">
                <span className="font-semibold text-white block mb-1">Syllabus Scope:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {ex.syllabus.map((syl, i) => (
                    <li key={i}>{syl}</li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      {/* INTERACTIVE MOCK QUIZ SECTION */}
      {isQuizActive && (
        <Card className="p-6 border border-campus-primary/50 shadow-glow animate-slide-up">
          {!quizFinished ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-campus-border">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-campus-accent-light" />
                  SPPU Mock MCQ Practice: Question {currentQIndex + 1} of {SAMPLE_QUIZ.length}
                </span>
                <span className="text-xs font-mono text-campus-primary-light font-bold">
                  Points: 1 Mark Each
                </span>
              </div>

              <h4 className="text-sm font-semibold text-white pt-2">
                {SAMPLE_QUIZ[currentQIndex].question}
              </h4>

              <div className="space-y-2 pt-2">
                {SAMPLE_QUIZ[currentQIndex].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'bg-campus-primary/20 border-campus-primary text-white font-semibold'
                          : 'bg-campus-bg-secondary border-campus-border hover:border-campus-border-light text-campus-text-secondary'
                      }`}
                    >
                      <span className="font-mono mr-2 font-bold text-campus-primary-light">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-campus-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsQuizActive(false)}
                  className="text-xs"
                >
                  Exit Quiz
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNextQ}
                  disabled={selectedAnswers[currentQIndex] === undefined}
                >
                  {currentQIndex === SAMPLE_QUIZ.length - 1 ? 'Finish Assessment' : 'Next Question'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex p-4 rounded-3xl bg-campus-success/15 text-emerald-400">
                <Award className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white">Mock Quiz Completed!</h3>
              <div className="text-3xl font-extrabold text-campus-primary-light">
                {score} / {SAMPLE_QUIZ.length} Marks ({Math.round((score / SAMPLE_QUIZ.length) * 100)}%)
              </div>
              <p className="text-xs text-campus-text-muted max-w-md mx-auto">
                {score >= 3
                  ? 'Strong performance across Calculus, Chemistry, and Electronics fundamentals!'
                  : 'Consider reviewing Unit 1 Dirichlet conditions and Bridge rectifiers in the AI Tutor.'}
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={handleStartQuiz}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Retake Quiz
                </Button>
                <Button variant="primary" size="sm" onClick={() => setIsQuizActive(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* University PYQ & Question Bank Notice */}
      <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Previous Year Question Papers (PYQ Library)
          </h4>
          <p className="text-xs text-campus-text-muted mt-0.5">
            Access previous end-semester exam question papers for Engineering Mathematics-I and Chemistry.
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={() => alert('Opening VPKBIET Autonomous Exam Paper Archive...')}>
          Browse PYQ Papers
        </Button>
      </Card>
    </div>
  );
};
