import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Stamp — status as stamped text, not a colored pill (design system §2.4.3).
 * 11px uppercase letterspaced, colored by semantic token; optional 1px border
 * for the "rubber stamp" look.
 */

export type StampTone = 'success' | 'warning' | 'danger' | 'muted';

const TONE_CLASS: Record<StampTone, string> = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    muted: 'text-ink-muted',
};

const STATUS_TONES: Record<string, StampTone> = {
    // success
    PAID: 'success',
    VERIFIED: 'success',
    ACTIVE: 'success',
    COMPLETED: 'success',
    PASSED: 'success',
    ENROLLED: 'success',
    // warning
    PENDING: 'warning',
    PARTIAL: 'warning',
    // danger
    FAILED: 'danger',
    OVERDUE: 'danger',
    INACTIVE: 'danger',
    DROPPED: 'danger',
    LOCKED: 'danger',
};

/** Resolve the semantic tone for a status string (case-insensitive). */
export function stampTone(status: string): StampTone {
    return STATUS_TONES[status.trim().toUpperCase()] ?? 'muted';
}

export interface StampProps extends React.ComponentProps<'span'> {
    /** Status text; also drives the tone unless `tone` is given. */
    status: string;
    /** Override the tone derived from `status`. */
    tone?: StampTone;
    /** 1px border in the same ink — the rubber-stamp variant. */
    bordered?: boolean;
}

export function Stamp({ status, tone, bordered = false, className, ...props }: StampProps) {
    const resolved = tone ?? stampTone(status);
    return (
        <span
            data-slot="stamp"
            className={cn(
                'inline-flex items-center whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.12em]',
                TONE_CLASS[resolved],
                bordered && 'rounded-[2px] border border-current px-1.5 py-1',
                className
            )}
            {...props}
        >
            {status}
        </span>
    );
}
