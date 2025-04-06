'use client';

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface SearchInputProps {
    initialValue?: string;
    placeholder?: string;
    debounceTime?: number;
}

export function SearchInput({
    initialValue = '',
    placeholder = "Search...",
    debounceTime = 300,
}: SearchInputProps) {
    const [value, setValue] = useState(initialValue);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Update URL query parameter after debounce
    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        // Reset page to 1 when search changes
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
    }, debounceTime);

    // Update internal state if initialValue changes (e.g., browser back/forward)
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                handleSearch(e.target.value);
            }}
            className="max-w-sm" // Add some default width constraint
        />
    );
} 