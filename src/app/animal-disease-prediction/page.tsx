import { PageHeader } from '@/components/page-header';
import { DiseaseDetector } from '@/components/disease-detector';
import { summarizeAnimalDiseaseInfo } from '@/ai/flows/summarize-animal-disease-info';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const ANIMAL_DISEASES = [
  "Lumpy Skin Disease",
  "Blackleg",
  "Anthrax",
  "Foot and Mouth Disease",
  "Mastitis",
  "Infectious Bovine Rhinotracheitis",
  "Bovine Viral Diarrhea"
];

export default function AnimalDiseasePage() {
  const exampleImage = PlaceHolderImages.find(p => p.id === 'sample-animal');
  
  if (!exampleImage) {
    // Handle case where example image is not found, though it should be.
    return <div>Error: Example image not configured.</div>;
  }

  return (
    <div className="container py-8">
      <PageHeader
        title="Animal Disease Prediction"
        description="Upload an image of your livestock. Our AI will analyze it for signs of common diseases and provide a helpful summary."
      />
      <DiseaseDetector 
        summarizeFunction={summarizeAnimalDiseaseInfo}
        diseaseList={ANIMAL_DISEASES}
        exampleImage={exampleImage}
        uploadHint="Upload an Animal Image"
      />
    </div>
  );
}
