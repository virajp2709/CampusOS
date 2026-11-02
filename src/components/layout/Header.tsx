import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  Search,
  Menu,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/routes';
import { Avatar } from '@/components/ui';

interface HeaderProps {
  unreadNotificationCount?: number;
}

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  [ROUTES.DASHBOARD]: { title: 'Academic Command Center', subtitle: 'Welcome to your intelligent campus OS' },
  [ROUTES.TIMETABLE]: { title: 'Smart Timetable', subtitle: 'AI-5 Division • Semester I (2026-27)' },
  [ROUTES.ATTENDANCE]: { title: 'Attendance Intelligence', subtitle: 'Target: 75% • Projections & What-If Analysis' },
  [ROUTES.SUBJECTS]: { title: 'Courses & Curriculum', subtitle: 'FY B.Tech AI & Data Science (2025 Pattern)' },
  [ROUTES.PRACTICALS]: { title: 'Practical & Lab Manager', subtitle: 'Batch AI-5c Laboratory Portfolios' },
  [ROUTES.ASSIGNMENTS]: { title: 'Assignment Vault', subtitle: 'Deadlines, deliverables and submission tracking' },
  [ROUTES.NOTES]: { title: 'Document & Notes Repository', subtitle: 'Grounding materials, PDFs and syllabus notes' },
  [ROUTES.AI_TUTOR]: { title: 'AI Engineering Tutor', subtitle: 'Grounded in Pune University / VPKBIET 2025 Pattern' },
  [ROUTES.EXAMS]: { title: 'Examination Centre', subtitle: 'ISE (30) • ESE (60) • Term Work preparation' },
  [ROUTES.STUDY_PLANNER]: { title: 'Deep Work & Study Planner', subtitle: 'Pomodoro focus intervals and telemetry' },
  [ROUTES.ANALYTICS]: { title: 'Academic Analytics', subtitle: 'Longitudinal performance metrics' },
  [ROUTES.NOTIFICATIONS]: { title: 'System Notifications', subtitle: 'College alerts, lecture cues and deadlines' },
  [ROUTES.SETTINGS]: { title: 'Student Configuration', subtitle: 'Academic profile, batching and system preferences' },
};

export const Header: React.FC<HeaderProps> = ({ unreadNotificationCount = 2 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();
  const { toggleSidebar, isCollapsed } = useSidebar();
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const currentRouteInfo = ROUTE_TITLES[location.pathname] || {
    title: 'CampusOS',
    subtitle: 'Vidya Pratishthan Kamalnayan Bajaj Institute of Technology',
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-campus-bg-primary/80 backdrop-blur-md border-b border-campus-border transition-colors duration-200">
      {/* Left: Hamburger & Dynamic Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-campus-text-secondary hover:text-campus-text-primary hover:bg-campus-bg-tertiary transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-bold text-campus-text-primary tracking-tight flex items-center gap-2">
            {currentRouteInfo.title}
          </h1>
          <p className="hidden md:block text-xs text-campus-text-muted">
            {currentRouteInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-campus-bg-secondary rounded-xl border border-campus-border text-campus-text-muted text-sm w-64 focus-within:border-campus-primary/50 focus-within:ring-1 focus-within:ring-campus-primary/30 transition-all">
          <Search className="w-4 h-4 text-campus-text-muted" />
          <input
            type="text"
            placeholder="Search subjects, notes, labs..."
            className="bg-transparent border-none text-xs text-campus-text-primary placeholder:text-campus-text-muted focus:outline-none w-full"
          />
          <kbd className="text-[10px] bg-campus-bg-tertiary px-1.5 py-0.5 rounded text-campus-text-muted font-mono">⌘K</kbd>
        </div>

        {/* AI Quick Tutor Pill */}
        <button
          onClick={() => navigate(ROUTES.AI_TUTOR)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-campus-primary/20 to-campus-accent/20 border border-campus-primary/40 text-campus-primary-light hover:border-campus-primary text-xs font-medium transition-all shadow-glow"
        >
          <Sparkles className="w-3.5 h-3.5 text-campus-accent-light animate-pulse" />
          <span>Ask Tutor</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-campus-text-secondary hover:text-campus-text-primary hover:bg-campus-bg-tertiary transition-colors"
        >
          {mode === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate(ROUTES.NOTIFICATIONS)}
          className="relative p-2 rounded-xl text-campus-text-secondary hover:text-campus-text-primary hover:bg-campus-bg-tertiary transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-campus-danger rounded-full ring-2 ring-campus-bg-primary animate-pulse" />
          )}
        </button>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-campus-bg-tertiary transition-colors border border-transparent hover:border-campus-border"
          >
            <Avatar
              name={user?.displayName || 'Viraj'}
              src={user?.photoURL || undefined}
              size="sm"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-campus-text-primary leading-tight">
                {user?.displayName || 'Viraj'}
              </span>
              <span className="text-[10px] text-campus-text-muted">
                {user?.practicalBatch || 'AI-5c'} • {user?.rollNumber || '26107337'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-campus-text-muted ml-1 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-campus-bg-card border border-campus-border shadow-card-hover p-1.5 z-50 animate-slide-up"
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="px-3 py-2 border-b border-campus-border/60">
                <p className="text-xs font-medium text-campus-text-primary">{user?.displayName}</p>
                <p className="text-[10px] text-campus-text-muted truncate">{user?.email}</p>
                <p className="text-[10px] text-campus-primary-light font-mono mt-1">
                  {user?.branch} (Div {user?.division})
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate(ROUTES.SETTINGS);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-campus-text-secondary hover:text-campus-text-primary hover:bg-campus-bg-hover rounded-xl transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Student Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate(ROUTES.SETTINGS);
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-campus-text-secondary hover:text-campus-text-primary hover:bg-campus-bg-hover rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings & Batches</span>
                </button>
              </div>

              <div className="pt-1 border-t border-campus-border/60">
                <button
                  onClick={() => {
                    signOut();
                    setShowProfileMenu(false);
                    navigate(ROUTES.LOGIN);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-campus-danger hover:bg-campus-danger/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
