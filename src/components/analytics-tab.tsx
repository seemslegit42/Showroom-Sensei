
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useMemo } from "react"
import type { ChartConfig } from "@/components/ui/chart"


// In a real app, this data would be fetched from your database.
const visitors: any[] = [];
const leadScoreData: any[] = [];
const objectionData: any[] = [];


const leadScoreChartConfig = {
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

const objectionChartConfig = {
    value: {
      label: "Mentions",
      color: "hsl(var(--accent))"
    },
} satisfies ChartConfig


export function AnalyticsTab() {
  const summary = useMemo(() => {
    const totalVisitors = visitors.length;
    const hotLeads = visitors.filter(v => v.status === 'Hot Now').length;
    const holds = 0; // This would come from a database in a real app
    const pipeline = visitors
        .filter(v => v.status === 'Hot Now' || v.status === 'Researching')
        .reduce((acc, v) => acc + 650000, 0); // Using an average home price for demo

    return {
        totalVisitors,
        hotLeads,
        holds,
        pipeline
    }
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Lead Funnel</CardTitle>
          <CardDescription>Breakdown of current visitor statuses.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={leadScoreChartConfig} className="h-[300px] w-full">
                <BarChart data={leadScoreData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
                    <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} >
                        <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Objection Trends</CardTitle>
          <CardDescription>Most common customer objections this month.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={objectionChartConfig} className="h-[300px] w-full">
                <BarChart data={objectionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis />
                    <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
            <CardTitle>Today's Shift Summary</CardTitle>
            <CardDescription>Sarah P. - South Edmonton Showhome</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div>
                <p className="text-3xl font-bold text-primary">{summary.totalVisitors}</p>
                <p className="text-sm text-muted-foreground">Visitors</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-destructive">{summary.hotLeads}</p>
                <p className="text-sm text-muted-foreground">Hot Leads</p>
            </div>
             <div>
                <p className="text-3xl font-bold text-accent">{summary.holds}</p>
                <p className="text-sm text-muted-foreground">Holds</p>
            </div>
             <div>
                <p className="text-3xl font-bold">${(summary.pipeline / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Pipeline</p>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
