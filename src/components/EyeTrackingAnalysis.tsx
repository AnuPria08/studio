'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function EyeTrackingAnalysis() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
    }
  };

  const analyzeEyeMovement = async () => {
    setIsLoading(true);
    setAnalysisResult(null);

    // Simulate processing (replace with actual analysis logic)
    setTimeout(() => {
      // Dummy results for demonstration
      const dummyResults = Math.random() > 0.5 ? 'YOU ARE PROBABLY NOT DYSLEXIC' : 'YOU ARE PROBABLY DYSLEXIC';
      setAnalysisResult(dummyResults);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Eye Tracking Analysis</h2>
      </CardHeader>
      <CardContent>
        <Input type="file" accept="video/*" onChange={handleVideoUpload} />
        <Button
          className="mt-4"
          onClick={analyzeEyeMovement}
          disabled={!videoFile || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Eye Movement'}
        </Button>
        {analysisResult && (
          <div className="mt-4">
            <p>Analysis Result: {analysisResult}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EyeTrackingAnalysis;
