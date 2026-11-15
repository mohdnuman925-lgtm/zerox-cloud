import React, { useEffect, useRef } from 'react';
import { ScrollReveal } from '../common/ScrollReveal';

export const GlobalInfrastructure = () => {
  const canvasRef = useRef(null);

  const locations = [
    { name: 'Noida', country: 'India, Asia', ping: '20MS', flag: '/assets/india.png' },
    { name: 'Mumbai', country: 'India, Asia', ping: '28MS', flag: '/assets/india.png' },
    { name: 'Karachi', country: 'Pakistan, Asia', ping: '42MS', flag: '/assets/pakistan.svg' },
    { name: 'Lahore', country: 'Pakistan, Asia', ping: '48MS', flag: '/assets/pakistan.svg' },
    { name: 'Singapore', country: 'Singapore, Asia', ping: '45MS', flag: '/assets/singapore.png' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    const radius = 150;
    const centerX = size / 2;
    const centerY = size / 2;
    let angle = 0;

    // Generate sphere surface points
    const points = [];
    const count = 420;
    for (let i = 0; i < count; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      points.push({
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta)
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Globe outer atmosphere halo ring matching video frame 013
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 18;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      angle += 0.005;

      // Project 3D sphere points to 2D
      points.forEach((p) => {
        const rotX = p.x * Math.cos(angle) - p.z * Math.sin(angle);
        const rotZ = p.x * Math.sin(angle) + p.z * Math.cos(angle);

        if (rotZ > -10) {
          const depthAlpha = (rotZ + radius) / (2 * radius);
          ctx.beginPath();
          ctx.arc(centerX + rotX, centerY + p.y, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.9})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Location Cards matching frame 013 */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal animation="fade-up">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                — NETWORK
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
                Global presence, local performance
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                Asia is live with Mumbai and Noida nodes. Europe and the Americas are rolling out next as ZEROX CLOUD expands to more low-latency regions.
              </p>
            </ScrollReveal>

            {/* Grid of regional nodes with staggered reveals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {locations.map((loc, idx) => (
                <ScrollReveal
                  key={idx}
                  animation="fade-up"
                  delay={idx * 70}
                >
                  <div className="p-4 rounded-2xl bg-[#0c140f]/5 backdrop-blur-2xl transition duration-200 flex items-center justify-between shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={loc.flag}
                        alt={loc.name}
                        className="w-6 h-4 object-cover rounded-sm shadow-sm"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{loc.name}</h4>
                        <p className="text-[11px] text-neutral-400">{loc.country}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 text-white">
                      {loc.ping}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal animation="fade-up" delay={400}>
              <p className="text-xs font-mono text-neutral-400 pt-1">
                Europe &amp; Americas — coming soon
              </p>
            </ScrollReveal>
          </div>

          {/* Right Interactive 3D Dot Globe with Glowing Halo Ring */}
          <ScrollReveal animation="zoom-in" delay={150} className="lg:col-span-5 flex justify-center items-center relative">
            <canvas
              ref={canvasRef}
              className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
