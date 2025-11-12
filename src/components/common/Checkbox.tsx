import React, { forwardRef, useEffect, useRef } from 'react';

type CheckboxSize = 'sm' | 'md' | 'lg';
type CheckboxVariant = 'default' | 'toggle';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  indeterminate?: boolean;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  toggleClassName?: string;
}

const sizeClasses: Record<CheckboxSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const defaultBaseClasses =
  'text-(--color-primary) border border-gray-300 rounded focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const toggleTrackClasses =
  "relative block w-11 h-6 bg-gray-300 transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-(--color-primary-light) rounded-full peer-checked:bg-(--color-primary) peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all";

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
            className={[
              toggleTrackClasses,
              disabled ? 'bg-gray-200' : '',
              toggleClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          ></span>
        </span>
        {(label || description) && (
          <span className="flex flex-col">
            {label && (
              <span
                className={['text-sm text-gray-700', labelClassName]
                  .filter(Boolean)
                  .join(' ')}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={['text-xs text-gray-500', descriptionClassName]
                  .filter(Boolean)
                  .join(' ')}
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
            className={['text-sm text-gray-900', labelClassName]
              .filter(Boolean)
              .join(' ')}
          >
            {label}
          </span>
        )}
        {description && (
          <span
            className={['text-xs text-gray-500', descriptionClassName]
              .filter(Boolean)
              .join(' ')}
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

