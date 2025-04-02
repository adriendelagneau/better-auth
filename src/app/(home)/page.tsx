import { Suspense } from "react";
import { GetCategory } from "@/actions/caterogy-action";
import FilterCarousel from "@/components/filter-carousel";

const HomePage = async () => {
  const categories = await GetCategory();

  return (
    <div>
      <Suspense fallback={<div>Loading filters...</div>}>
        <FilterCarousel categories={categories} />
      </Suspense>
    </div>
  );
};

export default HomePage;
