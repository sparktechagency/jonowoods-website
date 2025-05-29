
const VideoPlayer = ({ data }) => {
  return (
    <div>
      <div className="container mx-auto bg-white">
        {/* Video Section */}
        <div className="mt-10">
          <video
            controls
            src={`https://${data?.videoUrl}`}
            className="w-full h-auto max-h-[70vh] mx-auto border rounded-md"
            autoPlay
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Details */}
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Title : {data?.title}</h1>
            <p className="text-sm text-gray-600 mb-1">Duration : {data?.duration} Min</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Description : {data?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;