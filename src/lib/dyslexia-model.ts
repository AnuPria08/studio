'use server';

import { spawn } from 'child_process';
import path from 'path';

interface PredictionResult {
  accuracy: number;
  prediction: string;
}

/**
 * Trains a Random Forest model for dyslexia prediction using a Python script.
 * @param trainingData CSV data for training the model.
 * @param predictionData CSV data to predict dyslexia likelihood.
 * @returns A promise containing the model's accuracy and prediction, or an error message.
 */
export async function trainModelAndPredict(trainingData: string, predictionData: string): Promise<PredictionResult> {
  return new Promise((resolve, reject) => {
    // Construct the path to the Python script.
    const scriptPath = path.join(process.cwd(), 'src/lib/dyslexia_model.py');
    // Spawn a Python process to execute the script, passing the training and prediction data as arguments.
    const pythonProcess = spawn('python3', [scriptPath, trainingData, predictionData]);

    let result = '';
    let error = '';

    // Capture the standard output from the Python script.
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    // Capture the standard error from the Python script.
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle the completion of the Python process.
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        // If the exit code is not 0, it indicates an error in the Python script.
        console.error(`Python script execution failed with code ${code}, error: ${error}`);
        reject(new Error(`Python script execution failed with code ${code}, error: ${error}. Check server logs for details.`));
        return;
      }

      try {
        // Attempt to parse the JSON result from the Python script's output.
        const parsedResult = JSON.parse(result);
        console.log("Parsed Result:", parsedResult); // Log the parsed result for debugging
        resolve(parsedResult);
      } catch (parseError) {
        // If parsing fails, it indicates that the Python script's output is not in the expected JSON format.
        console.error('Failed to parse JSON result:', parseError, 'Raw result:', result);
        reject(new Error(`Failed to parse JSON result: ${parseError}. Raw output: ${result}`));
      }
    });
  });
}
