import React from 'react';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';

interface CodeDisplayProps {
  code: string;
  size?: 'normal' | 'large';
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, size = 'normal' }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code.replace(/\s/g, ''));
  };

  return (
    <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4 border border-slate-600">
      <span className={`font-mono text-white tracking-wider ${
        size === 'large' ? 'text-2xl md:text-3xl' : 'text-lg'
      }`}>
        {code}
      </span>
      <Button
        onClick={copyToClipboard}
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white ml-4"
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );
};