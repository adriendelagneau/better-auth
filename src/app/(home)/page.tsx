
import {  videosWithLikesDetails } from "@/actions/video-action";
import TestComponent from "@/components/test-component";

const HomePage = async () => {

  const videos = await videosWithLikesDetails();



  return (
    <div>
      <TestComponent videos={videos}/>
    </div>
  );
};

export default HomePage;
