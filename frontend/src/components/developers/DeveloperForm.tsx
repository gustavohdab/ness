'use client';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/TagInput";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/actions";
import { createDeveloperAction, updateDeveloperAction } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema
const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    bio: z.string().optional(),
    skillsArray: z.array(z.string()).min(1, { message: "Please enter at least one skill." }),
    skills_string: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const initialFormState: ActionResult = { success: false, message: "" };

interface DeveloperFormProps {
    initialData?: {
        _id: string;
        name: string;
        bio?: string;
        skills: string[];
    } | null;
    onSubmitSuccess?: (developerId?: string) => void;
}

export default function DeveloperForm({ initialData, onSubmitSuccess }: DeveloperFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;

    const boundUpdateAction = isEditing
        ? updateDeveloperAction.bind(null, initialData._id)
        : undefined;

    const [state, formAction, isPending] = useActionState(
        isEditing ? boundUpdateAction! : createDeveloperAction,
        initialFormState
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            bio: initialData?.bio || "",
            skillsArray: initialData?.skills || [],
            skills_string: initialData?.skills?.join(',') || "",
        },
    });

    const skillsArrayValue = form.watch("skillsArray");
    useEffect(() => {
        form.setValue("skills_string", skillsArrayValue.join(','));
    }, [skillsArrayValue, form]);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
                if (onSubmitSuccess) {
                    onSubmitSuccess(isEditing ? initialData?._id : state.data?._id);
                } else {
                    if (isEditing) {
                        router.push(`/developers/${initialData._id}`);
                    } else {
                        router.push('/developers');
                    }
                }
            } else {
                toast.error(state.message, { description: state.error });
            }
        }
    }, [state, router, isEditing, initialData?._id, onSubmitSuccess, form]);

    return (
        <Form {...form}>
            <form action={formAction} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Ada Lovelace" {...field} aria-required="true" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a bit about yourself..."
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="skillsArray"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                                <TagInput
                                    placeholder="Type a skill and press Enter..."
                                    {...field}
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormDescription>
                                Add relevant developer skills.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <input type="hidden" {...form.register("skills_string")} />

                {state?.message && !state?.success && (
                    <p className="text-sm font-medium text-destructive">{state.error || state.message}</p>
                )}

                <Button type="submit" disabled={isPending}>
                    {isPending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Profile' : 'Create Profile')}
                </Button>
            </form>
        </Form>
    );
} 