'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Light/dark switch for the portals. Renders a stable placeholder until mounted
 * so the server and client markup match (next-themes only knows the resolved
 * theme on the client). The icon cross-fades on toggle.
 */
export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = resolvedTheme === 'dark';
    // Until mounted, the resolved theme is unknown on the client, so keep the
    // label theme-neutral to match the server render and avoid a hydration
    // mismatch. It refines to the specific action once mounted.
    const label = !mounted ? 'Toggle theme' : isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            title={label}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`relative text-ink-muted hover:text-ink ${className ?? ''}`}
        >
            {mounted && (
                <>
                    <Sun
                        className={`h-5 w-5 transition-all duration-300 ${
                            isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
                        }`}
                    />
                    <Moon
                        className={`absolute h-5 w-5 transition-all duration-300 ${
                            isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
                        }`}
                    />
                </>
            )}
        </Button>
    );
}
