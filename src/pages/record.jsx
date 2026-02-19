// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ArrowLeft, Plus, Minus, RotateCcw, Save } from 'lucide-react';

const Record = ({
  $w,
  page
}) => {
  const [activeType, setActiveType] = useState(page?.dataset?.params?.type || 'benefit');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [score, setScore] = useState(1);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = {
    benefit: {
      name: '益福记录',
      icon: Plus,
      color: 'emerald',
      items: [{
        name: '上品益福',
        desc: '救危济困、改恶迁善、广利大众',
        scoreRange: [10, 20]
      }, {
        name: '中品益福',
        desc: '解人急难、启人智慧、孝亲护生',
        scoreRange: [3, 9]
      }, {
        name: '下品益福',
        desc: '举手助人、惜福守礼、言出由衷',
        scoreRange: [1, 2]
      }]
    },
    harm: {
      name: '损福记录',
      icon: Minus,
      color: 'red',
      items: [{
        name: '上品损福',
        desc: '违法乱纪、忤逆损人、欺世获利',
        scoreRange: [-30, -10]
      }, {
        name: '中品损福',
        desc: '失信骂人、嫉妒挑拨、纵欲伤身',
        scoreRange: [-9, -3]
      }, {
        name: '下品损福',
        desc: '妄语议人、浪费怠惰、抱怨内耗',
        scoreRange: [-2, -1]
      }]
    },
    remedy: {
      name: '补过记录',
      icon: RotateCcw,
      color: 'amber',
      items: [{
        name: '真诚补过',
        desc: '主动道歉、弥补损失、真心悔改',
        scoreRange: [5, 15]
      }, {
        name: '以功补过',
        desc: '将功赎罪、立功赎罪、积善消业',
        scoreRange: [10, 25]
      }, {
        name: '改恶迁善',
        desc: '彻底改过、重新做人、弃恶从善',
        scoreRange: [15, 40]
      }]
    }
  };
  const currentCategory = categories[activeType];
  const Icon = currentCategory.icon;
  const handleCategorySelect = category => {
    setSelectedCategory(category.name);
    setScore(category.scoreRange[0]);
  };
  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('请输入具体内容');
      return;
    }
    setIsSubmitting(true);
    try {
      // 创建新记录
      const now = new Date();
      const newRecord = {
        id: Date.now(),
        // 使用时间戳作为ID
        type: activeType === 'benefit' ? '益福' : activeType === 'harm' ? '损福' : '补过',
        category: selectedCategory,
        content: content.trim(),
        score: score,
        date: now.toISOString().split('T')[0],
        // YYYY-MM-DD
        time: now.toTimeString().split(' ')[0].substring(0, 5) // HH:MM
      };

      // 从localStorage获取现有记录
      const existingRecords = JSON.parse(localStorage.getItem('fortuneRecords') || '[]');

      // 添加新记录
      existingRecords.push(newRecord);

      // 保存到localStorage
      localStorage.setItem('fortuneRecords', JSON.stringify(existingRecords));

      // 返回首页
      $w.utils.navigateTo({
        pageId: 'home'
      });
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
      {/* 头部 */}
      <div className="flex items-center gap-4 mb-6 pt-8">
        <button onClick={() => $w.utils.navigateBack()} className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 font-serif">行为记录</h1>
      </div>

      {/* 类型选择 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">记录类型</h3>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(categories).map(([key, category]) => {
          const CategoryIcon = category.icon;
          return <button key={key} onClick={() => {
            setActiveType(key);
            setSelectedCategory('');
            setScore(1);
            setContent('');
          }} className={`p-4 rounded-xl border-2 transition-all ${activeType === key ? `border-${category.color}-500 bg-${category.color}-50 text-${category.color}-700` : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>
                <CategoryIcon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{category.name}</div>
              </button>;
        })}
        </div>
      </div>

      {/* 分类选择 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {currentCategory.name} - 分类选择
        </h3>
        <div className="space-y-3">
          {currentCategory.items.map((item, index) => <button key={index} onClick={() => handleCategorySelect(item)} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedCategory === item.name ? `border-${currentCategory.color}-500 bg-${currentCategory.color}-50` : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{item.name}</h4>
                <span className={`text-sm font-medium text-${currentCategory.color}-600`}>
                  {item.scoreRange[0] > 0 ? '+' : ''}{item.scoreRange[0]} ~ {item.scoreRange[1] > 0 ? '+' : ''}{item.scoreRange[1]}分
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </button>)}
        </div>
      </div>

      {/* 分数调整 */}
      {selectedCategory && <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">分数调整</h3>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setScore(Math.max(score - 1, -50))} className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
              -
            </button>
            <div className="text-center">
              <div className={`text-3xl font-bold text-${currentCategory.color}-600`}>
                {score > 0 ? '+' : ''}{score}
              </div>
              <div className="text-sm text-gray-500">当前分数</div>
            </div>
            <button onClick={() => setScore(Math.min(score + 1, 50))} className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
              +
            </button>
          </div>
        </div>}

      {/* 内容输入 */}
      {selectedCategory && <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">具体内容</h3>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="请详细描述具体的行为和情境..." className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
        </div>}

      {/* 提交按钮 */}
      {selectedCategory && content.trim() && <div className="mb-20">
          <button onClick={handleSubmit} disabled={isSubmitting} className={`w-full bg-${currentCategory.color}-500 hover:bg-${currentCategory.color}-600 disabled:opacity-50 text-white rounded-xl p-4 font-medium transition-colors flex items-center justify-center gap-2`}>
            <Save className="w-5 h-5" />
            {isSubmitting ? '提交中...' : '保存记录'}
          </button>
        </div>}
    </div>;
};
export default Record;