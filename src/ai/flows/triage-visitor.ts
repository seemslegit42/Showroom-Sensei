'use server';

/**
 * @fileOverview A flow for triaging new visitors based on their intake form data.
 *
 * - triageVisitor - A function that triages a visitor.
 * - TriageVisitorInput - The input type for the triageVisitor function.
 * - TriageVisitorOutput - The return type for the triageVisitor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TriageVisitorInputSchema = z.object({
  budget: z.string().optional().describe("The visitor's stated budget range."),
  timeline: z.string().optional().describe("The visitor's move-in timeline."),
  mustHave: z.string().optional().describe("The visitor's 'must-have' feature in a new home."),
});
export type TriageVisitorInput = z.infer<typeof TriageVisitorInputSchema>;

const TriageVisitorOutputSchema = z.object({
  status: z
    .enum(['Hot Now', 'Researching', 'Just Looking'])
    .describe('The triage status of the visitor based on their inputs.'),
  reasoning: z
    .string()
    .describe('A brief explanation for why the visitor was assigned this status.'),
});
export type TriageVisitorOutput = z.infer<typeof TriageVisitorOutputSchema>;

export async function triageVisitor(input: TriageVisitorInput): Promise<TriageVisitorOutput> {
  return triageVisitorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'triageVisitorPrompt',
  input: {schema: TriageVisitorInputSchema},
  output: {schema: TriageVisitorOutputSchema},
  prompt: `You are an expert at qualifying leads for new home sales. Based on the following information from a visitor, classify them as "Hot Now", "Researching", or "Just Looking".

  Budget: {{{budget}}}
  Timeline: {{{timeline}}}
  Must-Have Feature: {{{mustHave}}}

  Criteria:
  - "Hot Now": Short timeline (e.g., < 3 months), specific budget, clear must-haves. These are urgent buyers.
  - "Researching": Mid-range timeline (3-6 months), may have a budget, exploring options. They are serious but not in a rush.
  - "Just Looking": Long timeline (>6 months or undecided), vague or no budget, general interest. They are early in the process.

  Provide the classification and a brief reasoning.`,
});

const triageVisitorFlow = ai.defineFlow(
  {
    name: 'triageVisitorFlow',
    inputSchema: TriageVisitorInputSchema,
    outputSchema: TriageVisitorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
