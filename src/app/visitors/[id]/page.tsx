
import Link from 'next/link';
import { ArrowLeft, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptionConfiguratorWrapper } from '@/components/tour/option-configurator';
import { NeighborhoodInsights } from '@/components/tour/neighborhood-insights';
import { AutomatedFollowup } from '@/components/tour/automated-followup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { VisitWithVisitor } from '@/lib/types';
import { getVisitDetails } from '@/lib/actions';
import { notFound } from 'next/navigation';


export default async function VisitorTourPage({ params }: { params: { id: string } }) {
  const visitId = params.id;
  
  const visit: VisitWithVisitor | null = await getVisitDetails(visitId);

  if (!visit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4 text-lg text-destructive">Visitor not found.</p>
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
             <OptionConfiguratorWrapper visit={visit} />
          </div>
          <div className="space-y-6 lg:col-span-2 lg:col-start-1">
            <Tabs defaultValue="insights" className="w-full">
              <TabsList>
                <TabsTrigger value="insights"><Building />Neighborhood</TabsTrigger>
              </TabsList>
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
