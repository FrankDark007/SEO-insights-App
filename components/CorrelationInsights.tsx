import React from "react";

interface Insight {
  insight: string;
  evidence: string;
  recommendation: string;
}

interface CorrelationInsightsProps {
  insights: Insight[];
}

const CorrelationInsights: React.FC<CorrelationInsightsProps> = ({ insights }) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        🔬 Correlation Insights
        <span className="text-sm font-normal text-gray-400">
          What's actually working for competitors
        </span>
      </h3>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-purple-600/10 to-transparent rounded-lg border border-purple-500/30"
          >
            <h4 className="text-purple-300 font-medium mb-2">
              💡 {insight.insight}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-gray-700/50 rounded p-3">
                <p className="text-gray-400 text-xs mb-1">Evidence</p>
                <p className="text-gray-200 text-sm">{insight.evidence}</p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                <p className="text-green-400 text-xs mb-1">Recommendation</p>
                <p className="text-green-200 text-sm">{insight.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CorrelationInsights;