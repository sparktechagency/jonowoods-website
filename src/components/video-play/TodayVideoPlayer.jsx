"use client"

import React, { useMemo, useState } from "react"
import UniversalVideoPlayer from "@/components/UniversalVideoPlayer"
import { Heart, Share2, Bookmark, Eye, Calendar, Clock } from "lucide-react"
import { useTodayLetestVideoQuery } from "@/redux/featured/CommingSoon/commingSoonApi"
import Spinner from "@/app/(commonLayout)/Spinner"

const TodaysVideoPlayer = () => {
  const { data, isLoading } = useTodayLetestVideoQuery()
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  const video = data?.data || {}
  console.log("from video player", video)
  const {
    title,
    description,
    duration,
    views,
    likes,
    createdAt,
    equipment,
    category,
    author,
    related,
  } = video || {}

  const published = useMemo(() => {
    if (!createdAt) return ""
    try {
      return new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return ""
    }
  }, [createdAt])

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num?.toString()
  }

  if (isLoading) return <Spinner />

  if (!video || !video.videoUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-200 shadow-lg text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Video Found</h3>
          <p className="text-slate-600 text-sm">Please check back later for new content</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 lg:py-8">

        {/* Video Player Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl ">
          <UniversalVideoPlayer
            video={video}
            autoplay={false}
            muted={true}
            aspectRatio="16:9"
            style={{ width: "100%" }}
            watermark={{ text: "Yoga With Jen", position: "top-right" }}
          />
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8  p-6 rounded-2xl  shadow-sm">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">

            {/* Title & Category */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
                  {title || "Untitled Video"}
                </h1>
                {/* {category && (
                  <span className="shrink-0 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold uppercase tracking-wide shadow-md">
                    {category}
                  </span>
                )} */}
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                {views != null && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{formatNumber(views)} views</span>
                  </div>
                )}
                {published && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{published}</span>
                    </div>
                  </>
                )}
                {duration && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{duration}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

 {/* equipment */}
            {Array.isArray(equipment) && equipment.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {equipment.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 text-slate-700 text-sm font-medium hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                  >
                    #{String(tag).trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Description Card */}
            <div className="rounded-2xl bg-white  ">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Description
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {formatDescription(description, showFullDesc)}
              </p>
              {description && description.length > 220 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-3 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {showFullDesc ? "Show less" : "Read more →"}
                </button>
              )}
            </div>

           
          </div>

          {/* Sidebar - Related Videos */}
          {Array.isArray(related) && related.length > 0 && (
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  Related Videos
                </h3>
                <div className="space-y-4">
                  {related.map((item, idx) => (
                    <RelatedCard key={idx} item={item} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


function formatDescription(desc, full) {
  if (!desc) return "No description available"
  const clean = String(desc).trim()
  if (full) return clean
  if (clean.length <= 220) return clean
  return clean.slice(0, 220) + "..."
}

export default TodaysVideoPlayer