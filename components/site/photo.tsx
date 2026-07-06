'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tint = 'green' | 'gold' | 'ink';

const tintGradient: Record<Tint, string> = {
    green: 'from-primary/20 via-accent-soft to-surface',
    gold: 'from-gold/20 via-accent-soft to-surface',
    ink: 'from-ink/15 via-muted to-surface',
};

interface PhotoProps {
    /** Path under /public, e.g. "/gallery/campus-01.jpg". */
    src: string;
    alt: string;
    /** Shown centered while no real image exists at `src`. */
    label?: string;
    icon?: LucideIcon;
    tint?: Tint;
    className?: string;
    imgClassName?: string;
    /**
     * `cover` (default) crops to fill the box — right for thumbnails and
     * backgrounds. `contain` shows the whole photo without cropping and drops
     * the gradient wash — right for a full-size viewer on a dark backdrop.
     */
    fit?: 'cover' | 'contain';
}

/**
 * A photo slot that degrades gracefully. Until a real image file is present at
 * `src`, a themed gradient placeholder (with an optional icon + label) shows, so
 * the layout looks intentional rather than broken. Drop a JPEG at the same path
 * later and the photo simply appears — no code change needed. See
 * public/gallery/README.md for the expected filenames.
 */
export function Photo({
    src,
    alt,
    label,
    icon: Icon,
    tint = 'green',
    className,
    imgClassName,
    fit = 'cover',
}: PhotoProps) {
    const [loaded, setLoaded] = useState(false);
    const contain = fit === 'contain';

    return (
        <div className={cn('relative overflow-hidden', contain ? 'bg-transparent' : 'bg-surface', className)}>
            {/* Gradient placeholder + faint texture behind the image. Skipped for
                `contain` so a full-size photo isn't letterboxed in green. */}
            {!contain && (
                <>
                    <div className={cn('absolute inset-0 bg-gradient-to-br', tintGradient[tint])} />
                    <div
                        className="absolute inset-0 opacity-[0.5]"
                        style={{
                            backgroundImage:
                                'radial-gradient(color-mix(in oklab, var(--ink) 8%, transparent) 1px, transparent 1px)',
                            backgroundSize: '16px 16px',
                        }}
                        aria-hidden
                    />
                </>
            )}
            {(Icon || label) && (
                <div
                    className={cn(
                        'absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-muted transition-opacity duration-300',
                        loaded ? 'opacity-0' : 'opacity-100'
                    )}
                    aria-hidden
                >
                    {Icon && <Icon className="h-7 w-7 text-primary/70" />}
                    {label && (
                        <span className="text-[11px] font-medium uppercase tracking-widest">{label}</span>
                    )}
                </div>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={(e) => {
                    // No file yet → keep the placeholder visible.
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    setLoaded(false);
                }}
                className={cn(
                    'relative h-full w-full transition-opacity duration-500',
                    contain ? 'object-contain' : 'object-cover',
                    loaded ? 'opacity-100' : 'opacity-0',
                    imgClassName
                )}
            />
        </div>
    );
}
