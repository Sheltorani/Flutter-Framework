import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const adjectives = ["Shadow", "Ghost", "Cypress", "Mint", "Echo", "Lunar", "Sage", "Amber"];
const nouns = ["Pulse", "Wanderer", "Stardust", "Glitch", "Static", "Cinder", "Vibe"];

export default function App() {
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState<string | null>(null);

  const generateIdentity = () => {
    setLoading(true);
    setTimeout(() => {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const num = Math.floor(100 + Math.random() * 900);
      setIdentity(`${adj}_${noun}-${num}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0B0F0C] text-white overflow-hidden relative font-sans selection:bg-[#2ECC71] selection:text-[#0B0F0C]">
      
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,204,113,0.06)_0%,transparent_60%)]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        {/* Subtle Scanlines */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px]" />
      </div>

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
          {/* Subtle Glow behind the card when identity is shown */}
          {identity && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute -inset-0.5 bg-[#2ECC71] rounded-[18px] opacity-20 blur-md group-hover:opacity-30 transition-opacity"
            />
          )}

          <div className="w-full bg-[#121A15] border border-[#1E3A27] rounded-[16px] p-6 relative flex flex-col items-center justify-center min-h-[140px] shadow-2xl overflow-hidden">
            
            {/* Top accent line */}
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
          whileHover={!loading ? { scale: 1.02, filter: 'brightness(1.1)' } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          onClick={generateIdentity}
          disabled={loading}
          className={`w-full py-4 rounded-[12px] text-[#0B0F0C] font-bold text-[18px] tracking-wide transition-all duration-300 relative overflow-hidden group
            ${loading ? 'bg-[#1a7340] cursor-not-allowed opacity-80' : 'bg-[#2ECC71] hover:shadow-[0_0_20px_rgba(46,204,113,0.25)]'}
          `}
        >
          {/* Button scanline effect */}
          {!loading && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ y: '-100%' }}
              animate={{ y: '200%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <span className="relative z-10 block">
            {identity ? "Regenerate Frequency" : "Enter My Frequency"}
          </span>
        </motion.button>

      </div>
    </div>
  );
}
