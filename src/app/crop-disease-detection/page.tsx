import { PageHeader } from '@/components/page-header';
import { DiseaseDetector } from '@/components/disease-detector';
import { summarizeCropDiseaseInfo } from '@/ai/flows/summarize-crop-disease-info';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const CROP_DISEASES = [
  "Apple Scab",
  "Apple Black Rot",
  "Cedar Apple Rust",
  "Cherry Powdery Mildew",
  "Corn Common Rust",
  "Corn Gray Leaf Spot",
  "Grape Black Rot",
  "Grape Esca (Black Measles)",
  "Grape Leaf Blight",
  "Peach Bacterial Spot",
  "Pepper Bell Bacterial Spot",
  "Potato Early Blight",
  "Potato Late Blight",
  "Tomato Bacterial Spot",
  "Tomato Early Blight",
  "Tomato Late Blight",
  "Tomato Leaf Mold",
];

export default function CropDiseasePage() {
  const exampleImage = PlaceHolderImages.find(p => p.id === 'sample-leaf');
  
  if (!exampleImage) {
    // Handle case where example image is not found, though it should be.
    return <div>Error: Example image not configured.</div>;
  }

  return (
    <div className="container py-8">
      <PageHeader
        title="Crop Disease Detection"
        description="Upload an image of a plant leaf. Our AI will analyze it to detect potential diseases and provide you with a summary."
      />
      <DiseaseDetector 
        summarizeFunction={summarizeCropDiseaseInfo}
        diseaseList={CROP_DISEASES}
        exampleImage={exampleImage}
        uploadHint="Upload a Leaf Image"
      />
    </div>
  );
}
