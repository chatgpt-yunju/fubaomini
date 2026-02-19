// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Heart, BookOpen, Mountain } from 'lucide-react';

const Assessment = ({
  $w
}) => {
  const [activeTab, setActiveTab] = useState('buddhism');
  const [scores, setScores] = useState({
    // 释门六度
    generosity: 4,
    // 布施
    discipline: 4,
    // 持戒
    patience: 4,
    // 忍辱
    diligence: 4,
    // 精进
    meditation: 4,
    // 禅定
    wisdom: 4,
    // 智慧

    // 儒门修齐
    selfCultivation: 4,
    // 修身
    familyHarmony: 4,
    // 齐家
    leadership: 4,
    // 治国
    service: 4,
    // 平天下

    // 道门守真
    taoMethod: 4,
    // 道法
    naturalness: 4,
    // 自然
    tranquility: 4 // 守静
  });
  const handleScoreChange = (key, value) => {
    setScores(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const calculateTotal = () => {
    const buddhismTotal = scores.generosity + scores.discipline + scores.patience + scores.diligence + scores.meditation + scores.wisdom;
    const confucianTotal = scores.selfCultivation + scores.familyHarmony + scores.leadership + scores.service;
    const taoistTotal = scores.taoMethod + scores.naturalness + scores.tranquility;
    return {
      buddhismTotal,
      confucianTotal,
      taoistTotal,
      grandTotal: buddhismTotal + confucianTotal + taoistTotal
    };
  };
  const {
    buddhismTotal,
    confucianTotal,
    taoistTotal,
    grandTotal
  } = calculateTotal();
  const getLevel = score => {
    if (score >= 4.5) return '上等';
    if (score >= 3.5) return '中等';
    if (score >= 2.5) return '下等';
    return '待提升';
  };
  const tabs = [{
    id: 'buddhism',
    name: '释门六度',
    icon: Heart,
    color: 'text-red-500',
    maxScore: 30
  }, {
    id: 'confucianism',
    name: '儒门修齐',
    icon: BookOpen,
    color: 'text-amber-500',
    maxScore: 40
  }, {
    id: 'taoism',
    name: '道门守真',
    icon: Mountain,
    color: 'text-emerald-500',
    maxScore: 30
  }];
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
      {/* 头部 */}
      <div className="flex items-center gap-4 mb-6 pt-8">
        <button onClick={() => $w.utils.navigateBack()} className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 font-serif">基础评分</h1>
      </div>

      {/* 总分显示 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{grandTotal}</div>
          <div className="text-gray-600">总分 (满分100分)</div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-red-500 font-medium">释门</div>
              <div className="text-lg font-bold">{buddhismTotal}/30</div>
            </div>
            <div className="text-center">
              <div className="text-amber-500 font-medium">儒门</div>
              <div className="text-lg font-bold">{confucianTotal}/40</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-500 font-medium">道门</div>
              <div className="text-lg font-bold">{taoistTotal}/30</div>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
          const Icon = tab.icon;
          return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 p-4 transition-colors ${activeTab === tab.id ? 'bg-amber-50 text-amber-600 border-b-2 border-amber-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.name}</span>
              </button>;
        })}
        </div>

        <div className="p-6">
          {/* 释门六度 */}
          {activeTab === 'buddhism' && <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">释门六度</h3>
                <p className="text-sm text-gray-600">培福修心之要，每度满分5分</p>
              </div>
              
              {[{
            key: 'generosity',
            name: '布施',
            desc: '主动利他，资源共享，不计回报'
          }, {
            key: 'discipline',
            name: '持戒',
            desc: '严守规则，言行一致，自律自省'
          }, {
            key: 'patience',
            name: '忍辱',
            desc: '宽以待人，化解冲突，平和心态'
          }, {
            key: 'diligence',
            name: '精进',
            desc: '持续学习，追求卓越，日新又新'
          }, {
            key: 'meditation',
            name: '禅定',
            desc: '专注当下，思虑澄明，决策果断'
          }, {
            key: 'wisdom',
            name: '智慧',
            desc: '洞察本质，创新思维，知行合一'
          }].map(item => <div key={item.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-500">{scores[item.key]}</div>
                      <div className="text-xs text-gray-500">{getLevel(scores[item.key])}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(score => <button key={score} onClick={() => handleScoreChange(item.key, score)} className={`w-8 h-8 rounded-full border-2 transition-colors ${scores[item.key] >= score ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 text-gray-400 hover:border-red-300'}`}>
                        {score}
                      </button>)}
                  </div>
                </div>)}
            </div>}

          {/* 儒门修齐 */}
          {activeTab === 'confucianism' && <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">儒门修齐</h3>
                <p className="text-sm text-gray-600">修齐治平之道，每目满分10分</p>
              </div>
              
              {[{
            key: 'selfCultivation',
            name: '修身',
            desc: '克己复礼，提升修养，以身作则'
          }, {
            key: 'familyHarmony',
            name: '齐家',
            desc: '团队和谐，协作互助，共同成长'
          }, {
            key: 'leadership',
            name: '治国',
            desc: '担当责任，统筹全局，达成目标'
          }, {
            key: 'service',
            name: '平天下',
            desc: '胸怀格局，放眼长远，价值创造'
          }].map(item => <div key={item.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-amber-500">{scores[item.key]}</div>
                      <div className="text-xs text-gray-500">{getLevel(scores[item.key])}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => <button key={score} onClick={() => handleScoreChange(item.key, score)} className={`w-7 h-7 rounded-full border-2 transition-colors text-xs ${scores[item.key] >= score ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300 text-gray-400 hover:border-amber-300'}`}>
                        {score}
                      </button>)}
                  </div>
                </div>)}
            </div>}

          {/* 道门守真 */}
          {activeTab === 'taoism' && <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">道门守真</h3>
                <p className="text-sm text-gray-600">顺道合真之旨，每目满分10分</p>
              </div>
              
              {[{
            key: 'taoMethod',
            name: '道法',
            desc: '顺应规律，顺势而为，灵活应变'
          }, {
            key: 'naturalness',
            name: '自然',
            desc: '实事求是，去伪存真，保持本真'
          }, {
            key: 'tranquility',
            name: '守静',
            desc: '沉淀思考，宁静致远，厚积薄发'
          }].map(item => <div key={item.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-500">{scores[item.key]}</div>
                      <div className="text-xs text-gray-500">{getLevel(scores[item.key])}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => <button key={score} onClick={() => handleScoreChange(item.key, score)} className={`w-7 h-7 rounded-full border-2 transition-colors text-xs ${scores[item.key] >= score ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 text-gray-400 hover:border-emerald-300'}`}>
                        {score}
                      </button>)}
                  </div>
                </div>)}
            </div>}
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="mt-6">
        <button onClick={() => {
        // 保存评分逻辑
        const now = new Date();
        const newRecord = {
          id: Date.now(),
          type: '自评',
          category: '基础评分',
          content: `释门${buddhismTotal}分，儒门${confucianTotal}分，道门${taoistTotal}分`,
          score: grandTotal - 75,
          // 转换为相对分数
          date: now.toISOString().split('T')[0],
          time: now.toTimeString().split(' ')[0].substring(0, 5)
        };
        const existingRecords = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');
        existingRecords.push(newRecord);
        localStorage.setItem('fortuneRecords', JSON.stringify(existingRecords));

        // 更新今日福报
        const today = now.toISOString().split('T')[0];
        const todayRecords = existingRecords.filter(record => record.date === today);
        const todayTotal = todayRecords.reduce((sum, record) => sum + record.score, 0);

        // 更新总分 - 修复计算逻辑
        const baseScore = 75;
        const recordsTotal = existingRecords.reduce((sum, record) => sum + record.score, 0);
        const calculatedTotal = Math.max(0, Math.min(100, baseScore + recordsTotal));

        // 更新等级
        let level = '下下品·福报亏空';
        if (calculatedTotal >= 90) {
          level = '上上品·福报圆满';
        } else if (calculatedTotal >= 75) {
          level = '上品·福报丰厚';
        } else if (calculatedTotal >= 60) {
          level = '中品·福报平稳';
        } else if (calculatedTotal >= 30) {
          level = '下品·福报薄弱';
        }

        // 保存到localStorage供其他页面使用
        localStorage.setItem('fortuneStats', JSON.stringify({
          totalScore: calculatedTotal,
          todayScore: todayTotal,
          level: level
        }));

        // 触发storage事件，让其他页面更新
        window.dispatchEvent(new Event('storage'));
        $w.utils.navigateTo({
          pageId: 'home'
        });
      }} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 font-medium transition-colors">
          保存评分
        </button>
      </div>
    </div>;
};
export default Assessment;