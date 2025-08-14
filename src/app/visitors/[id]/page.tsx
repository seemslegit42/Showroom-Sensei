
"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Building, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisitorDetails } from '@/components/tour/visitor-details';
import { AiUpsell } from '@/components/tour/ai-upsell';
import { OptionConfigurator } from '@/components/tour/option-configurator';
import { NeighborhoodInsights } from '@/components/tour/neighborhood-insights';
import { AutomatedFollowup } from '@/components/tour/automated-followup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from 'react';
import type { VisitWithVisitor } from '@/lib/types';
import { getVisitDetails } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function VisitorTourPage() {
  const params = useParams();
  const visitorId = params.id as string;
  const [visit, setVisit] = useState<VisitWithVisitor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSelections, setCurrentSelections] = useState('Standard Finishes');

  useEffect(() => {
    if (visitorId) {
      setIsLoading(true);
      getVisitDetails(parseInt(visitorId, 10))
        .then(data => {
          if (data) {
            setVisit(data);
          } else {
            setError('Visitor not found.');
          }
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load visitor data.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [visitorId]);


  if (isLoading) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-20 flex items-center h-16 px-4 border-b shrink-0 bg-background/90 backdrop-blur-sm sm:px-6">
           <Skeleton className="w-10 h-10 mr-4 rounded-full" />
           <Skeleton className="w-48 h-6" />
        </header>
        <main className="flex-1 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-1 lg:col-start-3">
                    <Skeleton className="h-48 rounded-lg" />
                    <Skeleton className="h-64 rounded-lg" />
                </div>
                <div className="space-y-6 lg:col-span-2 lg:col-start-1">
                    <Skeleton className="w-full h-96 rounded-lg" />
                    <Skeleton className="w-full h-80 rounded-lg" />
                </div>
            </div>
        </main>
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4 text-lg text-destructive">{error || 'Visitor not found.'}</p>
        <Link href="/dashboard" className="mt-4">
          <Button variant="outline">
            <ArrowLeft />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex items-center h-16 px-4 border-b shrink-0 bg-background/90 backdrop-blur-sm sm:px-6">
        <Link href="/dashboard" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold truncate font-headline">{visit.visitor.name} - Tour</h1>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-flow-col-dense">
          <div className="space-y-6 lg:col-span-1 lg:col-start-3">
            <VisitorDetails visit={visit} />
            <AiUpsell visit={visit} currentSelections={currentSelections} />
          </div>
          <div className="space-y-6 lg:col-span-2 lg:col-start-1">
            <Tabs defaultValue="configurator" className="w-full">
              <TabsList>
                <TabsTrigger value="configurator"><Paintbrush />Option Configurator</TabsTrigger>
                <TabsTrigger value="insights"><Building />Neighborhood</TabsTrigger>
              </TabsList>
              <TabsContent value="configurator" className="mt-4">
                <OptionConfigurator onSelectionChange={setCurrentSelections} />
              </TabsContent>
              <TabsContent value="insights" className="mt-4">
                <NeighborhoodInsights />
              </TabsContent>
            </Tabs>
            <AutomatedFollowup visit={visit} />
          </div>
        </div>
      </main>
    </div>
  );
}
