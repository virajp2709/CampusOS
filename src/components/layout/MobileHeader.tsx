import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ROUTES } from '@/config/routes';
import { Avatar } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

interface MobileHeaderProps {
  title?: string;
  unreadCount?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title = 'CampusOS', unreadCount = 2 }) => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-campus-bg-primary/95 backdrop-blur-md border-b border-campus-border">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-campus-primary to-campus-accent flex items-center justify-center shadow-glow">
          <span className="font-bold text-white text-sm">C</span>
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight text-campus-text-primary block leading-none">
            {title}
          </span>
          <span className="text-[10px] text-campus-text-muted leading-tight">
            {user?.division || 'AI-5'} • {user?.practicalBatch || 'AI-5c'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate(ROUTES.AI_TUTOR)}
          className="p-2 rounded-xl text-campus-primary-light hover:bg-campus-bg-tertiary transition-colors"
          title="AI Tutor"
        >
          <Sparkles className="w-4 h-4 text-campus-accent-light" />
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-xl text-campus-text-secondary hover:bg-campus-bg-tertiary transition-colors"
        >
          {mode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        <button
          onClick={() => navigate(ROUTES.NOTIFICATIONS)}
          className="relative p-2 rounded-xl text-campus-text-secondary hover:bg-campus-bg-tertiary transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-campus-danger rounded-full ring-2 ring-campus-bg-primary" />
          )}
        </button>

        <button
          onClick={() => navigate(ROUTES.SETTINGS)}
          className="p-1"
        >
          <Avatar name={user?.displayName || 'Viraj'} src={user?.photoURL || undefined} size="sm" />
        </button>
      </div>
    </header>
  );
};
