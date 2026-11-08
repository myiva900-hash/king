import React from 'react';
import { X, ShieldCheck, Info, Lock, MessageCircle, PhoneCall } from 'lucide-react';
import { MyvLogo } from './MyvLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MyvLogo size={24} />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              About Mutiganda Yvan VPN
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          
          {/* Creator Profile with Real Photo */}
          <div className="text-center py-2 flex flex-col items-center">
            <img
              src="/assets/aistudio/photo_6015008377458593951_y_2837711e.jpg"
              alt="Mutiganda Yvan"
              className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-blue-500 shadow-md mb-2.5"
            />
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Mutiganda Yvan
              </h4>
              <span className="text-sm">🇷🇼</span>
            </div>
            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              Founder & Lead Software Engineer
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Kigali · Rwamagana · Kayonza (Rwanda)
            </p>

            {/* Direct WhatsApp Call/Chat Button */}
            <div className="mt-3">
              <a
                href="https://wa.me/250787699523"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp: 0787699523</span>
              </a>
            </div>
          </div>

          {/* Rwanda Dedicated Nodes Notice */}
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-900/40 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 text-xs">
              <span>🇷🇼</span>
              <span>Rwanda Dedicated High-Speed Nodes</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Equipped with 3 dedicated low-latency gateway servers located in <strong>Gisozi (Kigali)</strong>, <strong>Rwamagana</strong>, and <strong>Kayonza</strong> for optimized local and cross-border routing.
            </p>
          </div>

          {/* Privacy & Architecture Notice */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Official Android VpnService Architecture</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Mutiganda Yvan VPN creates an encrypted virtual TUN interface. No telemetry, traffic data, or browsing records are stored or tracked.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60 rounded-b-2xl">
          <span className="text-[10px] text-slate-500">Mutiganda Yvan VPN · v2.4.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Funga (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
