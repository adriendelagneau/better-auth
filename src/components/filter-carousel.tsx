"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";

const FilterCarousel = ({ categories }: { categories: Category[] }) => {

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const onSelect = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("categoryId", value);
    } else {
      params.delete("categoryId");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      {/* Left Gradient */}
      <div
        className={cn(
          "absolute left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
          current === 1 && "hidden"
        )}
      ></div>

      <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }} className="w-full px-12">
        <CarouselContent className="-ml-3">
          {/* "All" Option */}
          <CarouselItem onClick={() => onSelect(null)} className="pl-3 basis-auto cursor-pointer">
            <Badge
              variant={!categoryId ? "default" : "secondary"}
              className="px-3 py-1 rounded-lg text-sm"
            >
              All
            </Badge>
          </CarouselItem>

          {categories.map((category) => (
            <CarouselItem
              onClick={() => onSelect(category.id)}
              key={category.id}
              className="pl-3 basis-auto cursor-pointer"
            >
              <Badge
                variant={categoryId === category.id ? "default" : "secondary"}
                className="px-3 py-1 rounded-lg text-sm"
              >
                {category.name}
              </Badge>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20 cursor-pointer" />
        <CarouselNext className="right-0 z-20 cursor-pointer" />
      </Carousel>

      {/* Right Gradient */}
      <div
        className={cn(
          "absolute right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
          current === count && "hidden"
        )}
      ></div>
    </div>
  );
};

export default FilterCarousel;
