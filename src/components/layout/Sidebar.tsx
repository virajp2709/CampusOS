import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ClipboardCheck,
  BookOpen,
  FlaskConical,
  FileText,
  StickyNote,
  Bot,
  GraduationCap,
  Timer,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/config/routes';
import { Avatar } from '@/components/ui';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAi?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Timetable', path: ROUTES.TIMETABLE, icon: Calendar },
  { label: 'Attendance', path: ROUTES.ATTENDANCE, icon: ClipboardCheck },
  { label: 'Subjects', path: ROUTES.SUBJECTS, icon: BookOpen },
  { label: 'Practicals & Labs', path: ROUTES.PRACTICALS, icon: FlaskConical },
  { label: 'Assignments', path: ROUTES.ASSIGNMENTS, icon: FileText },
  { label: 'Notes & Vault', path: ROUTES.NOTES, icon: StickyNote },
  { label: 'AI Tutor', path: ROUTES.AI_TUTOR, icon: Bot, isAi: true },
  { label: 'Exams & Quizzes', path: ROUTES.EXAMS, icon: GraduationCap },
  { label: 'Study Planner', path: ROUTES.STUDY_PLANNER, icon: Timer },
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-campus-bg-primary border-r border-campus-border z-40 transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-campus-border">
        <div
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-campus-primary to-campus-accent flex-shrink-0 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-white text-lg">C</span>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Campus<span className="text-campus-accent-light">OS</span>
                <span className="text-[10px] bg-campus-primary/20 text-campus-primary-light px-1.5 py-0.2 rounded font-mono">
                  v1.0
                </span>
              </span>
              <span className="text-[10px] text-campus-text-muted truncate max-w-[140px]">
                VPKBIET • AI-5
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-campus-text-muted hover:text-campus-text-primary hover:bg-campus-bg-tertiary transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-campus-primary/20 to-campus-accent/10 text-white border-l-2 border-campus-primary shadow-sm'
                    : 'text-campus-text-secondary hover:text-campus-text-primary hover:bg-campus-bg-tertiary'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  item.isAi ? 'text-campus-accent-light group-hover:text-white' : ''
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
              </div>

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.isAi && (
                    <Sparkles className="w-3 h-3 text-campus-accent-light animate-pulse ml-1 flex-shrink-0" />
                  )}
                  {item.badge && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-campus-primary/20 text-campus-primary-light">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip on collapse */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-campus-bg-card border border-campus-border text-campus-text-primary text-xs rounded-lg shadow-card whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-campus-border">
        <div
          onClick={() => navigate(ROUTES.SETTINGS)}
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-campus-bg-tertiary transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Avatar
            name={user?.displayName || 'Viraj'}
            src={user?.photoURL || undefined}
            size="sm"
          />

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-campus-text-primary truncate">
                {user?.displayName || 'Viraj'}
              </p>
              <p className="text-[10px] text-campus-text-muted truncate">
                Roll: {user?.rollNumber || '26107337'}
              </p>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                signOut();
                navigate(ROUTES.LOGIN);
              }}
              title="Sign Out"
              className="p-1 rounded-lg text-campus-text-muted hover:text-campus-danger hover:bg-campus-danger/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-2 pt-2 border-t border-campus-border/40 text-center">
            <p className="text-[10px] text-campus-text-muted">
              Designed & created by <span className="text-campus-primary-light font-semibold">Viraj Pathak</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
