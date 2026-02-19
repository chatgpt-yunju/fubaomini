// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, TrendingUp, Calendar, BarChart3, Target, Award } from 'lucide-react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const Analysis = ({
  $w
}) => {
  const [timeRange, setTimeRange] = useState('month');
  const [analysisData, setAnalysisData] = useState({
    totalScore: 75,
    trend: 'up',
    weeklyData: [],
    categoryData: [],
    level: '上品·福报丰厚',
    suggestions: []
  });
  useEffect(() => {
    // 从localStorage加载真实数据
    const loadRealData = () => {
      try {
        const stats = JSON.parse(localStorage.getItem('fortuneStats') || '{}');
        const records = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
        const totalScore = stats.totalScore || 75;
        const level = stats.level || '上品·福报丰厚';

        // 计算最近7天的数据
        const today = new Date();
        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const dayRecords = records.filter(record => record.date === dateStr);
          const dayScore = dayRecords.reduce((sum, record) => sum + record.score, 0);
          const totalDayScore = Math.max(0, Math.min(100, 75 + dayScore));
          weeklyData.push({
            date: `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
            score: totalDayScore
          });
        }

        // 计算三教分布（基于记录类型）
        const categoryData = [{
          name: '释门六度',
          value: records.filter(r => r.type === '益福' || r.type === '损福').reduce((sum, r) => sum + Math.abs(r.score), 0),
          color: '#EF4444'
        }, {
          name: '儒门修齐',
          value: records.filter(r => r.type === '自评').reduce((sum, r) => sum + Math.abs(r.score), 0),
          color: '#F59E0B'
        }, {
          name: '道门守真',
          value: records.filter(r => r.type === '补过').reduce((sum, r) => sum + Math.abs(r.score), 0),
          color: '#10B981'
        }];

        // 生成建议
        const suggestions = [{
          type: '优势',
          content: `您在${level}方面表现优秀，继续保持。`,
          icon: '👍'
        }, {
          type: '改进',
          content: '建议加强日常修行，多行善事以提升福报。',
          icon: '🧘'
        }, {
          type: '目标',
          content: `下月目标：总分达到${Math.min(100, totalScore + 5)}分，重点提升智慧和精进两个维度。`,
          icon: '🎯'
        }];
        setAnalysisData({
          totalScore,
          trend: 'up',
          weeklyData,
          categoryData,
          level,
          suggestions
        });
      } catch (error) {
        console.error('加载分析数据失败:', error);
        // 使用默认数据
        setAnalysisData({
          totalScore: 75,
          trend: 'up',
          weeklyData: [],
          categoryData: [],
          level: '上品·福报丰厚',
          suggestions: []
        });
      }
    };
    loadRealData();

    // 监听storage变化
    const handleStorageChange = () => {
      loadRealData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [timeRange]);
  const getLevelInfo = score => {
    if (score >= 90) return {
      level: '上上品·福报圆满',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    };
    if (score >= 75) return {
      level: '上品·福报丰厚',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    };
    if (score >= 60) return {
      level: '中品·福报平稳',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    };
    if (score >= 30) return {
      level: '下品·福报薄弱',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    };
    return {
      level: '下下品·福报亏空',
      color: 'text-red-600',
      bg: 'bg-red-50'
    };
  };
  const levelInfo = getLevelInfo(analysisData.totalScore);
  const COLORS = ['#EF4444', '#F59E0B', '#10B981'];
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
      {/* 头部 */}
      <div className="flex items-center gap-4 mb-6 pt-8">
        <button onClick={() => $w.utils.navigateBack()} className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 font-serif">复盘分析</h1>
      </div>

      {/* 时间范围选择 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">分析周期</h3>
          <Calendar className="w-5 h-5 text-gray-500" />
        </div>
        <div className="flex gap-2">
          {[{
          key: 'week',
          name: '近一周'
        }, {
          key: 'month',
          name: '近一月'
        }, {
          key: 'quarter',
          name: '近三月'
        }].map(range => <button key={range.key} onClick={() => setTimeRange(range.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range.key ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {range.name}
            </button>)}
        </div>
      </div>

      {/* 总分与等级 */}
      <div className={`${levelInfo.bg} rounded-2xl shadow-lg p-6 mb-6 border border-amber-100`}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className={`w-6 h-6 ${levelInfo.color}`} />
            <h3 className="text-lg font-semibold text-gray-800">当前等级</h3>
          </div>
          <div className={`text-3xl font-bold ${levelInfo.color} mb-2`}>
            {analysisData.totalScore}
          </div>
          <div className={`text-lg font-medium ${levelInfo.color}`}>
            {levelInfo.level}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-gray-600">较上周上升 3 分</span>
          </div>
        </div>
      </div>

      {/* 趋势图 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-800">福报趋势</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysisData.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }} />
              <Line type="monotone" dataKey="score" stroke="#F59E0B" strokeWidth={3} dot={{
              fill: '#F59E0B',
              strokeWidth: 2,
              r: 4
            }} activeDot={{
              r: 6,
              stroke: '#F59E0B',
              strokeWidth: 2
            }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 三教分布 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">三教分布</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analysisData.categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {analysisData.categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {analysisData.categoryData.map((item, index) => <div key={item.name} className="text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{
            backgroundColor: COLORS[index]
          }}></div>
              <div className="text-sm font-medium text-gray-800">{item.name}</div>
              <div className="text-lg font-bold" style={{
            color: COLORS[index]
          }}>
                {item.value}
              </div>
            </div>)}
        </div>
      </div>

      {/* 修持建议 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-20 border border-amber-100">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-800">修持建议</h3>
        </div>
        <div className="space-y-4">
          {analysisData.suggestions.map((suggestion, index) => <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl">{suggestion.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 mb-1">{suggestion.type}</div>
                <div className="text-sm text-gray-600">{suggestion.content}</div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default Analysis;