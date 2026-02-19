// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Award, TrendingUp, TrendingDown } from 'lucide-react';

const ScoreCard = ({
  title,
  score,
  maxScore = 100,
  level = '',
  trend = 'stable',
  showProgress = true,
  className = ''
}) => {
  const getScoreColor = (score, maxScore) => {
    const percentage = score / maxScore * 100;
    if (percentage >= 90) return 'text-purple-600';
    if (percentage >= 75) return 'text-emerald-600';
    if (percentage >= 60) return 'text-amber-600';
    if (percentage >= 30) return 'text-orange-600';
    return 'text-red-600';
  };
  const getProgressColor = (score, maxScore) => {
    const percentage = score / maxScore * 100;
    if (percentage >= 90) return 'from-purple-400 to-purple-600';
    if (percentage >= 75) return 'from-emerald-400 to-emerald-600';
    if (percentage >= 60) return 'from-amber-400 to-amber-600';
    if (percentage >= 30) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };
  const getTrendIcon = trend => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };
  const scoreColor = getScoreColor(score, maxScore);
  const progressColor = getProgressColor(score, maxScore);
  const percentage = Math.round(score / maxScore * 100);
  return <div className={`bg-white rounded-2xl shadow-lg p-6 border border-amber-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {level && <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-600 font-medium">{level}</span>
          </div>}
      </div>
      
      <div className="text-center mb-4">
        <div className={`text-3xl font-bold ${scoreColor} mb-1`}>
          {score}
        </div>
        <div className="text-sm text-gray-500">
          {maxScore !== 100 && `满分${maxScore}分`}
        </div>
        {trend !== 'stable' && <div className="flex items-center justify-center gap-1 mt-2">
            {getTrendIcon(trend)}
            <span className="text-xs text-gray-500">
              {trend === 'up' ? '上升' : '下降'}
            </span>
          </div>}
      </div>

      {showProgress && <div>
          <div className="bg-gray-200 rounded-full h-3 mb-2">
            <div className={`bg-gradient-to-r ${progressColor} h-3 rounded-full transition-all duration-500`} style={{
          width: `${percentage}%`
        }}></div>
          </div>
          <div className="text-center text-xs text-gray-500">
            {percentage}%
          </div>
        </div>}
    </div>;
};
export { ScoreCard };