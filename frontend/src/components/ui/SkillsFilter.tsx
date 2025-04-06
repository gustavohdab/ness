'use client';

import { Check, PlusCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { getAllSkillsAction } from "@/lib/actions"; // Assuming action exists
import { cn } from "@/lib/utils";

interface SkillsFilterProps {
    initialValue?: string; // Comma-separated initial skills
    title?: string;
    debounceTime?: number; // Add debounce time prop
}

export function SkillsFilter({
    initialValue = "",
    title = "Skills",
    debounceTime = 500, // Set a default debounce time (e.g., 500ms)
}: SkillsFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [availableSkills, setAvailableSkills] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<Set<string>>(() => {
        // Initialize from URL parameter
        const skillsFromUrl = initialValue.split(",").filter(Boolean);
        return new Set(skillsFromUrl);
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    // Fetch available skills on mount
    useEffect(() => {
        const fetchSkills = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const skills = await getAllSkillsAction();
                setAvailableSkills(skills);
            } catch (err) {
                console.error("Failed to fetch skills:", err);
                setError("Could not load skills.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSkills();
    }, []);

    // Debounced function to update the URL
    const debouncedUpdateUrl = useDebouncedCallback((currentSelectedSkills: Set<string>) => {
        const params = new URLSearchParams(searchParams.toString());
        const skillsArray = Array.from(currentSelectedSkills);

        if (skillsArray.length > 0) {
            params.set("skills", skillsArray.join(","));
        } else {
            params.delete("skills");
        }
        params.set("page", "1"); // Reset page
        router.replace(`${pathname}?${params.toString()}`);
    }, debounceTime);

    // Sync selected state if initialValue changes (e.g., browser back/forward)
    useEffect(() => {
        const skillsFromUrl = initialValue.split(",").filter(Boolean);
        setSelectedSkills(new Set(skillsFromUrl));
    }, [initialValue]);

    // Function to handle selection change
    const handleSelect = (skill: string) => {
        const newSelectedSkills = new Set(selectedSkills);
        if (newSelectedSkills.has(skill)) {
            newSelectedSkills.delete(skill);
        } else {
            newSelectedSkills.add(skill);
        }
        setSelectedSkills(newSelectedSkills); // Update state immediately for visual feedback
        debouncedUpdateUrl(newSelectedSkills); // Trigger debounced URL update
    };

    // Function to handle clearing filters
    const handleClear = () => {
        const newSelectedSkills = new Set<string>();
        setSelectedSkills(newSelectedSkills);
        debouncedUpdateUrl(newSelectedSkills);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {title}
                    {selectedSkills.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedSkills.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedSkills.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedSkills.size} selected
                                    </Badge>
                                ) : (
                                    Array.from(selectedSkills)
                                        .slice(0, 2)
                                        .map((skill) => (
                                            <Badge
                                                variant="secondary"
                                                key={skill}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {skill}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>{isLoading ? "Loading..." : error || "No skills found."}</CommandEmpty>
                        <CommandGroup>
                            {availableSkills.map((skill) => {
                                const isSelected = selectedSkills.has(skill);
                                return (
                                    <CommandItem
                                        key={skill}
                                        onSelect={() => handleSelect(skill)}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className={cn("h-4 w-4")} />
                                        </div>
                                        <span>{skill}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedSkills.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={handleClear}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
} 