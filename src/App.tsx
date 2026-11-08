import React, { useState, useEffect } from 'react';
import { 
  ConnectionMode, 
  ConnectionStatus, 
  CustomSetupConfig, 
  AppSettings, 
  VpnLogEntry, 
  VpnServer, 
  ExportableConfig 
} from './types/vpn';
import { SERVERS } from './data/servers';
import { vpnSimulator, VpnStats } from './services/vpnSimulator';
import { DEFAULT_PAYLOAD } from './services/payloadEngine';
import { getOrCreateDeviceId } from './services/configManager';

// UI Components
import { TopAppBar } from './components/TopAppBar';
import { TabsHeader } from './components/TabsHeader';
import { TickerNotice } from './components/TickerNotice';
import { HomeScreen } from './components/HomeScreen';
import { LogScreen } from './components/LogScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { SideMenuDrawer } from './components/SideMenuDrawer';

// Modals
import { PayloadGeneratorModal } from './components/PayloadGeneratorModal';
import { IdentificationModal } from './components/IdentificationModal';
import { ExportConfigModal } from './components/ExportConfigModal';
import { ImportConfigModal } from './components/ImportConfigModal';
import { ServerAppsModal } from './components/ServerAppsModal';
import { TelegramModal } from './components/TelegramModal';
import { AboutModal } from './components/AboutModal';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'main' | 'settings'>('main');
  const [activeTab, setActiveTab] = useState<'HOME' | 'LOG'>('HOME');

  // VPN Tunnel State
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<VpnStats>({
    uploadBytes: 0,
    downloadBytes: 0,
    uploadSpeed: 0,
    downloadSpeed: 0,
    connectedSeconds: 0,
    assignedIp: '10.8.0.2',
  });
  const [logs, setLogs] = useState<VpnLogEntry[]>([]);
  const [selectedServer, setSelectedServer] = useState<VpnServer>(SERVERS[0]);
  const [selectedPort, setSelectedPort] = useState<number>(80);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('direct');
  const [customSetupEnabled, setCustomSetupEnabled] = useState<boolean>(false);

  // Custom Setup Parameters
  const [customSetup, setCustomSetup] = useState<CustomSetupConfig>({
    payload: DEFAULT_PAYLOAD,
    hostHeader: 'cloudflare.com',
    sni: 'edge.cloudflare.com',
    proxyHost: '104.21.58.120',
    proxyPort: '8080',
    dnsttDomain: 't.myv-dns.org',
    dnsttPublicKey: '3b6c28f090b4d4554be7df75bf1efbe00e572886f4a7c062abff4820a4be3568',
    dnsResolver: '1.1.1.1',
    importedConfigName: undefined,
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('myv_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      sound: true,
      vibrate: true,
      theme: 'light',
      connectionRetry: true,
      forwardDns: false,
      customDns: false,
      primaryDns: '1.1.1.1',
      secondaryDns: '8.8.8.8',
      autoReconnect: false,
      connectionTimeout: 30,
    };
  });

  // Modals
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [payloadGenOpen, setPayloadGenOpen] = useState(false);
  const [identificationOpen, setIdentificationOpen] = useState(false);
  const [exportConfigOpen, setExportConfigOpen] = useState(false);
  const [importConfigOpen, setImportConfigOpen] = useState(false);
  const [serverAppsOpen, setServerAppsOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('myv_settings', JSON.stringify(settings));
  }, [settings]);

  // Subscribe to VPN Simulator status and logs
  useEffect(() => {
    const unsubStatus = vpnSimulator.subscribeStatus((newStatus, newStats) => {
      setStatus(newStatus);
      setStats(newStats);
    });

    const unsubLogs = vpnSimulator.subscribeLogs(entry => {
      setLogs(prev => [...prev, entry]);
    });

    // Seed initial log
    vpnSimulator['emitLog'](
      'info',
      'Mutiganda Yvan VPN client ready. Tap START to initiate connection.'
    );

    return () => {
      unsubStatus();
      unsubLogs();
    };
  }, []);

  // Handlers
  const handleStartVpn = () => {
    vpnSimulator.startConnection(selectedServer, selectedPort, connectionMode, customSetup, {
      sound: settings.sound,
      vibrate: settings.vibrate,
      primaryDns: settings.primaryDns,
      forwardDns: settings.forwardDns,
    });
  };

  const handleStopVpn = () => {
    vpnSimulator.stopConnection({
      sound: settings.sound,
      vibrate: settings.vibrate,
    });
  };

  const handleConfigImported = (config: ExportableConfig) => {
    setConnectionMode(config.connectionMode);
    setCustomSetup(config.customSetup);
    setCustomSetupEnabled(true);

    const matchingServer = SERVERS.find(s => s.host === config.serverHost);
    if (matchingServer) {
      setSelectedServer(matchingServer);
    }
    if (config.serverPort) {
      setSelectedPort(config.serverPort);
    }

    setCustomSetup(prev => ({
      ...prev,
      importedConfigName: config.configName,
    }));

    vpnSimulator['emitLog'](
      'success',
      `Imported configuration profile [${config.configName}] successfully applied.`
    );
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleDrawerOption = (
    option:
      | 'payload_gen'
      | 'identification'
      | 'export_config'
      | 'import_config'
      | 'settings'
      | 'server_apps'
      | 'telegram'
      | 'about'
  ) => {
    switch (option) {
      case 'payload_gen':
        setPayloadGenOpen(true);
        break;
      case 'identification':
        setIdentificationOpen(true);
        break;
      case 'export_config':
        setExportConfigOpen(true);
        break;
      case 'import_config':
        setImportConfigOpen(true);
        break;
      case 'settings':
        setCurrentView('settings');
        break;
      case 'server_apps':
        setServerAppsOpen(true);
        break;
      case 'telegram':
        setTelegramOpen(true);
        break;
      case 'about':
        setAboutOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex justify-center font-sans transition-colors">
      
      {/* PURE ANDROID APP CONTAINER */}
      <div className="w-full max-w-lg min-h-screen bg-white dark:bg-slate-900 shadow-xl flex flex-col relative">
        {currentView === 'settings' ? (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={updates => setSettings(prev => ({ ...prev, ...updates }))}
            onBack={() => setCurrentView('main')}
          />
        ) : (
          <>
            <TopAppBar
              onOpenDrawer={() => setDrawerOpen(true)}
              onOpenSettings={() => setCurrentView('settings')}
              onOpenPayloadGen={() => setPayloadGenOpen(true)}
              onOpenExport={() => setExportConfigOpen(true)}
              onOpenImport={() => setImportConfigOpen(true)}
              onOpenServerApps={() => setServerAppsOpen(true)}
              onOpenAbout={() => setAboutOpen(true)}
              onClearLogs={handleClearLogs}
            />

            <TabsHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
              unreadLogsCount={logs.length}
            />

            <TickerNotice onTelegramClick={() => setTelegramOpen(true)} />

            {/* Tab Views */}
            <div className="flex-1 flex flex-col bg-slate-50/60 dark:bg-slate-950/60 overflow-y-auto">
              {activeTab === 'HOME' ? (
                <HomeScreen
                  status={status}
                  stats={stats}
                  selectedServer={selectedServer}
                  onSelectServer={setSelectedServer}
                  selectedPort={selectedPort}
                  onSelectPort={setSelectedPort}
                  connectionMode={connectionMode}
                  onSelectConnectionMode={setConnectionMode}
                  customSetupEnabled={customSetupEnabled}
                  onToggleCustomSetup={setCustomSetupEnabled}
                  customSetup={customSetup}
                  onUpdateCustomSetup={updates => setCustomSetup(prev => ({ ...prev, ...updates }))}
                  onStartVpn={handleStartVpn}
                  onStopVpn={handleStopVpn}
                  onOpenPayloadGen={() => setPayloadGenOpen(true)}
                  onOpenImportConfig={() => setImportConfigOpen(true)}
                  onOpenServerApps={() => setServerAppsOpen(true)}
                />
              ) : (
                <LogScreen logs={logs} onClearLogs={handleClearLogs} />
              )}
            </div>
          </>
        )}
      </div>

      {/* SIDE DRAWER */}
      <SideMenuDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectOption={handleDrawerOption}
      />

      {/* MODALS */}
      <PayloadGeneratorModal
        isOpen={payloadGenOpen}
        onClose={() => setPayloadGenOpen(false)}
        onApplyPayload={p => {
          setCustomSetup(prev => ({ ...prev, payload: p }));
          setCustomSetupEnabled(true);
          setConnectionMode('custom_payload');
          vpnSimulator['emitLog']('info', 'Custom payload updated and applied to setup.');
        }}
      />

      <IdentificationModal
        isOpen={identificationOpen}
        onClose={() => setIdentificationOpen(false)}
      />

      <ExportConfigModal
        isOpen={exportConfigOpen}
        onClose={() => setExportConfigOpen(false)}
        server={selectedServer}
        port={selectedPort}
        connectionMode={connectionMode}
        customSetup={customSetup}
      />

      <ImportConfigModal
        isOpen={importConfigOpen}
        onClose={() => setImportConfigOpen(false)}
        onConfigImported={handleConfigImported}
      />

      <ServerAppsModal
        isOpen={serverAppsOpen}
        onClose={() => setServerAppsOpen(false)}
      />

      <TelegramModal
        isOpen={telegramOpen}
        onClose={() => setTelegramOpen(false)}
      />

      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
}
