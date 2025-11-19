
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Icons } from '../components/icons';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { AppContext } from '../context/AppContext';

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
    founder: string;
    companySize: string;
    specialRanking?: 'ETERNAL CROWN' | 'ELITE TIER' | 'VETERAN';
    tags: string[];
    restricted: string[];
    chains: string[];
    languages: string[];
    kycLevel: 'NONE' | 'LOW' | 'HIGH';
    description: string;
    advisory: string;
    zeroEdge: boolean;
    features: {
        vpnFriendly: boolean;
        fiatOnramp: boolean;
        liveChat: boolean;
        mobileApp: boolean;
        p2pTransfer: boolean;
    };
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
        founder: 'Unknown (DAO)',
        companySize: '50-100',
        specialRanking: 'ETERNAL CROWN', 
        tags: ['Zero Edge', 'No KYC', 'PVP'], 
        restricted: ['USA', 'France'], 
        chains: ['BTC', 'ETH', 'LTC', 'SOL'],
        languages: ['English', 'Spanish', 'Portuguese', 'Japanese'],
        kycLevel: 'NONE',
        description: 'The new standard for PVP gaming. Built on high-frequency L2 rails for instant settlement. Zero-edge original games and massive rakeback rewards.',
        advisory: 'AUDIT PASSED 10/2025. Zero-Edge protocols verified on-chain.',
        zeroEdge: true,
        features: { vpnFriendly: true, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: true }
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
        founder: 'Eddie Miroslav',
        companySize: '500+',
        specialRanking: 'ELITE TIER', 
        tags: ['Sportsbook', 'Originals', 'High Limit'], 
        restricted: ['USA', 'UK', 'Australia'], 
        chains: ['BTC', 'ETH', 'LTC', 'DOGE', 'EOS'],
        languages: ['English', 'German', 'Spanish', 'French', 'Russian', 'Portuguese'],
        kycLevel: 'LOW',
        description: 'The industry titan. Unmatched liquidity, massive sports betting markets, and the original provably fair games that started the revolution.',
        advisory: 'STABLE OPERATION. High liquidity reserves confirmed.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: true }
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
        founder: 'Undisclosed',
        companySize: '10-50',
        tags: ['Telegram Auth', 'No KYC', 'Web3'], 
        restricted: ['USA', 'Netherlands'], 
        chains: ['TON', 'USDT', 'BTC'],
        languages: ['English', 'Russian'],
        kycLevel: 'NONE',
        description: 'Frictionless entry via Telegram. Whale.io specializes in high-roller action with absolute privacy and instant TON network settlements.',
        advisory: 'PRIVACY FOCUSED. No PII storage detected.',
        zeroEdge: false,
        features: { vpnFriendly: true, fiatOnramp: true, liveChat: true, mobileApp: true, p2pTransfer: false }
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
        founder: 'BlockDance B.V.',
        companySize: '200-500',
        tags: ['Huge Community', 'Rain', 'DeFi'], 
        restricted: ['USA', 'China'], 
        chains: ['BTC', 'ETH', 'BNB', 'SOL', 'TRX'],
        languages: ['English', 'Chinese', 'Spanish', 'French', 'German', 'Japanese'],
        kycLevel: 'LOW',
        description: 'A massive ecosystem of proprietary games and community features. BC.Game offers one of the most generous deposit match structures in the sector.',
        advisory: 'BONUS TERMS: Wager requirements apply to unlocked BCD.',
        zeroEdge: false,
        features: { vpnFriendly: true, fiatOnramp: true, liveChat: true, mobileApp: true, p2pTransfer: true }
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
        founder: 'Liquid Gaming N.V.',
        companySize: '50-200',
        tags: ['CS:GO Skins', 'PVP', 'Rewards'], 
        restricted: ['USA', 'Singapore'], 
        chains: ['BTC', 'ETH', 'LTC', 'CSGO'],
        languages: ['English', 'Spanish', 'German'],
        kycLevel: 'LOW',
        description: 'Bridging the gap between crypto and skin gambling. Known for its "Ace\'s Lounge" VIP program and instant crypto/skin withdrawals.',
        advisory: 'SKIN DEPOSITS: Valve trade hold times apply.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: true }
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
        founder: 'Felix Römer',
        companySize: '50-200',
        tags: ['Social', 'Rain', 'Skins'], 
        restricted: ['USA', 'UK'], 
        chains: ['BTC', 'ETH', 'LTC'],
        languages: ['English', 'Russian', 'Turkish'],
        kycLevel: 'LOW',
        description: 'A veteran platform with a unique social focus. Its "Rain" bot and chat features create a lively community atmosphere backed by solid tech.',
        advisory: 'SOCIAL FEATURES: Chat moderation is strict.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: true }
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
        founder: 'Original Games Group',
        companySize: '10-50',
        tags: ['Proprietary Games', 'Dividends'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH', 'TRX'],
        languages: ['English'],
        kycLevel: 'HIGH',
        description: 'Focuses on proprietary slot mechanics and a dividend-sharing token model. Slower withdrawals but high trust and unique content.',
        advisory: 'DIVIDENDS: Payouts depend on casino profit volume.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: false, liveChat: true, mobileApp: false, p2pTransfer: false }
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
        founder: 'Yolo Group',
        companySize: '500+',
        tags: ['Sports Focus', 'VIP'], 
        restricted: ['USA', 'Australia'], 
        chains: ['BTC', 'ETH', 'USDT'],
        languages: ['English', 'Portuguese', 'Spanish', 'Japanese'],
        kycLevel: 'HIGH',
        description: 'The premier destination for crypto sports betting. Official partner of major football clubs. Corporate-level reliability.',
        advisory: 'VERIFICATION: Mandatory for large sports wagers.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: true, liveChat: true, mobileApp: true, p2pTransfer: false }
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
        founder: 'Universe B Games',
        companySize: '100-200',
        tags: ['Dividend Token', 'Staking'], 
        restricted: ['USA'], 
        chains: ['BTC', 'BNB', 'TRX', 'USDT'],
        languages: ['English', 'Russian', 'Spanish'],
        kycLevel: 'LOW',
        description: 'Pioneered the "wager-to-mine" model. Holders of BFG tokens earn daily dividends from the casino\'s profit pool.',
        advisory: 'TOKENOMICS: Dividend rates fluctuate with pool volume.',
        zeroEdge: false,
        features: { vpnFriendly: true, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: true }
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
        founder: 'Bull Gaming',
        companySize: '50-200',
        tags: ['NFT', 'Crypto Futures', '1000x'], 
        restricted: ['USA', 'UK'], 
        chains: ['BTC', 'ETH', 'SOL', 'LTC'],
        languages: ['English'],
        kycLevel: 'LOW',
        description: 'A crypto-native powerhouse blending high-leverage trading, NFT loans, and casino games. High volatility, high reward.',
        advisory: 'FUTURES RISK: 1000x leverage involves extreme liquidation risk.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: true }
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
        founder: 'Rainbet Team',
        companySize: '10-50',
        tags: ['Streamer Fav', 'No KYC'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH', 'LTC'],
        languages: ['English'],
        kycLevel: 'NONE',
        description: 'Fast, focused, and streamer-friendly. Known for "Wager Wars" leaderboards and a clean, no-nonsense interface.',
        advisory: 'NO KYC: Limits apply to unverified high-volume accounts.',
        zeroEdge: false,
        features: { vpnFriendly: true, fiatOnramp: false, liveChat: true, mobileApp: false, p2pTransfer: false }
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
        founder: 'Goated DAO',
        companySize: '< 10',
        tags: ['New', 'Beta'], 
        restricted: ['Global'], 
        chains: ['SOL'],
        languages: ['English'],
        kycLevel: 'NONE',
        description: 'An upcoming Solana-based platform currently in closed beta. Promising roadmap but currently unproven at scale.',
        advisory: 'BETA STATUS: Expect bugs. Use burner wallets.',
        zeroEdge: false,
        features: { vpnFriendly: true, fiatOnramp: false, liveChat: false, mobileApp: false, p2pTransfer: false }
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
        founder: 'Noah',
        companySize: '50-100',
        tags: ['Tokenized', 'Airdrop'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH', 'USDC', 'TRX'],
        languages: ['English', 'Japanese'],
        kycLevel: 'LOW',
        description: 'Heavily integrated with its native SHFL token. Offers a sleek UI and aggressive rewards for active token holders.',
        advisory: 'TOKEN VOLATILITY: SHFL price impacts effective rakeback value.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: true }
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
        founder: 'Unknown',
        companySize: '10-50',
        tags: ['Sports'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH'],
        languages: ['English'],
        kycLevel: 'HIGH',
        description: 'A solid mid-tier option focusing on sports. Verification processes are stricter than average, leading to slower onboarding.',
        advisory: 'SLOW PAYOUTS: Manual review on withdrawals > $1k.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: false }
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
        founder: 'Razed Team',
        companySize: '10-50',
        tags: ['Mystery', 'New'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH', 'LTC'],
        languages: ['English', 'German'],
        kycLevel: 'LOW',
        description: 'Gamifies the reward experience with Mystery Boxes. Good UI, but relatively new with less history to audit.',
        advisory: 'NEW OPERATOR: Limited long-term solvency data.',
        zeroEdge: false,
        features: { vpnFriendly: true, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: false }
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
        founder: 'Raw Entertainment',
        companySize: '200-500',
        tags: ['Brand', 'Slots'], 
        restricted: ['USA', 'UK'], 
        chains: ['BTC', 'ETH', 'LTC'],
        languages: ['English', 'Spanish', 'Portuguese'],
        kycLevel: 'HIGH',
        description: 'Famous for high-profile partnerships (Snoop Dogg, UFC). Extremely polished but has strict KYC and region blocking.',
        advisory: 'GEO-RESTRICTION: Aggressive VPN detection active.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: false }
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
        founder: 'Anon',
        companySize: '< 5',
        tags: ['Degen', 'High Risk'], 
        restricted: ['None'], 
        chains: ['SOL'],
        languages: ['English'],
        kycLevel: 'NONE',
        description: 'Experimental high-risk platform on Solana. Very few protections, use extreme caution.',
        advisory: 'HIGH RISK: Unlicensed platform. Do not store funds.',
        zeroEdge: false,
        features: { vpnFriendly: true, fiatOnramp: false, liveChat: false, mobileApp: false, p2pTransfer: false }
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
        founder: 'Moon Team',
        companySize: '10-50',
        tags: ['PVP', 'Simple'], 
        restricted: ['USA'], 
        chains: ['ETH'],
        languages: ['English'],
        kycLevel: 'NONE',
        description: 'Simplified PVP games. No license, purely crypto-native. Good for quick games but lacks institutional trust.',
        advisory: 'UNREGULATED: No recourse for disputes.',
        zeroEdge: false,
        features: { vpnFriendly: true, fiatOnramp: false, liveChat: true, mobileApp: false, p2pTransfer: false }
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
        founder: 'Perfect Storm B.V.',
        companySize: '50-100',
        tags: ['Skins', 'Classics'], 
        restricted: ['USA'], 
        chains: ['BTC', 'ETH'],
        languages: ['English', 'Turkish', 'German', 'Russian', 'Spanish', 'Portuguese', 'Polish', 'Romanian', 'Danish'],
        kycLevel: 'HIGH',
        description: 'Formerly CSGO500. A classic skin gambling site that pivoted to crypto. Reliable but feels dated compared to new entrants.',
        advisory: 'LEGACY SYSTEM: Solid reliability, outdated UI.',
        zeroEdge: false,
        features: { vpnFriendly: false, fiatOnramp: true, liveChat: true, mobileApp: false, p2pTransfer: true }
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
        founder: 'Skel',
        companySize: '10-50',
        tags: ['Web3', 'NFT'], 
        restricted: ['USA'], 
        chains: ['ETH'],
        languages: ['English'],
        kycLevel: 'NONE',
        description: 'Web3-first platform. Connect wallet to play. Prizes are often NFTs. Smart contract based, but unregulated.',
        advisory: 'SMART CONTRACT RISK: Direct wallet interaction required.',
        zeroEdge: false,
        features: { vpnFriendly: true, fiatOnramp: false, liveChat: false, mobileApp: false, p2pTransfer: false }
    },
];

// --- COMPONENTS ---

const CasinoCard: React.FC<{ casino: Casino; onSelect: (c: Casino) => void; index: number }> = ({ casino, onSelect, index }) => {
    const isCrown = casino.specialRanking === 'ETERNAL CROWN';
    
    return (
        <div 
            onClick={() => onSelect(casino)}
            className={`group relative rounded-xl overflow-hidden cursor-pointer flex flex-col h-full animate-fade-up active:scale-[0.98] transition-all duration-300 hover:-translate-y-1`}
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
        >
            {/* Main Background with Gradient & Texture */}
            <div className="absolute inset-0 bg-[#080808]"></div>
            <div className={`absolute inset-0 bg-gradient-to-b ${isCrown ? 'from-neon-surge/10 to-black' : 'from-white/5 to-black'} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Animated Border/Glow */}
            <div className={`absolute inset-0 border ${isCrown ? 'border-neon-surge/30' : 'border-white/10'} rounded-xl group-hover:border-opacity-100 transition-all duration-500 z-10 pointer-events-none`}></div>
            <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent z-10`}></div>

            {/* Content Layer */}
            <div className="relative z-20 p-4 md:p-5 flex flex-col h-full">
                
                {/* Header: Logo & Score */}
                <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-black border ${isCrown ? 'border-neon-surge/50 shadow-[0_0_20px_rgba(0,255,192,0.15)]' : 'border-white/10'} p-1 relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                        <img src={casino.logo} alt={casino.name} className="w-full h-full object-cover rounded-lg" loading="lazy" />
                        {/* Shine effect on logo */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </div>
                    <div className="text-right">
                        <div className={`text-2xl md:text-3xl font-black font-orbitron tracking-tighter flex items-center justify-end gap-1 ${casino.rating >= 4.8 ? 'text-neon-surge drop-shadow-[0_0_8px_rgba(0,255,192,0.5)]' : 'text-white'}`}>
                            {casino.rating.toFixed(1)}
                        </div>
                        <div className="text-[8px] md:text-[9px] text-text-tertiary uppercase font-jetbrains-mono tracking-widest mt-1">Trust Score</div>
                    </div>
                </div>

                {/* Info Block */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-orbitron text-base md:text-lg font-bold text-white uppercase tracking-wide truncate group-hover:text-neon-surge transition-colors">{casino.name}</h3>
                        {isCrown && <Icons.Gem className="w-3 h-3 text-neon-surge animate-pulse" />}
                        {casino.status === 'VERIFIED' && !isCrown && <Icons.Verified className="w-3 h-3 text-blue-500" />}
                    </div>
                    
                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {casino.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-[4px] bg-white/5 text-zinc-400 uppercase border border-white/5 backdrop-blur-sm">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Data Grid */}
                    <div className="grid grid-cols-2 gap-px bg-white/5 rounded-lg overflow-hidden border border-white/5">
                        <div className="bg-black/80 p-2 backdrop-blur-md">
                            <span className="block text-[8px] text-text-tertiary uppercase font-jetbrains-mono mb-0.5">Bonus</span>
                            <span className="block text-[10px] text-white font-bold font-jetbrains-mono truncate">{casino.bonus}</span>
                        </div>
                        <div className="bg-black/80 p-2 backdrop-blur-md text-right">
                            <span className="block text-[8px] text-text-tertiary uppercase font-jetbrains-mono mb-0.5">Speed</span>
                            <span className="block text-[10px] text-neon-surge font-bold font-jetbrains-mono truncate">{casino.withdrawalSpeed}</span>
                        </div>
                    </div>
                </div>
                
                <div className="h-px w-full bg-white/5 my-4"></div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <Button 
                        variant="ghost" 
                        className="h-12 text-[10px] bg-white/5 hover:bg-white/10 text-white font-orbitron uppercase tracking-wider border border-white/10 rounded-lg"
                        onClick={(e) => { e.stopPropagation(); onSelect(casino); }}
                    >
                        INTEL
                    </Button>
                    <a 
                        href={`${casino.website}?ref=zapway`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center h-12 rounded-lg bg-neon-surge text-black text-[10px] font-bold font-orbitron uppercase tracking-wider hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
                    >
                        PLAY
                    </a>
                </div>
            </div>
        </div>
    );
};

const CasinoDetail: React.FC<{ casino: Casino; onBack: () => void }> = ({ casino, onBack }) => {
    const appContext = useContext(AppContext);
    const [activeTab, setActiveTab] = useState(0);
    const isVerified = casino.status === 'VERIFIED';
    
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

    return (
        <div className="min-h-screen bg-black text-white font-rajdhani pb-32 md:pb-12 relative">
             {/* Fixed Background */}
            <div className="fixed inset-0 pointer-events-none">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black"></div>
                 <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neon-surge/5 to-transparent opacity-30"></div>
            </div>

             {/* Sticky Context Bar - Precise Mobile Placement */}
             <div className="sticky top-[64px] z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 w-[calc(100%_+_2rem)] sm:w-[calc(100%_+_3rem)] lg:w-[calc(100%_+_4rem)] flex justify-between items-center h-12 shadow-lg animate-fade-in-up">
                 <button onClick={onBack} className="flex items-center gap-2 text-xs font-orbitron uppercase text-text-tertiary hover:text-neon-surge transition-colors group">
                     <Icons.ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return
                 </button>
                 <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold font-orbitron uppercase hidden sm:inline text-white">{casino.name}</span>
                     <div className={`px-2 py-0.5 rounded text-[9px] font-bold font-jetbrains-mono border ${isVerified ? 'bg-neon-surge/10 text-neon-surge border-neon-surge/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                         {isVerified ? 'VERIFIED NODE' : 'UNVERIFIED'}
                     </div>
                 </div>
             </div>
            
            {/* Cinematic Hero */}
            <div className="relative w-full overflow-hidden border-b border-white/10 bg-[#050505]">
                {/* Blurred Backdrop Image */}
                <div className="absolute inset-0 opacity-30 bg-cover bg-center blur-3xl scale-110" style={{ backgroundImage: `url(${casino.logo})` }}></div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-20 flex flex-col md:flex-row gap-6 md:gap-8 items-end">
                    <div className="w-24 h-24 md:w-40 md:h-40 rounded-2xl border border-white/10 bg-black p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-md">
                        <img src={casino.logo} alt="" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="flex-1 mb-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-7xl font-black font-orbitron uppercase tracking-tighter text-white leading-none shadow-black drop-shadow-lg">
                                {casino.name}
                            </h1>
                             {casino.specialRanking === 'ETERNAL CROWN' && <Icons.Gem className="w-5 h-5 md:w-8 md:h-8 text-neon-surge animate-pulse" />}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {casino.tags.map(t => <span key={t} className="text-[9px] font-bold uppercase bg-white/10 text-white px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">{t}</span>)}
                        </div>
                    </div>
                    <div className="mb-1 text-right hidden md:block">
                        <div className="flex items-end justify-end gap-2">
                            <span className="text-6xl font-black font-orbitron text-neon-surge tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,192,0.4)]">{casino.rating.toFixed(1)}</span>
                            <span className="text-2xl text-white/50 font-orbitron mb-2">/ 5.0</span>
                        </div>
                        <div className="text-xs font-jetbrains-mono text-text-tertiary uppercase tracking-widest mt-1">TRUST SCORE VERIFIED</div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                
                {/* Tabs - Optimized for Mobile */}
                <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 gap-6 md:gap-0">
                    {['INTEL', 'COMPLIANCE', 'VPR FEED'].map((tab, i) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(i)}
                            className={`px-2 md:px-8 py-4 text-xs font-bold font-orbitron uppercase tracking-widest border-b-2 transition-all whitespace-nowrap shrink-0 ${activeTab === i ? 'border-neon-surge text-neon-surge bg-neon-surge/5' : 'border-transparent text-text-tertiary hover:text-white hover:bg-white/5'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab 1: INTEL */}
                {activeTab === 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">
                            {/* Advisory */}
                            <div className={`p-5 border-l-4 rounded-r-lg backdrop-blur-md ${casino.status === 'VERIFIED' ? 'bg-neon-surge/5 border-neon-surge' : 'bg-yellow-500/5 border-yellow-500'}`}>
                                <h4 className={`text-xs font-bold uppercase font-orbitron mb-2 ${casino.status === 'VERIFIED' ? 'text-neon-surge' : 'text-yellow-500'}`}>OPERATOR ADVISORY // {casino.status}</h4>
                                <p className="text-sm text-white font-rajdhani leading-relaxed">{casino.advisory}</p>
                            </div>

                            {/* Description */}
                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-base md:text-lg font-bold text-white font-orbitron uppercase mb-4 flex items-center gap-2">
                                    <Icons.FileText className="text-neon-surge w-4 h-4 md:w-5 md:h-5" /> Tactical Overview
                                </h3>
                                <p className="text-text-secondary text-sm leading-loose font-medium border-l-2 border-white/10 pl-4">{casino.description}</p>
                            </div>

                            {/* Features Grid */}
                            <div>
                                <h3 className="text-base md:text-lg font-bold text-white font-orbitron uppercase mb-4 flex items-center gap-2">
                                    <Icons.Cpu className="text-blue-500 w-4 h-4 md:w-5 md:h-5" /> Platform Capabilities
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
                                    {Object.entries(casino.features).map(([key, val]) => (
                                        <div key={key} className="bg-black/80 p-4 flex items-center justify-between hover:bg-black/60 transition-colors">
                                            <span className="text-[10px] font-bold uppercase font-jetbrains-mono text-text-secondary">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            {val ? <Icons.CheckCircle className="w-4 h-4 text-neon-surge drop-shadow-[0_0_5px_rgba(0,255,192,0.5)]" /> : <Icons.X className="w-4 h-4 text-zinc-600" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Stats */}
                        <div className="space-y-6">
                             <div className="p-6 bg-gradient-to-br from-neon-surge/20 to-black border border-neon-surge/50 rounded-xl text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,192,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <p className="text-xs font-bold text-neon-surge uppercase font-orbitron mb-3 tracking-widest">Active Bounty</p>
                                <div className="text-2xl md:text-3xl font-black text-white font-orbitron mb-6 drop-shadow-lg truncate">{casino.bonus}</div>
                                <a href={`${casino.website}?ref=zapway`} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-neon-surge text-black font-bold uppercase font-orbitron text-xs rounded hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(0,255,192,0.4)]">
                                    Claim Reward
                                </a>
                            </div>

                            <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                                <h4 className="text-xs font-bold text-text-tertiary uppercase font-orbitron mb-6 tracking-widest">System Status</h4>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-text-secondary font-jetbrains-mono uppercase">Withdrawal Speed</span>
                                            <span className="text-xs font-bold text-neon-surge font-jetbrains-mono">{casino.withdrawalSpeed}</span>
                                        </div>
                                        <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-white/5">
                                            <div className="bg-neon-surge h-full w-[95%] shadow-[0_0_10px_#00FFC0]"></div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                        <div>
                                            <span className="text-[9px] text-text-tertiary block uppercase font-jetbrains-mono mb-1">Established</span>
                                            <span className="text-sm font-bold text-white font-orbitron">{casino.established}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] text-text-tertiary block uppercase font-jetbrains-mono mb-1">License</span>
                                            <span className="text-sm font-bold text-white font-orbitron">{casino.license}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Tab 2: Compliance */}
                {activeTab === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                         <div className="p-8 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center min-h-[240px] relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent z-0"></div>
                             <Icons.Lock className={`w-12 h-12 mb-6 relative z-10 ${casino.kycLevel === 'NONE' ? 'text-neon-surge' : 'text-yellow-500'}`} />
                             <div className="text-3xl font-black font-orbitron text-white mb-3 relative z-10">{casino.kycLevel} KYC</div>
                             <p className="text-sm text-text-secondary max-w-xs relative z-10 font-rajdhani">
                                {casino.kycLevel === 'NONE' ? 'No mandatory ID verification detected. Crypto-native privacy protocols active.' : 'Standard ID checks required for high-volume play/withdrawal.'}
                             </p>
                         </div>
                         <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
                             <h4 className="text-xs font-bold text-white uppercase font-orbitron mb-6 flex items-center gap-2">
                                <Icons.Globe className="text-red-400 w-4 h-4" /> Geo-Fenced Zones
                             </h4>
                             <div className="flex flex-wrap gap-2">
                                 {casino.restricted.map(r => (
                                     <span key={r} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-bold uppercase font-jetbrains-mono flex items-center gap-2">
                                         <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> {r}
                                     </span>
                                 ))}
                             </div>
                         </div>
                    </div>
                )}

                 {/* Tab 3: VPR */}
                {activeTab === 2 && (
                    <div className="animate-fadeIn">
                        <div className="bg-black border border-white/10 rounded-xl overflow-hidden font-jetbrains-mono text-xs shadow-2xl">
                            <div className="p-4 border-b border-white/10 bg-[#0a0a0a] flex justify-between items-center">
                                <span className="text-neon-surge flex items-center gap-2">
                                    <span className="w-2 h-2 bg-neon-surge rounded-full animate-pulse"></span>
                                    root@zap-node:~/vpr_logs# tail -f {casino.id}
                                </span>
                                <Button size="sm" className="h-8 text-[10px] bg-neon-surge text-black hover:bg-white border-none font-bold" onClick={() => appContext?.openReviewModal()}>ADD INTEL</Button>
                            </div>
                            <div className="p-6 space-y-3 text-text-secondary h-80 overflow-y-auto custom-scrollbar bg-black/50 backdrop-blur-sm">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="flex gap-4 border-b border-white/5 pb-3 last:border-0">
                                        <span className="text-zinc-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                        <span className={`font-bold shrink-0 ${i%2===0 ? 'text-neon-surge' : 'text-blue-400'}`}>{i%2===0 ? 'VERIFIED_PAYOUT' : 'GAME_AUDIT'}</span>
                                        <span className="text-zinc-400 truncate">Transaction confirmed on {casino.chains[0]} network. Block #{Math.floor(Math.random() * 1000000)}</span>
                                    </div>
                                ))}
                                <span className="animate-pulse text-neon-surge block mt-4">_</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Mobile Sticky Footer - Improved Visibility */}
             <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50 md:hidden flex gap-3 animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.9)] pb-[calc(1rem+env(safe-area-inset-bottom))]">
                 <div className="flex-1 min-w-0">
                     <p className="text-[9px] text-text-tertiary uppercase font-jetbrains-mono tracking-wider">Active Bonus</p>
                     <p className="text-sm font-bold text-white truncate font-orbitron">{casino.bonus}</p>
                 </div>
                 <a href={`${casino.website}?ref=zapway`} target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-neon-surge text-black font-bold font-orbitron uppercase text-xs rounded shadow-[0_0_15px_rgba(0,255,192,0.3)] flex items-center shrink-0 hover:bg-white transition-colors">
                     PLAY NOW
                 </a>
             </div>

        </div>
    );
};

// --- MAIN PAGE ---
const CasinoDirectoryPage: React.FC = () => {
    const [selectedCasinoId, setSelectedCasinoId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    
    const filteredCasinos = useMemo(() => {
        return CASINOS.filter(c => {
            if (!c.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (activeCategory === 'VERIFIED' && c.status !== 'VERIFIED') return false;
            if (activeCategory === 'NO_KYC' && c.kycLevel !== 'NONE') return false;
            return true;
        });
    }, [searchTerm, activeCategory]);

    if (selectedCasinoId) {
        const casino = CASINOS.find(c => c.id === selectedCasinoId);
        if (casino) return <CasinoDetail casino={casino} onBack={() => setSelectedCasinoId(null)} />;
    }

    return (
        <div className="min-h-screen bg-black animate-fadeIn pb-12 relative font-rajdhani">
             {/* Background Texture */}
             <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black z-0"></div>
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>

            {/* Hero Header */}
            <div className="relative pt-16 pb-10 px-4 md:px-8 z-10">
                 <div className="max-w-[1600px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                             <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-neon-surge/30 rounded-full bg-neon-surge/5 text-[10px] font-jetbrains-mono text-neon-surge uppercase tracking-widest backdrop-blur-sm">
                                <span className="w-1.5 h-1.5 bg-neon-surge rounded-full animate-pulse"></span>
                                Live Network Status
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white font-orbitron uppercase tracking-tighter leading-none drop-shadow-2xl">
                                Operator <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-surge to-white">Grid</span>
                            </h1>
                        </div>
                        
                        {/* Network Stats Monitor */}
                        <div className="flex gap-6 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                             <div className="bg-white/5 border border-white/5 p-3 rounded-lg backdrop-blur-md min-w-[100px] shrink-0">
                                 <p className="text-[9px] text-text-tertiary uppercase font-jetbrains-mono mb-1">Indexed Nodes</p>
                                 <p className="text-2xl font-bold text-white font-orbitron">{CASINOS.length}</p>
                             </div>
                             <div className="bg-white/5 border border-white/5 p-3 rounded-lg backdrop-blur-md min-w-[100px] shrink-0">
                                 <p className="text-[9px] text-text-tertiary uppercase font-jetbrains-mono mb-1">Verified</p>
                                 <p className="text-2xl font-bold text-neon-surge font-orbitron">85%</p>
                             </div>
                             <div className="bg-white/5 border border-white/5 p-3 rounded-lg backdrop-blur-md min-w-[100px] shrink-0">
                                 <p className="text-[9px] text-text-tertiary uppercase font-jetbrains-mono mb-1">24h Volume</p>
                                 <p className="text-2xl font-bold text-blue-500 font-orbitron">$42M</p>
                             </div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Edge-to-Edge Command Bar */}
            <div className="sticky top-[64px] z-30 bg-black/90 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 w-[calc(100%_+_2rem)] sm:w-[calc(100%_+_3rem)] lg:w-[calc(100%_+_4rem)] transition-all duration-200">
                <div className="max-w-[1600px] mx-auto py-3 flex gap-4 md:gap-6 items-center overflow-x-auto no-scrollbar">
                    <div className="relative shrink-0 w-56 md:w-72">
                        <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-neon-surge transition-colors" />
                        <input 
                            placeholder="SEARCH FREQUENCY..." 
                            className="w-full bg-white/5 border border-white/10 rounded-full h-12 pl-11 text-xs text-white focus:border-neon-surge focus:bg-white/10 outline-none font-jetbrains-mono transition-all placeholder:text-zinc-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="h-8 w-px bg-white/10 shrink-0"></div>
                    <div className="flex gap-2">
                        {['ALL', 'VERIFIED', 'NO_KYC', 'CRYPTO'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-full text-[10px] font-bold font-orbitron uppercase tracking-wider transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/30 hover:text-white'}`}
                            >
                                {cat.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="max-w-[1600px] mx-auto px-4 pt-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredCasinos.map((casino, i) => (
                        <CasinoCard 
                            key={casino.id} 
                            casino={casino} 
                            index={i} 
                            onSelect={(c) => setSelectedCasinoId(c.id)} 
                        />
                    ))}
                </div>
                 {filteredCasinos.length === 0 && (
                    <div className="text-center py-32 border border-dashed border-white/10 rounded-xl bg-white/5">
                        <Icons.Search className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500 font-orbitron uppercase text-sm tracking-widest">No Signals Detected</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default CasinoDirectoryPage;
