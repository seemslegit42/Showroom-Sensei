
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, UserCheck, Flame, Search, Eye, Info } from 'lucide-react';
import { getActiveVisits } from '@/lib/actions';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { VisitWithVisitor } from '@/lib/types';


const statusIcons: { [key: string]: React.ReactNode } = {
  'Hot Now': <Flame className="w-4 h-4" />,
  'Researching': <Search className="w-4 h-4" />,
  'Just Looking': <Eye className="w-4 h-4" />,
};

const statusColors: { [key: string]: 'destructive' | 'secondary' | 'outline' } = {
  'Hot Now': 'destructive',
  'Researching': 'secondary',
  'Just Looking': 'outline',
};

export function WelcomeTab() {
  const [visits, setVisits] = useState<VisitWithVisitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getActiveVisits()
      .then(data => setVisits(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Visitors</CardTitle>
        <Link href="/visitor-intake">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Visitor Intake
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading visitors...</p>
          ) : visits.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-muted/50">
                <Info className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">No Active Visitors</h3>
                <p className="text-muted-foreground">Click "New Visitor Intake" to add the first visitor of the day.</p>
                <p className="mt-2 text-xs text-muted-foreground">Tip: Type "Seed Database" in the name field on the intake form to populate sample data.</p>
            </div>
          ) : (
            visits.map((visit) => (
              <Link href={`/visitors/${visit.id}`} key={visit.id} className="block transition-transform duration-200 hover:scale-[1.02]">
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <UserCheck className="w-10 h-10 mr-4 text-primary" />
                      <div>
                        <p className="font-semibold font-headline">{visit.visitor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Checked in at {visit.startedAt ? format(new Date(visit.startedAt), 'p') : 'N/A'} with {visit.host?.name || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    {visit.stage && (
                        <Badge variant={statusColors[visit.stage]} className="flex items-center gap-2 py-1 px-3">
                            {statusIcons[visit.stage]}
                            {visit.stage}
                        </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
