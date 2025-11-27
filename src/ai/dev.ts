import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-crop-disease-info.ts';
import '@/ai/flows/summarize-animal-disease-info.ts';
import '@/ai/flows/generate-crop-recommendation-instructions.ts';