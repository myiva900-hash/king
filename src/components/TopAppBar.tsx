import React, { useState, useRef, useEffect } from 'react';
import { Menu, Settings, MoreVertical, Server, Wrench, Upload, Download, Trash2, Info, ArrowLeft } from 'lucide-react';
import { MyvLogo } from './MyvLogo';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  onOpenPayloadGen: () => void;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onOpenServerApps: () => void;
  onOpenAbout: () => void;
  onClearLogs: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title = 'Mutiganda Yvan VPN',
  showBack = false,
  onBack,
  onOpenDrawer,
  onOpenSettings,
  onOpenPayloadGen,
  onOpenExport,
  onOpenImport,
  onOpenServerApps,
  onOpenAbout,
  onClearLogs,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close overflow menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white shadow-md select-none transition-colors border-b border-blue-900/30">
      <div className="flex items-center justify-between h-14 px-3 sm:px-4">
        {/* Left Action: Hamburger or Back */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-2 -ml-1 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          ) : (
            <button
              onClick={onOpenDrawer}
              className="p-2 -ml-1 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Logo & Brand title */}
          <div className="flex items-center gap-2">
            {!showBack && <MyvLogo size={28} monochrome />}
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap truncate">
              {title}
            </h1>
          </div>
        </div>

        {/* Right Actions: Settings Gear & Overflow Three-Dot */}
        <div className="flex items-center gap-1">
          {!showBack && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Open Settings"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Overflow Menu Anchor */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full hover:bg-white/15 active:bg-white/25 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="More options"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </button>

            {/* Android-style Material Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenServerApps();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-left transition-colors cursor-pointer"
                >
                  <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Rwanda & Global Servers Ping</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenPayloadGen();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-slate-500" />
                  <span>Payload Generator</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenExport();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Export Config (.myv)</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenImport();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Import Config (.myv)</span>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onClearLogs();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                  <span>Clear Logs</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAbout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>About Mutiganda Yvan</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
