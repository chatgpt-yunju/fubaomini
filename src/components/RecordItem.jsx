// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

const RecordItem = ({
  record,
  onClick
}) => {
  const getScoreColor = score => {
    if (score > 0) return 'text-emerald-600';
    if (score < 0) return 'text-red-600';
    return 'text-gray-600';
  };
  const getScoreIcon = score => {
    if (score > 0) return <TrendingUp className="w-4 h-4" />;
    if (score < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };
  const getTypeColor = type => {
    switch (type) {
      case '益福':
        return 'bg-emerald-100 text-emerald-700';
      case '损福':
        return 'bg-red-100 text-red-700';
      case '补过':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const formatTime = timeStr => {
    if (!timeStr) return '';
    return timeStr;
  };
  const formatDate = dateStr => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  return <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer" onClick={() => onClick && onClick(record)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
              {record.type}
            </span>
            {record.category && <span className="text-xs text-gray-500">{record.category}</span>}
          </div>
          <p className="text-gray-800 mb-2 line-clamp-2">{record.content}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatDate(record.date)} {formatTime(record.time)}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${getScoreColor(record.score)} ml-4`}>
          {getScoreIcon(record.score)}
          <span>{record.score > 0 ? '+' : ''}{record.score}</span>
        </div>
      </div>
    </div>;
};
export { RecordItem };