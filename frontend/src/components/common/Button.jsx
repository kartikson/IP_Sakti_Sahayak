
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  iconLeft = null,
  iconRight = null,
  className = '',
  onClick,
  ...props
}) {
  const baseClass = 'ui-btn';
  const variantClass = `ui-btn--${variant}`;
  const sizeClass = `ui-btn--${size}`;
  const disabledClass = disabled || isLoading ? 'ui-btn--disabled' : '';

  const combinedClass = [baseClass, variantClass, sizeClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={combinedClass}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? 'true' : undefined}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span
          className="ui-loading__spinner ui-loading__spinner--sm"
          style={{ marginRight: '6px' }}
          aria-hidden="true"
        />
      ) : (
        iconLeft && <span className="ui-btn__icon-left">{iconLeft}</span>
      )}
      <span>{children}</span>
      {!isLoading && iconRight && <span className="ui-btn__icon-right">{iconRight}</span>}
    </button>
  );
}
