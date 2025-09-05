import React from 'react';
import './AchievementBadges.css';

const AchievementBadges = ({
  badges = [],
  maxVisible = 3,
  showAll = false,
  className = '',
  onClick,
  ...rest
}) => {
  const visibleBadges = showAll ? badges : badges.slice(0, maxVisible);
  const remainingCount = Math.max(0, badges.length - maxVisible);

  const badgeClasses = [
    'achievement-badges',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={badgeClasses} {...rest}>
      <div className="badges-container">
        {visibleBadges.map((badge, index) => (
          <div
            key={badge.id || index}
            className={`achievement-badge ${badge.type || 'default'}`}
            title={badge.description}
            onClick={() => onClick?.(badge)}
          >
            <span className="badge-icon" aria-hidden="true">
              {badge.icon || '🏆'}
            </span>
            <span className="badge-name">
              {badge.name}
            </span>
          </div>
        ))}
        
        {!showAll && remainingCount > 0 && (
          <div className="badge-more" onClick={() => onClick?.({ type: 'show-all' })}>
            <span className="badge-more-text">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementBadges;
