
export function Container({
  children,
  size = 'xl',
  className = '',
  as: Component = 'div',
  ...props
}) {
  const classes = [
    'ui-container',
    `ui-container--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
