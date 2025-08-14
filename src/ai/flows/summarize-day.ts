
'use server';

/**
 * @fileOverview A flow for generating an end-of-day summary for a sales host.
 * @description This flow analyzes all visitor interactions from a given day and produces a
 * concise, narrative summary highlighting key metrics, top leads, and potential trends.
 *
 * @exports summarizeDay - A function that generates the daily summary.
 * @exports SummarizeDayInput - The Zod schema for the input of the summarizeDay function.
 * @exports SummarizeDayOutput - The Zod schema for the return type of the summarizeDay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyVisitorInfoSchema = z.object({
  name: z.string().describe("The visitor's name."),
  status: z.enum(['Hot Now', 'Researching', 'Just Looking']).describe("The visitor's triage status."),
  budget: z.string().optional().describe("The visitor's budget range."),
  mustHave: z.string().optional().describe("The visitor's must-have feature."),
});

const SummarizeDayInputSchema = z.object({
  visitors: z.array(DailyVisitorInfoSchema).describe('A list of all visitors from the day.'),
});
export type SummarizeDayInput = z.infer<typeof SummarizeDayInputSchema>;

const SummarizeDayOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise, narrative summary of the day. It should be 2-3 sentences and read like a helpful sales manager giving a quick debrief. Mention the number of visitors and hot leads.'),
  pipeline: z.number().describe('The total potential sales pipeline value from all "Hot Now" and "Researching" leads for the day.'),
  holds: z.number().describe('The number of lots or homes put on hold today. For now, assume this is always 0.'),
});
export type SummarizeDayOutput = z.infer<typeof SummarizeDayOutputSchema>;


export async function summarizeDay(input: SummarizeDayInput): Promise<SummarizeDayOutput> {
  return summarizeDayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDayPrompt',
  input: {schema: SummarizeDayInputSchema},
  output: {schema: SummarizeDayOutputSchema},
  prompt: `You are an expert sales manager AI for a new home builder. Your task is to provide a concise end-of-day summary for a sales host based on their daily traffic.

  Analyze the following list of visitors for the day:
  {{#each visitors}}
  - Name: {{{name}}}, Status: {{{status}}}, Budget: {{{budget}}}, Must-Have: {{{mustHave}}}
  {{/each}}

  Instructions:
  1.  **Generate a Narrative Summary:** Write a 2-3 sentence summary of the day's activity. It should be encouraging and insightful. Mention the total number of visitors and specifically how many were "Hot Now".
  2.  **Calculate Pipeline:** Sum the *maximum* budget for all 'Hot Now' leads and the *minimum* budget for all 'Researching' leads. If a budget is a range (e.g., "$500k - $650k"), use the appropriate end of the range. If it's open-ended (e.g., "$800k+"), treat it as just the base number (e.g., 800000).
  3.  **Calculate Holds:** For this version, always return 0 for the number of holds.

  Return the results in the specified JSON format.
  `,
});


const summarizeDayFlow = ai.defineFlow(
  {
    name: 'summarizeDayFlow',
    inputSchema: SummarizeDayInputSchema,
    outputSchema: SummarizeDayOutputSchema,
  },
  async (input) => {
    // In a real scenario with many visitors, you might use a smaller model
    // or batch the input for a larger context window. For this app, it's fine.
    if (input.visitors.length === 0) {
      return {
        summary: "It was a quiet day. No visitors were recorded. Let's get ready for a great day tomorrow!",
        pipeline: 0,
        holds: 0,
      }
    }

    const {output} = await prompt(input);
    return output!;
  }
);
