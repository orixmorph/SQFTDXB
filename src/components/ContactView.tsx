import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Property Purchase Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-[#CF9F5D] uppercase tracking-wider block mb-1">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight">
            Connect with SQFT DXB
          </h1>
          <p className="text-base text-[#6F6F6F] mt-3 leading-relaxed">
            Whether you are acquiring a secondary-market residence, seeking high-yield tenanted assets, or listing your ready property, our senior advisors are at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Information & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#F7F7F5] border border-[#EAEAEA] space-y-5">
              <h3 className="text-lg font-bold text-[#171717]">
                Office & Headquarters
              </h3>

              <div className="flex items-start gap-3.5 text-sm text-[#4A4A4A]">
                <MapPin className="w-5 h-5 text-[#CF9F5D] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#171717]">SQFT DXB Real Estate</strong>
                  <span className="text-xs text-[#6F6F6F]">Powered by Jamoka Properties • RERA ORN: 49679</span>
                  <div className="mt-1">
                    <span>Level 28, Boulevard Plaza Tower 1</span>
                    <br />
                    <span>Downtown Dubai, United Arab Emirates</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-sm text-[#4A4A4A]">
                <Phone className="w-5 h-5 text-[#CF9F5D] flex-shrink-0" />
                <div>
                  <strong className="block text-[#171717]">Direct Advisory Line</strong>
                  <span>+971 4 812 3400</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-sm text-[#4A4A4A]">
                <Mail className="w-5 h-5 text-[#CF9F5D] flex-shrink-0" />
                <div>
                  <strong className="block text-[#171717]">Client Inquiries</strong>
                  <span>advisors@sqftdxb.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 text-sm text-[#4A4A4A]">
                <Clock className="w-5 h-5 text-[#CF9F5D] flex-shrink-0" />
                <div>
                  <strong className="block text-[#171717]">Private Viewing Hours</strong>
                  <span>Monday - Saturday: 9:00 AM – 7:30 PM (GST)</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Box */}
            <div className="p-6 rounded-3xl bg-[#171717] text-white space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#25D366]" />
                <h4 className="text-base font-bold">Instant WhatsApp Consultation</h4>
              </div>
              <p className="text-xs text-[#A8A8A8] leading-relaxed">
                Connect directly with our on-duty senior secondary market specialist for immediate questions on listings or valuations.
              </p>
              <a
                href="https://wa.me/971588648093?text=Hello%20SQFT%20DXB,%20I%20would%20like%20to%20inquire%20about%20secondary%20properties%20in%20Dubai."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-[#F7F7F5] p-6 sm:p-10 rounded-3xl border border-[#EAEAEA]">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="text-2xl font-bold text-[#171717]">
                  Thank You for Reaching Out
                </h3>
                <p className="text-sm text-[#6F6F6F] max-w-md mx-auto">
                  We have received your message. A licensed secondary advisor will respond within 2 hours during active viewing times.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-semibold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-[#171717] mb-2">
                  Send an Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Al-Saleh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                    >
                      <option value="Property Purchase Inquiry">Buying a Ready Secondary Property</option>
                      <option value="Rental Inquiry">Renting a Ready Residence</option>
                      <option value="List a Property">Listing My Secondary Property</option>
                      <option value="Valuation Request">Property Valuation & Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Message / Preferred Community
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you are looking for (e.g. 2-bed apartment in Dubai Marina, ready to move, budget around AED 3.5M)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Submit Advisory Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
