import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  Bot,
  MoreHorizontal,
  BookOpen,
  FlaskConical,
  FileText,
  StickyNote,
  GraduationCap,
  Timer,
  BarChart3,
  Bell,
  Settings,
  X,
} from 'lucide-react';
import { ROUTES } from '@/config/routes';

export const BottomNav: React.FC = () => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const navigate = useNavigate();

  const primaryItems = [
    { label: 'Today', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Schedule', path: ROUTES.TIMETABLE, icon: Calendar },
    { label: 'Attendance', path: ROUTES.ATTENDANCE, icon: ClipboardCheck },
    { label: 'AI Tutor', path: ROUTES.AI_TUTOR, icon: Bot },
  ];

  const moreItems = [
    { label: 'Courses', path: ROUTES.SUBJECTS, icon: BookOpen },
    { label: 'Labs & Practicals', path: ROUTES.PRACTICALS, icon: FlaskConical },
    { label: 'Assignments', path: ROUTES.ASSIGNMENTS, icon: FileText },
    { label: 'Notes & Vault', path: ROUTES.NOTES, icon: StickyNote },
    { label: 'Exams & Quizzes', path: ROUTES.EXAMS, icon: GraduationCap },
    { label: 'Study Planner', path: ROUTES.STUDY_PLANNER, icon: Timer },
    { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3 },
    { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
    { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
  ];

  return (
    <>
      {/* Bottom Sheet for More Items */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end md:hidden animate-fade-in"
          onClick={() => setShowMoreMenu(false)}
        >
          <div
            className="bg-campus-bg-card border-t border-campus-border rounded-t-3xl p-5 pb-8 space-y-4 max-h-[80vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-campus-border pb-3">
              <span className="font-bold text-sm text-campus-text-primary">More Modules</span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-lg text-campus-text-muted hover:text-campus-text-primary hover:bg-campus-bg-tertiary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setShowMoreMenu(false);
                    }}
                    className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-campus-bg-secondary hover:bg-campus-bg-hover border border-campus-border text-campus-text-secondary hover:text-campus-text-primary transition-all active:scale-95"
                  >
                    <Icon className="w-5 h-5 text-campus-primary-light" />
                    <span className="text-[11px] text-center font-medium leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-campus-bg-primary/95 backdrop-blur-lg border-t border-campus-border safe-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                    isActive
                      ? 'text-campus-primary-light font-semibold scale-105'
                      : 'text-campus-text-muted hover:text-campus-text-primary'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1">{item.label}</span>
              </NavLink>
            );
          })}

          <button
            onClick={() => setShowMoreMenu(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              showMoreMenu ? 'text-campus-primary-light font-semibold' : 'text-campus-text-muted hover:text-campus-text-primary'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-1">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
