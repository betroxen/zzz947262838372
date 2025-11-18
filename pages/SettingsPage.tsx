
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { ToastContext } from '../context/ToastContext';
import { Icons } from '../components/icons';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Toggle } from '../components/Toggle';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { ConfirmationModal } from '../components/ConfirmationModal';

// --- TYPES ---
interface Session {
    id: string;
    device: string;
    location: string;
    ip: string;
    lastActive: string;
    current: boolean;
}

const MOCK_SESSIONS: Session[] = [
    { id: 'sess_01', device: 'Chrome / Windows 11', location: 'London, UK', ip: '192.168.1.1', lastActive: 'Now', current: true },
    { id: 'sess_02', device: 'Safari / iPhone 15 Pro', location: 'London, UK', ip: '192.168.1.45', lastActive: '2h ago', current: false },
];

// --- COMPONENTS ---

const SettingSection: React.FC<{ title: string; icon: React.FC<any>; children: React.ReactNode; className?: string }> = ({ title, icon: Icon, children, className }) => (
    <Card className={`p-0 overflow-hidden border-[#333] bg-[#0c0c0e] h-full ${className}`}>
        <div className="p-5 border-b border-[#333] bg-[#111] flex items-center gap-3">
            <div className="p-2 rounded bg-[#1a1a1a] border border-[#333]">
                <Icon className="h-5 w-5 text-neon-surge" />
            </div>
            <h3 className="font-orbitron text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
        </div>
        <div className="p-5 space-y-6">
            {children}
        </div>
    </Card>
);

const ProTip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex gap-3 p-3 rounded-lg bg-blue-900/10 border border-blue-500/30 text-xs font-rajdhani text-blue-200 items-start mt-2">
        <Icons.HelpCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">{children}</div>
    </div>
);

const SettingsPage = () => {
    const { showToast } = useContext(ToastContext) || { showToast: () => {} };
    const { logout } = useContext(AppContext) || { logout: () => {} };
    
    // --- STATE ---
    const [settings, setSettings] = useState({
        theme: 'dark',
        language: 'en',
        oddsFormat: 'decimal',
        mfaEnabled: true,
        geoFencing: true,
        autoLogout: '30m',
        analyticsOptIn: false,
        affiliateTracking: true,
        publicProfile: true,
        emailAlerts: true,
        marketingComms: false,
    });

    const [walletAddress, setWalletAddress] = useState('0x71C...9A21');
    const [isWalletLocked, setIsWalletLocked] = useState(true);
    const [tempWalletInput, setTempWalletInput] = useState(walletAddress);
    
    const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
    
    // Danger Zone Modals
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // --- HANDLERS ---

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => {
            const newVal = !prev[key];
            showToast(`CONFIGURATION UPDATED: ${String(key).toUpperCase()} set to ${newVal ? 'ACTIVE' : 'INACTIVE'}`, 'info');
            return { ...prev, [key]: newVal };
        });
    };

    const handleSelectChange = (key: keyof typeof settings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        showToast(`PREFERENCE SYNCED: ${String(key).toUpperCase()} updated.`, 'success');
    };

    const handleWalletEdit = () => {
        if (isWalletLocked) {
            setIsWalletLocked(false);
            setTempWalletInput(''); 
        } else {
            // Save Logic
            if (tempWalletInput.length < 20) {
                showToast("INVALID ADDRESS: Wallet address too short.", "error");
                return;
            }
            setWalletAddress(tempWalletInput);
            setIsWalletLocked(true);
            showToast("SSP VAULT UPDATED: New payout address confirmed.", "success");
        }
    };

    const terminateSession = (id: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        showToast("SESSION TERMINATED: Access revoked for device.", "warning");
    };

    const handleDataExport = () => {
        showToast("ARCHIVE REQUESTED: Preparing GDPR data package. ETA 24h.", "info");
    };

    const handleDeleteAccount = () => {
        // In a real app, this would call an API
        logout();
        showToast("ACCOUNT PURGED. SELF-DESTRUCT COMPLETE.", "error");
    };

    return (
        <div className="container mx-auto max-w-7xl animate-fadeIn pb-20">
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                title="INITIATE SELF-DESTRUCT?"
                body="WARNING: This action is irreversible. All ZP, rank progress, and linked data will be permanently erased from the Grid. There is no recovery protocol."
                onConfirm={handleDeleteAccount}
                onClose={() => setIsDeleteModalOpen(false)}
            />

             {/* Header */}
            <header className="mb-12 border-b border-[#333] pb-8">
                <h1 className="font-orbitron text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                    COMMAND <span className="text-neon-surge text-glow">CONSOLE</span>
                </h1>
                <p className="text-text-secondary font-jetbrains-mono text-sm md:text-base max-w-2xl">
                    // OPERATOR CONFIGURATION: SECURITY, PRIVACY, AND PROTOCOL PREFERENCES.
                    <br />
                    <span className="text-text-tertiary">Ensure all security circuits are active before engaging in high-value operations.</span>
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. INTERFACE & EXPERIENCE */}
                <SettingSection title="INTERFACE PROTOCOLS" icon={Icons.Settings}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-jetbrains-mono text-text-tertiary uppercase mb-2">Visual Theme</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleSelectChange('theme', 'dark')}
                                    className={`p-3 rounded-lg border text-xs font-bold font-orbitron uppercase transition-all ${settings.theme === 'dark' ? 'bg-neon-surge text-black border-neon-surge shadow-[0_0_15px_rgba(0,255,192,0.3)]' : 'bg-[#1a1a1a] text-text-tertiary border-[#333]'}`}
                                >
                                    TACTICAL DARK
                                </button>
                                <button 
                                    onClick={() => handleSelectChange('theme', 'light')}
                                    className={`p-3 rounded-lg border text-xs font-bold font-orbitron uppercase transition-all ${settings.theme === 'light' ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] text-text-tertiary border-[#333]'}`}
                                >
                                    LIGHT (BETA)
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-xs font-jetbrains-mono text-text-tertiary uppercase mb-2">Language</label>
                                <Input 
                                    as="select" 
                                    value={settings.language} 
                                    onChange={(e) => handleSelectChange('language', e.target.value)}
                                    className="h-11 bg-[#050505]"
                                >
                                    <option value="en">ENGLISH (US)</option>
                                    <option value="es">ESPAÑOL</option>
                                    <option value="fr">FRANÇAIS</option>
                                    <option value="de">DEUTSCH</option>
                                    <option value="jp">日本語</option>
                                </Input>
                            </div>
                             <div>
                                <label className="block text-xs font-jetbrains-mono text-text-tertiary uppercase mb-2">Data Format</label>
                                <Input 
                                    as="select" 
                                    value={settings.oddsFormat} 
                                    onChange={(e) => handleSelectChange('oddsFormat', e.target.value)}
                                    className="h-11 bg-[#050505]"
                                >
                                    <option value="decimal">DECIMAL (1.50)</option>
                                    <option value="fractional">FRACTIONAL (1/2)</option>
                                    <option value="american">AMERICAN (-200)</option>
                                    <option value="percentage">PERCENTAGE (66%)</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                </SettingSection>

                {/* 2. SECURITY CIRCUIT */}
                <SettingSection title="SECURITY CIRCUIT" icon={Icons.Shield}>
                    <div className="space-y-6">
                        <Toggle 
                            checked={settings.mfaEnabled}
                            onChange={() => handleToggle('mfaEnabled')}
                            label={<span className="text-white font-bold text-sm">MULTI-FACTOR AUTHENTICATION (MFA)</span>}
                            description={<span className="text-xs text-text-tertiary">Require 2FA token for login and withdrawals. Strongly recommended for Operator Tiers 2+.</span>}
                        />
                        <div className="h-px bg-[#333] w-full"></div>
                        <Toggle 
                            checked={settings.geoFencing}
                            onChange={() => handleToggle('geoFencing')}
                            label={<span className="text-white font-bold text-sm">GEO-COMPLIANCE FENCING</span>}
                            description={<span className="text-xs text-text-tertiary">Auto-terminate session if IP address shifts to a restricted jurisdiction.</span>}
                        />
                        <ProTip>
                            <strong className="text-blue-300">INTEL:</strong> Geo-fencing protects your account from being flagged by AML bots if your IP accidentally routes through a sanctioned zone via VPN.
                        </ProTip>
                         
                         <div className="pt-4">
                            <label className="block text-xs font-jetbrains-mono text-text-tertiary uppercase mb-3">Active Sessions</label>
                            <div className="space-y-3">
                                {sessions.map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-[#14131c] border border-[#333]">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${session.current ? 'bg-neon-surge animate-pulse' : 'bg-text-tertiary'}`}></div>
                                            <div>
                                                <p className="text-xs text-white font-bold font-orbitron uppercase">{session.device}</p>
                                                <p className="text-[10px] text-text-tertiary font-jetbrains-mono">{session.location} • {session.ip}</p>
                                            </div>
                                        </div>
                                        {!session.current && (
                                            <button onClick={() => terminateSession(session.id)} className="text-[10px] text-warning-high hover:text-white font-bold uppercase border border-warning-high/30 hover:bg-warning-high px-2 py-1 rounded transition-colors">
                                                KILL
                                            </button>
                                        )}
                                        {session.current && <span className="text-[10px] text-neon-surge font-jetbrains-mono uppercase border border-neon-surge/30 px-2 py-1 rounded">CURRENT</span>}
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                </SettingSection>

                {/* 3. SSP REWARDS VAULT */}
                <SettingSection title="SSP REWARDS VAULT" icon={Icons.Wallet}>
                     <div className="space-y-6">
                        <div className="p-4 bg-[#14131c] border border-[#333] rounded-lg">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-jetbrains-mono text-neon-surge uppercase tracking-widest">Current Reward Tier</span>
                                <span className="text-xl font-bold text-white font-orbitron">SILVER</span>
                            </div>
                            <ProgressBar progress={65} className="h-2 mb-2" />
                            <p className="text-[10px] text-text-tertiary font-jetbrains-mono text-right">
                                350 ZP TO GOLD TIER // UNLOCKS INSTANT PAYOUTS
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-jetbrains-mono text-text-tertiary uppercase mb-2">Payout Wallet Address (ERC-20 / TRC-20)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input 
                                        value={isWalletLocked ? walletAddress : tempWalletInput}
                                        onChange={(e) => setTempWalletInput(e.target.value)}
                                        disabled={isWalletLocked}
                                        type="text"
                                        className={`h-11 font-jetbrains-mono text-sm ${isWalletLocked ? 'bg-[#1a1a1a] text-text-tertiary opacity-70' : 'bg-black border-neon-surge text-white'}`}
                                    />
                                    {isWalletLocked && <Icons.Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />}
                                </div>
                                <Button 
                                    onClick={handleWalletEdit}
                                    variant={isWalletLocked ? "ghost" : "primary"}
                                    className={`h-11 font-orbitron uppercase text-xs tracking-wider ${!isWalletLocked ? 'bg-neon-surge text-black' : ''}`}
                                >
                                    {isWalletLocked ? 'UNLOCK' : 'SAVE'}
                                </Button>
                            </div>
                            {!isWalletLocked && (
                                <p className="text-[10px] text-warning-low mt-2 font-jetbrains-mono animate-pulse">
                                    WARNING: Verify address chain compatibility. Lost funds cannot be recovered by ZapWay.
                                </p>
                            )}
                        </div>
                        
                        <div className="pt-2 text-center">
                             <button className="text-xs text-neon-surge hover:text-white font-jetbrains-mono uppercase border-b border-neon-surge/30 hover:border-white transition-colors">
                                VIEW FULL TRANSACTION LEDGER &rarr;
                             </button>
                        </div>
                     </div>
                </SettingSection>

                {/* 4. PRIVACY & DATA CONTROL */}
                <SettingSection title="DATA SOVEREIGNTY" icon={Icons.Database}>
                    <div className="space-y-6">
                         <Toggle 
                            checked={settings.publicProfile}
                            onChange={() => handleToggle('publicProfile')}
                            label={<span className="text-white font-bold text-sm">PUBLIC PROFILE VISIBILITY</span>}
                            description={<span className="text-xs text-text-tertiary">Allow your VPR contributions and Rank to be visible on the public Grid leaderboards.</span>}
                        />
                        <div className="h-px bg-[#333] w-full"></div>
                         <Toggle 
                            checked={settings.analyticsOptIn}
                            onChange={() => handleToggle('analyticsOptIn')}
                            label={<span className="text-white font-bold text-sm">ANONYMIZED ANALYTICS</span>}
                            description={<span className="text-xs text-text-tertiary">Contribute anonymous usage data to help improve ZK-Rollup efficiency. No PII collected.</span>}
                        />
                        <div className="h-px bg-[#333] w-full"></div>
                        
                        <div className="bg-[#14131c] p-4 rounded-lg border border-[#333] flex justify-between items-center">
                            <div>
                                <p className="text-sm font-bold text-white font-orbitron uppercase">DATA PORTABILITY (GDPR)</p>
                                <p className="text-xs text-text-tertiary font-jetbrains-mono mt-1">Export all your stored PII and VPR history.</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleDataExport} className="border border-[#333] hover:border-neon-surge text-[10px] font-orbitron uppercase">
                                REQUEST ARCHIVE
                            </Button>
                        </div>
                    </div>
                </SettingSection>
                
                 {/* 5. COMMS */}
                <SettingSection title="INTEL CHANNELS" icon={Icons.Bell}>
                    <div className="space-y-5">
                         <div className="flex items-center justify-between opacity-70 cursor-not-allowed">
                            <div>
                                <p className="text-sm font-bold text-white font-orbitron uppercase">SYSTEM ALERTS</p>
                                <p className="text-xs text-text-tertiary">Critical security and account notifications.</p>
                            </div>
                            <div className="flex items-center gap-2 text-neon-surge text-xs font-bold uppercase border border-neon-surge/30 px-2 py-1 rounded">
                                <Icons.Lock className="w-3 h-3" /> LOCKED ON
                            </div>
                        </div>
                         <div className="h-px bg-[#333] w-full"></div>
                         <Toggle 
                            checked={settings.emailAlerts}
                            onChange={() => handleToggle('emailAlerts')}
                            label={<span className="text-white font-bold text-sm">EMAIL DIGESTS</span>}
                            description={<span className="text-xs text-text-tertiary">Weekly summary of Rewards, VPR status, and Platform news.</span>}
                        />
                         <Toggle 
                            checked={settings.marketingComms}
                            onChange={() => handleToggle('marketingComms')}
                            label={<span className="text-white font-bold text-sm">PARTNER OFFERS</span>}
                            description={<span className="text-xs text-text-tertiary">Exclusive bonuses from Certified Operators.</span>}
                        />
                    </div>
                </SettingSection>

                {/* 6. DANGER ZONE */}
                <SettingSection title="DANGER ZONE" icon={Icons.AlertTriangle} className="border-warning-high/30">
                    <div className="space-y-4">
                         <p className="text-sm text-text-secondary font-rajdhani">
                            These actions affect your permanent record on the Grid. Proceed with caution.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button 
                                onClick={() => showToast("ACCOUNT PAUSED. 24H COOLDOWN ACTIVE.", "warning")}
                                variant="ghost" 
                                className="border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 font-orbitron uppercase text-xs font-bold"
                            >
                                PAUSE ACCOUNT (24H)
                            </Button>
                             <Button 
                                onClick={() => setIsDeleteModalOpen(true)}
                                variant="destructive"
                                className="font-orbitron uppercase text-xs font-bold tracking-wider bg-warning-high/10 text-warning-high border border-warning-high/50 hover:bg-warning-high hover:text-white"
                            >
                                INITIATE SELF-DESTRUCT
                            </Button>
                        </div>
                    </div>
                </SettingSection>

            </div>
        </div>
    );
};

export default SettingsPage;
