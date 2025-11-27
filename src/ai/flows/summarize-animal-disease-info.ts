'use server';
/**
 * @fileOverview Summarizes information about an animal disease, including causes and potential treatments.
 *
 * - summarizeAnimalDiseaseInfo - A function that summarizes animal disease information.
 * - SummarizeAnimalDiseaseInfoInput - The input type for the summarizeAnimalDiseaseInfo function.
 * - SummarizeAnimalDiseaseInfoOutput - The return type for the summarizeAnimalDiseaseInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAnimalDiseaseInfoInputSchema = z.object({
  diseaseName: z.string().describe('The name of the animal disease to summarize.'),
});
export type SummarizeAnimalDiseaseInfoInput = z.infer<typeof SummarizeAnimalDiseaseInfoInputSchema>;

const SummarizeAnimalDiseaseInfoOutputSchema = z.object({
  summary: z.string().describe('A summary of the animal disease, its causes, and potential treatments.'),
});
export type SummarizeAnimalDiseaseInfoOutput = z.infer<typeof SummarizeAnimalDiseaseInfoOutputSchema>;

export async function summarizeAnimalDiseaseInfo(input: SummarizeAnimalDiseaseInfoInput): Promise<SummarizeAnimalDiseaseInfoOutput> {
  return summarizeAnimalDiseaseInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAnimalDiseaseInfoPrompt',
  input: {schema: SummarizeAnimalDiseaseInfoInputSchema},
  output: {schema: SummarizeAnimalDiseaseInfoOutputSchema},
  prompt: `Summarize the following animal disease, including its causes and potential treatments:\n\nDisease Name: {{{diseaseName}}}`,
});

const summarizeAnimalDiseaseInfoFlow = ai.defineFlow(
  {
    name: 'summarizeAnimalDiseaseInfoFlow',
    inputSchema: SummarizeAnimalDiseaseInfoInputSchema,
    outputSchema: SummarizeAnimalDiseaseInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
