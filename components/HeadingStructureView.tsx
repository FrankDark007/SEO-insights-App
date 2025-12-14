import React, { useState } from "react";
import { PageContentAnalysis } from "../types";

interface HeadingStructureViewProps {
  yourPage: PageContentAnalysis | null;
  competitors: PageContentAnalysis[];
}

const HeadingStructureView: React.FC<HeadingStructureViewProps> = ({
  yourPage,
  competitors,
}) => {
  const [selectedPage, setSelectedPage] = useState<string>(
    yourPage?.url || competitors[0]?.url || ""
  );

  const allPages = yourPage ? [yourPage, ...competitors] : competitors;
  const currentPage = allPages.find((p) => p.url === selectedPage) || allPages[0];

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      h1: "bg-violet-900/10 text-violet-400 border-violet-500/30",
      h2: "bg-blue-900/10 text-blue-400 border-blue-500/30",
      h3: "bg-emerald-900/10 text-emerald-400 border-emerald-500/30",
      h4: "bg-amber-900/10 text-amber-400 border-amber-500/30",
      h5: "bg-orange-900/10 text-orange-400 border-orange-500/30",
      h6: "bg-rose-900/10 text-rose-400 border-rose-500/30",
    };
    return colors[tag] || "bg-gray-800 text-gray-400";
  };

  const getIndent = (tag: string) => {
    const indents: Record<string, string> = {
      h1: "ml-0",
      h2: "ml-4",
      h3: "ml-8",
      h4: "ml-12",
      h5: "ml-16",
      h6: "ml-20",
    };
    return indents[tag] || "ml-0";
  };

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          📑 Heading Structure
        </h3>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
        >
          {yourPage && (
            <option value={yourPage.url}>Your Page</option>
          )}
          {competitors.map((comp, i) => (
            <option key={i} value={comp.url}>
              #{comp.rank} - {new URL(comp.url).hostname}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {currentPage?.headings.map((heading, index) => (
          <div
            key={index}
            className={`${getIndent(heading.tag)} p-3 rounded-lg border ${getTagColor(heading.tag)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase">
                  {heading.tag}
                </span>
                <span className="text-white text-sm font-medium">{heading.text}</span>
              </div>
              <div className="flex items-center gap-3">
                {heading.hasKeyword && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-900/30 text-emerald-400 rounded border border-emerald-900/50">
                    KW
                  </span>
                )}
                {heading.wordCount > 0 && (
                  <span className="text-gray-400 text-xs">
                    {heading.wordCount} words
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t border-gray-800 pt-4">
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 text-xs uppercase font-bold mb-1">Total Headings</p>
          <p className="text-white font-bold text-xl">{currentPage?.headings.length || 0}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 text-xs uppercase font-bold mb-1">H2 Sections</p>
          <p className="text-white font-bold text-xl">
            {currentPage?.headings.filter((h) => h.tag === "h2").length || 0}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-400 text-xs uppercase font-bold mb-1">With Keyword</p>
          <p className="text-white font-bold text-xl">
            {currentPage?.headings.filter((h) => h.hasKeyword).length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeadingStructureView;