import { PageHeader } from '@/components/page-header';
import { FertilizerRecommendationForm } from './fertilizer-recommendation-form';

export default function FertilizerRecommendationPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Fertilizer Guide"
        description="Select your soil and crop type, and provide nutrient values to receive a fertilizer suggestion."
      />
      <FertilizerRecommendationForm />
    </div>
  );
}
