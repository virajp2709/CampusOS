# CAMPUSOS — Your Intelligent College Companion

> **Tagline:** *Your College. Your Schedule. Your Progress.*

CampusOS is a personal academic operating system and companion designed for engineering students. Built as a unified, production-ready codebase supporting both modern desktop web browsers and Android smartphones via Capacitor.

---

## 🏛️ Default Student Profile & Curriculum

- **College:** Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering and Technology, Baramati (VPKBIET)
- **Course:** B.Tech (Bachelor of Technology)
- **Branch:** Artificial Intelligence and Data Science
- **Division:** AI-5
- **Academic Year:** 2026–2027
- **Semester:** Semester I (with Semester II ready)
- **Roll Number:** 26107337
- **Practical Batch:** AI-5c (also includes AI-5a and AI-5b in database)
- **Pattern:** FY-AIDS 2025 Pattern (Autonomous / SPPU)

### Semester I Courses Included:
1. **BS25101: Engineering Mathematics-I** (Linear Algebra & Calculus) — 4 Credits
2. **BS25104: Engineering Chemistry** — 3 Credits
3. **ET25101: Basic Electronics Engineering** — 3 Credits
4. **ME25101: Engineering Graphics** — 3 Credits
5. **CO25101: Fundamentals of Programming Languages (C)** — 3 Credits
6. **CO25102: Introduction to Python Programming** — 2 Credits
7. **HS25102: Indian Knowledge System** — 2 Credits
8. **HS25104: Physical Education (Exercise & Field Activities)** — 2 Credits

---

## 🚀 Key Modules & Capabilities

1. **Academic Command Dashboard:**
   - Real-time dynamic greeting and time countdown to next lecture
   - **"My College Day" Executive Briefing**:
     * What is my next lecture?
     * What practical do I have today?
     * What work is pending?
     * What should I study next?
   - Attendance health alert widget
   - Today's focus goal & 4-day study streak

2. **Smart Timetable:**
   - Weekly matrix view and daily schedule view
   - Practical batch filtering (defaults to `AI-5c`)
   - Manual class adding, editing, and deletion
   - **PDF Timetable Extraction Workflow**: Drag-and-drop parsing, structured review screen, conflict checking, and versioning.

3. **Attendance Intelligence & Projections:**
   - Subject-wise attendance tracking:
     $$\text{Attendance } \% = \left(\frac{\text{Classes Attended}}{\text{Classes Conducted}}\right) \times 100$$
   - Mathematical formula for classes needed to reach target threshold ($T = 75\%$):
     $$x \ge \frac{\text{total} \times T - 100 \times \text{attended}}{100 - T}$$
   - Maximum allowable future absences calculation under target assumptions
   - **What-If Scenario Simulator**: Test hypothetical future class scenarios before making attendance decisions
   - Interactive Recharts bar visualization with 75% target reference line

4. **Practical & Laboratory Portfolio:**
   - All 5 FY lab courses with experiment checklists from the syllabus PDF
   - Term work marks recording (out of 10) and journal signing status
   - Lab locations and faculty associations

5. **Assignment Vault:**
   - Priority tagging (Urgent, High, Medium, Low)
   - Status tracking (Not Started, In Progress, Submitted)
   - Submission links and due-date tracking

6. **Document & Notes Vault:**
   - Markdown and equation support
   - Tags, folders, pin-to-top, and favorite toggles
   - AI summary badges for quick revision

7. **AI Engineering Tutor:**
   - Grounded in VPKBIET 2025 Pattern syllabus units
   - Step-by-step problem solver for Calculus, Chemistry, Electronics, C, and Python
   - Suggested syllabus questions chips for quick inquiry

8. **Examination Centre:**
   - In-Semester Exam (ISE: 30) and End-Semester Exam (ESE: 60) schedules
   - Interactive SPPU Mock MCQ Practice with real-time scoring and explanations
   - PYQ library reference

9. **Deep Work & Study Planner:**
   - Pomodoro focus interval timer (15, 25, 45, 60 minutes)
   - Subject target association and actual study telemetry logging
   - Study streak and hours counter

10. **Academic Analytics:**
    - Visual distribution of study time and attendance compliance
    - Recharts visualizations

11. **Student Configuration & Privacy:**
    - Fully editable student profile (college, branch, division, roll number, batch)
    - Dark mode first design system with light mode toggle
    - Complete JSON data export for full data portability
    - Strict Firestore per-user security isolation (`users/{uid}/...`)

---

## 🛠️ Technology Stack

| Layer | Tools |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, React Router v6 |
| **Mobile** | Capacitor v6, Capacitor Android, native notifications & splash screen |
| **Backend & Cloud** | Firebase Auth (Google + Email), Cloud Firestore, Firebase Storage |
| **AI Integration** | Gemini API (structured syllabus grounding) |
| **Testing** | Vitest, React Testing Library |

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Run Unit Tests
```bash
npm run test
```

### 4. Build Production Web Bundle
```bash
npm run build
```

---

## 📱 Building the Android APK via GitHub Actions (Zero Local Setup)

You do **not** need Android Studio installed on your computer.

1. Push this repository to GitHub.
2. In your GitHub repository, navigate to the **Actions** tab.
3. Select the **Build Android APK (CampusOS)** workflow.
4. Click **Run workflow**.
5. Once completed, download the `CampusOS-debug-apk` artifact from the run summary.
6. Transfer the `.apk` file to your Android phone and install!

---

## 🔒 Security Rules

Both `firestore.rules` and `storage.rules` are configured for per-user cryptographic isolation:
- No authenticated student can view or modify another student's timetable, attendance, or notes.
- Private uploads are restricted to a 10MB quota per file.
