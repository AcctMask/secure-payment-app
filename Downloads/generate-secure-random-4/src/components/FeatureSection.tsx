import React from 'react';
import { Shield, Smartphone, CreditCard, Lock, Zap, Globe } from 'lucide-react';

export const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-300" />,
      title: 'Secure Purchase Card Protection',
      description: 'Generate unique Secure Purchase Card numbers for each transaction, keeping your real card details completely secure.'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-purple-300" />,
      title: 'Mobile Tap-to-Pay',
      description: 'Use your phone for contactless payments with NFC technology. Your real card never leaves your wallet.'
    },
    {
      icon: <CreditCard className="w-8 h-8 text-indigo-300" />,
      title: 'Multiple Card Support',
      description: 'Add multiple payment methods and generate Secure Purchase Card numbers for each. Perfect for personal and business use.'
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-400" />,
      title: 'Bank-Level Encryption',
      description: 'Your card details are encrypted with the same security standards used by major financial institutions.'
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: 'Instant Generation',
      description: 'Create Secure Purchase Card numbers instantly. No waiting, no delays - secure payments when you need them.'
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-400" />,
      title: 'Global Acceptance',
      description: 'Secure Purchase Cards work anywhere your real card is accepted. Shop online or pay in-store worldwide.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose Secure Purchase Card Security?
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Protect your financial information with cutting-edge Secure Purchase Card technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-800/30 via-blue-800/30 to-indigo-800/30 p-6 rounded-xl border border-purple-600/30 hover:border-blue-400/50 transition-all duration-300 group backdrop-blur-sm"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};