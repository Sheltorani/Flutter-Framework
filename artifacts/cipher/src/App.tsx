import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Droplets, MessageCircle, User, 
  X, Send, Lock, ArrowLeft, Home, Mic, Film 
} from 'lucide-react';
import { auth, initializeAnonymousUser, onAuthStateChanged } from './firebase';

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
  isVoice?: boolean;
  isVideo?: boolean;
}

export interface LowkeyThread {
  id: string;
  targetPostAuthor: string;
  originalSnippet: string;
  messages: ChatMessage[];
}

export interface SpillCardData {
  id: string;
  author: string;
  timeAgo: string;
  text: string;
  parentFrequencyId: string;
  hasVoiceNote?: boolean;
  hasPixelVideo?: boolean;
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
          <motion.h1
            className="text-[42px] font-bold tracking-[0.2em] text-[#2ECC71] uppercase"
            animate={{ textShadow: ["0px 0px 4px rgba(46,204,113,0.2)", "0px 0px 15px rgba(46,204,113,0.5)", "0px 0px 4px rgba(46,204,113,0.2)"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            CIPHER
          </motion.h1>
          <p className="mt-2 text-[16px] text-[#8E9A92] tracking-wide font-medium">
            Keep it lowkey. Keep it real.
          </p>
        </motion.div>

        <div className="h-[80px]" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full relative group"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute -inset-0.5 bg-[#2ECC71] rounded-[18px] opacity-20 blur-md transition-opacity"
          />

          <div className="w-full bg-[#121A15] border border-[#1E3A27] rounded-[16px] p-6 relative flex flex-col items-center justify-center min-h-[140px] shadow-2xl overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#2ECC71]/30 to-transparent" />
            <h2 className="text-[#2ECC71] text-[12px] uppercase tracking-[0.2em] font-bold mb-5 opacity-90">
              Your Permanent Identity
            </h2>
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-white text-[24px] font-bold tracking-wider font-mono text-center"
            >
              {identity}
            </motion.div>
            <p className="text-[#8E9A92] text-[11px] mt-3 text-center">
              Locked for cryptographic trust and continuity.
            </p>
          </div>
        </motion.div>

        <div className="h-[40px]" />

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          whileHover={isLoggingIn ? {} : { scale: 1.02, filter: 'brightness(1.1)' }}
          whileTap={isLoggingIn ? {} : { scale: 0.98 }}
          disabled={isLoggingIn}
          onClick={() => onComplete(identity)}
          className="w-full py-4 rounded-[12px] bg-[#2ECC71] disabled:bg-[#2ECC71]/40 hover:shadow-[0_0_20px_rgba(46,204,113,0.25)] text-[#0B0F0C] font-bold text-[18px] tracking-wide transition-all duration-300 relative overflow-hidden group"
        >
          <span className="relative z-10 block">
            {isLoggingIn ? "Syncing Anonymity..." : "Set Home Frequency"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const FrequencySelectionScreen = ({
  identity,
  onSelect,
}: {
  identity: string;
  onSelect: (freq: FrequencyDef) => void;
}) => {
  return (
    <motion.div
      key="frequency"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 w-full h-full flex flex-col z-10 overflow-hidden"
    >
      <AmbientBackground />
      <div className="z-10 w-full max-w-md mx-auto px-6 pt-16 pb-8 flex flex-col h-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <span className="text-[#8E9A92] text-[14px] font-medium tracking-wide">
            Identity secure:{' '}
            <span className="font-mono text-[#2ECC71]/90">{identity}</span>
          </span>
          <h1 className="text-white text-[28px] font-bold tracking-[-0.5px] mt-2 mb-2 leading-tight">
            Choose Your Home Frequency
          </h1>
          <p className="text-[#8E9A92] text-[13px] leading-relaxed">
            All your Spills will broadcast here, but you can listen and reply to others dynamically.
          </p>
        </motion.div>

        <motion.div
          className="flex-1 overflow-y-auto space-y-4 pb-12 scrollbar-hide"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          }}
        >
          {FREQUENCIES.map((freq) => (
            <motion.div
              key={freq.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
              }}
              whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(freq)}
              className="w-full p-6 rounded-[16px] text-left relative overflow-hidden group cursor-pointer border-[1.5px] shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${freq.gradient[0]}, ${freq.gradient[1]})`,
                borderColor: `${freq.primaryColor}80`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${freq.primaryColor}40 0%, transparent 60%)` }}
              />
              <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className="text-[22px] font-bold" style={{ color: freq.textColor }}>
                  {freq.name}
                </h3>
                <div className="w-5 h-5 rounded-full border-2 mt-1 opacity-60" style={{ borderColor: freq.textColor }} />
              </div>
              <p className="text-white/70 text-[14px] leading-[1.4] relative z-10 font-medium">
                {freq.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const SpillCard = ({
  item,
  activeFrequency,
  onReply,
}: {
  item: SpillCardData;
  activeFrequency: FrequencyDef;
  onReply: (item: SpillCardData) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(14,20,17,0.7)] rounded-[16px] border border-white/[0.06] mb-4 p-[18px] backdrop-blur-md"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-[13px]" style={{ color: activeFrequency.textColor }}>
          {item.author}
        </span>
        <span className="text-[#8E9A92] text-[11px]">{item.timeAgo}</span>
      </div>

      <div className="mb-4">
        {item.hasVoiceNote && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-[10px] bg-orange-500/10 border border-orange-500/20 w-fit">
            <Mic size={13} className="text-orange-400 shrink-0" />
            <span className="text-orange-300 text-[12px] font-medium">Voice Note Attached</span>
          </div>
        )}
        {item.hasPixelVideo && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-[10px] bg-cyan-500/10 border border-cyan-500/20 w-fit">
            <Film size={13} className="text-cyan-400 shrink-0" />
            <span className="text-cyan-300 text-[12px] font-medium">Pixelated Video Attached</span>
          </div>
        )}
        <p className="text-white text-[15px] leading-[1.4] whitespace-pre-wrap">{item.text}</p>
      </div>

      <div className="flex items-center justify-end border-t border-white/[0.04] pt-3">
        <button
          onClick={() => onReply(item)}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity active:scale-95"
        >
          <span className="text-[#8E9A92] text-[12px] font-medium">Reply Lowkey</span>
          <MessageCircle size={14} style={{ color: activeFrequency.textColor }} />
        </button>
      </div>
    </motion.div>
  );
};

const DashboardScreen = ({
  homeFrequency,
  userIdentity,
  allFrequencies,
}: {
  homeFrequency: FrequencyDef;
  userIdentity: string;
  allFrequencies: FrequencyDef[];
}) => {
  const [activeTab, setActiveTab] = useState('feeds');
  const [currentMonitoredFrequency, setCurrentMonitoredFrequency] = useState<FrequencyDef>(homeFrequency);

  const [feeds, setFeeds] = useState<Record<string, SpillCardData[]>>(() => ({
    the_lost: [
      { id: 'l1', author: 'Ghost_Spire-112', timeAgo: '2m ago', text: 'Cleaning out his room today. Found an old notebook containing sketches of us.', parentFrequencyId: 'the_lost' },
    ],
    the_lovers: [
      { id: 'lv1', author: 'Amber_Cinder-901', timeAgo: '5m ago', text: 'You unfollowed me but you still look at my stories from an alternative account. I see you.', parentFrequencyId: 'the_lovers' },
    ],
    the_dreamers: [
      { id: 'd1', author: 'Neon_Glitch-774', timeAgo: '1m ago', text: 'Designing a full consumer tech platform completely from a mobile browser right now.', parentFrequencyId: 'the_dreamers' },
    ],
  }));

  const [isSpillSheetOpen, setIsSpillSheetOpen] = useState(false);
  const [spillText, setSpillText] = useState('');
  const [attachVoiceMock, setAttachVoiceMock] = useState(false);
  const [attachVideoMock, setAttachVideoMock] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error'; bgColor?: string } | null>(null);

  const [privateThreads, setPrivateThreads] = useState<LowkeyThread[]>([]);
  const [isLowkeySheetOpen, setIsLowkeySheetOpen] = useState(false);
  const [lowkeyTargetCard, setLowkeyTargetCard] = useState<SpillCardData | null>(null);
  const [chatText, setChatText] = useState('');

  const [innerChatText, setInnerChatText] = useState('');
  const [userTotalSpillsCount, setUserTotalSpillsCount] = useState(0);
  const [activeChatThread, setActiveChatThread] = useState<LowkeyThread | null>(null);

  const showToast = (text: string, type: 'success' | 'error', bgColor?: string) => {
    setToastMessage({ text, type, bgColor });
    setTimeout(() => setToastMessage(null), 2500);
  };

  const _dispatchNewTransmission = () => {
    if (!spillText.trim() && !attachVoiceMock && !attachVideoMock) return;
    const newCard: SpillCardData = {
      id: Date.now().toString(),
      author: userIdentity,
      timeAgo: 'Just Now',
      text: spillText.trim() || 'Sent an encrypted telemetry package.',
      parentFrequencyId: homeFrequency.id,
      hasVoiceNote: attachVoiceMock,
      hasPixelVideo: attachVideoMock,
    };

    setFeeds(prev => ({
      ...prev,
      [homeFrequency.id]: [newCard, ...(prev[homeFrequency.id] || [])],
    }));
    setUserTotalSpillsCount(prev => prev + 1);
    setSpillText('');
    setAttachVoiceMock(false);
    setAttachVideoMock(false);
    setIsSpillSheetOpen(false);
    setCurrentMonitoredFrequency(homeFrequency);
    setActiveTab('feeds');
  };

  const handleReplyClick = (card: SpillCardData) => {
    if (card.author === userIdentity) return;
    setLowkeyTargetCard(card);
    setIsLowkeySheetOpen(true);
  };

  const activeFeed = feeds[currentMonitoredFrequency.id] || [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white text-center">
      <h2 className="text-xl font-bold mb-2">Connected to Dome</h2>
      <p className="text-sm opacity-60 mb-6 font-mono">{userIdentity}</p>
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-left w-full max-w-sm">
        <span className="text-xs uppercase font-bold text-[#2ECC71]">Active Feed</span>
        <h3 className="text-lg font-bold mb-4">{currentMonitoredFrequency.name}</h3>
        {activeFeed.map(item => (
          <SpillCard key={item.id} item={item} activeFrequency={currentMonitoredFrequency} onReply={handleReplyClick} />
        ))}
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
        const storedIdentity = localStorage.getItem("cipher_identity") || user.displayName || `Anonymous_${user.uid.slice(0, 5)}`;
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
      console.error("Auth initialization workflow faulted: ", err);
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
    <div className="relative w-screen h-screen bg-[#0B0F0C] text-white overflow-hidden font-sans select-none antialiased">
      <AnimatePresence mode="wait">
        {step === 'onboarding' && (
          <OnboardingScreen onComplete={handleOnboardingComplete} isLoggingIn={isLoggingIn} />
        )}
        {step === 'frequency' && (
          <FrequencySelectionScreen identity={userIdentity} onSelect={handleFrequencySelect} />
        )}
        {step === 'dashboard' && homeFrequency && (
          <DashboardScreen homeFrequency={homeFrequency} userIdentity={userIdentity} allFrequencies={FREQUENCIES} />
        )}
      </AnimatePresence>
    </div>
  );
}
