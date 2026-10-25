import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bed,
  Bath,
  Maximize2,
  Car,
  Eye,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  MessageSquare,
  Mail,
  Phone,
  ArrowLeft,
  Calendar,
  Share2,
  Layers,
  Utensils,
  Trees,
  Building2,
  Sparkles,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Images,
  Check,
  Send,
  FileText,
  Navigation,
  Award,
  ArrowUpRight,
  Lock,
  Compass,
  HeartHandshake,
  ExternalLink,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sendLeadToServer } from '../services/googleSheets';
import { PARKWAYS_VILLA_GALLERY } from '../data/parkwaysDriveGallery';

// Hero image provided by user
const PARKWAYS_VILLA_HERO_IMAGE =
  'https://ik.imagekit.io/zb5ih81ig/Twilight%20Modern%20Mansion%20with%20Rooftop%20Terrace.png';

// Full-screen Twilight villa image with vignette effect for Property at a Glance section
const PARKWAYS_TWILIGHT_VILLA_IMAGE =
  'https://ik.imagekit.io/zb5ih81ig/Twilight%20Luxury%20Villa%20and%20Pool.png';

// Floating Video showcase URL provided by user
const PARKWAYS_VILLA_VIDEO_URL =
  'https://ik.imagekit.io/pkn80iczwu/Dubai%20Hills%20YL(2).mp4';

// Thumbnail extracted directly from the video
const PARKWAYS_VILLA_VIDEO_THUMBNAIL =
  'https://ik.imagekit.io/pkn80iczwu/Dubai%20Hills%20YL(2).mp4/ik-thumbnail.jpg';

const PHONE_DISPLAY = '+971 55 941 9262';
const PHONE_INTL = '+971559419262';
const WHATSAPP_RAW = '971559419262';
const CONTACT_EMAIL = 'info@jamokaproperties.com';
const SITE_LOGO_URL =
  'https://ik.imagekit.io/zb5ih81ig/SITE%20LOGOS%20(1).png?updatedAt=1791790631428';

interface ParkwaysVillaLandingPageProps {
  onBackToHome: () => void;
}

export const ParkwaysVillaLandingPage: React.FC<ParkwaysVillaLandingPageProps> = ({
  onBackToHome,
}) => {
  // Hero scroll-zoom effect (max 10% on scroll down)
  const [heroZoomScale, setHeroZoomScale] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 600;
      const progress = Math.min(scrollY / maxScroll, 1);
      // Zoom from 1.0 up to 1.10 (10% zoom on scroll)
      setHeroZoomScale(1 + progress * 0.1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gallery slider state & auto-scrolling
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isSliderHovered, setIsSliderHovered] = useState<boolean>(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  // Read the name of the images and sort in number-wise order (e.g. 1, 2, ... 10)
  const galleryImages = useMemo(() => {
    return [...PARKWAYS_VILLA_GALLERY].sort((a, b) =>
      a.originalName.localeCompare(b.originalName, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, []);

  // Auto-scrolling carousel effect
  useEffect(() => {
    if (isSliderHovered || galleryModalOpen) return;

    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 5) return;

      if (scrollLeft >= maxScroll - 15) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isSliderHovered, galleryModalOpen]);

  const updateScrollProgress = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 360;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const openModalAt = (index: number) => {
    setActiveGalleryIndex(index);
    setGalleryModalOpen(true);
  };

  const nextModalImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeGalleryIndex === null) return;
    setActiveGalleryIndex((activeGalleryIndex + 1) % galleryImages.length);
  };

  const prevModalImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeGalleryIndex === null) return;
    setActiveGalleryIndex(
      (activeGalleryIndex - 1 + galleryImages.length) % galleryImages.length
    );
  };

  // Keyboard navigation for gallery modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!galleryModalOpen) return;
      if (e.key === 'Escape') setGalleryModalOpen(false);
      if (e.key === 'ArrowRight') nextModalImage();
      if (e.key === 'ArrowLeft') prevModalImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryModalOpen, activeGalleryIndex]);

  // Floating Villa Video Player State & Handlers
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isVideoHovered, setIsVideoHovered] = useState<boolean>(false);

  // Play video with sound immediately on user interaction
  const handlePlayWithSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsVideoMuted(false);
      videoRef.current
        .play()
        .then(() => {
          setIsVideoPlaying(true);
        })
        .catch(() => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsVideoPlaying(true);
          }
        });
    }
  };

  const toggleVideoPlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.muted = false;
      setIsVideoMuted(false);
      videoRef.current
        .play()
        .then(() => {
          setIsVideoPlaying(true);
        })
        .catch(() => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsVideoPlaying(true);
          }
        });
    }
  };

  const toggleVideoMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsVideoMuted(newMuted);
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 1;
    setVideoCurrentTime(current);
    setVideoProgress((current / total) * 100);
  };

  const handleVideoLoadedMetadata = () => {
    if (!videoRef.current) return;
    setVideoDuration(videoRef.current.duration);
  };

  const handleVideoScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = pct * (videoRef.current.duration || 0);
    setVideoProgress(pct * 100);
  };

  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen?.();
    }
  };

  const formatVideoTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Lead Generation Contact Form (Connected directly to Google Sheets App Script)
  const [leadForm, setLeadForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Hello Jamoka Properties, I am interested in The Parkways Custom-Built Villa in Dubai Hills Estate (11,241 sq. ft. plot / 10,000 sq. ft. BUA, RERA: PERMIT-DXB-000007). Please share the complete details and pricing.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_RAW}?text=${whatsappMessage}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'The Parkways Custom Villa | Dubai Hills Estate',
          text: 'Exclusive Custom-Built Villa in The Parkways, Dubai Hills Estate. 11,241 sq. ft. plot, private cinema, pool, elevator.',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch {
      // Ignored
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.fullName || !leadForm.phone) return;

    setSubmitting(true);
    try {
      await sendLeadToServer({
        formType: 'contact_us',
        source: 'The Parkways Villa Landing Page',
        name: leadForm.fullName,
        fullName: leadForm.fullName,
        phone: leadForm.phone,
        email: leadForm.email || '',
        message:
          leadForm.message ||
          'Inquiry for The Parkways Custom-Built Villa in Dubai Hills Estate',
        subject: 'Inquiry - The Parkways Custom-Built Villa',
        propertyTitle: 'The Parkways Custom-Built Villa, Dubai Hills Estate',
        propertyArea: 'Dubai Hills Estate',
      });
    } catch (err) {
      console.error('Error submitting contact form to Google Sheets:', err);
    } finally {
      setSubmitting(false);
      setFormSubmitted(true);
    }
  };

  // Top Section Hero Contact Form (Connected directly to Google Sheets App Script)
  const [heroForm, setHeroForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroFormSubmitted, setHeroFormSubmitted] = useState(false);

  const handleHeroFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.fullName || !heroForm.phone) return;

    setHeroSubmitting(true);
    try {
      await sendLeadToServer({
        formType: 'contact_us',
        source: 'The Parkways Hero Section Inquiry Form',
        name: heroForm.fullName,
        fullName: heroForm.fullName,
        phone: heroForm.phone,
        email: heroForm.email || '',
        message:
          heroForm.message ||
          'Inquiry for The Parkways Custom-Built Villa in Dubai Hills Estate',
        subject: 'Hero Inquiry - The Parkways Custom-Built Villa',
        propertyTitle: 'The Parkways Custom-Built Villa, Dubai Hills Estate',
        propertyArea: 'Dubai Hills Estate',
      });
      setHeroFormSubmitted(true);
    } catch (err) {
      console.error('Error submitting hero contact form to Google Sheets:', err);
    } finally {
      setHeroSubmitting(false);
    }
  };

  const amenities = [
    { name: 'Resort-Style Swimming Pool', icon: WavesIcon },
    { name: 'Dedicated Covered Parking (2 Bays)', icon: Car },
    { name: 'Private Landscaped Garden', icon: Trees },
    { name: 'Private Swimming Pool', icon: WavesIcon },
    { name: '24/7 Gated Security & CCTV', icon: ShieldCheck },
    { name: "Maid's Room (En-Suite)", icon: Building2 },
    { name: 'Dedicated Private Study Room', icon: FileText },
    { name: 'Private Storage Facilities', icon: Layers },
    { name: 'Outdoor BBQ & Alfresco Lounge', icon: Utensils },
    { name: 'Built-in Designer Wardrobes', icon: Sparkles },
    { name: 'Central Multi-Zone Climate Control', icon: Sparkles },
    { name: 'Pet Friendly Luxury Community', icon: Trees },
    { name: 'Private Balcony & Terraces', icon: Eye },
    { name: "Children's Play Areas", icon: Trees },
    { name: 'Immediate Proximity to Golf Club', icon: Compass },
  ];

  const architecturalFeatures = [
    { title: 'Approx. 11,241 sq. ft. Plot', desc: 'Substantial private estate offering exceptional privacy and landscaped perimeter.' },
    { title: 'Approx. 10,000 sq. ft. BUA', desc: 'Generous multi-level living with expansive ceiling volumes across all floors.' },
    { title: 'Custom-Built Residence', desc: 'Individually commissioned architectural masterpiece tailored with distinctive craftsmanship.' },
    { title: 'Private Swimming Pool', desc: 'Temperature-controlled lap pool embedded with private sun deck and outdoor shower.' },
    { title: 'Private Internal Elevator', desc: 'Silent motorized internal lift connecting basement, ground, and upper residential floors.' },
    { title: 'Spacious Basement', desc: 'Multipurpose entertainment level configured for private wellness, lounge, or gallery.' },
    { title: 'Private Cinema Room', desc: 'Acoustically isolated screening theater for a true cinematic experience at home.' },
    { title: 'Rooftop Terrace', desc: 'Panoramic skyline & community viewing deck, ideal for evening receptions.' },
    { title: 'Outdoor BBQ Area', desc: 'Built-in alfresco culinary station with shaded pergolas and dedicated seating zones.' },
    { title: 'Covered Parking', desc: 'Secure sheltered vehicular bays with direct foyer and kitchen access.' },
    { title: 'Show Kitchen + Chef’s Prep Kitchen', desc: 'Designer marble show kitchen for social hosting plus fully-equipped service & heavy prep kitchen.' },
    { title: 'Spacious Indoor & Outdoor Areas', desc: 'Fluid transitions between interior entertaining salons and exterior verandas.' },
    { title: 'Premium Materials and Finishes', desc: 'Imported natural stone, bespoke joinery, high-end glazing, and European sanitaryware.' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-[#CF9F5D] selection:text-black font-sans antialiased">
      {/* Top Floating / Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </button>
            <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
            <img
              src={SITE_LOGO_URL}
              alt="SQFT DXB"
              className="h-8 sm:h-9 w-auto max-w-[130px] sm:max-w-[160px] object-contain block"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-white/10 text-white/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Share listing"
            >
              {copiedShare ? (
                <span className="text-xs text-[#CF9F5D] px-1 font-medium">Link Copied!</span>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <a
              href={`tel:${PHONE_INTL}`}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/15 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>{PHONE_DISPLAY}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#25D366]/20 transition-all hover:scale-102 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Agent</span>
            </a>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO COVER SHOWCASE
          - Villa is clearly visible without dark overlays or gradients at the top
          - Zoomed out slightly to comfortably display the architecture and surroundings
          - Smooth 10% scroll zoom response
          - Soft bottom gradient fade into #0D0D0D where the details begin underneath
         ========================================================================= */}
      <section className="relative w-full bg-[#0D0D0D] overflow-hidden">
        {/* Full Villa Viewport Frame (No top gradient, clear villa facade) */}
        <div className="relative w-full h-[58vh] sm:h-[70vh] lg:h-[80vh] min-h-[440px] max-h-[820px] overflow-hidden bg-[#0D0D0D]">
          <img
            src={PARKWAYS_VILLA_HERO_IMAGE}
            alt="The Parkways Custom Residence - Dubai Hills Estate"
            style={{
              transform: `scale(${heroZoomScale})`,
              transformOrigin: 'center center',
            }}
            className="w-full h-full object-cover object-[center_35%] transition-transform duration-100 ease-out will-change-transform"
          />

          {/* Minimal top badge */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-medium text-white/90">
              <Images className="w-3.5 h-3.5 text-[#CF9F5D]" />
              The Parkways Residence &bull; Villa Showcase
            </span>
          </div>

          {/* Soft Bottom Gradient Fade Only (villa at top & middle remains fully clear) */}
          <div className="absolute bottom-0 left-0 right-0 h-40 sm:h-56 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/75 to-transparent pointer-events-none" />
        </div>

        {/* =======================================================================
            ELEMENTS UNDERNEATH THE PICTURE (Over the natural transition)
            - Headline: "Own your prime address in Dubai Hills Estate."
            - Verified Secondary Market Exclusive
            - RERA Permit: PERMIT-DXB-000007
            - The Parkways, Dubai Hills Estate
            - Custom-Built Residence
           ======================================================================= */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 pb-12">
          {/* Main Title stays as big as it is at the top */}
          <div className="mb-8 max-w-5xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Own your prime address in Dubai Hills Estate.
            </h1>
          </div>

          {/* Two-Column Grid: Left contains Residence Defined by Space, details & CTAs; Right contains Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column (7 cols): Badges, Subtitle, Description, Dimensions with Jamoka link, CTA buttons */}
            <div className="lg:col-span-7 space-y-5">
              {/* Verified Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#CF9F5D]/20 border border-[#CF9F5D]/40 text-[#F3D7A0] text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  Verified Secondary Market Exclusive
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  RERA Permit: PERMIT-DXB-000007
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  The Parkways, Dubai Hills Estate
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md">
                  <Building2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  Custom-Built Villa
                </span>
              </div>

              {/* Subtitle */}
              <div>
                <p className="text-xl sm:text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#F3D7A0] via-[#CF9F5D] to-[#E3C38A] leading-tight">
                  A Residence Defined by Space, Privacy &amp; Prestige.
                </p>
                <div className="text-xs sm:text-sm uppercase tracking-widest text-white/60 font-semibold mt-2 flex items-center gap-2">
                  <span>The Parkways, Dubai Hills Estate</span>
                  <span>&bull;</span>
                  <span className="text-[#CF9F5D]">Private Villa Enclave</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
                A custom-built villa offering exceptional proportions, a private residential setting, and a distinguished address in one of Dubai's established luxury communities.
              </p>

              {/* Key Dimensions Banner with "Square footage is provided by Jamoka Properties" */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/15 backdrop-blur-md space-y-3">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-medium">
                    <span className="text-white/60 uppercase tracking-wider text-[11px]">Plot:</span>
                    <span className="font-bold text-[#F3D7A0]">11,241 sq. ft.</span>
                  </div>
                  <span className="text-white/20 hidden sm:inline">|</span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-medium">
                    <span className="text-white/60 uppercase tracking-wider text-[11px]">Built-Up Area:</span>
                    <span className="font-bold text-[#F3D7A0]">Approx. 10,000 sq. ft.</span>
                  </div>
                  <span className="text-white/20 hidden sm:inline">|</span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-[#25D366] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Vacant on Transfer</span>
                  </div>
                </div>

                {/* Square footage is provided by Jamoka Properties element with link */}
                <div className="pt-2.5 border-t border-white/10 flex items-center gap-2 text-xs text-white/70">
                  <Award className="w-3.5 h-3.5 text-[#CF9F5D] shrink-0" />
                  <span>
                    Square footage is provided by{' '}
                    <a
                      href="https://jamokaproperties.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#CF9F5D] hover:text-[#F3D7A0] font-semibold underline underline-offset-2 inline-flex items-center gap-1 transition-colors"
                    >
                      Jamoka Properties
                      <ExternalLink className="w-3 h-3 inline" />
                    </a>
                    {' '}(RERA ORN 49679).
                  </span>
                </div>
              </div>

              {/* CTA Buttons: Inquire For Details, WhatsApp Brochure, View Gallery */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#inquire"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#CF9F5D] to-[#E3C38A] text-[#0D0D0D] font-extrabold text-xs sm:text-sm tracking-wider uppercase hover:shadow-xl hover:shadow-[#CF9F5D]/30 hover:scale-102 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enquire For Details</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm tracking-wide hover:shadow-xl hover:shadow-[#25D366]/30 hover:scale-102 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Brochure</span>
                </a>

                <button
                  onClick={() => {
                    const galleryEl = document.getElementById('sliding-gallery');
                    galleryEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Images className="w-4 h-4 text-[#CF9F5D]" />
                  <span>View Gallery</span>
                </button>
              </div>
            </div>

            {/* Right Column (5 cols): Contact Form (Connected directly to Google Sheets Apps Script) */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 p-5 sm:p-7 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden">
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#CF9F5D]/20 rounded-full blur-2xl pointer-events-none" />

                <div className="mb-4 relative z-10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#CF9F5D]/20 border border-[#CF9F5D]/40 text-[#F3D7A0] text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#CF9F5D]" />
                      Direct Inquiry
                    </span>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                      Fast Response
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Inquire About This Residence
                  </h3>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed">
                    Submit your details to receive the verified brochure, title deed copy &amp; arrange a private viewing.
                  </p>
                </div>

                {heroFormSubmitted ? (
                  <div className="py-6 px-4 rounded-xl bg-white/[0.04] border border-[#CF9F5D]/40 text-center animate-fade-in relative z-10">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#CF9F5D]/20 flex items-center justify-center text-[#F3D7A0]">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white">Inquiry Received</h4>
                    <p className="text-xs text-white/70 mt-1 max-w-xs mx-auto">
                      Thank you, <strong className="text-white">{heroForm.fullName}</strong>. Our senior secondary advisor will contact you at <strong className="text-white">{heroForm.phone}</strong> shortly.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Chat on WhatsApp</span>
                      </a>
                      <button
                        onClick={() => {
                          setHeroFormSubmitted(false);
                          setHeroForm({
                            fullName: '',
                            phone: '',
                            email: '',
                            message: '',
                          });
                        }}
                        className="px-3 py-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleHeroFormSubmit} className="space-y-3 relative z-10">
                    <div>
                      <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alexander Wright"
                        value={heroForm.fullName}
                        onChange={(e) => setHeroForm({ ...heroForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+971 50 000 0000"
                        value={heroForm.phone}
                        onChange={(e) => setHeroForm({ ...heroForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="alexander@example.com"
                        value={heroForm.email}
                        onChange={(e) => setHeroForm({ ...heroForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                        Message / Inquiries
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Request floor plans, pricing or schedule private viewing..."
                        value={heroForm.message}
                        onChange={(e) => setHeroForm({ ...heroForm, message: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors resize-none"
                      />
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={heroSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#CF9F5D] to-[#E3C38A] text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-[#CF9F5D]/25 disabled:opacity-50"
                      >
                        {heroSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Submitting to Sheets...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Contact Inquiry</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-white/50">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#CF9F5D]" />
                        Direct to Jamoka Properties
                      </span>
                      <span>RERA: PERMIT-DXB-000007</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          "THE PROPERTY AT A GLANCE" & KEY SPECIFICATIONS
          - 11,241 sq. ft. Generous plot size
          - ~10,000 sq. ft. Approximate built-up area
          - The Parkways, Dubai Hills Estate
          - Custom-Built A distinctive private residence
          - Beds, Baths, Parking, Views
         ========================================================================= */}
      {/* =========================================================================
          SECOND SECTION: "THE PROPERTY AT A GLANCE"
          - Top: Full-screen / full-width Twilight Luxury Villa visual with cinematic vignette effect
          - Underneath: Square feet, The Parkways, Custom-built residence & specs
          - Curved glassmorphism elements with smaller custom borders
         ========================================================================= */}
      {/* =========================================================================
          SECOND SECTION:
          - Top: Centered villa picture showing the entire villa, with slight gradient effect on top, bottom, left, right
          - Scroll down: "The Property at a Glance" essential dimensions & 4 glassmorphic cards + specs
          - Underneath: Text brief of the villa on the left side & Floating interactive video with sound on the right side
         ========================================================================= */}
      <section className="bg-[#101010] relative overflow-hidden border-y border-white/5">
        {/* Centered Villa Visual: Full villa architecture visible in the middle with slight gradient effect on all 4 sides */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="relative w-full flex items-center justify-center overflow-hidden">
              <img
                src={PARKWAYS_TWILIGHT_VILLA_IMAGE}
                alt="Twilight Luxury Villa and Pool - The Parkways Dubai Hills Estate"
                className="w-full h-auto max-h-[560px] sm:max-h-[620px] object-contain sm:object-cover object-center"
              />

              {/* Slight gradient effect on all 4 sides: top, bottom, left, right */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top slight gradient */}
                <div className="absolute top-0 inset-x-0 h-12 sm:h-16 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                {/* Bottom slight gradient */}
                <div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-t from-[#101010] via-[#101010]/50 to-transparent" />
                {/* Left slight gradient */}
                <div className="absolute left-0 inset-y-0 w-10 sm:w-16 bg-gradient-to-r from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent" />
                {/* Right slight gradient */}
                <div className="absolute right-0 inset-y-0 w-10 sm:w-16 bg-gradient-to-l from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent" />
              </div>

              {/* Enlarge in lightbox button */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => openModalAt(0)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white transition-all cursor-pointer shadow-lg"
                >
                  <Maximize2 className="w-3 h-3 text-[#CF9F5D]" />
                  <span>Enlarge View</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Residence Perspective & Brief with Interactive 9:16 Video (Swapped up directly under villa image) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Side: Text Brief of the Villa */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#CF9F5D] bg-[#CF9F5D]/10 px-3 py-1 rounded-full border border-[#CF9F5D]/20 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#CF9F5D]" />
                  Residence Perspective &amp; Brief
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 leading-tight">
                  A Residence Defined by Space, Privacy &amp; Prestige
                </h3>
                <p className="text-[#F3D7A0] text-sm font-medium mt-1">
                  The Parkways &bull; Dubai Hills Estate
                </p>
              </div>

              <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
                Set on an impressive <strong className="text-white font-medium">11,241 sq. ft. plot</strong> with approximately <strong className="text-white font-medium">10,000 sq. ft. of built-up area</strong>, this bespoke residence offers spacious interiors, premium finishes, and a private setting designed for comfortable family living and entertaining.
              </p>

              <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                Some properties stand out for their design. Others for their location. This residence brings together the scale, setting, and exclusivity that discerning buyers look for in a Dubai home. Positioned within walking distance of the championship golf course and just 15 minutes from Downtown Dubai, it offers absolute seclusion paired with swift metropolitan access.
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#CF9F5D]/20 flex items-center justify-center text-[#CF9F5D] shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs text-white font-medium">Private Cinema Room</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#CF9F5D]/20 flex items-center justify-center text-[#CF9F5D] shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs text-white font-medium">Resort Pool &amp; Sun Deck</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#CF9F5D]/20 flex items-center justify-center text-[#CF9F5D] shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs text-white font-medium">Private Elevator (All Levels)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#CF9F5D]/20 flex items-center justify-center text-[#CF9F5D] shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs text-white font-medium">Dual Chef Kitchens</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const formEl = document.getElementById('inquire');
                    formEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#CF9F5D] hover:bg-[#E3C38A] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#CF9F5D]/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enquire for Details</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-all shadow-md shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Broker</span>
                </a>
              </div>
            </div>

            {/* Right Side: Floating Interactive 9:16 Video with sound and play button */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div
                onMouseEnter={() => setIsVideoHovered(true)}
                onMouseLeave={() => setIsVideoHovered(false)}
                className="relative w-full max-w-[340px] sm:max-w-[370px] rounded-2xl sm:rounded-3xl overflow-hidden bg-black/95 border border-white/15 hover:border-[#CF9F5D]/60 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(207,159,93,0.28)] transition-all duration-500 hover:-translate-y-2 group"
              >
                {/* Sound status pill top-right */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  <button
                    onClick={toggleVideoMute}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/15 text-[10px] font-medium text-white transition-all cursor-pointer shadow-lg"
                    title={isVideoMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isVideoMuted ? (
                      <>
                        <VolumeX className="w-3 h-3 text-red-400" />
                        <span>Muted</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-[#CF9F5D]" />
                        <span>Sound On</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Video Aspect Container: 9:16 aspect ratio */}
                <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center overflow-hidden">
                  <video
                    ref={videoRef}
                    src={PARKWAYS_VILLA_VIDEO_URL}
                    poster={PARKWAYS_VILLA_VIDEO_THUMBNAIL}
                    playsInline
                    preload="metadata"
                    onTimeUpdate={handleVideoTimeUpdate}
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onEnded={() => {
                      setIsVideoPlaying(false);
                      setVideoProgress(0);
                    }}
                    onClick={toggleVideoPlay}
                    className="w-full h-full object-cover cursor-pointer"
                  />

                  {/* Centered Large Play Button (when paused) with sound prompt */}
                  {!isVideoPlaying && (
                    <div
                      onClick={handlePlayWithSound}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#CF9F5D]/30 animate-ping" />
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#CF9F5D] to-[#F3D7A0] hover:scale-110 active:scale-95 text-black shadow-2xl shadow-[#CF9F5D]/40 flex items-center justify-center transition-all duration-300">
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-black translate-x-0.5" />
                        </div>
                      </div>
                      <div className="mt-3.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-lg flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
                        <span>Play with Sound</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Video Control Bar */}
                  <div
                    className={`absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-20 ${
                      isVideoPlaying && !isVideoHovered ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                    }`}
                  >
                    {/* Scrubbing Track */}
                    <div
                      onClick={handleVideoScrub}
                      className="relative w-full h-1.5 hover:h-2 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer mb-2.5 transition-all overflow-hidden"
                      title="Seek video"
                    >
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#CF9F5D] to-[#F3D7A0] rounded-full transition-all duration-150"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={toggleVideoPlay}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
                        >
                          {isVideoPlaying ? (
                            <Pause className="w-4 h-4 fill-white" />
                          ) : (
                            <Play className="w-4 h-4 fill-white" />
                          )}
                        </button>

                        <button
                          onClick={toggleVideoMute}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1"
                          aria-label={isVideoMuted ? 'Unmute' : 'Mute'}
                        >
                          {isVideoMuted ? (
                            <VolumeX className="w-4 h-4 text-red-400" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-[#CF9F5D]" />
                          )}
                        </button>

                        <span className="text-[11px] font-mono text-white/70">
                          {formatVideoTime(videoCurrentTime)} / {formatVideoTime(videoDuration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleToggleFullscreen}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                          aria-label="Toggle Fullscreen"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Swapped Underneath: "The Property at a Glance" part */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-12 border-t border-white/10 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-4 sm:mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#CF9F5D] bg-[#CF9F5D]/10 px-3 py-0.5 rounded-full border border-[#CF9F5D]/20">
              Essential Dimensions
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              The Property at a Glance
            </h2>
            <p className="text-white/60 text-xs mt-1">
              Generous scale, custom architectural volume, and immediate golf enclave positioning.
            </p>
          </div>

          {/* 4 Core Curved Glassmorphic Cards (slightly reduced size, custom subtle borders) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-4 sm:mb-5">
            {/* Plot Size */}
            <div className="group rounded-xl p-3 sm:p-3.5 bg-white/[0.035] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.09] hover:border-[#CF9F5D]/50 transition-all duration-300 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.3)] text-center">
              <div className="w-7 h-7 mx-auto rounded-lg bg-[#CF9F5D]/15 border border-[#CF9F5D]/30 flex items-center justify-center text-[#F3D7A0] mb-1.5 group-hover:scale-105 transition-transform">
                <Layers className="w-3.5 h-3.5 text-[#CF9F5D]" />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">11,241 sq. ft.</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#CF9F5D] mt-0.5">
                Generous Plot Size
              </div>
              <p className="text-[11px] text-white/50 mt-1 leading-snug line-clamp-2">
                Expansive private footprint with manicured gardens &amp; resort pool.
              </p>
            </div>

            {/* Built-Up Area */}
            <div className="group rounded-xl p-3 sm:p-3.5 bg-white/[0.035] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.09] hover:border-[#CF9F5D]/50 transition-all duration-300 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.3)] text-center">
              <div className="w-7 h-7 mx-auto rounded-lg bg-[#CF9F5D]/15 border border-[#CF9F5D]/30 flex items-center justify-center text-[#F3D7A0] mb-1.5 group-hover:scale-105 transition-transform">
                <Maximize2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">~10,000 sq. ft.</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#CF9F5D] mt-0.5">
                Approx. Built-Up Area
              </div>
              <p className="text-[11px] text-white/50 mt-1 leading-snug line-clamp-2">
                Multi-level living spanning basement, ground &amp; rooftop terrace.
              </p>
            </div>

            {/* The Parkways */}
            <div className="group rounded-xl p-3 sm:p-3.5 bg-white/[0.035] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.09] hover:border-[#CF9F5D]/50 transition-all duration-300 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.3)] text-center">
              <div className="w-7 h-7 mx-auto rounded-lg bg-[#CF9F5D]/15 border border-[#CF9F5D]/30 flex items-center justify-center text-[#F3D7A0] mb-1.5 group-hover:scale-105 transition-transform">
                <MapPin className="w-3.5 h-3.5 text-[#CF9F5D]" />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">The Parkways</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#CF9F5D] mt-0.5">
                Dubai Hills Estate
              </div>
              <p className="text-[11px] text-white/50 mt-1 leading-snug line-clamp-2">
                Prestigious enclave steps from the championship golf course.
              </p>
            </div>

            {/* Custom-Built */}
            <div className="group rounded-xl p-3 sm:p-3.5 bg-white/[0.035] hover:bg-white/[0.06] backdrop-blur-xl border border-white/[0.09] hover:border-[#CF9F5D]/50 transition-all duration-300 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.3)] text-center">
              <div className="w-7 h-7 mx-auto rounded-lg bg-[#CF9F5D]/15 border border-[#CF9F5D]/30 flex items-center justify-center text-[#F3D7A0] mb-1.5 group-hover:scale-105 transition-transform">
                <Award className="w-3.5 h-3.5 text-[#CF9F5D]" />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">Custom-Built</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#CF9F5D] mt-0.5">
                Private Residence
              </div>
              <p className="text-[11px] text-white/50 mt-1 leading-snug line-clamp-2">
                Bespoke design with private cinema, elevator &amp; dual kitchens.
              </p>
            </div>
          </div>

          {/* 6 Complementary Specs Grid (refined, slightly reduced size) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-[#CF9F5D]/40 text-center transition-all">
              <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Bedrooms</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">5 En-Suite</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-[#CF9F5D]/40 text-center transition-all">
              <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Bathrooms</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">7 Baths</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-[#CF9F5D]/40 text-center transition-all">
              <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Parking</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">2 Covered Bays</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-[#CF9F5D]/40 text-center transition-all">
              <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">View</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">Community &amp; Garden</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-[#CF9F5D]/40 text-center transition-all">
              <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Proximity</div>
              <div className="text-xs sm:text-sm font-bold text-[#F3D7A0] mt-0.5">Next to Golf Club</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-[#CF9F5D]/40 text-center transition-all">
              <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Downtown Dubai</div>
              <div className="text-xs sm:text-sm font-bold text-[#F3D7A0] mt-0.5">~15 Mins Away</div>
            </div>
          </div>

          {/* Jamoka Properties Square Footage link & credit */}
          <div className="mt-4 pt-3 flex items-center justify-center gap-2 text-xs text-white/60">
            <Award className="w-3.5 h-3.5 text-[#CF9F5D] shrink-0" />
            <span>
              Official plot and built-up square footage is provided by{' '}
              <a
                href="https://jamokaproperties.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#CF9F5D] hover:text-[#F3D7A0] font-semibold underline underline-offset-2 inline-flex items-center gap-1 transition-colors"
              >
                Jamoka Properties
                <ExternalLink className="w-3 h-3 inline" />
              </a>
              {' '}&bull; Licensed RERA Broker (ORN 49679).
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THIRD SECTION: SLIDING IMAGE GALLERY
          - Slightly reduced card and section sizes
          - Showcases sliding pictures with automatic scroll
          - Custom scroller indicator track underneath so users know it scrolls
          - Lightbox modal preview on image click
          - 7th popup card to view all photos
         ========================================================================= */}
      <section
        id="sliding-gallery"
        className="py-10 md:py-14 bg-[#0D0D0D] border-b border-white/5 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#CF9F5D]">
                Visual Showcase
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Villa Gallery
              </h2>
              <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-xl">
                Explore the architecture, landscaped grounds, and bespoke interiors of this distinctive residence.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  setActiveGalleryIndex(0);
                  setGalleryModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#CF9F5D] hover:bg-[#E3C38A] text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-md shadow-[#CF9F5D]/20 cursor-pointer"
              >
                <Images className="w-3.5 h-3.5" />
                <span>See All Images</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollSlider('left')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => scrollSlider('right')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sliding Pictures Row (Slightly reduced card sizes for balanced proportions) */}
          <div
            ref={sliderRef}
            onScroll={updateScrollProgress}
            onMouseEnter={() => setIsSliderHovered(true)}
            onMouseLeave={() => setIsSliderHovered(false)}
            onTouchStart={() => setIsSliderHovered(true)}
            onTouchEnd={() => setIsSliderHovered(false)}
            className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* High-resolution pure villa pictures without text overlays */}
            {galleryImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => openModalAt(index)}
                className="group relative flex-none w-[220px] sm:w-[260px] lg:w-[290px] h-[210px] sm:h-[230px] rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#CF9F5D]/50 transition-all cursor-pointer snap-start"
              >
                <img
                  src={img.thumbnailUrl || img.url}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-full bg-[#CF9F5D] text-black flex items-center justify-center shadow-lg">
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>

                <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white/90 border border-white/10 font-mono">
                    {index + 1}/{galleryImages.length}
                  </span>
                </div>
              </div>
            ))}

            {/* 7th item in the slider: Dedicated 'See All Images' popup card (compact) */}
            <div
              onClick={() => {
                setActiveGalleryIndex(0);
                setGalleryModalOpen(true);
              }}
              className="group relative flex-none w-[200px] sm:w-[230px] h-[210px] sm:h-[230px] rounded-xl overflow-hidden bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-2 border-dashed border-[#CF9F5D]/40 hover:border-[#CF9F5D] backdrop-blur-xl transition-all cursor-pointer snap-start flex flex-col items-center justify-center p-4 text-center hover:bg-white/[0.1] shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-[#CF9F5D]/15 border border-[#CF9F5D]/40 flex items-center justify-center text-[#F3D7A0] mb-2.5 group-hover:scale-110 transition-transform">
                <Images className="w-5 h-5 text-[#CF9F5D]" />
              </div>
              <div className="text-sm font-bold text-white group-hover:text-[#F3D7A0] transition-colors">
                See All Images
              </div>
              <p className="text-[11px] text-white/60 mt-1 max-w-[170px] leading-snug line-clamp-2">
                Browse full high-resolution gallery popup of the villa &amp; grounds.
              </p>
              <span className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#CF9F5D] text-black text-[11px] font-extrabold uppercase tracking-wider group-hover:bg-[#E3C38A] transition-colors shadow-md">
                <span>Open Gallery</span>
                <Maximize2 className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Interactive Scroller Bar Underneath Slider */}
          <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-1/2">
              <span className="text-[10px] text-white/50 shrink-0 uppercase tracking-wider font-medium">
                Gallery Track
              </span>
              <div
                onClick={(e) => {
                  if (!sliderRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                  const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
                  sliderRef.current.scrollTo({ left: percentage * maxScroll, behavior: 'smooth' });
                }}
                className="relative flex-1 h-1.5 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer overflow-hidden transition-colors"
                title="Click or drag to scrub through gallery"
              >
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-[#CF9F5D] to-[#F3D7A0] rounded-full transition-all duration-300 shadow-sm shadow-[#CF9F5D]/50"
                  style={{
                    width: '32%',
                    left: `${Math.min(68, (scrollProgress * 0.68))}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#CF9F5D] shrink-0 font-mono">
                {Math.round(scrollProgress)}%
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-white/50 self-end sm:self-auto">
              <span>Auto-scrolling enabled &bull; Drag or click track to explore</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: "THE ADDRESS IS PART OF THE APPEAL."
          - Dubai Hills Estate master leverage
          - Close to the City. Away from the Ordinary (15 mins Downtown)
          - Golf, Green Spaces & Everyday Convenience
          - Healthcare Within Reach (King's College Hospital)
         ========================================================================= */}
      <section className="py-12 md:py-16 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#CF9F5D]">
              Strategic Location
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-tight">
              The Address Is Part of the Appeal.
            </h2>
            <div className="text-sm sm:text-base font-light text-[#F3D7A0] mt-1.5">
              Dubai Hills Estate
            </div>
            <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed font-light">
              A well-established residential destination known for its landscaped surroundings, golf lifestyle, and convenient access to key parts of Dubai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Close to the City */}
            <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#CF9F5D]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#CF9F5D]/15 border border-[#CF9F5D]/30 flex items-center justify-center text-[#F3D7A0] mb-3.5">
                  <Navigation className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Close to the City. Away from the Ordinary.</h3>
                <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed font-light">
                  Downtown Dubai is approximately 15 minutes away by car under typical traffic conditions, keeping the city's dining, retail, entertainment, and business destinations within convenient reach.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#CF9F5D] font-semibold">
                <span>Downtown Dubai &amp; DIFC</span>
                <span>~15 Mins</span>
              </div>
            </div>

            {/* Card 2: Golf, Green Spaces */}
            <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#CF9F5D]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#CF9F5D]/15 border border-[#CF9F5D]/30 flex items-center justify-center text-[#F3D7A0] mb-3.5">
                  <Trees className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Golf, Green Spaces &amp; Everyday Convenience</h3>
                <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed font-light">
                  Enjoy proximity to Dubai Hills Golf Club, landscaped outdoor spaces, and the wider community's retail and lifestyle amenities including Dubai Hills Mall and central parks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#CF9F5D] font-semibold">
                <span>Dubai Hills Golf Club</span>
                <span>Immediate Proximity</span>
              </div>
            </div>

            {/* Card 3: Healthcare Within Reach */}
            <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#CF9F5D]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#CF9F5D]/15 border border-[#CF9F5D]/30 flex items-center justify-center text-[#F3D7A0] mb-3.5">
                  <HeartHandshake className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Healthcare Within Reach</h3>
                <p className="text-xs sm:text-sm text-white/70 mt-2 leading-relaxed font-light">
                  King's College Hospital London – Dubai is located within Dubai Hills Estate, adding to the convenience of living in this established community.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#CF9F5D] font-semibold">
                <span>King's College Hospital</span>
                <span>Inside Enclave</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DETAILED PROPERTY OVERVIEW & 13 ARCHITECTURAL SPECIFICATIONS
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Narrative overview */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#CF9F5D]">
                  Curated Secondary Exclusive
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                  Detailed Property Overview
                </h2>
              </div>

              <p className="text-white/75 text-sm sm:text-base leading-relaxed font-light">
                Located in <strong className="text-white font-medium">The Parkways</strong>, one of the sought-after villa areas of Dubai Hills Estate, the property offers a peaceful environment while remaining close to Dubai Hills Golf Club and the community's key lifestyle amenities.
              </p>

              <p className="text-white/75 text-sm sm:text-base leading-relaxed font-light">
                A rare opportunity to own a substantial custom-built residence offering privacy, space, and a truly individual design.
              </p>

              <div className="p-6 rounded-2xl bg-[#CF9F5D]/10 border border-[#CF9F5D]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#F3D7A0] font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-[#CF9F5D]" />
                  <span>Private Broker Representation</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Contact Jamoka Properties for more information or to arrange an exclusive consultation. Verified documents and title certificates available on request.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`tel:${PHONE_INTL}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#CF9F5D]" />
                    <span>{PHONE_DISPLAY}</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Architectural Checklist (Minimal & space-efficient) */}
            <div className="lg:col-span-7">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#CF9F5D]" />
                    <span>Bespoke Residence Features</span>
                  </h3>
                  <span className="text-[11px] text-[#CF9F5D] font-semibold uppercase tracking-wider">
                    13 Architectural Pillars
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {architecturalFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="py-2 px-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] hover:border-[#CF9F5D]/30 transition-all flex items-start gap-2"
                    >
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-[#CF9F5D]/15 border border-[#CF9F5D]/30 flex items-center justify-center text-[#F3D7A0] shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white leading-tight">{feat.title}</div>
                        <div className="text-[11px] text-white/55 mt-0.5 leading-snug line-clamp-2">{feat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          15 VERIFIED PROPERTY & COMMUNITY AMENITIES
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#121212] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#CF9F5D]">
                Amenities &amp; Lifestyle
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                15 Verified Property &amp; Community Amenities
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CF9F5D]/10 border border-[#CF9F5D]/30 text-xs font-semibold text-[#F3D7A0] self-start md:self-auto">
              <ShieldCheck className="w-4 h-4 text-[#CF9F5D]" />
              <span>100% Verified Specification</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {amenities.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#CF9F5D]/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#F3D7A0] shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white/90 leading-tight">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BUILDING & TECHNICAL SPECIFICATIONS TABLE
         ========================================================================= */}
      <section className="py-16 md:py-24 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#CF9F5D]">
              Verified Technical Data
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Building &amp; Property Specifications
            </h2>
            <p className="text-white/60 text-sm mt-2">
              Official records confirmed with Dubai Land Department &amp; RERA registration.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="divide-y divide-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
                  Building / Project
                </span>
                <span className="text-sm sm:text-base font-bold text-white sm:text-right mt-1 sm:mt-0">
                  The Parkways
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
                  Floor Level
                </span>
                <span className="text-sm sm:text-base font-bold text-white sm:text-right mt-1 sm:mt-0">
                  Mid Floor (Multi-Level + Basement + Rooftop)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
                  Furnishing
                </span>
                <span className="text-sm sm:text-base font-bold text-white sm:text-right mt-1 sm:mt-0">
                  Unfurnished (Bespoke Interior Canvas)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
                  Parking
                </span>
                <span className="text-sm sm:text-base font-bold text-white sm:text-right mt-1 sm:mt-0">
                  2 Dedicated Covered Spaces
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
                  View Orientation
                </span>
                <span className="text-sm sm:text-base font-bold text-white sm:text-right mt-1 sm:mt-0">
                  Community &amp; Garden View (Next to Golf Course)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
                  Emirate &amp; Area
                </span>
                <span className="text-sm sm:text-base font-bold text-white sm:text-right mt-1 sm:mt-0">
                  Dubai Hills Estate, Dubai
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
                  Plot Area
                </span>
                <span className="text-sm sm:text-base font-bold text-[#F3D7A0] sm:text-right mt-1 sm:mt-0">
                  11,241 sq. ft.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50">
                  Built-Up Area (BUA)
                </span>
                <span className="text-sm sm:text-base font-bold text-[#F3D7A0] sm:text-right mt-1 sm:mt-0">
                  Approx. 10,000 sq. ft.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  Square Footage Source
                </span>
                <span className="text-sm sm:text-base font-semibold text-white sm:text-right mt-1 sm:mt-0">
                  Provided by{' '}
                  <a
                    href="https://jamokaproperties.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#CF9F5D] hover:text-[#F3D7A0] underline underline-offset-2 font-bold inline-flex items-center gap-1"
                  >
                    Jamoka Properties
                    <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 sm:p-5 bg-[#CF9F5D]/10">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#CF9F5D] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  RERA Permit
                </span>
                <span className="text-sm sm:text-base font-mono font-bold text-white sm:text-right mt-1 sm:mt-0">
                  PERMIT-DXB-000007
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: CONTACT FORM (Connected to Google Sheets Apps Script)
          - Clean contact form with no booking dates
          - Sends directly via sendLeadToServer into Google Sheets
         ========================================================================= */}
      <section id="inquire" className="py-20 md:py-28 bg-[#121212] border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#CF9F5D]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CF9F5D]/20 text-[#F3D7A0] text-xs font-semibold uppercase tracking-wider border border-[#CF9F5D]/30 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Contact Inquiry
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Inquire About This Residence
              </h2>
              <p className="text-white/70 text-sm sm:text-base mt-3 leading-relaxed font-light">
                Submit your details below to receive the comprehensive property dossier, floor plans, and pricing from our senior secondary market advisors.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-white/[0.05] border border-[#CF9F5D]/40 text-center animate-fade-in">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#CF9F5D]/20 flex items-center justify-center text-[#F3D7A0]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Thank You for Reaching Out</h3>
                <p className="text-sm text-white/70 mt-2 max-w-md mx-auto">
                  Your inquiry has been received and logged. Our senior advisor will contact you at <strong className="text-white">{leadForm.phone}</strong> shortly.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Open in WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setLeadForm({
                        fullName: '',
                        phone: '',
                        email: '',
                        message: '',
                      });
                    }}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Wright"
                      value={leadForm.fullName}
                      onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 000 0000"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="alexander@example.com"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                    Message / Inquiries
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your message, questions regarding pricing, or request title deed & floor plans..."
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Lock className="w-3.5 h-3.5 text-[#CF9F5D]" />
                    <span>Inquiry logged securely to official client database.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#CF9F5D] to-[#E3C38A] text-black font-extrabold text-sm uppercase tracking-wider hover:scale-102 hover:shadow-lg hover:shadow-[#CF9F5D]/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Direct Instant Channels */}
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-center text-xs text-white/60">
              <a
                href={`tel:${PHONE_INTL}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#CF9F5D]" />
                Direct Hotline: <strong className="text-white underline underline-offset-2">{PHONE_DISPLAY}</strong>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                WhatsApp: <strong className="text-white underline underline-offset-2">{PHONE_DISPLAY}</strong>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 hover:text-[#CF9F5D] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#CF9F5D]" />
                Email: <strong className="text-white underline underline-offset-2">{CONTACT_EMAIL}</strong>
              </a>
              <span className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
                Jamoka Properties LLC
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#CF9F5D]" />
                RERA: PERMIT-DXB-000007
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#080808] border-t border-white/10 text-center text-white/50 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={SITE_LOGO_URL} alt="Logo" className="h-7 w-auto object-contain opacity-80" />
            <span>&copy; {new Date().getFullYear()} Jamoka Properties LLC. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${PHONE_INTL}`}
              className="text-white hover:text-[#CF9F5D] transition-colors font-medium flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <span>&bull;</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:text-[#1EBE5D] transition-colors font-medium flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <span>&bull;</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-white hover:text-[#CF9F5D] transition-colors font-medium flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>{CONTACT_EMAIL}</span>
            </a>
            <span>&bull;</span>
            <button
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Back to Marketplace
            </button>
            <span>&bull;</span>
            <span className="text-[#CF9F5D]">PERMIT-DXB-000007</span>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          FULL GALLERY LIGHTBOX MODAL WITH NAVIGATION & THUMBNAILS
         ========================================================================= */}
      {galleryModalOpen && (
        <div
          onClick={() => setGalleryModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in"
        >
          {/* Top Modal Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between py-2 text-white"
          >
            <div>
              <span className="text-xs uppercase tracking-wider text-[#CF9F5D] font-bold">
                The Parkways Residence Gallery
              </span>
              <div className="text-sm font-semibold text-white/80">
                {activeGalleryIndex !== null
                  ? galleryImages[activeGalleryIndex]?.title
                  : 'Residence Gallery'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 font-medium">
                {activeGalleryIndex !== null ? `${activeGalleryIndex + 1} of ${galleryImages.length}` : 'Gallery'}
              </span>

              <button
                onClick={() => setGalleryModalOpen(false)}
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Active Image Display with Prev/Next Controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 flex items-center justify-center w-full max-w-6xl my-2"
          >
            {/* Prev Button */}
            <button
              onClick={prevModalImage}
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all hover:scale-105 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Image */}
            {activeGalleryIndex !== null && galleryImages[activeGalleryIndex] && (
              <div className="relative max-h-[70vh] flex flex-col items-center">
                <img
                  src={galleryImages[activeGalleryIndex].url}
                  alt={galleryImages[activeGalleryIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[66vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
                />
                <div className="mt-3 text-center">
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {galleryImages[activeGalleryIndex].title}
                  </h4>
                  <p className="text-xs text-white/60 mt-0.5">
                    {galleryImages[activeGalleryIndex].caption}
                  </p>
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={nextModalImage}
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all hover:scale-105 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnails Row */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-2 px-1"
          >
            {galleryImages.map((thumb, idx) => (
              <button
                key={thumb.id}
                onClick={() => setActiveGalleryIndex(idx)}
                className={`relative flex-none w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeGalleryIndex === idx
                    ? 'border-[#CF9F5D] scale-105 shadow-md shadow-[#CF9F5D]/30'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={thumb.thumbnailUrl || thumb.url}
                  alt={thumb.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom icon component for water / waves
function WavesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  );
}
