// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Award, Calendar, Star, Download, Share2 } from 'lucide-react';

const Certificate = ({
  $w
}) => {
  const [certificateData, setCertificateData] = useState({
    level: '上品·福报丰厚',
    score: 75,
    date: '2024年2月19日',
    certificateId: 'FC-2024-001',
    description: '此证书证明持有人在儒释道三教修持中表现优秀，福报深厚，特此证明。'
  });

  // 从localStorage加载真实数据
  useEffect(() => {
    try {
      const stats = JSON.parse(localStorage.getItem('fortuneStats') || '{}');
      const records = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
      const totalScore = stats.totalScore || 75;
      const level = stats.level || '上品·福报丰厚';
      const today = new Date();
      const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

      // 生成证书编号
      const certificateId = `FC-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(records.length + 1).padStart(3, '0')}`;
      setCertificateData({
        level,
        score: totalScore,
        date: dateStr,
        certificateId,
        description: getLevelDescription(level)
      });
    } catch (error) {
      console.error('加载证书数据失败:', error);
    }
  }, []);
  const getLevelDescription = level => {
    const descriptions = {
      '上上品·福报圆满': '此证书证明持有人在儒释道三教修持中已达到圆满境界，福报深厚，德行圆满，特此证明。',
      '上品·福报丰厚': '此证书证明持有人在儒释道三教修持中表现优秀，福报深厚，特此证明。',
      '中品·福报平稳': '此证书证明持有人在儒释道三教修持中稳步提升，福报平稳，特此证明。',
      '下品·福报薄弱': '此证书证明持有人在儒释道三教修持中已有良好开端，继续努力，福报可期。',
      '下下品·福报亏空': '此证书证明持有人已开始儒释道三教修持之旅，愿持之以恒，必有收获。'
    };
    return descriptions[level] || descriptions['上品·福报丰厚'];
  };
  const getLevelColor = level => {
    const colors = {
      '上上品·福报圆满': 'from-yellow-400 to-orange-500',
      '上品·福报丰厚': 'from-amber-400 to-yellow-500',
      '中品·福报平稳': 'from-blue-400 to-indigo-500',
      '下品·福报薄弱': 'from-gray-400 to-gray-500',
      '下下品·福报亏空': 'from-red-400 to-red-500'
    };
    return colors[level] || colors['上品·福报丰厚'];
  };
  const getStarCount = score => {
    if (score >= 90) return 5;
    if (score >= 75) return 4;
    if (score >= 60) return 3;
    if (score >= 30) return 2;
    return 1;
  };
  const handleDownload = () => {
    // 模拟下载证书
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    // 绘制证书背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fef3c7');
    gradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制边框
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // 绘制标题
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('福报等级证书', canvas.width / 2, 120);

    // 绘制等级
    ctx.font = 'bold 36px serif';
    ctx.fillText(certificateData.level, canvas.width / 2, 200);

    // 绘制分数
    ctx.font = '24px serif';
    ctx.fillText(`总分：${certificateData.score}分`, canvas.width / 2, 250);

    // 绘制描述
    ctx.font = '18px serif';
    const lines = certificateData.description.split('。');
    lines.forEach((line, index) => {
      if (line.trim()) {
        ctx.fillText(line.trim() + '。', canvas.width / 2, 320 + index * 30);
      }
    });

    // 绘制日期和证书编号
    ctx.font = '16px serif';
    ctx.fillText(`证书编号：${certificateData.certificateId}`, canvas.width / 2, 480);
    ctx.fillText(`颁发日期：${certificateData.date}`, canvas.width / 2, 510);

    // 下载
    const link = document.createElement('a');
    link.download = `福报证书_${certificateData.certificateId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };
  const handleShare = () => {
    // 模拟分享功能
    if (navigator.share) {
      navigator.share({
        title: '我的福报等级证书',
        text: `我获得了${certificateData.level}证书，总分${certificateData.score}分！`,
        url: window.location.href
      });
    } else {
      // 复制到剪贴板
      const shareText = `我获得了${certificateData.level}证书，总分${certificateData.score}分！证书编号：${certificateData.certificateId}`;
      navigator.clipboard.writeText(shareText);
      alert('证书信息已复制到剪贴板');
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 pb-20">
      {/* 页面标题 */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">福报等级证书</h1>
        <p className="text-gray-600">您的修持成果认证</p>
      </div>

      {/* 证书主体 */}
      <div className="max-w-md mx-auto">
        <div className={`bg-gradient-to-br ${getLevelColor(certificateData.level)} rounded-2xl p-8 shadow-2xl border-4 border-white relative overflow-hidden`}>
          {/* 装饰性背景 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* 证书内容 */}
          <div className="relative z-10 text-center text-white">
            {/* 奖杯图标 */}
            <div className="mb-4">
              <Award className="w-16 h-16 mx-auto text-white" />
            </div>
            
            {/* 证书标题 */}
            <h2 className="text-2xl font-bold mb-2">福报等级证书</h2>
            
            {/* 等级 */}
            <div className="mb-4">
              <h3 className="text-3xl font-bold mb-2">{certificateData.level}</h3>
              
              {/* 星级评分 */}
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, index) => <Star key={index} className={`w-6 h-6 ${index < getStarCount(certificateData.score) ? 'text-yellow-300 fill-current' : 'text-white text-opacity-30'}`} />)}
              </div>
              
              <p className="text-lg opacity-90">总分：{certificateData.score}分</p>
            </div>
            
            {/* 描述 */}
            <div className="mb-6">
              <p className="text-sm opacity-90 leading-relaxed">
                {certificateData.description}
              </p>
            </div>
            
            {/* 证书信息 */}
            <div className="border-t border-white border-opacity-30 pt-4">
              <div className="flex justify-between items-center text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{certificateData.date}</span>
                </div>
                <div className="text-xs">
                  {certificateData.certificateId}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="mt-6 flex gap-3">
          <button onClick={handleDownload} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 font-medium transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            下载证书
          </button>
          <button onClick={handleShare} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-4 font-medium transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            分享证书
          </button>
        </div>
        
        {/* 证书说明 */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <h4 className="font-medium text-gray-800 mb-2">证书说明</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 证书基于您的福报评分自动生成</li>
            <li>• 分数越高，证书等级越高</li>
            <li>• 可下载保存或分享给朋友</li>
            <li>• 证书编号唯一，请妥善保存</li>
          </ul>
        </div>
      </div>
    </div>;
};
export default Certificate;