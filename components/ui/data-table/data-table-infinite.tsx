'use client';

import * as React from 'react';
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    getFilteredRowModel,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../table';
import { DataTablePagination } from './data-table-pagination';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from '../input';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    sort: string;
    mode: string;
    onRowClick?: (row: TData) => void;
}

export function DataTableInfinite<TData, TValue>({
    columns,
    data,
    mode,
    sort,
    onRowClick,
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = React.useState('');

    const sortState =
        sort !== ''
            ? [
                  // Sets the ID column to sort in ascending order by default
                  {
                      id: sort,
                      desc: false,
                  },
              ]
            : [];

    const [sorting, setSorting] = React.useState<SortingState>(sortState);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        state: {
            globalFilter,
            sorting,
        },
    });

    return (
        <div>
            {mode !== 'create' ? (
                <div className='flex pb-8 justify-end'>
                    <div className='relative pr-1'>
                        <Input
                            className='md:w-2xs pr-9'
                            placeholder='Search'
                            value={globalFilter ?? ''}
                            onChange={(e) =>
                                table.setGlobalFilter(String(e.target.value))
                            }
                        />
                        <SearchOutlined className='absolute right-1 top-0 m-2.5 h-4 w-4 text-muted-foreground' />
                    </div>
                </div>
            ) : (
                ''
            )}
            <div className='overflow-hidden rounded-lg border'>
                <Table>
                    <TableHeader className='[&_tr]:border-b sticky top-0 z-10 bg-muted'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    onClick={() =>
                                        onRowClick && onRowClick(row.original)
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='mt-8'>
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
