import React, { useEffect, useRef, useState } from 'react';

export const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY || 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Warm embers rising from the campfire & subtle glowing particles
    const particleCount = 40;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.45 + 0.2,
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.4 ? 'rgba(255, 185, 70,' : 'rgba(197, 243, 106,'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.003;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${Math.max(0.1, Math.min(0.7, p.opacity))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color.includes('255, 185') ? '#FFB946' : '#C5F36A';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Cinematic Minecraft night sky & lanterns background with subtle scroll parallax */}
      <img
        src="/assets/minecraft-bg.jpg"
        alt="Minecraft Night Sky Background"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-65 transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `translate3d(0, ${-Math.min(scrollY * 0.05, 75)}px, 0) scale(1.06)`
        }}
      />

      {/* Atmospheric dark gradient overlay ensuring pristine contrast for text and glass cards */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080B0A]/65 via-[#080B0A]/78 to-[#080B0A]/92" />

      {/* Rising campfire embers canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-85"
      />
    </div>
  );
};
