
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, LogIn, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background/90 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary"/>
          <h1 className="text-xl font-bold font-headline">Showhome Sidekick</h1>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" passHref>
            <Button variant="outline">
              <LogIn className="w-4 h-4 mr-2" />
              Host Sign-In
            </Button>
          </Link>
          <Link href="/visitor-intake" passHref>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Start Your Tour
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 px-4 py-12 mx-auto md:py-24 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 text-sm rounded-lg bg-muted text-muted-foreground">
              The AI-Powered OS for New Home Sales
            </div>
            <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-5xl xl:text-6xl/none">
              One tap, look brilliant.
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Turn every showhome visit into a qualified lead. Showhome Sidekick is the in-hand assistant for sales hosts and the intelligence engine for builders.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/login" passHref>
                <Button size="lg">I'm a Sales Host</Button>
              </Link>
              <Link href="/visitor-intake" passHref>
                <Button size="lg" variant="secondary">I'm Visiting a Showhome</Button>
              </Link>
            </div>
          </div>
          <Image
            src="https://placehold.co/600x400.png"
            width="600"
            height="400"
            alt="Hero"
            data-ai-hint="modern home interior"
            className="mx-auto overflow-hidden rounded-xl object-cover"
          />
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 mx-auto md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter font-headline sm:text-5xl">The Four Pillars of Success</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            From the moment a visitor arrives to the final follow-up, our platform streamlines every interaction.
                        </p>
                    </div>
                </div>
                <div className="grid items-start max-w-5xl gap-8 mx-auto mt-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <h3 className="text-lg font-bold">1. Welcome & Triage</h3>
                            <p className="text-sm text-muted-foreground">Frictionless QR/NFC intake instantly classifies visitors as Hot, Researching, or Just Looking.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <h3 className="text-lg font-bold">2. Intelligent Tour</h3>
                            <p className="text-sm text-muted-foreground">Access live inventory, visualize options, and get AI-powered upsell nudges in real-time.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <h3 className="text-lg font-bold">3. Automated Nurturing</h3>
                            <p className="text-sm text-muted-foreground">Send personalized recaps with photos and details before visitors even leave the driveway.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 space-y-2">
                            <h3 className="text-lg font-bold">4. Big Picture Analytics</h3>
                            <p className="text-sm text-muted-foreground">Get daily summaries, lead scoring, and objection trend tracking to optimize your sales strategy.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
      </main>
      <footer className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-sm border-t shrink-0 h-fit md:flex-row md:px-6">
        <p className="text-muted-foreground">&copy; 2025 Showhome Sidekick. All rights reserved.</p>
      </footer>
    </div>
  );
}
