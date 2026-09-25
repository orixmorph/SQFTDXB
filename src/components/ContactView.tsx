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
  Loader2,
} from 'lucide-react';
import { submitContactUsForm } from '../services/googleSheets';

export const ContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactUsForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
    } catch (err) {
      console.error('Error submitting contact form:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
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
                    <span>Bayswater Tower, 8th floor and 11th floor</span>
                    <br />
                    <span>Business Bay, Dubai, United Arab Emirates</span>
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
                  <strong className="block text-[#171717]">Office Hours</strong>
                  <span>10:00 a.m. to 5:00 p.m.</span>
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
                <CheckCircle2 className="w-12 h-12 text-[#0F9D58] mx-auto" />
                <h3 className="text-2xl font-bold text-[#171717]">
                  Thank You for Reaching Out
                </h3>
                <p className="text-sm text-[#6F6F6F] max-w-md mx-auto">
                  We have received your message. A licensed secondary advisor will respond within 2 hours during office hours.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EA] text-[11px] font-semibold text-[#0F9D58] border border-[#CEEAD6]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Inquiry Securely Received & Logged</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-[#2A2A2A] cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
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
                      placeholder="Full Name"
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
                      placeholder="Email Address"
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
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                    >
                      <option value="">Select Topic</option>
                      <option value="Buy">Buy</option>
                      <option value="Rent">Rent</option>
                      <option value="List Property">List Property</option>
                      <option value="Valuation">Valuation</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-70 inline-flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{submitting ? 'Sending Request...' : 'Submit Advisory Request'}</span>
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
