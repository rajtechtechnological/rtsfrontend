'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { batchesApi } from '@/lib/api/endpoints';
import type { Batch } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LedgerTable, type LedgerColumn } from '@/components/ui/ledger-table';
import { Stamp } from '@/components/ui/stamp';
import { Loader2, MoreHorizontal } from 'lucide-react';

const MONTHS = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

const IDENTIFIERS = ['A', 'B', 'C', 'D'];

const batchSchema = z.object({
    name: z.string().min(1, 'Batch name is required'),
    start_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().min(1, 'End time is required'),
    month: z.number().min(1).max(12),
    year: z.number().min(2000).max(2100),
    identifier: z.string().min(1),
});

type BatchFormData = z.infer<typeof batchSchema>;

const fieldLabelClass = 'text-xs uppercase tracking-wide text-ink-muted';

/** "HH:MM:SS" (API) → "HH:MM" (input[type=time]). */
function toTimeInput(value: string): string {
    return value?.slice(0, 5) ?? '';
}

/** "09:00:00" → "9:00 AM" for the ledger. */
function formatBatchTime(value: string): string {
    if (!value) return '';
    const [hours, minutes] = value.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function monthLabel(month: number): string {
    return MONTHS.find((m) => m.value === month)?.label ?? String(month);
}

function BatchDialog({
    open,
    onOpenChange,
    batch,
    onSaved,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    batch: Batch | null; // null = create
    onSaved: () => void;
}) {
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<BatchFormData>({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            month: new Date().getMonth() + 1,
            year: currentYear,
            identifier: 'A',
        },
    });

    const month = watch('month');
    const year = watch('year');
    const identifier = watch('identifier');

    useEffect(() => {
        if (open) {
            reset(
                batch
                    ? {
                          name: batch.name,
                          start_time: toTimeInput(batch.start_time),
                          end_time: toTimeInput(batch.end_time),
                          month: batch.month,
                          year: batch.year,
                          identifier: batch.identifier,
                      }
                    : {
                          name: '',
                          start_time: '09:00',
                          end_time: '10:00',
                          month: new Date().getMonth() + 1,
                          year: currentYear,
                          identifier: 'A',
                      }
            );
        }
    }, [open, batch, reset]);

    const onSubmit = async (data: BatchFormData) => {
        setIsSaving(true);
        try {
            if (batch) {
                await batchesApi.update(batch.id, data);
                toast.success(`Batch ${data.name} updated`);
            } else {
                await batchesApi.create(data);
                toast.success(`Batch ${data.name} created`);
            }
            onOpenChange(false);
            onSaved();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to save batch');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif text-ink">
                        {batch ? 'Edit Batch' : 'New Batch'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="batch_name" className={fieldLabelClass}>
                            Batch Name (required)
                        </Label>
                        <Input
                            id="batch_name"
                            placeholder="e.g., Morning 9-10"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-danger">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="batch_start" className={fieldLabelClass}>
                                Start Time (required)
                            </Label>
                            <Input id="batch_start" type="time" {...register('start_time')} />
                            {errors.start_time && (
                                <p className="text-sm text-danger">{errors.start_time.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="batch_end" className={fieldLabelClass}>
                                End Time (required)
                            </Label>
                            <Input id="batch_end" type="time" {...register('end_time')} />
                            {errors.end_time && (
                                <p className="text-sm text-danger">{errors.end_time.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label className={fieldLabelClass}>Month</Label>
                            <Select
                                value={String(month)}
                                onValueChange={(value) => setValue('month', Number(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m) => (
                                        <SelectItem key={m.value} value={String(m.value)}>
                                            {m.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className={fieldLabelClass}>Year</Label>
                            <Select
                                value={String(year)}
                                onValueChange={(value) => setValue('year', Number(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {YEARS.map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className={fieldLabelClass}>Identifier</Label>
                            <Select
                                value={identifier}
                                onValueChange={(value) => setValue('identifier', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="A" />
                                </SelectTrigger>
                                <SelectContent>
                                    {IDENTIFIERS.map((id) => (
                                        <SelectItem key={id} value={id}>
                                            {id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-line pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : batch ? (
                                'Save Changes'
                            ) : (
                                'Create Batch'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function BatchesPage() {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

    const fetchBatches = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await batchesApi.list();
            setBatches(response.data || []);
        } catch (error) {
            console.error('Failed to fetch batches:', error);
            toast.error('Failed to load batches');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBatches();
    }, [fetchBatches]);

    const openCreate = () => {
        setEditingBatch(null);
        setDialogOpen(true);
    };

    const openEdit = (batch: Batch) => {
        setEditingBatch(batch);
        setDialogOpen(true);
    };

    const toggleActive = async (batch: Batch) => {
        try {
            await batchesApi.update(batch.id, { is_active: !batch.is_active });
            toast.success(
                batch.is_active ? `Batch ${batch.name} deactivated` : `Batch ${batch.name} activated`
            );
            fetchBatches();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to update batch');
        }
    };

    const deleteBatch = async (batch: Batch) => {
        if (!confirm(`Delete batch "${batch.name}"? This cannot be undone.`)) return;
        try {
            await batchesApi.delete(batch.id);
            toast.success(`Batch ${batch.name} deleted`);
            fetchBatches();
        } catch (error: any) {
            toast.error(
                error.response?.data?.detail ||
                    'Failed to delete batch (batches with students must be deactivated instead)'
            );
        }
    };

    const columns: LedgerColumn<Batch>[] = [
        {
            key: 'name',
            header: 'Batch',
            cell: (batch) => <span className="font-medium text-ink">{batch.name}</span>,
        },
        {
            key: 'time',
            header: 'Time',
            cell: (batch) => (
                <span className="font-mono tabular-nums">
                    {formatBatchTime(batch.start_time)} – {formatBatchTime(batch.end_time)}
                </span>
            ),
        },
        {
            key: 'period',
            header: 'Month / Year',
            cell: (batch) => `${monthLabel(batch.month)} ${batch.year}`,
        },
        {
            key: 'identifier',
            header: 'Identifier',
            align: 'center',
            cell: (batch) => <span className="font-mono">{batch.identifier}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            cell: (batch) => <Stamp status={batch.is_active ? 'Active' : 'Inactive'} />,
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            headerClassName: 'w-12',
            cell: (batch) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="text-ink-muted hover:text-ink">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer" onClick={() => openEdit(batch)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => toggleActive(batch)}>
                            {batch.is_active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => deleteBatch(batch)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-ink">Batches</h1>
                    <p className="mt-1 text-sm text-ink-muted">
                        Class batches for student registration and exam scheduling
                    </p>
                </div>
                <Button onClick={openCreate}>New Batch</Button>
            </div>

            {/* Register */}
            <section className="rounded-md border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <h2 className="font-serif text-lg text-ink">Batch Register</h2>
                    <span className="font-mono text-xs tabular-nums text-ink-muted">
                        {batches.length} records
                    </span>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                    </div>
                ) : (
                    <LedgerTable
                        columns={columns}
                        rows={batches}
                        rowKey={(batch) => batch.id}
                        emptyMessage="No batches have been created yet."
                    />
                )}
            </section>

            <BatchDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                batch={editingBatch}
                onSaved={fetchBatches}
            />
        </div>
    );
}
