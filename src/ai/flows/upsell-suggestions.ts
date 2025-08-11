// Upsell suggestions flow
'use server';
/**
 * @fileOverview Provides AI-driven upsell suggestions to sales hosts during a tour, based on visitor behavior and stated preferences.
 *
 * - getUpsellSuggestions - A function that generates upsell suggestions.
 * - UpsellSuggestionsInput - The input type for the getUpsellSuggestions function.
 * - UpsellSuggestionsOutput - The return type for the getUpsellSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpsellSuggestionsInputSchema = z.object({
  visitorBehavior: z
    .string()
    .describe(
      'Observed behavior of the visitor during the tour, including their interactions, questions, and reactions.'
    ),
  statedPreferences: z
    .string()
    .describe(
      'Stated preferences of the visitor regarding home features, options, and upgrades.'
    ),
  currentSelections: z
    .string()
    .optional()
    .describe(
      'The options the visitor has currently selected.'
    ),
});
export type UpsellSuggestionsInput = z.infer<typeof UpsellSuggestionsInputSchema>;

const UpsellSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of upsell suggestions tailored to the visitor, including specific options and upgrades to recommend.'
    ),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning behind the suggestions, explaining why each option is recommended based on the visitor data.'
    ),
});
export type UpsellSuggestionsOutput = z.infer<typeof UpsellSuggestionsOutputSchema>;

export async function getUpsellSuggestions(input: UpsellSuggestionsInput): Promise<UpsellSuggestionsOutput> {
  return upsellSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'upsellSuggestionsPrompt',
  input: {schema: UpsellSuggestionsInputSchema},
  output: {schema: UpsellSuggestionsOutputSchema},
  prompt: `You are an AI assistant for new home sales, providing upsell suggestions to sales hosts during tours.

  Based on the visitor's behavior, stated preferences, and current selections, suggest relevant upsell options.

  Visitor Behavior: {{{visitorBehavior}}}
  Stated Preferences: {{{statedPreferences}}}
  Current Selections: {{{currentSelections}}}

  Provide a list of concise upsell suggestions and the reasoning behind each suggestion.
  Format the output as a JSON object with "suggestions" (an array of suggestions) and "reasoning" (the AI reasoning).
  Make the suggestions based on what the client has said they like so far. For example, if they liked a lot of backyard space, suggest buying a lot that has an even larger backyard, or an upgrade package to add a deck, patio, or outdoor kitchen.
  Be mindful of not over-selling the client based on budget and other signals they may have provided.
  DO NOT be overly aggressive, just suggest options that may interest them and improve their home and lifestyle.
  `,
});

const upsellSuggestionsFlow = ai.defineFlow(
  {
    name: 'upsellSuggestionsFlow',
    inputSchema: UpsellSuggestionsInputSchema,
    outputSchema: UpsellSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
