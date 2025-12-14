import React, { useState } from "react";
import { ActionChecklist } from "../types";

interface ActionChecklistPanelProps {
  actions: ActionChecklist[];
  onToggleComplete: (id: string) => void;
}

const ActionChecklistPanel: React.FC<ActionChecklistPanelProps> = ({
  actions,
  onToggleComplete,
}) => {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");

  const filteredActions = actions.filter((a) => {
    if (filter === "pending") return !a.isCompleted;
    if (filter === "completed") return a.isCompleted;
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-500/20 text-red-400 border-red-500/50",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      low: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      technical: "🔧",
      content: "📝",
      links: "🔗",
      local: "📍",
      "competitor-response": "⚔️",
    };
    return icons[category] || "📌";
  };

  const completedCount = actions.filter((a) => a.isCompleted).length;
  const pendingCount = actions.filter((a) => !a.isCompleted).length;

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          ✅ Action Checklist
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-green-400">{completedCount}</span>
            <span className="text-gray-500"> / </span>
            <span className="text-white">{actions.length}</span>
            <span className="text-gray-500"> complete</span>
          </div>
          <div className="flex gap-1">
            {["pending", "completed", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-3 py-1 rounded-lg text-xs ${
                  filter === f
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className="absolute h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${(completedCount / actions.length) * 100}%` }}
        ></div>
      </div>

      <div className="space-y-3">
        {filteredActions.map((action) => (
          <div
            key={action.id}
            className={`rounded-lg border ${
              action.isCompleted
                ? "border-green-500/30 bg-green-500/5 opacity-60"
                : action.priority === "critical"
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-gray-700 bg-gray-700/30"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleComplete(action.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    action.isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-500 hover:border-purple-500"
                  }`}
                >
                  {action.isCompleted && "✓"}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getCategoryIcon(action.category)}</span>
                    <span className={`px-2 py-0.5 rounded text-xs border ${getPriorityBadge(action.priority)}`}>
                      {action.priority}
                    </span>
                    <span className="text-gray-500 text-xs">{action.category}</span>
                  </div>

                  <p className={`font-medium ${action.isCompleted ? "line-through text-gray-500" : "text-white"}`}>
                    {action.title}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{action.description}</p>

                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-gray-500">
                      Impact: <span className="text-green-400">{action.estimatedImpact}</span>
                    </span>
                    <span className="text-gray-500">
                      Effort: <span className="text-yellow-400">{action.estimatedEffort}</span>
                    </span>
                    <span className="text-gray-500">
                      Due: <span className="text-purple-400">{action.dueDate}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
                  className={`transform transition-transform ${expandedAction === action.id ? "rotate-180" : ""}`}
                >
                  ▼
                </button>
              </div>
            </div>

            {expandedAction === action.id && (
              <div className="px-4 pb-4 border-t border-gray-700 pt-4 ml-9">
                <p className="text-gray-400 text-sm mb-2">Implementation Steps:</p>
                <ol className="space-y-2">
                  {action.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-purple-600/50 flex items-center justify-center text-white text-xs flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionChecklistPanel;