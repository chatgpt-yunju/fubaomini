// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Calendar, Filter, TrendingUp, TrendingDown, Clock, Edit, Trash2, X } from 'lucide-react';

const History = ({
  $w
}) => {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [editingRecord, setEditingRecord] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  useEffect(() => {
    // 从localStorage加载数据
    const loadRecordsFromStorage = () => {
      try {
        const stored = localStorage.getItem('fortuneRecords');
        if (stored) {
          const records = JSON.parse(stored);
          setRecords(records);
        } else {
          // 如果没有数据，使用默认数据
          const mockRecords = [{
            id: 1,
            type: '益福',
            category: '中品益福',
            content: '帮助同事解决工作难题',
            score: 5,
            date: '2024-02-19',
            time: '14:30'
          }, {
            id: 2,
            type: '损福',
            category: '下品损福',
            content: '因小事与家人争执',
            score: -3,
            date: '2024-02-19',
            time: '10:15'
          }, {
            id: 3,
            type: '补过',
            category: '真诚补过',
            content: '主动道歉并弥补过错',
            score: 8,
            date: '2024-02-18',
            time: '16:45'
          }, {
            id: 4,
            type: '益福',
            category: '上品益福',
            content: '参与公益活动，帮助贫困学生',
            score: 15,
            date: '2024-02-17',
            time: '09:20'
          }, {
            id: 5,
            type: '损福',
            category: '中品损福',
            content: '在工作中撒谎隐瞒事实',
            score: -6,
            date: '2024-02-16',
            time: '11:30'
          }, {
            id: 6,
            type: '益福',
            category: '下品益福',
            content: '主动让座给老人',
            score: 2,
            date: '2024-02-15',
            time: '08:45'
          }, {
            id: 7,
            type: '补过',
            category: '以功补过',
            content: '加班完成紧急项目',
            score: 12,
            date: '2024-02-14',
            time: '20:00'
          }, {
            id: 8,
            type: '损福',
            category: '下品损福',
            content: '浪费食物，没有珍惜粮食',
            score: -2,
            date: '2024-02-13',
            time: '12:30'
          }];
          setRecords(mockRecords);
          localStorage.setItem('fortuneRecords', JSON.stringify(mockRecords));
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };
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
  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true;
    return record.type === filter;
  });
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
  const formatDate = dateStr => {
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
  const groupRecordsByDate = records => {
    const grouped = {};
    records.forEach(record => {
      const dateKey = record.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(record);
    });
    return grouped;
  };
  const groupedRecords = groupRecordsByDate(filteredRecords);

  // 编辑记录
  const handleEditRecord = record => {
    setEditingRecord({
      ...record
    });
  };

  // 保存编辑
  const handleSaveEdit = () => {
    const updatedRecords = records.map(record => record.id === editingRecord.id ? editingRecord : record);
    setRecords(updatedRecords);
    localStorage.setItem('fortuneRecords', JSON.stringify(updatedRecords));
    setEditingRecord(null);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  // 删除记录
  const handleDeleteRecord = recordId => {
    const updatedRecords = records.filter(record => record.id !== recordId);
    setRecords(updatedRecords);
    localStorage.setItem('fortuneRecords', JSON.stringify(updatedRecords));
    setShowDeleteConfirm(null);
  };

  // 确认删除
  const confirmDelete = record => {
    setShowDeleteConfirm(record);
  };
  return <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
      {/* 头部 */}
      <div className="flex items-center gap-4 mb-6 pt-8">
        <button onClick={() => $w.utils.navigateBack()} className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 font-serif">历史记录</h1>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-amber-100">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-800">筛选条件</h3>
        </div>
        
        <div className="space-y-4">
          {/* 类型筛选 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">记录类型</label>
            <div className="flex gap-2">
              {['all', '益福', '损福', '补过'].map(type => <button key={type} onClick={() => setFilter(type)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === type ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {type === 'all' ? '全部' : type}
                </button>)}
            </div>
          </div>

          {/* 时间范围 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">时间范围</label>
            <div className="flex gap-2">
              {[{
              key: 'week',
              name: '近一周'
            }, {
              key: 'month',
              name: '近一月'
            }, {
              key: 'all',
              name: '全部'
            }].map(range => <button key={range.key} onClick={() => setDateRange(range.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateRange === range.key ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {range.name}
                </button>)}
            </div>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center border border-amber-100">
          <div className="text-2xl font-bold text-emerald-600">
            {records.filter(r => r.type === '益福').length}
          </div>
          <div className="text-sm text-gray-600">益福记录</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-amber-100">
          <div className="text-2xl font-bold text-red-600">
            {records.filter(r => r.type === '损福').length}
          </div>
          <div className="text-sm text-gray-600">损福记录</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-amber-100">
          <div className="text-2xl font-bold text-amber-600">
            {records.filter(r => r.type === '补过').length}
          </div>
          <div className="text-sm text-gray-600">补过记录</div>
        </div>
      </div>

      {/* 记录列表 */}
      <div className="space-y-4 mb-20">
        {Object.entries(groupedRecords).map(([date, dayRecords]) => <div key={date} className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
            <div className="bg-amber-50 px-6 py-3 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-amber-800">{formatDate(date)}</span>
                <span className="text-sm text-amber-600">({dayRecords.length}条记录)</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {dayRecords.map(record => <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                        <span className="text-xs text-gray-500">{record.category}</span>
                      </div>
                      <p className="text-gray-800 mb-2">{record.content}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{record.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 text-sm font-medium ${getScoreColor(record.score)}`}>
                        {getScoreIcon(record.score)}
                        <span>{record.score > 0 ? '+' : ''}{record.score}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditRecord(record)} className="p-1 text-gray-400 hover:text-blue-500 transition-colors" title="编辑">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => confirmDelete(record)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="删除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>)}
      </div>

      {filteredRecords.length === 0 && <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">暂无符合条件的记录</p>
        </div>}

      {/* 编辑记录模态框 */}
      {editingRecord && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">编辑记录</h3>
              <button onClick={handleCancelEdit} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 类型选择 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">记录类型</label>
                <select value={editingRecord.type} onChange={e => setEditingRecord({
              ...editingRecord,
              type: e.target.value
            })} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="益福">益福</option>
                  <option value="损福">损福</option>
                  <option value="补过">补过</option>
                </select>
              </div>

              {/* 分类选择 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">分类</label>
                <select value={editingRecord.category} onChange={e => setEditingRecord({
              ...editingRecord,
              category: e.target.value
            })} className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {editingRecord.type === '益福' && <>
                      <option value="上品益福">上品益福</option>
                      <option value="中品益福">中品益福</option>
                      <option value="下品益福">下品益福</option>
                    </>}
                  {editingRecord.type === '损福' && <>
                      <option value="上品损福">上品损福</option>
                      <option value="中品损福">中品损福</option>
                      <option value="下品损福">下品损福</option>
                    </>}
                  {editingRecord.type === '补过' && <>
                      <option value="真诚补过">真诚补过</option>
                      <option value="以功补过">以功补过</option>
                      <option value="改恶迁善">改恶迁善</option>
                    </>}
                </select>
              </div>

              {/* 分数调整 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">分数</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setEditingRecord({
                ...editingRecord,
                score: Math.max(editingRecord.score - 1, -50)
              })} className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                    -
                  </button>
                  <div className="text-center flex-1">
                    <div className={`text-2xl font-bold ${editingRecord.score > 0 ? 'text-emerald-600' : editingRecord.score < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {editingRecord.score > 0 ? '+' : ''}{editingRecord.score}
                    </div>
                  </div>
                  <button onClick={() => setEditingRecord({
                ...editingRecord,
                score: Math.min(editingRecord.score + 1, 50)
              })} className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                    +
                  </button>
                </div>
              </div>

              {/* 内容编辑 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">具体内容</label>
                <textarea value={editingRecord.content} onChange={e => setEditingRecord({
              ...editingRecord,
              content: e.target.value
            })} placeholder="请详细描述具体的行为和情境..." className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 mt-6">
              <button onClick={handleCancelEdit} className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button onClick={handleSaveEdit} className="flex-1 py-3 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                保存
              </button>
            </div>
          </div>
        </div>}

      {/* 删除确认模态框 */}
      {showDeleteConfirm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600 mb-6">
                确定要删除这条记录吗？此操作无法撤销。
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  取消
                </button>
                <button onClick={() => handleDeleteRecord(showDeleteConfirm.id)} className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
export default History;