import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, FileText } from 'lucide-react';

export const LegalPage = () => {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  return (
    <div className="py-16 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5F36A]">
            LEGAL DOCUMENTATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
          </h1>
          <p className="mt-2 text-xs text-neutral-400 font-mono">
            Last Updated: November 2026 • ZEROX CLOUD Platform
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121814] border border-white/10 space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed shadow-xl">
          {isPrivacy ? (
            <>
              <h3 className="text-base font-bold text-white">1. Information We Collect</h3>
              <p>
                ZEROX CLOUD collects account details such as your name, email address, IP address for security logging, and transaction identifiers. We do not store raw credit card numbers; all billing is processed through PCI-DSS compliant providers (Razorpay and Stripe).
              </p>

              <h3 className="text-base font-bold text-white">2. Server Logs and Data Privacy</h3>
              <p>
                Game server console logs and container telemetry are accessible only to you and authorized support agents during active troubleshooting requests. We do not inspect player chat logs or private configuration files.
              </p>

              <h3 className="text-base font-bold text-white">3. Cookies</h3>
              <p>
                We use strictly necessary session cookies for authentication, currency preferences, and security verification. You can configure your cookie preferences at any time.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold text-white">1. Service Provisioning and SLA</h3>
              <p>
                All ZEROX CLOUD services are provisioned automatically upon verified payment confirmation. We guarantee 99.9% network uptime for our Asian edge nodes in Mumbai and Noida.
              </p>

              <h3 className="text-base font-bold text-white">2. Acceptable Use Policy (AUP)</h3>
              <p>
                Customers are strictly prohibited from using server instances for outbound denial-of-service (DDoS) attacks, crypto mining, unauthorized network scanning, or hosting copyrighted materials without license.
              </p>

              <h3 className="text-base font-bold text-white">3. Renewals, Upgrades and Cancellations</h3>
              <p>
                Services can be renewed monthly or cancelled at any time from your Client Area prior to the next renewal date. Unpaid expired services are safely backed up for 7 days before recycling.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

