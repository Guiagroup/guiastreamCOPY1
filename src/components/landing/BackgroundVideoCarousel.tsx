import { useEffect, useState } from "react";
import { getVideos } from "@/services/videoService";
import { Video } from "@/types/video";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const BackgroundVideoCarousel = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const loadVideos = async () => {
      const fetchedVideos = await getVideos();
      setVideos(fetchedVideos);
    };
    loadVideos();
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          skipSnaps: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {videos.map((video) => (
            <CarouselItem key={video.id} className="pl-1 basis-1/3 md:basis-1/4">
              <div className="relative aspect-video overflow-hidden rounded-lg opacity-40 transition-all">
                <img
                  src={video.thumbnail_url || ''}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};