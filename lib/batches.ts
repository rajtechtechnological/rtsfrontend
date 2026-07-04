import type { Batch } from '@/types';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

/** "09:00:00" (API time) → "9:00 AM". */
export function formatBatchTime(value: string): string {
    if (!value) return '';
    const [hours, minutes] = value.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

export function batchMonthName(month: number): string {
    return MONTH_NAMES[month - 1] ?? String(month);
}

/** One-line label: "Morning 9-10 · 9:00 AM–10:00 AM · July 2026 (A)". */
export function batchLabel(batch: Batch): string {
    return `${batch.name} · ${formatBatchTime(batch.start_time)}–${formatBatchTime(batch.end_time)} · ${batchMonthName(batch.month)} ${batch.year} (${batch.identifier})`;
}

/** Look up a batch name by id from a fetched batch list. */
export function batchNameById(batches: Batch[], batchId: string | null | undefined): string | null {
    if (!batchId) return null;
    return batches.find((b) => b.id === batchId)?.name ?? null;
}
