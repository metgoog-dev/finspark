import React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ header, children, footer, className, ...props }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`} {...props}>
    {header && <div className="border-b border-slate-100 px-6 py-4 font-semibold text-lg">{header}</div>}
    <div className="px-6 py-5">{children}</div>
    {footer && <div className="border-t border-slate-100 px-6 py-4">{footer}</div>}
  </div>
);

export default Card;
