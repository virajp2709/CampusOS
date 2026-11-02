import React from 'react';
import { Heart, Sparkles, Code2, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pt-6 pb-4 border-t border-campus-border/60 text-center text-xs text-campus-text-muted">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto px-2">
        <div className="flex items-center gap-1.5 font-medium text-campus-text-secondary">
          <span>Designed and created by</span>
          <span className="font-bold text-white bg-gradient-to-r from-campus-primary-light to-campus-accent-light bg-clip-text text-transparent">
            Viraj Pathak
          </span>
          <Sparkles className="w-3.5 h-3.5 text-campus-accent-light inline" />
        </div>

        <div className="flex items-center gap-2 text-[11px] text-campus-text-muted">
          <span>VPKBIET • AI & Data Science (AI-5)</span>
          <span>•</span>
          <span>CampusOS v1.0</span>
        </div>
      </div>
    </footer>
  );
};
