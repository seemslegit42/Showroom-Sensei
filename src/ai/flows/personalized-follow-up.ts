'use server';

/**
 * @fileOverview Flow for generating personalized visit recaps for customers.
 *
 * - generateVisitRecap - A function that generates a personalized visit recap.
 * - VisitRecapInput - The input type for the generateVisitRecap function.
 * - VisitRecapOutput - The return type for the generateVisitRecap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisitRecapInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  customerPreferences: z.string().describe('The stated preferences of the customer during the visit.'),
  photosDataUris: z
    .array(z.string())
    .describe(
      "An array of photos taken during the visit, as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  notes: z.string().describe('Any additional notes taken during the visit.'),
  availableHomes: z.string().describe('A list of available homes that might interest the customer'),
});
export type VisitRecapInput = z.infer<typeof VisitRecapInputSchema>;

const VisitRecapOutputSchema = z.object({
  recap: z.string().describe('The personalized visit recap to send to the customer.'),
});
export type VisitRecapOutput = z.infer<typeof VisitRecapOutputSchema>;

export async function generateVisitRecap(input: VisitRecapInput): Promise<VisitRecapOutput> {
  return generateVisitRecapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVisitRecapPrompt',
  input: {schema: VisitRecapInputSchema},
  output: {schema: VisitRecapOutputSchema},
  prompt: `You are a helpful AI assistant that crafts personalized visit recaps for customers who have visited a show home.

  Use the following information to create a warm and engaging recap:

  Customer Name: {{{customerName}}}
  Customer Preferences: {{{customerPreferences}}}
  Photos: {{#each photosDataUris}}{{media url=this}}{{/each}}
  Notes: {{{notes}}}
  Available Homes: {{{availableHomes}}}

  Write a brief, personalized recap that highlights the customer's interests and includes a call to action to encourage follow-up engagement. Be sure to reference specific preferences that were shared.
  Do not be overly sales-y. Maintain a friendly tone.
  `,
});

const generateVisitRecapFlow = ai.defineFlow(
  {
    name: 'generateVisitRecapFlow',
    inputSchema: VisitRecapInputSchema,
    outputSchema: VisitRecapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
