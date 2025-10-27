import React from 'react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      number: '16',
      label: 'Digit Codes',
      description: 'Maximum security length'
    },
    {
      number: '∞',
      label: 'Accounts',
      description: 'Unlimited account support'
    },
    {
      number: '<1ms',
      label: 'Generation Time',
      description: 'Lightning fast performance'
    },
    {
      number: '100%',
      label: 'Privacy',
      description: 'Local storage only'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-800 to-purple-900 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Trusted by Security Professionals
          </h2>
          <p className="text-xl text-slate-100 max-w-3xl mx-auto">
            Built to meet the highest standards of security and performance.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-slate-300 border-opacity-20"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-slate-100 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-slate-200">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};