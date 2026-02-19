// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Heart, BookOpen, Mountain } from 'lucide-react';

const CategoryIcon = ({
  type,
  size = 'w-5 h-5'
}) => {
  const iconProps = {
    className: size
  };
  switch (type) {
    case 'buddhism':
    case '释门':
      return <Heart {...iconProps} />;
    case 'confucianism':
    case '儒门':
      return <BookOpen {...iconProps} />;
    case 'taoism':
    case '道门':
      return <Mountain {...iconProps} />;
    default:
      return <Heart {...iconProps} />;
  }
};
const CategoryColor = ({
  type
}) => {
  switch (type) {
    case 'buddhism':
    case '释门':
      return 'text-red-500';
    case 'confucianism':
    case '儒门':
      return 'text-amber-500';
    case 'taoism':
    case '道门':
      return 'text-emerald-500';
    default:
      return 'text-gray-500';
  }
};
const CategoryBg = ({
  type
}) => {
  switch (type) {
    case 'buddhism':
    case '释门':
      return 'bg-red-50 border-red-200';
    case 'confucianism':
    case '儒门':
      return 'bg-amber-50 border-amber-200';
    case 'taoism':
    case '道门':
      return 'bg-emerald-50 border-emerald-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};
export { CategoryIcon, CategoryColor, CategoryBg };