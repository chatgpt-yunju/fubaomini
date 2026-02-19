// 云函数：deepseek-ai
// 用于调用deepseek-v3.2大模型进行儒释道福报量化评分

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 儒释道福报评分系统提示词
const SYSTEM_PROMPT = `你是一个专业的儒释道福报量化评分助手。请根据用户描述的行为或想法，按照以下标准进行评分：

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
}`;

// 备用分析方案（关键词匹配）
const fallbackAnalysis = (message) => {
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

// 获取修持建议
const getAdvice = (type, category) => {
  const adviceMap = {
    '上品益福': '您的德行深厚，建议继续发扬光大，多行善事，广利众生。',
    '中品益福': '您的品格良好，建议继续保持，多关注身边需要帮助的人。',
    '下品益福': '您的善心值得肯定，建议从小事做起，积少成多。',
    '上品损福': '您的行为严重违背道德，建议深刻反省，立即改正。',
    '中品损福': '您的行为对他人造成不良影响，建议控制情绪，多从他人角度思考。',
    '下品损福': '您的行为虽然影响较小，但需要注意避免负面情绪。',
    '真诚补过': '您的改过态度值得肯定，建议继续努力，持续改进。',
    '以功补过': '您的努力值得认可，建议继续保持这种积极的态度。',
    '改恶迁善': '您的改变令人欣慰，建议坚持到底，成为更好的自己。'
  };
  
  return adviceMap[category] || '继续修身养性，多行善事。';
};

// 主函数
exports.main = async (event, context) => {
  const { model, messages, temperature = 0.7, max_tokens = 1000 } = event;
  
  try {
    // 构建完整的消息数组
    const fullMessages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...messages
    ];

    // 调用deepseek-v3.2 API（小程序原生方式）
    const response = await cloud.openapi.ai.createModel('deepseek', {
      model: model || 'deepseek-v3.2',
      messages: fullMessages,
      temperature,
      max_tokens
    });

    if (response && response.choices && response.choices[0]) {
      const aiResponse = response.choices[0].message.content;
      
      try {
        // 尝试解析JSON响应
        const result = JSON.parse(aiResponse);
        return {
          success: true,
          data: {
            score: result.score || 0,
            category: result.category || '中性行为',
            type: result.type || '中性',
            analysis: result.analysis || 'AI分析结果',
            advice: result.advice || '继续修身养性，多行善事。'
          }
        };
      } catch (parseError) {
        console.warn('AI响应解析失败，使用备用方案:', parseError);
        const userMessage = messages.find(msg => msg.role === 'user');
        const fallbackResult = fallbackAnalysis(userMessage ? userMessage.content : '');
        return {
          success: true,
          data: fallbackResult
        };
      }
    } else {
      throw new Error('AI API响应格式异常');
    }
  } catch (error) {
    console.error('调用deepseek-v3.2失败:', error);
    
    // 使用备用方案
    try {
      const userMessage = messages.find(msg => msg.role === 'user');
      const fallbackResult = fallbackAnalysis(userMessage ? userMessage.content : '');
      return {
        success: true,
        data: fallbackResult
      };
    } catch (fallbackError) {
      console.error('备用方案也失败:', fallbackError);
      return {
        success: false,
        error: 'AI分析暂时不可用，请稍后再试。'
      };
    }
  }
};