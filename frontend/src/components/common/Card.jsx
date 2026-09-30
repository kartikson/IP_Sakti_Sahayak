
export function Card({
  children,
  variant = 'default',
  className = '',
  as: Component = 'div',
  onClick,
  ...props
}) {
  const isInteractive = variant === 'interactive' || !!onClick;
  const classes = [
    'ui-card',
    variant !== 'default' ? `ui-card--${variant}` : '',
    isInteractive ? 'ui-card--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} onClick={onClick} {...props}>
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  bordered = false,
  className = '',
  ...props
}) {
  const classes = [
    'ui-card__header',
    bordered ? 'ui-card__header--bordered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  as: Component = 'h3',
  className = '',
  ...props
}) {
  return (
    <Component className={`ui-card__title ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className = '',
  ...props
}) {
  return (
    <p className={`ui-card__description ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`ui-card__content ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  bordered = false,
  className = '',
  ...props
}) {
  const classes = [
    'ui-card__footer',
    bordered ? 'ui-card__footer--bordered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// Institutional alias for Card -> Panel
export const Panel = Card;
export const PanelHeader = CardHeader;
export const PanelTitle = CardTitle;
export const PanelDescription = CardDescription;
export const PanelContent = CardContent;
export const PanelFooter = CardFooter;
