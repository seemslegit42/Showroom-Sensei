
"use client";

import React, { useState } from 'react';
import { generateVisitRecap, type VisitRecapOutput } from '@/ai/flows/personalized-follow-up';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Wand2, Paperclip, Send, Image as ImageIcon, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import type { VisitWithVisitor } from '@/lib/types';

export function AutomatedFollowup({ visit }: { visit: VisitWithVisitor }) {
  const [notes, setNotes] = useState('');
  const [preferences, setPreferences] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [recap, setRecap] = useState<VisitRecapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const filePromises = files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises)
        .then(dataUris => {
          setPhotos(prevPhotos => [...prevPhotos, ...dataUris]);
          toast({
            title: `${files.length} photo(s) attached.`
          })
        })
        .catch(error => {
          console.error("Error reading files:", error);
          toast({
            title: "Error attaching photos",
            description: "There was a problem reading the selected files.",
            variant: "destructive"
          })
        });
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes && !preferences && photos.length === 0) {
        toast({
            title: "Missing Information",
            description: "Please enter some preferences, notes or attach photos to generate a recap.",
            variant: "destructive"
        })
        return;
    }
    setIsLoading(true);
    setRecap(null);
    try {
      const result = await generateVisitRecap({
        customerName: visit.visitor.name || 'Valued Customer',
        customerPreferences: preferences,
        notes: notes,
        photosDataUris: photos,
        // In a real app, this would be dynamically pulled from inventory
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
        description: `Follow-up has been sent to ${visit.visitor.name}.`,
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
                <Input id="photos" type="file" onChange={handleFileChange} multiple accept="image/*" className="hidden" />
                <Label htmlFor="photos" className="w-full">
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <span className="cursor-pointer">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Select Photos
                    </span>
                  </Button>
                </Label>
            </div>
             {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4 sm:grid-cols-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                           <Image src={photo} alt={`Attached photo ${index + 1}`} width={100} height={100} className="object-cover w-full rounded-md aspect-square" />
                           <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removePhoto(index)}
                            >
                                <X className="w-4 h-4"/>
                           </Button>
                        </div>
                    ))}
                </div>
            )}
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
                        Send to {visit.visitor.name}
                    </Button>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
