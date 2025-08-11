import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, School, Park, ShoppingCart, Train } from 'lucide-react';
import Image from 'next/image';

const insights = [
    { icon: <School className="w-6 h-6 text-primary" />, title: 'Top-Rated Schools', description: 'Crestwood Elementary (9/10) and Northgate High (8/10) nearby.' },
    { icon: <Park className="w-6 h-6 text-primary" />, title: 'Green Spaces', description: '5 min walk to River Valley Park with trails and playgrounds.' },
    { icon: <ShoppingCart className="w-6 h-6 text-accent" />, title: 'Shopping & Dining', description: 'Edmonton City Centre mall is a 10-min drive away.' },
    { icon: <Train className="w-6 h-6 text-accent" />, title: 'Commute', description: 'Easy access to LRT station, 20 mins to downtown.' },
]

export function NeighborhoodInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighborhood Insights</CardTitle>
        <CardDescription>Explore the local community and amenities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
            <Image src="https://placehold.co/800x400.png" data-ai-hint="city map" alt="Map of neighborhood" layout="fill" objectFit="cover" className="opacity-20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <MapPin className="w-10 h-10 text-muted-foreground" />
                <p className="mt-2 font-semibold">Map View Placeholder</p>
                <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
            </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
            {insights.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    {item.icon}
                    <div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
