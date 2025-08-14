'use server';

/**
 * @fileOverview A flow for triaging new visitors based on their intake form data.
 * @description This flow helps sales hosts quickly identify the readiness of a potential buyer
 * by classifying them into 'Hot Now', 'Researching', or 'Just Looking'.
 *
 * @exports triageVisitor - A function that triages a visitor.
 * @exports TriageVisitorInput - The Zod schema for the input of the triageVisitor function.
 * @exports TriageVisitorOutput - The Zod schema for the return type of the triageVisitor function.
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
    .describe('A brief, actionable explanation for why the visitor was assigned this status. This should be a sentence the sales host can use.'),
});
export type TriageVisitorOutput = z.infer<typeof TriageVisitorOutputSchema>;

export async function triageVisitor(input: TriageVisitorInput): Promise<TriageVisitorOutput> {
  return triageVisitorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'triageVisitorPrompt',
  input: {schema: TriageVisitorInputSchema},
  output: {schema: TriageVisitorOutputSchema},
  prompt: `You are an expert at qualifying leads for new home sales. Based on the following information from a visitor intake form, classify them and provide a concise reason for your classification.

  Visitor Information:
  - Budget: {{{budget}}}
  - Desired Move-in Timeline: {{{timeline}}}
  - Must-Have Feature: {{{mustHave}}}

  Classification Criteria:
  - "Hot Now": Short timeline (e.g., < 3 months), specific budget, clear must-haves. These are urgent, high-intent buyers.
  - "Researching": Mid-range timeline (3-6 months), may have a budget, exploring options. They are serious but not in a rush.
  - "Just Looking": Long timeline (>6 months or undecided), vague or no budget, general interest. They are early in the process and likely just exploring.

  Your task is to return a JSON object with the visitor's 'status' and a 'reasoning' for that status. The reasoning should be a single, actionable sentence.
  Example reasoning for a 'Hot Now' lead: "They have a clear budget and need to move in under 3 months."
  Example reasoning for a 'Researching' lead: "They are planning for the next 3-6 months and are starting to define what they want."
  Example reasoning for a 'Just Looking' lead: "With a timeline of over a year, they are in the very early stages of exploring the market."
  `,
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
