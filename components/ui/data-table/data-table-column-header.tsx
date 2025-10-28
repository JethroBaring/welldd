import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { Button } from '../button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        size='sm'
                        className={`focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-transparent w-full justify-start pl-0 p-0 gap-0 h-auto min-h-0`}
                    >
                        <div className={`flex items-center w-full`}>
                            <span>{title}</span>
                            {column.getIsSorted() === 'desc' ? (
                                <ArrowDown className='ml-2 h-4 w-4 shrink-0 text-primary' />
                            ) : column.getIsSorted() === 'asc' ? (
                                <ArrowUp className='ml-2 h-4 w-4 shrink-0 text-primary' />
                            ) : (
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            )}
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(false)}
                    >
                        <ArrowUp />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => column.toggleSorting(true)}
                    >
                        <ArrowDown />
                        Desc
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
