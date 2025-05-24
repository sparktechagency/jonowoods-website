"use client";

const Leaderboard = ({ leaderboardData }) => {
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

  return (
    <div className="w-full my-10">
      <h2 className="text-lg font-medium text-red-500 mb-4">Leaderboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Total Time Column */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-red text-white p-3 rounded-t-lg">
            <h3 className="font-medium text-center">Total Time (Minutes)</h3>
          </div>
          <LeaderboardTable data={mapData(matTimeData, "matTime")} />
        </div>

        {/* Streaks Column */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-red text-white p-3 rounded-t-lg">
            <h3 className="font-medium text-center">Streaks (Login Count)</h3>
          </div>
          <LeaderboardTable data={mapData(loginCountData, "loginCount")} />
        </div>

        {/* Sessions Column */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-red text-white p-3 rounded-t-lg">
            <h3 className="font-medium text-center">Sessions Completed</h3>
          </div>
          <LeaderboardTable
            data={mapData(completedSessionsData, "completedSessionsCount")}
          />
        </div>
      </div>
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
