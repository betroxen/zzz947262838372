import React, { useState, createContext, useContext, useCallback, useMemo } from 'react';
import { 
    LayoutDashboard, Home, BookOpen, Clock, X, Menu, Star, Briefcase, MapPin, BarChart2,
    DollarSign, User, MessageSquare, Award, Settings, Shield, Zap, Info, HelpCircle,
    Package, TrendingUp, Globe, AlertTriangle, RefreshCw, Search, ArrowRight, Code, 
    Database, ShieldCheck, Cookie, FileCheck, Users, Terminal, Cpu, Activity, Bell, 
    Wallet, Trophy, Link, Lock, Eye, EyeOff, Trash, Edit, Share, ChevronLeft, ChevronDown
} from 'lucide-react';

// --- 1. TYPES AND CONSTANTS ---
type Page = 
    'Home' | 'Dashboard' | 'Casino Directory' | 'Bonus Offers' | 'Live RTP Tracker' | 'Mines Game' |
    'Plinko Game' | 'About Us' | 'Analytics' | 'Terms of Service' | 'Privacy Policy' | 'Cookies Policy' |
    'Responsible Gaming' | 'AML & CTF Policy' | 'Commercial Disclosure' | 'Copyright Notice' | 'Profile' | 
    'Settings' | 'Messages' | 'Rewards' | 'Bonus Calculator' | 'Review Methodology' | 'Provably Fair' | 
    'Protocol Deep Dive' | 'Tactical Guides' | 'Support' | 'FAQ' | 'Certified Platforms' | 'Affiliate Program';

interface CasinoEntry {
  id: string;
  name: string;
  launchDate: number;
  nodeStatus: 'verified' | 'unverified' | 'offline';
  rating: number;
  payoutTime: string;
}

const MOCK_CASINOS: CasinoEntry[] = [
    { id: "azimuth", name: "Azimuth Exchange", launchDate: 1672531200000, nodeStatus: 'verified', rating: 4.8, payoutTime: 'Instant' },
    { id: "nexus", name: "Nexus Vault", launchDate: 1690848000000, nodeStatus: 'unverified', rating: 3.5, payoutTime: '15-30 min' },
    { id: "quantum", name: "Quantum Stakes", launchDate: 1640995200000, nodeStatus: 'verified', rating: 5.0, payoutTime: '5 min' }
];

// --- 2. TOAST CONTEXT ---
interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }
interface ToastContextType { showToast: (message: string, type?: Toast['type']) => void; }
const ToastContext = createContext<ToastContextType | undefined>(undefined);

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

const Toaster: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center p-3 rounded-lg shadow-xl text-sm font-medium transition-all duration-300 transform pointer-events-auto animate-fade-in-up ${
            toast.type === 'success' ? 'bg-green-600 text-white' :
            toast.type === 'error' ? 'bg-red-600 text-white' :
            'bg-gray-800 text-white'
          }`}>
            {toast.message}
            <button onClick={() => removeToast(toast.id)} className="ml-4 p-1 rounded-full hover:bg-black/20">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// --- 3. APP CONTEXT ---
interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isRegisterModalOpen: boolean;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  isReviewModalOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;
  casinos: CasinoEntry[];
  updateCasinoRating: (id: string, newRating: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [casinos, setCasinos] = useState<CasinoEntry[]>(MOCK_CASINOS);
  const { showToast } = useToast();

  const login = () => { setIsLoggedIn(true); showToast("Node Access Granted.", 'success'); };
  const logout = () => { setIsLoggedIn(false); setCurrentPage('Home'); showToast("Session Terminated.", 'info'); };

  const updateCasinoRating = useCallback((id: string, newRating: number) => {
    setCasinos(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, rating: newRating } : c);
      return updated.sort((a, b) => b.rating - a.rating);
    });
  }, []);

  const value = useMemo(() => ({
    currentPage, setCurrentPage,
    isLoggedIn, login, logout,
    isCollapsed, setIsCollapsed,
    isMobileOpen, setIsMobileOpen,
    isLoginModalOpen, openLoginModal: () => setIsLoginModalOpen(true), closeLoginModal: () => setIsLoginModalOpen(false),
    isRegisterModalOpen, openRegisterModal: () => setIsRegisterModalOpen(true), closeRegisterModal: () => setIsRegisterModalOpen(false),
    isReviewModalOpen, openReviewModal: () => setIsReviewModalOpen(true), closeReviewModal: () => setIsReviewModalOpen(false),
    casinos, updateCasinoRating
  }), [currentPage, isLoggedIn, isCollapsed, isMobileOpen, isLoginModalOpen, isRegisterModalOpen, isReviewModalOpen, casinos]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

// --- 4. MODALS ---
const ModalWrapper: React.FC<{ title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0c0c0e] p-8 rounded-xl shadow-2xl max-w-lg w-full border border-neon-surge/30" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-neon-surge/50 pb-3 mb-4">
          <h2 className="text-2xl font-orbitron font-bold text-neon-surge">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, openRegisterModal } = useAppContext();
  return (
    <ModalWrapper title="NODE ACCESS LOGIN" isOpen={isLoginModalOpen} onClose={closeLoginModal}>
      <form onSubmit={(e) => { e.preventDefault(); login(); closeLoginModal(); }} className="space-y-4">
        <input type="email" placeholder="Access ID (Email)" className" className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white" required />
        <input type="password" placeholder="Key Phrase" className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white" required />
        <button type="submit" className="w-full bg-neon-surge text-black font-bold py-3 rounded-lg uppercase">AUTHENTICATE NODE</button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        No ID? <button onClick={() => { closeLoginModal(); openRegisterModal(); }} className="text-neon-surge hover:underline">Request New Credentials</button>
      </p>
    </ModalWrapper>
  );
};

const RegisterModal: React.FC = () => {
  const { isRegisterModalOpen, closeRegisterModal } = useAppContext();
  const { showToast } = useToast();
  return (
    <ModalWrapper title="REQUEST NEW CREDENTIALS" isOpen={isRegisterModalOpen} onClose={closeRegisterModal}>
      <form onSubmit={(e) => { e.preventDefault(); showToast("Registration request submitted (Mock).", 'info'); closeRegisterModal(); }} className="space-y-4">
        <input type="email" placeholder="New Access ID (Email)" className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white" required />
        <input type="password" placeholder="Desired Key Phrase" className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white" required />
        <button type="submit" className="w-full bg-yellow-600 text-white font-bold py-3 rounded-lg uppercase">SUBMIT REQUEST</button>
      </form>
    </ModalWrapper>
  );
};

const ReviewModal: React.FC = () => {
  const { isReviewModalOpen, closeReviewModal } = useAppContext();
  const { showToast } = useToast();
  return (
    <ModalWrapper title="SUBMIT TACTICAL REVIEW" isOpen={isReviewModalOpen} onClose={closeReviewModal}>
      <form onSubmit={(e) => { e.preventDefault(); showToast("Review submitted.", 'success'); closeReviewModal(); }} className="space-y-4">
        <input type="text" placeholder="Target Node" className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white" required />
        <textarea placeholder="Tactical Report (Min 50 chars)" rows={4} className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white" required minLength={50}></textarea>
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg uppercase">SEND REPORT</button>
      </form>
    </ModalWrapper>
  );
};

// --- 5. LAYOUT ---
const Header: React.FC = () => {
  const { isLoggedIn, logout, currentPage, setIsMobileOpen, isMobileOpen, openLoginModal, openReviewModal } = useAppContext();

  return (
    <header className="fixed top-0 w-full bg-[#0c0c0e]/95 backdrop-blur z-40 border-b border-neon-surge/20">
      <div className="flex justify-between items-center h-16 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setIsMobileOpen(!isMobileOpen)}><Menu size={24} className="text-neon-surge" /></button>
          <h1 className="font-orbitron text-2xl font-black text-neon-surge">ZAPWAY <span className="text-white text-base font-light">// TDA</span></h1>
        </div>
        <div className="hidden sm:block text-sm text-gray-400 font-mono">{currentPage.toUpperCase().replace(/ /g, '-')}</div>
        <div className="flex items-center gap-3">
          {isLoggedIn && <button onClick={openReviewModal} className="hidden sm:block bg-indigo-600 px-4 py-2 rounded text-xs uppercase font-bold">Review</button>}
          {isLoggedIn ? (
            <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-xs uppercase font-bold">Logout</button>
          ) : (
            <button onClick={openLoginModal} className="bg-neon-surge hover:brightness-110 px-6 py-2 rounded text-xs uppercase font-bold text-black">Access Node</button>
          )}
        </div>
      </div>
    </header>
  );
};

const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, isLoggedIn } = useAppContext();

  const menuItems = [
    { name: 'Home' as Page, icon: Home, auth: false },
    { name: 'Dashboard' as Page, icon: LayoutDashboard, auth: true },
    { name: 'Casino Directory' as Page, icon: Briefcase, auth: true },
    { name: 'Live RTP Tracker' as Page, icon: Clock, auth: true },
    { name: 'Mines Game' as Page, icon: Star, auth: true },
    { name: 'Plinko Game' as Page, icon: Package, auth: true },
    { name: 'Bonus Calculator' as Page, icon: DollarSign, auth: true },
    { name: 'Profile' as Page, icon: User, auth: true },
    { name: 'Messages' as Page, icon: MessageSquare, auth: true },
    { name: 'Rewards' as Page, icon: Award, auth: true },
    { name: 'Settings' as Page, icon: Settings, auth: true },
    { name: 'Terms of Service' as Page, icon: BookOpen, auth: false },
    { name: 'Support' as Page, icon: HelpCircle, auth: false },
  ];

  const filtered = menuItems.filter(i => !i.auth || isLoggedIn);

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileOpen(false)} />}
      <aside className={`fixed left-0 top-0 h-full bg-[#0c0c0e] pt-16 transition-all z-30 \( {isCollapsed ? 'w-20' : 'w-64'} \){isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        onMouseEnter={() => setIsCollapsed(false)} onMouseLeave={() => setIsCollapsed(true)}>
        <nav className="p-4">
          {filtered.map(item => (
            <button
              key={item.name}
              onClick={() => { setCurrentPage(item.name); setIsMobileOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${currentPage === item.name ? 'bg-neon-surge text-black' : 'hover:bg-gray-800'}`
            >
              <item.icon size={24} />
              {!isCollapsed && <span>{item.name}</span>}
            </button>
          ))}
        </nav>
      </aside>
  );
};

const Footer: React.FC = () => {
  const { setCurrentPage } = useAppContext();
  return (
    <footer className="bg-[#0c0c0e] border-t border-neon-surge/20 py-4 text-center text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4">
        <p>© 2025 ZAPWAY // TACTICAL DATA ARCHITECT</p>
        <div className="space-x-4 mt-2">
          <button onClick={() => setCurrentPage('Terms of Service')} className="hover:text-neon-surge">Terms</button>
          <span>|</span>
          <button onClick={() => setCurrentPage('Privacy Policy')} className="hover:text-neon-surge">Privacy</button>
          <span>|</span>
          <button onClick={() => setCurrentPage('Support')} className="hover:text-neon-surge">Support</button>
        </div>
      </div>
    </footer>
  );
};

// --- 6. PAGES (All 25 live ones + placeholders) ---
// (Paste all your existing page components here — they are already perfect)

const HomePage: React.FC = () => { /* ... your full HomePage code ... */ };
const DashboardPage: React.FC = () => { /* ... your full DashboardPage code ... */ };
const CasinoDirectoryPage: React.FC = () => { /* ... your full CasinoDirectoryPage code ... */ };
// ... continue with ALL your pages ...

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="text-center py-32">
    <h1 className="text-5xl font-orbitron font-bold text-neon-surge mb-4">{title}</h1>
    <p className="text-gray-400">Coming soon...</p>
  </div>
);

// --- 7. ROUTER ---
const AppRouter: React.FC = () => {
  const { currentPage } = useAppContext();
  const pageMap: Record<Page, React.FC> = {
    'Home': HomePage,
    'Dashboard': DashboardPage,
    'Casino Directory': CasinoDirectoryPage,
    // ... add all 25 live pages here ...
    'Bonus Offers': PlaceholderPage,
    'Live RTP Tracker': PlaceholderPage,
    'Plinko Game': PlaceholderPage,
    'Analytics': PlaceholderPage,
    'Rewards': PlaceholderPage,
  };

  const PageComponent = pageMap[currentPage] || PlaceholderPage;

  return <PageComponent />;
};

// --- 8. ROOT ---
const RootApp: React.FC = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <ReviewModal />
      <Header />
      {isLoggedIn && <Sidebar />}
      <main className={`${isLoggedIn ? 'md:pl-64' : ''} pt-16 min-h-screen bg-[#0a0a0a]`}>
        <AppRouter />
      </main>
      <Footer />
    </>
  );
};

const App: React.FC = () => (
  <Toaster>
    <AppProvider>
      <RootApp />
    </AppProvider>
  </Toaster>
);

export default App;