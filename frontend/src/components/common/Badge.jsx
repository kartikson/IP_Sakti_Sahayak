
export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon = null,
  className = '',
  ...props
}) {
  const classes = [
    'ui-badge',
    `ui-badge--${variant}`,
    `ui-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {icon && <span className="ui-badge__icon" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

// Institutional alias for Badge -> Label
export const Label = Badge;
