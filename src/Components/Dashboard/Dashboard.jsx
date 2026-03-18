import React from "react";

// Components
import DashTop from "./DashTop";
import DashMiddle from "./DashMiddle";
import DashBottom from "./DashBottom";

export default function Dashboard() {
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Intelligence Hub</h1>
      <p className="text-gray-500 mb-6">Your insights, all in one place</p>

      {/* Stat Cards */}
      <DashTop />

      {/* Charts Section */}
      <DashMiddle />

      {/* Real-Time Logs */}
      <DashBottom />
    </div>
  );
}
