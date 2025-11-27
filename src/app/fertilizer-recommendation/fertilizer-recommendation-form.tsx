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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const soilTypes = ["Sandy", "Loamy", "Black", "Red", "Clayey"];
const cropTypes = ["Maize", "Sugarcane", "Cotton", "Tobacco", "Paddy", "Barley", "Wheat", "Millets", "Oil seeds", "Pulses", "Ground Nuts"];
const fertilizerNames = ["Urea", "DAP", "14-35-14", "28-28", "17-17-17", "20-20", "10-26-26"];

const formSchema = z.object({
  soilType: z.string().min(1, 'Please select a soil type.'),
  cropType: z.string().min(1, 'Please select a crop type.'),
  nitrogen: z.coerce.number().min(0, "Nitrogen can't be negative."),
  phosphorus: z.coerce.number().min(0, "Phosphorus can't be negative."),
  potassium: z.coerce.number().min(0, "Potassium can't be negative."),
});

export function FertilizerRecommendationForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilType: 'Loamy',
      cropType: 'Maize',
      nitrogen: 45,
      phosphorus: 55,
      potassium: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    // Simulate AI model processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In a real application, you would call your AI model here with the form values.
    // e.g., const recommendation = await callFertilizerModel(values);
    
    // For demonstration, we'll return a random fertilizer.
    const recommendation = fertilizerNames[Math.floor(Math.random() * fertilizerNames.length)];

    setResult(recommendation);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Enter Crop & Soil Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a soil type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {soilTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a crop type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cropTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="nitrogen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nitrogen (N)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 45" {...field} />
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
                        <Input type="number" placeholder="e.g., 55" {...field} />
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
                        <Input type="number" placeholder="e.g., 0" {...field} />
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
                    Finding Fertilizer...
                  </>
                ) : (
                  'Get Suggestion'
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
                <h3 className="font-headline text-2xl font-semibold">Analyzing Data...</h3>
                <p className="text-muted-foreground">Our AI is suggesting the best fertilizer for you.</p>
            </div>
        )}
        {result && (
          <Card className="w-full bg-secondary">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="text-accent" />
                AI Suggestion
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">The suggested fertilizer is:</p>
              <p className="text-4xl font-bold font-headline text-primary mt-4">{result}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
