import { PageHeader } from '@/components/page-header';
import { DiseaseDiagnoser } from '@/components/disease-diagnoser';
import { diagnoseDisease } from '@/ai/flows/diagnose-disease';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DiseaseDiagnosisPage() {
  const exampleImage = PlaceHolderImages.find(p => p.id === 'sample-leaf');
  
  if (!exampleImage) {
    // This should not happen if placeholder-images.json is configured correctly.
    return <div>Error: Example image not found.</div>;
  }

  return (
    <div className="container py-8">
      <PageHeader
        title="Disease Diagnosis"
        description="Upload an image of your crop or livestock. Our AI will analyze it for diseases, provide a report, and generate a downloadable receipt."
      />
      <DiseaseDiagnoser
        diagnoseFunction={diagnoseDisease}
        exampleImage={exampleImage}
        uploadHint="Upload Crop or Animal Image"
      />
    </div>
  );
}
