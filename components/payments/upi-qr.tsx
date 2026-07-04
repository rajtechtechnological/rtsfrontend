'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

/**
 * UPI collection QR (Phase 1 — no gateway): encodes a standard upi://pay
 * deep link for the institution's VPA. The student scans and pays; the
 * receptionist confirms the payment on the center's UPI app and records
 * the UTR as the transaction ID. Confirmation is deliberately manual.
 */
export function UpiQr({
    vpa,
    payeeName,
    amount,
    note,
    hint = 'After the student pays, confirm the credit in your UPI app and enter the UTR number below as the transaction ID.',
}: {
    vpa: string;
    payeeName: string;
    amount?: number;
    note?: string;
    hint?: string;
}) {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    const params = new URLSearchParams({ pa: vpa, pn: payeeName, cu: 'INR' });
    if (amount && amount > 0) params.set('am', amount.toFixed(2));
    if (note) params.set('tn', note.slice(0, 60));
    const upiUri = `upi://pay?${params.toString()}`;

    useEffect(() => {
        let cancelled = false;
        QRCode.toDataURL(upiUri, { margin: 1, width: 240 }).then((url) => {
            if (!cancelled) setDataUrl(url);
        });
        return () => {
            cancelled = true;
        };
    }, [upiUri]);

    return (
        <div className="flex flex-col items-center gap-3 rounded-md border border-line bg-surface p-4 sm:flex-row sm:items-start">
            {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={dataUrl}
                    alt={`UPI QR for ${vpa}`}
                    className="h-40 w-40 shrink-0 rounded-md border border-line"
                />
            ) : (
                <div className="h-40 w-40 shrink-0 animate-pulse rounded-md bg-muted" />
            )}
            <div className="text-center sm:text-left">
                <p className="text-xs uppercase tracking-wide text-ink-muted">Scan to pay</p>
                <p className="mt-1 font-mono text-sm text-ink">{vpa}</p>
                {amount ? (
                    <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
                        ₹{amount.toLocaleString('en-IN')}
                    </p>
                ) : null}
                <p className="mt-2 text-sm text-ink-muted">{hint}</p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                        navigator.clipboard.writeText(vpa);
                        toast.success('UPI ID copied');
                    }}
                >
                    <Copy className="h-3.5 w-3.5" />
                    Copy UPI ID
                </Button>
            </div>
        </div>
    );
}
