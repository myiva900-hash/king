import React from 'react';
import { ShieldCheck, MessageCircle } from 'lucide-react';

interface TickerNoticeProps {
  onTelegramClick: () => void;
}

export const TickerNotice: React.FC<TickerNoticeProps> = ({ onTelegramClick }) => {
  return (
    <div 
      onClick={onTelegramClick}
      className="w-full bg-blue-50/70 dark:bg-blue-950/30 border-b border-blue-200/60 dark:border-blue-900/40 px-3 py-1.5 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between cursor-pointer hover:bg-blue-100/60 dark:hover:bg-blue-900/30 transition-colors overflow-hidden select-none"
    >
      <div className="flex items-center gap-2 truncate">
        <span className="text-sm">🇷🇼</span>
        <div className="truncate text-[11px]">
          <span className="font-bold text-blue-700 dark:text-blue-300">Rwanda VPN Core:</span>{' '}
          <span className="text-slate-600 dark:text-slate-300">Rwamagana · Gisozi · Kayonza Active</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live</span>
      </div>
    </div>
  );
};
