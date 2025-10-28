'use client';

import { useState } from 'react';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './popover';

import { Button } from './button';

import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

interface Option {
    label: string;
    value: string | number;
}

interface ComboBoxProps {
    data: Option[];
    selectedOption: string | number | null;
    onSetOption: React.Dispatch<React.SetStateAction<string | number | null>>;
    placeholder?: string;
    emptyMessage?: string;
}

export function ComboBox({
    data,
    selectedOption,
    onSetOption,
    placeholder,
    emptyMessage,
}: ComboBoxProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='justify-between font-normal'
                >
                    {selectedOption
                        ? data?.find((i) => i.value === selectedOption)
                              ?.label ?? placeholder
                        : placeholder}
                    <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
                <Command>
                    <CommandInput
                        placeholder={`Search options...`}
                        className=''
                    />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {data?.map((i) => (
                                <CommandItem
                                    key={i.value}
                                    value={i.label}
                                    onSelect={() => {
                                        onSetOption(i.value);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={`mr-2 h-4 w-4 ${
                                            selectedOption === i.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        }`}
                                    />
                                    {i.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
