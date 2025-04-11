'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Placeholder function - replace with actual implementation
const eyeCenterCoordinates = (filePath: string) => {
  // Replace with your actual logic to read eye center coordinates
  return {
    rightEyeCenterX: Math.floor(Math.random() * 640),
    rightEyeCenterY: Math.floor(Math.random() * 480),
    leftEyeCenterX: Math.floor(Math.random() * 640),
    leftEyeCenterY: Math.floor(Math.random() * 480),
  };
};

// Placeholder function - replace with actual implementation
const createLineIterator = (P1: any, P2: any, img: any) => {
  // Replace with your actual line iterator logic
  return [];
};

function EyeTrackingAnalysis() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

  const [eyeData, setEyeData] = useState<
    {
      time: number;
      rightEyeX: number;
      rightEyeY: number;
      leftEyeX: number;
      leftEyeY: number;
    }[]
  >([]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const analyzeFrame = () => {
      if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        return;
      }

      // Simulate eye tracking data - replace with actual analysis
      const newEyeData = {
        time: time,
        rightEyeX: Math.sin(time / 100) * 20 + 50,
        rightEyeY: Math.cos(time / 100) * 20 + 50,
        leftEyeX: Math.cos(time / 100) * 15 + 40,
        leftEyeY: Math.sin(time / 100) * 15 + 40,
      };

      setEyeData((prevEyeData) => [...prevEyeData, newEyeData]);
      setTime((prevTime) => prevTime + 50);

      animationFrameId = requestAnimationFrame(analyzeFrame);
    };

    if (hasCameraPermission) {
      animationFrameId = requestAnimationFrame(analyzeFrame);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasCameraPermission, time]);


  return (
    <Card className="mb-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Real-time Eye Tracking Analysis</h2>
      </CardHeader>
      <CardContent>
        <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
        { !(hasCameraPermission) && (
            <Alert variant="destructive">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature.
              </AlertDescription>
            </Alert>
        )
        }

        {eyeData.length > 0 && (
          <>
            <h3 className="text-md font-semibold mt-4">Eye Movement Data</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={eyeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Position", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rightEyeX" stroke="#8884d8" name="Right Eye X" />
                <Line type="monotone" dataKey="rightEyeY" stroke="#82ca9d" name="Right Eye Y" />
                <Line type="monotone" dataKey="leftEyeX" stroke="#ffc658" name="Left Eye X" />
                <Line type="monotone" dataKey="leftEyeY" stroke="#a4de6c" name="Left Eye Y" />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default EyeTrackingAnalysis;
