import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronDown, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Rocket, 
  Sliders, 
  Check, 
  Play, 
  Square, 
  Activity, 
  ShieldCheck, 
  Sparkles,
  Lock,
  MessageCircle,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { ConnectionMode, ConnectionStatus, CustomSetupConfig, VpnServer } from '../types/vpn';
import { VpnStats, vpnSimulator } from '../services/vpnSimulator';
import { SERVERS, AVAILABLE_PORTS } from '../data/servers';

interface HomeScreenProps {
  status: ConnectionStatus;
  stats: VpnStats;
  selectedServer: VpnServer;
  onSelectServer: (server: VpnServer) => void;
  selectedPort: number;
  onSelectPort: (port: number) => void;
  connectionMode: ConnectionMode;
  onSelectConnectionMode: (mode: ConnectionMode) => void;
  customSetupEnabled: boolean;
  onToggleCustomSetup: (enabled: boolean) => void;
  customSetup: CustomSetupConfig;
  onUpdateCustomSetup: (updates: Partial<CustomSetupConfig>) => void;
  onStartVpn: () => void;
  onStopVpn: () => void;
  onOpenPayloadGen: () => void;
  onOpenImportConfig: () => void;
  onOpenServerApps: () => void;
}

const CONNECTION_MODES: {
  id: ConnectionMode;
  title: string;
  subtitle: string;
  badge: string;
}[] = [
  {
    id: 'direct',
    title: 'Direct Connection',
    subtitle: 'Rwanda & Global Internet',
    badge: 'DIRECT'
  },
  {
    id: 'custom_payload',
    title: 'Custom Payload',
    subtitle: 'TCP Injection Mode',
    badge: 'PAYLOAD'
  },
  {
    id: 'custom_host',
    title: 'Custom Host Header',
    subtitle: 'HTTP Header Mode',
    badge: 'HOST'
  },
  {
    id: 'custom_sni',
    title: 'Custom SNI',
    subtitle: 'SSL / TLS Mode',
    badge: 'TLS/SNI'
  },
  {
    id: 'dnstt',
    title: 'DNSTT Tunnel',
    subtitle: 'DNS Tunneling Mode',
    badge: 'DNSTT'
  },
  {
    id: 'imported_config',
    title: 'Imported Config',
    subtitle: '.MYV File Profile',
    badge: 'CONFIG'
  }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  status,
  stats,
  selectedServer,
  onSelectServer,
  selectedPort,
  onSelectPort,
  connectionMode,
  onSelectConnectionMode,
  customSetupEnabled,
  onToggleCustomSetup,
  customSetup,
  onUpdateCustomSetup,
  onStartVpn,
  onStopVpn,
  onOpenPayloadGen,
  onOpenImportConfig,
  onOpenServerApps,
}) => {
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showPortMenu, setShowPortMenu] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting' || status === 'authenticating';
  const isBusy = isConnecting || status === 'disconnecting';

  // Format elapsed connection duration HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentModeInfo = CONNECTION_MODES.find(m => m.id === connectionMode) || CONNECTION_MODES[0];

  return (
    <div className="flex-1 w-full max-w-xl mx-auto p-3 sm:p-4 pb-20 flex flex-col gap-3 select-none">
      
      {/* Main VPN Card with Executive Royal Blue & Clean Slate Styling */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-4 relative">
        
        {/* Top Grid: SELECT SERVER and SELECT PORT */}
        <div className="grid grid-cols-12 gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          
          {/* SELECT SERVER */}
          <div className="col-span-8 sm:col-span-8 relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                SELECT SERVER
              </span>
              {selectedServer.countryCode === 'RW' && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded flex items-center gap-1">
                  <span>🇷🇼</span> Rwanda VIP
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setShowServerMenu(!showServerMenu);
                setShowPortMenu(false);
                setShowModeMenu(false);
              }}
              disabled={isConnected || isBusy}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors text-left disabled:opacity-60 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                  <span className="text-base select-none">{selectedServer.flag}</span>
                </div>
                <div className="truncate">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-1.5">
                    <span className="truncate">{selectedServer.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {selectedServer.country} · <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedServer.ping}ms</span>
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Server Dropdown Dialog */}
            {showServerMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                  <span>🇷🇼 Rwanda Dedicated Servers</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">Low Latency</span>
                </div>

                {SERVERS.map(srv => {
                  const isRwanda = srv.countryCode === 'RW';
                  return (
                    <button
                      key={srv.id}
                      onClick={() => {
                        onSelectServer(srv);
                        setShowServerMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors ${
                        selectedServer.id === srv.id ? 'bg-blue-50/80 dark:bg-blue-950/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-lg shrink-0">{srv.flag}</span>
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-1.5">
                            <span>{srv.name}</span>
                            {isRwanda && (
                              <span className="text-[9px] font-extrabold text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 px-1 rounded">
                                RW
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {srv.country} · Load {srv.load}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[11px] font-mono font-bold ${srv.ping < 20 ? 'text-emerald-500' : 'text-blue-600'}`}>
                          {srv.ping}ms
                        </span>
                        {selectedServer.id === srv.id && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* SELECT PORT */}
          <div className="col-span-4 sm:col-span-4 relative">
            <span className="block text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
              SELECT PORT
            </span>

            <button
              onClick={() => {
                setShowPortMenu(!showPortMenu);
                setShowServerMenu(false);
                setShowModeMenu(false);
              }}
              disabled={isConnected || isBusy}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors text-left disabled:opacity-60 cursor-pointer h-[50px]"
            >
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  P {selectedPort}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Port
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Port Dropdown Dialog */}
            {showPortMenu && (
              <div className="absolute top-full right-0 w-48 mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1 z-40 max-h-56 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Available Ports
                </div>
                {AVAILABLE_PORTS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => {
                      onSelectPort(p.value);
                      setShowPortMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors ${
                      selectedPort === p.value ? 'bg-blue-50/80 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {p.label}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {p.desc}
                      </div>
                    </div>
                    {selectedPort === p.value && (
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Traffic Pill: ↑ 0 B   ↓ 0 B */}
        <div className="my-3.5 flex justify-center">
          <div className="inline-flex items-center gap-4 sm:gap-6 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm font-mono tabular-nums text-slate-800 dark:text-slate-200 shadow-inner">
            {/* Upload */}
            <div className="flex items-center gap-1.5">
              <ArrowUpCircle className="w-4 h-4 text-blue-600 fill-blue-500/20" />
              <span>{vpnSimulator.formatBytes(stats.uploadBytes)}</span>
            </div>

            <span className="text-slate-300 dark:text-slate-600">|</span>

            {/* Download */}
            <div className="flex items-center gap-1.5">
              <ArrowDownCircle className="w-4 h-4 text-emerald-600 fill-emerald-500/20" />
              <span>{vpnSimulator.formatBytes(stats.downloadBytes)}</span>
            </div>
          </div>
        </div>

        {/* Connection Mode & Custom Setup Row */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              CONNECTION MODE
            </span>

            {/* Custom Setup Switch */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
                CUSTOM SETUP
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={customSetupEnabled}
                onClick={() => onToggleCustomSetup(!customSetupEnabled)}
                disabled={isConnected || isBusy}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  customSetupEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                } disabled:opacity-50`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    customSetupEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Connection Mode Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowModeMenu(!showModeMenu);
                setShowServerMenu(false);
                setShowPortMenu(false);
              }}
              disabled={isConnected || isBusy}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors text-left disabled:opacity-60 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    {currentModeInfo.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {currentModeInfo.subtitle}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Mode selection popover */}
            {showModeMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-40">
                {CONNECTION_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      onSelectConnectionMode(mode.id);
                      setShowModeMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors ${
                      connectionMode === mode.id ? 'bg-blue-50/70 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Rocket className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                          {mode.title}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {mode.subtitle}
                        </div>
                      </div>
                    </div>
                    {connectionMode === mode.id && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CUSTOM SETUP EXPANDED DRAWER */}
        {customSetupEnabled && (
          <div className="mt-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Custom {currentModeInfo.title} Parameters
              </span>
              {connectionMode === 'custom_payload' && (
                <button
                  onClick={onOpenPayloadGen}
                  className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Payload Generator
                </button>
              )}
            </div>

            {/* Custom Mode Specific Inputs */}
            {connectionMode === 'custom_payload' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    HTTP/TCP Payload Template:
                  </label>
                  <textarea
                    rows={3}
                    value={customSetup.payload}
                    onChange={e => onUpdateCustomSetup({ payload: e.target.value })}
                    placeholder="CONNECT [host_port] [protocol][crlf]Host: example.com[crlf][crlf]"
                    className="w-full p-2 text-[11px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Remote Proxy Host:
                    </label>
                    <input
                      type="text"
                      value={customSetup.proxyHost}
                      onChange={e => onUpdateCustomSetup({ proxyHost: e.target.value })}
                      placeholder="197.243.16.8"
                      className="w-full p-1.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Proxy Port:
                    </label>
                    <input
                      type="text"
                      value={customSetup.proxyPort}
                      onChange={e => onUpdateCustomSetup({ proxyPort: e.target.value })}
                      placeholder="8080"
                      className="w-full p-1.5 text-[11px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {connectionMode === 'custom_sni' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  Custom SNI Hostname (SSL/TLS Extension):
                </label>
                <input
                  type="text"
                  value={customSetup.sni}
                  onChange={e => onUpdateCustomSetup({ sni: e.target.value })}
                  placeholder="e.g. edge.cloudflare.com, speedtest.net"
                  className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            {connectionMode === 'custom_host' && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                  Custom Host Header (HTTP Mode):
                </label>
                <input
                  type="text"
                  value={customSetup.hostHeader}
                  onChange={e => onUpdateCustomSetup({ hostHeader: e.target.value })}
                  placeholder="e.g. cdn.cloudflare.net"
                  className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            {connectionMode === 'dnstt' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    DNSTT Domain Nameserver:
                  </label>
                  <input
                    type="text"
                    value={customSetup.dnsttDomain}
                    onChange={e => onUpdateCustomSetup({ dnsttDomain: e.target.value })}
                    placeholder="t.myv-dns.org"
                    className="w-full p-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    DNSTT Public Key:
                  </label>
                  <input
                    type="text"
                    value={customSetup.dnsttPublicKey}
                    onChange={e => onUpdateCustomSetup({ dnsttPublicKey: e.target.value })}
                    placeholder="0123456789abcdef0123456789abcdef..."
                    className="w-full p-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {connectionMode === 'imported_config' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    {customSetup.importedConfigName || 'No profile loaded'}
                  </span>
                  <button
                    onClick={onOpenImportConfig}
                    className="px-2.5 py-1 text-[10px] font-bold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Import .MYV File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LARGE START / STOP BUTTON IN ROYAL BLUE */}
        <div className="mt-4">
          <button
            onClick={isConnected ? onStopVpn : onStartVpn}
            disabled={isBusy}
            className={`w-full py-3.5 px-6 rounded-xl font-extrabold text-sm tracking-widest uppercase text-white shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer android-ripple ${
              isConnected
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                : isBusy
                ? 'bg-amber-500 opacity-90 cursor-wait'
                : 'bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 shadow-blue-600/30'
            }`}
          >
            {isBusy ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{status === 'connecting' ? 'CONNECTING...' : 'AUTHENTICATING...'}</span>
              </>
            ) : isConnected ? (
              <>
                <Square className="w-4 h-4 fill-white" />
                <span>STOP TUNNEL</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>START VPN</span>
              </>
            )}
          </button>
        </div>

        {/* STATUS FOOTER / TELEMETRY BANNER */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected
                  ? 'bg-emerald-500'
                  : isBusy
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
            <span className="font-semibold text-[11px] text-slate-700 dark:text-slate-300 uppercase">
              {status === 'connected' ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  CONNECTED ({formatDuration(stats.connectedSeconds)})
                </span>
              ) : isBusy ? (
                <span className="text-amber-600 dark:text-amber-400">
                  {status}...
                </span>
              ) : (
                'DISCONNECTED'
              )}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            {isConnected ? `IP: ${stats.assignedIp}` : `${selectedServer.name}`}
          </div>
        </div>
      </div>

      {/* QUICK UTILITY ACTION: PING RWANDA & GLOBAL NODES */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onOpenServerApps}
          className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/50 transition-all flex items-center gap-2.5 text-left group shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Server Ping Test
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Rwamagana & Kigali
            </div>
          </div>
        </button>

        <button
          onClick={onOpenPayloadGen}
          className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/50 transition-all flex items-center gap-2.5 text-left group shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Payload Tool
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Custom HTTP injector
            </div>
          </div>
        </button>
      </div>

      {/* USER PHOTO & WHATSAPP DEVELOPER CARD (Directly as requested by user) */}
      <div className="p-3.5 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl shadow-md border border-blue-900/40 relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          
          {/* User's Photo */}
          <div className="relative shrink-0">
            <img
              src="/assets/aistudio/photo_6015008377458593951_y_2837711e.jpg"
              alt="Mutiganda Yvan"
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover object-top border-2 border-blue-400/50 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-white" title="Verified Creator">
              ✓
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-white truncate">
                Mutiganda Yvan
              </h3>
              <span className="text-xs">🇷🇼</span>
            </div>
            
            <p className="text-[11px] text-blue-200/90 font-medium">
              Lead Architect & Founder
            </p>

            {/* Direct Clickable WhatsApp Contact */}
            <div className="mt-2 flex items-center gap-2">
              <a
                href="https://wa.me/250787699523"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Chat on WhatsApp: 0787699523"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp: 0787699523</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Zero Logs & Security notice */}
      <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-900/40 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
        <span>
          Mutiganda Yvan VPN uses high-grade 256-bit encryption. Zero telemetry.
        </span>
      </div>
    </div>
  );
};
