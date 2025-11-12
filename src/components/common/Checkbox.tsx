import React, { forwardRef, useEffect, useRef } from 'react';

type CheckboxSize = 'sm' | 'md' | 'lg';
type CheckboxVariant = 'default' | 'toggle';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  labelClassName?: string;
  descriptionClassName?: string;
  indeterminate?: boolean;
  toggleClassName?: string;
}

const sizeClasses: Record<CheckboxSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const defaultBaseClasses =
  'border rounded focus:ring-2 focus:ring-offset-0 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const toggleTrackClasses =
  "relative block w-11 h-6 transition-colors peer-focus:outline-none peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-(--color-primary-text) after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-(--color-surface) after:border after:rounded-full after:h-5 after:w-5 after:transition-all";

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    label,
    description,
    containerClassName = '',
    labelClassName = '',
    descriptionClassName = '',
    indeterminate = false,
    size = 'md',
    variant = 'default',
    className = '',
    toggleClassName = '',
    disabled,
    ...rest
  } = props;

  const internalRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const setRefs = (node: HTMLInputElement | null) => {
    internalRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
  };

  const containerBaseClass =
    variant === 'toggle'
      ? 'inline-flex items-center gap-2'
      : 'inline-flex items-start gap-2';

  const sharedContainerClasses = [
    containerBaseClass,
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    containerClassName,
  ]
    .filter(Boolean)
    .join(' ');

  if (variant === 'toggle') {
    return (
      <label className={sharedContainerClasses}>
        <span className="relative inline-flex">
          <input
            {...rest}
            disabled={disabled}
            ref={setRefs}
            type="checkbox"
            className={['sr-only peer', className].filter(Boolean).join(' ')}
          />
          <span
            className={[toggleTrackClasses, toggleClassName]
              .filter(Boolean)
              .join(' ')}
            style={{
              backgroundColor: disabled
                ? 'var(--color-surface-muted)'
                : 'var(--color-border)',
              borderColor: 'var(--color-border-strong)',
            }}
          ></span>
          <style>{`
            input:checked + span {
              background-color: var(--color-primary) !important;
            }
            input:focus + span {
              ring-color: var(--color-ring);
            }
          `}</style>
        </span>
        {(label || description) && (
          <span className="flex flex-col">
            {label && (
              <span
                className={['text-sm', labelClassName]
                  .filter(Boolean)
                  .join(' ')}
                style={{ color: 'var(--color-text)' }}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={['text-xs', descriptionClassName]
                  .filter(Boolean)
                  .join(' ')}
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  }

  const checkboxClasses = [
    sizeClasses[size],
    defaultBaseClasses,
    disabled ? 'cursor-not-allowed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inputElement = (
    <input
      {...rest}
      disabled={disabled}
      ref={setRefs}
      type="checkbox"
      className={checkboxClasses}
      style={
        {
          accentColor: 'var(--color-primary)',
          borderColor: 'var(--color-border)',
          '--tw-ring-color': 'var(--color-ring)',
        } as React.CSSProperties
      }
    />
  );

  if (!label && !description) {
    return inputElement;
  }

  return (
    <label className={sharedContainerClasses}>
      {inputElement}
      <span className="flex flex-col">
        {label && (
          <span
            className={['text-sm', labelClassName].filter(Boolean).join(' ')}
            style={{ color: 'var(--color-text)' }}
          >
            {label}
          </span>
        )}
        {description && (
          <span
            className={['text-xs', descriptionClassName]
              .filter(Boolean)
              .join(' ')}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {description}
          </span>
        )}
      </span>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
