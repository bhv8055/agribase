'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { ImageUpload } from '@/components/image-upload';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type DiseaseDetectorProps = {
  summarizeFunction: (input: { diseaseName: string }) => Promise<{ summary: string }>;
  diseaseList: string[];
  exampleImage: ImagePlaceholder;
  uploadHint: string;
};

export function DiseaseDetector({
  summarizeFunction,
  diseaseList,
  exampleImage,
  uploadHint,
}: DiseaseDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setDetectionResult(null);
    setSummary(null);
    setError(null);
  };

  const handleImageClear = () => {
    setImageFile(null);
    setDetectionResult(null);
    setSummary(null);
    setError(null);
  };

  const handleDetect = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    setError(null);
    setIsDetecting(true);
    setDetectionResult(null);
    setSummary(null);

    // 1. Simulate disease detection model
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const detectedDisease = diseaseList[Math.floor(Math.random() * diseaseList.length)];
    setDetectionResult(detectedDisease);
    setIsDetecting(false);

    // 2. Call GenAI flow for summary
    setIsSummarizing(true);
    try {
      const { summary } = await summarizeFunction({ diseaseName: detectedDisease });
      setSummary(summary);
    } catch (e) {
      console.error(e);
      setError('Could not retrieve disease information. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-8">
      <ImageUpload
        onImageSelect={handleImageSelect}
        onImageClear={handleImageClear}
        exampleImage={exampleImage}
        uploadHint={uploadHint}
      />
      
      <div className="text-center">
        <Button onClick={handleDetect} disabled={!imageFile || isDetecting || isSummarizing} size="lg">
          {isDetecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Detecting...
            </>
          ) : (
            'Detect Disease'
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(isDetecting || detectionResult) && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isDetecting ? (
              <div className="flex flex-col items-center gap-4 text-center text-muted-foreground p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="font-headline text-2xl font-semibold">Analyzing Image...</h3>
                <p>Our AI is examining the image for signs of disease.</p>
              </div>
            ) : detectionResult && (
              <div>
                <h3 className="font-semibold text-lg">Detection Complete</h3>
                <p className="text-muted-foreground">
                  AI analysis suggests the presence of:{' '}
                  <span className="font-bold text-primary">{detectionResult}</span>.
                </p>
              </div>
            )}

            {isSummarizing ? (
              <div className="flex items-center gap-4 text-muted-foreground pt-4 border-t">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p>Loading details about {detectionResult}...</p>
              </div>
            ) : summary && (
              <Card className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary"/>
                    About {detectionResult}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-foreground">
                    {summary.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
