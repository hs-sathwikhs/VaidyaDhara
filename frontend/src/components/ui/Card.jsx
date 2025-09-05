import React from 'react';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  size = 'medium',
  hoverable = false,
  clickable = false,
  elevated = false,
  bordered = true,
  rounded = true,
  loading = false,
  header = null,
  footer = null,
  title = null,
  subtitle = null,
  image = null,
  imageAlt = '',
  imagePosition = 'top',
  actions = null,
  className = '',
  onClick,
  onKeyDown,
  tabIndex,
  role,
  ariaLabel,
  ariaDescribedBy,
  id,
  ...rest
}) => {
  const cardClasses = [
    'card',
    `card-${variant}`,
    `card-${size}`,
    hoverable && 'card-hoverable',
    clickable && 'card-clickable',
    elevated && 'card-elevated',
    bordered && 'card-bordered',
    rounded && 'card-rounded',
    loading && 'card-loading',
    imagePosition && `card-image-${imagePosition}`,
    className
  ].filter(Boolean).join(' ');

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
    onKeyDown?.(e);
  };

  const cardProps = {
    id,
    className: cardClasses,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    tabIndex: clickable ? (tabIndex ?? 0) : tabIndex,
    role: clickable ? (role ?? 'button') : role,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...rest
  };

  return (
    <div {...cardProps}>
      {loading && (
        <div className="card-loading-overlay" aria-hidden="true">
          <div className="card-spinner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
        </div>
      )}

      {image && imagePosition === 'top' && (
        <div className="card-image card-image-top">
          <img src={image} alt={imageAlt} loading="lazy" />
        </div>
      )}

      {image && imagePosition === 'left' && (
        <div className="card-image card-image-left">
          <img src={image} alt={imageAlt} loading="lazy" />
        </div>
      )}

      <div className="card-content">
        {image && imagePosition === 'right' && (
          <div className="card-image card-image-right">
            <img src={image} alt={imageAlt} loading="lazy" />
          </div>
        )}

        {header && (
          <div className="card-header">
            {header}
          </div>
        )}

        {(title || subtitle) && (
          <div className="card-title-section">
            {title && (
              <h3 className="card-title">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="card-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="card-body">
          {children}
        </div>

        {actions && (
          <div className="card-actions">
            {actions}
          </div>
        )}

        {footer && (
          <div className="card-footer">
            {footer}
          </div>
        )}
      </div>

      {image && imagePosition === 'bottom' && (
        <div className="card-image card-image-bottom">
          <img src={image} alt={imageAlt} loading="lazy" />
        </div>
      )}
    </div>
  );
};

// Pre-defined card variants
export const InfoCard = (props) => <Card variant="info" {...props} />;
export const SuccessCard = (props) => <Card variant="success" {...props} />;
export const WarningCard = (props) => <Card variant="warning" {...props} />;
export const ErrorCard = (props) => <Card variant="error" {...props} />;
export const PrimaryCard = (props) => <Card variant="primary" {...props} />;

// Size variants
export const SmallCard = (props) => <Card size="small" {...props} />;
export const LargeCard = (props) => <Card size="large" {...props} />;

// Feature variants
export const HoverableCard = (props) => <Card hoverable {...props} />;
export const ClickableCard = (props) => <Card clickable hoverable {...props} />;
export const ElevatedCard = (props) => <Card elevated {...props} />;

// Layout variants
export const ImageCard = ({ image, imageAlt, children, ...props }) => (
  <Card image={image} imageAlt={imageAlt} {...props}>
    {children}
  </Card>
);

export const ActionCard = ({ actions, children, ...props }) => (
  <Card actions={actions} {...props}>
    {children}
  </Card>
);

export const HeaderCard = ({ header, children, ...props }) => (
  <Card header={header} {...props}>
    {children}
  </Card>
);

export default Card;
