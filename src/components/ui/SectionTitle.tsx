import type { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  description?: ReactNode;
  className?: string;
}

export const SectionTitle = ({
  title,
  subtitle,
  description,
  className,
}: SectionTitleProps) => {
  return (
    <header className={['mb-6', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold text-(--color-text) mb-2">{title}</h2>
      {subtitle && (
        <p className="text-sm text-(--color-text-secondary) mb-2">{subtitle}</p>
      )}
      {description && (
        <div className="text-sm text-(--color-text-secondary)">{description}</div>
      )}
    </header>
  );
};

