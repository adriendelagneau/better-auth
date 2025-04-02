

interface SingleVideoProps {
  params: Promise<{ videoId: string }>;
}

const SingleVideoPage = async ({ params }: SingleVideoProps) => {
  const { videoId } = await params;

  return (
   <div>{videoId}</div>
  );
};

export default SingleVideoPage;
