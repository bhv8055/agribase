'use server';
/**
 * @fileOverview Generates instructions for the crop recommendation feature.
 *
 * - generateCropRecommendationInstructions - A function that generates instructions for the crop recommendation feature.
 * - GenerateCropRecommendationInstructionsInput - The input type for the generateCropRecommendationInstructions function.
 * - GenerateCropRecommendationInstructionsOutput - The return type for the generateCropRecommendationInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCropRecommendationInstructionsInputSchema = z.object({
  featureDescription: z.string().describe('The description of the crop recommendation feature.'),
  inputParameters: z.array(z.string()).describe('A list of input parameters for the crop recommendation feature.'),
  outputInterpretation: z.string().describe('Guidance on how to interpret the results of the crop recommendation feature.'),
});
export type GenerateCropRecommendationInstructionsInput = z.infer<typeof GenerateCropRecommendationInstructionsInputSchema>;

const GenerateCropRecommendationInstructionsOutputSchema = z.object({
  instructions: z.string().describe('AI-generated instructions for the crop recommendation feature.'),
});
export type GenerateCropRecommendationInstructionsOutput = z.infer<typeof GenerateCropRecommendationInstructionsOutputSchema>;

export async function generateCropRecommendationInstructions(input: GenerateCropRecommendationInstructionsInput): Promise<GenerateCropRecommendationInstructionsOutput> {
  return generateCropRecommendationInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCropRecommendationInstructionsPrompt',
  input: {schema: GenerateCropRecommendationInstructionsInputSchema},
  output: {schema: GenerateCropRecommendationInstructionsOutputSchema},
  prompt: `You are an AI assistant that generates clear and concise instructions for a crop recommendation feature.

  Feature Description: {{featureDescription}}
  Input Parameters: {{#each inputParameters}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Output Interpretation: {{outputInterpretation}}

  Based on the provided information, generate instructions for the crop recommendation feature. The instructions should guide the user on how to best use the feature, explaining the input parameters and how to interpret the results.
  Instructions: `,
});

const generateCropRecommendationInstructionsFlow = ai.defineFlow(
  {
    name: 'generateCropRecommendationInstructionsFlow',
    inputSchema: GenerateCropRecommendationInstructionsInputSchema,
    outputSchema: GenerateCropRecommendationInstructionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
