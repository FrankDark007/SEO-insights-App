import React, { useState } from "react";
import { ActionItem } from "../types";

interface ActionChecklistProps {
  actions: ActionItem[];
  onToggleComplete?: (id: string) => void;
}

const ActionChecklist: React.FC<ActionChecklistProps> = ({
  actions,
  onToggleComplete,
}) => {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    onToggleComplete?.(id);
  };

  const filteredActions = actions.filter((action) => {
    if (filterPriority !== "all" && action.priority !== filterPriority) return false;
    if (filterCategory !== "all" && action.category !== filterCategory) return false;
    return true;
  });

  const sortedActions = [...filteredActions].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-black",
      low: "bg-blue-500 text-white",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[priority]}`}>
        {priority}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      content: "📝",
      technical: "⚙️",
      backlinks: "🔗",
      local: "📍",
      schema: "📋",
      speed: "🚀",
    };
    return icons[category] || "📌";
  };

  const getEffortBadge = (effort: string) => {
    const colors: Record<string, string> = {
      quick: "text-green-400",
      moderate: "text-yellow-400",
      significant: "text-red-400",
    };
    return <span className={colors[effort]}>{effort} effort</span>;
  };

  const completedCount = sortedActions.filter((a) => completedIds.has(a.id)).length;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            ✅ Action Checklist
          </h3>
          <p className="text-gray-400 text-sm">
            {completedCount}/{sortedActions.length} completed
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-600"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg border border-gray-600"
          >
            <option value="all">All Categories</option>
            <option value="content">Content</option>
            <option value="technical">Technical</option>
            <option value="backlinks">Backlinks</option>
            <option value="schema">Schema</option>
            <option value="local">Local</option>
            <option value="speed">Speed</option>
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
            style={{ width: `${(completedCount / sortedActions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {sortedActions.map((action) => (
          <div
            key={action.id}
            className={`p-4 rounded-lg border transition-all ${
              completedIds.has(action.id)
                ? "bg-green-500/10 border-green-500/30"
                : "bg-gray-700/50 border-gray-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleComplete(action.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  completedIds.has(action.id)
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-500 hover:border-purple-500"
                }`}
              >
                {completedIds.has(action.id) && "✓"}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span>{getCategoryIcon(action.category)}</span>
                  {getPriorityBadge(action.priority)}
                  <span className="text-gray-500 text-xs">
                    {getEffortBadge(action.effort)} • {action.deadline}
                  </span>
                </div>

                <h4
                  className={`font-medium mb-1 ${
                    completedIds.has(action.id)
                      ? "text-gray-400 line-through"
                      : "text-white"
                  }`}
                >
                  {action.title}
                </h4>

                <p className="text-gray-400 text-sm mb-2">{action.description}</p>

                <p className="text-purple-400 text-xs mb-2">
                  Based on: {action.basedOn}
                </p>

                <button
                  onClick={() =>
                    setExpandedId(expandedId === action.id ? null : action.id)
                  }
                  className="text-blue-400 text-sm hover:text-blue-300"
                >
                  {expandedId === action.id ? "▼ Hide steps" : "▶ Show steps"}
                </button>

                {expandedId === action.id && (
                  <div className="mt-3 p-3 bg-gray-800/50 rounded">
                    <p className="text-green-400 text-xs mb-2">
                      Expected Impact: {action.expectedImpact}
                    </p>
                    <ol className="space-y-1">
                      {action.steps.map((step, i) => (
                        <li
                          key={i}
                          className="text-gray-300 text-sm flex items-start gap-2"
                        >
                          <span className="text-purple-400">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionChecklist;