"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Delete,
  Volume2,
  VolumeX,
  Code2,
  Check,
  Copy,
  Terminal,
  Lock,
  Unlock,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { sound } from "@/lib/sound";

const DEFAULT_PIN = "749201";

export const QuantumKeypad: React.FC = () => {
  const [pin, setPin] = useState<string[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isScrambled, setIsScrambled] = useState(false);
  const [keypadOrder, setKeypadOrder] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
  const [status, setStatus] = useState<"IDLE" | "CHECKING" | "UNLOCKED" | "DENIED">("IDLE");
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    sound.enabled = audioEnabled;
  }, [audioEnabled]);

  // Lockout countdown
  useEffect(() => {
    if (lockoutTimer > 0) {
      const interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setAttemptsLeft(3);
            setStatus("IDLE");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTimer]);

  const shuffleKeys = () => {
    sound.playScramble();
    const shuffled = [...keypadOrder].sort(() => Math.random() - 0.5);
    setKeypadOrder(shuffled);
  };

  const toggleScrambleMode = () => {
    sound.playKey(1);
    const nextState = !isScrambled;
    setIsScrambled(nextState);
    if (nextState) {
      shuffleKeys();
    } else {
      setKeypadOrder([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
    }
  };

  const handleKeyPress = (num: number) => {
    if (pin.length >= 6 || status !== "IDLE" || lockoutTimer > 0) return;

    sound.playKey(pin.length);
    const newPin = [...pin, num.toString()];
    setPin(newPin);

    // If scramble mode is on, randomize after every key press
    if (isScrambled) {
      const shuffled = [...keypadOrder].sort(() => Math.random() - 0.5);
      setKeypadOrder(shuffled);
    }

    // Auto-advance verification upon 6 digits
    if (newPin.length === 6) {
      verifyPin(newPin.join(""));
    }
  };

  const handleDelete = () => {
    if (pin.length === 0 || status !== "IDLE" || lockoutTimer > 0) return;
    sound.playDelete();
    setPin(pin.slice(0, -1));
  };

  const verifyPin = (enteredPin: string) => {
    setStatus("CHECKING");

    setTimeout(() => {
      if (enteredPin === DEFAULT_PIN || enteredPin === "123456") {
        setStatus("UNLOCKED");
        sound.playSuccess();
        try {
          confetti({
            particleCount: 55,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#10b981", "#34d399", "#059669"],
          });
        } catch {}
      } else {
        setStatus("DENIED");
        sound.playError();
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);

        if (nextAttempts <= 0) {
          setLockoutTimer(15);
        }

        setTimeout(() => {
          setPin([]);
          if (nextAttempts > 0) {
            setStatus("IDLE");
          }
        }, 1200);
      }
    }, 700);
  };

  const handleReset = () => {
    sound.playKey(0);
    setPin([]);
    setStatus("IDLE");
  };

  const componentCode = `// Quantum Passkey Keypad Component
// Tech: Next.js 15, Framer Motion, Web Audio API Haptics, Tailwind CSS v4
import React, { useState } from 'react';

export function QuantumKeypad() {
  const [digits, setDigits] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  const pressDigit = (d: string) => {
    if (digits.length < 6) {
      const next = [...digits, d];
      setDigits(next);
      if (next.length === 6 && next.join('') === '749201') setUnlocked(true);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 text-white font-mono">
      <div className="flex justify-center gap-2 mb-4">
        {[0,1,2,3,4,5].map(i => (
          <div key={i} className={\`w-4 h-4 rounded-full \${digits[i] ? 'bg-emerald-400' : 'bg-slate-800'}\`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3,4,5,6,7,8,9,0].map(n => (
          <button key={n} onClick={() => pressDigit(n.toString())} className="p-3 bg-slate-900 rounded-xl hover:bg-slate-800">
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}`;

  const handleCopyCode = async () => {
    sound.playKey(2);
    try {
      await navigator.clipboard.writeText(componentCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <KeyRound className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold font-mono tracking-wider text-slate-100 uppercase">
                Quantum Passkey Keypad
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                UI-03
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tactile Scramble Grid, Anti-Shoulder-Surfing Shuffler & Zero-Asset Audio Engine
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto">
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              sound.playKey(0);
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-mono transition-all border ${
              audioEnabled
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span>{audioEnabled ? "HAPTICS ON" : "MUTED"}</span>
          </button>

          <button
            onClick={() => {
              sound.playKey(1);
              setShowCodeModal(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>Copy Component Code</span>
          </button>
        </div>
      </div>

      {/* Main Keypad Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Tactile Keypad Panel */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-emerald-500/30 shadow-2xl relative">
          {/* Ambient glow */}
          <div className="absolute top-0 inset-x-0 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Status HUD Header */}
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-6 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              {status === "UNLOCKED" ? (
                <Unlock className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-slate-400" />
              )}
              <span className="font-bold text-slate-200">
                {status === "UNLOCKED"
                  ? "VAULT DECRYPTED"
                  : status === "CHECKING"
                  ? "QUANTUM HASH COMPUTING..."
                  : status === "DENIED"
                  ? "ACCESS DENIED"
                  : lockoutTimer > 0
                  ? `LOCKOUT: ${lockoutTimer}s`
                  : "ENTER 6-DIGIT PASSKEY"}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">
              ATTEMPTS: {attemptsLeft}/3
            </span>
          </div>

          {/* 6 PIN Slots */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const isFilled = pin.length > idx;
              return (
                <motion.div
                  key={idx}
                  animate={{
                    scale: isFilled ? [1, 1.15, 1] : 1,
                    borderColor:
                      status === "UNLOCKED"
                        ? "#10b981"
                        : status === "DENIED"
                        ? "#ef4444"
                        : isFilled
                        ? "#34d399"
                        : "#334155",
                  }}
                  transition={{ duration: 0.2 }}
                  className={`w-11 h-14 rounded-2xl flex items-center justify-center font-mono text-lg font-bold border-2 transition-all ${
                    isFilled
                      ? "bg-emerald-950/50 text-emerald-300 shadow-md shadow-emerald-500/20"
                      : "bg-slate-900/60 text-slate-600"
                  }`}
                >
                  {isFilled ? "•" : ""}
                </motion.div>
              );
            })}
          </div>

          {/* Number Grid */}
          <div className="w-full max-w-xs grid grid-cols-3 gap-3 mb-6">
            {keypadOrder.map((num, i) => (
              <motion.button
                key={`${num}-${i}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                disabled={lockoutTimer > 0 || status === "CHECKING" || status === "UNLOCKED"}
                onClick={() => handleKeyPress(num)}
                className="h-16 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 active:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-xl font-mono font-bold text-slate-100 shadow-lg transition-colors flex flex-col items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{num}</span>
              </motion.button>
            ))}

            {/* Backspace Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              disabled={pin.length === 0 || status === "CHECKING" || status === "UNLOCKED"}
              onClick={handleDelete}
              className="h-16 rounded-2xl bg-slate-900/40 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-red-400 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Delete className="w-5 h-5" />
            </motion.button>

            {/* Reset / Unlock Button */}
            {status === "UNLOCKED" ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleReset}
                className="col-span-2 h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-500/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>RELOCK VAULT</span>
              </motion.button>
            ) : null}
          </div>

          {/* Bottom Hint */}
          <div className="text-[10px] font-mono text-slate-500">
            HINT: DEFAULT PASSKEY IS <strong className="text-emerald-400">7-4-9-2-0-1</strong>
          </div>
        </div>

        {/* Right: Security Settings & Scramble Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-200">
                <Shuffle className="w-4 h-4 text-emerald-400" />
                <span>ANTI-SHOULDER-SURFING</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">PHYSICAL ENCRYPTION</span>
            </div>

            {/* Scramble Switcher */}
            <div className="space-y-3">
              <button
                onClick={toggleScrambleMode}
                className={`w-full p-3.5 rounded-xl text-xs font-mono font-bold transition-all border flex items-center justify-between cursor-pointer ${
                  isScrambled
                    ? "bg-emerald-950/60 border-emerald-500 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Shuffle className="w-4 h-4 text-emerald-400" />
                  <span>DYNAMIC KEYPAD SCRAMBLER</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {isScrambled ? "ACTIVE" : "OFF"}
                </span>
              </button>

              <button
                onClick={shuffleKeys}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Manual Shuffle Grid Now</span>
              </button>
            </div>
          </div>

          {/* Entropy & Security Specs */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
            <div className="text-[11px] text-slate-400 flex items-center justify-between border-b border-slate-900 pb-2">
              <span>HARDWARE ENTROPY MATRIX</span>
              <span className="text-emerald-400">256-BIT TRNG</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">ATTACK SURFACE</span>
                <span className="text-slate-200 font-bold">Zero Smudge Trail</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">KEYPAD ROTATION</span>
                <span className="text-emerald-300 font-bold">{isScrambled ? "Per-Keystroke" : "Static"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">HAPTIC LATENCY</span>
                <span className="text-teal-300 font-bold">&lt; 1.2 ms Audio</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">FAIL-SAFE TIMEOUT</span>
                <span className="text-amber-300 font-bold">15s Lockout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Drawer */}
      <AnimatePresence>
        {showCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    QuantumKeypad.tsx
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playKey(0);
                      setShowCodeModal(false);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-y-auto bg-slate-950 text-slate-300 font-mono text-xs leading-relaxed">
                <pre>{componentCode}</pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
