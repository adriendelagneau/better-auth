"use client";

import { Video } from "@prisma/client";
import React, { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { getFilteredVideos } from "@/actions/video-action"; // Make sure to import the action
import VideoCard from "./video-card";

interface VideosListProps {
  initialVideos: Video[];
  search?: string;
}

const VideosList = ({ initialVideos, search }: VideosListProps) => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [nextCursor, setNextCursor] = useState<string | null>(null); // To track pagination
  const [loading, setLoading] = useState(false); // To prevent multiple requests at the same time
  const { ref, inView } = useInView();

  const loadMoreVideos = useCallback(async () => {
    if (loading || !nextCursor) return;

    setLoading(true);

    try {
      const response = await getFilteredVideos({
        cursor: nextCursor,
        limit: 12,
        query: search,
      });

      if (response.videos.length > 0) {
        setVideos((prevVideos) => [...prevVideos, ...response.videos]);
        setNextCursor(response.nextCursor ?? null); // Update next cursor
      }
    } catch (error) {
      console.error("Error fetching more videos:", error);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, search]);

  useEffect(() => {
    if (inView) {
      loadMoreVideos();
    }
  }, [inView, loadMoreVideos]);

  return (
    <div>
      {/* Render video items */}
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}

      {/* Loading indicator */}
      {loading && <p>Loading more videos...</p>}

      {/* Add the intersection observer trigger at the bottom */}
      <div ref={ref} />
    </div>
  );
};

export default VideosList;
