import { describe, it, expect } from 'vitest';
import { formatTime, formatDuration, truncateText, getInitials } from '@/utils/helpers';

describe('Helper Utilities', () => {
  it('formats 24-hour time to 12-hour AM/PM correctly', () => {
    expect(formatTime('09:15')).toBe('9:15 AM');
    expect(formatTime('13:30')).toBe('1:30 PM');
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatTime('00:00')).toBe('12:00 AM');
  });

  it('formats duration in minutes to human-readable strings', () => {
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(125)).toBe('2h 5m');
  });

  it('truncates text with ellipsis properly', () => {
    expect(truncateText('Engineering Mathematics', 11)).toBe('Engineering...');
    expect(truncateText('Short text', 20)).toBe('Short text');
  });

  it('generates two-character user initials', () => {
    expect(getInitials('Viraj Pathak')).toBe('VP');
    expect(getInitials('Student')).toBe('ST');
  });
});
