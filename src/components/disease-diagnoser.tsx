'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Sparkles, AlertCircle, Download, Pill, ShieldAlert, HeartPulse, Phone } from 'lucide-react';
import { ImageUpload } from '@/components/image-upload';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { DiagnoseDiseaseInput, DiagnoseDiseaseOutput, diagnoseDisease } from '@/ai/flows/diagnose-disease';
import { Badge } from './ui/badge';
import jsPDF from 'jspdf';
import { cn } from '@/lib/utils';

type DiseaseDiagnoserProps = {
  diagnoseFunction: (input: DiagnoseDiseaseInput) => Promise<DiagnoseDiseaseOutput>;
  exampleImage: ImagePlaceholder;
  uploadHint: string;
};

export function DiseaseDiagnoser({
  diagnoseFunction,
  exampleImage,
  uploadHint,
}: DiseaseDiagnoserProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseDiseaseOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (file: File, dataUrl: string) => {
    setImageFile(file);
    setPreviewUrl(dataUrl);
    setResult(null);
    setError(null);
  };

  const handleImageClear = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const handleDiagnose = async () => {
    if (!imageFile || !previewUrl) {
      setError('Please upload an image first.');
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const result = await diagnoseFunction({ photoDataUri: previewUrl });
      setResult(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred during diagnosis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePdfReceipt = () => {
    if (!result) return;

    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text("Agrobase - Diagnosis Report", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

    if (previewUrl) {
      try {
        doc.addImage(previewUrl, 'JPEG', 15, 40, 60, 60);
      } catch (e) {
        console.error("Error adding image to PDF:", e);
        doc.text("Image could not be loaded.", 45, 70, { align: 'center' });
      }
    }

    doc.setFontSize(16);
    doc.text("Diagnosis Details", 105, 45);
    doc.line(105, 47, 200, 47);

    doc.setFontSize(12);
    doc.text(`Disease Name: ${result.diseaseName}`, 105, 55);
    doc.text(`Confidence: ${result.confidence}`, 105, 62);
    
    doc.setFontSize(14);
    doc.text("Effects / Symptoms:", 105, 75);
    doc.setFontSize(12);
    result.effects.forEach((effect, i) => doc.text(`- ${effect}`, 110, 82 + (i * 7)));

    doc.setFontSize(14);
    doc.text("Suggested Treatments:", 105, 100);
    doc.setFontSize(12);
    result.medicines.forEach((med, i) => doc.text(`- ${med}`, 110, 107 + (i * 7)));

    if (result.veterinaryInfo) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Professional Contact Information", 105, 20, { align: 'center' });
      doc.line(15, 25, 195, 25);
      doc.setFontSize(12);
      doc.text(`For professional consultation, please contact:`, 15, 35);
      doc.text(`Name: ${result.veterinaryInfo.name}`, 20, 45);
      doc.text(`Phone: ${result.veterinaryInfo.phone}`, 20, 52);
      doc.text(`Address: ${result.veterinaryInfo.address}`, 20, 59);
    }
    
    doc.save(`agrobase-report-${result.diseaseName.replace(/\s+/g, '-')}.pdf`);
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
        <Button onClick={handleDiagnose} disabled={!imageFile || loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Diagnosing...
            </>
          ) : (
            'Diagnose Disease'
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

      {loading && (
        <div className="flex flex-col items-center gap-4 text-center text-muted-foreground p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h3 className="font-headline text-2xl font-semibold">AI is Analyzing the Image...</h3>
          <p>This may take a moment. Please wait.</p>
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Sparkles className="text-accent" />
                        AI Diagnosis Report
                    </CardTitle>
                    <CardDescription>Generated on {new Date().toLocaleString()}</CardDescription>
                </div>
                 <Button variant="outline" onClick={generatePdfReceipt}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!result.isRecognized ? (
                 <Alert variant="default" className="bg-amber-50 border-amber-200">
                    <ShieldAlert className="h-4 w-4 !text-amber-600" />
                    <AlertTitle className="text-amber-800">Diagnosis Unclear</AlertTitle>
                    <AlertDescription className="text-amber-700">
                        The AI could not confidently identify a specific disease from the image. This could be due to image quality or because the subject appears healthy. For a confident diagnosis, please consult a professional.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-primary">{result.diseaseName}</h3>
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><HeartPulse/> Effects & Symptoms</h4>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                {result.effects.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2"><Pill/> Suggested Treatments</h4>
                             <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                {result.medicines.map((m, i) => <li key={i}>{m}</li>)}
                            </ul>
                        </div>
                    </div>
                     <div className="space-y-4">
                        <h4 className="font-semibold">Confidence Level</h4>
                         <Badge 
                            className={cn({
                                'bg-green-100 text-green-800': result.confidence === 'High',
                                'bg-yellow-100 text-yellow-800': result.confidence === 'Medium',
                                'bg-red-100 text-red-800': result.confidence === 'Low',
                            })}
                            variant="outline"
                        >
                            {result.confidence}
                        </Badge>
                         {result.confidence !== 'High' && (
                             <p className="text-sm text-muted-foreground">
                                 A {result.confidence.toLowerCase()} confidence diagnosis suggests that while there are signs of {result.diseaseName}, a professional consultation is recommended for confirmation.
                             </p>
                         )}
                    </div>
                </div>
            )}
             {result.veterinaryInfo && (
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center gap-2">
                           <Phone className="h-5 w-5 text-primary"/>
                            Professional Consultation Recommended
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2 text-muted-foreground">For a definitive diagnosis, please contact a local expert:</p>
                        <div className="text-sm">
                            <p className="font-bold">{result.veterinaryInfo.name}</p>
                            <p>{result.veterinaryInfo.address}</p>
                            <p>{result.veterinaryInfo.phone}</p>
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
