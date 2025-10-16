import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Input: React.FC<InputProps> = ({ label, error, leftIcon, rightIcon, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>}
    <div className={`relative flex items-center ${error ? 'ring-2 ring-red-400' : ''}`}>
      {leftIcon && <span className="absolute left-3">{leftIcon}</span>}
      <input
        className={`w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className}`}
        {...props}
      />
      {rightIcon && <span className="absolute right-3">{rightIcon}</span>}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default Input;
