'use server';

import { spawn } from 'child_process';
import path from 'path';

interface PredictionResult {
  accuracy: number;
  prediction: string;
}

export async function trainModelAndPredict(trainingData: string, predictionData: string): Promise<PredictionResult> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'src/lib/dyslexia_model.py');
    const pythonProcess = spawn('python3', [scriptPath, trainingData, predictionData]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python script execution failed with code ${code}, error: ${error}`);
        reject(new Error(`Python script execution failed with code ${code}, error: ${error}`));
        return;
      }

      try {
        const parsedResult = JSON.parse(result);
        resolve(parsedResult);
      } catch (parseError) {
        console.error('Failed to parse JSON result:', parseError, 'Raw result:', result);
        reject(new Error(`Failed to parse JSON result: ${parseError}`));
      }
    });
  });
}

