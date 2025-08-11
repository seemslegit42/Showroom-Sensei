'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, LogIn, Mail } from 'lucide-react';
import { signInWithEmail } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await signInWithEmail(email);

        if (result.success) {
            setEmailSent(true);
            toast({
                title: 'Check your email',
                description: result.message,
            });
        } else {
             toast({
                title: 'Sign-in Failed',
                description: result.message,
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };
    
    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case 'Configuration':
            case 'AccessDenied':
            case 'Verification':
                return 'There was a problem with the server configuration. Please contact support.';
            case 'Default':
            default:
                return 'An unknown error occurred. Please try again.';
        }
    }

    if (emailSent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
                <Card className="w-full max-w-sm">
                     <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Mail className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle>Check Your Inbox</CardTitle>
                        <CardDescription>
                            We've sent a magic sign-in link to <strong>{email}</strong>. Please click the link in that email to continue.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Bot className="w-8 h-8 text-primary" />
                            <h1 className="text-2xl font-bold font-headline">Showhome Sensei</h1>
                        </div>
                        <CardTitle>Host Sign-In</CardTitle>
                        <CardDescription>Enter your email to receive a magic sign-in link.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Authentication Error</AlertTitle>
                                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
                            </Alert>
                        )}
                        <div>
                            <Label htmlFor="email" className="sr-only">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="host@builder.com"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading || !email}>
                            {isLoading ? 'Sending...' : <><LogIn className="w-4 h-4 mr-2" /> Send Magic Link </> }
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
