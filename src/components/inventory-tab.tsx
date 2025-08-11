"use client";

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { inventory } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function InventoryTab() {
  const [searchTerm, setSearchTerm] = useState('');
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
        {filteredInventory.map(home => (
          <Card key={home.id} className="overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/20">
            <CardHeader className="p-0">
              <Image
                src={home.imageUrl}
                alt={home.name}
                width={600}
                height={400}
                data-ai-hint={home.dataAiHint}
                className="object-cover transition-transform duration-200 aspect-video group-hover:scale-105"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="font-headline">{home.name}</CardTitle>
              <div className="mt-2 text-lg font-semibold text-primary">
                ${home.price.toLocaleString()}
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{home.sqft.toLocaleString()} sqft</span>
                <span>{home.beds} beds</span>
                <span>{home.baths} baths</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
