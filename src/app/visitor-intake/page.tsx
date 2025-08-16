
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Bot, Send, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { triageVisitor, type TriageVisitorInput } from '@/ai/flows/triage-visitor';
import { createVisitorAndVisit, seedDatabase } from '@/lib/actions';
import { VisitorIntakeFormSchema, type VisitorIntakeForm } from '@/lib/validators';

// We define a client-side schema without the 'status' field for the form.
const formSchema = VisitorIntakeFormSchema.omit({ status: true });

export default function VisitorIntakePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            budget: "",
            timeline: "",
            mustHave: "",
        },
    });

    const nameValue = form.watch('name');

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        // Temporary seeding mechanism
        if (values.name === 'Seed Database') {
            try {
                await seedDatabase();
                toast({
                    title: 'Database Seeded!',
                    description: 'Sample data has been added. You can now use the app.',
                });
                router.push('/dashboard');
            } catch(error) {
                 console.error("Error seeding database:", error);
                 toast({
                    title: 'Seeding Failed',
                    description: (error as Error).message,
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
            return;
        }

        try {
            const triageInput: TriageVisitorInput = {
                budget: values.budget || undefined,
                timeline: values.timeline || undefined,
                mustHave: values.mustHave || undefined,
            }
            const triageResult = await triageVisitor(triageInput);

            const visitorData: VisitorIntakeForm = {
                ...values,
                status: triageResult.status,
            }

            const newVisit = await createVisitorAndVisit(visitorData);

            toast({
                title: `${values.name} triaged as: ${triageResult.status}`,
                description: `${triageResult.reasoning}. Redirecting to tour...`,
            });
            
            router.push(`/visitors/${newVisit.id}`);

        } catch(error) {
            console.error("Error triaging visitor:", error);
            toast({
                title: 'AI Triage Failed',
                description: "Could not triage visitor. Proceeding with manual intake.",
                variant: 'destructive',
            });
            // Still proceed even if AI fails
             router.push('/dashboard');
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <Card className="w-full max-w-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Bot className="w-8 h-8 text-primary" />
                                <h1 className="text-2xl font-bold font-headline">Showhome Sensei</h1>
                            </div>
                            <CardTitle>Welcome!</CardTitle>
                            <CardDescription>Just a few quick questions to personalize your tour.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>What's your name?</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., The Johnson Family, or type 'Seed Database' to start" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>What's your budget?</FormLabel>
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a range" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="<500">$400k - $500k</SelectItem>
                                                <SelectItem value="500-650">$500k - $650k</SelectItem>
                                                <SelectItem value="650-800">$650k - $800k</SelectItem>
                                                <SelectItem value=">800">$800k+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="timeline"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>What's your move-in timeline?</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a timeline" />
                                                </Trigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="<3">Within 3 months</SelectItem>
                                                <SelectItem value="3-6">3-6 months</SelectItem>
                                                <SelectItem value="6-12">6-12 months</SelectItem>
                                                <SelectItem value=">12">12+ months</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mustHave"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>What's one must-have feature?</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., A big backyard for the dog, a home office, a walk-in pantry..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full" disabled={isLoading || !nameValue}>
                                {isLoading ? 'Processing...' : <><Wand2 /> Start My Tour </> }
                            </Button>
                            <Link href="/dashboard" className="w-full">
                                <Button variant="outline" className="w-full" disabled={isLoading}>
                                   <ArrowLeft />
                                   Back to Dashboard
                                </Button>
                            </Link>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
