import { PageHeader } from '@/components/page-header';
import { CropRecommendationForm } from './crop-recommendation-form';

export default function CropRecommendationPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Crop Recommendation"
        description="Fill in the soil and environmental details below to get an AI-powered crop recommendation."
      />
      <CropRecommendationForm />
    </div>
  );
}
