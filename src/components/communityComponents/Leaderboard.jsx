"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCommunityLeaderBoardQuery } from "@/redux/featured/community/communityLeaderBoard";

const STORAGE_KEY = "leaderboard_visible";

const Leaderboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get active tab from URL, default to "time"
  const activeTab = searchParams.get("tab") || "time";
  
  // Initialize with null to handle hydration properly
  const [isVisible, setIsVisible] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const { data: leaderboard } = useCommunityLeaderBoardQuery();
  const leaderboardData = leaderboard?.data;

  // Load saved preference after component mounts
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    // Default to true if no saved preference
    setIsVisible(saved !== null ? saved === "true" : true);
  }, []);

  // Defensive fallback to empty arrays
  const matTimeData = leaderboardData?.topByMatTime || [];
  const loginCountData = leaderboardData?.topByLoginCount || [];
  const completedSessionsData = leaderboardData?.topByCompletedSessions || [];

  // Map data to shape: [{ rank, user, score }]
  const mapData = (data, scoreKey) =>
    data.map((item, idx) => ({
      rank: idx + 1,
      user: item.name,
      score: item[scoreKey] ?? 0,
    }));

  const timeData = mapData(matTimeData, "matTime");
  const streaksData = mapData(loginCountData, "loginCount");
  const sessionsData = mapData(completedSessionsData, "completedSessionsCount");

  // Handle tab change with URL update
  const handleTabChange = (tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle visibility toggle with localStorage
  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem(STORAGE_KEY, String(newVisibility));
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted || isVisible === null) {
    return (
      <div className="w-full my-10 px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-primary">Leaderboard</h2>
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-10 px-4 md:px-8 lg:px-12">
      <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-primary">Leaderboard</h2>
        <button
          onClick={handleToggleVisibility}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          style={{ backgroundColor: isVisible ? '#ef4444' : '#9ca3af' }}
          aria-label="Toggle leaderboard visibility"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isVisible ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isVisible && (
        <>
          {/* Tabs for Mobile & Tablet */}
          <div className="lg:hidden mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => handleTabChange("time")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "time"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Total Time
              </button>
              <button
                onClick={() => handleTabChange("streaks")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "streaks"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Streaks
              </button>
              <button
                onClick={() => handleTabChange("sessions")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "sessions"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sessions
              </button>
            </div>

            {/* Mobile Tab Content */}
            <div className="mt-4">
              {activeTab === "time" && (
                <div className="bg-white rounded-lg shadow">
                  <div className="bg-primary text-white p-3 rounded-t-lg">
                    <h3 className="font-medium text-center">Total Time (Minutes)</h3>
                  </div>
                  <LeaderboardTable data={timeData} />
                </div>
              )}
              {activeTab === "streaks" && (
                <div className="bg-white rounded-lg shadow">
                  <div className="bg-primary text-white p-3 rounded-t-lg">
                    <h3 className="font-medium text-center">Streaks (Login Count)</h3>
                  </div>
                  <LeaderboardTable data={streaksData} />
                </div>
              )}
              {activeTab === "sessions" && (
                <div className="bg-white rounded-lg shadow">
                  <div className="bg-primary text-white p-3 rounded-t-lg">
                    <h3 className="font-medium text-center">Sessions Completed</h3>
                  </div>
                  <LeaderboardTable data={sessionsData} />
                </div>
              )}
            </div>
          </div>

          {/* Desktop Grid View */}
          <div className="hidden lg:grid grid-cols-3 gap-10">
            {/* Total Time Column */}
            <div className="bg-white rounded-lg shadow">
              <div className="bg-primary text-white p-3 rounded-t-lg">
                <h3 className="font-medium text-center">Total Time (Minutes)</h3>
              </div>
              <LeaderboardTable data={timeData} />
            </div>

            {/* Streaks Column */}
            <div className="bg-white rounded-lg shadow">
              <div className="bg-primary text-white p-3 rounded-t-lg">
                <h3 className="font-medium text-center">Streaks (Login Count)</h3>
              </div>
              <LeaderboardTable data={streaksData} />
            </div>

            {/* Sessions Column */}
            <div className="bg-white rounded-lg shadow">
              <div className="bg-primary text-white p-3 rounded-t-lg">
                <h3 className="font-medium text-center">Sessions Completed</h3>
              </div>
              <LeaderboardTable data={sessionsData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function LeaderboardTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-sm">
            <th className="px-4 py-2 text-center">#</th>
            <th className="px-4 py-2 text-center">User</th>
            <th className="px-4 py-2 text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(({ rank, user, score }) => (
            <tr key={rank} className="border-t">
              <td className="px-4 py-3 text-sm text-center">{rank}</td>
              <td className="px-4 py-3 text-sm text-center">{user}</td>
              <td className="px-4 py-3 text-sm text-center">{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;