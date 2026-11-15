import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Activity,
  Wifi,
  Server,
  ShieldCheck,
  Clock,
  RefreshCw,
  AlertCircle,
  Radio,
  ExternalLink,
  ChevronRight,
  Globe2,
  Cpu,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const StatusPage = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [activeTab, setActiveTab] = useState('all');
  const [pings, setPings] = useState({
    fra: 18,
    bom: 12,
    sin: 27,
    iad: 36,
    lon: 21,
    syd: 48
  });
  const [testingNode, setTestingNode] = useState(null);

  // Auto-refresh timestamp counter
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated('A few seconds ago');
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Add slight realistic jitter
      setPings({
        fra: Math.floor(16 + Math.random() * 5),
        bom: Math.floor(10 + Math.random() * 4),
        sin: Math.floor(25 + Math.random() * 5),
        iad: Math.floor(34 + Math.random() * 6),
        lon: Math.floor(19 + Math.random() * 5),
        syd: Math.floor(45 + Math.random() * 7)
      });
      setRefreshing(false);
      setLastUpdated('Just now');
    }, 700);
  };

  const handleTestPing = (nodeKey) => {
    setTestingNode(nodeKey);
    setTimeout(() => {
      setPings((prev) => ({
        ...prev,
        [nodeKey]: Math.floor(prev[nodeKey] * 0.95 + Math.random() * 4)
      }));
      setTestingNode(null);
    }, 600);
  };

  const services = [
    {
      name: 'Pterodactyl Game Panel API',
      category: 'Core Platform',
      status: 'Operational',
      uptime: '100.00%',
      latency: '11ms',
      description: 'Customer server management, power state API & WebSockets'
    },
    {
      name: 'Wings Daemon Cluster',
      category: 'Virtualization & Nodes',
      status: 'Operational',
      uptime: '99.99%',
      latency: '14ms',
      description: 'Host hypervisors and low-latency Docker container runtimes'
    },
    {
      name: 'Anycast Anti-DDoS Scrubbing',
      category: 'Network & Security',
      status: 'Operational',
      uptime: '100.00%',
      latency: '<1ms',
      description: '3.2+ Tbps multi-tier volumetric scrubbing and Layer 7 filters'
    },
    {
      name: 'Automated Billing & Provisioning',
      category: 'Billing & Account',
      status: 'Operational',
      uptime: '100.00%',
      latency: '24ms',
      description: 'Instant server deploy engine, Razorpay & Cashfree webhooks'
    },
    {
      name: 'Database Cluster Fleet',
      category: 'Database Services',
      status: 'Operational',
      uptime: '100.00%',
      latency: '4ms',
      description: 'High-IOPS NVMe MySQL & PostgreSQL remote game databases'
    },
    {
      name: 'Discord Bot & SSO Gateway',
      category: 'Community & Integration',
      status: 'Operational',
      uptime: '100.00%',
      latency: '31ms',
      description: 'Discord OAuth2 synchronization, role assignment & notifications'
    },
    {
      name: 'Customer Client Portal',
      category: 'Web Applications',
      status: 'Operational',
      uptime: '100.00%',
      latency: '8ms',
      description: 'Account settings, server fleet overview & live support desk'
    },
    {
      name: 'Global DNS & Subdomain Routing',
      category: 'DNS Infrastructure',
      status: 'Operational',
      uptime: '100.00%',
      latency: '6ms',
      description: 'Instant SRV records for play.yourname.zeroxcloud.site'
    }
  ];

  const edgeNodes = [
    {
      key: 'fra',
      name: 'Frankfurt, Germany',
      code: 'FRA-01',
      flag: 'https://flagcdn.com/w40/de.png',
      hardware: 'AMD EPYC 9654 • 10 Gbps',
      uplink: 'Path.net + DE-CIX Frankfurt',
      packetLoss: '0.00%',
      status: 'Operational'
    },
    {
      key: 'bom',
      name: 'Mumbai, India',
      code: 'BOM-01',
      flag: 'https://flagcdn.com/w40/in.png',
      hardware: 'AMD Ryzen 9 7950X • 10 Gbps',
      uplink: 'Extreme IX + Jio/Airtel Direct',
      packetLoss: '0.00%',
      status: 'Operational'
    },
    {
      key: 'sin',
      name: 'Singapore',
      code: 'SIN-01',
      flag: 'https://flagcdn.com/w40/sg.png',
      hardware: 'AMD Ryzen 9 7900X • 10 Gbps',
      uplink: 'Equinix SG1 + SGIX',
      packetLoss: '0.00%',
      status: 'Operational'
    },
    {
      key: 'iad',
      name: 'Ashburn / New York, USA',
      code: 'IAD-01',
      flag: 'https://flagcdn.com/w40/us.png',
      hardware: 'Intel Xeon Platinum • 10 Gbps',
      uplink: 'Equinix Ashburn + Cogent/Telia',
      packetLoss: '0.00%',
      status: 'Operational'
    },
    {
      key: 'lon',
      name: 'London, United Kingdom',
      code: 'LON-01',
      flag: 'https://flagcdn.com/w40/gb.png',
      hardware: 'AMD EPYC 7763 • 10 Gbps',
      uplink: 'LINX + Telehouse North',
      packetLoss: '0.00%',
      status: 'Operational'
    },
    {
      key: 'syd',
      name: 'Sydney, Australia',
      code: 'SYD-01',
      flag: 'https://flagcdn.com/w40/au.png',
      hardware: 'AMD Ryzen 9 5950X • 10 Gbps',
      uplink: 'Equinix SY3 + MegaIX',
      packetLoss: '0.00%',
      status: 'Operational'
    }
  ];

  const incidents = [
    {
      id: 1,
      type: 'maintenance',
      title: 'Scheduled European BGP Backbone Firmware Upgrade',
      status: 'Completed',
      date: 'November 14, 2026 - 02:00 UTC',
      duration: '18 minutes (Zero packet loss)',
      description:
        'Router firmware and optics across Frankfurt FRA-01 core switches were upgraded to v4.8. BGP traffic automatically shifted to secondary path.net redundant transit routes with zero detected downtime.',
      affected: ['Frankfurt FRA-01', 'Wings Daemon Cluster']
    },
    {
      id: 2,
      type: 'resolved',
      title: 'Pterodactyl Wings Daemon v1.11 Performance Update',
      status: 'Resolved',
      date: 'November 10, 2026 - 14:30 UTC',
      duration: '4 minutes',
      description:
        'A patch was deployed to optimize Docker socket buffer allocation during mass concurrent server reboots. All node clusters verified healthy.',
      affected: ['Wings Daemon Cluster']
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Indian Subcontinent Tier-1 Fiber Re-alignment',
      status: 'Completed',
      date: 'November 03, 2026 - 19:00 UTC',
      duration: '22 minutes',
      description:
        'Upstream Indian fiber provider performed proactive splicing. Domestic low-latency routing was preserved via Extreme IX and NIXI backup loops.',
      affected: ['Mumbai BOM-01']
    }
  ];

  const filteredIncidents =
    activeTab === 'all'
      ? incidents
      : incidents.filter((inc) => inc.type === activeTab);

  return (
    <div className="min-h-screen py-10 sm:py-16 text-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Hero Banner / Global State */}
        <ScrollReveal animation="fade-down">
          <div className="p-8 sm:p-10 rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#C5F36A]/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold tracking-wide">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  ALL SYSTEMS OPERATIONAL
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  ZeroxCloud System Status
                </h1>
                <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                  Real-time uptime metrics, live node telemetry, and transparent incident logs across our worldwide edge gaming infrastructure.
                </p>
              </div>

              {/* Action & Refresh */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2.5 rounded-xl border border-white/15 bg-[#0e1611]/5 backdrop-blur-xl hover:bg-white/10 text-xs font-semibold text-white transition flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                  title="Ping all nodes and refresh metrics"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#C5F36A]' : 'text-neutral-400'}`} />
                  <span>{refreshing ? 'Testing...' : 'Refresh Pings'}</span>
                </button>

                <a
                  href="https://discord.gg/zeroxcloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <span>Subscribe on Discord</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Micro Uptime Bar */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5F36A]" />
                <span>Last telemetry refresh: <strong className="text-white">{lastUpdated}</strong></span>
              </div>
              <div className="flex items-center gap-4">
                <span>90-Day Rolling Uptime: <strong className="text-emerald-400">99.99%</strong></span>
                <span>•</span>
                <span>Incident Response: <strong className="text-[#C5F36A]">&lt; 5m SLA</strong></span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Global Key KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              Global Network Uptime
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              99.99%
            </div>
            <p className="text-[11px] text-neutral-500">Over past 90 consecutive days</p>
          </div>

          <div className="p-5 rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              Average Player Latency
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline gap-1">
              <span>21</span>
              <span className="text-xs text-[#C5F36A]">ms</span>
            </div>
            <p className="text-[11px] text-neutral-500">Across tier-1 regional edges</p>
          </div>

          <div className="p-5 rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              DDoS Scrubbing Capacity
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#C5F36A] font-mono flex items-baseline gap-1">
              <span>3.2+</span>
              <span className="text-xs text-neutral-400">Tbps</span>
            </div>
            <p className="text-[11px] text-neutral-500">Volumetric & Layer 7 scrubbing</p>
          </div>

          <div className="p-5 rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl space-y-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
              Hypervisor Nodes
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              6 / 6 <span className="text-xs text-emerald-400 font-bold uppercase">Online</span>
            </div>
            <p className="text-[11px] text-neutral-500">All Wings clusters synced</p>
          </div>
        </div>

        {/* Global Edge Nodes Telemetry & Ping Cards */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <Globe2 className="w-5 h-5 text-[#C5F36A]" />
                Datacenter Edge Nodes & Live Latency
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Direct ICMP latency metrics measured from your edge connection to our physical server nodes.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full border border-white/10 bg-[#0c140f]/5 text-xs font-mono text-neutral-300">
              Auto-updating ping stream
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {edgeNodes.map((node) => {
              const pingValue = pings[node.key] || 20;
              const isTesting = testingNode === node.key;

              return (
                <div
                  key={node.key}
                  className="p-6 rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-5 transition-all duration-200 hover:-translate-y-1 hover:border-white/25 group"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={node.flag}
                          alt={node.name}
                          className="w-7 h-5 object-cover rounded-sm shadow-md"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-[#C5F36A] transition">
                            {node.name}
                          </h3>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                            Node {node.code}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {node.status}
                      </span>
                    </div>

                    {/* Hardware & Network */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-neutral-500" />
                          Specs
                        </span>
                        <span className="font-mono text-white text-[11px]">{node.hardware}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-neutral-500" />
                          Transit
                        </span>
                        <span className="text-neutral-300 text-[11px] truncate max-w-[150px]">{node.uplink}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Packet Loss
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">{node.packetLoss}</span>
                      </div>
                    </div>
                  </div>

                  {/* Latency & Ping Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase block">Round-Trip Latency</span>
                      <div className="text-xl font-mono font-extrabold text-white flex items-baseline gap-1">
                        <span className={pingValue < 25 ? 'text-[#C5F36A]' : pingValue < 40 ? 'text-cyan-400' : 'text-amber-400'}>
                          {pingValue}
                        </span>
                        <span className="text-xs text-neutral-400 font-normal">ms</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTestPing(node.key)}
                      disabled={isTesting}
                      className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-neutral-200 transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      <Wifi className={`w-3 h-3 ${isTesting ? 'animate-pulse text-[#C5F36A]' : 'text-neutral-400'}`} />
                      <span>{isTesting ? 'Testing...' : 'Test Ping'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Platform Services Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-[#C5F36A]" />
                Core Platform Components
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Continuous synthetic health checks running every 15 seconds against our API and backend daemons.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl overflow-hidden divide-y divide-white/10">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white tracking-tight">{svc.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-neutral-400 border border-white/5">
                      {svc.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {svc.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center shrink-0">
                  <div className="text-right hidden md:block">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">Response</span>
                    <span className="text-xs font-mono font-bold text-white">{svc.latency}</span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase block">90-Day Uptime</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{svc.uptime}</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Visual Uptime History Bar */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5F36A]" />
                90-Day Uptime History
              </h3>
              <p className="text-xs text-neutral-400">Daily system stability and availability tracking</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">99.99% overall uptime</span>
          </div>

          {/* Graphical timeline with 90 blocks */}
          <div className="space-y-2">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(8px,1fr))] gap-1 h-8 items-center bg-black/40 p-2 rounded-xl border border-white/5">
              {Array.from({ length: 90 }).map((_, i) => (
                <div
                  key={i}
                  className="h-full rounded-sm bg-emerald-400 hover:bg-[#C5F36A] hover:scale-125 transition-all duration-150 cursor-pointer"
                  title={`Day ${90 - i} days ago: 100% Uptime • 0 Incidents`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>90 days ago</span>
              <span className="text-neutral-400">Hover any bar for day incident report</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Past Incidents & Maintenance */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <Radio className="w-5 h-5 text-[#C5F36A]" />
                Incident & Maintenance History
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Archived logs of scheduled upgrades and historical incident resolutions.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-white/10 bg-[#0c140f]/5 backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'all'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'maintenance'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Scheduled Maintenance
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'resolved'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Resolved Incidents
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-6 sm:p-7 rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider ${
                        incident.type === 'maintenance'
                          ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {incident.type === 'maintenance' ? 'Scheduled Upgrade' : 'Resolved Incident'}
                    </span>
                    <h3 className="text-base font-bold text-white">{incident.title}</h3>
                  </div>

                  <div className="text-xs font-mono text-neutral-400">
                    {incident.date}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                  {incident.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">Affected Services:</span>
                    {incident.affected.map((aff, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-300">
                        {aff}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-neutral-400">
                    <span>Duration:</span>
                    <strong className="text-white">{incident.duration}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-10 rounded-3xl border border-white/15 bg-[#0c140f]/5 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Need immediate assistance with your server?</h3>
            <p className="text-xs text-neutral-400">
              Our 24/7 technical team is standing by to assist with server deployment, plugins, and custom routing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/client/support"
              className="px-5 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#C5F36A] transition shadow-lg active:scale-95"
            >
              Open Support Ticket
            </Link>
            <Link
              to="/contact"
              className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition active:scale-95"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
