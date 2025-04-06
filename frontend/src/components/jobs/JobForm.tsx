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
import { createJobAction, updateJobAction } from "@/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Zod schema
const formSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    requiredSkillsArray: z.array(z.string()).min(1, { message: "Please enter at least one skill." }),
    skills_string: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const initialFormState: ActionResult = { success: false, message: "" };

interface JobFormProps {
    initialData?: {
        _id: string;
        title: string;
        description: string;
        requiredSkills: string[];
    } | null;
    onSubmitSuccess?: (jobId?: string) => void;
}

export default function JobForm({ initialData, onSubmitSuccess }: JobFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;

    const boundUpdateAction = isEditing
        ? updateJobAction.bind(null, initialData._id)
        : undefined;

    const [state, formAction, isPending] = useActionState(
        isEditing ? boundUpdateAction! : createJobAction,
        initialFormState
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            requiredSkillsArray: initialData?.requiredSkills || [],
            skills_string: initialData?.requiredSkills?.join(',') || "",
        },
    });

    const skillsArrayValue = form.watch("requiredSkillsArray");
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
                        router.push(`/jobs/${initialData._id}`);
                    } else {
                        router.push('/jobs');
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
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Senior Frontend Engineer" {...field} aria-required="true" />
                            </FormControl>
                            <FormDescription>
                                The main title for the job posting.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the role, responsibilities, and company..."
                                    rows={5}
                                    {...field}
                                    aria-required="true"
                                />
                            </FormControl>
                            <FormDescription>
                                Provide details about the position.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="requiredSkillsArray"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Required Skills</FormLabel>
                            <FormControl>
                                <TagInput
                                    placeholder="Type a skill and press Enter..."
                                    {...field}
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormDescription>
                                Add skills needed for the job.
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
                    {isPending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Job' : 'Create Job')}
                </Button>
            </form>
        </Form>
    );
} 