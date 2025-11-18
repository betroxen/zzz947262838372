
import React, { useState, useMemo } from 'react';
import { Icons } from '../components/icons';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Tabs } from '../components/Tabs';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';

// --- TYPES ---
interface Casino {
    id: string;
    name: string;
    website: string;
    logo: string;
    rating: number;
    status: 'VERIFIED' | 'UNVERIFIED';
    bonus: string;
    established: string;
    withdrawalSpeed: string;
    license: string;
    specialRanking?: 'ETERNAL CROWN' | 'ELITE TIER' | 'VETERAN';
    tags: string[];
    restricted: string[];
    chains: string[];
    kycLevel: 'NONE' | 'LOW' | 'HIGH';
    description: string;
}

// --- MOCK DATA ---
const CASINOS: Casino[] = [
    { 
        id: 'duel', 
        name: 'Duel', 
        website: 'https://duel.com', 
        logo: 'https://files.catbox.moe/p4z3v7.jpg', 
        rating: 5.0, 
        status: 'VERIFIED', 
        bonus: '50% Rakeback', 
        established: '2023', 
        withdrawalSpeed: 'Instant (L2)', 
        license: 'Curaçao', 
        specialRanking: 'ETERNAL CROWN', 
        tags: ['Zero Edge', 'No KYC', 'PVP'], 
        restricted: ['USA', 'France'], 
        chains: ['BTC', 'ETH', 'LTC', 'SOL'],
        kycLevel: 'NONE',
        description: 'The new standard for PVP gaming. Built on high-frequency L2 rails for instant settlement. Zero-edge original games and massive rakeback rewards.'
    },
    { 
        id: 'stake', 
        name: 'Stake', 
        website: 'https://stake.com', 
        logo: 'https://files.catbox.moe/klt24q.jpg', 
        rating: 4.9, 
        status: 'VERIFIED', 
        bonus: '$1000 Monthly', 
        established: '2017', 
        withdrawalSpeed: '< 10 Mins', 
        license: 'Curaçao', 
        specialRanking: 'ELITE TIER', 
        tags: ['Sportsbook', 'Originals', 'High Limit'], 
        restricted: ['USA', 'UK', 'Australia'], 
        chains: ['BTC', 'ETH', 'LTC', 'DOGE', 'EOS'],
        kycLevel: 'LOW',
        description: 'The industry titan. Unmatched liquidity, massive sports betting markets, and the original provably fair games that started the revolution.'
    },
    { 
        id: 'whale', 
        name: 'Whale.io', 
        website: 'https://whale.io', 
        logo: 'https://files.catbox.moe/7zy00k.jpg', 
        rating: 4.8, 
        status: 'VERIFIED', 
        bonus: '20% Cashback', 
        established: '2022', 
        withdrawalSpeed: 'Instant', 
        license: 'Anjouan', 
        tags: ['Telegram Auth', 'No KYC', 'Web3'], 
        restricted: ['USA', 'Netherlands'], 
        chains: ['TON', 'USDT', 'BTC'],
        kycLevel: 'NONE',
        description: 'Frictionless entry via Telegram. Whale.io specializes in high-roller action with absolute privacy and instant TON network settlements.'
    },
    { 
        id: 'bcgame', 
        name: 'BC.GAME', 
        website: 'https://bc.game', 
        logo: 'https://files.catbox.moe/810c57.jpg', 
        rating: 4.7, 
        status: 'VERIFIED', 
        bonus: '180% Deposit', 
        established: '2017', 
        withdrawalSpeed: '~1 Hour', 
        license: 'Curaçao', 
        tags: ['Huge Community', 'Rain', 'DeFi'], 
        restricted: ['USA', 'China'], 
        chains: ['BTC', 'ETH', 'BNB', 'SOL', 'TRX'],
        kycLevel: 'LOW',
        description: 'A massive ecosystem of proprietary games and community features. BC.Game offers one of the most generous deposit match structures in the sector.'
    },
    { 
        id: 'duelbits', 
        name: 'Duelbits', 
        website: 'https://duelbits.com', 
        logo: 'https://files.catbox.moe/e8i1og.jpg', 
        rating: 4.7, 
        status: 'VERIFIED', 
        bonus: '50% Rakeback', 
        established: '2020', 
        withdrawalSpeed: 'Instant', 
        license: 'Curaçao', 
        tags: ['CS:GO Skins', 'PVP', 'Rewards'], 
        restricted: ['USA', 'Singapore'], 
        chains: ['BTC', 'ETH', 'LTC', 'CSGO'],
        kycLevel: 'LOW',
        description: 'Bridging the gap between crypto and skin gambling. Known for its "Ace' + "'" + 's Lounge" VIP program and instant crypto/skin withdrawals.'
    },
    { 
        id: 'gamdom', 
        name: 'Gamdom', 
        website: 'https://gamdom.com', 
        logo: 'https://files.catbox.moe/jav4a4.jpg', 
        rating: 4.6, 
        status: 'VERIFIED', 
        bonus: '60% Rakeback', 
        established: '2016', 
        withdrawalSpeed: 'Instant', 
        license: 'Curaçao', 
        tags: ['Social', 'Rain', 'Skins'], 
        restricted: ['USA', 'UK'], 
        chains: ['BTC', 'ETH', 'LTC'],
        kycLevel: 'LOW',
        description: 'A veteran platform with a unique social focus. Its "Rain" bot and chat features create a lively community atmosphere backed by solid tech.'
    },
    { 
        id: 'chips', 
        name: 'Chips', 
        website: 'https://chips.com', 
        logo: 'https://files.catbox.moe/x0zu6m.jpg', 
        rating: 4.6, 
        status: 'VERIFIED', 
        bonus: '$50 Free Chip', 
        established: '2020', 
        withdrawalSpeed: '24 Hours', 
        license: 'Curaçao', 
        tags: ['Proprietary Games', 'Dividends'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH', 'TRX'],
        kycLevel: 'HIGH',
        description: 'Focuses on proprietary slot mechanics and a dividend-sharing token model. Slower withdrawals but high trust and unique content.'
    },
    { 
        id: 'sportsbet', 
        name: 'Sportsbet.io', 
        website: 'https://sportsbet.io', 
        logo: 'https://files.catbox.moe/v2jp51.jpg', 
        rating: 4.5, 
        status: 'VERIFIED', 
        bonus: 'Weekly Free Bet', 
        established: '2016', 
        withdrawalSpeed: '< 30 Mins', 
        license: 'Curaçao', 
        tags: ['Sports Focus', 'VIP'], 
        restricted: ['USA', 'Australia'], 
        chains: ['BTC', 'ETH', 'USDT'],
        kycLevel: 'HIGH',
        description: 'The premier destination for crypto sports betting. Official partner of major football clubs. Corporate-level reliability.'
    },
    { 
        id: 'betfury', 
        name: 'BetFury', 
        website: 'https://betfury.com', 
        logo: 'https://files.catbox.moe/tw3eoe.jpg', 
        rating: 4.5, 
        status: 'VERIFIED', 
        bonus: 'Staking APY', 
        established: '2019', 
        withdrawalSpeed: 'Instant', 
        license: 'Curaçao', 
        tags: ['Dividend Token', 'Staking'], 
        restricted: ['USA'], 
        chains: ['BTC', 'BNB', 'TRX', 'USDT'],
        kycLevel: 'LOW',
        description: 'Pioneered the "wager-to-mine" model. Holders of BFG tokens earn daily dividends from the casino\'s profit pool.'
    },
    { 
        id: 'rollbit', 
        name: 'Rollbit', 
        website: 'https://rollbit.com', 
        logo: 'https://files.catbox.moe/wpp3nk.jpg', 
        rating: 4.4, 
        status: 'VERIFIED', 
        bonus: 'RLB Airdrop', 
        established: '2020', 
        withdrawalSpeed: 'Instant', 
        license: 'Curaçao', 
        tags: ['NFT', 'Crypto Futures', '1000x'], 
        restricted: ['USA', 'UK'], 
        chains: ['BTC', 'ETH', 'SOL', 'LTC'],
        kycLevel: 'LOW',
        description: 'A crypto-native powerhouse blending high-leverage trading, NFT loans, and casino games. High volatility, high reward.'
    },
    { 
        id: 'rainbet', 
        name: 'Rainbet', 
        website: 'https://rainbet.com', 
        logo: 'https://files.catbox.moe/0jft4x.jpg', 
        rating: 4.4, 
        status: 'VERIFIED', 
        bonus: 'Wager Wars', 
        established: '2023', 
        withdrawalSpeed: 'Instant', 
        license: 'Curaçao', 
        tags: ['Streamer Fav', 'No KYC'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH', 'LTC'],
        kycLevel: 'NONE',
        description: 'Fast, focused, and streamer-friendly. Known for "Wager Wars" leaderboards and a clean, no-nonsense interface.'
    },
    { 
        id: 'goated', 
        name: 'Goated', 
        website: 'https://goated.com', 
        logo: 'https://files.catbox.moe/qp4oyy.jpg', 
        rating: 4.4, 
        status: 'UNVERIFIED', 
        bonus: 'Beta Access', 
        established: '2024', 
        withdrawalSpeed: 'Unknown', 
        license: 'Pending', 
        tags: ['New', 'Beta'], 
        restricted: ['Global'], 
        chains: ['SOL'],
        kycLevel: 'NONE',
        description: 'An upcoming Solana-based platform currently in closed beta. Promising roadmap but currently unproven at scale.'
    },
    { 
        id: 'shuffle', 
        name: 'Shuffle', 
        website: 'https://shuffle.com', 
        logo: 'https://files.catbox.moe/pkbfod.png', 
        rating: 4.3, 
        status: 'VERIFIED', 
        bonus: 'SHFL Airdrop', 
        established: '2023', 
        withdrawalSpeed: 'Instant', 
        license: 'Curaçao', 
        tags: ['Tokenized', 'Airdrop'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH', 'USDC', 'TRX'],
        kycLevel: 'LOW',
        description: 'Heavily integrated with its native SHFL token. Offers a sleek UI and aggressive rewards for active token holders.'
    },
    { 
        id: 'blockbet', 
        name: 'BlockBet', 
        website: 'https://blockbet.com', 
        logo: 'https://files.catbox.moe/e6i3yr.jpg', 
        rating: 4.3, 
        status: 'UNVERIFIED', 
        bonus: 'Deposit Match', 
        established: '2022', 
        withdrawalSpeed: '24-48h', 
        license: 'Curaçao', 
        tags: ['Sports'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH'],
        kycLevel: 'HIGH',
        description: 'A solid mid-tier option focusing on sports. Verification processes are stricter than average, leading to slower onboarding.'
    },
    { 
        id: 'razed', 
        name: 'Razed', 
        website: 'https://razed.com', 
        logo: 'https://files.catbox.moe/xvg0gy.jpg', 
        rating: 4.2, 
        status: 'UNVERIFIED', 
        bonus: 'Mystery Box', 
        established: '2023', 
        withdrawalSpeed: '< 1 Hour', 
        license: 'Curaçao', 
        tags: ['Mystery', 'New'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH', 'LTC'],
        kycLevel: 'LOW',
        description: 'Gamifies the reward experience with Mystery Boxes. Good UI, but relatively new with less history to audit.'
    },
    { 
        id: 'roobet', 
        name: 'Roobet', 
        website: 'https://roobet.com', 
        logo: 'https://files.catbox.moe/of4dut.jpg', 
        rating: 4.2, 
        status: 'VERIFIED', 
        bonus: 'Snoop Dogg', 
        established: '2019', 
        withdrawalSpeed: 'Instant', 
        license: 'Curaçao', 
        tags: ['Brand', 'Slots'], 
        restricted: ['USA', 'UK'], 
        chains: ['BTC', 'ETH', 'LTC'],
        kycLevel: 'HIGH',
        description: 'Famous for high-profile partnerships (Snoop Dogg, UFC). Extremely polished but has strict KYC and region blocking.'
    },
    { 
        id: 'yeet', 
        name: 'Yeet', 
        website: 'https://yeet.com', 
        logo: 'https://files.catbox.moe/6kol09.jpg', 
        rating: 4.1, 
        status: 'UNVERIFIED', 
        bonus: 'Unknown', 
        established: '2024', 
        withdrawalSpeed: 'Unknown', 
        license: 'None', 
        tags: ['Degen', 'High Risk'], 
        restricted: ['None'], 
        chains: ['SOL'],
        kycLevel: 'NONE',
        description: 'Experimental high-risk platform on Solana. Very few protections, use extreme caution.'
    },
    { 
        id: 'moonroll', 
        name: 'Moonroll', 
        website: 'https://moonroll.com', 
        logo: 'https://files.catbox.moe/n7pja5.jpg', 
        rating: 4.1, 
        status: 'UNVERIFIED', 
        bonus: 'Faucet', 
        established: '2023', 
        withdrawalSpeed: 'Instant', 
        license: 'None', 
        tags: ['PVP', 'Simple'], 
        restricted: ['USA'], 
        chains: ['ETH'],
        kycLevel: 'NONE',
        description: 'Simplified PVP games. No license, purely crypto-native. Good for quick games but lacks institutional trust.'
    },
    { 
        id: '500casino', 
        name: '500 Casino', 
        website: 'https://500casino.com', 
        logo: 'https://files.catbox.moe/da6qov.jpg', 
        rating: 4.0, 
        status: 'VERIFIED', 
        bonus: 'XP Rewards', 
        established: '2016', 
        withdrawalSpeed: 'Instant', 
        license: 'Curaçao', 
        tags: ['Skins', 'Classics'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH'],
        kycLevel: 'HIGH',
        description: 'Formerly CSGO500. A classic skin gambling site that pivoted to crypto. Reliable but feels dated compared to new entrants.'
    },
    { 
        id: 'metawin', 
        name: 'MetaWin', 
        website: 'https://metawin.com', 
        logo: 'https://files.catbox.moe/yr8ksr.jpg', 
        rating: 3.9, 
        status: 'UNVERIFIED', 
        bonus: 'NFT Prizes', 
        established: '2022', 
        withdrawalSpeed: 'Instant', 
        license: 'Unregulated', 
        tags: ['Web3', 'NFT'], 
        restricted: ['USA'], 
        chains: ['ETH'],
        kycLevel: 'NONE',
        description: 'Web3-first platform. Connect wallet to play. Prizes are often NFTs. Smart contract based, but unregulated.'
    },
];

// --- COMPONENTS ---

const CasinoCard: React.FC<{ casino: Casino; onSelect: (c: Casino) => void }> = ({ casino, onSelect }) => {
    const isCrown = casino.specialRanking === 'ETERNAL CROWN';
    const isVerified = casino.status === 'VERIFIED';
    
    // Dynamic border color based on rank/status
    const borderClass = isCrown ? 'border-neon-surge' : 
                        casino.specialRanking === 'ELITE TIER' ? 'border-purple-500' :
                        'border-[#333]';
    
    const shadowClass = isCrown ? 'shadow-[0_0_20px_rgba(0,255,192,0.2)]' : 
                        casino.specialRanking === 'ELITE TIER' ? 'shadow-[0_0_15px_rgba(168,85,247,0.2)]' : '';

    return (
        <div 
            onClick={() => onSelect(casino)}
            className={`group relative bg-[#0c0c0e] border ${borderClass} ${shadowClass} hover:border-white/40 hover:shadow-2xl rounded-2xl p-0 flex flex-col transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 md:hover:-translate-y-2 h-full active:scale-[0.98]`}
        >
            {/* Background Mesh & Scanline */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none bg-[radial-gradient(#00FFC0_1px,transparent_1px)] [background-size:16px_16px] transition-opacity duration-500"></div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/80 z-10"></div>

            {/* Top Section: Logo & Status */}
            <div className="p-4 md:p-5 relative z-20">
                <div className="flex justify-between items-start">
                     <div className="relative">
                        <img 
                            src={casino.logo} 
                            alt={casino.name} 
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover bg-[#000] border-2 ${isCrown ? 'border-neon-surge' : 'border-[#222]'}`}
                            loading="lazy"
                        />
                        {isVerified && (
                            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-[#0c0c0e] rounded-full p-1 border border-[#333]" title="Verified Operator">
                                <Icons.Verified className="w-3 h-3 md:w-4 md:h-4 text-neon-surge" />
                            </div>
                        )}
                    </div>
                    
                    <div className="text-right">
                         <div className={`font-orbitron text-xl md:text-2xl font-bold ${casino.rating >= 4.5 ? 'text-neon-surge text-glow' : 'text-white'}`}>
                            {casino.rating.toFixed(1)}
                        </div>
                        <div className="flex gap-0.5 justify-end mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Icons.Star key={i} className={`w-2.5 h-2.5 md:w-3 md:h-3 ${i < Math.floor(casino.rating) ? 'fill-neon-surge text-neon-surge' : 'text-[#333]'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-3 md:mt-4">
                    <h3 className="font-orbitron text-base md:text-lg font-bold text-white uppercase tracking-wide group-hover:text-neon-surge transition-colors">{casino.name}</h3>
                     {casino.specialRanking && (
                        <span className={`text-[9px] md:text-[10px] font-jetbrains-mono uppercase tracking-wider font-bold ${isCrown ? 'text-neon-surge' : 'text-purple-400'}`}>
                            // {casino.specialRanking}
                        </span>
                    )}
                </div>
            </div>

            {/* Mid Section: Tags */}
            <div className="px-4 md:px-5 mb-3 md:mb-4 flex flex-wrap gap-2 relative z-20">
                 {casino.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] md:text-[10px] font-jetbrains-mono uppercase px-1.5 py-0.5 md:px-2 md:py-1 rounded bg-[#1a1a1a] text-text-secondary border border-[#333]">
                        {tag}
                    </span>
                ))}
            </div>

            {/* Bottom Section: Metrics */}
            <div className="mt-auto bg-[#111] border-t border-[#222] p-3 md:p-4 grid grid-cols-2 gap-2 md:gap-4 relative z-20">
                <div>
                    <p className="text-[9px] md:text-[10px] text-text-tertiary font-jetbrains-mono uppercase mb-0.5">Welcome Bonus</p>
                    <p className="text-[11px] md:text-xs font-bold text-white truncate" title={casino.bonus}>{casino.bonus}</p>
                </div>
                <div className="text-right">
                     <p className="text-[9px] md:text-[10px] text-text-tertiary font-jetbrains-mono uppercase mb-0.5">Withdrawal</p>
                    <p className={`text-[11px] md:text-xs font-bold ${casino.withdrawalSpeed.includes('Instant') ? 'text-neon-surge' : 'text-white'}`}>{casino.withdrawalSpeed}</p>
                </div>
            </div>

             {/* Hover Action Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-neon-surge transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-30"></div>
        </div>
    );
};

const CasinoDetail: React.FC<{ casino: Casino; onBack: () => void }> = ({ casino, onBack }) => {
    const isVerified = casino.status === 'VERIFIED';

    return (
        <div className="animate-fadeIn pb-24 md:pb-0">
            {/* Navigation */}
            <button onClick={onBack} className="flex items-center gap-2 text-text-tertiary hover:text-neon-surge transition-colors mb-6 font-jetbrains-mono text-xs uppercase tracking-widest group">
                <Icons.ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return to Grid
            </button>

            {/* Hero Header */}
            <div className="relative rounded-3xl border border-[#333] bg-[#0c0c0e] overflow-hidden mb-8 shadow-2xl">
                {/* Background Blur */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-neon-surge/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
                
                <div className="p-5 md:p-10 flex flex-col lg:flex-row gap-6 md:gap-8 items-start lg:items-center relative z-10">
                    
                    {/* Mobile: Combined Header Row */}
                    <div className="flex flex-row lg:flex-col gap-4 md:gap-0 w-full lg:w-auto items-center lg:items-start">
                        <div className="relative shrink-0">
                            <img 
                                src={casino.logo} 
                                alt={casino.name} 
                                className="w-20 h-20 md:w-32 md:h-32 rounded-2xl border-4 border-[#1a1a1a] shadow-2xl bg-black object-cover"
                            />
                            {casino.specialRanking === 'ETERNAL CROWN' && (
                                <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-black text-neon-surge p-1.5 md:p-2 rounded-full border border-neon-surge shadow-neon-glow-md">
                                    <Icons.Gem className="w-4 h-4 md:w-6 md:h-6" />
                                </div>
                            )}
                        </div>
                        
                        {/* Mobile Title & Verified Block (Hidden on Desktop) */}
                        <div className="flex-1 lg:hidden">
                             <h1 className="font-orbitron text-2xl font-black text-white uppercase tracking-tight mb-1">{casino.name}</h1>
                             {isVerified && (
                                <span className="text-neon-surge text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                    <Icons.Verified className="w-3 h-3" /> Verified
                                </span>
                            )}
                            <div className="flex items-center gap-1 mt-2">
                                 <span className="text-neon-surge font-bold font-orbitron text-lg">{casino.rating}</span>
                                 <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Icons.Star key={i} className={`w-3 h-3 ${i < Math.floor(casino.rating) ? 'fill-neon-surge text-neon-surge' : 'text-[#444]'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-3 w-full">
                        {/* Desktop Title Block (Hidden on Mobile) */}
                        <div className="hidden lg:flex flex-wrap items-center gap-4">
                            <h1 className="font-orbitron text-4xl md:text-6xl font-black text-white uppercase tracking-tight">{casino.name}</h1>
                            {isVerified ? (
                                <span className="bg-neon-surge/10 text-neon-surge border border-neon-surge/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Icons.Verified className="w-4 h-4" /> Verified Operator
                                </span>
                            ) : (
                                <span className="bg-warning-high/10 text-warning-high border border-warning-high/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Icons.AlertTriangle className="w-4 h-4" /> Unverified
                                </span>
                            )}
                        </div>
                        
                        <p className="text-text-secondary font-rajdhani text-sm md:text-lg max-w-2xl leading-relaxed">
                            {casino.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                            {casino.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded bg-[#1a1a1a] border border-[#333] text-[10px] md:text-xs text-text-tertiary font-jetbrains-mono uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Desktop CTA Card (Hidden on Mobile) */}
                    <div className="hidden lg:flex w-full lg:w-auto bg-[#14131c]/50 p-6 rounded-2xl border border-[#333] flex-col items-center justify-center min-w-[200px] backdrop-blur-sm">
                        <div className="text-center mb-4">
                             <div className="text-5xl font-orbitron font-bold text-neon-surge text-glow mb-1">{casino.rating}</div>
                             <div className="flex justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Icons.Star key={i} className={`w-4 h-4 ${i < Math.floor(casino.rating) ? 'fill-neon-surge text-neon-surge' : 'text-[#444]'}`} />
                                ))}
                            </div>
                            <div className="text-[10px] font-jetbrains-mono text-text-tertiary uppercase tracking-widest">ZAP TRUST SCORE</div>
                        </div>
                        <a 
                            href={`${casino.website}?ref=zapway`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full bg-neon-surge text-black font-bold py-3 px-6 rounded-lg text-sm uppercase hover:bg-white transition-all duration-300 font-orbitron shadow-neon-glow-md text-center hover:scale-[1.02]"
                        >
                            Access Terminal
                        </a>
                    </div>
                </div>
                
                {/* Status Bar */}
                <div className="border-t border-[#333] bg-[#111] px-4 md:px-6 py-3 flex flex-wrap gap-4 md:gap-6 text-[10px] md:text-xs font-jetbrains-mono text-text-tertiary">
                     <span className="flex items-center gap-2">
                        <Icons.Activity className="w-3 h-3 md:w-4 md:h-4 text-neon-surge" /> Status: <span className="text-white">ONLINE</span>
                     </span>
                     <span className="flex items-center gap-2">
                        <Icons.Shield className="w-3 h-3 md:w-4 md:h-4 text-blue-500" /> License: <span className="text-white">{casino.license}</span>
                     </span>
                     <span className="flex items-center gap-2">
                        <Icons.Clock className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" /> Est: <span className="text-white">{casino.established}</span>
                     </span>
                </div>
            </div>

            {/* Intel Tabs */}
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2 no-scrollbar">
                <Tabs tabs={['OPERATIONAL INTEL', 'KYC & COMPLIANCE', 'COMMUNITY VPR']}>
                    {/* Tab 1: Operational Intel */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="p-6 bg-[#14131c] border-[#333]">
                                <h3 className="font-orbitron text-lg text-white uppercase mb-6 border-b border-[#333] pb-4 flex items-center gap-2">
                                    <Icons.Zap className="w-5 h-5 text-neon-surge" /> Performance Metrics
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono uppercase mb-2">Withdrawal Speed</p>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xl font-bold text-white font-orbitron">{casino.withdrawalSpeed}</span>
                                        </div>
                                        <ProgressBar progress={casino.withdrawalSpeed.includes('Instant') ? 98 : 70} className="h-1.5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-tertiary font-jetbrains-mono uppercase mb-2">RTP Verification</p>
                                         <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xl font-bold text-white font-orbitron">98.5%</span>
                                        </div>
                                        <ProgressBar progress={98.5} className="h-1.5" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 bg-[#14131c] border-[#333]">
                                 <h3 className="font-orbitron text-lg text-white uppercase mb-6 border-b border-[#333] pb-4 flex items-center gap-2">
                                    <Icons.Wallet className="w-5 h-5 text-neon-surge" /> Financial Rails
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-text-tertiary mb-3 font-jetbrains-mono uppercase">SUPPORTED CHAINS</p>
                                        <div className="flex flex-wrap gap-2">
                                            {casino.chains.map(chain => (
                                                <span key={chain} className="px-4 py-2 bg-[#0c0c0e] border border-[#333] rounded text-sm text-white font-bold font-jetbrains-mono hover:border-neon-surge/50 transition-colors cursor-default">
                                                    {chain}
                                                </span>
                                            ))}
                                            <span className="px-4 py-2 bg-[#0c0c0e] border border-[#333] rounded text-sm text-text-tertiary font-jetbrains-mono italic">
                                                + 12 Others
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-tertiary mb-3 font-jetbrains-mono uppercase">FIAT GATEWAYS</p>
                                        <div className="flex items-center gap-4 text-sm text-text-secondary font-rajdhani">
                                            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> MoonPay</span>
                                            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Banxa</span>
                                            <span className="flex items-center gap-2"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Direct Bank Transfer</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                             <div className="p-6 bg-gradient-to-br from-neon-surge/10 to-black border border-neon-surge/30 rounded-xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="font-orbitron text-lg text-white uppercase mb-2">Active Bounty</h3>
                                    <p className="text-3xl font-black text-neon-surge font-orbitron mb-1">{casino.bonus}</p>
                                    <p className="text-xs text-text-secondary font-jetbrains-mono mb-6">Exclusive to ZAP Operators.</p>
                                    <Button className="w-full uppercase tracking-widest font-bold shadow-neon-glow-sm">
                                        Claim Bonus
                                    </Button>
                                </div>
                                <Icons.Gift className="absolute -bottom-6 -right-6 w-32 h-32 text-neon-surge/10 group-hover:scale-110 transition-transform duration-500 rotate-12" />
                            </div>

                            <div className="p-6 bg-[#14131c] border border-[#333] rounded-xl">
                                 <h4 className="font-orbitron text-sm text-white uppercase mb-4 border-b border-[#333] pb-2">Platform Features</h4>
                                 <ul className="space-y-3 text-sm text-text-secondary font-rajdhani">
                                    <li className="flex items-center gap-3">
                                        <Icons.CheckCircle className="w-4 h-4 text-neon-surge" /> 24/7 Live Support
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icons.CheckCircle className="w-4 h-4 text-neon-surge" /> Provably Fair Originals
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icons.CheckCircle className="w-4 h-4 text-neon-surge" /> VIP Rakeback System
                                    </li>
                                    <li className="flex items-center gap-3">
                                        {casino.tags.includes('No KYC') ? <Icons.CheckCircle className="w-4 h-4 text-neon-surge" /> : <Icons.X className="w-4 h-4 text-text-tertiary" />} Anonymous Play
                                    </li>
                                 </ul>
                            </div>
                        </div>
                    </div>

                    {/* Tab 2: KYC & Compliance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className={`p-6 rounded-xl border ${casino.kycLevel === 'NONE' ? 'bg-neon-surge/5 border-neon-surge/30' : casino.kycLevel === 'LOW' ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-warning-high/5 border-warning-high/30'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <Icons.Lock className={`w-8 h-8 ${casino.kycLevel === 'NONE' ? 'text-neon-surge' : casino.kycLevel === 'LOW' ? 'text-yellow-500' : 'text-warning-high'}`} />
                                    <div>
                                        <h3 className="font-orbitron text-lg text-white uppercase">KYC FRICTION LEVEL</h3>
                                        <p className={`font-jetbrains-mono text-sm font-bold ${casino.kycLevel === 'NONE' ? 'text-neon-surge' : casino.kycLevel === 'LOW' ? 'text-yellow-500' : 'text-warning-high'}`}>
                                            RATING: {casino.kycLevel}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary font-rajdhani leading-relaxed">
                                    {casino.kycLevel === 'NONE' && "This operator supports No-KYC gameplay for crypto deposits. Email verification only. High privacy."}
                                    {casino.kycLevel === 'LOW' && "Soft KYC triggers may apply for high-volume withdrawals or suspicious activity. Generally friction-free for small to mid-sized players."}
                                    {casino.kycLevel === 'HIGH' && "Mandatory ID verification upon withdrawal or deposit thresholds. Expect full documentation requirements."}
                                </p>
                            </div>

                            <Card className="p-6 bg-[#14131c] border-[#333]">
                                 <h3 className="font-orbitron text-lg text-white uppercase mb-4">COMPLIANCE LOG</h3>
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-[#0c0c0e] rounded border border-[#333]">
                                        <span className="text-sm text-text-tertiary font-jetbrains-mono">VPN POLICY</span>
                                        <span className="text-yellow-500 text-xs font-bold uppercase border border-yellow-500/30 px-2 py-0.5 rounded">TOLERATED (UNOFFICIAL)</span>
                                    </div>
                                     <div className="flex items-center justify-between p-3 bg-[#0c0c0e] rounded border border-[#333]">
                                        <span className="text-sm text-text-tertiary font-jetbrains-mono">AML TRIGGER</span>
                                        <span className="text-white text-xs font-bold uppercase border border-[#333] px-2 py-0.5 rounded">>$2,000 / DAY</span>
                                    </div>
                                 </div>
                            </Card>
                        </div>

                        <div className="p-6 bg-warning-high/10 border border-warning-high/30 rounded-xl flex items-start gap-4 h-fit">
                            <Icons.AlertTriangle className="w-8 h-8 text-warning-high shrink-0 mt-1" />
                            <div>
                                <h3 className="font-orbitron text-lg text-white uppercase mb-2">RESTRICTED ZONES</h3>
                                <p className="text-text-secondary text-sm font-rajdhani mb-4">
                                    Access from the following jurisdictions is technically blocked. Attempting to bypass via VPN may lead to fund seizure.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {casino.restricted.map(country => (
                                        <span key={country} className="text-xs font-bold text-warning-high bg-black/40 px-3 py-1 rounded uppercase border border-warning-high/20 font-jetbrains-mono">
                                            {country}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab 3: VPR Feed */}
                    <div className="space-y-4">
                         <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-center justify-between">
                            <p className="text-blue-400 text-sm font-jetbrains-mono uppercase flex items-center gap-2">
                                <Icons.Activity className="w-4 h-4 animate-pulse" /> 
                                LIVE VPR FEED: {casino.name.toUpperCase()}
                            </p>
                            <span className="text-[10px] text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded font-jetbrains-mono">NETWORK SYNCED</span>
                        </div>
                        
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="p-4 bg-[#14131c] border border-[#333] rounded-lg flex gap-4 items-start hover:bg-[#1a1a24] transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center border border-[#333] shrink-0">
                                    <Icons.User className="w-5 h-5 text-text-tertiary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex gap-2 items-center mb-1">
                                        <span className="font-orbitron text-sm text-white font-bold">Operator_{9000+i}</span>
                                        {i % 2 === 0 ? (
                                            <span className="text-[10px] font-jetbrains-mono text-neon-surge border border-neon-surge/30 px-1.5 py-0.5 rounded uppercase">Verified Cashout</span>
                                        ) : (
                                            <span className="text-[10px] font-jetbrains-mono text-purple-400 border border-purple-400/30 px-1.5 py-0.5 rounded uppercase">Audit Confirmed</span>
                                        )}
                                        <span className="text-[10px] text-text-tertiary ml-auto font-jetbrains-mono">{i*12 + 5}m ago</span>
                                    </div>
                                    <p className="text-xs text-text-secondary font-rajdhani leading-relaxed">
                                        {i % 2 === 0 
                                            ? `Withdrawal of ${(Math.random() * 0.5 + 0.01).toFixed(4)} BTC processed in ${Math.floor(Math.random() * 20) + 2} minutes. TxID confirmed on-chain.`
                                            : `Game round #${Math.floor(Math.random() * 9999999)} verified via Provably Fair verifier. Client seed matched.`
                                        }
                                    </p>
                                </div>
                            </div>
                        ))}

                        <Button variant="ghost" className="w-full text-xs font-orbitron uppercase tracking-widest border border-[#333] hover:border-neon-surge h-12">
                            Load Historical Reports
                        </Button>
                    </div>
                </Tabs>
            </div>

            {/* Mobile Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0c0c0e]/95 backdrop-blur-xl border-t border-[#333] z-50 md:hidden flex gap-3 items-center animate-slide-up shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-text-tertiary font-jetbrains-mono uppercase tracking-wider mb-0.5">Active Bonus</p>
                    <p className="text-neon-surge font-bold font-orbitron text-sm truncate">{casino.bonus}</p>
                </div>
                <a
                    href={`${casino.website}?ref=zapway`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neon-surge text-black font-bold py-3 px-5 rounded-lg text-xs uppercase font-orbitron shadow-neon-glow-sm active:scale-95 transition-transform"
                >
                    Access Terminal
                </a>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const CasinoDirectoryPage: React.FC = () => {
    const [selectedCasinoId, setSelectedCasinoId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<'ALL' | 'VERIFIED' | 'NO_KYC' | 'US_ALLOWED' | 'CRYPTO'>('ALL');
    const [sortType, setSortType] = useState<'RATING' | 'NEWEST' | 'SPEED'>('RATING');

    const selectedCasino = useMemo(() => 
        CASINOS.find(c => c.id === selectedCasinoId), 
    [selectedCasinoId]);

    const filteredCasinos = useMemo(() => {
        let filtered = CASINOS.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
            
            if (!matchesSearch) return false;

            if (activeCategory === 'VERIFIED') return c.status === 'VERIFIED';
            if (activeCategory === 'NO_KYC') return c.kycLevel === 'NONE' || c.tags.includes('No KYC');
            if (activeCategory === 'US_ALLOWED') return !c.restricted.includes('USA');
            if (activeCategory === 'CRYPTO') return true; // All mock data is crypto
            
            return true;
        });

        if (sortType === 'RATING') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortType === 'NEWEST') {
            filtered.sort((a, b) => parseInt(b.established) - parseInt(a.established));
        } else if (sortType === 'SPEED') {
            // Primitive sort for "Instant" speed
            filtered.sort((a, b) => (b.withdrawalSpeed.includes('Instant') ? 1 : 0) - (a.withdrawalSpeed.includes('Instant') ? 1 : 0));
        }
        return filtered;
    }, [searchTerm, activeCategory, sortType]);

    if (selectedCasino) {
        return <CasinoDetail casino={selectedCasino} onBack={() => setSelectedCasinoId(null)} />;
    }

    return (
        <div className="animate-fadeIn max-w-[1600px] mx-auto">
            <header className="mb-8 md:mb-12 text-center max-w-4xl mx-auto pt-4 md:pt-0">
                <div className="inline-flex items-center gap-3 px-3 py-1 md:px-4 md:py-1.5 border border-neon-surge/30 rounded-full bg-neon-surge/5 mb-4 md:mb-6 backdrop-blur-sm">
                    <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-surge opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-neon-surge"></span>
                    </span>
                    <span className="text-[10px] md:text-xs font-orbitron text-neon-surge uppercase tracking-[0.2em] font-bold">Database Online v2.4</span>
                </div>
                <h1 className="font-orbitron text-3xl md:text-6xl font-black text-white uppercase tracking-tight mb-4 md:mb-6">
                    OPERATOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-surge to-[#00cc99] text-glow">GRID</span>
                </h1>
                <p className="text-text-secondary font-rajdhani text-base md:text-xl leading-relaxed max-w-2xl mx-auto px-4 md:px-0">
                    The definitive, vetted database of gaming protocols. Filter by reputation, speed, and compliance status. Trust the code, not the marketing.
                </p>
            </header>

            {/* Filter Bar */}
            <div className="sticky top-16 z-30 mb-6 md:mb-8 bg-[#050505]/95 backdrop-blur-md border-y border-[#222] py-3 md:py-4 -mx-4 px-4 md:mx-0 md:px-4 md:rounded-xl md:border shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    
                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary h-4 w-4" />
                        <Input 
                            placeholder="SEARCH PROTOCOLS..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-[#111] border-[#333] focus:border-neon-surge h-10 text-xs font-jetbrains-mono w-full"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar w-full md:w-auto">
                        {[
                            { id: 'ALL', label: 'ALL NODES' },
                            { id: 'VERIFIED', label: 'VERIFIED' },
                            { id: 'NO_KYC', label: 'NO KYC' },
                            { id: 'US_ALLOWED', label: 'US ACCESS' },
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as any)}
                                className={`whitespace-nowrap px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold font-orbitron uppercase tracking-wider border transition-all ${activeCategory === cat.id ? 'bg-neon-surge text-black border-neon-surge shadow-[0_0_15px_rgba(0,255,192,0.4)]' : 'bg-[#111] text-text-tertiary border-[#333] hover:border-white/30 hover:text-white'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="flex gap-2 shrink-0 w-full md:w-auto">
                        <select 
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value as any)}
                            className="h-10 bg-[#111] border border-[#333] rounded-lg text-xs font-jetbrains-mono text-white px-3 focus:border-neon-surge outline-none cursor-pointer w-full md:w-auto"
                        >
                            <option value="RATING">SORT: RATING</option>
                            <option value="NEWEST">SORT: NEWEST</option>
                            <option value="SPEED">SORT: FASTEST PAYOUT</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-2 md:px-0">
                {filteredCasinos.map(casino => (
                    <CasinoCard 
                        key={casino.id} 
                        casino={casino} 
                        onSelect={(c) => setSelectedCasinoId(c.id)} 
                    />
                ))}
            </div>

            {filteredCasinos.length === 0 && (
                <div className="text-center py-32 border border-dashed border-[#333] rounded-xl bg-[#0c0c0e]">
                    <Icons.Search className="w-16 h-16 mx-auto mb-6 text-[#222]" />
                    <p className="font-orbitron uppercase text-lg text-text-tertiary">NO SIGNAL DETECTED</p>
                    <p className="text-sm font-jetbrains-mono text-[#444] mt-2">Adjust search vectors to re-acquire targets.</p>
                </div>
            )}
        </div>
    );
};

export default CasinoDirectoryPage;
