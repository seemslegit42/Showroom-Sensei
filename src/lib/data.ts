
import type { ChartConfig } from "@/components/ui/chart"

export type Visitor = {
  id: string;
  name: string;
  status: 'Hot Now' | 'Researching' | 'Just Looking';
  checkInTime: string;
  agent: string;
  mustHave?: string;
};

export const visitors: Visitor[] = [
  { id: '1', name: 'The Johnson Family', status: 'Hot Now', checkInTime: '10:32 AM', agent: 'Sarah P.', mustHave: 'A big backyard for the dog' },
  { id: '2', name: 'David Chen', status: 'Researching', checkInTime: '11:15 AM', agent: 'Sarah P.', mustHave: 'A home office' },
  { id: '3', name: 'Maria Garcia', status: 'Just Looking', checkInTime: '11:45 AM', agent: 'John D.' },
  { id: '4', name: 'The Nguyens', status: 'Researching', checkInTime: '12:05 PM', agent: 'Sarah P.', mustHave: 'A walk-in pantry' },
];

export type Home = {
  id: string;
  name: string;
  price: number;
  sqft: number;
  beds: number;
  baths: number;
  imageUrl: string;
  dataAiHint: string;
};

export const inventory: Home[] = [
  { id: 'h1', name: 'The Aspen', price: 650000, sqft: 2400, beds: 4, baths: 3.5, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'modern house' },
  { id: 'h2', name: 'The Birch', price: 580000, sqft: 2100, beds: 3, baths: 2.5, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'suburban home' },
  { id: 'h3', name: 'The Cedar', price: 720000, sqft: 2800, beds: 5, baths: 4, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'luxury estate' },
  { id: 'h4', name: 'The Dogwood', price: 550000, sqft: 1950, beds: 3, baths: 2.5, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'craftsman home' },
  { id: 'h5', name: 'The Elm', price: 810000, sqft: 3200, beds: 5, baths: 4.5, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'new construction' },
  { id: 'h6', name: 'The Fir', price: 615000, sqft: 2250, beds: 4, baths: 3, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'family house' },
];

export const leadScoreData = [
  { name: "Hot Now", value: 15, fill: "var(--color-hot)" },
  { name: "Researching", value: 45, fill: "var(--color-researching)" },
  { name: "Just Looking", value: 25, fill: "var(--color-looking)" },
];

export const leadScoreChartConfig = {
  value: {
    label: "Visitors",
  },
  hot: {
    label: "Hot Now",
    color: "hsl(var(--destructive))",
  },
  researching: {
    label: "Researching",
    color: "hsl(var(--primary))",
  },
  looking: {
    label: "Just Looking",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export const objectionData = [
    { name: "Price", value: 35 },
    { name: "Location", value: 25 },
    { name: "Size", value: 20 },
    { name: "Timeline", value: 15 },
    { name: "Finishes", value: 5 },
];

export const objectionChartConfig = {
    value: {
      label: "Mentions",
      color: "hsl(var(--accent))"
    },
} satisfies ChartConfig
