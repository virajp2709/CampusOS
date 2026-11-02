import { describe, it, expect } from 'vitest';
import {
  calculateAttendancePercentage,
  classesNeededForTarget,
  maxFutureAbsences,
  buildAttendanceSummary,
} from '@/utils/attendance-calc';

describe('Attendance Calculation Engine', () => {
  it('calculates attendance percentage correctly', () => {
    expect(calculateAttendancePercentage(15, 20)).toBe(75);
    expect(calculateAttendancePercentage(17, 24)).toBe(70.83);
    expect(calculateAttendancePercentage(0, 0)).toBe(100);
  });

  it('calculates classes needed to reach target threshold', () => {
    // Current: 17 attended out of 24 conducted (70.83%). Target: 75%
    // (17 + x) / (24 + x) >= 0.75 => x >= (24*75 - 1700)/25 = 100/25 = 4 classes
    const needed = classesNeededForTarget(17, 24, 75);
    expect(needed).toBe(4);

    // Verify: after attending 4 more: (17+4)/(24+4) = 21/28 = 75%
    expect(calculateAttendancePercentage(17 + 4, 24 + 4)).toBe(75);
  });

  it('returns 0 classes needed if already above target', () => {
    // 23 attended out of 28 conducted (82.14%). Target: 75%
    const needed = classesNeededForTarget(23, 28, 75);
    expect(needed).toBe(0);
  });

  it('calculates maximum future absences without falling below target', () => {
    // Current: 23 attended out of 28 conducted (82.14%). Target: 75%. Next 10 classes.
    // Total future = 38. Target 75% of 38 = 28.5 => need at least 29 attended.
    // Currently have 23. Need 6 more out of 10. Can miss 10 - 6 = 4 classes.
    const maxMiss = maxFutureAbsences(23, 28, 75, 10);
    expect(maxMiss).toBe(4);

    // If student attends 23 + 6 = 29 out of 38: 29/38 = 76.3% (>=75%)
    expect(calculateAttendancePercentage(29, 38)).toBeGreaterThanOrEqual(75);
  });

  it('builds a complete attendance summary for a subject', () => {
    const records = [
      { status: 'present' },
      { status: 'present' },
      { status: 'present' },
      { status: 'absent' },
      { status: 'cancelled' },
    ];
    const summary = buildAttendanceSummary('subj-chem', 'Engineering Chemistry', records, 75);
    expect(summary.totalClasses).toBe(4);
    expect(summary.attended).toBe(3);
    expect(summary.missed).toBe(1);
    expect(summary.cancelled).toBe(1);
    expect(summary.percentage).toBe(75);
  });
});
