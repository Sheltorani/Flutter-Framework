import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Droplets, MessageCircle, User, X, Send, Lock, ArrowLeft, Home } from 'lucide-react';

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
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

// --- Shared Background Component ---
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

// --- Screen 1: Onboarding ---
const OnboardingScreen = ({ onComplete }: { onComplete: (id: string) => void }) => {
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
        {/* Header */}
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

        {/* Identity Card */}
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

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onComplete(identity)}
          className="w-full py-4 rounded-[12px] bg-[#2ECC71] hover:shadow-[0_0_20px_rgba(46,204,113,0.25)] text-[#0B0F0C] font-bold text-[18px] tracking-wide transition-all duration-300 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ y: '-100%' }}
            animate={{ y: '200%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <span className="relative z-10 block">Set Home Frequency</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- Screen 2: Frequency Selection ---
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

// --- Spill Card Component ---
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
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-[13px]" style={{ color: activeFrequency.textColor }}>
          {item.author}
        </span>
        <span className="text-[#8E9A92] text-[11px]">{item.timeAgo}</span>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-white text-[15px] leading-[1.4] whitespace-pre-wrap">{item.text}</p>
      </div>

      {/* Footer */}
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

// --- Screen 3: Dashboard ---
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
    if (!spillText.trim()) return;
    const newCard: SpillCardData = {
      id: Date.now().toString(),
      author: userIdentity,
      timeAgo: 'Just Now',
      text: spillText.trim(),
      parentFrequencyId: homeFrequency.id,
    };

    // Always post to home frequency regardless of what's being monitored
    setFeeds(prev => ({
      ...prev,
      [homeFrequency.id]: [newCard, ...(prev[homeFrequency.id] || [])],
    }));
    setUserTotalSpillsCount(prev => prev + 1);
    setSpillText('');
    setIsSpillSheetOpen(false);
    // Snap back to home frequency feed
    setCurrentMonitoredFrequency(homeFrequency);
    setActiveTab('feeds');

    showToast(`Spill routed directly to your home feed (${homeFrequency.name})!`, 'success', homeFrequency.textColor);
  };

  const handleReplyClick = (card: SpillCardData) => {
    if (card.author === userIdentity) {
      showToast('You cannot build a private room with yourself.', 'error');
    } else {
      setLowkeyTargetCard(card);
      setIsLowkeySheetOpen(true);
    }
  };

  const _dispatchNewThread = () => {
    if (!chatText.trim() || !lowkeyTargetCard) return;
    const newThread: LowkeyThread = {
      id: Date.now().toString(),
      targetPostAuthor: lowkeyTargetCard.author,
      originalSnippet: lowkeyTargetCard.text,
      messages: [
        { sender: lowkeyTargetCard.author, message: 'This is bad', timestamp: new Date() },
        { sender: lowkeyTargetCard.author, message: 'Is it true', timestamp: new Date() },
        { sender: userIdentity, message: chatText.trim(), timestamp: new Date() },
      ],
    };
    setPrivateThreads(prev => [newThread, ...prev]);
    setChatText('');
    setIsLowkeySheetOpen(false);
    setLowkeyTargetCard(null);
    setActiveTab('lowkey');
  };

  const _dispatchInnerMessage = () => {
    if (!innerChatText.trim() || !activeChatThread) return;
    const newMsg: ChatMessage = {
      sender: userIdentity,
      message: innerChatText.trim(),
      timestamp: new Date(),
    };
    const updatedThread = { ...activeChatThread, messages: [...activeChatThread.messages, newMsg] };
    setPrivateThreads(prev => prev.map(t => (t.id === activeChatThread.id ? updatedThread : t)));
    setActiveChatThread(updatedThread);
    setInnerChatText('');
  };

  const tabs = [
    { id: 'feeds', label: 'Feeds', icon: Layers },
    { id: 'spill', label: 'Spill', icon: Droplets },
    { id: 'lowkey', label: 'Lowkey', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const activeFeed = feeds[currentMonitoredFrequency.id] || [];

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 w-full h-full flex flex-col z-10 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${homeFrequency.gradient[0]}, ${homeFrequency.gradient[1]})`,
      }}
    >
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl font-bold text-[14px] shadow-lg whitespace-nowrap text-center max-w-[90vw]"
            style={{
              backgroundColor: toastMessage.type === 'error' ? '#E74C3C' : (toastMessage.bgColor || '#2ECC71'),
              color: toastMessage.type === 'error' ? 'white' : '#0B0F0C',
            }}
          >
            {toastMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full px-6 pt-12 pb-4 flex justify-between items-start relative z-10 shrink-0"
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-[#8E9A92] text-[11px] tracking-[1.5px] font-bold uppercase">
            Current Frequency
          </span>
          <span className="text-white text-[24px] font-bold tracking-tight">
            {currentMonitoredFrequency.name}
          </span>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-opacity-50 mt-1 shadow-lg"
          style={{
            backgroundColor: `${homeFrequency.primaryColor}4D`,
            borderColor: homeFrequency.primaryColor,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] shadow-[0_0_8px_#2ECC71] animate-pulse" />
          <span className="text-[12px] text-white/90 font-medium">Active Dome</span>
        </div>
      </motion.div>

      {/* Main Area */}
      <motion.div
        className={`flex-1 relative z-10 scrollbar-hide ${activeTab === 'lowkey' && activeChatThread ? 'flex flex-col overflow-hidden' : 'overflow-y-auto px-4 pb-6'}`}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'feeds' && (
            <motion.div
              key="feeds"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pt-2"
            >
              {/* Frequency Switcher Pills */}
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
                {allFrequencies.map(freq => {
                  const isActive = currentMonitoredFrequency.id === freq.id;
                  const isHome = homeFrequency.id === freq.id;
                  return (
                    <button
                      key={freq.id}
                      onClick={() => setCurrentMonitoredFrequency(freq)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 shrink-0"
                      style={{
                        backgroundColor: isActive ? freq.textColor : 'transparent',
                        color: isActive ? '#0B0F0C' : freq.textColor,
                        border: `1px solid ${freq.textColor}${isActive ? 'ff' : '66'}`,
                      }}
                    >
                      {isHome && <Home size={11} className="shrink-0" />}
                      {freq.name}
                    </button>
                  );
                })}
              </div>

              {/* Feed Cards */}
              {activeFeed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-8">
                  <p className="text-[#8E9A92] text-[15px]">No transmissions yet in this frequency.</p>
                </div>
              ) : (
                activeFeed.map(item => (
                  <SpillCard
                    key={item.id}
                    item={item}
                    activeFrequency={currentMonitoredFrequency}
                    onReply={handleReplyClick}
                  />
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'lowkey' && (
            <motion.div
              key="lowkey"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`h-full ${activeChatThread ? 'flex flex-col bg-[#0B0F0C]' : privateThreads.length === 0 ? 'min-h-[300px] flex flex-col items-center justify-center text-center px-8' : 'pt-2 space-y-4 pb-4'}`}
            >
              {activeChatThread ? (
                <>
                  {/* Chat Room Header */}
                  <div className="flex items-center px-4 py-3 border-b border-white/5 bg-[#0B0F0C] shrink-0">
                    <button
                      onClick={() => setActiveChatThread(null)}
                      className="p-2 -ml-2 mr-2 text-[#8E9A92] hover:text-white transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1 flex flex-col">
                      <span className="font-bold text-[16px]" style={{ color: homeFrequency.textColor }}>
                        {activeChatThread.targetPostAuthor}
                      </span>
                      <span className="text-[#8E9A92] text-[11px] uppercase tracking-wider mt-0.5">
                        Encrypted Secure Tunnel
                      </span>
                    </div>
                  </div>

                  {/* Snippet Banner */}
                  <div className="w-full bg-white/[0.02] p-3 text-center border-b border-white/5 shrink-0">
                    <span className="text-[#8E9A92] text-[13px] italic">
                      Original Thread Snippet: "
                      {activeChatThread.originalSnippet.length > 45
                        ? activeChatThread.originalSnippet.slice(0, 45) + '...'
                        : activeChatThread.originalSnippet}
                      "
                    </span>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col scrollbar-hide">
                    {activeChatThread.messages.map((msg, idx) => {
                      const isMe = msg.sender === userIdentity;
                      return (
                        <div key={idx} className={`max-w-[75%] flex flex-col ${isMe ? 'self-end' : 'self-start'}`}>
                          <div
                            className={`px-4 py-3 mb-3 text-[15px] text-white leading-relaxed border ${isMe ? 'bg-[#122216] border-[#1E3A27]' : 'bg-[#1A1212] border-[#3A1E1E]'}`}
                            style={{ borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px' }}
                          >
                            {msg.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input Bar */}
                  <div className="p-3 border-t border-white/5 bg-[#0B0F0C] shrink-0">
                    <div className="flex items-end gap-2 bg-white/5 rounded-[24px] px-2 py-1.5 focus-within:ring-1 focus-within:ring-white/10 transition-shadow">
                      <textarea
                        value={innerChatText}
                        onChange={e => setInnerChatText(e.target.value)}
                        placeholder="Type encrypted reply..."
                        rows={1}
                        className="flex-1 bg-transparent border-none text-white text-[15px] px-3 py-2 max-h-[100px] outline-none resize-none placeholder:text-white/30"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            _dispatchInnerMessage();
                          }
                        }}
                      />
                      <button
                        onClick={_dispatchInnerMessage}
                        disabled={!innerChatText.trim()}
                        className="p-2 shrink-0 disabled:opacity-50 transition-opacity"
                        style={{ color: homeFrequency.textColor }}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : privateThreads.length === 0 ? (
                <div className="flex flex-col items-center">
                  <Lock size={32} className="text-[#8E9A92] mb-4 opacity-50" />
                  <p className="text-white text-[16px] font-bold mb-2">No Private Rooms Yet</p>
                  <p className="text-[#8E9A92] text-[14px] leading-relaxed max-w-[240px]">
                    Tap the reply icon on any transmission to start an encrypted thread.
                  </p>
                </div>
              ) : (
                privateThreads.map(thread => (
                  <div
                    key={thread.id}
                    onClick={() => setActiveChatThread(thread)}
                    className="bg-[rgba(14,20,17,0.7)] rounded-[16px] border border-white/[0.06] p-[18px] backdrop-blur-md cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: homeFrequency.textColor }}>
                        Private Room
                      </span>
                      <span className="text-[#8E9A92] text-[11px]">Just Now</span>
                    </div>
                    <h4 className="text-white font-bold text-[14px] mb-1">{thread.targetPostAuthor}</h4>
                    <p className="text-[#8E9A92] text-[13px] italic mb-4 truncate">"{thread.originalSnippet}"</p>
                    <div className="flex justify-end mt-2">
                      <div
                        className="rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[4px] px-4 py-2.5 max-w-[85%]"
                        style={{ backgroundColor: homeFrequency.textColor }}
                      >
                        <p className="text-[#0B0F0C] text-[14px] font-medium leading-[1.4]">
                          {thread.messages[thread.messages.length - 1].message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-8"
            >
              <p className="text-[#8E9A92] text-[15px] leading-relaxed max-w-xs border border-white/5 bg-white/5 p-6 rounded-[20px] backdrop-blur-sm">
                Anonymous profile and frequency history.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom Nav */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 100, delay: 0.4 }}
        className="relative z-20 bg-[#0B0F0C] border-t border-white/10 pb-[env(safe-area-inset-bottom)] shrink-0"
      >
        <div className="flex justify-around items-center px-4 py-3">
          {tabs.map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'spill') {
                    setIsSpillSheetOpen(true);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className="flex flex-col items-center gap-1.5 p-2 w-16 transition-all duration-300 relative"
              >
                {isSelected && tab.id !== 'spill' && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-3 w-8 h-1 rounded-full opacity-60"
                    style={{ backgroundColor: homeFrequency.textColor }}
                  />
                )}
                <tab.icon
                  className={`w-[22px] h-[22px] transition-colors duration-300 ${isSelected && tab.id !== 'spill' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                  style={{ color: isSelected && tab.id !== 'spill' ? homeFrequency.textColor : '#8E9A92' }}
                  strokeWidth={isSelected && tab.id !== 'spill' ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${isSelected && tab.id !== 'spill' ? 'opacity-100' : 'opacity-50'}`}
                  style={{ color: isSelected && tab.id !== 'spill' ? homeFrequency.textColor : '#8E9A92' }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Spill Sheet */}
      <AnimatePresence>
        {isSpillSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSpillSheetOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 inset-x-0 bg-[#0E1411] z-50 rounded-t-[24px] p-6 pb-[max(24px,env(safe-area-inset-bottom))]"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-[18px]">Spill to {homeFrequency.name}</h2>
                <button onClick={() => setIsSpillSheetOpen(false)} className="text-[#8E9A92] hover:text-[#2ECC71] transition-colors">
                  <X size={24} />
                </button>
              </div>

              <textarea
                autoFocus
                value={spillText}
                onChange={e => setSpillText(e.target.value)}
                rows={5}
                placeholder="What's weighing down your thoughts lowkey?..."
                className="w-full bg-black/30 rounded-[12px] p-4 text-white text-[16px] placeholder:text-white/30 outline-none resize-none focus:ring-1 focus:ring-white/10"
              />

              <div className="h-5" />

              <button
                onClick={_dispatchNewTransmission}
                className="w-full py-[14px] rounded-[12px] flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                style={{ backgroundColor: homeFrequency.textColor }}
              >
                <Send size={18} className="text-[#0B0F0C]" />
                <span className="text-[#0B0F0C] font-bold">Broadcast Secretly</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lowkey Reply Sheet */}
      <AnimatePresence>
        {isLowkeySheetOpen && lowkeyTargetCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLowkeySheetOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 inset-x-0 bg-[#0F1311] z-50 rounded-t-[24px] p-6 pb-[max(24px,env(safe-area-inset-bottom))]"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#8E9A92] font-medium text-[14px]">
                  Anonymously replying to{' '}
                  <span className="text-white font-bold">{lowkeyTargetCard.author}</span>
                </h2>
                <button onClick={() => setIsLowkeySheetOpen(false)} className="text-[#8E9A92] hover:text-[#2ECC71] transition-colors">
                  <X size={24} />
                </button>
              </div>

              <p
                className="text-white/60 italic text-[14px] mb-4 pl-3 border-l-2"
                style={{ borderColor: currentMonitoredFrequency.textColor }}
              >
                "
                {lowkeyTargetCard.text.length > 35
                  ? lowkeyTargetCard.text.slice(0, 35) + '...'
                  : lowkeyTargetCard.text}
                "
              </p>

              <textarea
                autoFocus
                value={chatText}
                onChange={e => setChatText(e.target.value)}
                rows={1}
                placeholder="Send an encrypted whisper..."
                className="w-full bg-black/30 rounded-[12px] p-4 text-white text-[16px] placeholder:text-white/30 outline-none resize-none focus:ring-1 focus:ring-white/10 mb-5"
              />

              <button
                onClick={_dispatchNewThread}
                className="w-full py-[14px] rounded-[12px] flex items-center justify-center gap-2 transition-transform active:scale-[0.98] bg-[#2ECC71]"
              >
                <span className="text-[#0B0F0C] font-bold">Initialize Thread</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- App Root ---
type Screen = 'onboarding' | 'frequency' | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [identity, setIdentity] = useState<string | null>(null);
  const [homeFrequency, setHomeFrequency] = useState<FrequencyDef | null>(null);

  const handleOnboardingComplete = (id: string) => {
    setIdentity(id);
    setScreen('frequency');
  };

  const handleFrequencySelect = (freq: FrequencyDef) => {
    setHomeFrequency(freq);
    setScreen('dashboard');
  };

  return (
    <div className="min-h-[100dvh] w-full relative bg-[#0B0F0C] text-white overflow-hidden font-sans selection:bg-[#2ECC71] selection:text-[#0B0F0C]">
      <AnimatePresence mode="wait">
        {screen === 'onboarding' && (
          <OnboardingScreen key="onboarding" onComplete={handleOnboardingComplete} />
        )}
        {screen === 'frequency' && identity && (
          <FrequencySelectionScreen key="frequency" identity={identity} onSelect={handleFrequencySelect} />
        )}
        {screen === 'dashboard' && homeFrequency && identity && (
          <DashboardScreen
            key="dashboard"
            homeFrequency={homeFrequency}
            userIdentity={identity}
            allFrequencies={FREQUENCIES}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
