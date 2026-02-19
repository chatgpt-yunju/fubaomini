// @ts-ignore;
import React, { useState, useRef } from 'react';
// @ts-ignore;
import { ArrowLeft, Download, Share2, Award, Calendar, Quote } from 'lucide-react';

const Poster = ({
  $w
}) => {
  const [posterData, setPosterData] = useState({
    totalScore: 75,
    level: '上品·福报丰厚',
    date: '2024年2月19日',
    name: '常云举',
    quote: '积善之家，必有余庆；积不善之家，必有余殃。'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);
  const getLevelColor = score => {
    if (score >= 90) return {
      color: '#8B5CF6',
      bg: 'from-purple-400 to-purple-600'
    };
    if (score >= 75) return {
      color: '#10B981',
      bg: 'from-emerald-400 to-emerald-600'
    };
    if (score >= 60) return {
      color: '#F59E0B',
      bg: 'from-amber-400 to-amber-600'
    };
    if (score >= 30) return {
      color: '#F97316',
      bg: 'from-orange-400 to-orange-600'
    };
    return {
      color: '#EF4444',
      bg: 'from-red-400 to-red-600'
    };
  };
  const levelStyle = getLevelColor(posterData.totalScore);
  const generatePoster = async () => {
    setIsGenerating(true);
    try {
      // 模拟海报生成过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 这里可以集成真实的海报生成库
      alert('海报生成成功！');
    } catch (error) {
      console.error('海报生成失败:', error);
      alert('海报生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };
  const sharePoster = () => {
    if (navigator.share) {
      navigator.share({
        title: '我的福报评分证书',
        text: `我在儒释道福报量化评分系统中获得了${posterData.level}！`,
        url: window.location.href
      });
    } else {
      // 复制到剪贴板
      navigator.clipboard.writeText(`我在儒释道福报量化评分系统中获得了${posterData.level}！总分：${posterData.totalScore}分`);
      alert('已复制到剪贴板');
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
      {/* 头部 */}
      <div className="flex items-center gap-4 mb-6 pt-8">
        <button onClick={() => $w.utils.navigateBack()} className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 font-serif">福报证书</h1>
      </div>

      {/* 海报预览 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-amber-100">
        {/* 海报头部 */}
        <div className={`bg-gradient-to-r ${levelStyle.bg} p-8 text-white text-center`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-8 h-8" />
            <h2 className="text-2xl font-bold font-serif">福报量化评分证书</h2>
          </div>
          <div className="text-sm opacity-90">常云举团队定制</div>
        </div>

        {/* 海报内容 */}
        <div className="p-8 text-center">
          {/* 用户信息 */}
          <div className="mb-6">
            <div className="text-gray-600 mb-2">兹证明</div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{posterData.name}</div>
            <div className="text-gray-600">在儒释道福报量化评分系统中</div>
          </div>

          {/* 等级展示 */}
          <div className="mb-6">
            <div className="text-4xl font-bold mb-2" style={{
            color: levelStyle.color
          }}>
              {posterData.totalScore}
            </div>
            <div className="text-xl font-medium mb-2" style={{
            color: levelStyle.color
          }}>
              {posterData.level}
            </div>
            <div className="text-gray-500">满分100分</div>
          </div>

          {/* 进度条 */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-full h-4 mb-2">
              <div className={`bg-gradient-to-r ${levelStyle.bg} h-4 rounded-full transition-all duration-1000`} style={{
              width: `${posterData.totalScore}%`
            }}></div>
            </div>
            <div className="text-sm text-gray-500">
              {posterData.totalScore >= 90 ? '德厚智明，三教兼修' : posterData.totalScore >= 75 ? '福基牢固，德行无亏' : posterData.totalScore >= 60 ? '福报及格，根基尚在' : posterData.totalScore >= 30 ? '福基不足，漏洞颇多' : '福报亏空，亟需补过'}
            </div>
          </div>

          {/* 经典名句 */}
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Quote className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">经典名句</span>
            </div>
            <div className="text-gray-700 italic">
              “{posterData.quote}”
            </div>
            <div className="text-xs text-gray-500 mt-2">——《周易》</div>
          </div>

          {/* 日期和签名 */}
          <div className="flex justify-between items-end text-sm text-gray-500">
            <div>
              <div>评定日期</div>
              <div className="font-medium">{posterData.date}</div>
            </div>
            <div className="text-right">
              <div>常云举团队</div>
              <div className="font-medium">儒释道福报量化评分系统</div>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-4 mb-20">
        <button onClick={generatePoster} disabled={isGenerating} className={`w-full bg-gradient-to-r ${levelStyle.bg} hover:opacity-90 disabled:opacity-50 text-white rounded-xl p-4 font-medium transition-all flex items-center justify-center gap-2`}>
          <Download className="w-5 h-5" />
          {isGenerating ? '生成中...' : '下载海报'}
        </button>
        
        <button onClick={sharePoster} className="w-full bg-white hover:bg-gray-50 text-gray-700 rounded-xl p-4 font-medium transition-colors flex items-center justify-center gap-2 border border-gray-200">
          <Share2 className="w-5 h-5" />
          分享证书
        </button>
      </div>

      {/* 修持要旨 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-amber-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">修持要旨</h3>
        <div className="space-y-3 text-sm text-gray-600">
          {posterData.totalScore >= 90 ? <>
              <p>• 守初心，行利众，持满不溢，慎终如始</p>
              <p>• 继续精进，保持当前的高标准要求</p>
              <p>• 帮助他人，共同提升福报水平</p>
            </> : posterData.totalScore >= 75 ? <>
              <p>• 补齐短板，谨护小过，精进不辍</p>
              <p>• 重点关注得分较低的维度</p>
              <p>• 保持稳定，避免大的过失</p>
            </> : posterData.totalScore >= 60 ? <>
              <p>• 先堵漏洞，固守根本，再求增益</p>
              <p>• 减少损福行为，增加益福记录</p>
              <p>• 建立良好的日常习惯</p>
            </> : <>
              <p>• 诚心补过，革除恶习，重建福基</p>
              <p>• 立即停止大的过失行为</p>
              <p>• 从小事做起，日积小善</p>
            </>}
        </div>
      </div>
    </div>;
};
export default Poster;