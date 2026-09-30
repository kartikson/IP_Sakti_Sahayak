import { AlertCircleIcon } from './Icons';

export function Input({
  ref,
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  helperText,
  error,
  iconLeft,
  iconRight,
  disabled = false,
  required = false,
  requiredText = '(required)',
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const inputId = id || (name ? `input-${name}` : undefined);
  const helperId = helperText && inputId ? `${inputId}-helper` : undefined;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  const inputClasses = [
    'ui-input',
    iconLeft ? 'ui-input--has-icon-left' : '',
    iconRight ? 'ui-input--has-icon-right' : '',
    error ? 'ui-input--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`ui-form-group ${wrapperClassName}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="ui-label">
          <span>{label}</span>
          {required && (
            <span className="ui-label__required" style={{ fontWeight: 'normal', fontSize: '13px', marginLeft: '4px' }}>
              {requiredText}
            </span>
          )}
        </label>
      )}
      <div className="ui-input-wrapper">
        {iconLeft && <span className="ui-input-icon ui-input-icon--left">{iconLeft}</span>}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : helperId}
          {...props}
        />
        {iconRight && <span className="ui-input-icon ui-input-icon--right">{iconRight}</span>}
      </div>
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
