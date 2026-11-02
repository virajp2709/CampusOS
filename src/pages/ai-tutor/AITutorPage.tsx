import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Code2,
  CheckCircle,
  HelpCircle,
  Cpu,
  Brain,
  Lightbulb,
  FileQuestion,
} from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '@/components/ui';
import { dataManager } from '@/services/data-manager';

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  topic?: string;
  codeSnippet?: string;
}

export const AITutorPage: React.FC = () => {
  const [subjects] = useState(() => dataManager.getSubjects());
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'subj-maths-1');
  const [tutorMode, setTutorMode] = useState<'concept' | 'numerical' | 'code' | 'quiz'>('concept');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'tutor',
      text: `Hello Viraj! I am your AI Engineering Tutor, specifically calibrated to Vidya Pratishthan's KBIET and SPPU FY B.Tech AI & Data Science (2025 Pattern).

I am currently set to **${selectedSubject?.name} (${selectedSubject?.code})**.
Ask me to:
- Explain difficult syllabus concepts (e.g. Dirichlet's Conditions, EDTA Hardness, CE amplifier DC load line)
- Solve numericals step-by-step
- Debug or review Python and C code from your lab syllabus
- Generate university-style practice questions and MCQs`,
      timestamp: 'Just now',
    },
  ]);

  const QUICK_QUESTIONS: Record<string, string[]> = {
    'subj-maths-1': [
      "Explain Dirichlet's conditions for Fourier series expansion",
      'How to find the rank of a matrix using Echelon form?',
      'Verify Cayley-Hamilton theorem and find A^-1',
      "Evaluate indeterminate form 0/0 using L'Hospital rule",
    ],
    'subj-chem': [
      'Explain the EDTA titration method to determine total hardness of water',
      "State Pilling-Bedworth's rule with examples of protective oxide films",
      'What are the advantages of Biodiesel over conventional diesel?',
      'Explain the construction and working of Li-ion battery',
    ],
    'subj-bee': [
      'Derive the ripple factor and efficiency for a Bridge Rectifier',
      'Explain the input and output characteristics of BJT in CE configuration',
      'Implement a Full Adder using two Half Adders and an OR gate',
      'Explain the functional block diagram of an Operational Amplifier',
    ],
    'subj-fpl': [
      'Explain the difference between Call by Value and Call by Reference in C',
      'How to multiply two 3x3 matrices using 2D arrays?',
      'Explain array of structures with an example program',
      'Write a C program to check prime numbers with optimal time complexity',
    ],
    'subj-python': [
      'Write a Python program to check whether a number is Armstrong or not',
      'Difference between list and tuple with time complexity analysis',
      'How to validate password strength using regular expressions in Python?',
      'Explain recursive Fibonacci vs iterative loop Fibonacci',
    ],
  };

  const handleSend = (textToSend?: string) => {
    const question = textToSend || query;
    if (!question.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    // Context-aware tutor response generation based on syllabus grounding
    setTimeout(() => {
      let reply = '';

      if (question.toLowerCase().includes('edta') || question.toLowerCase().includes('hardness')) {
        reply = `### EDTA Titration Method for Water Hardness (BS25104)

**Principle:**
Ethylene Diamine Tetra-acetic Acid (EDTA) forms stable hexadentate complexes with $Ca^{2+}$ and $Mg^{2+}$ ions at $\\text{pH} = 10$.

1. **Indicator Used:** Eriochrome Black T (EBT).
2. **Buffer:** $\\text{NH}_4\\text{OH} + \\text{NH}_4\\text{Cl}$ buffer to maintain $\\text{pH} = 10$.
3. **Color Transition:**
   - Uncomplexed EBT indicator in alkaline solution is **Blue**.
   - With $Ca^{2+}/Mg^{2+}$ ions, it forms an unstable **Wine-Red** complex $[M\\text{-EBT}]$.
   - When titrated against EDTA, EDTA displaces EBT because the $[M\\text{-EDTA}]$ complex is far more stable:
   $$[M\\text{-EBT}]\\text{ (Wine-red)} + \\text{EDTA} \\longrightarrow [M\\text{-EDTA}]\\text{ (Colorless)} + \\text{EBT}\\text{ (Steel Blue)}$$

**Formulas for Numericals:**
- $\\text{Total Hardness (ppm of } \\text{CaCO}_3) = \\frac{V_{\\text{EDTA}} \\times M \\times 1000}{\\text{Volume of Sample (mL)}}$`;
      } else if (question.toLowerCase().includes('fourier') || question.toLowerCase().includes('dirichlet')) {
        reply = `### Dirichlet's Conditions for Fourier Series (BS25101)

A function $f(x)$ defined in the interval $(c, c + 2L)$ can be expanded in a convergent Fourier series if it satisfies **Dirichlet's Conditions**:

1. **Single-valued & Bounded:** $f(x)$ must be single-valued and bounded in $(c, c + 2L)$. That is, $|f(x)| < M$ for all $x$.
2. **Piecewise Continuous:** $f(x)$ has at most a finite number of finite discontinuities in any one period.
3. **Finite Extrema:** $f(x)$ has at most a finite number of local maxima and local minima in the interval.

**Harmonic Representation:**
$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty \\left[a_n \\cos\\left(\\frac{n\\pi x}{L}\\right) + b_n \\sin\\left(\\frac{n\\pi x}{L}\\right)\\right]$$`;
      } else if (question.toLowerCase().includes('rectifier') || question.toLowerCase().includes('bridge')) {
        reply = `### Bridge Rectifier Analysis (ET25101)

A bridge rectifier uses 4 diodes in a bridge configuration across an AC secondary winding:

1. **Efficiency ($\\eta$):**
   $$\\eta = \\frac{P_{dc}}{P_{ac}} = \\frac{8}{\\pi^2} \\times \\frac{R_L}{2r_d + R_L} \\approx 81.2\\% \\text{ (Maximum theoretical)}$$
2. **Ripple Factor ($\\gamma$):**
   $$\\gamma = \\sqrt{\\left(\\frac{I_{rms}}{I_{dc}}\\right)^2 - 1} = \\sqrt{\\left(\\frac{\\pi}{2\\sqrt{2}}\\right)^2 - 1} \\approx 0.482$$
3. **Peak Inverse Voltage (PIV):**
   $$\\text{PIV} = V_m$$
   *(Crucial advantage over center-tapped full-wave rectifier which requires $\\text{PIV} = 2V_m$)*`;
      } else if (question.toLowerCase().includes('armstrong') || question.toLowerCase().includes('python')) {
        reply = `### Python Program: Armstrong Number Verification (CO25102)

An Armstrong number of 3 digits is an integer such that the sum of the cubes of its digits equals the number itself (e.g. $371 = 3^3 + 7^3 + 1^3 = 27 + 343 + 1 = 371$).

\`\`\`python
def is_armstrong(num: int) -> bool:
    digits = [int(d) for d in str(num)]
    power = len(digits)
    return sum(d ** power for d in digits) == num

# Test cases from FY-AIDS lab journal
test_numbers = [153, 370, 371, 407, 123]
for n in test_numbers:
    print(f"{n} -> {'Armstrong Number' if is_armstrong(n) else 'Not Armstrong'}")
\`\`\`

**Time Complexity:** $O(\\log_{10} N)$ where $N$ is the input magnitude. Space complexity is $O(\\log_{10} N)$ for the digit array.`;
      } else {
        reply = `### Subject Analysis: ${selectedSubject?.name} (${selectedSubject?.code})

Regarding your question: **"${question}"**

1. **Core Concept Overview:**
   This topic directly maps to Unit ${selectedSubject?.syllabusUnits[0]?.unitNo || 1} of your VPKBIET 2025 Course Pattern.
2. **Engineering Implication:**
   Understanding this is critical for both the 30-mark In-Semester Examination (ISE) and Term Work (TW) continuous evaluation.
3. **Key Mathematical / Algorithmic Foundation:**
   Ensure you document the boundary conditions and step-by-step logic in your class notes.

*Tip: You can ask me to write a complete numerical solution or provide an MCQ set on this exact unit!*`;
      }

      const tutorMsg: ChatMessage = {
        id: `tut-${Date.now()}`,
        sender: 'tutor',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <Bot className="w-5 h-5 text-campus-accent-light" />
            <span>AI Engineering Tutor (Grounded in VPKBIET Pattern)</span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            Subject-specific problem solver, derivation walkthroughs, coding assistant, and exam practice.
          </p>
        </div>

        {/* Course Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-campus-text-muted">Subject:</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
            }}
            className="px-3 py-1.5 rounded-xl bg-campus-bg-secondary border border-campus-primary/50 text-xs font-semibold text-campus-primary-light focus:outline-none"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id} className="bg-campus-bg-card">
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Topic Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-campus-text-muted uppercase tracking-wider">
          Suggested Syllabus Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {(QUICK_QUESTIONS[selectedSubjectId] || QUICK_QUESTIONS['subj-maths-1']).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-campus-bg-secondary hover:bg-campus-bg-hover border border-campus-border hover:border-campus-primary/40 text-campus-text-secondary hover:text-white transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversation Stream */}
      <Card className="p-4 md:p-6 min-h-[460px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((m) => {
            const isTutor = m.sender === 'tutor';
            return (
              <div key={m.id} className={`flex items-start gap-3 ${isTutor ? '' : 'flex-row-reverse'}`}>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isTutor
                      ? 'bg-gradient-to-tr from-campus-primary to-campus-accent text-white shadow-glow'
                      : 'bg-campus-bg-tertiary text-campus-text-primary border border-campus-border'
                  }`}
                >
                  {isTutor ? 'AI' : 'You'}
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    isTutor
                      ? 'bg-campus-bg-secondary border border-campus-border text-campus-text-primary'
                      : 'bg-campus-primary text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{m.text}</div>
                  <div
                    className={`text-[9px] mt-2 ${
                      isTutor ? 'text-campus-text-muted' : 'text-campus-primary-light'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-campus-primary/20 text-campus-primary-light flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-campus-bg-secondary text-xs text-campus-text-muted">
                Consulting {selectedSubject?.code} syllabus units and formulating step-by-step guidance...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-3 border-t border-campus-border flex items-center gap-2">
          <Input
            placeholder={`Ask a question about ${selectedSubject?.name}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            className="flex-1"
          />
          <Button
            variant="primary"
            onClick={() => handleSend()}
            disabled={loading || !query.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
