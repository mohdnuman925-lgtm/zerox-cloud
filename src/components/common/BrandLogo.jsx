import React from 'react';
import { Link } from 'react-router-dom';

const ZC_PATH =
  'M 193 10 L 219 10 L 232 13 L 256 26 L 268 39 L 246 61 L 230 46 L 213 40 L 195 41 L 178 49 L 170 57 L 162 71 L 160 80 L 159 123 L 155 135 L 150 143 L 141 152 L 129 159 L 117 162 L 10 162 L 10 140 L 92 45 L 14 44 L 12 43 L 13 12 L 141 12 L 140 37 L 61 129 L 62 131 L 93 131 L 114 130 L 123 123 L 125 119 L 126 107 L 127 72 L 132 56 L 143 39 L 153 29 L 172 16 L 192 11 Z M 166 112 L 182 127 L 197 133 L 216 133 L 226 130 L 240 120 L 246 113 L 268 134 L 268 136 L 257 147 L 240 158 L 217 164 L 190 163 L 171 156 L 157 146 L 158 140 L 163 131 L 166 113 Z';

/**
 * BrandLogo - Unified vector brand mark for ZEROX CLOUD matching video identity
 */
export const BrandLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg'
  showText = true,
  className = '',
  linkTo = '/',
  scriptFont = false,
}) => {
  const dimensions = {
    sm: { w: 32, h: 19, text: 'text-base', zcSize: 'w-7 h-4' },
    md: { w: 42, h: 25, text: 'text-lg', zcSize: 'w-9 h-5' },
    lg: { w: 60, h: 36, text: 'text-2xl', zcSize: 'w-14 h-8' },
  }[size] || { w: 42, h: 25, text: 'text-lg', zcSize: 'w-9 h-5' };

  const content = (
    <div className={`flex items-center gap-2.5 flex-shrink-0 group ${className}`}>
      {/* Geometric ZC Vector Icon */}
      <div className="relative flex items-center justify-center p-1 rounded-lg bg-white/[0.04] group- transition shadow-sm">
        <svg
          viewBox="0 0 300 180"
          className={`${dimensions.zcSize} overflow-visible`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={ZC_PATH}
            fill="#ffffff"
            fillRule="evenodd"
            className="transition-transform group-hover:scale-105 duration-200"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-bold ${dimensions.text} tracking-tight text-white flex items-center`}>
          ZorixCloud
        </span>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} aria-label="ZorixCloud Home">
        {content}
      </Link>
    );
  }

  return content;
};
