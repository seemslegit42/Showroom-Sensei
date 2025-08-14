"use client";

import React, { useState } from 'react';
import { getUpsellSuggestions, type UpsellSuggestionsOutput } from '@/ai/flows/upsell-suggestions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Wand2, Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast"

export function AiUpsell({ currentSelections }: { currentSelections?: string }) {
  const [behavior, setBehavior] = useState('');
  const [preferences, setPreferences] = useState('');
  const [suggestions, setSuggestions] = useState<UpsellSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!behavior && !preferences) {
        toast({
            title: "Missing Information",
            description: "Please enter some visitor behavior or preferences.",
            variant: "destructive"
        })
        return;
    }
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await getUpsellSuggestions({
        visitorBehavior: behavior,
        statedPreferences: preferences,
        currentSelections: currentSelections,
      });
      setSuggestions(result);
    } catch (error) {
      console.error("Error getting upsell suggestions:", error);
      toast({
        title: "AI Error",
        description: "Could not generate suggestions. Please try again.",
        variant: "destructive"
      })
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Bot className="w-5 h-5 mr-2 text-primary" /> AI Upsell Nudges</CardTitle>
        <CardDescription>Get real-time suggestions based on visitor interactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="behavior">Visitor Behavior & Cues</Label>
            <Textarea
              id="behavior"
              value={behavior}
              onChange={(e) => setBehavior(e.target.value)}
              placeholder="e.g., 'Loved the high ceilings, asked about backyard size...'"
            />
          </div>
          <div>
            <Label htmlFor="preferences">Stated Preferences</Label>
            <Textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g., 'Wants a home office, needs 4 bedrooms...'"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Wand2 />
            {isLoading ? 'Thinking...' : 'Get Suggestions'}
          </Button>
        </form>

        {(isLoading || suggestions) && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Suggestions:</h3>
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}
            {suggestions && (
              <div className="p-4 rounded-lg bg-muted">
                <ul className="space-y-2 list-disc list-inside">
                  {suggestions.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
                <p className="mt-4 text-xs italic text-muted-foreground flex"><Lightbulb className="inline w-4 h-4 mr-1 shrink-0 mt-0.5" /><span>{suggestions.reasoning}</span></p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
