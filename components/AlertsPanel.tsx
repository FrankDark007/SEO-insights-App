import React, { useState } from "react";
import { SEOAlert } from "../types";

interface AlertsPanelProps {
  alerts: SEOAlert[];
  onMarkRead: (id: string) => void;
  onMarkActioned: (id: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onMarkRead,
  onMarkActioned,
}) => {
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info" | "success">("all");
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const filteredAlerts = filter === "all"
    ? alerts
    : alerts.filter((a) => a.severity === filter);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return "🚨";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      case "success":
        return "✅";
      default:
        return "📌";
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-500/5";
      case "warning":
        return "border-yellow-500 bg-yellow-500/5";
      case "info":
        return "border-blue-500 bg-blue-500/5";
      case "success":
        return "border-green-500 bg-green-500/5";
      default:
        return "border-gray-500";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ranking_drop: "Ranking Drop",
      ranking_gain: "Ranking Gain",
      new_competitor: "New Competitor",
      lost_backlink: "Lost Backlink",
      new_backlink: "New Backlink",
      content_change: "Content Change",
      technical_issue: "Technical Issue",
      traffic_anomaly: "Traffic Anomaly",
      competitor_action: "Competitor Action",
      opportunity: "Opportunity",
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          🔔 Alerts
          <span className="text-sm font-normal px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
            {alerts.filter((a) => !a.isRead).length} unread
          </span>
        </h3>
        <div className="flex gap-2">
          {["all", "critical", "warning", "info", "success"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-3 py-1 rounded-lg text-xs ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border-l-4 ${getSeverityBorder(alert.severity)} ${
              alert.isRead ? "opacity-60" : ""
            }`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                        {getTypeLabel(alert.type)}
                      </span>
                      {!alert.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-white font-medium">{alert.title}</p>
                    <p className="text-gray-400 text-sm mt-1">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </span>
                  <span className={`transform transition-transform ${expandedAlert === alert.id ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {expandedAlert === alert.id && (
              <div className="px-4 pb-4 border-t border-gray-700 pt-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-xs">Previous</p>
                    <p className="text-white">{alert.previousValue}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Current</p>
                    <p className="text-white">{alert.currentValue}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Change</p>
                    <p className={`font-medium ${
                      alert.severity === "success" ? "text-green-400" : 
                      alert.severity === "critical" ? "text-red-400" : "text-yellow-400"
                    }`}>
                      {alert.change}
                    </p>
                  </div>
                </div>

                {alert.affectedKeywords && alert.affectedKeywords.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs mb-1">Affected Keywords</p>
                    <div className="flex flex-wrap gap-1">
                      {alert.affectedKeywords.map((kw, i) => (
                        <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-gray-500 text-xs mb-1">Recommended Action</p>
                  <p className="text-purple-400 text-sm">{alert.recommendedAction}</p>
                </div>

                <div className="flex gap-2">
                  {!alert.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkRead(alert.id);
                      }}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600"
                    >
                      Mark as Read
                    </button>
                  )}
                  {!alert.isActioned && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkActioned(alert.id);
                      }}
                      className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                    >
                      Mark as Actioned
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;