import React, { useState, createContext, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
    LayoutDashboard, Home, BookOpen, Clock, X, Menu, Star, Briefcase, MapPin, BarChart2,
    DollarSign, User, MessageSquare, Award, Settings, Shield, Zap, Info, HelpCircle,
    Package, TrendingUp, Anchor, Globe, Cookie, FileCheck, Users, Terminal, Cpu,
    Activity, Bell, Wallet, Trophy, Link, Lock, Eye, EyeOff, Trash, Edit, Share,
    ChevronLeft, ChevronDown, AlertTriangle, RefreshCw, Search, ArrowRight, Mine, Gem,
    Code, Database, ShieldCheck
} from 'lucide-react';

// --- 1. TYPES AND CONSTANTS ---
type Page = 
    'Home' | 'Dashboard' | 'Casino Directory' | 'Bonus Offers' | 'Live RTP Tracker' | 'Mines Game' |
    'Plinko Game' | 'About Us' | 'Analytics' | 'Terms of Service' | 'Privacy Policy' | 'Cookies Policy' |
    'Responsible Gaming' | 'AML & CTF Policy' | 'Commercial Disclosure' | 'Copyright Notice' | 'Profile' | 
    'Settings' | 'Messages' | 'Rewards' | 'Bonus Calculator' | 'Review Methodology' | 'Provably Fair' | 
    'Protocol Deep Dive' | 'Tactical Guides' | 'Support' | 'FAQ' | 'Certified Platforms' | 'Affiliate Program';

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
                        <button onClick={() => removeToast(toast.id)} className="ml-4 p-1 rounded-full hover:bg-black/20 transition-colors">
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
    const { showToast } = useToast();

    const login = () => { setIsLoggedIn(true); showToast("Node Access Granted.", 'success'); };
    const logout = () => { setIsLoggedIn(false); setCurrentPage('Home'); showToast("Session Terminated.", 'info'); };

    const value = useMemo(() => ({
        currentPage, setCurrentPage,
        isLoggedIn, login, logout,
        isCollapsed, setIsCollapsed,
        isMobileOpen, setIsMobileOpen,
        isLoginModalOpen, openLoginModal: () => setIsLoginModalOpen(true), closeLoginModal: () => setIsLoginModalOpen(false),
        isRegisterModalOpen, openRegisterModal: () => setIsRegisterModalOpen(true), closeRegisterModal: () => setIsRegisterModalOpen(false),
        isReviewModalOpen, openReviewModal: () => setIsReviewModalOpen(true), closeReviewModal: () => setIsReviewModalOpen(false),
    }), [currentPage, isLoggedIn, isCollapsed, isMobileOpen, isLoginModalOpen, isRegisterModalOpen, isReviewModalOpen]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};

// --- 4. MODAL COMPONENTS ---
const ModalWrapper: React.FC<{ title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ title, isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#0c0c0e] p-6 sm:p-8 rounded-xl shadow-neon-glow-lg max-w-lg w-full transform animate-modal-enter border border-neon-surge/30" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-neon-surge/50 pb-3 mb-4">
                    <h2 className="text-2xl font-orbitron font-bold text-neon-surge">{title}</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-white p-1 rounded-full"><X size={24} /></button>
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
                <input type="email" placeholder="Access ID" className="w-full p-3 rounded bg-foundation-lighter border border-gray-700 text-white" required />
                <input type="password" placeholder="Key Phrase" className="w-full p-3 rounded bg-foundation-lighter border border-gray-700 text-white" required />
                <button type="submit" className="w-full bg-neon-surge text-black font-bold py-3 rounded-lg uppercase">AUTHENTICATE NODE</button>
            </form>
            <p className="mt-4 text-center text-sm text-text-tertiary">
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
                <input type="email" placeholder="New Access ID" className="w-full p-3 rounded bg-foundation-lighter border border-gray-700 text-white" required />
                <input type="password" placeholder="Desired Key Phrase" className="w-full p-3 rounded bg-foundation-lighter border border-gray-700 text-white" required />
                <button type="submit" className="w-full bg-warning-low text-white font-bold py-3 rounded-lg uppercase">SUBMIT REQUEST</button>
            </form>
        </ModalWrapper>
    );
};

const ReviewModal: React.FC = () => {
    const { isReviewModalOpen, closeReviewModal } = useAppContext();
    const { showToast } = useToast();
    return (
        <ModalWrapper title="SUBMIT TACTICAL REVIEW" isOpen={isReviewModalOpen} onClose={closeReviewModal}>
            <form onSubmit={(e) => { e.preventDefault(); showToast("Review submitted successfully.", 'success'); closeReviewModal(); }} className="space-y-4">
                <input type="text" placeholder="Target Node ID/Name" className="w-full p-3 rounded bg-foundation-lighter border border-gray-700 text-white" required />
                <textarea placeholder="Tactical Report (Min 50 chars)" rows={4} className="w-full p-3 rounded bg-foundation-lighter border border-gray-700 text-white" required minLength={50}></textarea>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg uppercase">SEND REPORT</button>
            </form>
        </ModalWrapper>
    );
};

// --- 5. LAYOUT COMPONENTS ---
const Header: React.FC = () => {
    const { isLoggedIn, logout, currentPage, setIsMobileOpen, isMobileOpen, openLoginModal, openRegisterModal, openReviewModal } = useAppContext();
    const { showToast } = useToast();

    return (
        <header className="fixed top-0 left-0 right-0 bg-foundation-light/95 backdrop-blur-sm z-40 border-b border-neon-surge/20 shadow-xl">
            <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4">
                    <button className="md:hidden text-neon-surge hover:text-white p-1 rounded" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                        <Menu size={24} />
                    </button>
                    <h1 className="font-orbitron text-xl sm:text-2xl font-black tracking-widest text-neon-surge text-shadow-neon">
                        ZAPWAY<span className="text-white font-light text-base"> // TDA</span>
                    </h1>
                </div>
                <h2 className="hidden sm:block font-roboto-mono text-sm text-text-secondary tracking-widest">
                    {currentPage.toUpperCase().replace(/ /g, '-')}
                </h2>
                <div className="flex items-center space-x-3">
                    {isLoggedIn && (
                        <button onClick={openReviewModal} className="hidden sm:block bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold py-2 px-3 rounded-md uppercase">
                            Review
                        </button>
                    )}
                    {isLoggedIn ? (
                        <button onClick={logout} className="bg-warning-high hover:bg-warning-high/80 text-white text-xs font-bold py-2 px-3 rounded-md uppercase">
                            Logout
                        </button>
                    ) : (
                        <button onClick={openLoginModal} className="bg-neon-surge hover:bg-neon-surge/90 text-black text-xs font-bold py-2 px-3 rounded-md uppercase">
                            Access Node
                        </button>
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

    const filteredItems = menuItems.filter(item => !item.auth || isLoggedIn);

    const handleNavigation = (page: Page) => {
        setCurrentPage(page);
        setIsMobileOpen(false);
    };

    return (
        <>
            {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileOpen(false)} />}
            <div 
                className={`fixed top-0 left-0 h-full bg-foundation-light z-30 pt-16 transition-all duration-300 ${
                    isCollapsed ? 'w-[72px]' : 'w-64'
                } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                onMouseEnter={() => !isMobileOpen && setIsCollapsed(false)}
                onMouseLeave={() => !isMobileOpen && setIsCollapsed(true)}
            >
                <nav className="p-2 overflow-y-auto h-full custom-scrollbar">
                    {filteredItems.map(item => (
                        <div 
                            key={item.name}
                            className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all font-rajdhani text-lg ${
                                currentPage === item.name 
                                    ? 'bg-neon-surge text-black font-bold shadow-neon-glow-md' 
                                    : 'text-text-secondary hover:bg-foundation-lighter hover:text-white'
                            }`}
                            onClick={() => handleNavigation(item.name)}
                            title={item.name}
                        >
                            <item.icon size={24} className={isCollapsed ? 'mx-auto' : 'mr-3'} />
                            <span className={`${isCollapsed ? 'hidden' : 'block'} whitespace-nowrap`}>{item.name}</span>
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
};

const Footer: React.FC = () => {
    const { setCurrentPage } = useAppContext();
    return (
        <footer className="w-full bg-foundation-light border-t border-neon-surge/20 py-4 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-xs text-text-tertiary font-roboto-mono">
                <p className="mb-2">&copy; 2025 ZAPWAY // TACTICAL DATA ARCHITECT. All Rights Reserved.</p>
                <div className="space-x-4">
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

// --- 6. PAGE COMPONENTS ---
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="py-20 text-center animate-fadeIn">
        <h2 className="text-4xl font-orbitron font-bold text-neon-surge mb-6">
            {title.toUpperCase()} // PENDING ACTIVATION
        </h2>
        <div className="bg-warning-low/10 p-6 rounded-xl border border-warning-low max-w-2xl mx-auto">
            <p className="text-warning-low font-roboto-mono">
                **MODULE IN DEVELOPMENT:** The **{title}** protocol module is currently in **ALPHA**.
            </p>
        </div>
    </div>
);

// Import all implemented pages (all the code you sent)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const CasinoDirectoryPage = React.lazy(() => import('./pages/CasinoDirectoryPage'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const MinesGamePage = React.lazy(() => import('./pages/MinesGamePage'));
const ProvablyFairPage = React.lazy(() => import('./pages/ProvablyFairPage'));
const TermsOfServicePage = React.lazy(() => import('./pages/TermsOfServicePage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const CookiesPolicyPage = React.lazy(() => import('./pages/CookiesPolicyPage'));
const CommercialDisclosurePage = React.lazy(() => import('./pages/CommercialDisclosurePage'));
const CertifiedPlatformsPage = React.lazy(() => import('./pages/CertifiedPlatformsPage'));
const BonusCalculatorPage = React.lazy(() => import('./pages/BonusCalculatorPage'));
const AffiliatePage = React.lazy(() => import('./pages/AffiliatePage'));
const AboutUsPage = React.lazy(() => import('./pages/AboutUsPage'));
const AMLPolicyPage = React.lazy(() => import('./pages/AMLPolicyPage'));
const CopyrightNoticePage = React.lazy(() => import('./pages/CopyrightNoticePage'));
const SupportPage = React.lazy(() => import('./pages/SupportPage'));
const FAQPage = React.lazy(() => import('./pages/FAQPage'));
const ProtocolDeepDivePage = React.lazy(() => import('./pages/ProtocolDeepDivePage'));
const GuidePage = React.lazy(() => import('./pages/GuidePage'));
const ReviewMethodologyPage = React.lazy(() => import('./pages/ReviewMethodologyPage'));
const ResponsibleGamingPage = React.lazy(() => import('./pages/ResponsibleGamingPage'));

// --- 7. APP ROUTER ---
const AppRouter: React.FC = () => {
    const { currentPage } = useAppContext();

    const renderPage = () => {
        switch (currentPage) {
            case 'Home': return <HomePage onRegisterClick={() => {}} />;
            case 'Dashboard': return <DashboardPage />;
            case 'Casino Directory': return <CasinoDirectoryPage />;
            case 'Messages': return <MessagesPage />;
            case 'Settings': return <SettingsPage />;
            case 'Profile': return <ProfilePage />;
            case 'Mines Game': return <MinesGamePage />;
            case 'Provably Fair': return <ProvablyFairPage />;
            case 'Terms of Service': return <TermsOfServicePage />;
            case 'Privacy Policy': return <PrivacyPolicyPage />;
            case 'Cookies Policy': return <CookiesPolicyPage />;
            case 'Commercial Disclosure': return <CommercialDisclosurePage />;
            case 'Certified Platforms': return <CertifiedPlatformsPage />;
            case 'Bonus Calculator': return <BonusCalculatorPage />;
            case 'Affiliate Program': return <AffiliatePage />;
            case 'About Us': return <AboutUsPage />;
            case 'AML & CTF Policy': return <AMLPolicyPage />;
            case 'Copyright Notice': return <CopyrightNoticePage />;
            case 'Support': return <SupportPage />;
            case 'FAQ': return <FAQPage />;
            case 'Protocol Deep Dive': return <ProtocolDeepDivePage />;
            case 'Tactical Guides': return <GuidePage />;
            case 'Review Methodology': return <ReviewMethodologyPage />;
            case 'Responsible Gaming': return <ResponsibleGamingPage />;
            case 'Rewards': return <RewardsPage />;
            default:
                return <PlaceholderPage title={currentPage} />;
        }
    };

    return (
        <div className="relative flex flex-col min-h-screen md:pl-[var(--sidebar-width)]" style={{ '--sidebar-width': useAppContext().isCollapsed ? '72px' : '256px' } as React.CSSProperties}>
            <main className="flex-grow pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-grid">
                <div className="max-w-7xl mx-auto">
                    <React.Suspense fallback={<div className="text-center py-20"><Icons.Loader2 className="w-12 h-12 mx-auto animate-spin text-neon-surge" /></div>}>
                        {renderPage()}
                    </React.Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
};

// --- 8. MAIN APP ---
function App() {
    const { isLoggedIn } = useAppContext();
    return (
        <>
            <LoginModal />
            <RegisterModal />
            <ReviewModal />
            <Header />
            {isLoggedIn && <Sidebar />}
            {isLoggedIn ? <AppRouter /> : <HomePage onRegisterClick={() => {}} />}
        </>
    );
}

const WrappedApp: React.FC = () => (
    <Toaster>
        <AppProvider>
            <App />
        </AppProvider>
    </Toaster>
);

export default WrappedApp;