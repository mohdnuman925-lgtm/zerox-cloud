import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  HardDrive,
  Scale,
  Lock,
  ShieldAlert,
  CheckCircle,
  XCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const LegalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on pathname
  const getTabFromPath = (path) => {
    if (path.includes('refund')) return 'refund';
    if (path.includes('dataloss') || path.includes('backup')) return 'dataloss';
    if (path.includes('rules') || path.includes('aup')) return 'rules';
    if (path.includes('privacy')) return 'privacy';
    return 'terms';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'terms') navigate('/terms');
    else if (tab === 'refund') navigate('/refund');
    else if (tab === 'rules') navigate('/rules');
    else if (tab === 'privacy') navigate('/privacy');
    else navigate('/terms');
  };

  return (
    <div className="py-12 sm:py-16 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">
            <Scale className="w-3.5 h-3.5" />
            ZEROX CLOUD LEGAL & POLICY CENTER
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Policies, Terms & Platform Rules
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-mono">
            Effective Date: November 14, 2026 • Applies to all services on zeroxcloud.site, zeroxxcloud.site, and n.stake.bond
          </p>
        </div>

        {/* Tab Navigation - Clean Neutral Monochrome */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => handleTabChange('terms')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'terms'
                ? 'bg-white text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>

          <button
            onClick={() => handleTabChange('refund')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'refund'
                ? 'bg-white text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Refund Policy (Strict)
          </button>

          <button
            onClick={() => handleTabChange('dataloss')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'dataloss'
                ? 'bg-white text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            Data Loss & Backups
          </button>

          <button
            onClick={() => handleTabChange('rules')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'rules'
                ? 'bg-white text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Server Rules & AUP
          </button>

          <button
            onClick={() => handleTabChange('privacy')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'privacy'
                ? 'bg-white text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Lock className="w-4 h-4" />
            Privacy Policy
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-[#0c140f]/5 border border-white/15 p-6 sm:p-10 rounded-3xl backdrop-blur-2xl space-y-8 text-xs sm:text-sm text-neutral-300 leading-relaxed shadow-2xl">
          {/* TAB 1: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                  DOCUMENT TOS-2026-V3
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  General Terms of Service
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  By accessing, ordering, or utilizing services provided by ZEROX CLOUD ("we", "us", "our"), you agree to be bound by these Terms of Service.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-white text-xs flex items-center justify-center font-mono font-bold">1</span>
                    Account Eligibility & Registration
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    You must be at least 13 years old or have parental consent to use ZEROX CLOUD services. You must provide a valid email address and legitimate contact details. You are entirely responsible for maintaining the confidentiality of your account password, API keys, and Pterodactyl Game Panel credentials.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-white text-xs flex items-center justify-center font-mono font-bold">2</span>
                    Automated Service Provisioning & SLA
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    All game servers, cloud VPS instances, and bot containers are provisioned automatically upon receipt of verified payment confirmation. We guarantee a 99.9% network uptime Service Level Agreement (SLA) for our node datacenters in Mumbai and Noida. Scheduled maintenance announced at least 12 hours in advance via our Discord server or status page is excluded from downtime calculations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-white text-xs flex items-center justify-center font-mono font-bold">3</span>
                    Unmanaged Hosting Service Nature
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    All game servers, bot containers, and cloud VPS plans are provided on an <strong>unmanaged basis</strong>. ZEROX CLOUD provides the raw compute capacity, network connectivity, power, and panel access. Customers are solely responsible for installing their own mods, plugins, configurations, world files, and operating systems.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-white text-xs flex items-center justify-center font-mono font-bold">4</span>
                    Billing, Renewals & Cancellation
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    Services are billed in advance on a recurring monthly cycle. Invoices are generated 5 days prior to the expiration date. You may cancel your service at any time from your Client Area prior to the renewal date. If an invoice remains unpaid upon expiry, the service will be suspended immediately.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-white text-xs flex items-center justify-center font-mono font-bold">5</span>
                    Modifications & Termination
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    ZEROX CLOUD reserves the right to modify these Terms, pricing with 30 days prior notice, or terminate any service immediately and without refund if the client breaches our Acceptable Use Policy or Server Rules.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STRICT REFUND POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                  POLICY SECTION 02
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Refund & Cancellation Policy
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  Please read this policy carefully before completing any transaction. All purchases are final.
                </p>
              </div>

              {/* No-Refund Notice */}
              <div className="p-5 rounded-2xl bg-white/[0.03] text-neutral-200 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide text-xs">
                  <XCircle className="w-4 h-4 text-neutral-400" />
                  NO REFUND POLICY — ALL SALES ARE FINAL ONCE PURCHASED
                </div>
                <p className="text-xs leading-relaxed text-neutral-300 font-medium">
                  Once a payment is completed and a service order is placed, <strong>NO REFUNDS, CREDITS, PRORATED RETURNS, OR PAYMENT REVERSALS</strong> will be issued under any normal circumstance. Once hardware, memory, disk allocation, and IP addresses are reserved, server operational costs are incurred instantly.
                </p>
              </div>

              {/* The Sole Provisioning Exception */}
              <div className="p-5 rounded-2xl bg-white/[0.03] text-neutral-200 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide text-xs">
                  <CheckCircle className="w-4 h-4 text-neutral-400" />
                  THE SOLE EXCEPTION: FAILURE TO PROVIDE SERVICE
                </div>
                <p className="text-xs leading-relaxed text-neutral-300 font-medium">
                  A refund is <strong>ONLY AND EXCLUSIVELY AVAILABLE IF ZEROX CLOUD FAILS TO PROVIDE THE PURCHASED SERVICE</strong>.
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside">
                  <li>
                    If a technical failure on our hardware, hypervisor, or provisioning backend prevents your server or instance from being delivered or activated within <strong>24 hours</strong> of verified payment, and our support engineering team cannot provision the service, you are eligible for a 100% full refund.
                  </li>
                  <li>
                    Once a server container is provisioned, assigned an IP/Port, and reachable in the Pterodactyl Game Panel, the service is deemed <strong>successfully delivered</strong>, and the order is strictly non-refundable.
                  </li>
                </ul>
              </div>

              {/* Ineligible Scenarios */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Non-Refundable Circumstances (Examples):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-black/40 flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Buyer's Remorse:</strong>
                      <p className="text-neutral-400 text-[11px] mt-0.5">"I changed my mind", "I no longer want a server", or "I bought this by mistake".</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Modpack / Plugin Crashes:</strong>
                      <p className="text-neutral-400 text-[11px] mt-0.5">Inability to configure mods, incompatible plugins, syntax errors, or bad configs.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Player / Community Inactivity:</strong>
                      <p className="text-neutral-400 text-[11px] mt-0.5">Your friends or community members stopped playing or failed to join.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Client ISP Routing / Ping:</strong>
                      <p className="text-neutral-400 text-[11px] mt-0.5">Local network lag or ISP routing issues outside of our datacenter edge.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 flex items-start gap-2.5 sm:col-span-2">
                    <XCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Suspension Due to Rule Violations:</strong>
                      <p className="text-neutral-400 text-[11px] mt-0.5">Any service suspended or terminated for DDoS attacks, crypto mining, bot spamming, or abuse will never receive a refund.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chargebacks & Disputes Warning */}
              <div className="p-4 rounded-xl bg-white/[0.03] space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-neutral-400" />
                  FRAUDULENT CHARGEBACKS & PAYMENT DISPUTES
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Opening an unauthorized payment dispute, bank reversal, or PayPal/credit card chargeback without prior resolution through a support ticket is a breach of contract. Doing so will result in <strong>immediate permanent termination of all active services, permanent account blacklisting, irreversible deletion of all server data</strong>, and reporting to fraud prevention databases.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DATA LOSS & BACKUP DISCLAIMER */}
          {activeTab === 'dataloss' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                  POLICY SECTION 03
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Zero Data Loss Liability & Backup Policy
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  Understanding your responsibilities regarding data, world saves, databases, and offsite backups.
                </p>
              </div>

              {/* Main Disclaimer Banner */}
              <div className="p-5 rounded-2xl bg-white/[0.03] text-neutral-200 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide text-xs">
                  <HardDrive className="w-4 h-4 text-neutral-400" />
                  WE ARE NOT RESPONSIBLE FOR DATA LOSS UNDER ANY CIRCUMSTANCES
                </div>
                <p className="text-xs leading-relaxed text-neutral-300 font-medium">
                  <strong>ZEROX CLOUD, ITS OPERATORS, AND AFFILIATES ARE STRICTLY NOT LIABLE OR RESPONSIBLE FOR ANY DATA LOSS, DATA CORRUPTION, MISSING WORLD FILES, WIPED PLAYER INVENTORIES, ACCIDENTAL DELETIONS, OR DATABASE CRASHES</strong>, regardless of how the loss occurs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-white text-xs flex items-center justify-center font-mono font-bold">1</span>
                    Customer Sole Backup Responsibility
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    You as the customer hold <strong>100% sole responsibility</strong> for maintaining current, verified offsite copies of all game files, Minecraft worlds, player stats, configs, and MySQL databases. While our panel provides convenient 1-click snapshot features, you must regularly download backups to your local computer or external cloud storage (e.g. Google Drive, AWS S3) via SFTP.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-white text-xs flex items-center justify-center font-mono font-bold">2</span>
                    Hardware Failures & Force Majeure
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    While our enterprise enterprise nodes use high-speed NVMe SSDs in RAID configurations, hardware components can experience sudden catastrophic failure, disk sector death, kernel corruption, or datacenter power anomalies. In the event of catastrophic drive failure, ZEROX CLOUD will replace the underlying hardware node, but cannot restore lost customer files if the customer did not maintain offsite backups.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-white text-xs flex items-center justify-center font-mono font-bold">3</span>
                    Service Expiration & Automated 7-Day Purge
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    When an invoice passes its due date without payment:
                  </p>
                  <ul className="space-y-1 text-xs text-neutral-400 list-disc list-inside mt-2">
                    <li><strong className="text-white">Day 1:</strong> Service is suspended (server goes offline).</li>
                    <li><strong className="text-white">Day 1 to 7:</strong> Files remain safely stored in dormant state awaiting renewal.</li>
                    <li><strong className="text-white">Day 7:</strong> The container, allocations, and disk storage are <span className="text-white font-bold underline">permanently and irreversibly wiped</span> by our automated recycler to free up host capacity. Once wiped, data recovery is 100% impossible.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/10 text-white text-xs flex items-center justify-center font-mono font-bold">4</span>
                    User Error & Mod Incompatibility
                  </h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    ZEROX CLOUD is not responsible for world corruptions caused by installing conflicting Minecraft mods, buggy plugins, incorrect server jar upgrades, abnormal force-stops during world saves, or accidentally clicking "Reinstall Server" in the Pterodactyl panel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SERVER RULES & ACCEPTABLE USE POLICY */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                  POLICY SECTION 04
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Server Rules & Acceptable Use Policy (AUP)
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  To protect our nodes and guarantee maximum performance for all users, strict compliance with the following rules is mandatory.
                </p>
              </div>

              {/* Rules List - Completely Clean & Monochrome */}
              <div className="space-y-3">
                {/* Rule 1 */}
                <div className="p-4 rounded-xl bg-black/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                      RULE 01
                    </span>
                    <h3 className="text-sm font-bold text-white">No DDoS, DoS, Stress Testing, or Port Probing</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Using any ZEROX CLOUD server to launch or participate in outbound Denial of Service attacks, SYN/UDP floods, IP stressers, network vulnerability scanning, port sweeping, or proxy scraping is strictly forbidden. Any outbound abuse detected by our edge firewalls will result in immediate permanent service termination without warning or refund.
                  </p>
                </div>

                {/* Rule 2 */}
                <div className="p-4 rounded-xl bg-black/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                      RULE 02
                    </span>
                    <h3 className="text-sm font-bold text-white">Strict Prohibition on Cryptocurrency Mining</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Crypto mining of any kind (including Monero, Bitcoin, Chia, Ravencoin, or micro-mining scripts) is completely prohibited. Automated daemon watchdogs terminate mining binaries instantly and alert system administrators.
                  </p>
                </div>

                {/* Rule 3 */}
                <div className="p-4 rounded-xl bg-black/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                      RULE 03
                    </span>
                    <h3 className="text-sm font-bold text-white">No CPU Thrashing, Infinite Loops, or Lag Machines</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Intentional creation of infinite redstone clocks designed solely to crash nodes, fork-bombs, memory-thrashing scripts, unthrottled entity spawners (e.g. 50,000 entities in one chunk), or runaway loops that starve other customers sharing the physical node is a violation. Instances engaging in abusive CPU thrashing will be force-throttled.
                  </p>
                </div>

                {/* Rule 4 */}
                <div className="p-4 rounded-xl bg-black/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                      RULE 04
                    </span>
                    <h3 className="text-sm font-bold text-white">Prohibited Content & Illegal Software</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Customers may not host, distribute, or link to malware, ransomware, botnet C2 servers, phishing pages, cracked pirated software, stolen credentials, torrent trackers, unlicensed media streaming, or illegal contraband. ZEROX CLOUD complies with legitimate international law enforcement requests and copyright takedown notices.
                  </p>
                </div>

                {/* Rule 5 */}
                <div className="p-4 rounded-xl bg-black/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                      RULE 05
                    </span>
                    <h3 className="text-sm font-bold text-white">Discord Bot & Web Application Policies</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Discord bots hosted on our platform must strictly comply with the Discord Developer Terms of Service. Mass DM spamming bots, raid bots, token grabbers, and Discord webhook bombers are strictly prohibited and will be terminated on sight.
                  </p>
                </div>

                {/* Rule 6 */}
                <div className="p-4 rounded-xl bg-black/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                      RULE 06
                    </span>
                    <h3 className="text-sm font-bold text-white">Account Reselling & Fraud Prevention</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Reselling sub-accounts, abusing welcome promotional coupons across multiple duplicate accounts, or using stolen payment credentials will result in immediate termination of all associated accounts.
                  </p>
                </div>

                {/* Rule 7 */}
                <div className="p-4 rounded-xl bg-black/40 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white">
                      RULE 07
                    </span>
                    <h3 className="text-sm font-bold text-white">Staff Respect & Support Ticket Conduct</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Our support engineers are here to assist with hardware and node inquiries. Harassment, verbal abuse, threats, profanity, or spamming duplicate tickets towards our staff will lead to immediate revocation of support ticket privileges and possible account suspension.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                  POLICY SECTION 05
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Privacy Policy & Telemetry
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  How we process, store, and protect your account details and game server records.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white">1. Information We Collect</h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    ZEROX CLOUD collects account details such as your full name, email address, IP address for security logging, and payment transaction identifiers. We do not store raw credit card numbers; all payment transactions are handled securely through PCI-DSS Level 1 compliant gateways (Razorpay and Stripe).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white">2. Server Logs and Data Privacy</h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    Game server console logs and container telemetry are accessible only to you and authorized support agents during active troubleshooting requests. We do not inspect player chat logs or private configuration files unless specifically requested by you in a support ticket or required by law enforcement.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 space-y-2">
                  <h3 className="text-sm font-bold text-white">3. Cookies & Session Storage</h3>
                  <p className="text-neutral-300 text-xs leading-relaxed">
                    We use strictly necessary session cookies and local storage tokens for authentication, currency preferences (INR vs USD), and shopping cart persistence.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Contact / Inquiries Box */}
        <div className="p-6 rounded-2xl bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <h4 className="font-bold text-white text-sm">Have Questions Regarding Our Policies?</h4>
            <p className="text-neutral-400 mt-0.5">
              Contact our legal and billing compliance team via support ticket or email.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/client/support"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-1.5"
            >
              Open Ticket
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="mailto:support@zeroxcloud.com"
              className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-extrabold transition"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
