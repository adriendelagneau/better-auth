


import { VideoWithUser } from "@/actions/video-action";
import Card from "./card";


interface TestComponentProps {
  videos: VideoWithUser[];
}

const TestComponent = ({ videos }: TestComponentProps) => {
  


  
  return (
    <div>
      <h1>All Videos</h1>
      <ul>
        {videos.map((video) => (

          <Card video={video} key={video.id} />
        ))}
      </ul>
    </div>
  );
};

export default TestComponent;
