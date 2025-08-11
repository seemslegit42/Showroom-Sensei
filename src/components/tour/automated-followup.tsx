"use client";

import React, { useState } from 'react';
import type { Visitor } from '@/lib/data';
import { generateVisitRecap, type VisitRecapOutput } from '@/ai/flows/personalized-follow-up';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Wand2, Paperclip, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";

export function AutomatedFollowup({ visitor }: { visitor: Visitor }) {
  const [notes, setNotes] = useState('');
  const [preferences, setPreferences] = useState('');
  const [recap, setRecap] = useState<VisitRecapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes && !preferences) {
        toast({
            title: "Missing Information",
            description: "Please enter some preferences or notes to generate a recap.",
            variant: "destructive"
        })
        return;
    }
    setIsLoading(true);
    setRecap(null);
    try {
      const result = await generateVisitRecap({
        customerName: visitor.name,
        customerPreferences: preferences,
        notes: notes,
        photosDataUris: [],
        availableHomes: 'The Aspen, The Birch, The Cedar',
      });
      setRecap(result);
      toast({
        title: "Recap Generated",
        description: "AI-powered recap is ready for review.",
      })
    } catch (error) {
      console.error("Error generating recap:", error);
      toast({
        title: "AI Error",
        description: "Could not generate recap. Please try again.",
        variant: "destructive"
      })
    }
    setIsLoading(false);
  };

  const handleSend = () => {
    toast({
        title: "Email Sent!",
        description: `Follow-up has been sent to ${visitor.name}.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center"><Mail className="w-5 h-5 mr-2 text-primary" /> Automated Follow-Up</CardTitle>
        <CardDescription>Generate a personalized visit recap to send to the customer before they leave.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <Label htmlFor="preferences-recap">Key Preferences Mentioned</Label>
            <Textarea
              id="preferences-recap"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g., 'Loved the open concept kitchen, needs a south-facing backyard...'"
            />
          </div>
          <div>
            <Label htmlFor="notes-recap">Additional Personal Notes</Label>
            <Textarea
              id="notes-recap"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., 'Their son, Leo, was excited about the bonus room...'"
            />
          </div>
          <div>
            <Label htmlFor="photos">Attach Photos</Label>
            <div className="flex items-center gap-2">
                <Input id="photos" type="file" disabled className="cursor-not-allowed"/>
                <Button type="button" variant="outline" size="icon" disabled>
                    <Paperclip className="w-4 h-4" />
                </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Photo uploads are disabled in this demo.</p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Wand2 className="w-4 h-4 mr-2" />
            {isLoading ? 'Generating Recap...' : 'Generate AI Recap'}
          </Button>
        </form>

        {(isLoading || recap) && (
          <div className="pt-6 mt-6 border-t">
            <h3 className="mb-4 font-semibold">Generated Recap Preview:</h3>
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            )}
            {recap && (
                <div>
                    <Textarea value={recap.recap} readOnly rows={8} className="text-base bg-muted" />
                    <Button className="w-full mt-4" onClick={handleSend}>
                        <Send className="w-4 h-4 mr-2" />
                        Send to {visitor.name}
                    </Button>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
