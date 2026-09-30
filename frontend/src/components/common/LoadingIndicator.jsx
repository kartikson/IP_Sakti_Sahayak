
export function LoadingIndicator({
  size = 'md',
  label = 'Loading...',
  inline = false,
  className = '',
}) {
  const containerClasses = [
    'ui-loading',
    inline ? 'ui-loading--inline' : 'ui-loading--block',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div
        className={`ui-loading__spinner ui-loading__spinner--${size}`}
        aria-hidden="true"
      />
      {label && <span className="ui-loading__label">{label}</span>}
      <span className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
        {label}
      </span>
    </div>
  );
}
