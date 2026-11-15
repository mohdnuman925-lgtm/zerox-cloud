import React, { useEffect, useRef, useState } from 'react';
import { ScrollReveal } from '../common/ScrollReveal';
import worldMapData from '../../data/worldMapData.json';

export const GlobalInfrastructure = () => {
  const canvasRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const targetYawRef = useRef(null);

  const locations = [
    { id: 'noida', name: 'Noida', country: 'India, Asia', ping: '20MS', flag: '/assets/india.png', lat: 28.5355, lon: 77.3910, status: 'LIVE' },
    { id: 'mumbai', name: 'Mumbai', country: 'India, Asia', ping: '28MS', flag: '/assets/india.png', lat: 19.0760, lon: 72.8777, status: 'LIVE' },
    { id: 'karachi', name: 'Karachi', country: 'Pakistan, Asia', ping: '42MS', flag: '/assets/pakistan.svg', lat: 24.8607, lon: 67.0011, status: 'LIVE' },
    { id: 'lahore', name: 'Lahore', country: 'Pakistan, Asia', ping: '48MS', flag: '/assets/pakistan.svg', lat: 31.5204, lon: 74.3587, status: 'LIVE' },
    { id: 'singapore', name: 'Singapore', country: 'Singapore, Asia', ping: '45MS', flag: '/assets/singapore.png', lat: 1.3521, lon: 103.8198, status: 'LIVE' },
  ];

  const upcomingLocations = [
    { id: 'frankfurt', name: 'Frankfurt', country: 'Germany, Europe', lat: 50.1109, lon: 8.6821, status: 'SOON' },
    { id: 'london', name: 'London', country: 'UK, Europe', lat: 51.5074, lon: -0.1278, status: 'SOON' },
    { id: 'newyork', name: 'New York', country: 'USA, Americas', lat: 40.7128, lon: -74.0060, status: 'SOON' },
  ];

  const networkConnections = [
    { from: 'mumbai', to: 'noida', ping: '20ms' },
    { from: 'mumbai', to: 'singapore', ping: '45ms' },
    { from: 'noida', to: 'singapore', ping: '55ms' },
    { from: 'mumbai', to: 'karachi', ping: '38ms' },
    { from: 'noida', to: 'lahore', ping: '35ms' },
    { from: 'mumbai', to: 'frankfurt', ping: '110ms', planned: true },
    { from: 'frankfurt', to: 'london', ping: '18ms', planned: true },
    { from: 'london', to: 'newyork', ping: '68ms', planned: true },
  ];

  // Focus globe on a specific location
  const handleFocusLocation = (loc) => {
    setSelectedLocation(loc.id);
    // India is around lon ~75 deg East. To bring a longitude to the front center:
    // yaw = -lon * (Math.PI / 180)
    targetYawRef.current = -loc.lon * (Math.PI / 180);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Retina display crisp resolution
    const displaySize = 460;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = displaySize * dpr;
    canvas.height = displaySize * dpr;
    ctx.scale(dpr, dpr);

    const radius = 175;
    const centerX = displaySize / 2;
    const centerY = displaySize / 2;

    // Initial orientation: focused on South Asia / Indian Ocean
    let yaw = -75 * (Math.PI / 180);
    let pitch = 0.32; // ~18 degree downward tilt towards Northern Hemisphere
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let time = 0;

    // Precompute 3D unit vectors for land points from Natural Earth
    const land3D = (worldMapData.points || []).map(([lat, lon]) => {
      const latR = lat * (Math.PI / 180);
      const lonR = lon * (Math.PI / 180);
      return {
        x: Math.cos(latR) * Math.sin(lonR),
        y: Math.sin(latR),
        z: Math.cos(latR) * Math.cos(lonR),
        lat,
        lon
      };
    });

    // Precompute 3D unit vectors for coastlines
    const coastlines3D = (worldMapData.coastlines || []).map((ring) =>
      ring.map(([lat, lon]) => {
        const latR = lat * (Math.PI / 180);
        const lonR = lon * (Math.PI / 180);
        return {
          x: Math.cos(latR) * Math.sin(lonR),
          y: Math.sin(latR),
          z: Math.cos(latR) * Math.cos(lonR)
        };
      })
    );

    // Map all nodes into 3D unit vectors
    const allNodes = [...locations, ...upcomingLocations].map((n) => {
      const latR = n.lat * (Math.PI / 180);
      const lonR = n.lon * (Math.PI / 180);
      return {
        ...n,
        vec: {
          x: Math.cos(latR) * Math.sin(lonR),
          y: Math.sin(latR),
          z: Math.cos(latR) * Math.cos(lonR)
        }
      };
    });

    // 3D project helper
    const project = (x, y, z, r = radius) => {
      // Rotate by yaw around Y axis
      const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
      const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);

      // Rotate by pitch around X axis
      const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
      const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);

      return {
        x: centerX + x1 * r,
        y: centerY - y2 * r,
        z: z2 * r,
        depth: z2 // > 0 is facing the user
      };
    };

    // Slerp for 3D arcs
    const slerp = (v1, v2, t, h = 0.16) => {
      const dot = Math.min(1, Math.max(-1, v1.x * v2.x + v1.y * v2.y + v1.z * v2.z));
      const omega = Math.acos(dot);
      if (omega < 0.001) return { x: v1.x, y: v1.y, z: v1.z, alt: 1 };
      const sinOmega = Math.sin(omega);
      const scale1 = Math.sin((1 - t) * omega) / sinOmega;
      const scale2 = Math.sin(t * omega) / sinOmega;
      const alt = 1 + h * Math.sin(Math.PI * t);
      return {
        x: (scale1 * v1.x + scale2 * v2.x) * alt,
        y: (scale1 * v1.y + scale2 * v2.y) * alt,
        z: (scale1 * v1.z + scale2 * v2.z) * alt,
        alt
      };
    };

    // Interactive Drag Controls
    const handleMouseDown = (e) => {
      isDragging = true;
      targetYawRef.current = null;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      dragVelocityX = 0;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      dragVelocityX = dx * 0.005;
      yaw += dx * 0.008;
      pitch = Math.max(-0.6, Math.min(0.8, pitch - dy * 0.006));
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        targetYawRef.current = null;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseX;
      const dy = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      yaw += dx * 0.008;
      pitch = Math.max(-0.6, Math.min(0.8, pitch - dy * 0.006));
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // Main Render Loop
    const render = () => {
      time += 0.016;

      // Smooth auto-rotation or animated easing to clicked location
      if (targetYawRef.current !== null) {
        // Smooth interpolation to target city
        const diff = targetYawRef.current - yaw;
        // Normalize angle diff to [-pi, pi]
        const normalized = Math.atan2(Math.sin(diff), Math.cos(diff));
        yaw += normalized * 0.06;
        if (Math.abs(normalized) < 0.002) {
          targetYawRef.current = null;
        }
      } else if (!isDragging) {
        // Natural inertial slowdown or steady orbit
        if (Math.abs(dragVelocityX) > 0.0001) {
          yaw += dragVelocityX;
          dragVelocityX *= 0.94;
        } else {
          yaw -= 0.0025; // Gentle westward real Earth planetary spin
        }
      }

      ctx.clearRect(0, 0, displaySize, displaySize);

      // 1. Outer Deep Atmospheric Corona Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        radius - 10,
        centerX,
        centerY,
        radius + 38
      );
      glowGrad.addColorStop(0, 'rgba(197, 243, 106, 0.18)');
      glowGrad.addColorStop(0.35, 'rgba(52, 211, 153, 0.08)');
      glowGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.02)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 38, 0, Math.PI * 2);
      ctx.fill();

      // 2. Earth Sphere Body with Deep Shading & Specular Back-Light
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      const sphereGrad = ctx.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.35,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      sphereGrad.addColorStop(0, '#0f1f14');
      sphereGrad.addColorStop(0.5, '#0a160e');
      sphereGrad.addColorStop(0.9, '#060d09');
      sphereGrad.addColorStop(1, '#030805');
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Inner horizon shadow vignette
      const innerVignette = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.65,
        centerX,
        centerY,
        radius
      );
      innerVignette.addColorStop(0, 'rgba(0,0,0,0)');
      innerVignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
      ctx.fillStyle = innerVignette;
      ctx.fill();

      // Clip subsequent continent drawings inside the spherical horizon
      ctx.clip();

      // 3. Subtle Latitude & Longitude Graticule Rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      // Equator
      ctx.beginPath();
      for (let lon = -180; lon <= 180; lon += 5) {
        const latR = 0;
        const lonR = lon * (Math.PI / 180);
        const p = project(Math.cos(latR) * Math.sin(lonR), Math.sin(latR), Math.cos(latR) * Math.cos(lonR));
        if (p.depth > -0.05) {
          if (lon === -180) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();

      // 4. Real World Coastline Outlines (from Natural Earth Data)
      ctx.strokeStyle = 'rgba(197, 243, 106, 0.32)';
      ctx.lineWidth = 1.1;
      coastlines3D.forEach((ring) => {
        let drawing = false;
        ctx.beginPath();
        for (let i = 0; i < ring.length; i++) {
          const pt = ring[i];
          const p = project(pt.x, pt.y, pt.z);
          if (p.depth > 0) {
            if (!drawing) {
              ctx.moveTo(p.x, p.y);
              drawing = true;
            } else {
              ctx.lineTo(p.x, p.y);
            }
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      });

      // 5. Real World Landmass Dot Matrix (1,490 points from Natural Earth)
      land3D.forEach((pt) => {
        const p = project(pt.x, pt.y, pt.z);
        if (p.depth > 0) {
          const depthAlpha = p.depth; // [0, 1]
          // Highlight South Asia & active datacenter regions with vibrant emerald
          const isIndiaRegion = pt.lat >= 6 && pt.lat <= 36 && pt.lon >= 65 && pt.lon <= 98;
          const isSingaporeRegion = pt.lat >= -5 && pt.lat <= 15 && pt.lon >= 95 && pt.lon <= 120;

          if (isIndiaRegion || isSingaporeRegion) {
            ctx.fillStyle = `rgba(197, 243, 106, ${0.4 + 0.55 * depthAlpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.4 + 0.8 * depthAlpha, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + 0.45 * depthAlpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.0 + 0.6 * depthAlpha, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 6. 3D Elevated Network Arcs with Fiber Data Streams
      networkConnections.forEach((conn) => {
        const n1 = allNodes.find((n) => n.id === conn.from);
        const n2 = allNodes.find((n) => n.id === conn.to);
        if (!n1 || !n2) return;

        // Draw elevated curve segments
        const segments = 24;
        let arcVisible = false;
        const arcPoints = [];

        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const pos = slerp(n1.vec, n2.vec, t, 0.16);
          const p = project(pos.x, pos.y, pos.z, radius * pos.alt);
          arcPoints.push(p);
          if (p.depth > 0) arcVisible = true;
        }

        if (arcVisible) {
          ctx.beginPath();
          ctx.strokeStyle = conn.planned
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(197, 243, 106, 0.45)';
          ctx.lineWidth = conn.planned ? 1 : 1.5;

          if (conn.planned) ctx.setLineDash([3, 4]);
          else ctx.setLineDash([]);

          for (let i = 0; i < arcPoints.length; i++) {
            const p = arcPoints[i];
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Animated light packet traveling along the arc
          if (!conn.planned) {
            const packetT = (time * 0.4 + (n1.lat * 0.1)) % 1;
            const packetPos = slerp(n1.vec, n2.vec, packetT, 0.16);
            const packetP = project(packetPos.x, packetPos.y, packetPos.z, radius * packetPos.alt);

            if (packetP.depth > 0) {
              ctx.fillStyle = '#FFFFFF';
              ctx.shadowColor = '#C5F36A';
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(packetP.x, packetP.y, 2.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      });

      // 7. Real Datacenter Location Beacons & Ping Labels
      allNodes.forEach((node) => {
        const p = project(node.vec.x, node.vec.y, node.vec.z);
        if (p.depth > 0) {
          const isLive = node.status === 'LIVE';
          const isSelected = selectedLocation === node.id;
          const pulse = (time * 2.2 + node.lat) % 1;

          // Expanding radar pulse ring
          if (isLive) {
            ctx.strokeStyle = `rgba(197, 243, 106, ${0.8 * (1 - pulse)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 + pulse * 14, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Center Core Dot
          ctx.fillStyle = isLive ? '#C5F36A' : 'rgba(255, 255, 255, 0.6)';
          ctx.shadowColor = isLive ? '#C5F36A' : '#FFFFFF';
          ctx.shadowBlur = isSelected ? 16 : 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, isSelected ? 4.5 : 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Node Text Badge (Noida • 20MS, Mumbai • 28MS, etc.)
          if (p.depth > 0.25) {
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            const label = `${node.name} ${node.ping ? `• ${node.ping}` : ''}`;
            const textWidth = ctx.measureText(label).width;

            const badgeX = p.x + 8;
            const badgeY = p.y - 12;

            // Translucent badge pill background
            ctx.fillStyle = isSelected
              ? 'rgba(197, 243, 106, 0.95)'
              : 'rgba(8, 14, 10, 0.85)';
            ctx.beginPath();
            ctx.roundRect(badgeX - 4, badgeY - 8, textWidth + 8, 15, 4);
            ctx.fill();

            // Text
            ctx.fillStyle = isSelected ? '#000000' : '#FFFFFF';
            ctx.fillText(label, badgeX, badgeY + 3);
          }
        }
      });

      ctx.restore(); // restore clipping

      // 8. Outer Crisp Atmosphere Halo Ring Ring (Over the sphere)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(197, 243, 106, 0.55)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 18;
      ctx.shadowColor = 'rgba(197, 243, 106, 0.6)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [selectedLocation]);

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Location Cards */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal animation="fade-up">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5F36A]">
                — NETWORK INFRASTRUCTURE
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
                Real-Time Global Presence
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                True geographic deployment across Tier-3 Indian and South Asian carrier-neutral carrier facilities. Interactive real world topology powered by low-latency fiber backbones.
              </p>
            </ScrollReveal>

            {/* Grid of regional nodes with click-to-focus on Earth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {locations.map((loc) => {
                const isSelected = selectedLocation === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleFocusLocation(loc)}
                    className={`p-4 rounded-2xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl transition duration-200 flex items-center justify-between shadow-lg text-left w-full hover:-translate-y-0.5 ${
                      isSelected ? 'ring-1 ring-[#C5F36A] shadow-[0_0_25px_rgba(197,243,106,0.2)]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={loc.flag}
                        alt={loc.name}
                        className="w-6 h-4 object-cover rounded-sm shadow-sm"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {loc.name}
                          <span className="w-2 h-2 rounded-full bg-[#C5F36A] animate-pulse" />
                        </h4>
                        <p className="text-[11px] text-neutral-400">{loc.country}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#C5F36A]/10 text-[#C5F36A]">
                      {loc.ping}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Upcoming Regions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-neutral-400">
                Rolling out next:
              </span>
              {upcomingLocations.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleFocusLocation(u)}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono transition flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                  <span>{u.name} ({u.country.split(',')[0]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Interactive 3D Real Earth Globe */}
          <ScrollReveal animation="zoom-in" delay={150} className="lg:col-span-5 flex flex-col justify-center items-center relative select-none">
            <div className="relative cursor-grab active:cursor-grabbing group">
              <canvas
                ref={canvasRef}
                className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              />

              {/* Floating hint pill */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-neutral-400 flex items-center gap-2 pointer-events-none group-hover:text-white transition shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5F36A] animate-ping" />
                <span>Drag to rotate real Earth</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
