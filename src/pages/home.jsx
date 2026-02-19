// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Send, Bot, User, Award, TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';

const Home = ({
  $w
}) => {
  const [messages, setMessages] = useState([{
    id: 1,
    type: 'bot',
    content: '您好！我是您的儒释道福报智能评分助手。我将根据您的日常行为和思想状态，为您提供专业的福报量化评分和建议。\n\n请告诉我您今天做了什么善事或遇到了什么挑战，我会帮您分析并给出相应的福报评分。',
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [todayScore, setTodayScore] = useState(0);
  const [level, setLevel] = useState('');
  const [pendingAnalysis, setPendingAnalysis] = useState(null); // 待确认的评分结果
  const messagesEndRef = useRef(null);

  // 从localStorage加载数据
  const loadRecordsFromStorage = () => {
    try {
      const stored = localStorage.getItem('fortuneRecords');
      if (stored) {
        const records = JSON.parse(stored);

        // 计算今日福报
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = records.filter(record => record.date === today);
        const todayTotal = todayRecords.reduce((sum, record) => sum + record.score, 0);
        setTodayScore(todayTotal);

        // 计算总分（基础分 + 记录总分）
        const baseScore = 75;
        const recordsTotal = records.reduce((sum, record) => sum + record.score, 0);
        const calculatedTotal = Math.max(0, Math.min(100, baseScore + recordsTotal));
        setTotalScore(calculatedTotal);

        // 设置等级
        if (calculatedTotal >= 90) {
          setLevel('上上品·福报圆满');
        } else if (calculatedTotal >= 75) {
          setLevel('上品·福报丰厚');
        } else if (calculatedTotal >= 60) {
          setLevel('中品·福报平稳');
        } else if (calculatedTotal >= 30) {
          setLevel('下品·福报薄弱');
        } else {
          setLevel('下下品·福报亏空');
        }
      } else {
        setTotalScore(75);
        setTodayScore(0);
        setLevel('上品·福报丰厚');
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      setTotalScore(75);
      setTodayScore(0);
      setLevel('上品·福报丰厚');
    }
  };
  useEffect(() => {
    loadRecordsFromStorage();

    // 监听storage变化
    const handleStorageChange = () => {
      loadRecordsFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  // AI评分逻辑 - 调用deepseek-v3.2
  const analyzeMessage = async message => {
    try {
      // 使用小程序原生API调用deepseek-v3.2
      const result = await wx.cloud.callFunction({
        name: 'deepseek-ai',
        data: {
          model: 'deepseek-v3.2',
          messages: [{
            role: 'system',
            content: `你是一个专业的儒释道福报量化评分助手。请根据用户描述的行为或想法，按照以下标准进行评分：

评分体系：
- 益福：主动利他，资源共享，不计回报
  * 上品益福（10-20分）：救危济困、改恶迁善、广利大众
  * 中品益福（3-9分）：解人急难、启人智慧、孝亲护生
  * 下品益福（1-2分）：举手助人、惜福守礼、言出由衷

- 损福：违背道德，损害他人
  * 上品损福（-10到-30分）：违法乱纪、忤逆损人、欺世获利
  * 中品损福（-3到-9分）：失信骂人、嫉妒挑拨、纵欲伤身
  * 下品损福（-1到-2分）：妄语议人、浪费怠惰、抱怨内耗

- 补过：改过补过，以功抵过
  * 真诚补过（5-15分）：道歉弥补、诚心悔改
  * 以功补过（10-25分）：加班努力、主动承担
  * 改恶迁善（15-40分）：彻底改变、持续进步

请以JSON格式返回结果：
{
  "score": 分数,
  "category": "分类",
  "type": "类型",
  "analysis": "详细分析",
  "advice": "修持建议"
}`
          }, {
            role: 'user',
            content: message
          }],
          temperature: 0.7,
          max_tokens: 1000
        }
      });
      if (result && result.result && result.result.success) {
        const aiResponse = result.result.data;
        try {
          // 直接使用结构化数据
          return {
            score: aiResponse.score || 0,
            category: aiResponse.category || '中性行为',
            type: aiResponse.type || '中性',
            analysis: aiResponse.analysis || 'AI分析结果',
            advice: aiResponse.advice || '继续修身养性，多行善事。'
          };
        } catch (parseError) {
          console.warn('AI响应解析失败，使用备用方案:', parseError);
          return fallbackAnalysis(message);
        }
      } else {
        throw new Error('云函数调用失败');
      }
    } catch (error) {
      console.error('调用deepseek-v3.2失败:', error);
      // API调用失败时使用备用方案
      return fallbackAnalysis(message);
    }
  };

  // 备用分析方案（关键词匹配）
  const fallbackAnalysis = message => {
    const lowerMessage = message.toLowerCase();

    // 益福关键词
    const benefitKeywords = {
      '上品益福': ['帮助', '救助', '慈善', '公益', '捐赠', '奉献', '救危', '济困', '改恶迁善', '广利大众'],
      '中品益福': ['帮助', '协助', '支持', '关心', '照顾', '孝顺', '护生', '启人智慧', '解人急难'],
      '下品益福': ['让座', '微笑', '感谢', '道歉', '节约', '环保', '举手之劳', '言出由衷']
    };

    // 损福关键词
    const harmKeywords = {
      '上品损福': ['欺骗', '撒谎', '违法', '犯罪', '贪污', '受贿', '忤逆', '损人', '欺世获利'],
      '中品损福': ['争吵', '争执', '嫉妒', '挑拨', '纵欲', '伤身', '失信', '骂人'],
      '下品损福': ['抱怨', '浪费', '怠惰', '妄语', '议论', '内耗', '消极']
    };

    // 补过关键词
    const repairKeywords = {
      '真诚补过': ['道歉', '认错', '悔改', '反省', '检讨'],
      '以功补过': ['弥补', '补偿', '改正', '补救', '加班', '努力'],
      '改恶迁善': ['改变', '改善', '提升', '学习', '进步']
    };
    let score = 0;
    let category = '';
    let type = '';
    let analysis = '';

    // 检查益福
    for (const [level, keywords] of Object.entries(benefitKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        if (level === '上品益福') {
          score = Math.floor(Math.random() * 11) + 10; // 10-20
          analysis = '您的行为体现了高尚的品德和深厚的慈悲心，这是真正的上品益福。';
        } else if (level === '中品益福') {
          score = Math.floor(Math.random() * 7) + 3; // 3-9
          analysis = '您的行为展现了良好的品格和对他人的关爱，这是中品益福。';
        } else {
          score = Math.floor(Math.random() * 2) + 1; // 1-2
          analysis = '您的行为虽小但体现了善心，这是下品益福，积少成多。';
        }
        category = level;
        type = '益福';
        break;
      }
    }

    // 检查损福
    if (score === 0) {
      for (const [level, keywords] of Object.entries(harmKeywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
          if (level === '上品损福') {
            score = -(Math.floor(Math.random() * 21) + 10); // -10到-30
            analysis = '您的行为违背了道德准则，需要深刻反省和改正。';
          } else if (level === '中品损福') {
            score = -(Math.floor(Math.random() * 7) + 3); // -3到-9
            analysis = '您的行为对他人造成了不良影响，建议及时改正。';
          } else {
            score = -(Math.floor(Math.random() * 2) + 1); // -1到-2
            analysis = '您的行为虽然影响较小，但需要注意避免。';
          }
          category = level;
          type = '损福';
          break;
        }
      }
    }

    // 检查补过
    if (score === 0) {
      for (const [level, keywords] of Object.entries(repairKeywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
          score = Math.floor(Math.random() * 36) + 5; // 5-40
          analysis = '您的改过态度值得肯定，这是真正的修行进步。';
          category = level;
          type = '补过';
          break;
        }
      }
    }

    // 如果没有匹配到关键词，给出中性评价
    if (score === 0) {
      score = Math.floor(Math.random() * 3) - 1; // -1到1
      if (score > 0) {
        category = '下品益福';
        type = '益福';
        analysis = '您的行为体现了基本的善心，继续保持。';
      } else if (score < 0) {
        category = '下品损福';
        type = '损福';
        analysis = '建议您多反思自己的行为，避免负面情绪。';
      } else {
        category = '中性行为';
        type = '中性';
        analysis = '您的行为比较中性，建议多行善事以提升福报。';
      }
    }
    return {
      score,
      category,
      type,
      analysis,
      advice: getAdvice(type, category)
    };
  };

  // 保存记录到localStorage
  const saveRecord = (analysis, originalMessage) => {
    const now = new Date();
    const newRecord = {
      id: Date.now(),
      type: analysis.type,
      category: analysis.category,
      content: originalMessage,
      score: analysis.score,
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
    setTodayScore(todayTotal);

    // 更新总分
    const baseScore = 75;
    const recordsTotal = existingRecords.reduce((sum, record) => sum + record.score, 0);
    const calculatedTotal = Math.max(0, Math.min(100, baseScore + recordsTotal));
    setTotalScore(calculatedTotal);

    // 更新等级
    if (calculatedTotal >= 90) {
      setLevel('上上品·福报圆满');
    } else if (calculatedTotal >= 75) {
      setLevel('上品·福报丰厚');
    } else if (calculatedTotal >= 60) {
      setLevel('中品·福报平稳');
    } else if (calculatedTotal >= 30) {
      setLevel('下品·福报薄弱');
    } else {
      setLevel('下下品·福报亏空');
    }
    return newRecord;
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    try {
      // 调用AI分析
      const analysis = await analyzeMessage(inputMessage);

      // 检查是否需要评分（分数不为0）
      if (analysis.score !== 0) {
        // 显示评分结果，等待用户确认
        setPendingAnalysis({
          analysis,
          originalMessage: inputMessage
        });
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: `${analysis.analysis}\n\n📊 评分结果：\n• 类型：${analysis.type}\n• 分类：${analysis.category}\n• 分数：${analysis.score > 0 ? '+' : ''}${analysis.score}分\n\n💡 修持建议：\n${analysis.advice}\n\n请确认是否保存此评分记录？`,
          timestamp: new Date(),
          score: analysis.score,
          needsConfirmation: true
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        // 普通聊天，直接显示结果
        const botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: `${analysis.analysis}\n\n💡 修持建议：\n${analysis.advice}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('AI分析失败:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: '抱歉，AI分析暂时不可用，请稍后再试或使用其他功能。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // 确认保存评分
  const confirmScore = () => {
    if (!pendingAnalysis) return;
    const {
      analysis,
      originalMessage
    } = pendingAnalysis;
    const record = saveRecord(analysis, originalMessage);

    // 发送确认消息
    const confirmMessage = {
      id: Date.now(),
      type: 'bot',
      content: `✅ 已保存评分记录！\n\n当前总分：${Math.max(0, Math.min(100, 75 + record.score))}分（${getCurrentLevel(75 + record.score)}）\n\n继续与我交流您的日常行为吧！`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmMessage]);
    setPendingAnalysis(null);
  };

  // 取消评分
  const cancelScore = () => {
    const cancelMessage = {
      id: Date.now(),
      type: 'bot',
      content: '好的，评分记录已取消。您可以继续与我交流，或者重新描述您的行为。',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, cancelMessage]);
    setPendingAnalysis(null);
  };

  // 获取当前等级
  const getCurrentLevel = score => {
    if (score >= 90) {
      return '上上品·福报圆满';
    } else if (score >= 75) {
      return '上品·福报丰厚';
    } else if (score >= 60) {
      return '中品·福报平稳';
    } else if (score >= 30) {
      return '下品·福报薄弱';
    } else {
      return '下下品·福报亏空';
    }
  };

  // 获取修持建议
  const getAdvice = (type, category) => {
    const adviceMap = {
      '益福': {
        '上品益福': '继续保持您的慈悲心和奉献精神，您的善行正在积累深厚的福报。',
        '中品益福': '您的善行很好，建议继续培养对他人的关爱之心。',
        '下品益福': '善行虽小但意义重大，建议多关注身边需要帮助的人。'
      },
      '损福': {
        '上品损福': '建议深刻反省，诚心改过，多行善事以弥补过失。',
        '中品损福': '需要控制情绪，多从他人角度思考，避免伤害他人。',
        '下品损福': '注意言行举止，避免负面情绪影响自己和他人。'
      },
      '补过': {
        '真诚补过': '您的改过态度很好，继续保持反思和修正的心态。',
        '以功补过': '用行动弥补过失是很好的方式，继续努力提升自己。',
        '改恶迁善': '改变需要持续的努力，为您的进步感到高兴。'
      }
    };
    return adviceMap[type]?.[category] || '继续修身养性，多行善事。';
  };
  const getScoreColor = score => {
    if (score > 0) return 'text-emerald-600';
    if (score < 0) return 'text-red-600';
    return 'text-gray-600';
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
      {/* 头部状态栏 */}
      <div className="bg-white shadow-sm border-b border-amber-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-800 font-serif">AI福报评分助手</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">{totalScore}</div>
              <div className="text-xs text-gray-500">总分</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${getScoreColor(todayScore)}`}>
                {todayScore > 0 ? '+' : ''}{todayScore}
              </div>
              <div className="text-xs text-gray-500">今日</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-amber-600 font-medium">{level}</div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`rounded-2xl p-4 ${message.type === 'user' ? 'bg-amber-500 text-white' : 'bg-white text-gray-800 shadow-sm border border-gray-100'}`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.score && <div className={`mt-2 text-sm font-medium ${getScoreColor(message.score)}`}>
                    评分：{message.score > 0 ? '+' : ''}{message.score}分
                  </div>}
                {message.needsConfirmation && <div className="mt-3 flex gap-2">
                    <button onClick={confirmScore} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                      确认保存
                    </button>
                    <button onClick={cancelScore} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors">
                      取消
                    </button>
                  </div>}
              </div>
            </div>
          </div>)}
        
        {isTyping && <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
                animationDelay: '0.1s'
              }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{
                animationDelay: '0.2s'
              }}></div>
                </div>
              </div>
            </div>
          </div>}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-gray-200 p-4 pb-20">
        {pendingAnalysis ? <div className="text-center text-gray-500 text-sm">
            请先确认或取消当前的评分记录
          </div> : <div className="flex gap-3">
            <input type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="请描述您今天的行为、想法或遇到的挑战..." className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" disabled={isTyping} />
            <button onClick={sendMessage} disabled={!inputMessage.trim() || isTyping} className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>}
      </div>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-around">
          <button onClick={() => $w.utils.navigateTo({
          pageId: 'home'
        })} className="flex flex-col items-center gap-1 text-amber-600">
            <Bot className="w-5 h-5" />
            <span className="text-xs">AI助手</span>
          </button>
          <button onClick={() => $w.utils.navigateTo({
          pageId: 'assessment'
        })} className="flex flex-col items-center gap-1 text-gray-500">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">自评</span>
          </button>
          <button onClick={() => $w.utils.navigateTo({
          pageId: 'history'
        })} className="flex flex-col items-center gap-1 text-gray-500">
            <Calendar className="w-5 h-5" />
            <span className="text-xs">历史</span>
          </button>
          <button onClick={() => $w.utils.navigateTo({
          pageId: 'analysis'
        })} className="flex flex-col items-center gap-1 text-gray-500">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">复盘</span>
          </button>
        </div>
      </div>
    </div>;
};
export default Home;