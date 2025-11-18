import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, setLogLevel } from 'firebase/firestore';
import { Icons } from '../components/icons';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ConfirmationModal } from '../components/ConfirmationModal';


// FIX: Declare global variables to inform TypeScript that they are injected at runtime.
declare global {
    interface Window {
        __app_id?: string;
        __firebase_config?: string;
        __initial_auth_token?: string;
    }
}

// --- GLOBAL CONSTANTS (MANDATORY CANVAS VARIABLES) ---
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof window.__firebase_config !== 'undefined' ? window.__firebase_config : '{}');
const initialAuthToken = typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : null;
const API_KEY = ""; // Must be empty string
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

// --- TYPES ---
interface Message {
    id: number;
    sender: 'me' | 'them';
    text: string;
    time: string;
}

interface Contact {
    id: number;
    name: string;
    status: 'online' | 'offline' | 'loading';
    lastSeen: string;
    lastMessage: string;
    time: string;
    unread: number;
    role: 'AI AGENT' | 'OFFICIAL';
}

interface Notification {
    id: number;
    message: string;
    type: 'system' | 'warning' | 'error';
    timestamp: string;
}

// --- CHAT DATA ---
const ZAP_AGENT_CONTACT: Contact = {
    id: 1,
    name: "ZAP AGENT",
    status: 'online',
    lastSeen: 'NOW',
    lastMessage: "Awaiting tactical input, Operator...",
    time: "LIVE",
    unread: 1,
    role: 'AI AGENT'
};

const ZAP_SUPPORT_CONTACT: Contact = {
    id: 2,
    name: "ZAP SUPPORT HQ",
    status: 'offline',
    lastSeen: '8H AGO',
    lastMessage: "VPR validated. +50 ZP added.",
    time: "8h ago",
    unread: 0,
    role: 'OFFICIAL'
};

const MOCK_CONTACTS: Contact[] = [ZAP_AGENT_CONTACT, ZAP_SUPPORT_CONTACT];

const INITIAL_ZAP_AGENT_HISTORY: Message[] = [
    {
        id: 1,
        sender: 'them',
        text: "ZAP AGENT online. I am your tactical assistant, specialized in crypto intel and VPR auditing. How can I help you gain an edge, Operator?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
];

const STATIC_SUPPORT_HISTORY: Message[] = [
    { id: 1, sender: 'them', text: "Operator, we've reviewed your VPR for the delayed withdrawal on Roobet.", time: "10:42 AM" },
    { id: 2, sender: 'them', text: "Ticket #9432 closed. VPR validated. We've applied a temporary score penalty and credited +50 ZP to your account.", time: "10:50 AM" },
];

// --- LOADER ---
const ThinkingBubble = () => (
    <div className="flex flex-col items-start animate-fadeIn">
        <div className="max-w-[80%] p-3 rounded-lg bg-foundation-light border border-[#333] text-text-tertiary rounded-tl-none flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-surge rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-neon-surge rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-neon-surge rounded-full animate-pulse"></div>
        </div>
        <span className="text-[10px] font-jetbrains-mono text-[#666] mt-1 uppercase">
            // ZAP AGENT processing...
        </span>
    </div>
);


// --- MAIN COMPONENT ---
const MessagesPage = () => {
    const [activeContactId, setActiveContactId] = useState<number | null>(1);
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
    const [messageInput, setMessageInput] = useState('');
    const [chatHistory, setChatHistory] = useState<Message[]>(INITIAL_ZAP_AGENT_HISTORY);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // --- FIREBASE & APP STATE ---
    const [db, setDb] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [saveHistory, setSaveHistory] = useState(true); // Default to saving history

    // --- NOTIFICATION & MODAL STATE ---
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<(() => void) | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');

    const activeContact = MOCK_CONTACTS.find(c => c.id === activeContactId);

    // UTILITY: Add Notification
    const addNotification = useCallback((message: string, type: 'system' | 'warning' | 'error' = 'system') => {
        setNotifications(prev => [{
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString(),
        }, ...prev].slice(0, 15)); // Keep max 15 notifications
    }, []);

    // UTILITY: Get Firestore Reference for Zap Agent History
    const getZapAgentHistoryRef = useCallback((dbInstance: any, userId: string) => {
        return doc(dbInstance, `artifacts/${appId}/users/${userId}/chat_history/zap_agent_data`);
    }, []);


    // EFFECT 1: Firebase Initialization & Auth
    useEffect(() => {
        const initializeFirebase = async () => {
            if (!Object.keys(firebaseConfig).length) {
                console.warn("Firebase config is missing. Data persistence disabled.");
                setIsAuthReady(true);
                addNotification('WARNING: Persistence config unavailable. Running local session.', 'warning');
                return;
            }

            try {
                const app = initializeApp(firebaseConfig);
                const dbInstance = getFirestore(app);
                const authInstance = getAuth(app);

                setDb(dbInstance);
                setLogLevel('error');
                
                await setPersistence(authInstance, browserSessionPersistence);
                
                if (initialAuthToken) {
                    await signInWithCustomToken(authInstance, initialAuthToken);
                } else {
                    await signInAnonymously(authInstance);
                }

                onAuthStateChanged(authInstance, (user) => {
                    const currentId = user?.uid || crypto.randomUUID();
                    setUserId(currentId);
                    setIsAuthReady(true);
                    addNotification(`// AUTH: Signal established. User ID: ${currentId.substring(0, 8)}...`, 'system');
                });
            } catch (error) {
                console.error("Firebase initialization failed:", error);
                setIsAuthReady(true);
                addNotification('CRITICAL ERROR: Failed to establish Firelink connection.', 'error');
            }
        };
        initializeFirebase();
    }, [addNotification]);

    // UTILITY: Save Chat History to Firestore
    const saveChatHistory = useCallback(async (history: Message[], currentUserId: string, currentDb: any) => {
        if (!currentDb || !currentUserId || !saveHistory) return;
        
        if (activeContactId !== 1) return; 

        const historyRef = getZapAgentHistoryRef(currentDb, currentUserId);

        try {
            await setDoc(historyRef, {
                history: JSON.stringify(history),
                lastUpdated: new Date().toISOString()
            }, { merge: false });
        } catch (error) {
            console.error("Error saving chat history:", error);
        }
    }, [saveHistory, getZapAgentHistoryRef, activeContactId]);

    // EFFECT 2: Load History from Firestore (via onSnapshot)
    useEffect(() => {
        if (!db || !isAuthReady || !userId || !saveHistory || activeContactId !== 1) return;

        const historyRef = getZapAgentHistoryRef(db, userId);

        const unsubscribe = onSnapshot(historyRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                try {
                    const loadedHistory = JSON.parse(data.history);
                    setChatHistory(loadedHistory);
                    addNotification(`// HISTORY SYNCED: Conversation restored from VPR.`, 'system');
                } catch (e) {
                    console.error("Error parsing stored history:", e);
                    setChatHistory(INITIAL_ZAP_AGENT_HISTORY);
                    addNotification('WARNING: Stored history corrupted. Initiating new session.', 'warning');
                }
            } else {
                setChatHistory(INITIAL_ZAP_AGENT_HISTORY);
                saveChatHistory(INITIAL_ZAP_AGENT_HISTORY, userId, db);
                addNotification("// NEW SESSION: No prior VPR record found. Initiating save.", "system");
            }
        }, (error) => {
            console.error("Firestore onSnapshot error:", error);
            addNotification(`CRITICAL ERROR: History sync failed: ${error.message}`, 'error');
        });

        return () => unsubscribe();
    }, [db, isAuthReady, userId, saveHistory, activeContactId, getZapAgentHistoryRef, saveChatHistory, addNotification]);

    // EFFECT 3: Auto-Save Trigger
    useEffect(() => {
        if (activeContactId === 1 && chatHistory.length > 1 && saveHistory && db && userId) {
            const handler = setTimeout(() => {
                saveChatHistory(chatHistory, userId, db);
            }, 1000);
            return () => clearTimeout(handler);
        }
    }, [chatHistory, saveHistory, activeContactId, userId, db, saveChatHistory]);


    // EFFECT 4: Scroll to bottom on message or loading change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    // Handlers
    const handleContactSelect = (id: number) => {
        setActiveContactId(id);
        setMobileView('chat');
        setIsLoading(false);
        setMessageInput('');
        
        if (id === 1) {
            if (!saveHistory || !db || !userId) {
                setChatHistory(INITIAL_ZAP_AGENT_HISTORY);
            }
        } else if (id === 2) {
            setChatHistory(STATIC_SUPPORT_HISTORY);
        }
    };

    const handleBackToList = () => {
        setMobileView('list');
    };

    // --- MODAL ACTIONS ---
    const openModal = (title: string, body: string, action: () => void) => {
        setModalTitle(title);
        setModalBody(body);
        setModalAction(() => action);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
    };

    // --- CLEAR HISTORY LOGIC ---
    const handleClearChatHistory = () => {
        if (activeContactId !== 1) return;

        openModal(
            '// CONFIRM: PURGE ZAP AGENT HISTORY',
            `Warning, Operator: This action will permanently delete all Zap Agent history from the local session and, if saving is enabled, will attempt to delete the record from the remote VPR (Firestore). Proceed?`,
            performClearChatHistory
        );
    };

    const performClearChatHistory = async () => {
        setChatHistory(INITIAL_ZAP_AGENT_HISTORY.slice(0, 1));
        addNotification('// HISTORY PURGED: Zap Agent session reset.', 'system');

        if (db && userId && saveHistory) {
            const historyRef = getZapAgentHistoryRef(db, userId);
            try {
                await deleteDoc(historyRef);
                addNotification('// FIRESTORE DELETED: History removed from remote VPR.', 'system');
            } catch (error) {
                console.error("Error deleting chat history document:", error);
                addNotification('CRITICAL: Failed to delete remote history document.', 'error');
            }
        }
        closeModal();
    };

    const handleClearNotificationHistory = () => {
        setNotifications([]);
        addNotification('// NOTIFICATION LOGS CLEARED.', 'system');
    };


    // --- GEMINI API CALL HANDLER ---
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || isLoading || activeContactId !== 1) return;

        const userMessage: Message = {
            id: Date.now(),
            sender: 'me',
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatHistory(prev => [...prev, userMessage]);
        const currentMessage = messageInput;
        setMessageInput('');
        setIsLoading(true);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

        const systemPrompt = 'You are Zap Agent, an AI assistant for the ZAP platform. You specialize in crypto gambling, casino data, and user support. Your tone is tactical, concise, and futuristic. You provide high-signal intelligence to help users gain an edge. Keep responses brief and to the point. Use markdown for formatting if needed, but avoid long paragraphs. Address the user as "Operator" or "Zap".';
        
        const payload = {
            contents: [{ parts: [{ text: currentMessage }] }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        const makeApiCall = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await fetch(GEMINI_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.json();
                    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Response decode error.";

                    return text; // Success
                } catch (error) {
                    console.warn(`API call failed (Attempt ${i + 1}/${retries}):`, error);
                    if (i < retries - 1) {
                        const delay = Math.pow(2, i) * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                    } else {
                        throw error; // Throw error after max retries
                    }
                }
            }
            throw new Error("API call failed after all retries.");
        };

        try {
            const aiResponseText = await makeApiCall();

            const aiMessage: Message = {
                id: Date.now() + 1,
                sender: 'them',
                text: aiResponseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatHistory(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                sender: 'them',
                text: `CRITICAL FAILURE: Connection to the Grid severed. API call failed after multiple retries.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatHistory(prev => [...prev, errorMessage]);
            addNotification('CRITICAL FAILURE: Agent connection lost.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    // UI elements for responsiveness and layout
    const contactsListClass = `w-full md:w-[280px] bg-foundation flex-shrink-0 flex flex-col transition-transform duration-300 absolute inset-0 z-10 md:relative md:z-auto ${mobileView === 'chat' ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`;
    const chatPanelClass = `flex-1 flex flex-col bg-foundation-light transition-transform duration-300 absolute inset-0 z-10 md:relative md:z-auto ${mobileView === 'list' ? 'translate-x-full md:translate-x-0' : 'translate-x-0'}`;
    const notificationPanelClass = `hidden lg:block w-[300px] flex-shrink-0 bg-foundation border-l border-[#333] flex flex-col`;


    return (
        <div className="container mx-auto max-w-7xl h-[calc(100vh-8rem)] flex flex-col font-rajdhani animate-fadeIn">
            <ConfirmationModal 
                isOpen={isModalOpen}
                title={modalTitle}
                body={modalBody}
                onConfirm={() => { if (modalAction) modalAction(); }}
                onClose={closeModal}
            />

            <div className="mb-4 flex-shrink-0">
                <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                    <Icons.MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-neon-surge" />
                    SECURE COMM LINK
                </h1>
                <p className="text-neon-surge font-jetbrains-mono text-xs md:text-sm uppercase tracking-widest mt-1 ml-9 md:ml-11 text-glow">
                    // VPR STATUS: {isAuthReady ? 'READY' : 'SYNCING'} // USER ID: {userId ? userId.substring(0, 8) + '...' : 'ANONYMOUS'}
                </p>
            </div>

            <div className="flex flex-1 gap-0 overflow-hidden relative bg-foundation border border-[#333] rounded-xl shadow-[0_0_25px_rgba(0,255,192,0.1)]">

                <div className={contactsListClass}>
                    <div className="p-4 border-b border-[#333]">
                        <div className="relative">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary h-4 w-4" />
                            <Input placeholder="SEARCH FREQUENCIES..." className="pl-10 text-xs h-9" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {MOCK_CONTACTS.map(contact => (
                            <button
                                key={contact.id}
                                onClick={() => handleContactSelect(contact.id)}
                                className={`w-full text-left p-4 flex gap-3 transition-all border-l-2 hover:bg-foundation-light ${activeContactId === contact.id ? 'bg-foundation-light border-neon-surge shadow-inner shadow-neon-surge/10' : 'border-transparent'}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-md border border-[#333] flex items-center justify-center ${contact.role === 'AI AGENT' ? 'bg-neon-surge/10 border-neon-surge/30' : 'bg-foundation-light border-[#333]'}`}>
                                        {contact.role === 'AI AGENT' ? <Icons.Cpu className="h-5 w-5 text-neon-surge" /> : <Icons.Users className="h-5 w-5 text-text-tertiary" />}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-foundation ${contact.status === 'online' ? 'bg-neon-surge' : 'bg-text-tertiary'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className={`font-orbitron text-sm uppercase truncate ${activeContactId === contact.id ? 'text-white font-bold' : 'text-text-tertiary'} ${contact.role === 'AI AGENT' ? 'text-neon-surge' : ''}`}>
                                            {contact.name}
                                        </span>
                                        <span className="text-[10px] font-jetbrains-mono text-[#666]">{contact.time}</span>
                                    </div>
                                    <p className={`text-xs truncate font-jetbrains-mono ${contact.unread ? 'text-neon-surge' : 'text-[#666]'}`}>
                                        {contact.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={chatPanelClass}>
                    {activeContact ? (
                        <>
                            <div className="h-16 flex-shrink-0 bg-foundation border-b border-neon-surge/10 flex items-center px-4 md:px-6 justify-between shadow-inner shadow-black/50">
                                <div className="flex items-center gap-3">
                                    <button onClick={handleBackToList} className="md:hidden text-text-tertiary hover:text-white">
                                        <Icons.ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <div className="relative">
                                        <div className={`w-8 h-8 rounded-md border border-[#333] flex items-center justify-center ${activeContact.role === 'AI AGENT' ? 'bg-neon-surge/10 border-neon-surge/30' : ''}`}>
                                            {activeContact.role === 'AI AGENT' ? <Icons.Cpu className="h-4 w-4 text-neon-surge" /> : <Icons.Users className="h-4 w-4 text-text-tertiary" />}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-foundation ${activeContact.status === 'online' ? 'bg-neon-surge' : 'bg-text-tertiary'}`} />
                                    </div>
                                    <div>
                                        <h2 className={`font-orbitron text-white text-sm uppercase tracking-wider ${activeContact.role === 'AI AGENT' ? 'text-neon-surge text-glow' : ''}`}>{activeContact.name}</h2>
                                        <p className="font-jetbrains-mono text-[10px] text-neon-surge uppercase">
                                            // {activeContact.role} // {activeContact.status === 'online' ? 'SIGNAL ACTIVE' : `LAST SEEN: ${activeContact.lastSeen}`}
                                        </p>
                                    </div>
                                </div>
                                <span title="End-to-End Encrypted" className="cursor-help">
                                    <Icons.Lock className="h-4 w-4 text-[#333]" />
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-grid">
                                {chatHistory.map(msg => (
                                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[80%] p-3 rounded-xl text-sm animate-fadeIn shadow-lg font-rajdhani ${msg.sender === 'me' ? 'bg-neon-surge/10 border border-neon-surge/30 text-white rounded-tr-sm' : 'bg-foundation-lighter border border-[#333] text-text-secondary rounded-tl-sm'}`}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] font-jetbrains-mono text-[#666] mt-1 uppercase">
                                            {msg.time} {msg.sender === 'me' && '// SENT'}
                                        </span>
                                    </div>
                                ))}
                                {isLoading && <ThinkingBubble />}
                                <div ref={chatEndRef} />
                                {activeContactId !== 1 && (
                                    <div className="text-center p-4">
                                        <p className="font-jetbrains-mono text-xs text-[#666] uppercase">-- THIS CHANNEL IS READ-ONLY FOR OFFICIAL COMMUNICATIONS --</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-foundation border-t border-neon-surge/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                <form onSubmit={handleSendMessage} className="flex gap-3">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-surge font-jetbrains-mono text-sm">{'>'}</span>
                                        <Input 
                                            value={messageInput}
                                            onChange={(e: any) => setMessageInput(e.target.value)}
                                            placeholder={activeContactId === 1 ? "TRANSMIT TACTICAL INPUT..." : "CHANNEL LOCKED"}
                                            className="pl-8 text-sm h-11"
                                            disabled={isLoading || activeContactId !== 1 || !isAuthReady}
                                        />
                                    </div>
                                    <Button type="submit" size="lg" className="w-16 h-11 shadow-[0_0_15px_rgba(0,255,192,0.15)]" disabled={!messageInput.trim() || isLoading || activeContactId !== 1 || !isAuthReady}>
                                        <Icons.ArrowRight className="h-5 w-5" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-text-tertiary p-6 text-center bg-grid">
                            <Icons.Activity className="h-16 w-16 opacity-20 text-neon-surge mb-4 animate-pulse" />
                            <h3 className="font-orbitron text-xl text-white uppercase tracking-widest mb-2">AWAITING SIGNAL</h3>
                            <p className="font-jetbrains-mono text-xs">// SELECT AN ACTIVE FREQUENCY TO COMMUNICATE</p>
                        </div>
                    )}
                </div>

                <div className={notificationPanelClass}>
                    <div className="p-4 border-b border-neon-surge/10 shadow-inner shadow-black/50">
                        <h3 className="font-orbitron text-lg text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                            SYSTEM LOGS 
                            <span className="text-xs font-jetbrains-mono text-neon-surge bg-neon-surge/10 px-2 py-0.5 rounded">{notifications.length}</span>
                        </h3>

                        <div className="flex items-center justify-between mt-3 mb-4">
                            <label htmlFor="save-toggle" className="font-jetbrains-mono text-xs text-neon-surge uppercase flex items-center gap-2 cursor-pointer">
                                <Icons.Save className="h-4 w-4" />
                                VPR History Save
                            </label>
                            <input
                                id="save-toggle"
                                type="checkbox"
                                checked={saveHistory}
                                onChange={() => setSaveHistory(prev => !prev)}
                                disabled={!isAuthReady || !db}
                                className="peer appearance-none cursor-pointer w-10 h-5 rounded-full bg-[#333] checked:bg-neon-surge/50 transition-colors duration-300 relative"
                            />
                        </div>
                        <p className={`font-jetbrains-mono text-[10px] text-right ${saveHistory ? 'text-neon-surge' : 'text-warning-high'}`}>
                            // STATUS: {saveHistory ? 'PERSISTENCE ACTIVE' : 'LOCAL SESSION ONLY'}
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                        {notifications.length === 0 && (
                            <p className="font-jetbrains-mono text-xs text-[#666] text-center mt-6">LOG CLEAR // AWAITING SYSTEM EVENTS</p>
                        )}
                        {notifications.map(n => {
                            const color = n.type === 'error' ? 'text-warning-high' : n.type === 'warning' ? 'text-warning-low' : 'text-text-tertiary';
                            const indicator = n.type === 'error' ? 'ERR' : n.type === 'warning' ? 'WARN' : 'SYS';
                            return (
                                <div key={n.id} className={`font-jetbrains-mono text-[10px] p-2 rounded bg-foundation-light border border-[#333] ${color}`}>
                                    <span className="uppercase font-bold text-neon-surge mr-2">[{indicator}]</span>
                                    {n.message}
                                    <p className="text-[#666] text-right mt-0.5">{n.timestamp}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-[#333] space-y-2">
                        <Button 
                            onClick={handleClearChatHistory} 
                            variant="destructive" size="sm"
                            className="w-full text-xs" 
                            disabled={activeContactId !== 1 || chatHistory.length <= 1}
                        >
                            <Icons.Trash className="h-4 w-4 mr-2" />
                            PURGE AGENT HISTORY
                        </Button>
                        <Button 
                            onClick={handleClearNotificationHistory} 
                            variant="ghost" size="sm"
                            className="w-full text-xs"
                            disabled={notifications.length === 0}
                        >
                            <Icons.X className="h-4 w-4 mr-2" />
                            CLEAR SYSTEM LOGS
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default MessagesPage;