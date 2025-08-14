
"use client";

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { InventoryModel } from '@/lib/types';
import { getInventory } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';

const dataAiHints = ['modern home exterior', 'suburban house', 'luxury home', 'new construction house'];

export function InventoryTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState<InventoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getInventory()
      .then(data => setInventory(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredInventory = inventory.filter(home => home.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Inventory</CardTitle>
        <CardDescription>Search for available homes across all communities.</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by model name..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-4 space-y-2">
                        <Skeleton className="w-3/4 h-6" />
                        <Skeleton className="w-1/2 h-5" />
                        <div className="flex justify-between mt-2">
                            <Skeleton className="w-1/4 h-4" />
                            <Skeleton className="w-1/4 h-4" />
                            <Skeleton className="w-1/4 h-4" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="w-full h-10" />
                    </CardFooter>
                </Card>
            ))
        ) : filteredInventory.length === 0 ? (
             <div className="flex flex-col items-center justify-center col-span-full p-8 text-center border-2 border-dashed rounded-lg bg-muted/50">
                <Info className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-semibold">No Inventory Found</h3>
                <p className="text-muted-foreground">Try seeding the database to see available home models.</p>
                <p className="mt-2 text-xs text-muted-foreground">Tip: Go to the Visitor Intake form and type "Seed Database" in the name field.</p>
            </div>
        ) : (
          filteredInventory.map((home, i) => (
            <Card key={home.id} className="overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/20">
              <CardHeader className="p-0">
                <Image
                  src={`https://placehold.co/600x400.png`}
                  alt={home.name}
                  width={600}
                  height={400}
                  data-ai-hint={dataAiHints[i % dataAiHints.length]}
                  className="object-cover transition-transform duration-200 aspect-video group-hover:scale-105"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="font-headline">{home.name}</CardTitle>
                <div className="mt-2 text-lg font-semibold text-primary">
                  ${parseFloat(home.basePrice).toLocaleString()}
                </div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{home.sqft.toLocaleString()} sqft</span>
                  <span>{home.beds} beds</span>
                  <span>{home.baths} baths</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" disabled>View Details</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
