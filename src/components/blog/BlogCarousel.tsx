import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { getStrapiImageUrl } from '@/utils/image';
import type { CollectionEntry } from 'astro:content';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Autoplay from 'embla-carousel-autoplay';

interface BlogPost extends CollectionEntry<'blog'> {
  slug: string;
}

interface BlogCarouselProps {
  posts: BlogPost[];
}

// Development-only: Generate dummy posts if needed
const generateDummyPosts = (count: number): BlogPost[] => {
  return Array.from(
    { length: count },
    (_, i) =>
      ({
        id: `dummy-${i}`,
        slug: `dummy-post-${i}`,
        data: {
          title: `Dummy Post ${i + 1}`,
          description: 'This is a placeholder post for development purposes.',
          publishedAt: new Date().toISOString(),
          heroImage: {
            imageMedia: {
              url: 'https://placehold.co/600x400',
            },
          },
        },
      }) as BlogPost
  );
};

export default function BlogCarousel({
  posts: initialPosts,
}: BlogCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const posts =
    initialPosts.length < 3
      ? [...initialPosts, ...generateDummyPosts(3 - initialPosts.length)]
      : initialPosts;

  const autoplay = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  return (
    <Carousel
      setApi={setApi}
      plugins={[autoplay.current]}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {posts.map((post) => (
          <CarouselItem
            key={post.slug}
            className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
          >
            <Card className="group overflow-hidden transition-all hover:shadow-md dark:hover:shadow-primary/20 flex flex-col h-full">
              <CardHeader className="p-0">
                <AspectRatio ratio={1}>
                  {post.data.heroImage && (
                    <img
                      src={getStrapiImageUrl(post.data.heroImage.imageMedia)}
                      alt={post.data.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </AspectRatio>
              </CardHeader>
              <CardContent className="space-y-2.5 p-6 flex-grow">
                <CardTitle className="line-clamp-2 text-2xl">
                  {post.data.title}
                </CardTitle>
                {post.data.description && (
                  <CardDescription className="line-clamp-3">
                    {post.data.description}
                  </CardDescription>
                )}
              </CardContent>
              <CardFooter className="p-6 pt-0 mt-auto">
                <a href={`/blog/${post.slug}`} className="w-full">
                  <Button className="w-full">Read More</Button>
                </a>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
