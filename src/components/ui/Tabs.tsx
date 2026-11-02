import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { cn } from '@/utils/helpers';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: (activeTabId: string) => ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab: controlledActiveTab,
  defaultTab,
  onChange,
  children,
  className,
  fullWidth = false,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  const activeTabId = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(tabId);
      }
      onChange?.(tabId);
    },
    [controlledActiveTab, onChange]
  );

  // Animate indicator
  useEffect(() => {
    const activeElement = tabRefs.current.get(activeTabId);
    const indicator = indicatorRef.current;
    const tabList = tabListRef.current;

    if (activeElement && indicator && tabList) {
      const tabListRect = tabList.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      indicator.style.width = `${activeRect.width}px`;
      indicator.style.left = `${activeRect.left - tabListRect.left}px`;
    }
  }, [activeTabId, tabs]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentIndex = enabledTabs.findIndex((t) => t.id === activeTabId);

    let nextIndex = -1;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % enabledTabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex =
          (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = enabledTabs.length - 1;
        break;
      default:
        return;
    }

    if (nextIndex >= 0) {
      const nextTab = enabledTabs[nextIndex];
      handleTabChange(nextTab.id);
      tabRefs.current.get(nextTab.id)?.focus();
    }
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex border-b border-white/[0.06]',
          fullWidth && '[&>button]:flex-1'
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTabId === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTabId === tab.id ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium',
              'transition-colors duration-200 whitespace-nowrap',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-campus-primary/50 focus-visible:ring-inset',
              activeTabId === tab.id
                ? 'text-campus-primary'
                : 'text-campus-text-muted hover:text-campus-text-primary',
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}

        {/* Animated indicator */}
        <div
          ref={indicatorRef}
          className="absolute bottom-0 h-0.5 bg-campus-primary rounded-full transition-all duration-300 ease-out"
          aria-hidden="true"
        />
      </div>

      {/* Tab Panels */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTabId !== tab.id}
          tabIndex={0}
          className="focus-visible:outline-none"
        >
          {activeTabId === tab.id && children(activeTabId)}
        </div>
      ))}
    </div>
  );
};

Tabs.displayName = 'Tabs';
