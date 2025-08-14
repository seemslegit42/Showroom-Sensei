
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Bot, Send, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { triageVisitor, type TriageVisitorInput } from '@/ai/flows/triage-visitor';
import { createVisitorAndVisit, seedDatabase } from '@/lib/actions';

export default function VisitorIntakePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [budget, setBudget] = useState('');
    const [timeline, setTimeline] = useState('');
    const [mustHave, setMustHave] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast({
                title: 'Please enter a name',
                description: 'We need a name to address the visitor.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        // Temporary seeding mechanism
        if (name === 'Seed Database') {
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
                budget: budget || undefined,
                timeline: timeline || undefined,
                mustHave: mustHave || undefined,
            }
            const triageResult = await triageVisitor(triageInput);

            const visitorData = {
                name,
                budget,
                timeline,
                mustHave,
                status: triageResult.status,
            }

            const newVisit = await createVisitorAndVisit(visitorData);

            toast({
                title: `${name} triaged as: ${triageResult.status}`,
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
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <Card className="w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Bot className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl font-bold font-headline">Showhome Sensei</h1>
                        </div>
                        <CardTitle>Welcome!</CardTitle>
                        <CardDescription>Just a few quick questions to personalize your tour.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name">What's your name?</Label>
                            <Input id="name" placeholder="e.g., The Johnson Family, or type 'Seed Database' to start" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="budget">What's your budget?</Label>
                            <Select onValueChange={setBudget} value={budget}>
                                <SelectTrigger id="budget">
                                    <SelectValue placeholder="Select a range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<500">$400k - $500k</SelectItem>
                                    <SelectItem value="500-650">$500k - $650k</SelectItem>
                                    <SelectItem value="650-800">$650k - $800k</SelectItem>
                                    <SelectItem value=">800">$800k+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="timeline">What's your move-in timeline?</Label>
                             <Select onValueChange={setTimeline} value={timeline}>
                                <SelectTrigger id="timeline">
                                    <SelectValue placeholder="Select a timeline" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="<3">Within 3 months</SelectItem>
                                    <SelectItem value="3-6">3-6 months</SelectItem>
                                    <SelectItem value="6-12">6-12 months</SelectItem>
                                    <SelectItem value=">12">12+ months</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="must-have">What's one must-have feature?</Label>
                            <Textarea id="must-have" placeholder="e.g., A big backyard for the dog, a home office, a walk-in pantry..." value={mustHave} onChange={(e) => setMustHave(e.target.value)}/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
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
            </Card>
        </div>
    );
}
