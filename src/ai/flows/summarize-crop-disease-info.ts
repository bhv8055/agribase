'use server';
/**
 * @fileOverview Summarizes information about a crop disease, its causes, and potential treatments.
 *
 * - summarizeCropDiseaseInfo - A function that summarizes crop disease information.
 * - SummarizeCropDiseaseInfoInput - The input type for the summarizeCropDiseaseInfo function.
 * - SummarizeCropDiseaseInfoOutput - The return type for the summarizeCropDiseaseInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCropDiseaseInfoInputSchema = z.object({
  diseaseName: z
    .string()
    .describe('The name of the crop disease to summarize.'),
});
export type SummarizeCropDiseaseInfoInput = z.infer<
  typeof SummarizeCropDiseaseInfoInputSchema
>;

const SummarizeCropDiseaseInfoOutputSchema = z.object({
  summary: z.string().describe('A summary of the crop disease, its causes, and potential treatments.'),
});
export type SummarizeCropDiseaseInfoOutput = z.infer<
  typeof SummarizeCropDiseaseInfoOutputSchema
>;

export async function summarizeCropDiseaseInfo(
  input: SummarizeCropDiseaseInfoInput
): Promise<SummarizeCropDiseaseInfoOutput> {
  return summarizeCropDiseaseInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCropDiseaseInfoPrompt',
  input: {schema: SummarizeCropDiseaseInfoInputSchema},
  output: {schema: SummarizeCropDiseaseInfoOutputSchema},
  prompt: `Summarize the following crop disease, its causes, and potential treatments. Disease name: {{{diseaseName}}}`,
});

const summarizeCropDiseaseInfoFlow = ai.defineFlow(
  {
    name: 'summarizeCropDiseaseInfoFlow',
    inputSchema: SummarizeCropDiseaseInfoInputSchema,
    outputSchema: SummarizeCropDiseaseInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
