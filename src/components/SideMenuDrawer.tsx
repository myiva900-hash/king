import React from 'react';
import { 
  Code2, 
  Fingerprint, 
  Upload, 
  Download, 
  Settings, 
  LayoutGrid, 
  Send, 
  Info, 
  X,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { MyvLogo } from './MyvLogo';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: 
    | 'payload_gen' 
    | 'identification' 
    | 'export_config' 
    | 'import_config' 
    | 'settings' 
    | 'server_apps' 
    | 'telegram' 
    | 'about'
  ) => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  onSelectOption,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer content */}
      <div className="absolute inset-y-0 left-0 max-w-[290px] w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
        
        <div className="overflow-y-auto">
          {/* Top Royal Blue Header with Mutiganda Yvan's Photo */}
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-5 pt-7 relative shadow-md">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/photo_6015008377458593951_y_2837711e.jpg"
                alt="Mutiganda Yvan"
                className="w-13 h-13 rounded-2xl object-cover object-top border-2 border-blue-400/60 shadow-md shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold tracking-tight leading-tight text-white truncate">
                    Mutiganda Yvan
                  </h2>
                  <span className="text-xs">🇷🇼</span>
                </div>
                <p className="text-[11px] font-semibold text-blue-200 mt-0.5">
                  Mutiganda Yvan VPN · v2.4.0
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-300 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Rwamagana · Gisozi · Kayonza</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="py-2 divide-y divide-slate-100 dark:divide-slate-800/80">
            <div className="py-1">
              {/* Payload Generator */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('payload_gen');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Payload Generator</span>
              </button>

              {/* Identification */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('identification');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Fingerprint className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Identification (HWID)</span>
              </button>
            </div>

            <div className="py-1">
              {/* Export Config */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('export_config');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Export Config (.myv)</span>
              </button>

              {/* Import Config */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('import_config');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Download className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Import Config (.myv)</span>
              </button>
            </div>

            <div className="py-1">
              {/* Settings */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('settings');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Settings className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Settings</span>
              </button>

              {/* Server Apps */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('server_apps');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Rwanda & Global Servers</span>
              </button>
            </div>

            <div className="py-1">
              {/* Telegram Channel */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('telegram');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Send className="w-5 h-5 text-blue-500" />
                <span>Telegram Community</span>
              </button>

              {/* About */}
              <button
                onClick={() => {
                  onClose();
                  onSelectOption('about');
                }}
                className="w-full flex items-center gap-4 px-5 py-3 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Info className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>About Mutiganda Yvan</span>
              </button>
            </div>
          </nav>
        </div>

        {/* WhatsApp Direct Action at bottom of drawer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
          <a
            href="https://wa.me/250787699523"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp: 0787699523</span>
          </a>

          <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <span>Mutiganda Yvan VPN</span>
            <span>·</span>
            <span>Rwanda 🇷🇼 © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
