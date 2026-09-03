'use client';

import { ReactNode } from 'react';

interface DiagramWrapperProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function DiagramWrapper({ 
  children, 
  title, 
  subtitle 
}: DiagramWrapperProps) {
  return (
    <div className="diagram-container relative">
      {children}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-surface-200">
          <h4 className="font-medium text-surface-800">{title}</h4>
          {subtitle && (
            <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}