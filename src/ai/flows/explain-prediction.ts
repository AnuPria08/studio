// explain-prediction.ts
'use server';

/**
 * @fileOverview Explains the dyslexia prediction based on eye movement patterns.
 *
 * - explainPrediction - A function that explains the dyslexia prediction.
 * - ExplainPredictionInput - The input type for the explainPrediction function.
 * - ExplainPredictionOutput - The return type for the explainPrediction function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ExplainPredictionInputSchema = z.object({
  probability: z.number().describe('The probability of dyslexia (0 to 1).'),
  eyeMovementData: z.string().describe('The eye movement data of the patient.'),
});
export type ExplainPredictionInput = z.infer<typeof ExplainPredictionInputSchema>;

const ExplainPredictionOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the dyslexia prediction.'),
  confidence: z.string().describe('The confidence level of the explanation.'),
});
export type ExplainPredictionOutput = z.infer<typeof ExplainPredictionOutputSchema>;

export async function explainPrediction(input: ExplainPredictionInput): Promise<ExplainPredictionOutput> {
  return explainPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainPredictionPrompt',
  input: {
    schema: z.object({
      probability: z.number().describe('The probability of dyslexia (0 to 1).'),
      eyeMovementData: z.string().describe('The eye movement data of the patient.'),
    }),
  },
  output: {
    schema: z.object({
      explanation: z.string().describe('The explanation of the dyslexia prediction, highlighting key eye movement patterns.'),
      confidence: z.string().describe('The confidence level of the explanation.'),
    }),
  },
  prompt: `You are a medical AI assistant explaining dyslexia predictions.

  Given the following probability of dyslexia and the patient's eye movement data, explain why this prediction was made. Highlight the key eye movement patterns that influenced the result.

  Probability of Dyslexia: {{{probability}}}
  Eye Movement Data: {{{eyeMovementData}}}

  Provide a confidence level for your explanation (high, medium, or low).`,
});

const explainPredictionFlow = ai.defineFlow<
  typeof ExplainPredictionInputSchema,
  typeof ExplainPredictionOutputSchema
>({
  name: 'explainPredictionFlow',
  inputSchema: ExplainPredictionInputSchema,
  outputSchema: ExplainPredictionOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

