import React from 'react';
import minecraftLogo from '../../assets/logos/minecraft-logo.svg';
import rustLogo from '../../assets/logos/rust-logo.svg';
import cs2Logo from '../../assets/logos/cs2-logo.svg';

export const GameLogo = ({ game, className = 'w-6 h-6', alt }) => {
  const normalized = (game || '').toLowerCase();

  if (normalized.includes('mine') || normalized === 'mc') {
    return (
      <img
        src={minecraftLogo}
        alt={alt || 'Minecraft logo'}
        className={`object-contain inline-block shrink-0 ${className}`}
        loading="eager"
      />
    );
  }

  if (normalized.includes('rust')) {
    return (
      <img
        src={rustLogo}
        alt={alt || 'Rust logo'}
        className={`object-contain inline-block shrink-0 ${className}`}
        loading="eager"
      />
    );
  }

  if (normalized.includes('cs') || normalized.includes('counter') || normalized.includes('strike')) {
    return (
      <img
        src={cs2Logo}
        alt={alt || 'Counter-Strike 2 logo'}
        className={`object-contain inline-block shrink-0 ${className}`}
        loading="eager"
      />
    );
  }

  return null;
};
