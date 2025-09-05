import React, { useState } from 'react';
import './Avatar.css';

const Avatar = ({
  src = null,
  alt = '',
  name = '',
  size = 'medium',
  shape = 'circle',
  variant = 'default',
  status = null,
  badge = null,
  fallbackIcon = '👤',
  loading = false,
  clickable = false,
  className = '',
  onClick,
  onError,
  id,
  ...rest
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const avatarClasses = [
    'avatar',
    `avatar-${size}`,
    `avatar-${shape}`,
    `avatar-${variant}`,
    clickable && 'avatar-clickable',
    (loading || imageLoading) && 'avatar-loading',
    status && `avatar-status-${status}`,
    className
  ].filter(Boolean).join(' ');

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    onError?.();
  };

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e);
    }
  };

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate background color based on name
  const getNameColor = (name) => {
    if (!name) return '#94a3b8';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
      '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name);
  const nameColor = getNameColor(name);

  const avatarProps = {
    id,
    className: avatarClasses,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    tabIndex: clickable ? 0 : undefined,
    role: clickable ? 'button' : 'img',
    'aria-label': alt || name || 'Avatar',
    style: {
      '--avatar-name-color': nameColor,
      ...rest.style
    },
    ...rest
  };

  return (
    <div {...avatarProps}>
      {/* Loading Spinner */}
      {(loading || imageLoading) && (
        <div className="avatar-loading-spinner" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
            >
              <animate
                attributeName="stroke-dasharray"
                dur="2s"
                values="0 31.416;15.708 15.708;0 31.416"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                dur="2s"
                values="0;-15.708;-31.416"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      )}

      {/* Avatar Content */}
      <div className="avatar-content">
        {src && !imageError && !loading ? (
          <img
            src={src}
            alt={alt || name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            className="avatar-image"
          />
        ) : initials ? (
          <span className="avatar-initials" aria-hidden="true">
            {initials}
          </span>
        ) : (
          <span className="avatar-fallback" aria-hidden="true">
            {fallbackIcon}
          </span>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <div 
          className={`avatar-status avatar-status-${status}`}
          aria-label={`Status: ${status}`}
          role="img"
        />
      )}

      {/* Badge */}
      {badge && (
        <div className="avatar-badge" aria-label={`Badge: ${badge}`}>
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </div>
      )}
    </div>
  );
};

// Pre-defined avatar variants
export const SmallAvatar = (props) => <Avatar size="small" {...props} />;
export const LargeAvatar = (props) => <Avatar size="large" {...props} />;
export const ExtraLargeAvatar = (props) => <Avatar size="xl" {...props} />;

export const SquareAvatar = (props) => <Avatar shape="square" {...props} />;
export const RoundedAvatar = (props) => <Avatar shape="rounded" {...props} />;

export const PrimaryAvatar = (props) => <Avatar variant="primary" {...props} />;
export const SecondaryAvatar = (props) => <Avatar variant="secondary" {...props} />;

export const OnlineAvatar = (props) => <Avatar status="online" {...props} />;
export const OfflineAvatar = (props) => <Avatar status="offline" {...props} />;
export const AwayAvatar = (props) => <Avatar status="away" {...props} />;
export const BusyAvatar = (props) => <Avatar status="busy" {...props} />;

export const ClickableAvatar = (props) => <Avatar clickable {...props} />;

// Avatar Group Component
export const AvatarGroup = ({
  children,
  max = 5,
  size = 'medium',
  spacing = 'normal',
  className = '',
  showMore = true,
  moreText = '+{count}',
  onMoreClick,
  ...rest
}) => {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);

  const groupClasses = [
    'avatar-group',
    `avatar-group-${size}`,
    `avatar-group-spacing-${spacing}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses} {...rest}>
      {visibleAvatars.map((avatar, index) =>
        React.cloneElement(avatar, {
          key: index,
          size: avatar.props.size || size,
          className: `${avatar.props.className || ''} avatar-group-item`.trim()
        })
      )}
      
      {remainingCount > 0 && showMore && (
        <div 
          className={`avatar avatar-${size} avatar-circle avatar-more`}
          onClick={onMoreClick}
          role={onMoreClick ? 'button' : undefined}
          tabIndex={onMoreClick ? 0 : undefined}
          aria-label={`${remainingCount} more avatars`}
        >
          <span className="avatar-more-text">
            {moreText.replace('{count}', remainingCount)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
