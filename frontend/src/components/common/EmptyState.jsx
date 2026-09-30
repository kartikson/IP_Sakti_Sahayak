import { BookOpenIcon } from './Icons';

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
  children,
}) {
  return (
    <div className={`ui-empty-state ${className}`.trim()}>
      <div className="ui-empty-state__icon-wrapper" aria-hidden="true">
        {icon || <BookOpenIcon size={22} />}
      </div>
      {title && <h4 className="ui-empty-state__title">{title}</h4>}
      {description && <p className="ui-empty-state__description">{description}</p>}
      {action && <div className="ui-empty-state__actions">{action}</div>}
      {children}
    </div>
  );
}
