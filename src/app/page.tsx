
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { improveModelAccuracy } from "@/ai/flows/improve-model-accuracy";
import { explainPrediction } from "@/ai/flows/explain-prediction";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [dataset, setDataset] = useState<string>("");
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);
  const [patientData, setPatientData] = useState<string>("");
  const [prediction, setPrediction] = useState<{ probability: number; confidence: string } | null>(null);
  const [training, setTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0); // Between 0 and 100

  const handleDatasetUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setDataset(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleTrainModel = async () => {
    setTraining(true);
    setTrainingProgress(30);

    // Simulate training and GenAI call
    // Replace with actual training logic and GenAI call
    setTimeout(async () => {
      try {
        setTrainingProgress(70);
        const accuracyResult = await improveModelAccuracy({
          datasetDescription: dataset,
          initialModelAccuracy: 0.65, // initial model accuracy assumption
        });

        setModelAccuracy(accuracyResult.improvedAccuracy);
        setTrainingProgress(100);
      } catch (error: any) {
        console.error("Training failed:", error);
        // Handle error (e.g., display an error message)
      } finally {
        setTraining(false);
        setTrainingProgress(0);
      }
    }, 2000);
  };

  const handlePredictDyslexia = async () => {
    try {
      const predictionResult = await explainPrediction({
        probability: 0.85, // Assume 85% probability
        eyeMovementData: patientData,
      });

      setPrediction({
        probability: 0.85, //fixed value
        confidence: predictionResult.confidence,
      });
    } catch (error: any) {
      console.error("Prediction failed:", error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">EyeLearn - Dyslexia Prediction using Eye Movement Data</h1>

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">1. Upload Dataset</h2>
        </CardHeader>
        <CardContent>
          <Input type="file" accept=".csv" onChange={handleDatasetUpload} />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">2. Train Model</h2>
        </CardHeader>
        <CardContent>
          {training ? (
            <div>
              <p>Training in progress...</p>
              <Progress value={trainingProgress} />
            </div>
          ) : (
            <Button onClick={handleTrainModel} disabled={training || !dataset}>
              Train Model
            </Button>
          )}
          {modelAccuracy !== null && (
            <p className="mt-2">
              Model Accuracy: {modelAccuracy.toFixed(2)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">3. Patient Data Input</h2>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter patient eye movement data..."
            value={patientData}
            onChange={(e) => setPatientData(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">4. Dyslexia Prediction</h2>
        </CardHeader>
        <CardContent>
          <Button onClick={handlePredictDyslexia} disabled={!patientData}>
            Predict Dyslexia
          </Button>
          {prediction && (
            <div className="mt-4">
              <p>
                Probability of Dyslexia: {(prediction.probability * 100).toFixed(2)}%
              </p>
              <p>Confidence: {prediction.confidence}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
