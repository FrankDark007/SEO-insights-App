import React from "react";
import { CheckSquare, Calendar, Clock, AlertCircle } from "lucide-react";

interface PriorityActionsPanelProps {
  actions: {
    immediate: string[];
    thisWeek: string[];
    thisMonth: string[];
  };
}

const PriorityActionsPanel: React.FC<PriorityActionsPanelProps> = ({ actions }) => {
  const sections = [
    {
      title: "Immediate Action",
      items: actions.immediate,
      color: "border-rose-500 bg-rose-900/10",
      textColor: "text-rose-400",
      icon: <AlertCircle className="w-4 h-4 text-rose-500" />
    },
    {
      title: "This Week",
      items: actions.thisWeek,
      color: "border-amber-500 bg-amber-900/10",
      textColor: "text-amber-400",
      icon: <Clock className="w-4 h-4 text-amber-500" />
    },
    {
      title: "This Month",
      items: actions.thisMonth,
      color: "border-blue-500 bg-blue-900/10",
      textColor: "text-blue-400",
      icon: <Calendar className="w-4 h-4 text-blue-500" />
    },
  ];

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <CheckSquare className="w-5 h-5 text-indigo-400" /> Priority Actions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border-l-4 bg-[#0d1117] ${section.color}`}
          >
            <h4 className={`font-bold mb-3 flex items-center gap-2 uppercase text-xs tracking-wider ${section.textColor}`}>
              {section.icon} {section.title}
            </h4>
            {section.items.length > 0 ? (
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-300 flex items-start gap-2 leading-snug"
                  >
                    <span className="text-gray-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">No actions needed</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityActionsPanel;