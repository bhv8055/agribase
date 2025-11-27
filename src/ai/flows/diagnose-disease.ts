'use server';
/**
 * @fileOverview A comprehensive disease diagnosis AI agent for plants and animals.
 *
 * - diagnoseDisease - A function that handles the disease diagnosis process.
 * - DiagnoseDiseaseInput - The input type for the diagnoseDisease function.
 * - DiagnoseDiseaseOutput - The return type for the diagnoseDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant or animal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseDiseaseInput = z.infer<typeof DiagnoseDiseaseInputSchema>;

const DiagnoseDiseaseOutputSchema = z.object({
    isRecognized: z.boolean().describe("Whether the AI could identify a potential disease."),
    diseaseName: z.string().describe("The common name of the identified disease. If not recognized, this should be 'Unknown'."),
    effects: z.array(z.string()).describe("Two key effects or symptoms of the disease."),
    medicines: z.array(z.string()).describe("A list of suggested medicines or treatments."),
    confidence: z.enum(["High", "Medium", "Low", "Unknown"]).describe("The AI's confidence in its diagnosis."),
    veterinaryInfo: z.object({
        name: z.string().describe("Name of a nearby veterinary clinic or expert."),
        phone: z.string().describe("Contact phone number."),
        address: z.string().describe("Physical address of the clinic/expert."),
    }).optional().describe("Contact details for a nearby veterinary expert, provided if the disease is not recognized or confidence is low."),
});
export type DiagnoseDiseaseOutput = z.infer<typeof DiagnoseDiseaseOutputSchema>;

export async function diagnoseDisease(input: DiagnoseDiseaseInput): Promise<DiagnoseDiseaseOutput> {
  return diagnoseDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseDiseasePrompt',
  input: {schema: DiagnoseDiseaseInputSchema},
  output: {schema: DiagnoseDiseaseOutputSchema},
  prompt: `You are an expert AI veterinarian and botanist. Analyze the provided image of a plant or animal.

  Photo: {{media url=photoDataUri}}

  Your task is to identify if there is a disease present.
  
  - If you recognize a disease with medium or high confidence:
    1. Set isRecognized to true.
    2. Provide the common name of the disease.
    3. List exactly two primary effects or symptoms.
    4. Suggest at least one but no more than three potential medicines or treatments.
    5. Set your confidence level ('High' or 'Medium').

  - If your confidence is low:
    1. Set isRecognized to true.
    2. Provide the most likely disease name.
    3. List two potential symptoms you are observing.
    4. Suggest "Consult a professional" as the only medicine.
    5. Set your confidence to 'Low'.
    6. Provide contact information for a fictional, but realistic-sounding, local veterinary or agricultural expert.

  - If you cannot recognize any disease or if the image is unclear or not of a plant/animal:
    1. Set isRecognized to false.
    2. Set the diseaseName to 'Unknown'.
    3. Set effects and medicines to empty arrays.
    4. Set confidence to 'Unknown'.
    5. Provide contact information for a fictional, but realistic-sounding, local veterinary or agricultural expert.`,
});

const diagnoseDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseDiseaseFlow',
    inputSchema: DiagnoseDiseaseInputSchema,
    outputSchema: DiagnoseDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
