'use client';

import { Megaphone } from 'lucide-react';

export interface Notice {
    /** Short category shown in the pill, e.g. "Batch", "Exam", "Event". */
    tag: string;
    text: string;
}

/**
 * Always-on announcement ticker. A pinned "Notices" label sits on the left;
 * to its right the notices scroll horizontally in an endless loop and pause
 * on hover so a reader can catch one. The track renders the list twice — the
 * CSS animation slides it to -50%, so the second copy is entering exactly as
 * the first leaves, giving a seamless loop with no visible reset.
 *
 * Under prefers-reduced-motion the scroll stops (see globals.css) and the
 * first few notices stay readable in place.
 */
export function NoticeTicker({ notices }: { notices: Notice[] }) {
    if (!notices.length) return null;

    // Two passes so the loop is seamless at the -50% keyframe.
    const loop = [...notices, ...notices];

    return (
        <div className="relative flex items-stretch overflow-hidden rounded-md border border-line bg-surface shadow-sm">
            {/* Pinned label */}
            <div className="z-10 flex shrink-0 items-center gap-2 border-r border-line bg-primary px-4 py-2.5 text-primary-foreground">
                <Megaphone className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Notices</span>
                <span className="rts-pulse-dot ml-0.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            </div>

            {/* Scrolling viewport */}
            <div className="rts-marquee-viewport relative flex-1 overflow-hidden">
                <div className="rts-marquee-track py-2.5">
                    {loop.map((notice, i) => (
                        <span key={i} className="mx-6 inline-flex items-center gap-2 text-sm">
                            <span className="rounded-sm bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                                {notice.tag}
                            </span>
                            <span className="text-ink">{notice.text}</span>
                            <span className="text-line" aria-hidden>
                                •
                            </span>
                        </span>
                    ))}
                </div>
                {/* Edge fades so notices dissolve rather than clip at the borders. */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface to-transparent" />
            </div>
        </div>
    );
}
