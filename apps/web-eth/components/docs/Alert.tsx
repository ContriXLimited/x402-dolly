import React from 'react';

type AlertType = 'info' | 'warning' | 'error' | 'success';

interface AlertProps {
  type?: AlertType;
  children: React.ReactNode;
  title?: string;
}

const alertStyles: Record<AlertType, { bg: string; border: string; icon: string }> = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'ℹ️',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: '⚠️',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: '❌',
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: '✅',
  },
};

export function Alert({ type = 'info', children, title }: AlertProps) {
  const styles = alertStyles[type];

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-xl p-4 backdrop-blur-sm`}
    >
      <div className="flex gap-3">
        <div className="text-xl flex-shrink-0">{styles.icon}</div>
        <div className="flex-1">
          {title && (
            <div className="font-semibold text-white mb-1">{title}</div>
          )}
          <div className="text-sm text-gray-300 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
