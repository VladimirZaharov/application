'use server';

/**
 * @fileOverview This file defines a Genkit flow to adjust the tone of proposal text using AI.
 *
 * The flow takes proposal text and a desired tone as input, and returns the adjusted proposal text.
 * - adjustProposalTone - Adjusts the tone of the generated proposal text using AI.
 * - AdjustProposalToneInput - The input type for the adjustProposalTone function.
 * - AdjustProposalToneOutput - The return type for the adjustProposalTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustProposalToneInputSchema = z.object({
  proposalText: z.string().describe('Текст предложения для корректировки.'),
  desiredTone: z
    .string()
    .describe(
      'Желаемый тон для предложения (например, формальный, неформальный, технический).'
    ),
});

export type AdjustProposalToneInput = z.infer<typeof AdjustProposalToneInputSchema>;

const AdjustProposalToneOutputSchema = z.object({
  adjustedProposalText: z.string().describe('Текст предложения с скорректированным тоном.'),
});

export type AdjustProposalToneOutput = z.infer<typeof AdjustProposalToneOutputSchema>;

export async function adjustProposalTone(
  input: AdjustProposalToneInput
): Promise<AdjustProposalToneOutput> {
  return adjustProposalToneFlow(input);
}

const adjustProposalTonePrompt = ai.definePrompt({
  name: 'adjustProposalTonePrompt',
  input: {schema: AdjustProposalToneInputSchema},
  output: {schema: AdjustProposalToneOutputSchema},
  prompt: `Adjust the tone of the following proposal text to be {{{desiredTone}}}.\n\nProposal Text: {{{proposalText}}}`,
});

const adjustProposalToneFlow = ai.defineFlow(
  {
    name: 'adjustProposalToneFlow',
    inputSchema: AdjustProposalToneInputSchema,
    outputSchema: AdjustProposalToneOutputSchema,
  },
  async input => {
    const {output} = await adjustProposalTonePrompt(input);
    return output!;
  }
);
