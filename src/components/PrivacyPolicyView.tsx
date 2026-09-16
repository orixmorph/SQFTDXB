import React, { useEffect } from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle2, ChevronLeft } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBackToHome: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBackToHome }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F6F6F] hover:text-[#171717] mb-8 group transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="border-b border-[#EAEAEA] pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F7F5] border border-[#EAEAEA] text-xs font-semibold text-[#171717] mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#CF9F5D]" />
            <span>UAE Data Protection & RERA Compliance</span>
            <span className="text-[#8A8A8A] font-normal">• ORN 49679</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#6F6F6F] mt-2">
            Last updated: September 2026 • Effective for SQFT DXB (Square Feet DXB), powered by Jamoka Properties
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm text-[#4A4A4A] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              1. Introduction & Regulatory Entity
            </h2>
            <p>
              SQFT DXB (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a specialized secondary real estate portal and advisory brand powered by <strong>Jamoka Properties</strong>, a licensed Dubai real estate brokerage registered with the <strong>Real Estate Regulatory Agency (RERA)</strong> under <strong>Office Registration Number (ORN) 49679</strong> and operating in full compliance with the Dubai Land Department (DLD).
            </p>
            <p>
              We are committed to safeguarding the privacy of our website visitors, registered clients, buyers, sellers, landlords, and tenants in accordance with the <strong>UAE Federal Decree-Law No. 45 of 2021 regarding Personal Data Protection (PDPL)</strong> and applicable DLD/RERA confidentiality guidelines.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              2. Information We Collect
            </h2>
            <p>
              To provide authenticated secondary property brokerage, direct title deed verification, and conveyancing services, we may collect and process:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#CF9F5D]">
              <li>
                <strong>Identity & Contact Information:</strong> Full legal name, nationality, residency status, passport details, Emirates ID (for UAE residents), email address, and mobile phone number.
              </li>
              <li>
                <strong>Property & Ownership Records:</strong> Title deed copies, affection plans, official Oqood documents, developer NOCs, and tenancy contracts (Ejari) required to verify listings and draft mandatory RERA Form A/Form B/Form F documents.
              </li>
              <li>
                <strong>Financial & Transactional Preferences:</strong> Budget parameters, proof of funds or mortgage pre-approval letters when executing legally binding offers.
              </li>
              <li>
                <strong>Technical & Usage Data:</strong> IP address, browser type, referral URLs, and browsing behavior across our secondary listings and community guides.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              3. Purpose & Legal Basis for Processing
            </h2>
            <p>We process your personal information strictly for genuine real estate advisory purposes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EAEAEA]">
                <div className="font-semibold text-[#171717] text-xs mb-1">DLD & RERA Compliance</div>
                <p className="text-xs text-[#6F6F6F]">
                  Fulfilling statutory obligations under Dubai real estate law, including KYC and anti-money laundering (AML) protocols.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EAEAEA]">
                <div className="font-semibold text-[#171717] text-xs mb-1">Title Deed & Listing Verification</div>
                <p className="text-xs text-[#6F6F6F]">
                  Authenticating seller ownership and issuance of electronic RERA advertising permits (Trakheesi).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EAEAEA]">
                <div className="font-semibold text-[#171717] text-xs mb-1">Conveyancing & Form F Execution</div>
                <p className="text-xs text-[#6F6F6F]">
                  Drafting Unified Contracts (Form F / MOU), booking authorized DLD Registration Trustee appointments, and title transfer.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EAEAEA]">
                <div className="font-semibold text-[#171717] text-xs mb-1">Client Inquiries & Property Viewings</div>
                <p className="text-xs text-[#6F6F6F]">
                  Scheduling physical property inspections and matching ready buyers with verified secondary sellers.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              4. Data Sharing & Third Parties
            </h2>
            <p>
              We <strong>never sell, rent, or trade your personal information</strong> to unsolicited third parties. We share data only with authorized entities necessary to conclude your secondary transaction:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#CF9F5D]">
              <li><strong>Dubai Land Department (DLD) & RERA:</strong> Mandatory reporting of secondary contracts and ownership transfers via the Dubai REST system.</li>
              <li><strong>Licensed Registration Trustee Offices:</strong> Authorized government partners who execute final title transfers and cheque exchanges.</li>
              <li><strong>Financing Banks & Valuation Surveyors:</strong> Only upon your written consent when applying for a mortgage or official property appraisal.</li>
              <li><strong>Jamoka Properties Corporate Infrastructure:</strong> Secure internal CRM and compliance systems operating under ORN 49679.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              5. Data Security & Retention
            </h2>
            <p>
              We implement enterprise-grade technical, physical, and managerial security measures, including SSL/TLS encryption, restricted role-based employee access, and secure cloud backups. In accordance with UAE real estate regulations, transaction files and client identification records are retained for a minimum of five (5) years following the conclusion of any property contract.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              6. Your Rights Under UAE Law
            </h2>
            <p>Under the UAE Data Protection Law (PDPL), you have the right to:</p>
            <div className="space-y-2 mt-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CF9F5D] flex-shrink-0 mt-0.5" />
                <span>Request access to the personal data we hold about you.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CF9F5D] flex-shrink-0 mt-0.5" />
                <span>Request rectification of incorrect or outdated title or personal records.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CF9F5D] flex-shrink-0 mt-0.5" />
                <span>Request erasure of your data, subject to mandatory statutory retention requirements under DLD/AML laws.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#CF9F5D] flex-shrink-0 mt-0.5" />
                <span>Withdraw consent for non-essential marketing communications at any time.</span>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              7. Contact & Compliance Officer
            </h2>
            <p>
              For privacy inquiries, data subject access requests, or regulatory clarifications, please contact our dedicated compliance desk:
            </p>
            <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#EAEAEA] space-y-1.5 text-xs text-[#4A4A4A]">
              <div className="font-bold text-[#171717] text-sm">SQFT DXB Compliance Office</div>
              <div>Powered by Jamoka Properties (RERA ORN: 49679)</div>
              <div>Boulevard Plaza, Tower 1, Downtown Dubai, UAE</div>
              <div>Telephone: <a href="tel:+97148123400" className="text-[#171717] font-semibold hover:text-[#CF9F5D]">+971 4 812 3400</a></div>
              <div>Email: <a href="mailto:privacy@sqftdxb.com" className="text-[#CF9F5D] font-semibold underline">privacy@sqftdxb.com</a></div>
            </div>
          </section>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-12 pt-8 border-t border-[#EAEAEA] flex justify-between items-center">
          <button
            onClick={onBackToHome}
            className="px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-[#333] transition-colors cursor-pointer"
          >
            Return to Homepage
          </button>
          <span className="text-xs text-[#8A8A8A]">
            SQFT DXB • Powered by Jamoka Properties (ORN 49679)
          </span>
        </div>
      </div>
    </div>
  );
};
