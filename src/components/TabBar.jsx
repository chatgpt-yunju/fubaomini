// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, BarChart3, Plus, TrendingUp, Award } from 'lucide-react';

const TabBar = ({
  $w,
  activeTab = 'home'
}) => {
  const tabs = [{
    id: 'home',
    name: '首页',
    icon: Home
  }, {
    id: 'assessment',
    name: '自评',
    icon: BarChart3
  }, {
    id: 'record',
    name: '记录',
    icon: Plus
  }, {
    id: 'certificate',
    name: '证书',
    icon: Award
  }, {
    id: 'analysis',
    name: '复盘',
    icon: TrendingUp
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="flex justify-around">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} onClick={() => $w.utils.navigateTo({
          pageId: tab.id
        })} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-gray-500'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-amber-600' : 'text-gray-500'}`}>
                {tab.name}
              </span>
            </button>;
      })}
      </div>
    </div>;
};
export { TabBar };