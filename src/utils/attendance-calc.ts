import type { AttendanceSummary } from '@/types';

export function calculateAttendancePercentage(attended: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((attended / total) * 10000) / 100;
}

export function classesNeededForTarget(
  attended: number,
  total: number,
  targetPercentage: number
): number {
  // We need: (attended + x) / (total + x) >= target/100
  // attended + x >= (total + x) * target / 100
  // 100 * attended + 100x >= total * target + x * target
  // x * (100 - target) >= total * target - 100 * attended
  // x >= (total * target - 100 * attended) / (100 - target)
  if (targetPercentage >= 100) return Infinity;
  const needed = Math.ceil(
    (total * targetPercentage - 100 * attended) / (100 - targetPercentage)
  );
  return Math.max(0, needed);
}

export function maxFutureAbsences(
  attended: number,
  total: number,
  targetPercentage: number,
  futureClasses: number = 10
): number {
  // After missing y classes out of futureClasses more:
  // (attended + futureClasses - y) / (total + futureClasses) >= target/100
  // attended + futureClasses - y >= (total + futureClasses) * target / 100
  // y <= attended + futureClasses - (total + futureClasses) * target / 100
  const maxMiss = Math.floor(
    attended + futureClasses - ((total + futureClasses) * targetPercentage) / 100
  );
  return Math.max(0, maxMiss);
}

export function buildAttendanceSummary(
  subjectId: string,
  subjectName: string,
  records: Array<{ status: string }>,
  target: number
): AttendanceSummary {
  const total = records.filter((r) => r.status !== 'cancelled').length;
  const attended = records.filter((r) => r.status === 'present').length;
  const missed = records.filter((r) => r.status === 'absent').length;
  const cancelled = records.filter((r) => r.status === 'cancelled').length;
  const percentage = calculateAttendancePercentage(attended, total);

  return {
    subjectId,
    subjectName,
    totalClasses: total,
    attended,
    missed,
    cancelled,
    percentage,
    target,
    classesNeededForTarget: classesNeededForTarget(attended, total, target),
    maxFutureAbsences: maxFutureAbsences(attended, total, target),
  };
}
