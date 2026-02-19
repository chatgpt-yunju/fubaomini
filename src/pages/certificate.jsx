// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Award, Star, Trophy, Medal, Crown, Sparkles } from 'lucide-react';

const Certificate = ({
  $w
}) => {
  const [userStats, setUserStats] = useState({
    totalScore: 75,
    level: '上品·福报丰厚',
    todayScore: 0,
    recordsCount: 0
  });
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // 加载用户数据
  useEffect(() => {
    const loadUserData = () => {
      try {
        const stats = JSON.parse(localStorage.getItem('fortuneStats') || '{}');
        const records = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
        setUserStats({
          totalScore: stats.totalScore || 75,
          level: stats.level || '上品·福报丰厚',
          todayScore: stats.todayScore || 0,
          recordsCount: records.length
        });

        // 生成证书和成就
        generateCertificates(stats.totalScore || 75, records.length);
        generateAchievements(records);
      } catch (error) {
        console.error('加载用户数据失败:', error);
      }
    };
    loadUserData();

    // 监听数据变化
    const handleStorageChange = () => {
      loadUserData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 生成证书
  const generateCertificates = (score, recordCount) => {
    const certs = [];

    // 等级证书
    if (score >= 90) {
      certs.push({
        id: 'supreme',
        title: '上上品·福报圆满证书',
        description: '恭喜您达到福报圆满境界',
        icon: Crown,
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
        borderColor: 'border-yellow-300'
      });
    } else if (score >= 75) {
      certs.push({
        id: 'superior',
        title: '上品·福报丰厚证书',
        description: '恭喜您达到福报丰厚境界',
        icon: Trophy,
        color: 'from-emerald-400 to-teal-500',
        bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        borderColor: 'border-emerald-300'
      });
    } else if (score >= 60) {
      certs.push({
        id: 'middle',
        title: '中品·福报平稳证书',
        description: '恭喜您达到福报平稳境界',
        icon: Medal,
        color: 'from-blue-400 to-indigo-500',
        bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        borderColor: 'border-blue-300'
      });
    } else if (score >= 30) {
      certs.push({
        id: 'inferior',
        title: '下品·福报薄弱证书',
        description: '恭喜您达到福报薄弱境界',
        icon: Award,
        color: 'from-gray-400 to-slate-500',
        bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
        borderColor: 'border-gray-300'
      });
    }

    // 记录数量证书
    if (recordCount >= 100) {
      certs.push({
        id: 'centurion',
        title: '百善记录者',
        description: '记录了100次以上的善行',
        icon: Star,
        color: 'from-purple-400 to-pink-500',
        bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
        borderColor: 'border-purple-300'
      });
    } else if (recordCount >= 50) {
      certs.push({
        id: 'fifty',
        title: '五十善行记录者',
        description: '记录了50次以上的善行',
        icon: Star,
        color: 'from-indigo-400 to-purple-500',
        bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
        borderColor: 'border-indigo-300'
      });
    } else if (recordCount >= 10) {
      certs.push({
        id: 'ten',
        title: '十善记录者',
        description: '记录了10次以上的善行',
        icon: Star,
        color: 'from-cyan-400 to-blue-500',
        bgColor: 'bg-gradient-to-br from-cyan-50 to-blue-50',
        borderColor: 'border-cyan-300'
      });
    }
    setCertificates(certs);
  };

  // 生成成就
  const generateAchievements = records => {
    const achievements = [];

    // 连续记录天数
    const today = new Date();
    let consecutiveDays = 0;
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasRecord = records.some(record => record.date === dateStr);
      if (hasRecord) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    if (consecutiveDays >= 7) {
      achievements.push({
        id: 'week',
        title: '一周坚持',
        description: `连续${consecutiveDays}天记录善行`,
        icon: Sparkles,
        color: 'text-emerald-600'
      });
    }

    // 最高单日分数
    const dailyScores = {};
    records.forEach(record => {
      if (!dailyScores[record.date]) {
        dailyScores[record.date] = 0;
      }
      dailyScores[record.date] += record.score;
    });
    const maxDailyScore = Math.max(...Object.values(dailyScores));
    if (maxDailyScore >= 20) {
      achievements.push({
        id: 'peak',
        title: '单日高峰',
        description: `单日最高获得${maxDailyScore}分`,
        icon: Trophy,
        color: 'text-amber-600'
      });
    }
    setAchievements(achievements);
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-20">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">福报证书</h1>
        <p className="text-amber-100">您的修行成果与荣誉见证</p>
      </div>

      <div className="p-6 space-y-8">
        {/* 用户状态 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">当前状态</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{userStats.totalScore}</div>
              <div className="text-sm text-gray-500">总分</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-emerald-600">{userStats.level}</div>
              <div className="text-sm text-gray-500">等级</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-blue-600">{userStats.todayScore}</div>
              <div className="text-sm text-gray-500">今日分数</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-purple-600">{userStats.recordsCount}</div>
              <div className="text-sm text-gray-500">记录总数</div>
            </div>
          </div>
        </div>

        {/* 证书展示 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">获得证书</h2>
          {certificates.length > 0 ? <div className="grid gap-4">
              {certificates.map(cert => {
            const Icon = cert.icon;
            return <div key={cert.id} className={`${cert.bgColor} ${cert.borderColor} border-2 rounded-2xl p-6 shadow-sm`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${cert.color} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{cert.title}</h3>
                        <p className="text-sm text-gray-600">{cert.description}</p>
                      </div>
                    </div>
                  </div>;
          })}
            </div> : <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无证书，继续修行获得更多荣誉！</p>
            </div>}
        </div>

        {/* 成就徽章 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">成就徽章</h2>
          {achievements.length > 0 ? <div className="grid grid-cols-2 gap-4">
              {achievements.map(achievement => {
            const Icon = achievement.icon;
            return <div key={achievement.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} />
                      <h3 className="font-medium text-gray-800 text-sm">{achievement.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                    </div>
                  </div>;
          })}
            </div> : <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无成就，继续努力获得更多徽章！</p>
            </div>}
        </div>

        {/* 分享按钮 */}
        <div className="text-center">
          <button onClick={() => {
          // 分享功能
          if (navigator.share) {
            navigator.share({
              title: '我的福报证书',
              text: `我在福报量化应用中已达到${userStats.level}，总分${userStats.totalScore}分！`,
              url: window.location.href
            });
          } else {
            // 复制到剪贴板
            const text = `我在福报量化应用中已达到${userStats.level}，总分${userStats.totalScore}分！`;
            navigator.clipboard.writeText(text).then(() => {
              alert('已复制到剪贴板');
            });
          }
        }} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-colors">
            分享我的证书
          </button>
        </div>
      </div>
    </div>;
};
export default Certificate;