'use server';

/**
 * @fileOverview Flow for generating personalized visit recaps for customers.
 * This flow takes customer details, preferences, photos, and notes to create
 * a warm, engaging, and personalized follow-up email.
 *
 * - generateVisitRecap - A function that generates a personalized visit recap.
 * - VisitRecapInput - The input type for the generateVisitRecap function.
 * - VisitRecapOutput - The return type for the generateVisitRecap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisitRecapInputSchema = z.object({
  customerName: z.string().describe('The name of the customer or family (e.g., "The Johnson Family").'),
  customerPreferences: z.string().describe('The specific features, styles, or needs the customer mentioned during their visit.'),
  photosDataUris: z
    .array(z.string())
    .describe(
      "An array of photos taken during the visit, as data URIs that must include a MIME type and use Base64 encoding. The AI should reference what it sees in these photos. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  notes: z.string().describe('Any personal details or notes taken by the sales host during the visit (e.g., names of children, specific comments made).'),
  availableHomes: z.string().describe('A comma-separated list of available home models that might interest the customer, which can be mentioned as potential options.'),
});
export type VisitRecapInput = z.infer<typeof VisitRecapInputSchema>;

const VisitRecapOutputSchema = z.object({
  recap: z.string().describe('The personalized visit recap email body to send to the customer. It should be friendly, reference specific details from the inputs, and have a clear call to action.'),
});
export type VisitRecapOutput = z.infer<typeof VisitRecapOutputSchema>;

export async function generateVisitRecap(input: VisitRecapInput): Promise<VisitRecapOutput> {
  return generateVisitRecapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVisitRecapPrompt',
  input: {schema: VisitRecapInputSchema},
  output: {schema: VisitRecapOutputSchema},
  prompt: `You are a helpful and perceptive AI assistant for a new home sales host. Your task is to craft a personalized visit recap email for a customer who has just toured a showhome.

  Your tone should be warm, friendly, and helpful, not overly sales-y. The goal is to build rapport and encourage the next step.

  Use the following information to create the recap:
  - Customer Name: {{{customerName}}}
  - Key Customer Preferences: {{{customerPreferences}}}
  - Photos from the Visit: {{#each photosDataUris}}{{media url=this}}{{/each}}
  - Host's Personal Notes: {{{notes}}}
  - Similar Available Homes: {{{availableHomes}}}

  Instructions:
  1.  Start with a warm and personal greeting.
  2.  Reference specific things they liked or mentioned, using the preferences, notes, and photos as inspiration. For example, if you see a photo of a kitchen and they mentioned loving the open concept, connect those two points.
  3.  If personal notes are available (like a child's name), incorporate them naturally to show you were listening.
  4.  Briefly mention one or two of the available homes as other options they might like based on their stated preferences.
  5.  End with a clear and friendly call to action, like scheduling a follow-up call or visiting another model.
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
