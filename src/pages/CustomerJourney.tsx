import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, TrendingUp, Target, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JourneyStage {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const journeyStages: JourneyStage[] = [
  { name: "First Visit", count: 2840, percentage: 100, color: "bg-blue-500" },
  { name: "Second Visit", count: 1988, percentage: 70, color: "bg-indigo-500" },
  { name: "Third Visit", count: 1420, percentage: 50, color: "bg-violet-500" },
  { name: "Loyal (4+)", count: 852, percentage: 30, color: "bg-purple-500" },
];

const insights = [
  "30% of first-time visitors convert to loyal customers (4+ visits)",
  "Average time between first and second visit is 47 days",
  "Customers with email capture have 2.3x higher retention",
  "Weekend first-visits show 15% higher conversion to second visit",
];

const CustomerJourney: React.FC = () => {
  const [currentInsights, setCurrentInsights] = React.useState(insights);

  const regenerateInsights = () => {
    const shuffled = [...insights].sort(() => Math.random() - 0.5);
    setCurrentInsights(shuffled);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Reports
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Customer Journey</h1>
            <p className="text-sm text-slate-500">Track customer progression from first visit to loyalty</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-6xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Users className="w-4 h-4" />
              Total First Visits
            </div>
            <div className="text-2xl font-bold text-slate-900">2,840</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Conversion Rate
            </div>
            <div className="text-2xl font-bold text-slate-900">30%</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Target className="w-4 h-4" />
              Avg. Days to Loyalty
            </div>
            <div className="text-2xl font-bold text-slate-900">127</div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <Users className="w-4 h-4" />
              Loyal Customers
            </div>
            <div className="text-2xl font-bold text-slate-900">852</div>
          </div>
        </div>

        {/* Funnel Visualization */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Customer Journey Funnel</h2>
          <div className="space-y-4">
            {journeyStages.map((stage, index) => (
              <div key={stage.name} className="flex items-center gap-4">
                <div className="w-24 text-sm text-slate-600 text-right">{stage.name}</div>
                <div className="flex-1 h-10 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${stage.color} flex items-center justify-end pr-3 transition-all duration-500`}
                    style={{ width: `${stage.percentage}%` }}
                  >
                    <span className="text-white text-sm font-medium">{stage.count.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-16 text-sm text-slate-500">{stage.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">AI Insights</h2>
            <Button variant="outline" size="sm" onClick={regenerateInsights} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>
          <ul className="space-y-3">
            {currentInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3 text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default CustomerJourney;
