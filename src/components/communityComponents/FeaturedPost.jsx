import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, FileText, Image as ImageIcon, ExternalLink } from "lucide-react";
import { useGetFeaturedPostQuery } from "@/redux/featured/community/communityApi";
import { getVideoAndThumbnail } from "../share/imageUrl";
import Image from "next/image";

const VideoPostCard = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDuration = (seconds) => {
    if (!seconds || seconds === "00:00") return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  // Function to extract links from HTML and make them clickable
  const makeUrlsClickable = (text) => {
    if (!text) return "";
    
    // First, extract href links from HTML <a> tags
    const hrefPattern = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
    const parts = [];
    let lastIndex = 0;
    let match;

    // Extract all href links first
    while ((match = hrefPattern.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        parts.push(beforeText.replace(/<[^>]*>/g, '')); // Remove other HTML tags
      }
      
      // Add the clickable link
      const href = match[2];
      const linkText = match[3];
      const url = href.startsWith('http') ? href : `https://${href}`;
      
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
        >
          {linkText}
          <ExternalLink className="w-3 h-3" />
        </a>
      );
      
      lastIndex = hrefPattern.lastIndex;
    }
    
    // Add remaining text after last link
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      parts.push(remainingText.replace(/<[^>]*>/g, '')); // Remove HTML tags
    }
    
    // If no href links found, process as plain text with URL detection
    if (parts.length === 0) {
      const cleanText = text.replace(/<[^>]*>/g, '');
      const urlPattern = /((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
      
      return cleanText.split(urlPattern).map((part, index) => {
        if (urlPattern.test(part)) {
          const url = part.startsWith('http') ? part : `https://${part}`;
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
            >
              {part}
              <ExternalLink className="w-3 h-3" />
            </a>
          );
        }
        return part;
      });
    }
    
    return parts;
  };

  // Function to get the appropriate icon based on post type
  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Function to render content based on post type
  const renderMediaContent = () => {
    if (post.type === 'video' && post.videoUrl) {
      return (
        <div className="relative w-full h-80 max-h-80 rounded-lg overflow-hidden">
          {!isPlaying ? (
            <>
              <Image
                src={getVideoAndThumbnail(post.thumbnailUrl)}
                height={320}
                width={600}
                alt={post.title}
                className="w-full h-full max-h-80 object-cover rounded-lg"
              />
              {/* Play Button Overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 cursor-pointer group rounded-lg"
                onClick={handlePlayVideo}
              >
                <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-all duration-300">
                  <Play className="w-6 h-6 text-gray-800 fill-current" />
                </div>
              </div>
              {/* Duration Badge */}
              {post.duration && post.duration !== "00:00" && (
                <div className="absolute bottom-2 right-2">
                  <Badge
                    variant="secondary"
                    className="bg-black bg-opacity-70 text-white hover:bg-opacity-80"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(parseInt(post.duration))}
                  </Badge>
                </div>
              )}
            </>
          ) : (
            <video
              className="w-full h-full max-h-80 object-cover rounded-lg"
              controls
              autoPlay
              onEnded={() => setIsPlaying(false)}
            >
              <source src={`https://${post.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      );
    } else if (post.type === 'image' && post.thumbnailUrl) {
      return (
        <div className="relative w-full h-80 max-h-80 rounded-lg overflow-hidden">
          <Image
            src={getVideoAndThumbnail(post.thumbnailUrl)}
            height={320}
            width={600}
            alt={post.title}
            className="w-full h-full max-h-80 object-cover rounded-lg"
          />
        </div>
      );
    } else {
      // For text posts or posts without media
      return (
        <div className="relative w-full h-80 max-h-80 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center rounded-lg">
          <div className="text-center p-6">
            {getPostTypeIcon()}
            <p className="mt-2 text-sm text-gray-600 capitalize">{post.type} Post</p>
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="w-full mx-auto overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="">
          {/* Media/Content Section */}
          <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-0 bg-gray-100">
            {/* Left: Media Content */}
            <div className="relative w-full h-full p-4 lg:p-6">
              {renderMediaContent()}
              
              {/* Type Badge */}
              <div className="absolute top-2 left-2">
                <Badge variant="default" className="capitalize flex items-center gap-1">
                  {getPostTypeIcon()}
                  {post.type}
                </Badge>
              </div>
            </div>

            {/* Right: Text Content Section */}
            <div className="w-full p-6 flex flex-col justify-between bg-gray-50 lg:bg-white">
              <div className="space-y-4">
                {/* Title with URL detection */}
                <div className="text-lg lg:text-xl font-bold text-gray-900 line-clamp-3 leading-tight">
                  {makeUrlsClickable(post.title)}
                </div>

                {/* Description with URL detection */}
                {post.description && (
                  <div className="text-gray-600 text-sm lg:text-base line-clamp-4 leading-relaxed">
                    {makeUrlsClickable(post.description)}
                  </div>
                )}

                {/* Equipment Tags */}
                {post.equipment && post.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.equipment.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {post.equipment.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-500"
                      >
                        +{post.equipment.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Publish Date */}
                {post.publishAt && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Publish Date:</span> {formatDate(post.publishAt)}
                  </div>
                )}
              </div>

              {/* Footer Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 gap-2">
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <span>Created: {formatDate(post.createdAt)}</span>
                  {post.updatedAt !== post.createdAt && (
                    <span>Updated: {formatDate(post.updatedAt)}</span>
                  )}
                </div>
                <Badge
                  variant={post.status === "active" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {post.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Usage Example with RTK Query
const FeaturedPostSection = () => {
  const { data: postData, isLoading, error } = useGetFeaturedPostQuery();

  if (isLoading) {
    return (
      <div className="w-full mx-auto">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-6 space-y-4 bg-gray-50">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mt-8"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto p-6 text-center">
        <p className="text-red-500">Failed to load featured post</p>
      </div>
    );
  }

  if (!postData?.success || !postData?.data) {
    return (
      <div className="w-full mx-auto p-6 text-center">
        <p className="text-gray-500">No featured post available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Featured Content
      </h2>
      <VideoPostCard post={postData.data} />
    </div>
  );
};

// Component to display multiple posts
const PostList = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="w-full mx-auto p-6 text-center">
        <p className="text-gray-500">No posts available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        All Posts
      </h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <VideoPostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default VideoPostCard;
export { FeaturedPostSection, PostList };