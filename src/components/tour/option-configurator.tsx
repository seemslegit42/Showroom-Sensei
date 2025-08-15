
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { VisitorDetails } from './visitor-details';
import { AiUpsell } from './ai-upsell';
import type { VisitWithVisitor } from '@/lib/types';


export function OptionConfiguratorWrapper({ visit }: { visit: VisitWithVisitor }) {
  const [currentSelections, setCurrentSelections] = useState('Standard Finishes');

  return (
    <>
      <VisitorDetails visit={visit} />
      <AiUpsell visit={visit} currentSelections={currentSelections} />
      <OptionConfigurator onSelectionChange={setCurrentSelections} />
    </>
  )
}

type OptionConfiguratorProps = {
  onSelectionChange: (selection: string) => void;
};

export function OptionConfigurator({ onSelectionChange }: OptionConfiguratorProps) {
  const [showUpgraded, setShowUpgraded] = useState(false);

  useEffect(() => {
    onSelectionChange(showUpgraded ? 'Upgraded Finishes' : 'Standard Finishes');
  }, [showUpgraded, onSelectionChange]);


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>Option Configurator</CardTitle>
                <CardDescription>Visualize upgrades and finishes.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                <Label htmlFor="upgrade-switch" className={!showUpgraded ? 'text-primary font-bold' : ''}>Standard</Label>
                <Switch id="upgrade-switch" checked={showUpgraded} onCheckedChange={setShowUpgraded} />
                <Label htmlFor="upgrade-switch" className={showUpgraded ? 'text-primary font-bold' : ''}>Upgraded</Label>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" data-ai-hint="standard kitchen" alt="Standard Kitchen" width={600} height={400} className="object-cover transition-opacity duration-300" style={{ opacity: showUpgraded ? 0.3 : 1 }} />
                <div className="absolute bottom-2 left-2 bg-background/70 p-2 rounded-md font-bold text-lg">Standard Finishes</div>
            </div>
            <div className="relative overflow-hidden rounded-lg">
                <Image src="https://placehold.co/600x400.png" data-ai-hint="upgraded kitchen" alt="Upgraded Kitchen" width={600} height={400} className="object-cover transition-opacity duration-300" style={{ opacity: showUpgraded ? 1 : 0.3 }} />
                <div className="absolute bottom-2 left-2 bg-primary/70 p-2 rounded-md font-bold text-lg text-primary-foreground">Upgraded Finishes</div>
            </div>
        </div>
        <p className="mt-4 text-center text-muted-foreground">Now comparing kitchens. Use the switch to toggle between packages.</p>
      </CardContent>
    </Card>
  );
}
