'use client';

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X as XIcon } from "lucide-react"; // For remove button
import { KeyboardEvent, useEffect, useState } from "react";

// Define props based on RHF Controller/FormField render prop
interface TagInputProps {
    value?: string[]; // Array of strings from RHF
    onChange: (value: string[]) => void; // Function to update RHF state
    placeholder?: string;
    disabled?: boolean;
    // Add other props like name, onBlur etc. if needed
}

export function TagInput({
    value = [], // Default to empty array if undefined
    onChange,
    placeholder,
    disabled,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState<string[]>(value);

    // Sync internal state with external value prop
    useEffect(() => {
        // Only update if external value is different to prevent infinite loops
        if (JSON.stringify(value) !== JSON.stringify(tags)) {
            setTags(value);
        }
    }, [value]); // Dependency on external value

    // Function to call RHF's onChange
    const triggerChange = (newTags: string[]) => {
        if (JSON.stringify(newTags) !== JSON.stringify(tags)) {
            setTags(newTags);
            onChange(newTags); // Update RHF form state
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleAddTag = () => {
        const newTag = inputValue.trim();
        // Prevent adding empty or duplicate tags
        if (newTag && !tags.includes(newTag)) {
            const newTags = [...tags, newTag];
            triggerChange(newTags);
            setInputValue(''); // Clear input
        } else {
            // Optionally provide feedback if tag is duplicate or empty
            setInputValue(''); // Clear input even if not added
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        triggerChange(newTags);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
            e.preventDefault(); // Prevent form submission on Enter/Tab
            handleAddTag();
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag on backspace if input is empty
            const newTags = tags.slice(0, -1);
            triggerChange(newTags);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        {!disabled && (
                            <button
                                type="button" // Prevent form submission
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={() => handleRemoveTag(tag)}
                                aria-label={`Remove ${tag}`}
                            >
                                <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </Badge>
                ))}
            </div>
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || "Add skills..."}
                disabled={disabled}
                className="w-full" // Ensure input takes full width
            />
            {/* We could add an explicit "Add" button too if desired */}
            {/* <Button type="button" onClick={handleAddTag} disabled={!inputValue.trim()}>Add</Button> */}
        </div>
    );
}
