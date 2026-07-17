import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Circle, Layers, Droplets, MessageCircle, User } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState<string | null>(null);

  const generateIdentity = () => {
    if (identity) return; // Prevent regenerating if already locked in
    setLoading(true);
    setTimeout(() => {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const num = Math.floor(100 + Math.random() * 900);
      const generatedId = `${adj}_${noun}-${num}`;
      
      setIdentity(generatedId);
      setLoading(false);
      
      // Wait 1 second after showing identity, then transition
      setTimeout(() => {
        onComplete(generatedId);
      }, 1000);
    }, 1500);
  };

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

        {/* Identity Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full relative group"
        >
          {identity && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute -inset-0.5 bg-[#2ECC71] rounded-[18px] opacity-20 blur-md transition-opacity"
            />
          )}

          <div className="w-full bg-[#121A15] border border-[#1E3A27] rounded-[16px] p-6 relative flex flex-col items-center justify-center min-h-[140px] shadow-2xl overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#2ECC71]/30 to-transparent" />
            <h2 className="text-[#2ECC71] text-[12px] uppercase tracking-[0.2em] font-bold mb-5 opacity-90">
              Your Assigned Identity
            </h2>
            <div className="flex items-center justify-center min-h-[32px]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className="w-7 h-7 text-[#2ECC71] animate-spin" />
                  </motion.div>
                ) : identity ? (
                  <motion.div
                    key="identity"
                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-white text-[24px] font-bold tracking-wider font-mono text-center"
                  >
                    {identity}
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[#4A5D52] text-[16px] font-mono text-center tracking-tight"
                  >
                    Searching the frequency...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="h-[40px]" />

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          whileHover={!loading && !identity ? { scale: 1.02, filter: 'brightness(1.1)' } : {}}
          whileTap={!loading && !identity ? { scale: 0.98 } : {}}
          onClick={generateIdentity}
          disabled={loading || !!identity}
          className={`w-full py-4 rounded-[12px] text-[#0B0F0C] font-bold text-[18px] tracking-wide transition-all duration-300 relative overflow-hidden group
            ${loading || identity ? 'bg-[#1a7340] cursor-not-allowed opacity-80' : 'bg-[#2ECC71] hover:shadow-[0_0_20px_rgba(46,204,113,0.25)]'}
          `}
        >
          {!loading && !identity && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ y: '-100%' }}
              animate={{ y: '200%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <span className="relative z-10 block">
            {identity ? "Identity Locked" : "Enter My Frequency"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- Screen 2: Frequency Selection ---
const FrequencySelectionScreen = ({ identity, onSelect }: { identity: string, onSelect: (freq: typeof FREQUENCIES[0]) => void }) => {
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
            Welcome, <span className="font-mono text-[#2ECC71]/90">{identity}</span>
          </span>
          <h1 className="text-white text-[28px] font-bold tracking-[-0.5px] mt-2 mb-3 leading-tight">
            Choose Your Home Frequency
          </h1>
          <p className="text-[#8E9A92] text-[14px] leading-relaxed">
            This locks your dashboard environment. You can only drop confessions within your chosen home space.
          </p>
        </motion.div>

        <motion.div 
          className="flex-1 overflow-y-auto space-y-4 pb-12 scrollbar-hide"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
          }}
        >
          {FREQUENCIES.map((freq) => (
            <motion.div
              key={freq.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
              }}
              whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(freq)}
              className="w-full p-6 rounded-[16px] text-left relative overflow-hidden group cursor-pointer border-[1.5px] shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${freq.gradient[0]}, ${freq.gradient[1]})`,
                borderColor: `${freq.primaryColor}80` // 50% opacity
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{ background: `radial-gradient(circle at top right, ${freq.primaryColor}40 0%, transparent 60%)`}} />
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                 <h3 className="text-[22px] font-bold" style={{ color: freq.textColor }}>{freq.name}</h3>
                 <Circle className="w-5 h-5 opacity-40 text-white mt-1 group-hover:opacity-80 transition-opacity" />
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

// --- Screen 3: Dashboard ---
const DashboardScreen = ({ frequency }: { frequency: typeof FREQUENCIES[0] }) => {
  const [activeTab, setActiveTab] = useState('feeds');

  const tabs = [
    { id: 'feeds', label: 'Feeds', icon: Layers },
    { id: 'spill', label: 'Spill', icon: Droplets },
    { id: 'lowkey', label: 'Lowkey', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <motion.div 
      key="dashboard"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 w-full h-full flex flex-col z-10"
      style={{
        background: `linear-gradient(to bottom, ${frequency.gradient[0]}, ${frequency.gradient[1]})`
      }}
    >
      {/* Noise overlay for Dashboard */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full px-6 pt-12 pb-6 flex justify-between items-start relative z-10"
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-[#8E9A92] text-[11px] tracking-[1.5px] font-bold uppercase">
            Current Frequency
          </span>
          <span className="text-white text-[24px] font-bold tracking-tight">
            {frequency.name}
          </span>
        </div>
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-opacity-50 mt-1 shadow-lg"
          style={{
            backgroundColor: `${frequency.primaryColor}4D`, // 30% opacity approx
            borderColor: frequency.primaryColor
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] shadow-[0_0_8px_#2ECC71] animate-pulse" />
          <span className="text-[12px] text-white/90 font-medium">Active Dome</span>
        </div>
      </motion.div>

      {/* Main Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex-1 flex items-center justify-center px-8 relative z-10 text-center"
      >
        <p className="text-[#8E9A92] text-[15px] max-w-xs leading-relaxed border border-white/5 bg-white/5 p-6 rounded-[20px] backdrop-blur-sm">
          Confession feeds locked to this environment will stream here...
        </p>
      </motion.div>

      {/* Bottom Nav */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 100, delay: 0.4 }}
        className="relative z-20 bg-[#0B0F0C]/80 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex justify-around items-center px-4 py-3">
          {tabs.map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1.5 p-2 w-16 transition-all duration-300 relative"
              >
                {isSelected && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-3 w-8 h-1 rounded-full opacity-60"
                    style={{ backgroundColor: frequency.textColor }}
                  />
                )}
                <tab.icon 
                  className={`w-[22px] h-[22px] transition-colors duration-300 ${isSelected ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`} 
                  style={{ color: isSelected ? frequency.textColor : '#8E9A92' }}
                  strokeWidth={isSelected ? 2.5 : 2}
                />
                <span 
                  className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${isSelected ? 'opacity-100' : 'opacity-50'}`}
                  style={{ color: isSelected ? frequency.textColor : '#8E9A92' }}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- App Root ---
type Screen = 'onboarding' | 'frequency' | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [identity, setIdentity] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<typeof FREQUENCIES[0] | null>(null);

  const handleOnboardingComplete = (id: string) => {
    setIdentity(id);
    setScreen('frequency');
  };

  const handleFrequencySelect = (freq: typeof FREQUENCIES[0]) => {
    setFrequency(freq);
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
        {screen === 'dashboard' && frequency && (
          <DashboardScreen key="dashboard" frequency={frequency} />
        )}
      </AnimatePresence>
    </div>
  );
}
