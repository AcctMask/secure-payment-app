import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-8 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="text-gray-400">Built on</span>
          <a 
            href="https://famous.ai/project/68bd89ae8305b7b3c57e9be2?utm_source=famous-badge" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMEMzLjU4IDAgMCAzLjU4IDAgOEM0LjM0IDEyLjM0IDcuNjYgMTYgOCAxNkMxMi40MiAxNiAxNiAxMi40MiAxNiA4QzE2IDMuNTggMTIuNDIgMCA4IDBaTTggMTQuNEM2LjY3IDE0LjQgNS40NCAxMy45NCA0LjQgMTMuMTJDMy4zNiAxMi4zIDIuNiAxMS4yIDIuNiA5LjZDMi42IDcuNTggNC4xOCA2IDYuMiA2QzguMjIgNiA5LjggNy41OCA5LjggOS42QzkuOCAxMS4yIDkuMDQgMTIuMyA4IDEzLjEyQzcuNTYgMTMuOTQgNy4zMyAxNC40IDggMTQuNFoiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+" 
              alt="Famous AI" 
              className="w-4 h-4"
            />
            Famous AI
          </a>
        </div>
        <p className="text-gray-500 text-sm">
          © 2024 Secure Code Generator. All rights reserved.
        </p>
      </div>
    </footer>
  );
};