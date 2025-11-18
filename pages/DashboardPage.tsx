
import React, { useContext, useState } from 'react';
import { Icons } from '../components/icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { AppContext } from '../context/AppContext';

// --- Types ---
type NotificationType = 'system' | 'warning' | 'error' | 'bonus';

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

// --- Mock Data ---
const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, type: 'warning', title: 'High Volatility Detected', message: 'Market volatility index spike. Adjust leverage accordingly.', timestamp: '10m ago', read: false },
    { id: 2, type: 'bonus', title: 'Mission Accomplished', message: 'Weekly wager target hit. +500 ZP credited to vault.', timestamp: '1h ago', read: false },
    { id: 3, type: 'system', title: 'Protocol Update v2.4', message: 'ZK-Rollup verifier patch deployed successfully.', timestamp: '3h ago', read: true },
    { id: 4, type: 'error', title: 'Network Latency', message: 'Solana mainnet congestion detected. Withdrawals may be delayed.', timestamp: '5h ago', read: true },
];

// --- Components ---

const NotificationItem: React.FC<{ note: Notification }> = ({ note }) => {
    const iconMap = {
        system: { icon: Icons.Terminal, color: 'text-neon-surge', border: 'border-neon-surge/30', bg: 'bg-neon-surge/5' },
        warning: { icon: Icons.AlertTriangle, color: 'text-warning-low', border: 'border-warning-low/30', bg: 'bg-warning-low/5' },
        error: { icon: Icons.Activity, color: 'text-warning-high', border: 'border-warning-high/30', bg: 'bg-warning-high/5' },
        bonus: { icon: Icons.Gift, color: 'text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-400/5' },
    };

    const style = iconMap[note.type];
    const Icon = style.icon;

    return (
        <div className={`flex gap-3 p-3 rounded-lg border ${style.border} ${style.bg} mb-2 transition-all hover:translate-x-1`}>
            <div className={`mt-0.5 shrink-0 ${style.color}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className={`text-xs font-bold uppercase font-orbitron ${style.color} tracking-wide`}>{note.title}</h4>
                    <span className="text-[9px] font-mono text-text-tertiary shrink-0">{note.timestamp}</span>
                </div>
                <p className="text-xs text-text-secondary font-rajdhani mt-1 leading-relaxed truncate">{note.message}</p>
            </div>
            {!note.read && <div className="w-1.5 h-1.5 rounded-full bg-neon-surge mt-1.5 shrink-0 animate-pulse"></div>}
        </div>
    );
};

const NotificationFeed = () => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <Card className="h-full flex flex-col bg-[#0c0c0e]/80 backdrop-blur-sm border-[#333] hover:border-neon-surge/30 transition-colors p-0 overflow-hidden">
            <div className="p-4 border-b border-[#333] bg-[#111] flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Icons.Bell className="w-4 h-4 text-neon-surge" />
                    <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider">Live Intel Feed</h3>
                </div>
                <button onClick={markAllRead} className="text-[10px] font-mono text-text-tertiary hover:text-white uppercase">
                    Mark Read
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                {notifications.map(note => (
                    <NotificationItem key={note.id} note={note} />
                ))}
                 <div className="text-center mt-4 mb-2">
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest opacity-50">-- End of Stream --</span>
                </div>
            </div>
        </Card>
    );
};

const StatWidget = ({ title, value, subtext, icon: Icon, trend }: { title: string, value: string, subtext?: string, icon: React.ElementType, trend?: 'up' | 'down' | 'neutral' }) => (
    <div className="flex items-start justify-between p-4 bg-foundation-light/40 border border-[#333] rounded-lg hover:border-neon-surge/30 transition-all group backdrop-blur-sm">
        <div>
            <p className="text-[10px] text-text-tertiary font-jetbrains-mono uppercase tracking-widest mb-1">{title}</p>
            <p className="text-2xl font-orbitron font-bold text-white group-hover:text-shadow-neon transition-all">{value}</p>
            {subtext && <p className="text-[10px] text-text-secondary mt-1 font-mono">{subtext}</p>}
        </div>
        <div className={`p-2 rounded-md border border-transparent group-hover:border-white/10 transition-colors ${trend === 'up' ? 'bg-neon-surge/10 text-neon-surge' : trend === 'down' ? 'bg-warning-high/10 text-warning-high' : 'bg-[#222] text-text-tertiary'}`}>
            <Icon className="h-5 w-5" />
        </div>
    </div>
);

const ActivityRow = ({ game, wager, payout, time, result }: { game: string, wager: string, payout: string, time: string, result: 'win' | 'loss' }) => (
    <div className="flex items-center justify-between p-3 border-b border-[#222] last:border-0 hover:bg-white/5 transition-colors text-sm group">
        <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${result === 'win' ? 'bg-neon-surge shadow-[0_0_6px_#00FFC0]' : 'bg-text-tertiary'}`}></div>
            <span className="font-bold text-white font-orbitron text-xs tracking-wide">{game}</span>
        </div>
        <div className="font-mono text-text-secondary text-xs">{wager}</div>
        <div className={`font-mono font-bold text-xs ${result === 'win' ? 'text-neon-surge' : 'text-text-tertiary'}`}>{payout}</div>
        <div className="text-[10px] text-[#666] font-jetbrains-mono hidden sm:block">{time}</div>
        <button className="opacity-0 group-hover:opacity-100 text-[9px] text-neon-surge border border-neon-surge/30 px-2 py-0.5 rounded hover:bg-neon-surge hover:text-black transition-all uppercase font-bold tracking-wider">
            Verify
        </button>
    </div>
);

const DashboardPage: React.FC = () => {
    const appContext = useContext(AppContext);

    const user = {
        balanceUSD: "$12,450.50",
        balanceBTC: "0.4200 BTC",
        zapPoints: "4,250",
        zapScore: 92,
        securityLevel: "TIER 3",
    };

    return (
        <div className="animate-fadeIn font-rajdhani pb-12 relative">
            {/* Dashboard Specific Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neon-surge/20 via-transparent to-transparent"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* --- LEFT COLUMN: MAIN STATS & GAMEPLAY (8 cols) --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* 1. COMMAND HEADER */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatWidget 
                            title="Total Balance" 
                            value={user.balanceUSD} 
                            subtext={user.balanceBTC} 
                            icon={Icons.Wallet} 
                            trend="up" 
                        />
                        <StatWidget 
                            title="Zap Points (ZP)" 
                            value={user.zapPoints} 
                            subtext="Next Reward: 5,000 ZP" 
                            icon={Icons.Zap} 
                            trend="up" 
                        />
                         <StatWidget 
                            title="ZAP Score" 
                            value={user.zapScore.toString()} 
                            subtext="Elite Operator Status" 
                            icon={Icons.Shield} 
                            trend="neutral" 
                        />
                    </div>

                    {/* 2. LIVE RTP TRACKER (Mini) */}
                    <Card className="p-6 bg-[#0c0c0e]/80 backdrop-blur-sm border-[#333] hover:border-neon-surge/30 transition-colors">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-orbitron text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Icons.Activity className="h-5 w-5 text-neon-surge animate-pulse" />
                                Live RTP Intelligence
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => appContext?.setCurrentPage('Live RTP Tracker')} className="text-xs">
                                View Full Feed &rarr;
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Plinko Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-jetbrains-mono">
                                    <span className="text-text-secondary">PLINKO</span>
                                    <span className="text-neon-surge">99.2%</span>
                                </div>
                                <ProgressBar progress={99.2} className="h-1.5" />
                                <p className="text-[10px] text-text-tertiary text-right">Trend: Stable</p>
                            </div>
                             {/* Mines Bar */}
                             <div className="space-y-2">
                                <div className="flex justify-between text-xs font-jetbrains-mono">
                                    <span className="text-text-secondary">MINES</span>
                                    <span className="text-yellow-400">98.5%</span>
                                </div>
                                <div className="w-full bg-foundation-lighter rounded-full h-1.5">
                                    <div className="bg-yellow-400 h-1.5 rounded-full shadow-[0_0_10px_#FACC15]" style={{ width: '98.5%' }}></div>
                                </div>
                                <p className="text-[10px] text-text-tertiary text-right">Trend: Volatile</p>
                            </div>
                             {/* Slots Bar */}
                             <div className="space-y-2">
                                <div className="flex justify-between text-xs font-jetbrains-mono">
                                    <span className="text-text-secondary">LIVE SLOTS</span>
                                    <span className="text-blue-400">97.8%</span>
                                </div>
                                <div className="w-full bg-foundation-lighter rounded-full h-1.5">
                                    <div className="bg-blue-400 h-1.5 rounded-full shadow-[0_0_10px_#60A5FA]" style={{ width: '97.8%' }}></div>
                                </div>
                                <p className="text-[10px] text-text-tertiary text-right">Trend: Cooling</p>
                            </div>
                        </div>
                    </Card>

                    {/* 3. QUICK ACTIONS GRID */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => appContext?.setCurrentPage('Mines Game')}
                            className="group relative h-32 rounded-xl overflow-hidden border border-[#333] hover:border-neon-surge transition-all shadow-lg"
                        >
                             <div className="absolute inset-0 bg-gradient-to-br from-foundation-light to-black opacity-90"></div>
                             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                             <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                                 <Icons.Mine className="h-8 w-8 text-white mb-2 group-hover:scale-110 transition-transform duration-300 group-hover:text-neon-surge" />
                                 <span className="font-orbitron font-bold text-white uppercase tracking-widest text-sm">Deploy Mines</span>
                             </div>
                             {/* Hover Glow */}
                             <div className="absolute bottom-0 left-0 w-full h-1 bg-neon-surge scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </button>
                        <button 
                             onClick={() => appContext?.setCurrentPage('Plinko Game')}
                            className="group relative h-32 rounded-xl overflow-hidden border border-[#333] hover:border-purple-500 transition-all shadow-lg"
                        >
                             <div className="absolute inset-0 bg-gradient-to-br from-foundation-light to-black opacity-90"></div>
                             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                             <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                                 <Icons.Gem className="h-8 w-8 text-white mb-2 group-hover:scale-110 transition-transform duration-300 group-hover:text-purple-500" />
                                 <span className="font-orbitron font-bold text-white uppercase tracking-widest text-sm">Launch Plinko</span>
                             </div>
                              <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </button>
                    </div>

                    {/* 4. RECENT ACTIVITY LOG */}
                    <Card className="bg-[#0c0c0e]/80 backdrop-blur-sm border-[#333] p-0 overflow-hidden">
                         <div className="p-4 border-b border-[#333] bg-[#111] flex justify-between items-center">
                            <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider">Tactical Log</h3>
                            <span className="text-[10px] font-mono text-text-tertiary">LAST 24H</span>
                        </div>
                        <div>
                            <ActivityRow game="MINES" wager="$50.00" payout="+$124.50" time="2m ago" result="win" />
                            <ActivityRow game="PLINKO" wager="$25.00" payout="-$25.00" time="15m ago" result="loss" />
                            <ActivityRow game="STAKE (Ext)" wager="$100.00" payout="+$210.00" time="1h ago" result="win" />
                            <ActivityRow game="MINES" wager="$10.00" payout="-$10.00" time="3h ago" result="loss" />
                        </div>
                        <div className="p-2 text-center border-t border-[#333] bg-[#0f0f13]">
                            <button className="text-[10px] font-orbitron uppercase text-text-tertiary hover:text-white tracking-widest transition-colors">
                                View Full Ledger
                            </button>
                        </div>
                    </Card>
                </div>

                {/* --- RIGHT COLUMN: SIDEBAR WIDGETS (4 cols) --- */}
                <div className="lg:col-span-4 space-y-6 flex flex-col">
                    
                    {/* 1. NOTIFICATION FEED (Takes significant vertical space) */}
                    <div className="flex-1 min-h-[300px]">
                        <NotificationFeed />
                    </div>

                    {/* 2. COMPLIANCE STATUS */}
                    <Card className="p-5 bg-foundation-light border-[#333] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-neon-surge/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <Icons.Shield className="h-4 w-4 text-neon-surge" />
                                <h4 className="font-orbitron text-xs font-bold text-white uppercase tracking-wider">XAI Guardian Status</h4>
                            </div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-2xl font-jetbrains-mono font-bold text-white">SAFE</span>
                                <span className="text-[10px] font-mono text-neon-surge">RISK SCORE: 12/100</span>
                            </div>
                            <ProgressBar progress={12} className="h-1.5 mb-3" />
                            <p className="text-[10px] text-text-secondary leading-relaxed">
                                No interventions active. Your play patterns are within the safe tactical range.
                            </p>
                            <Button variant="ghost" size="sm" className="w-full mt-3 border border-[#333] hover:border-neon-surge/50 text-[10px] h-8 uppercase">
                                Manage Limits
                            </Button>
                        </div>
                    </Card>

                     {/* 3. PROMO CARD */}
                    <div className="rounded-xl p-5 bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 relative overflow-hidden group cursor-pointer hover:border-purple-500/60 transition-all">
                         <div className="relative z-10">
                            <span className="bg-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded mb-2 inline-block">NEW MISSION</span>
                            <h4 className="font-orbitron text-lg font-bold text-white mb-1">PROTOCOL ALPHA</h4>
                            <p className="text-xs text-purple-200 mb-3">Verify 5 Plinko seeds to earn the "Auditor" badge + 500 ZP.</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-purple-300 uppercase group-hover:text-white transition-colors">
                                Accept Mission <Icons.ArrowRight className="h-3 w-3" />
                            </div>
                         </div>
                         <Icons.Target className="absolute -bottom-4 -right-4 w-24 h-24 text-purple-500/10 group-hover:scale-110 transition-transform duration-500 rotate-12" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
