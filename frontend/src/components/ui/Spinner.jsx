import React from 'react';
import './Spinner.css';

const Spinner = ({
  size = 'medium',
  variant = 'primary',
  type = 'circular',
  speed = 'normal',
  label = 'Loading...',
  showLabel = false,
  color = null,
  className = '',
  inline = false,
  overlay = false,
  ...rest
}) => {
  const spinnerClasses = [
    'spinner',
    `spinner-${size}`,
    `spinner-${variant}`,
    `spinner-${type}`,
    `spinner-speed-${speed}`,
    inline && 'spinner-inline',
    overlay && 'spinner-overlay',
    className
  ].filter(Boolean).join(' ');

  const spinnerStyle = {
    ...(color && { color }),
    ...rest.style
  };

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="spinner-dots">
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
          </div>
        );

      case 'bars':
        return (
          <div className="spinner-bars">
            <div className="spinner-bar"></div>
            <div className="spinner-bar"></div>
            <div className="spinner-bar"></div>
            <div className="spinner-bar"></div>
            <div className="spinner-bar"></div>
          </div>
        );

      case 'pulse':
        return <div className="spinner-pulse"></div>;

      case 'ring':
        return (
          <div className="spinner-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        );

      case 'ripple':
        return (
          <div className="spinner-ripple">
            <div></div>
            <div></div>
          </div>
        );

      case 'grid':
        return (
          <div className="spinner-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        );

      case 'heart':
        return (
          <div className="spinner-heart">
            <div></div>
          </div>
        );

      case 'medical':
        return (
          <div className="spinner-medical">
            <div className="spinner-cross">
              <div className="spinner-cross-horizontal"></div>
              <div className="spinner-cross-vertical"></div>
            </div>
          </div>
        );

      case 'circular':
      default:
        return (
          <svg className="spinner-circular" viewBox="0 0 24 24" fill="none">
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
        );
    }
  };

  if (overlay) {
    return (
      <div className="spinner-overlay-container" {...rest}>
        <div className="spinner-overlay-backdrop">
          <div className={spinnerClasses} style={spinnerStyle} role="progressbar" aria-label={label}>
            {renderSpinner()}
            {showLabel && <span className="spinner-label">{label}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={spinnerClasses} style={spinnerStyle} role="progressbar" aria-label={label} {...rest}>
      {renderSpinner()}
      {showLabel && <span className="spinner-label">{label}</span>}
    </div>
  );
};

// Pre-defined spinner variants
export const SmallSpinner = (props) => <Spinner size="small" {...props} />;
export const LargeSpinner = (props) => <Spinner size="large" {...props} />;

export const LoadingDots = (props) => <Spinner type="dots" {...props} />;
export const LoadingBars = (props) => <Spinner type="bars" {...props} />;
export const LoadingPulse = (props) => <Spinner type="pulse" {...props} />;
export const LoadingRing = (props) => <Spinner type="ring" {...props} />;
export const LoadingRipple = (props) => <Spinner type="ripple" {...props} />;
export const LoadingGrid = (props) => <Spinner type="grid" {...props} />;
export const LoadingHeart = (props) => <Spinner type="heart" {...props} />;
export const MedicalSpinner = (props) => <Spinner type="medical" variant="success" {...props} />;

export const InlineSpinner = (props) => <Spinner inline {...props} />;
export const OverlaySpinner = (props) => <Spinner overlay {...props} />;

export const FastSpinner = (props) => <Spinner speed="fast" {...props} />;
export const SlowSpinner = (props) => <Spinner speed="slow" {...props} />;

// Loading component with custom message
export const Loading = ({ message = 'Loading...', type = 'circular', ...props }) => (
  <Spinner type={type} showLabel label={message} {...props} />
);

// Page loader component
export const PageLoader = ({ message = 'Loading page...', ...props }) => (
  <div className="page-loader">
    <Spinner size="large" showLabel label={message} {...props} />
  </div>
);

// Button spinner component
export const ButtonSpinner = (props) => (
  <Spinner size="small" inline {...props} />
);

export default Spinner;
