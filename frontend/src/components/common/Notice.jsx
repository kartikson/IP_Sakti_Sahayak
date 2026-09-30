export function Notice({
  title,
  children,
  variant = 'gold', // 'gold' (default #B08D57), 'primary' (#1F3D2B), 'info' (#1F5A8A), 'error' (#A01E1E)
  icon = null,
  className = '',
  ...props
}) {
  const classes = [
    'ui-notice',
    `ui-notice--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="region" aria-label={title || 'Notice'} {...props}>
      {icon && <span className="ui-notice__icon" aria-hidden="true">{icon}</span>}
      <div className="ui-notice__content">
        {title && <div className="ui-notice__title">{title}</div>}
        <div className="ui-notice__body">{children}</div>
      </div>
    </div>
  );
}
