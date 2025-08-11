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
import { ArrowLeft, Bot, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VisitorIntakePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            toast({
                title: 'Please enter a name',
                description: 'We need a name to address the visitor.',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: `Welcome, ${name}!`,
            description: "You've been checked in. A sales host will be with you shortly.",
        });
        // In a real app, you'd save this data.
        // For now, we'll just redirect to the main page.
        router.push('/');
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
                            <Input id="name" placeholder="e.g., The Johnson Family" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="budget">What's your budget?</Label>
                            <Select>
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
                             <Select>
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
                            <Textarea id="must-have" placeholder="e.g., A big backyard for the dog, a home office, a walk-in pantry..." />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full">
                            <Send className="w-4 h-4 mr-2" />
                            Start My Tour
                        </Button>
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full">
                               <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
