import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        
        {/* Left */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">PashLoc</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        {/* Center */}
        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </a>
          <span className="opacity-40">•</span>
          <span className="opacity-60">
            Secure Virtual Card Platform
          </span>
        </div>

        {/* Right */}
        <div className="opacity-60">
          Built with Stripe · Secured by Design
        </div>

      </div>
    </footer>
  );
};

