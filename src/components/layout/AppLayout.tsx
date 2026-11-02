import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-campus-bg-deep text-campus-text-primary">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <MobileHeader />
        </div>

        {/* Main Scrolling Body */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8 px-4 md:px-8 pt-4 md:pt-6 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
