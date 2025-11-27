'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  nitrogen: z.coerce.number().min(0, "Nitrogen can't be negative."),
  phosphorus: z.coerce.number().min(0, "Phosphorus can't be negative."),
  potassium: z.coerce.number().min(0, "Potassium can't be negative."),
  ph: z.coerce.number().min(0, 'pH must be between 0 and 14.').max(14, 'pH must be between 0 and 14.'),
  rainfall: z.coerce.number().min(0, "Rainfall can't be negative."),
  temperature: z.coerce.number(),
  humidity: z.coerce.number().min(0, 'Humidity must be between 0 and 100.').max(100, 'Humidity must be between 0 and 100.'),
});

const recommendedCrops = [
    "Maize", "Rice", "Jute", "Cotton", "Coconut", "Papaya", "Orange", "Apple", "Muskmelon", "Watermelon", "Grapes", "Mango", "Banana", "Pomegranate", "Lentil", "Black gram", "Mung bean", "Moth beans", "Pigeon peas", "Kidney beans", "Chickpea"
];

export function CropRecommendationForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nitrogen: 90,
      phosphorus: 42,
      potassium: 43,
      ph: 6.5,
      rainfall: 202.9,
      temperature: 20.8,
      humidity: 82.0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    // Simulate AI model processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In a real application, you would call your AI model here with the form values.
    // e.g., const recommendation = await callCropRecommendationModel(values);
    
    // For demonstration, we'll return a random crop from a predefined list.
    const recommendation = recommendedCrops[Math.floor(Math.random() * recommendedCrops.length)];

    setResult(recommendation);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Enter Soil & Weather Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="nitrogen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nitrogen (N)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 90" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phosphorus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phosphorus (P)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 42" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="potassium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potassium (K)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 43" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ph"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil pH</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 6.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rainfall"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rainfall (mm)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 202.9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 20.8" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="humidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Humidity (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 82.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Get Recommendation'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center">
        {loading && (
            <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="font-headline text-2xl font-semibold">Analyzing Conditions...</h3>
                <p className="text-muted-foreground">Our AI is determining the best crop for you.</p>
            </div>
        )}
        {result && (
          <Card className="w-full bg-secondary">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="text-accent" />
                AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">Based on the provided data, the most suitable crop is:</p>
              <p className="text-4xl font-bold font-headline text-primary mt-4">{result}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
