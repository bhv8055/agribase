import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bug, Leaf, Stethoscope, TestTube2 } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const features = [
  {
    title: "Crop Recommendation",
    description: "Get personalized crop suggestions based on your soil and weather conditions to maximize your yield.",
    icon: <Leaf className="h-8 w-8 text-primary" />,
    link: "/crop-recommendation",
    imageId: "crop-recommendation",
  },
  {
    title: "Fertilizer Guide",
    description: "Receive AI-powered fertilizer recommendations tailored to your specific crop and soil needs.",
    icon: <TestTube2 className="h-8 w-8 text-primary" />,
    link: "/fertilizer-recommendation",
    imageId: "fertilizer-recommendation",
  },
  {
    title: "Disease Diagnosis",
    description: "Upload an image of a crop or animal to instantly diagnose diseases and get valuable insights.",
    icon: <Stethoscope className="h-8 w-8 text-primary" />,
    link: "/disease-diagnosis",
    imageId: "disease-diagnosis",
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "home-hero");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
              Welcome to Agrobase
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/80">
              Your AI-powered partner for smarter farming decisions. From crop selection to disease detection, we're here to help you grow.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/crop-recommendation">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Features</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Smarter Farming, Better Yields</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Leverage the power of AI to make informed decisions for your farm. Our tools are designed to be simple, intuitive, and effective.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              {features.map((feature) => {
                const featureImage = PlaceHolderImages.find(p => p.id === feature.imageId);
                return (
                  <Card key={feature.title} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center gap-4 pb-4">
                      {feature.icon}
                      <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button asChild variant="outline">
                        <Link href={feature.link}>
                          Try Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Agrobase. All rights reserved.</p>
      </footer>
    </div>
  );
}
