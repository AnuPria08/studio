"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { improveModelAccuracy } from "@/ai/flows/improve-model-accuracy";
import { explainPrediction } from "@/ai/flows/explain-prediction";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { trainModelAndPredict } from "@/lib/dyslexia-model";

export default function Home() {
  const [trainingDataset, setTrainingDataset] = useState<string>("");
  const [predictionDataset, setPredictionDataset] = useState<string>("");
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [training, setTraining] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleTrainingDatasetUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setTrainingDataset(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handlePredictionDatasetUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPredictionDataset(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleTrainAndPredict = async () => {
    setTraining(true);
    setTrainingProgress(30);

    try {
      setTrainingProgress(70);
      const result = await trainModelAndPredict(trainingDataset, predictionDataset);
      setModelAccuracy(result.accuracy);
      setPredictionResult(result.prediction);
      setTrainingProgress(100);
      setSuccess(true);
    } catch (error: any) {
      console.error("Training and prediction failed:", error);
      setPredictionResult(`Error: ${error.message || 'Failed to train and predict'}`);
    } finally {
      setTraining(false);
      setPredicting(false);
      setTrainingProgress(0);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">EyeLearn - Dyslexia Prediction using Machine Learning</h1>

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">1. Upload Training Dataset</h2>
        </CardHeader>
        <CardContent>
          <Input type="file" accept=".csv" onChange={handleTrainingDatasetUpload} />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">2. Upload Prediction Dataset</h2>
        </CardHeader>
        <CardContent>
          <Input type="file" accept=".csv" onChange={handlePredictionDatasetUpload} />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">3. Train Model &amp; Predict</h2>
        </CardHeader>
        <CardContent>
          {training ? (
            <div>
              <p>Training and Prediction in progress...</p>
              <Progress value={trainingProgress} />
            </div>
          ) : (
            <Button onClick={handleTrainAndPredict} disabled={training || !trainingDataset || !predictionDataset}>
              Train Model &amp; Predict
            </Button>
          )}
          {modelAccuracy !== null && (
            <div>
              <p className="mt-2">
                Model Accuracy: {modelAccuracy.toFixed(2)}
              </p>
              {success && (
                <Alert variant="default">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Model training successful!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          {predictionResult && (
            <div className="mt-4">
              <p>Prediction Result: {predictionResult}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
