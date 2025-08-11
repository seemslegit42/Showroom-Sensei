"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { visitors } from '@/lib/data';
import { ArrowLeft, Bot, Building, Paintbrush, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisitorDetails } from '@/components/tour/visitor-details';
import { AiUpsell } from '@/components/tour/ai-upsell';
import { OptionConfigurator } from '@/components/tour/option-configurator';
import { NeighborhoodInsights } from '@/components/tour/neighborhood-insights';
import { AutomatedFollowup } from '@/components/tour/automated-followup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VisitorTourPage() {
  const params = useParams();
  const visitorId = params.id as string;
  const visitor = visitors.find(v => v.id === visitorId);

  if (!visitor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4 text-lg">Visitor not found.</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex items-center h-16 px-4 border-b shrink-0 bg-background/90 backdrop-blur-sm sm:px-6">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold truncate font-headline">{visitor.name} - Tour</h1>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Tabs defaultValue="configurator" className="w-full">
              <TabsList>
                <TabsTrigger value="configurator"><Paintbrush className="w-4 h-4 mr-2" />Option Configurator</TabsTrigger>
                <TabsTrigger value="insights"><Building className="w-4 h-4 mr-2" />Neighborhood</TabsTrigger>
              </TabsList>
              <TabsContent value="configurator" className="mt-4">
                <OptionConfigurator />
              </TabsContent>
              <TabsContent value="insights" className="mt-4">
                <NeighborhoodInsights />
              </TabsContent>
            </Tabs>
            <AutomatedFollowup visitor={visitor} />
          </div>
          <div className="space-y-6 lg:col-span-1">
            <VisitorDetails visitor={visitor} />
            <AiUpsell />
          </div>
        </div>
      </main>
    </div>
  );
}
