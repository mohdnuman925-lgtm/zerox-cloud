import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  // Read persisted preference; default to true
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('zerox_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const audioCtxRef = useRef(null);
  const lastClickTimeRef = useRef(0);

  // Initialize or resume AudioContext lazily on user gesture
  const getAudioContext = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
      return null;
    }
  }, []);

  // Save preference whenever it changes
  useEffect(() => {
    localStorage.setItem('zerox_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  // Unlock AudioContext on first user interaction
  useEffect(() => {
    const unlock = () => {
      getAudioContext();
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [getAudioContext]);

  /**
   * High-Fidelity Synthesized Sound FX
   * Generates ultra-crisp, tactile UI audio using Web Audio API with zero latency.
   */
  const playSound = useCallback((type = 'click') => {
    if (!soundEnabled) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (type === 'toggle') {
        // High-tech crisp toggle switch sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.025);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'success') {
        // Futuristic dual-tone confirmation chime
        [587.33, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.06;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.14, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.13);
        });
      } else if (type === 'pop') {
        // Soft bubble pop / tab switch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.03);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else {
        // Default: Tactical Mechanical Switch Click (satisfying Razer / Omron haptic feel)
        // 1. Filtered micro-noise burst for transient snap
        const bufferSize = Math.floor(ctx.sampleRate * 0.012); // 12ms burst
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(3200, now);
        noiseFilter.Q.setValueAtTime(3.5, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        // 2. Tonal micro-body bump (tactile mechanical feedback)
        const osc = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.018);

        bodyGain.gain.setValueAtTime(0.16, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        osc.connect(bodyGain);
        bodyGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }, [soundEnabled, getAudioContext]);

  // Global Click Listener: Automatically plays clicking sound on any interactive element
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!soundEnabled) return;

      // Find nearest interactive ancestor
      const target = e.target.closest(
        'button, a, input, select, textarea, summary, [role="button"], [role="tab"], [role="menuitem"], .clickable, [data-sound]'
      );

      if (!target) return;

      // Check if disabled or opted out
      if (target.disabled || target.getAttribute('data-sound') === 'none') {
        return;
      }

      // Throttle double clicks within 35ms
      const now = performance.now();
      if (now - lastClickTimeRef.current < 35) return;
      lastClickTimeRef.current = now;

      // Check for custom sound type attribute
      const customSound = target.getAttribute('data-sound') || 'click';
      playSound(customSound);
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
    };
  }, [soundEnabled, playSound]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        // Play an immediate feedback tick when enabling
        setTimeout(() => playSound('toggle'), 50);
      }
      return next;
    });
  }, [playSound]);

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        playClick: playSound,
        playSound
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    return {
      soundEnabled: true,
      setSoundEnabled: () => {},
      toggleSound: () => {},
      playClick: () => {},
      playSound: () => {}
    };
  }
  return context;
};
