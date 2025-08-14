"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { visitors } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, UserCheck, Flame, Search, Eye } from 'lucide-react';

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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Visitors</CardTitle>
        <Link href="/visitor-intake">
          <Button>
            <PlusCircle />
            New Visitor Intake
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visitors.map((visitor) => (
            <Link href={`/visitors/${visitor.id}`} key={visitor.id} className="block transition-transform duration-200 hover:scale-[1.02]">
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <UserCheck className="w-10 h-10 mr-4 text-primary" />
                    <div>
                      <p className="font-semibold font-headline">{visitor.name}</p>
                      <p className="text-sm text-muted-foreground">Checked in at {visitor.checkInTime} with {visitor.agent}</p>
                    </div>
                  </div>
                  <Badge variant={statusColors[visitor.status]} className="flex items-center gap-2 py-1 px-3">
                    {statusIcons[visitor.status]}
                    {visitor.status}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
