import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { ToasterProps } from 'react-hot-toast';

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }
  ) => Promise<T>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
  toasterProps?: Partial<ToasterProps>;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  toasterProps
}) => {
  const success = (message: string) => toast.success(message);
  const error = (message: string) => toast.error(message);
  const info = (message: string) => toast(message, { 
    icon: '🔵',
    className: '!border-l-blue-500',
  });
  const warning = (message: string) => toast(message, { 
    icon: '⚠️',
    className: '!border-l-amber-500',
  });
  
  const promiseToast = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }
  ) => {
    return toast.promise(promise, messages, {
      loading: {
        style: {
          borderLeft: '4px solid #6B7280',
        },
      },
      success: {
        style: {
          borderLeft: '4px solid #10B981',
        },
      },
      error: {
        style: {
          borderLeft: '4px solid #EF4444',
        },
      },
    });
  };

  const defaultToasterProps: Partial<ToasterProps> = {
    position: 'top-right',
    toastOptions: {
      duration: 4000,
      style: {
        background: '#fff',
        color: '#363636',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        padding: '16px',
      },
      success: {
        style: {
          borderLeft: '4px solid #10B981',
        },
      },
      error: {
        style: {
          borderLeft: '4px solid #EF4444',
        },
        duration: 5000,
      },
    },
  };

  const mergedToasterProps = { ...defaultToasterProps, ...toasterProps };

  return (
    <ToastContext.Provider
      value={{
        success,
        error,
        info,
        warning,
        promise: promiseToast,
      }}
    >
      <Toaster {...mergedToasterProps} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};