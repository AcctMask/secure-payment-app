import React from 'react';
import { Navigation } from './Navigation';
import { SimpleAppLayout } from './SimpleAppLayout';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <SimpleAppLayout />
    </div>
  );
};
