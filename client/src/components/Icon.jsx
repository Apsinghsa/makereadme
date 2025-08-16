import React from 'react';

const Icon = ({ name, ...props }) => {
  const getIconPath = (iconName) => {
    switch (iconName) {
      case 'box-arrow':
        return '/assets/icons/box-arrow.svg';
      case 'heart':
        return '/assets/icons/heart.svg';
      case 'info':
        return '/assets/icons/info.svg';
      case 'link':
        return '/assets/icons/link.svg';
      case 'question-mark':
        return '/assets/icons/question-mark.svg';
      case 'save-icon':
        return '/assets/icons/save-icon.svg';
      case 'sun-theme':
        return '/assets/icons/sun-theme.svg';
      default:
        return '';
    }
  };

  const iconPath = getIconPath(name);

  if (!iconPath) {
    console.error(`Icon "${name}" not found.`);
    return null;
  }

  return <img src={iconPath} {...props} />;
};

export default Icon;
