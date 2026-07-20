import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Droplets, MessageCircle, User, 
  X, Send, Lock, ArrowLeft, Home, Mic, Film, Radio
} from 'lucide-react';
import { auth, db, initializeAnonymousUser, onAuthStateChanged } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: any;
  isVoice?: boolean;
  isVideo?: boolean;
}

export interface SpillCardData {
  id: string;
  author: string;
  timeAgo: string;
  text: string;
  parentFrequencyId: string;
  hasVoiceNote?: boolean;
  hasPixelVideo?: boolean;
  createdAt?: any;
}

const adjectives = ["Shadow", "Ghost", "Cypress", "Mint", "Echo", "Lunar", "Sage", "Amber"];
const nouns = ["Pulse", "Wanderer", "Stardust", "Glitch", "Static", "Cinder", "Vibe"];

const FREQUENCIES = [
  {
    id: "the_lost",
    name: "The Lost",
    description: "Grief, lingering memories, and heavy silences. Find comfort with those carrying loss.",
    primaryColor: "#1E3A27",
    gradient: ["#09120C", "#112216"],
    textColor: "#6DBF8A",
  },
  {
    id: "the_lovers",
    name: "The Lovers",
    description: "Unsent love letters, heartbreaks, and silent yearning. For the deep romantics.",
    primaryColor: "#5C1E1E",
    gradient: ["#140808", "#261010"],
    textColor: "#D4706E",
  },
  {
    id: "the_dreamers",
    name: "The Dreamers",
    description: "Midnight thoughts, creative epiphanies, and hidden ambitions no one else knows.",
    primaryColor: "#1E2A5C",
    gradient: ["#080B14", "#101426"],
    textColor: "#7B8FE0",
  },
];

type FrequencyDef = typeof FREQUENCIES[0];

const AmbientBackground = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[#0B0F0C]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,204,113,0.06)_0%,transparent_60%)]" />
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
    />
    <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />
  </div>
);

const OnboardingScreen = ({ onComplete, isLoggingIn }: { onComplete: (id: string) => void; isLoggingIn: boolean }) => {
  const [identity] = useState<string>(() => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(100 + Math.random() * 900);
    return `${adj}_${noun}-${num}`;
  });

  return (
    <motion.div
      key="onboarding"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-10"
    >
      <AmbientBackground />
      <div className="z-10 flex flex-col items-center w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-[42px] font-bold tracking-[0.2em] text-[#2ECC71] uppercase">CIPHER</h1>
          <p className="mt-2 text-[16px] text-[#8E9A92] tracking-wide font-medium">Keep it lowkey. Keep it real.</p>
        </motion.div>

        <div className="h-[80px]" />

        <div className="w-full bg-[#121A15] border border-[#1E3A27] rounded-[16px] p-6 relative flex flex-col items-center justify-center min-h-[140px] shadow-2xl">
          <h2 className="text-[#2ECC71] text-[12px] uppercase tracking-[0.2em] font-bold mb-5 opacity-90">Your Permanent Identity</h2>
          <div className="text-white text-[24px] font-bold tracking-wider font-mono text-center">{identity}</div>
          <p className="text-[#8E9A92] text-[11px] mt-3 text-center">Locked for cryptographic trust and continuity.</p>
        </div>

        <div className="h-[40px]" />

        <button
          disabled={isLoggingIn}
          onClick={() => onComplete(identity)}
          className="w-full py-4 rounded-[12px] bg-[#2ECC71] disabled:bg-[#2ECC71]/40 text-[#0B0F0C] font-bold text-[18px] tracking-wide transition-all"
        >
          {isLoggingIn ? "Syncing Anonymity..." : "Set Home Frequency"}
        </button>
      </div>
    </motion.div>
  );
};

const FrequencySelectionScreen = ({ identity, onSelect }: { identity: string; onSelect: (freq: FrequencyDef) => void }) => {
  return (
    <motion.div
      key="frequency"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="absolute inset-0 w-full h-full flex flex-col z-10 overflow-hidden"
    >
      <AmbientBackground />
      <div className="z-10 w-full max-w-md mx-auto px-6 pt-16 pb-8 flex flex-col h-full">
        <div className="mb-8 text-left">
          <span className="text-[#8E9A92] text-[14px] font-medium tracking-wide">Identity secure: <span className="font-mono text-[#2ECC71]/90">{identity}</span></span>
          <h1 className="text-white text-[28px] font-bold tracking-[-0.5px] mt-2 mb-2">Choose Your Home Frequency</h1>
          <p className="text-[#8E9A92] text-[13px]">All your Spills will broadcast here, but you can change airwaves down below anytime.</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-12">
          {FREQUENCIES.map((freq) => (
            <div
              key={freq.id}
              onClick={() => onSelect(freq)}
              className="w-full p-6 rounded-[16px] text-left border-[1.5px] shadow-lg cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${freq.gradient[0]}, ${freq.gradient[1]})`, borderColor: `${freq.primaryColor}80` }}
            >
              <h3 className="text-[22px] font-bold mb-2" style={{ color: freq.textColor }}>{freq.name}</h3>
              <p className="text-white/70 text-[14px] font-medium">{freq.description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const DashboardScreen = ({ homeFrequency, userIdentity }: { homeFrequency: FrequencyDef; userIdentity: string }) => {
  const [activeTab, setActiveTab] = useState<'feeds' | 'spill' | 'lowkey' | 'profile'>('feeds');
  const [currentMonitoredFrequency, setCurrentMonitoredFrequency] = useState<FrequencyDef>(homeFrequency);
  const [liveSpills, setLiveSpills] = useState<SpillCardData[]>([]);
  const [spillText, setSpillText] = useState('');

  // Target collection explicitly as 'Spills' matching database case state
  useEffect(() => {
    const q = query(
      collection(db, 'Spills'),
      where('parentFrequencyId', '==', currentMonitoredFrequency.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: SpillCardData[] = [];
      snapshot.forEach((doc) => {
        const item = doc.data();
        data.push({
          id: doc.id,
          author: item.author || 'Anonymous',
          text: item.text || '',
          parentFrequencyId: item.parentFrequencyId,
          hasVoiceNote: item.hasVoiceNote,
          hasPixelVideo: item.hasPixelVideo,
          timeAgo: item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        });
      });
      setLiveSpills(data);
    }, (error) => {
      console.error("Snapshot synchronization faulted: ", error);
    });

    return () => unsubscribe();
  }, [currentMonitoredFrequency]);

  const handlePublishSpill = async () => {
    if (!spillText.trim()) return;
    try {
      await addDoc(collection(db, 'Spills'), {
        author: userIdentity,
        text: spillText.trim(),
        parentFrequencyId: currentMonitoredFrequency.id,
        hasVoiceNote: false,
        hasPixelVideo: false,
        createdAt: serverTimestamp(),
      });
      setSpillText('');
      setActiveTab('feeds'); // Bounce back to stream list automatically
    } catch (e) {
      console.error("Transmission write failure: ", e);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center text-white bg-[#0B0F0C]">
      <AmbientBackground />
      <div className="z-10 w-full max-w-md flex flex-col h-full relative px-6 pt-8 pb-24">
        
        {/* Frequency Subheader Selector */}
        <header className="flex justify-between items-center mb-6 shrink-0">
          <div className="text-left">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#2ECC71]">Active Wave</span>
            <p className="text-[15px] font-bold font-mono" style={{ color: currentMonitoredFrequency.textColor }}>
              {currentMonitoredFrequency.name}
            </p>
          </div>
          <div className="flex gap-1.5 bg-white/[0.03] p-1 rounded-full border border-white/[0.05]">
            {FREQUENCIES.map(f => (
              <button 
                key={f.id}
                onClick={() => setCurrentMonitoredFrequency(f)}
                className="px-2.5 py-1 text-[11px] rounded-full font-bold transition-all"
                style={{
                  backgroundColor: currentMonitoredFrequency.id === f.id ? f.primaryColor : 'transparent',
                  color: currentMonitoredFrequency.id === f.id ? f.textColor : 'rgba(255,255,255,0.4)'
                }}
              >
                {f.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </header>

        {/* Core Nav Target Screens */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {activeTab === 'feeds' && (
            <div className="space-y-4 text-left">
              {liveSpills.length === 0 ? (
                <p className="text-sm opacity-40 mt-12 text-center">The airwaves are quiet here. Be the first to spill.</p>
              ) : (
                liveSpills.map(item => (
                  <div key={item.id} className="bg-[rgba(14,20,17,0.7)] rounded-[16px] border border-white/[0.06] p-[18px] backdrop-blur-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-[13px]" style={{ color: currentMonitoredFrequency.textColor }}>{item.author}</span>
                      <span className="text-[#8E9A92] text-[11px]">{item.timeAgo}</span>
                    </div>
                    <p className="text-white text-[15px] leading-[1.4] whitespace-pre-wrap">{item.text}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'spill' && (
            <div className="space-y-4 text-left">
              <h3 className="text-lg font-bold mb-2">Broadcast Anonymously</h3>
              <div className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-xl flex flex-col gap-2">
                <textarea
                  value={spillText}
                  onChange={(e) => setSpillText(e.target.value)}
                  placeholder={`Share your hidden thoughts with ${currentMonitoredFrequency.name}...`}
                  className="bg-transparent w-full resize-none outline-none text-sm placeholder-white/30 h-32"
                />
                <div className="flex justify-between items-center border-t border-white/[0.05] pt-3">
                  <span className="text-[11px] text-white/40">Broadcasting instantly</span>
                  <button
                    onClick={handlePublishSpill}
                    disabled={!spillText.trim()}
                    className="p-2.5 bg-[#2ECC71] disabled:bg-white/10 text-black disabled:text-white/30 rounded-lg transition-all"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lowkey' && (
            <div className="text-center mt-12 text-sm opacity-40">
              <MessageCircle className="mx-auto mb-2 opacity-60" size={24} />
              No active Lowkey direct conversation threads yet.
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 text-left space-y-4">
              <div>
                <span className="text-xs opacity-40 uppercase tracking-wider block">Identity Badge</span>
                <span className="font-mono text-lg text-[#2ECC71] font-bold">{userIdentity}</span>
              </div>
              <div>
                <span className="text-xs opacity-40 uppercase tracking-wider block">Home Node</span>
                <span className="text-sm font-medium">{homeFrequency.name} Channel</span>
              </div>
            </div>
          )}
        </div>

        {/* Restored Fixed Navigation Dock Footer */}
        <nav className="absolute bottom-4 inset-x-6 h-16 bg-[#121A15]/90 border border-[#1E3A27]/60 rounded-xl backdrop-blur-md flex justify-around items-center px-2 z-20 shadow-xl">
          <button onClick={() => setActiveTab('feeds')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'feeds' ? 'text-[#2ECC71]' : 'text-white/40'}`}>
            <Radio size={18} />
            <span className="text-[10px] font-bold">Feeds</span>
          </button>
          <button onClick={() => setActiveTab('spill')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'spill' ? 'text-[#2ECC71]' : 'text-white/40'}`}>
            <Send size={18} />
            <span className="text-[10px] font-bold">Spill</span>
          </button>
          <button onClick={() => setActiveTab('lowkey')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'lowkey' ? 'text-[#2ECC71]' : 'text-white/40'}`}>
            <MessageCircle size={18} />
            <span className="text-[10px] font-bold">Lowkey</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-[#2ECC71]' : 'text-white/40'}`}>
            <User size={18} />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </nav>

      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<'onboarding' | 'frequency' | 'dashboard'>('onboarding');
  const [userIdentity, setUserIdentity] = useState<string>('');
  const [homeFrequency, setHomeFrequency] = useState<FrequencyDef | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const storedIdentity = localStorage.getItem("cipher_identity") || `Anonymous_${user.uid.slice(0, 5)}`;
        setUserIdentity(storedIdentity);
        
        const savedFreqId = localStorage.getItem("cipher_freq");
        const matchingFreq = FREQUENCIES.find(f => f.id === savedFreqId);
        
        if (matchingFreq) {
          setHomeFrequency(matchingFreq);
          setStep('dashboard');
        } else {
          setStep('frequency');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = async (generatedIdentity: string) => {
    setIsLoggingIn(true);
    try {
      await initializeAnonymousUser();
      localStorage.setItem("cipher_identity", generatedIdentity);
      setUserIdentity(generatedIdentity);
      setStep('frequency');
    } catch (err) {
      console.error("Auth flow initialization error: ", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFrequencySelect = (selectedFreq: FrequencyDef) => {
    localStorage.setItem("cipher_freq", selectedFreq.id);
    setHomeFrequency(selectedFreq);
    setStep('dashboard');
  };

  return (
    <div className="relative w-screen h-screen bg-[#0B0F0C] text-white overflow-hidden select-none antialiased">
      <AnimatePresence mode="wait">
        {step === 'onboarding' && <OnboardingScreen onComplete={handleOnboardingComplete} isLoggingIn={isLoggingIn} />}
        {step === 'frequency' && <FrequencySelectionScreen identity={userIdentity} onSelect={handleFrequencySelect} />}
        {step === 'dashboard' && homeFrequency && <DashboardScreen homeFrequency={homeFrequency} userIdentity={userIdentity} />}
      </AnimatePresence>
    </div>
  );
}
