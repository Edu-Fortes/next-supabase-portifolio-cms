'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

export function MDXCarousel({ images }: { images: string[] }) {
  return (
    <Carousel className='w-full max-w-2xl mx-auto my-6'>
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className='p-1'>
              <Card>
                <CardContent className='flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg'>
                  {/* Using Next.js Image component is better, but requires config */}
                  {/* For this example, a simple img tag is fine. */}
                  <img
                    src={src}
                    alt={`Project screenshot ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='ml-14' />
      <CarouselNext className='mr-14' />
    </Carousel>
  );
}
