import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { MemberAccountsDisplay } from './MemberAccountsDisplay';
import { RealMembershipModal } from './RealMembershipModal';
import { EnhancedProfileModal } from './EnhancedProfileModal';
import { Button } from './ui/button';
import { CreditCard, Shield, Zap, CheckCircle, Lock, TrendingUp, Users, Award, ArrowRight, Play } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-500/30">
                🚀 Next-Gen Payment Security
              </div>
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                Protect Every Purchase with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Virtual Cards</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Shield your real payment information with rotating virtual cards. Each transaction gets a unique, secure card number that expires after use.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsMembershipModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Start Protecting Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => setIsProfileModalOpen(true)}
                  size="lg"
                  variant="outline"
                  className="bg-white/5 text-white border-white/20 hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-xl backdrop-blur-sm"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/68bd89ae8305b7b3c57e9be2_1762806449851_bf159acd.webp" 
                alt="Security Hero" 
                className="rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-950/50 rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm">
            <TrendingUp className="w-10 h-10 text-blue-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">500K+</div>
            <p className="text-blue-200">Protected Transactions</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-950/50 rounded-xl p-6 border border-purple-500/30 backdrop-blur-sm">
            <Users className="w-10 h-10 text-purple-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">50K+</div>
            <p className="text-purple-200">Active Members</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/50 to-green-950/50 rounded-xl p-6 border border-green-500/30 backdrop-blur-sm">
            <Shield className="w-10 h-10 text-green-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">99.9%</div>
            <p className="text-green-200">Fraud Prevention</p>
          </div>
          <div className="bg-gradient-to-br from-orange-900/50 to-orange-950/50 rounded-xl p-6 border border-orange-500/30 backdrop-blur-sm">
            <Award className="w-10 h-10 text-orange-400 mb-3" />
            <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
            <p className="text-orange-200">User Rating</p>
          </div>
        </div>

        {/* Member Accounts Display */}
        <MemberAccountsDisplay />

        {/* Features Grid */}
        <div>
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Secure Protection</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all group">
              <div className="bg-blue-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Bank-Level Security</h3>
              <p className="text-slate-400 leading-relaxed">Military-grade encryption protects your real card details. Your actual payment information never touches merchant servers.</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-700 hover:border-purple-500/50 transition-all group">
              <div className="bg-purple-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Instant Card Rotation</h3>
              <p className="text-slate-400 leading-relaxed">Get a fresh virtual card number after every purchase. Compromised cards become useless instantly.</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-700 hover:border-green-500/50 transition-all group">
              <div className="bg-green-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-all">
                <Lock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Zero Liability</h3>
              <p className="text-slate-400 leading-relaxed">Complete fraud protection on all transactions. If something goes wrong, you're fully covered.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RealMembershipModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
      />
      
      <EnhancedProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};
