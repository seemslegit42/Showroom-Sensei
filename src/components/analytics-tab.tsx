
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { getAnalyticsData } from "@/lib/actions";
import { summarizeDay } from "@/ai/flows/summarize-day";
import { Bot } from "lucide-react";

const leadScoreChartConfig = {
  value: {
    label: "Visitors",
  },
  'Hot Now': {
    label: "Hot Now",
    color: "hsl(var(--destructive))",
  },
  'Researching': {
    label: "Researching",
    color: "hsl(var(--primary))",
  },
  'Just Looking': {
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


export async function AnalyticsTab() {
  const { allVisits, leadScoreData, objectionData } = await getAnalyticsData();

  const dailySummary = await summarizeDay({ 
      visitors: allVisits.map(v => ({
          name: v.visitor.name || 'Unknown',
          status: v.stage || 'Just Looking',
          budget: v.budgetMin && v.budgetMax ? `$${v.budgetMin/1000}k - $${v.budgetMax/1000}k` : (v.budgetMin ? `$${v.budgetMin/1000}k+` : 'Not specified'),
          mustHave: v.mustHave || 'Not specified'
      }))
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="lg:col-span-2">
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
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="var(--color-name)">
                        <LabelList dataKey="value" position="right" offset={8} className="fill-foreground" fontSize={12} />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
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
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
            <CardTitle className="flex items-center"><Bot className="w-5 h-5 mr-2 text-primary" /> Today's Shift Summary</CardTitle>
            <CardDescription>AI-generated overview of today's visitors and key metrics.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="mb-6 text-muted-foreground">{dailySummary.summary}</p>
            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
                <div>
                    <p className="text-3xl font-bold text-primary">{allVisits.length}</p>
                    <p className="text-sm text-muted-foreground">Total Visitors</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-destructive">{leadScoreData.find(d => d.name === 'Hot Now')?.value || 0}</p>
                    <p className="text-sm text-muted-foreground">Hot Leads</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-accent">{dailySummary.holds}</p>
                    <p className="text-sm text-muted-foreground">Holds</p>
                </div>
                <div>
                    <p className="text-3xl font-bold">${(dailySummary.pipeline / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-muted-foreground">Pipeline</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
