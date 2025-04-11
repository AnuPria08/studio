'use server';

/**
 * @fileOverview Flow to fine-tune the Random Forest model for optimal accuracy in dyslexia prediction.
 *
 * - improveModelAccuracy - A function that fine-tunes the Random Forest model.
 * - ImproveModelAccuracyInput - The input type for the improveModelAccuracy function.
 * - ImproveModelAccuracyOutput - The return type for the improveModelAccuracy function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ImproveModelAccuracyInputSchema = z.object({
  datasetDescription: z.string().describe('Description of the dataset used for training the Random Forest model.'),
  initialModelAccuracy: z.number().describe('The initial accuracy of the Random Forest model before fine-tuning.'),
});
export type ImproveModelAccuracyInput = z.infer<typeof ImproveModelAccuracyInputSchema>;

const ImproveModelAccuracyOutputSchema = z.object({
  optimalHyperparameters: z.string().describe('The optimal hyperparameters for the Random Forest model.'),
  improvedAccuracy: z.number().describe('The improved accuracy of the Random Forest model after fine-tuning.'),
  tuningStrategyExplanation: z.string().describe('Explanation of the hyperparameter tuning strategy used and its effectiveness.'),
});
export type ImproveModelAccuracyOutput = z.infer<typeof ImproveModelAccuracyOutputSchema>;

export async function improveModelAccuracy(input: ImproveModelAccuracyInput): Promise<ImproveModelAccuracyOutput> {
  return improveModelAccuracyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveModelAccuracyPrompt',
  input: {
    schema: z.object({
      datasetDescription: z.string().describe('Description of the dataset used for training the Random Forest model.'),
      initialModelAccuracy: z.number().describe('The initial accuracy of the Random Forest model before fine-tuning.'),
    }),
  },
  output: {
    schema: z.object({
      optimalHyperparameters: z.string().describe('The optimal hyperparameters for the Random Forest model.'),
      improvedAccuracy: z.number().describe('The improved accuracy of the Random Forest model after fine-tuning.'),
      tuningStrategyExplanation: z.string().describe('Explanation of the hyperparameter tuning strategy used and its effectiveness.'),
    }),
  },
  prompt: `You are an expert data scientist specializing in optimizing machine learning models.

You are tasked with fine-tuning a Random Forest model for dyslexia prediction based on eye movement data.

Dataset Description: {{{datasetDescription}}}
Initial Model Accuracy: {{{initialModelAccuracy}}}

Suggest optimal hyperparameters for the Random Forest model to maximize accuracy. Explain the hyperparameter tuning strategy used and why it is effective, also provide the improved accuracy.
`,
});

const improveModelAccuracyFlow = ai.defineFlow<
  typeof ImproveModelAccuracyInputSchema,
  typeof ImproveModelAccuracyOutputSchema
>({
  name: 'improveModelAccuracyFlow',
  inputSchema: ImproveModelAccuracyInputSchema,
  outputSchema: ImproveModelAccuracyOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
