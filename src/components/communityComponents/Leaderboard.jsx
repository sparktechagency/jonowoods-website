"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCommunityLeaderBoardQuery, useLeaderboardGlobalStatusQuery } from "@/redux/featured/community/communityLeaderBoard";

const Leaderboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get active tab from URL, default to "time"
  const activeTab = searchParams.get("tab") || "time";

  const { data: leaderboard } = useCommunityLeaderBoardQuery();
  const { data: leaderboardStatus } = useLeaderboardGlobalStatusQuery();
  
  const leaderboardData = leaderboard?.data;
  const leaderboardIsShown = leaderboardStatus?.data?.leaderboardIsShown ?? false;

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

  return (
    <div className="w-full my-10 px-4 md:px-8 lg:px-12">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-primary"> {leaderboardIsShown  && "Leaderboard"}</h2>
      </div>

      {leaderboardIsShown && (
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