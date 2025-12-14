import React from "react";
import { PageContentAnalysis } from "../types";

interface ContentScoreComparisonProps {
  yourPage: PageContentAnalysis | null;
  competitors: PageContentAnalysis[];
  avgCompetitorScore: number;
}

const ContentScoreComparison: React.FC<ContentScoreComparisonProps> = ({
  yourPage,
  competitors,
  avgCompetitorScore,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    if (score >= 50) return "text-orange-400";
    return "text-rose-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-rose-500";
  };

  const allPages = yourPage 
    ? [{ ...yourPage, isYours: true }, ...competitors.map(c => ({ ...c, isYours: false }))]
    : competitors.map(c => ({ ...c, isYours: false }));

  const sortedPages = [...allPages].sort((a, b) => b.contentScore - a.contentScore);

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        📊 Content Score Comparison
      </h3>

      <div className="space-y-3">
        {sortedPages.map((page, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              page.isYours
                ? "bg-violet-900/10 border-violet-500/30"
                : "bg-gray-800/50 border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm font-medium w-6">
                  #{page.rank || index + 1}
                </span>
                <div>
                  <p className={`font-medium truncate max-w-md ${page.isYours ? "text-violet-400" : "text-white"}`}>
                    {page.isYours ? "Your Page" : new URL(page.url).hostname}
                  </p>
                  <p className="text-gray-500 text-xs truncate max-w-md">{page.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Words</p>
                  <p className="text-white font-medium">{page.wordCount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Sections</p>
                  <p className="text-white font-medium">{page.sections.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Images</p>
                  <p className="text-white font-medium">{page.media.totalImages}</p>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(page.contentScore)}`}>
                  {page.contentScore}
                </div>
              </div>
            </div>

            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute h-full ${getScoreBg(page.contentScore)} rounded-full transition-all`}
                style={{ width: `${page.contentScore}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {yourPage && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Gap to Average Competitor</span>
            <span className={`font-bold ${yourPage.contentScore >= avgCompetitorScore ? "text-emerald-400" : "text-rose-400"}`}>
              {yourPage.contentScore >= avgCompetitorScore ? "+" : ""}
              {yourPage.contentScore - avgCompetitorScore} points
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentScoreComparison;