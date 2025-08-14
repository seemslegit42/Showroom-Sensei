'use server';

/**
 * @fileOverview Provides AI-driven upsell suggestions to sales hosts during a tour.
 * @description This flow is based on visitor behavior, stated preferences, and current selections.
 * The goal is to provide timely, relevant, and helpful recommendations that enhance
 * the visitor's experience and feel like helpful advice, not a hard sell.
 *
 * @exports getUpsellSuggestions - A function that generates upsell suggestions.
 * @exports UpsellSuggestionsInput - The Zod schema for the input of the getUpsellSuggestions function.
 * @exports UpsellSuggestionsOutput - The Zod schema for the return type of the getUpsellSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpsellSuggestionsInputSchema = z.object({
  visitorBehavior: z
    .string()
    .describe(
      'Observed behavior and direct quotes from the visitor during the tour. e.g., "They spent a lot of time in the kitchen and mentioned they love to cook."'
    ),
  statedPreferences: z
    .string()
    .describe(
      'Stated preferences of the visitor from the intake form or conversation. e.g., "Wants a home office and a large backyard."'
    ),
  currentSelections: z
    .string()
    .optional()
    .describe(
      'The options or finishes the visitor is currently looking at in the configurator. e.g., "Standard Finishes" or "Upgraded Hardwood Package".'
    ),
});
export type UpsellSuggestionsInput = z.infer<typeof UpsellSuggestionsInputSchema>;

const UpsellSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of 2-3 concise, actionable upsell suggestions tailored to the visitor. Each suggestion should be a specific feature, option, or lot to recommend.'
    ),
  reasoning: z
    .string()
    .describe(
      'The AI reasoning behind the suggestions, explaining concisely why these options are a good fit for this specific visitor.'
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
  prompt: `You are an AI assistant for a new home sales host, providing real-time upsell "nudges" during a customer tour.
  Your goal is to be helpful and insightful, not pushy.

  Analyze the following information about the visitor:
  - Observed Behavior & Cues: {{{visitorBehavior}}}
  - Stated Preferences: {{{statedPreferences}}}
  - Currently Viewing: {{{currentSelections}}}

  Based on this, generate a list of 2-3 specific, relevant upsell suggestions.
  These could be structural options, design upgrades, or a specific lot that fits their needs.
  Also, provide a brief reasoning for your suggestions.

  Example:
  - If Behavior is "loved the backyard space" and Preferences is "wants a place to entertain", a good suggestion would be "Suggest the outdoor kitchen package" with the reasoning "This directly aligns with their love for the backyard and desire to entertain guests."
  - If Currently Viewing is "Standard Finishes" and Preferences is "wants a durable floor for their dog", a good suggestion is "Recommend the luxury vinyl plank flooring upgrade" with reasoning "It's a stylish and highly durable option perfect for pets, addressing their specific need."

  Be mindful of not over-selling. The suggestions should feel like helpful advice that enhances their future home and lifestyle.
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
