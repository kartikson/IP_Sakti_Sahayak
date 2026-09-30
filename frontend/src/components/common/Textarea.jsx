import { AlertCircleIcon } from './Icons';

export function Textarea({
  label,
  id,
  name,
  rows = 4,
  value,
  onChange,
  placeholder,
  helperText,
  error,
  disabled = false,
  required = false,
  requiredText = '(required)',
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const textareaId = id || (name ? `textarea-${name}` : undefined);
  const helperId = helperText && textareaId ? `${textareaId}-helper` : undefined;
  const errorId = error && textareaId ? `${textareaId}-error` : undefined;

  const textareaClasses = [
    'ui-textarea',
    error ? 'ui-textarea--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`ui-form-group ${wrapperClassName}`.trim()}>
      {label && (
        <label htmlFor={textareaId} className="ui-label">
          <span>{label}</span>
          {required && (
            <span className="ui-label__required" style={{ fontWeight: 'normal', fontSize: '13px', marginLeft: '4px' }}>
              {requiredText}
            </span>
          )}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={textareaClasses}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : helperId}
        {...props}
      />
      {error ? (
        <div id={errorId} className="ui-form-error" role="alert">
          <AlertCircleIcon size={14} aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div id={helperId} className="ui-form-helper">
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
