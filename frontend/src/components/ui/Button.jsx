import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  onClick,
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  className = '',
  id,
  ...rest
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled && 'btn-disabled',
    loading && 'btn-loading',
    fullWidth && 'btn-full-width',
    rounded && 'btn-rounded',
    icon && !children && 'btn-icon-only',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      id={id}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || (icon && !children ? 'Button' : undefined)}
      aria-describedby={ariaDescribedBy}
      {...rest}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
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
        </span>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="btn-icon btn-icon-left" aria-hidden="true">
          {icon}
        </span>
      )}
      
      {children && (
        <span className="btn-text">
          {children}
        </span>
      )}
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="btn-icon btn-icon-right" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
};

// Pre-defined button variants for common use cases
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const WarningButton = (props) => <Button variant="warning" {...props} />;
export const InfoButton = (props) => <Button variant="info" {...props} />;
export const LinkButton = (props) => <Button variant="link" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;

// Size variants
export const SmallButton = (props) => <Button size="small" {...props} />;
export const LargeButton = (props) => <Button size="large" {...props} />;

// Special purpose buttons
export const IconButton = ({ icon, ...props }) => (
  <Button icon={icon} {...props} />
);

export const LoadingButton = (props) => <Button loading {...props} />;

export const FullWidthButton = (props) => <Button fullWidth {...props} />;

export const RoundedButton = (props) => <Button rounded {...props} />;

export default Button;
