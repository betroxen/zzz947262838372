import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Icons } from '../components/icons';
import { Tabs } from '../components/Tabs';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { generateMines, generateServerSeed, sha512 } from '../lib/crypto';
import { ToastContext } from '../context/ToastContext';

// --- Helper Functions & Constants ---
const GRID_SIZE = 25;
const HOUSE_EDGE = 0.99; // 1% house edge

const combinations = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) res = (res * (n - i + 1)) / i;
  return res;
};

const calculateMultiplier = (mines: number, revealed: number): number => {
  if (revealed === 0) return 1.0;
  const multiplier = (HOUSE_EDGE * combinations(GRID_SIZE, revealed)) / combinations(GRID_SIZE - mines, revealed);
  return multiplier;
};

type Tile = { isMine: boolean; isRevealed: boolean; };
type GameState = 'idle' | 'in_progress' | 'busted';

const MinesGamePage: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [betAmount, setBetAmount] = useState(10.0);
    const [minesCount, setMinesCount] = useState(5);
    const [grid, setGrid] = useState<Tile[]>(() => Array(GRID_SIZE).fill({ isMine: false, isRevealed: false }));
    const [gameHistory, setGameHistory] = useState<any[]>([]);
    const toastContext = useContext(ToastContext);

    // --- Provably Fair State ---
    const [clientSeed, setClientSeed] = useState('zap-player-default-seed');
    const [serverSeed, setServerSeed] = useState(() => generateServerSeed());
    const [hashedServerSeed, setHashedServerSeed] = useState(() => sha512(serverSeed));
    const [nonce, setNonce] = useState(1);

    const revealedCount = useMemo(() => grid.filter(t => t.isRevealed && !t.isMine).length, [grid]);
    const currentMultiplier = useMemo(() => calculateMultiplier(minesCount, revealedCount), [minesCount, revealedCount]);
    const nextMultiplier = useMemo(() => calculateMultiplier(minesCount, revealedCount + 1), [minesCount, revealedCount]);
    
    const handleBet = () => {
        if (gameState !== 'idle') return;
        setGameState('in_progress');
        const mineIndices = generateMines(serverSeed, clientSeed, nonce, minesCount);
        const newGrid = Array(GRID_SIZE).fill(null).map((_, index) => ({
            isMine: mineIndices.includes(index),
            isRevealed: false,
        }));
        setGrid(newGrid);
    };

    const handleTileClick = (index: number) => {
        if (gameState !== 'in_progress' || grid[index].isRevealed) return;
        const newGrid = [...grid];
        newGrid[index] = { ...newGrid[index], isRevealed: true };
        if (newGrid[index].isMine) {
            setGameState('busted');
            const finalGrid = newGrid.map(tile => tile.isMine ? { ...tile, isRevealed: true } : tile);
            setGrid(finalGrid);
            setGameHistory(prev => [{ bet: betAmount, mines: minesCount, profit: -betAmount, multiplier: 0, nonce }, ...prev].slice(0, 10));
            
            const previousServerSeed = serverSeed;
            const newServerSeed = generateServerSeed();
            setServerSeed(newServerSeed);
            setHashedServerSeed(sha512(newServerSeed));
            setNonce(prev => prev + 1);
            toastContext?.showToast(`BUSTED! Server seed was: ${previousServerSeed}`, 'error');
        } else {
            setGrid(newGrid);
        }
    };
    
    const handleCashout = () => {
        if (gameState !== 'in_progress' || revealedCount === 0) return;
        const profit = betAmount * currentMultiplier - betAmount;
        setGameHistory(prev => [{ bet: betAmount, mines: minesCount, profit, multiplier: currentMultiplier, nonce }, ...prev].slice(0, 10));
        
        const previousServerSeed = serverSeed;
        const newServerSeed = generateServerSeed();
        setServerSeed(newServerSeed);
        setHashedServerSeed(sha512(newServerSeed));
        setNonce(prev => prev + 1);
        toastContext?.showToast(`Cashed out! Server seed was: ${previousServerSeed}`, 'success');
        
        setGameState('idle');
        const finalGrid = grid.map(tile => ({ ...tile, isRevealed: true }));
        setGrid(finalGrid);
    };

    useEffect(() => {
        if (gameState === 'busted') {
            const timer = setTimeout(() => { setGameState('idle'); }, 2000);
            return () => clearTimeout(timer);
        }
    }, [gameState]);

    const changeSeeds = () => {
        const newServerSeed = generateServerSeed();
        setServerSeed(newServerSeed);
        setHashedServerSeed(sha512(newServerSeed));
        setNonce(1);
        toastContext?.showToast('New server seed generated and hashed.', 'success');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
            <div className="lg:col-span-1 space-y-6">
                 <div className="bg-foundation-light p-6 border border-[#333] rounded-lg card-lift">
                    <Tabs tabs={['MANUAL', 'PROVABLY FAIR']}>
                        {/* Tab 1: Manual Controls */}
                        <div>
                            <h2 className="font-orbitron text-2xl text-neon-surge mb-4">COMMAND PANEL</h2>
                            <div>
                                <label className="text-sm text-text-tertiary font-bold tracking-widest">BET AMOUNT (USD)</label>
                                <div className="relative mt-2">
                                    <input type="number" value={betAmount} onChange={e => setBetAmount(parseFloat(e.target.value))} disabled={gameState !== 'idle'} className="w-full bg-foundation border border-[#333] rounded-md p-3 font-mono text-lg text-white focus:ring-1 focus:ring-neon-surge focus:border-neon-surge transition-all" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-sm text-text-tertiary font-bold tracking-widest">MINES</label>
                                <div className="relative mt-2">
                                     <input type="range" min="1" max="24" value={minesCount} onChange={e => setMinesCount(parseInt(e.target.value))} disabled={gameState !== 'idle'} className="w-full h-2 bg-neon-surge/20 rounded-lg appearance-none cursor-pointer" />
                                     <span className="font-mono text-neon-surge text-lg absolute right-0 -bottom-6">{minesCount}</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                {gameState === 'in_progress' ? (
                                     <button onClick={handleCashout} disabled={revealedCount === 0} className="w-full bg-neon-surge text-black py-4 font-orbitron font-bold text-lg uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-neon-glow-md disabled:bg-foundation-lighter disabled:text-text-tertiary disabled:cursor-not-allowed">CASHOUT ({(betAmount * currentMultiplier).toFixed(2)})</button>
                                ) : (
                                    <button onClick={handleBet} className={`w-full text-black py-4 font-orbitron font-bold text-lg uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-neon-glow-md ${gameState === 'busted' ? 'bg-warning-high' : 'bg-neon-surge'}`}>{gameState === 'busted' ? 'BUSTED' : 'ARM MINES'}</button>
                                )}
                            </div>
                        </div>
                        {/* Tab 2: Provably Fair Controls */}
                        <div className="space-y-4">
                             <h2 className="font-orbitron text-lg text-neon-surge mb-2">SEED CONTROLS</h2>
                             <div>
                                 <label className="text-xs text-text-tertiary font-bold tracking-widest">CLIENT SEED</label>
                                 <Input value={clientSeed} onChange={e => setClientSeed(e.target.value)} disabled={gameState !== 'idle'} className="mt-1" />
                             </div>
                             <div>
                                 <label className="text-xs text-text-tertiary font-bold tracking-widest">HASHED SERVER SEED</label>
                                 <Input value={hashedServerSeed} readOnly disabled className="mt-1 bg-foundation-lighter" />
                             </div>
                             <div>
                                 <label className="text-xs text-text-tertiary font-bold tracking-widest">NONCE</label>
                                 <Input type="number" value={nonce} onChange={e => setNonce(Number(e.target.value))} disabled={gameState !== 'idle'} className="mt-1" />
                             </div>
                             <Button onClick={changeSeeds} disabled={gameState !== 'idle'} variant="ghost" size="sm" className="w-full">
                                <Icons.RefreshCw className="h-4 w-4 mr-2" /> GENERATE NEW SEED PAIR
                             </Button>
                        </div>
                    </Tabs>
                </div>
                <div className="bg-foundation-light p-6 border border-[#333] rounded-lg card-lift grid grid-cols-2 gap-4 text-center">
                   <div>
                       <div className="text-xs text-text-tertiary uppercase tracking-widest">Current Multiplier</div>
                       <div className="font-mono text-2xl text-neon-surge mt-1">{currentMultiplier.toFixed(2)}x</div>
                   </div>
                    <div>
                       <div className="text-xs text-text-tertiary uppercase tracking-widest">Next Tile</div>
                       <div className="font-mono text-2xl text-text-secondary mt-1">{nextMultiplier.toFixed(2)}x</div>
                   </div>
                </div>
                <div className="bg-foundation-light p-6 border border-[#333] rounded-lg card-lift">
                     <h3 className="font-orbitron text-lg text-neon-surge mb-4">GAME LOG</h3>
                     <div className="space-y-2 text-sm font-mono">
                        {gameHistory.length === 0 && <p className="text-text-tertiary">No games played yet.</p>}
                        {gameHistory.map((game, i) => (
                            <div key={i} className={`flex justify-between p-2 rounded ${game.profit > 0 ? 'bg-neon-surge/10' : 'bg-warning-high/10'}`}>
                                <span>Nonce: {game.nonce} | {game.multiplier.toFixed(2)}x</span>
                                <span className={game.profit > 0 ? 'text-neon-surge' : 'text-warning-high'}>{game.profit.toFixed(2)}</span>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
            <div className="lg:col-span-2 aspect-square bg-foundation-light border border-[#333] rounded-lg shadow-lg p-4">
                <div className="grid grid-cols-5 grid-rows-5 gap-2 md:gap-3 h-full">
                    {grid.map((tile, index) => (
                        <button key={index} onClick={() => handleTileClick(index)} disabled={gameState !== 'in_progress' || tile.isRevealed} className={`relative aspect-square rounded-md transition-all duration-300 flex items-center justify-center overflow-hidden ${!tile.isRevealed ? 'bg-foundation-lighter hover:bg-neon-surge/10 border-2 border-transparent hover:border-neon-surge cursor-pointer' : ''} ${tile.isRevealed && !tile.isMine ? 'bg-neon-surge/5' : ''} ${tile.isRevealed && tile.isMine ? 'bg-warning-high/10 animate-pulse' : ''} ${gameState === 'busted' && tile.isMine ? 'text-warning-high' : 'text-neon-surge'}`}>
                            {tile.isRevealed && ( <div className="animate-fadeIn">{tile.isMine ? <Icons.Mine className="w-8 h-8" /> : <Icons.Gem />}</div> )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default MinesGamePage;