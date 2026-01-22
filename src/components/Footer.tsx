import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white/80">
        <div className="flex flex-col">
          <span className="text-white font-semibold tracking-tight">PashLoc</span>
          <span className="text-sm text-white/60">
            Security-first virtual cards for modern commerce.
          </span>
        </div>

        <div className="flex gap-4 text-sm">
          <Link className="hover:text-white" to="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-white" to="/member">
            Member
          </Link>
          <a className="hover:text-white" href="mailto:support@sp4all.com">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
