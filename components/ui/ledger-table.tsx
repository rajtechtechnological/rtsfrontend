'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

/**
 * LedgerTable — the institutional table (design system §2.4 / §5).
 * Hairline row separators, uppercase 12px header labels, 40px compact rows,
 * right-aligned mono numerals, optional subtotal row with a double top border.
 */

export interface LedgerColumn<T> {
    /** Stable key; also used to address subtotal cells. */
    key: string;
    header: React.ReactNode;
    cell: (row: T, index: number) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    /** Numeric cells are right-aligned and set in mono with tabular figures. */
    numeric?: boolean;
    headerClassName?: string;
    cellClassName?: string;
}

export interface LedgerTableProps<T> {
    columns: LedgerColumn<T>[];
    rows: T[];
    rowKey: (row: T, index: number) => React.Key;
    onRowClick?: (row: T, index: number) => void;
    /** One serif sentence (design system §2.4.5). */
    emptyMessage?: React.ReactNode;
    /** Subtotal cells keyed by column key; rendered with a double top border. */
    subtotal?: Partial<Record<string, React.ReactNode>>;
    className?: string;
    rowClassName?: (row: T, index: number) => string | undefined;
}

function alignmentClass<T>(column: LedgerColumn<T>): string {
    if (column.align) {
        return column.align === 'right'
            ? 'text-right'
            : column.align === 'center'
              ? 'text-center'
              : 'text-left';
    }
    return column.numeric ? 'text-right' : 'text-left';
}

export function LedgerTable<T>({
    columns,
    rows,
    rowKey,
    onRowClick,
    emptyMessage = 'No entries recorded.',
    subtotal,
    className,
    rowClassName,
}: LedgerTableProps<T>) {
    return (
        <Table className={cn('text-[13px] leading-5', className)}>
            <TableHeader>
                <TableRow className="border-line hover:bg-transparent">
                    {columns.map((column) => (
                        <TableHead
                            key={column.key}
                            className={cn(
                                'h-10 px-3 text-xs font-medium uppercase tracking-wide text-ink-muted',
                                alignmentClass(column),
                                column.headerClassName
                            )}
                        >
                            {column.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.length === 0 ? (
                    <TableRow className="border-line hover:bg-transparent">
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 px-3 text-center font-serif text-sm text-ink-muted whitespace-normal"
                        >
                            {emptyMessage}
                        </TableCell>
                    </TableRow>
                ) : (
                    rows.map((row, index) => (
                        <TableRow
                            key={rowKey(row, index)}
                            onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                            className={cn(
                                'h-10 border-line hover:bg-accent-soft/50',
                                onRowClick && 'cursor-pointer',
                                rowClassName?.(row, index)
                            )}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    className={cn(
                                        'h-10 px-3 py-0 text-ink',
                                        alignmentClass(column),
                                        column.numeric && 'font-mono tabular-nums',
                                        column.cellClassName
                                    )}
                                >
                                    {column.cell(row, index)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                )}
            </TableBody>
            {subtotal && rows.length > 0 && (
                <TableFooter className="border-0 bg-transparent font-medium">
                    <TableRow className="h-10 border-line hover:bg-transparent">
                        {columns.map((column) => (
                            <TableCell
                                key={column.key}
                                className={cn(
                                    'h-10 border-t-[3px] border-t-line px-3 py-0 text-ink [border-top-style:double]',
                                    alignmentClass(column),
                                    column.numeric && 'font-mono tabular-nums',
                                    column.cellClassName
                                )}
                            >
                                {subtotal[column.key] ?? null}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    );
}
