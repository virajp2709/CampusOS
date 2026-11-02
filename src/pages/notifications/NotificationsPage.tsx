import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  Check,
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import { dataManager } from '@/services/data-manager';
import type { Notification } from '@/types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    dataManager.getNotifications()
  );

  const handleMarkAsRead = (id: string) => {
    dataManager.markNotificationAsRead(id);
    setNotifications(dataManager.getNotifications());
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => dataManager.markNotificationAsRead(n.id));
    setNotifications(dataManager.getNotifications());
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-campus-text-primary flex items-center gap-2">
            <Bell className="w-5 h-5 text-campus-primary-light" />
            <span>Academic Notifications & Alerts</span>
          </h2>
          <p className="text-xs text-campus-text-muted mt-0.5">
            College alerts, low-attendance warnings, and assignment reminders.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
            <Check className="w-3.5 h-3.5 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => {
          const isAttendance = notif.type === 'attendance';
          const isExam = notif.type === 'exam';

          return (
            <Card
              key={notif.id}
              className={`p-4 transition-all border-l-4 ${
                !notif.isRead
                  ? isAttendance
                    ? 'border-l-campus-danger bg-campus-bg-secondary/90'
                    : 'border-l-campus-primary bg-campus-bg-secondary/90'
                  : 'border-l-campus-border opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      isAttendance
                        ? 'bg-campus-danger/15 text-campus-danger'
                        : isExam
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-campus-primary/15 text-campus-primary-light'
                    }`}
                  >
                    {isAttendance ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isExam ? (
                      <Calendar className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-campus-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-campus-text-secondary leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-campus-text-muted font-mono block pt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!notif.isRead && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-xs text-campus-text-muted hover:text-white"
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
