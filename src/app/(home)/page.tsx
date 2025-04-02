import { GetCategory } from "@/actions/caterogy-action";
import FilterCarousel from "@/components/filter-carousel";



const HomePage = async () => {

  const categories = await GetCategory();
  return (
    <div>
     <FilterCarousel categories={categories}/>
    </div>
  );
};

export default HomePage;
