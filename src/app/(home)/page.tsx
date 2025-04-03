import { Suspense } from "react";
import { GetCategory } from "@/actions/caterogy-action";
import FilterCarousel from "@/components/filter-carousel";
import VideoList from "@/components/video/videos-list";
import { getFilteredVideos } from "@/actions/video-action";

const HomePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {

  const sP = await searchParams;
  const search =
    typeof sP?.search === "string" ? sP.search : undefined;

  const categories = await GetCategory();
  const videos = await getFilteredVideos({ limit: 12 });

  return (
    <div>
      <Suspense fallback={<div>Loading filters...</div>}>
        <FilterCarousel categories={categories} />
      </Suspense>

      <VideoList initialVideos={videos.videos} search={search} />
    </div>
  );
};

export default HomePage;
