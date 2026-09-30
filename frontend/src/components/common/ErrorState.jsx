import { AlertCircleIcon, RefreshIcon } from './Icons';
import { Button } from './Button';

export function ErrorState({
  title = 'An error occurred',
  message = 'Unable to complete the requested operation. Please verify your inputs or retry.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
  children,
}) {
  return (
    <div className={`ui-error-state ${className}`.trim()} role="alert">
      <span className="ui-error-state__icon" aria-hidden="true">
        <AlertCircleIcon size={20} />
      </span>
      <div className="ui-error-state__body">
        <h4 className="ui-error-state__title">{title}</h4>
        <p className="ui-error-state__message">{message}</p>
        {onRetry && (
          <div className="ui-error-state__action">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              iconLeft={<RefreshIcon size={14} />}
            >
              {retryLabel}
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
