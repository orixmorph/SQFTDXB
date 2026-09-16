import React, { useEffect } from 'react';
import { ShieldCheck, FileText, CheckCircle2, ChevronLeft, AlertCircle } from 'lucide-react';

interface TermsOfServiceViewProps {
  onBackToHome: () => void;
  onNavigateToProperties?: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({
  onBackToHome,
  onNavigateToProperties,
}) => {
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
            <FileText className="w-3.5 h-3.5 text-[#CF9F5D]" />
            <span>Dubai Secondary Market Regulations</span>
            <span className="text-[#8A8A8A] font-normal">• RERA ORN 49679</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-[#6F6F6F] mt-2">
            Last updated: September 2026 • Governing SQFT DXB (Square Feet DXB) & Jamoka Properties
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm text-[#4A4A4A] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              1. Acceptance & Regulatory Framework
            </h2>
            <p>
              Welcome to <strong>SQFT DXB</strong> (&quot;Square Feet DXB&quot;), operated and powered by <strong>Jamoka Properties</strong>, a licensed real estate brokerage registered with the <strong>Real Estate Regulatory Agency (RERA)</strong> under <strong>Office Registration Number (ORN) 49679</strong> in the Emirate of Dubai, United Arab Emirates.
            </p>
            <p>
              By accessing our website, viewing property inventory, submitting listing instructions, or engaging our advisory services, you expressly agree to be bound by these Terms of Service, our Privacy Policy, and the statutory regulations enacted by the <strong>Dubai Land Department (DLD)</strong>, including Law No. 7 of 2006 regarding Real Property Registration and Law No. 85 of 2006 regulating real estate brokers.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              2. Exclusively Secondary & Ready Property Scope
            </h2>
            <p>
              SQFT DXB specializes strictly in ready, built, and secondary-market residential and commercial properties. We do not promote speculative off-plan developments. All listings represented on our portal are subject to physical verification, owner title authentication, and valid RERA Trakheesi advertising permits.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              3. Property Listings & Owner Authorizations
            </h2>
            <p>
              Under RERA regulations, every property listed on SQFT DXB must satisfy statutory verification mandates:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#CF9F5D]">
              <li>
                <strong>Form A (Seller Agreement):</strong> Sellers and landlords must sign an authorized RERA Form A contract granting Jamoka Properties (ORN 49679) marketing permissions before any property is published.
              </li>
              <li>
                <strong>Title Deed & Ownership Authentication:</strong> Proof of ownership via an official DLD Title Deed or Oqood certificate is strictly verified against the Land Registry before publishing.
              </li>
              <li>
                <strong>Photographic Accuracy:</strong> Visuals displayed represent authentic, current photography of the specific unit or direct community view, without deceptive artistic embellishments.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              4. Buyer & Tenant Representations
            </h2>
            <p>
              Prospective buyers and tenants engaging our services agree to:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-[#CF9F5D]">
              <li>
                Execute a <strong>RERA Form B (Buyer Agreement)</strong> when retaining our advisory team for dedicated representation in secondary property negotiations.
              </li>
              <li>
                Provide genuine identification documents (Emirates ID for UAE residents or valid passport copy for international investors) for KYC compliance.
              </li>
              <li>
                Inspect the physical property, fixtures, built-in appliances, and building amenities prior to entering into a legally binding Memorandum of Understanding (Form F).
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              5. Transactions, Unified Form F, Escrow & Fees
            </h2>
            <p>
              All secondary sales transactions follow the standardized Dubai Land Department conveyancing protocol:
            </p>
            <div className="space-y-3 mt-2">
              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EAEAEA]">
                <div className="font-semibold text-[#171717] text-xs mb-1">Unified Contract Form F (MOU)</div>
                <p className="text-xs text-[#6F6F6F]">
                  The formal purchase agreement generated directly on the official Dubai REST system detailing purchase price, deposit terms, NOC timeline, and handover date.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EAEAEA]">
                <div className="font-semibold text-[#171717] text-xs mb-1">Security Deposit (10% Standard)</div>
                <p className="text-xs text-[#6F6F6F]">
                  A standard 10% deposit manager&apos;s cheque made in the seller&apos;s name is safely held by Jamoka Properties (RERA ORN 49679) as the escrow agent until final title deed transfer at the DLD Trustee Office.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAFAF9] border border-[#EAEAEA]">
                <div className="font-semibold text-[#171717] text-xs mb-1">Statutory Fees & Brokerage Commissions</div>
                <p className="text-xs text-[#6F6F6F]">
                  Buyer is responsible for the standard 4% DLD transfer fee plus AED 580 title deed issuance fee, DLD Registration Trustee fee (AED 4,000 + VAT for values over AED 500k), and standard 2% (+ VAT) brokerage commission to Jamoka Properties unless otherwise stipulated in writing.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              6. Limitation of Liability & Independent Surveys
            </h2>
            <p>
              While SQFT DXB and Jamoka Properties exercise rigorous due diligence to verify property documentation, buyers and tenants are advised to conduct independent technical snagging, structural surveys, and financial assessments. We do not warrant latent physical defects of previously occupied properties once final title transfer is registered.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              7. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the Emirate of Dubai and the applicable federal laws of the United Arab Emirates. Any dispute arising out of or related to our brokerage services shall be subject to the exclusive jurisdiction of the <strong>Dubai Courts</strong>, following initial mediation efforts through RERA&apos;s Real Estate Dispute Center.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#CF9F5D] rounded-full inline-block"></span>
              8. Licensed Broker Identity & Contact
            </h2>
            <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#EAEAEA] space-y-1.5 text-xs text-[#4A4A4A]">
              <div className="font-bold text-[#171717] text-sm">SQFT DXB • Jamoka Properties Real Estate</div>
              <div>RERA Broker Registration No. (ORN): <strong>49679</strong></div>
              <div>DLD Commercial License: Registered in Dubai, United Arab Emirates</div>
              <div>Office Location: Boulevard Plaza, Tower 1, Downtown Dubai</div>
              <div>Telephone: <a href="tel:+97148123400" className="text-[#171717] font-semibold hover:text-[#CF9F5D]">+971 4 812 3400</a></div>
              <div>Official Website: <a href="https://jamokaproperties.com" target="_blank" rel="noopener noreferrer" className="text-[#CF9F5D] font-semibold underline">jamokaproperties.com</a></div>
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
