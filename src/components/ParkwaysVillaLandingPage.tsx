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
  Lock,
  Compass,
  HeartHandshake,
  ExternalLink,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Clock,
  Flame,
  Calendar,
} from 'lucide-react';
import { sendLeadToServer } from '../services/googleSheets';
import { PARKWAYS_VILLA_GALLERY } from '../data/parkwaysDriveGallery';

// Hero image provided by user
const PARKWAYS_VILLA_HERO_IMAGE =
  'https://ik.imagekit.io/zb5ih81ig/Twilight%20Modern%20Mansion%20with%20Rooftop%20Terrace.png';

// Centered Twilight villa image for showcase section
const PARKWAYS_TWILIGHT_VILLA_IMAGE =
  'https://ik.imagekit.io/zb5ih81ig/Twilight%20Luxury%20Villa%20and%20Pool.png';

// 9:16 Vertical Video showcase URL
const PARKWAYS_VILLA_VIDEO_URL =
  'https://ik.imagekit.io/pkn80iczwu/Dubai%20Hills%20YL-copyx23.mp4';

// Thumbnail extracted directly from the video
const PARKWAYS_VILLA_VIDEO_THUMBNAIL =
  'https://ik.imagekit.io/pkn80iczwu/Dubai%20Hills%20YL-copyx23.mp4/ik-thumbnail.jpg';

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
  // Sticky bottom bar and hero scroll scale
  const [heroZoomScale, setHeroZoomScale] = useState<number>(1);
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);

  // Gallery slider state & auto-scrolling
  const sliderRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isSliderHovered, setIsSliderHovered] = useState<boolean>(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  // Video state & handlers
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [isVideoHovered, setIsVideoHovered] = useState<boolean>(false);

  // Active Floor Plan tab for interactive breakdown
  const [activeFloorTab, setActiveFloorTab] = useState<'basement' | 'ground' | 'first' | 'rooftop'>('ground');

  // VIP Upsell Popup Modal
  const [vipModalOpen, setVipModalOpen] = useState<boolean>(false);
  const [vipModalTitle, setVipModalTitle] = useState<string>('Request Official Price Guide & Floor Plans');
  const [vipModalSubtitle, setVipModalSubtitle] = useState<string>('Instant access to verified pricing, architectural CAD layouts & RERA documentation.');
  const [vipModalIntent, setVipModalIntent] = useState<string>('Price & Floor Plans');
  const [vipForm, setVipForm] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  const [vipSubmitting, setVipSubmitting] = useState<boolean>(false);
  const [vipSubmitted, setVipSubmitted] = useState<boolean>(false);

  // Hero Lead Form (High-Converting Meta Ads Form)
  const [heroForm, setHeroForm] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  const [heroSubmitting, setHeroSubmitting] = useState(false);
  const [heroFormSubmitted, setHeroFormSubmitted] = useState(false);

  // Bottom Inquiry Form
  const [bottomForm, setBottomForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });
  const [bottomSubmitting, setBottomSubmitting] = useState(false);
  const [bottomFormSubmitted, setBottomFormSubmitted] = useState(false);

  const [copiedShare, setCopiedShare] = useState(false);

  // Pre-filled WhatsApp URLs
  const whatsappHeroMessage = encodeURIComponent(
    `Hello Jamoka Properties, I saw your Meta ad for The Parkways Custom-Built 6-Bed Villa in Dubai Hills Estate (11,241 sq. ft. plot, RERA: PERMIT-DXB-000007). Please send me the price guide, verified brochure, and floor plans.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_RAW}?text=${whatsappHeroMessage}`;

  // Scroll listener for sticky CTA bar and hero zoom
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 600;
      const progress = Math.min(scrollY / maxScroll, 1);
      setHeroZoomScale(1 + progress * 0.1);

      // Sticky bar appears after scrolling past hero CTA (around 480px)
      if (scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Soft Exit-Intent & Timed Popup for Meta Ads traffic
  useEffect(() => {
    // 1. Timed prompt after 9 seconds of active browsing if user hasn't converted
    const hasSeenPopup = sessionStorage.getItem('parkways_meta_upsell_seen');
    let timer: NodeJS.Timeout | null = null;
    if (!hasSeenPopup) {
      timer = setTimeout(() => {
        openVipModal(
          'Download Verified Brochure & Pricing Guide',
          'Get the full PDF dossier with exact room dimensions, title verification & private viewing availability.',
          'Meta Ads Timed Upsell'
        );
        sessionStorage.setItem('parkways_meta_upsell_seen', 'true');
      }, 9000);
    }

    // 2. Desktop exit-intent trigger (when mouse moves towards top of viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !sessionStorage.getItem('parkways_exit_intent_seen')) {
        openVipModal(
          'Before You Leave: Get The Official Price Guide',
          'Download the verified brochure, CAD floor plans & title deed directly to your WhatsApp or email.',
          'Desktop Exit Intent'
        );
        sessionStorage.setItem('parkways_exit_intent_seen', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const openVipModal = (title?: string, subtitle?: string, intent?: string) => {
    if (title) setVipModalTitle(title);
    if (subtitle) setVipModalSubtitle(subtitle);
    if (intent) setVipModalIntent(intent);
    setVipSubmitted(false);
    setVipModalOpen(true);
  };

  // Sort images numerically
  const galleryImages = useMemo(() => {
    return [...PARKWAYS_VILLA_GALLERY].sort((a, b) =>
      a.originalName.localeCompare(b.originalName, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, []);

  // Auto-scrolling carousel
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (galleryModalOpen) setGalleryModalOpen(false);
        if (vipModalOpen) setVipModalOpen(false);
      }
      if (galleryModalOpen) {
        if (e.key === 'ArrowRight') nextModalImage();
        if (e.key === 'ArrowLeft') prevModalImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryModalOpen, vipModalOpen, activeGalleryIndex]);

  // Video playback
  const handlePlayWithSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsVideoMuted(false);
      videoRef.current
        .play()
        .then(() => setIsVideoPlaying(true))
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
        .then(() => setIsVideoPlaying(true))
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
  };

  const handleToggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  const formatVideoTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

  // Submit Hero Form
  const handleHeroFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.fullName || !heroForm.phone) return;

    setHeroSubmitting(true);
    try {
      await sendLeadToServer({
        formType: 'contact_us',
        source: 'Meta Ads Hero Form - The Parkways Villa',
        name: heroForm.fullName,
        fullName: heroForm.fullName,
        phone: heroForm.phone,
        email: heroForm.email || '',
        message: 'Requested: Price Guide, Floor Plans & Verified Dossier for The Parkways Custom-Built Villa (Dubai Hills Estate).',
        subject: 'Meta Ads Lead - The Parkways Villa',
        propertyTitle: 'The Parkways Custom-Built Villa, Dubai Hills Estate',
        propertyArea: 'Dubai Hills Estate',
      });
    } catch (err) {
      console.error('Error submitting hero form:', err);
    } finally {
      setHeroSubmitting(false);
      setHeroFormSubmitted(true);
    }
  };

  // Submit VIP Modal Form
  const handleVipFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipForm.fullName || !vipForm.phone) return;

    setVipSubmitting(true);
    try {
      await sendLeadToServer({
        formType: 'contact_us',
        source: `Meta Ads VIP Modal: ${vipModalIntent}`,
        name: vipForm.fullName,
        fullName: vipForm.fullName,
        phone: vipForm.phone,
        email: vipForm.email || '',
        message: `VIP Request [${vipModalIntent}] for The Parkways Custom-Built Villa.`,
        subject: `Meta Ads VIP Lead - ${vipModalIntent}`,
        propertyTitle: 'The Parkways Custom-Built Villa, Dubai Hills Estate',
        propertyArea: 'Dubai Hills Estate',
      });
    } catch (err) {
      console.error('Error submitting VIP form:', err);
    } finally {
      setVipSubmitting(false);
      setVipSubmitted(true);
    }
  };

  // Submit Bottom Form
  const handleBottomFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bottomForm.fullName || !bottomForm.phone) return;

    setBottomSubmitting(true);
    try {
      await sendLeadToServer({
        formType: 'contact_us',
        source: 'Meta Ads Bottom Inquiry Section',
        name: bottomForm.fullName,
        fullName: bottomForm.fullName,
        phone: bottomForm.phone,
        email: bottomForm.email || '',
        message: bottomForm.message || 'Bottom form inquiry for The Parkways Custom-Built Villa',
        subject: 'Inquiry - The Parkways Custom-Built Villa',
        propertyTitle: 'The Parkways Custom-Built Villa, Dubai Hills Estate',
        propertyArea: 'Dubai Hills Estate',
      });
    } catch (err) {
      console.error('Error submitting bottom form:', err);
    } finally {
      setBottomSubmitting(false);
      setBottomFormSubmitted(true);
    }
  };

  const architecturalFeatures = [
    { title: '11,241 sq. ft. Plot', desc: 'Substantial private perimeter with landscaped grounds and resort swimming pool.' },
    { title: '~10,000 sq. ft. BUA', desc: 'Generous multi-level living spanning basement, ground, first, and rooftop terrace.' },
    { title: '1-of-1 Custom Architecture', desc: 'Individually commissioned design with bespoke joinery and European craftsmanship.' },
    { title: 'Private Lap Pool & Sun Deck', desc: 'Temperature-controlled swimming pool with outdoor shower and shaded lounging.' },
    { title: 'Internal Motorized Elevator', desc: 'Quiet passenger lift connecting all 4 levels from basement to rooftop.' },
    { title: 'Acoustic Cinema Theater', desc: 'Dedicated private screening room configured with acoustic panelling.' },
    { title: 'Multipurpose Basement Wing', desc: 'Expansive lower floor suited for private wellness, gallery, games, or gym.' },
    { title: 'Panoramic Rooftop Terrace', desc: '360° open-air skyline viewing deck with built-in barbecue entertaining zone.' },
    { title: 'Dual Chef & Show Kitchens', desc: 'Marble social show kitchen plus fully-equipped service kitchen for seamless catering.' },
    { title: '2 Covered Vehicular Bays', desc: 'Secure sheltered parking with direct foyer and kitchen access.' },
    { title: '6 Bedrooms', desc: 'Private master sanctuary with dressing salon, terrace access, and bespoke joinery.' },
    { title: '7 Designer Bathrooms', desc: 'Finished with imported natural stone slabs, Hansgrohe fixtures, and soaking tubs.' },
    { title: 'Vacant on Transfer', desc: 'Completed residence with clear title deed, ready for immediate occupancy.' },
  ];

  const amenities = [
    { name: 'Private Swimming Pool', icon: Sparkles },
    { name: 'Private Internal Lift', icon: Building2 },
    { name: 'Dedicated Cinema Room', icon: Eye },
    { name: 'Rooftop Lounge Deck', icon: Layers },
    { name: 'Show & Service Kitchens', icon: Utensils },
    { name: "Maid's Room", icon: Building2 },
    { name: 'Private Study Room', icon: FileText },
    { name: 'Covered Multi-Vehicle Bays', icon: Car },
    { name: 'Outdoor BBQ Pavilion', icon: Utensils },
    { name: 'Central Multi-Zone AC', icon: Sparkles },
    { name: 'Pet Friendly Community', icon: Trees },
    { name: 'Children’s Playgrounds', icon: Trees },
    { name: 'Championship Golf Proximity', icon: Compass },
    { name: 'Dubai Hills Mall (5 Mins)', icon: Navigation },
    { name: "King's College Hospital Nearby", icon: HeartHandshake },
  ];

  const floorPlanLevels = [
    {
      id: 'ground',
      title: 'Ground Level',
      subtitle: 'Hospitality & Social Salons',
      highlights: [
        'Triple-height entrance gallery and formal reception foyer',
        'Expansive open-plan living and formal dining salons',
        'Designer marble show kitchen with breakfast bar island',
        'Secondary heavy prep kitchen with service courtyard access',
        'Direct walkout to private swimming pool and alfresco sun terrace',
        'Private guest bedroom suite and powder room',
      ],
    },
    {
      id: 'first',
      title: 'First Level',
      subtitle: 'Private Master & Family Suites',
      highlights: [
        'Grand master suite with private wrap-around terrace & pool view',
        'Dual bespoke walk-in dressing salons with luxury vanity joinery',
        '5 additional king-sized bedrooms with built-in closets',
        'Central family lounge and private reading retreat',
        'Biometric elevator landing directly on upper floor corridor',
      ],
    },
    {
      id: 'basement',
      title: 'Basement Level',
      subtitle: 'Entertainment & Wellness Wing',
      highlights: [
        'Acoustically treated private cinema room with tiered seating layout',
        'Spacious recreational games gallery or private art collection salon',
        'Wellness & fitness sanctuary with dedicated shower & washroom',
        'Dedicated service staff quarters and full laundry hub',
        'Secure multi-room storage facilities and utility hub',
      ],
    },
    {
      id: 'rooftop',
      title: 'Rooftop Terrace',
      subtitle: 'Skyline Sunset Entertaining Deck',
      highlights: [
        'Unobstructed sunset and Dubai Hills community panoramic views',
        'Built-in barbecue kitchen station and shaded pergola dining zone',
        'Evening cocktail lounge setup with perimeter ambient lighting',
        'Direct elevator service straight up from ground and basement',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-[#CF9F5D] selection:text-black font-sans antialiased pb-20 sm:pb-24">
      {/* =========================================================================
          TOP CONVERSION HEADER
          - Clear logo
          - Jamoka Properties license attribution
          - 1-click WhatsApp & Direct Hotline
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Marketplace</span>
            </button>
            <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />
            <img
              src={SITE_LOGO_URL}
              alt="SQFT DXB"
              className="h-7 sm:h-9 w-auto max-w-[110px] sm:max-w-[145px] object-contain block"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-white/10 text-white/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer hidden sm:block"
              title="Share listing"
            >
              {copiedShare ? (
                <span className="text-xs text-[#CF9F5D] px-1 font-medium">Copied!</span>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <a
              href={`tel:${PHONE_INTL}`}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/15 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>{PHONE_DISPLAY}</span>
            </a>

            <button
              onClick={() =>
                openVipModal(
                  'Request Full Price Guide & Brochure',
                  'Instant download of the verified price guide, CAD floor plans & title deed verification.',
                  'Header CTA'
                )
              }
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#CF9F5D]/20 hover:bg-[#CF9F5D]/30 border border-[#CF9F5D]/50 text-[#F3D7A0] text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>Get Price &amp; Brochure</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#25D366]/20 transition-all hover:scale-102 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Agent</span>
            </a>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION: OPTIMIZED FOR META ADS TRAFFIC
          - Instant clarity: What is being sold? (6-Bed Custom Mansion in The Parkways, Dubai Hills)
          - Above-the-fold lead capture card with 1-click WhatsApp & email dossier delivery
          - High-contrast visual with subtle scroll zoom
          - Low-friction form with intent checkboxes
         ========================================================================= */}
      <section className="relative w-full bg-[#0D0D0D] overflow-hidden">
        {/* Full Villa Viewport Showcase */}
        <div className="relative w-full h-[46vh] sm:h-[60vh] lg:h-[68vh] min-h-[340px] max-h-[700px] overflow-hidden bg-[#0D0D0D]">
          <img
            src={PARKWAYS_VILLA_HERO_IMAGE}
            alt="The Parkways Custom Residence - Dubai Hills Estate"
            style={{
              transform: `scale(${heroZoomScale})`,
              transformOrigin: 'center center',
            }}
            className="w-full h-full object-cover object-[center_35%] transition-transform duration-100 ease-out will-change-transform"
          />

          {/* Social Proof / Urgency Ticker on Top of Image */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-lg">
              <Sparkles className="w-3 h-3 text-[#CF9F5D]" />
              1 of 1 Custom Mansion &bull; The Parkways
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-xs font-bold text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-3 h-3" />
              Vacant on Transfer &bull; Ready to Move In
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => {
                const galleryEl = document.getElementById('sliding-gallery');
                galleryEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/20 text-xs font-semibold text-white transition-all cursor-pointer shadow-lg"
            >
              <Images className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>50 Photos &bull; View Gallery</span>
            </button>
          </div>

          {/* Soft Bottom Gradient Fade into content */}
          <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-44 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 pb-8 sm:pb-12">
          {/* Main Title & Kicker */}
          <div className="mb-6 max-w-5xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#CF9F5D] mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>The Parkways &bull; Dubai Hills Estate</span>
              <span className="text-white/30">&bull;</span>
              <span className="text-white/90">Custom-Built 6-Bedroom Luxury Mansion For Sale</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
              Own your prime address in Dubai Hills Estate.
            </h1>
          </div>

          {/* 2-Column Split: Value Proposition on Left, High-Converting Lead Magnet Card on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column (7 cols): The Exact Value & Specs */}
            <div className="lg:col-span-7 space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CF9F5D]/20 border border-[#CF9F5D]/40 text-[#F3D7A0] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-[#CF9F5D]" />
                  Verified Exclusive
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-medium backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  RERA Permit
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Vacant on Transfer
                </span>
              </div>

              {/* Subtitle & Clear Pitch */}
              <div>
                <p className="text-lg sm:text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#F3D7A0] via-[#CF9F5D] to-[#E3C38A] leading-tight">
                  A Residence Defined by Space, Privacy &amp; Prestige.
                </p>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light mt-2">
                  Custom-built 6-bedroom luxury mansion in <strong className="text-white font-medium">The Parkways</strong>, Dubai Hills Estate. Spanning an <strong className="text-white font-medium">11,241 sq. ft. plot</strong> with <strong className="text-white font-medium">~10,000 sq. ft. BUA</strong> across 4 levels. Features a private pool, private cinema, elevator, rooftop terrace, and dual kitchens.
                </p>
              </div>

              {/* 4 Core Quick Spec Blocks */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 backdrop-blur-md space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center sm:text-left">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/50 uppercase tracking-wider text-[10px] block font-semibold">Plot Size</span>
                    <span className="font-black text-sm sm:text-base text-[#F3D7A0]">11,241 sq. ft.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/50 uppercase tracking-wider text-[10px] block font-semibold">Built-Up Area</span>
                    <span className="font-black text-sm sm:text-base text-[#F3D7A0]">~10,000 sq. ft.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/50 uppercase tracking-wider text-[10px] block font-semibold">Bedrooms</span>
                    <span className="font-black text-sm sm:text-base text-white">6 Bedrooms</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/50 uppercase tracking-wider text-[10px] block font-semibold">Occupancy</span>
                    <span className="font-black text-sm sm:text-base text-[#25D366]">Vacant</span>
                  </div>
                </div>

                {/* Square footage attribution */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#CF9F5D] shrink-0" />
                    <span>
                      Square footage certified by{' '}
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
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() =>
                    openVipModal(
                      'Request Price Guide & Floor Plans',
                      'Submit your details for complete pricing breakdown, title documentation & floor plans.',
                      'Hero Primary Button'
                    )
                  }
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#CF9F5D] to-[#E3C38A] text-[#0D0D0D] font-extrabold text-xs sm:text-sm tracking-wider uppercase hover:shadow-xl hover:shadow-[#CF9F5D]/30 hover:scale-102 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Get Price Guide &amp; Brochure</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm tracking-wide hover:shadow-xl hover:shadow-[#25D366]/30 hover:scale-102 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Brochure</span>
                </a>

                <button
                  onClick={() =>
                    openVipModal(
                      'Download Architectural Floor Plans',
                      'Access detailed high-resolution architectural blueprints for all 4 levels (Basement, Ground, First & Rooftop).',
                      'Floor Plans Download Button'
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#CF9F5D]" />
                  <span>Floor Plans (PDF)</span>
                </button>
              </div>

              {/* Urgency Callout for Meta Ads traffic */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-3 text-xs text-white/70">
                <Flame className="w-4 h-4 text-[#CF9F5D] shrink-0" />
                <span>
                  <strong>Rare Secondary Opportunity:</strong> Standalone custom-built villas in The Parkways are exceptionally tightly held with limited active supply.
                </span>
              </div>
            </div>

            {/* Right Column (5 cols): High-Converting Meta Ads Lead Magnet Form */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1C1C1C] via-[#141414] to-[#0F0F0F] border border-[#CF9F5D]/40 p-5 sm:p-7 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#CF9F5D]/25 rounded-full blur-2xl pointer-events-none" />

                <div className="mb-4 relative z-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#CF9F5D]/20 border border-[#CF9F5D]/40 text-[#F3D7A0] text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-[#CF9F5D]" />
                      Instant Access
                    </span>
                    <span className="text-[10px] text-[#25D366] font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Reply within 15 mins
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Get Price Guide &amp; Floor Plans
                  </h3>
                  <p className="text-white/60 text-xs mt-1 leading-relaxed">
                    Receive the verified RERA price guide, CAD architectural drawings, and video tour directly via WhatsApp/Email.
                  </p>
                </div>

                {heroFormSubmitted ? (
                  <div className="py-6 px-4 rounded-xl bg-white/[0.04] border border-[#CF9F5D]/40 text-center animate-fade-in relative z-10">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#CF9F5D]/20 flex items-center justify-center text-[#F3D7A0]">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-white">Your Request Has Been Received</h4>
                    <p className="text-xs text-white/70 mt-1 max-w-xs mx-auto leading-relaxed">
                      Thank you, <strong className="text-white">{heroForm.fullName}</strong>. An advisor is preparing your dossier and will reach out to <strong className="text-white">{heroForm.phone}</strong>.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Chat on WhatsApp for Instant Pricing</span>
                      </a>
                      <button
                        onClick={() => {
                          setHeroFormSubmitted(false);
                          setHeroForm({
                            fullName: '',
                            phone: '',
                            email: '',
                          });
                        }}
                        className="px-3 py-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleHeroFormSubmit} className="space-y-3.5 relative z-10">

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

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={heroSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#CF9F5D] to-[#E3C38A] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:opacity-95 hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-[#CF9F5D]/25 disabled:opacity-50"
                      >
                        {heroSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending Request...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Download Dossier &amp; Price Guide</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-1.5 flex items-center justify-between text-[10px] text-white/50">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#CF9F5D]" />
                        Direct to Jamoka Properties
                      </span>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline font-semibold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3 fill-[#25D366]" />
                        Prefer instant WhatsApp?
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: RESIDENCE IN MOTION & ARCHITECTURAL HIGHLIGHTS
          - 9:16 vertical video tour with audio toggle
          - Centered luxury villa picture with pool
          - 4 clear lifestyle advantages
         ========================================================================= */}
      <section className="bg-[#101010] relative overflow-hidden border-y border-white/5 py-12 sm:py-16">
        {/* Video Tour & Overview Split (Pushed up directly underneath the form section) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: 9:16 Video Player */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div
                onMouseEnter={() => setIsVideoHovered(true)}
                onMouseLeave={() => setIsVideoHovered(false)}
                className="relative w-full max-w-[340px] sm:max-w-[370px] rounded-2xl sm:rounded-3xl overflow-hidden bg-black/95 border border-white/15 hover:border-[#CF9F5D]/60 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(207,159,93,0.28)] transition-all duration-500 hover:-translate-y-1.5 group"
              >
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

                  {!isVideoPlaying && (
                    <div
                      onClick={handlePlayWithSound}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-20 h-20 rounded-full bg-[#CF9F5D]/30 animate-ping" />
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-[#CF9F5D] to-[#F3D7A0] hover:scale-110 active:scale-95 text-black shadow-2xl shadow-[#CF9F5D]/40 flex items-center justify-center transition-all duration-300">
                          <Play className="w-7 h-7 fill-black translate-x-0.5" />
                        </div>
                      </div>
                      <div className="mt-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-lg flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
                        <span>Play Video Tour with Sound</span>
                      </div>
                    </div>
                  )}

                  {/* Scrubbing & Controls */}
                  <div
                    className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-20 ${
                      isVideoPlaying && !isVideoHovered ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                    }`}
                  >
                    <div
                      onClick={handleVideoScrub}
                      className="relative w-full h-1.5 hover:h-2 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer mb-2 transition-all overflow-hidden"
                      title="Seek video"
                    >
                      <div
                        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#CF9F5D] to-[#F3D7A0] rounded-full"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleVideoPlay}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                          aria-label={isVideoPlaying ? 'Pause' : 'Play'}
                        >
                          {isVideoPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                        </button>
                        <span className="text-[10px] font-mono text-white/70">
                          {formatVideoTime(videoCurrentTime)} / {formatVideoTime(videoDuration)}
                        </span>
                      </div>
                      <button
                        onClick={handleToggleFullscreen}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                        aria-label="Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Key Architectural Highlights & Action CTAs */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#CF9F5D]">
                  The Residence Perspective &bull; Dubai Hills Estate
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Space, Light &amp; Uncompromised Scale
                </h2>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light mt-2">
                  Positioned in the quietest enclave of The Parkways, this 1-of-1 custom mansion spans an expansive 11,241 sq. ft. plot with ~10,000 sq. ft. of built-up area across four levels. Total seclusion with swift 15-minute access to Downtown Dubai.
                </p>
              </div>

              {/* 4 Feature highlight blocks (minimal & clear) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#CF9F5D]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#CF9F5D] shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Private Cinema Room</h4>
                      <p className="text-[11px] text-white/50">Acoustic isolation &amp; tiered seating</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#CF9F5D]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#CF9F5D] shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Internal Passenger Lift</h4>
                      <p className="text-[11px] text-white/50">Connects basement to rooftop terrace</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#CF9F5D]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#CF9F5D] shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Dual Chef Kitchens</h4>
                      <p className="text-[11px] text-white/50">Marble show kitchen + heavy prep suite</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#CF9F5D]/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#CF9F5D] shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Rooftop Sunset Lounge</h4>
                      <p className="text-[11px] text-white/50">360° open-air skyline entertaining</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Conversion CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#25D366]/20 transition-all hover:scale-102 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Video &amp; Pricing</span>
                </a>

                <button
                  onClick={() =>
                    openVipModal(
                      'Request Price Guidance & Full Dossier',
                      'Receive confidential pricing, title deeds & floor plans directly to your email or WhatsApp.',
                      'Section 2 Perspective CTA'
                    )
                  }
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#CF9F5D] to-[#E3C38A] text-black text-xs sm:text-sm font-extrabold uppercase tracking-wider hover:opacity-95 hover:scale-102 transition-all shadow-md cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Get Full Dossier</span>
                </button>

                <button
                  onClick={() =>
                    openVipModal(
                      'Schedule Private VIP Tour',
                      'Arrange an escorted on-site walkthrough with a licensed Jamoka Properties broker.',
                      'Schedule Viewing CTA'
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/15 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#CF9F5D]" />
                  <span>Schedule Viewing</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Villa Visual (Now placed underneath Video & Perspective) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="relative w-full flex items-center justify-center overflow-hidden">
              <img
                src={PARKWAYS_TWILIGHT_VILLA_IMAGE}
                alt="Twilight Luxury Villa and Pool - The Parkways Dubai Hills Estate"
                className="w-full h-auto max-h-[520px] sm:max-h-[580px] object-contain sm:object-cover object-center"
              />

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#0A0A0A] to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#101010] to-transparent" />
                <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-[#0A0A0A]/70 to-transparent" />
                <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-[#0A0A0A]/70 to-transparent" />
              </div>

              {/* Badges on the image */}
              <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white shadow-lg">
                  <Sparkles className="w-3 h-3 text-[#CF9F5D]" />
                  Resort Lap Pool &bull; Private Grounds
                </span>
              </div>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  onClick={() => openModalAt(0)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white transition-all cursor-pointer shadow-lg"
                >
                  <Maximize2 className="w-3 h-3 text-[#CF9F5D]" />
                  <span>Enlarge Facade</span>
                </button>
              </div>

              {/* Bottom Caption Bar */}
              <div className="absolute bottom-3 inset-x-4 sm:inset-x-6 z-10 flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/15">
                <div className="flex items-center gap-2 text-xs text-white/90">
                  <MapPin className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  <span className="font-semibold text-white">The Parkways, Dubai Hills Estate</span>
                  <span className="text-white/40">&bull;</span>
                  <span className="text-[#F3D7A0] hidden sm:inline">11,241 sq. ft. Plot with Temperature-Controlled Pool</span>
                </div>
                <button
                  onClick={() => {
                    const galleryEl = document.getElementById('sliding-gallery');
                    galleryEl?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#CF9F5D]/20 hover:bg-[#CF9F5D]/30 border border-[#CF9F5D]/40 text-[#F3D7A0] text-xs font-bold transition-all cursor-pointer"
                >
                  <Images className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  <span>View All 50 Photos</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Essential Dimensions Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 mt-12 border-t border-white/10">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#CF9F5D] bg-[#CF9F5D]/10 px-3 py-0.5 rounded-full border border-[#CF9F5D]/20">
              Key Specifications
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              The Property at a Glance
            </h3>
            <p className="text-white/60 text-xs mt-1">
              Custom-built architectural proportions designed for multi-generational luxury living.
            </p>
          </div>

          {/* 4 Dimension cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div className="rounded-xl p-3.5 sm:p-4 bg-white/[0.035] border border-white/[0.09] text-center">
              <div className="w-7 h-7 mx-auto rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#F3D7A0] mb-1.5">
                <Layers className="w-3.5 h-3.5 text-[#CF9F5D]" />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white">11,241 sq. ft.</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#CF9F5D] mt-0.5">Generous Plot</div>
              <p className="text-[11px] text-white/50 mt-1">Private perimeter with resort swimming pool</p>
            </div>

            <div className="rounded-xl p-3.5 sm:p-4 bg-white/[0.035] border border-white/[0.09] text-center">
              <div className="w-7 h-7 mx-auto rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#F3D7A0] mb-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white">~10,000 sq. ft.</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#CF9F5D] mt-0.5">Approx. BUA</div>
              <p className="text-[11px] text-white/50 mt-1">Basement, ground, upper suites &amp; rooftop</p>
            </div>

            <div className="rounded-xl p-3.5 sm:p-4 bg-white/[0.035] border border-white/[0.09] text-center">
              <div className="w-7 h-7 mx-auto rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#F3D7A0] mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#CF9F5D]" />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white">The Parkways</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#CF9F5D] mt-0.5">Dubai Hills Estate</div>
              <p className="text-[11px] text-white/50 mt-1">Exclusive villa enclave steps from the golf club</p>
            </div>

            <div className="rounded-xl p-3.5 sm:p-4 bg-white/[0.035] border border-white/[0.09] text-center">
              <div className="w-7 h-7 mx-auto rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#F3D7A0] mb-1.5">
                <Award className="w-3.5 h-3.5 text-[#CF9F5D]" />
              </div>
              <div className="text-base sm:text-lg font-extrabold text-white">Custom-Built</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#CF9F5D] mt-0.5">Private Residence</div>
              <p className="text-[11px] text-white/50 mt-1">1-of-1 bespoke architecture &amp; finishes</p>
            </div>
          </div>

          {/* 6 Quick specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center">
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Bedrooms</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">6 Bedrooms</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center">
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Bathrooms</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">7 Baths</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center">
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Parking</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">2 Covered Bays</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center">
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Orientation</div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">Garden &amp; Pool</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center">
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Golf Proximity</div>
              <div className="text-xs sm:text-sm font-bold text-[#F3D7A0] mt-0.5">Walking Distance</div>
            </div>
            <div className="py-2 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center">
              <div className="text-[9px] text-white/50 uppercase tracking-wider">Downtown Dubai</div>
              <div className="text-xs sm:text-sm font-bold text-[#F3D7A0] mt-0.5">~15 Mins</div>
            </div>
          </div>

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
          SECTION 3: IMAGE GALLERY (50 Photos sourced from Drive)
         ========================================================================= */}
      <section id="sliding-gallery" className="py-12 md:py-16 bg-[#0D0D0D] border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#CF9F5D]">
                Visual Showcase
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
                Inside The Parkways Residence
              </h2>
              <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-xl">
                Explore high-resolution photography showcasing the architecture, finishes, private grounds, and interior salons.
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
                <span>See All {galleryImages.length} Images</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollSlider('left')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => scrollSlider('right')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            onScroll={updateScrollProgress}
            onMouseEnter={() => setIsSliderHovered(true)}
            onMouseLeave={() => setIsSliderHovered(false)}
            className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

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

            {/* End card */}
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
              <p className="text-[11px] text-white/60 mt-1 max-w-[170px] leading-snug">
                Browse full photography collection of the villa.
              </p>
              <span className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#CF9F5D] text-black text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                <span>Open Lightbox</span>
                <Maximize2 className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Scroller bar */}
          <div className="mt-3 flex items-center justify-between gap-3">
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
              >
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-[#CF9F5D] to-[#F3D7A0] rounded-full transition-all duration-300"
                  style={{
                    width: '32%',
                    left: `${Math.min(68, scrollProgress * 0.68)}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#CF9F5D] shrink-0 font-mono">
                {Math.round(scrollProgress)}%
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/50">
              <span>Drag or click track to explore all images</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FLOOR PLANS BREAKDOWN (HIGH-CONVERTING LEAD MAGNET)
         ========================================================================= */}
      <section className="py-14 md:py-20 bg-[#121212] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#CF9F5D]">
                Architectural Layout
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Multi-Level Floor Plan Overview
              </h2>
              <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-xl">
                Approximately 10,000 sq. ft. of articulated living space across 4 private levels.
              </p>
            </div>

            <button
              onClick={() =>
                openVipModal(
                  'Download Official Floor Plans (PDF)',
                  'Complete architectural layouts, room dimensions & technical specifications sheet.',
                  'Floor Plan Section Upsell'
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#CF9F5D] hover:bg-[#E3C38A] text-black text-xs font-extrabold uppercase tracking-wider transition-all shadow-md self-start md:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Architectural Plans (PDF)</span>
            </button>
          </div>

          {/* Interactive Floor Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1.5 rounded-xl bg-white/5 border border-white/10 max-w-xl">
            {floorPlanLevels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setActiveFloorTab(lvl.id as any)}
                className={`flex-1 min-w-[110px] py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                  activeFloorTab === lvl.id
                    ? 'bg-[#CF9F5D] text-black shadow-md font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {lvl.title}
              </button>
            ))}
          </div>

          {/* Active Level Card */}
          {(() => {
            const currentLevel = floorPlanLevels.find((l) => l.id === activeFloorTab) || floorPlanLevels[0];
            return (
              <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 mb-12 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/10 gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{currentLevel.title}</h3>
                    <span className="text-xs text-[#CF9F5D] font-medium">{currentLevel.subtitle}</span>
                  </div>
                  <span className="text-xs text-white/50">Direct Elevator Access to this level</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {currentLevel.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="mt-1 w-4 h-4 rounded-full bg-[#CF9F5D]/20 flex items-center justify-center text-[#CF9F5D] shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* 13 Bespoke Residence Features in minimal compact layout */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#CF9F5D]" />
                <span>13 Architectural Pillars of the Residence</span>
              </h3>
              <span className="text-[11px] text-[#CF9F5D] font-semibold uppercase tracking-wider">
                Custom Build Standard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {architecturalFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] hover:border-[#CF9F5D]/30 transition-all flex items-start gap-2.5"
                >
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-[#CF9F5D]/15 border border-[#CF9F5D]/30 flex items-center justify-center text-[#F3D7A0] shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white leading-tight">{feat.title}</div>
                    <div className="text-[11px] text-white/55 mt-0.5 leading-snug">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: 15 VERIFIED PROPERTY AMENITIES
         ========================================================================= */}
      <section className="py-14 md:py-18 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#CF9F5D]">
                Amenities &amp; Enclave Features
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                15 Verified Property Amenities
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CF9F5D]/10 border border-[#CF9F5D]/30 text-xs font-semibold text-[#F3D7A0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>100% Verified Specification</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {amenities.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#CF9F5D]/40 transition-colors"
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
          SECTION 6: STRATEGIC LOCATION ADVANTAGE
         ========================================================================= */}
      <section className="py-14 md:py-20 bg-[#121212] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#CF9F5D]">
              Strategic Location
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              The Address Is Part of the Appeal
            </h2>
            <p className="text-white/70 text-xs sm:text-sm mt-1.5 font-light">
              Dubai Hills Estate &bull; Known for lush parklands, championship golf, and frictionless connection to Dubai's financial and leisure epicenters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#F3D7A0] mb-3">
                  <Navigation className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">15 Minutes to Downtown Dubai</h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed font-light">
                  Direct connectivity to Al Khail Road and Umm Suqeim, placing Burj Khalifa, DIFC, and Dubai Mall within an effortless 15-minute commute.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#CF9F5D] font-semibold">
                Downtown Dubai &bull; ~15 Mins
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#F3D7A0] mb-3">
                  <Trees className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">Championship Golf Course</h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed font-light">
                  Moments from Dubai Hills Golf Club, 18-hole championship greens, the clubhouse dining terrace, and central running &amp; cycling parks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#CF9F5D] font-semibold">
                Dubai Hills Golf Club &bull; Walking Distance
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#CF9F5D]/15 flex items-center justify-center text-[#F3D7A0] mb-3">
                  <HeartHandshake className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-bold text-white">World-Class Healthcare &amp; Schools</h3>
                <p className="text-xs text-white/70 mt-2 leading-relaxed font-light">
                  Home to King's College Hospital London – Dubai and top-tier international academies (GEMS Wellington, Dubai Heights Academy).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#CF9F5D] font-semibold">
                Inside the Estate Enclave
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: BUILDING SPECIFICATIONS & RERA VERIFIED TABLE
         ========================================================================= */}
      <section className="py-14 md:py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#CF9F5D]">
              Verified Technical Data
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Building &amp; Property Specifications
            </h2>
            <p className="text-white/60 text-xs sm:text-sm mt-1">
              Official records confirmed with Dubai Land Department &amp; RERA registration.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="divide-y divide-white/10 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold uppercase tracking-wider text-white/50">Building / Project</span>
                <span className="font-bold text-white sm:text-right mt-1 sm:mt-0">The Parkways, Dubai Hills Estate</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold uppercase tracking-wider text-white/50">Configuration</span>
                <span className="font-bold text-white sm:text-right mt-1 sm:mt-0">Multi-Level: Basement + Ground + First + Rooftop</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold uppercase tracking-wider text-white/50">Plot Area</span>
                <span className="font-bold text-[#F3D7A0] sm:text-right mt-1 sm:mt-0">11,241 sq. ft.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold uppercase tracking-wider text-white/50">Built-Up Area (BUA)</span>
                <span className="font-bold text-[#F3D7A0] sm:text-right mt-1 sm:mt-0">Approx. 10,000 sq. ft.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  Square Footage Source
                </span>
                <span className="font-semibold text-white sm:text-right mt-1 sm:mt-0">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold uppercase tracking-wider text-white/50">Parking &amp; Garaging</span>
                <span className="font-bold text-white sm:text-right mt-1 sm:mt-0">2 Dedicated Covered Vehicular Spaces</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-3.5 sm:p-4 hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold uppercase tracking-wider text-white/50">Occupancy Status</span>
                <span className="font-bold text-[#25D366] sm:text-right mt-1 sm:mt-0">Vacant on Transfer &bull; Ready to Occupy</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 p-3.5 sm:p-4 bg-[#CF9F5D]/10">
                <span className="font-semibold uppercase tracking-wider text-[#CF9F5D] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  RERA Permit
                </span>
                <span className="font-mono font-bold text-white sm:text-right mt-1 sm:mt-0">PERMIT-DXB-000007</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FINAL INQUIRY & VIP VIEWING FORM
         ========================================================================= */}
      <section id="inquire" className="py-16 md:py-24 bg-[#121212] border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#CF9F5D]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CF9F5D]/20 text-[#F3D7A0] text-xs font-semibold uppercase tracking-wider border border-[#CF9F5D]/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Schedule a Private Showing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Inquire for Pricing &amp; Viewing
              </h2>
              <p className="text-white/70 text-xs sm:text-sm mt-2 leading-relaxed font-light">
                Submit your contact details to connect directly with Jamoka Properties senior secondary advisors.
              </p>
            </div>

            {bottomFormSubmitted ? (
              <div className="p-8 rounded-2xl bg-white/[0.05] border border-[#CF9F5D]/40 text-center animate-fade-in">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#CF9F5D]/20 flex items-center justify-center text-[#F3D7A0]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Thank You for Reaching Out</h3>
                <p className="text-sm text-white/70 mt-2 max-w-md mx-auto">
                  Your inquiry has been received and logged. Our senior advisor will contact you at <strong className="text-white">{bottomForm.phone}</strong> shortly.
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
                      setBottomFormSubmitted(false);
                      setBottomForm({
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
              <form onSubmit={handleBottomFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Wright"
                      value={bottomForm.fullName}
                      onChange={(e) => setBottomForm({ ...bottomForm, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 000 0000"
                      value={bottomForm.phone}
                      onChange={(e) => setBottomForm({ ...bottomForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="alexander@example.com"
                    value={bottomForm.email}
                    onChange={(e) => setBottomForm({ ...bottomForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                    Questions / Viewing Preference
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Request pricing, floor plans, title deed or book an exclusive private showing..."
                    value={bottomForm.message}
                    onChange={(e) => setBottomForm({ ...bottomForm, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Lock className="w-3.5 h-3.5 text-[#CF9F5D]" />
                    <span>Confidential direct broker representation.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={bottomSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#CF9F5D] to-[#E3C38A] text-black font-extrabold text-sm uppercase tracking-wider hover:scale-102 hover:shadow-lg hover:shadow-[#CF9F5D]/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {bottomSubmitting ? (
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

      {/* =========================================================================
          FOOTER
         ========================================================================= */}
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
          HIGH-CONVERTING UPSELL POPUP MODAL (VIP INQUIRY MODAL)
         ========================================================================= */}
      {vipModalOpen && (
        <div
          onClick={() => setVipModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-[#141414] border border-[#CF9F5D]/40 p-6 sm:p-8 text-white shadow-2xl overflow-hidden animate-scale-in"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#CF9F5D]/25 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setVipModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {vipSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#CF9F5D]/20 flex items-center justify-center text-[#F3D7A0]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Your Request Has Been Received</h3>
                <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{vipForm.fullName}</strong>. An advisor is preparing your verified documents and will connect via <strong className="text-white">{vipForm.phone}</strong> shortly.
                </p>
                <div className="pt-3 flex flex-col gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Get Instant Pricing on WhatsApp Now</span>
                  </a>
                  <button
                    onClick={() => setVipModalOpen(false)}
                    className="text-xs text-white/60 hover:text-white transition-colors py-1 cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#CF9F5D]/20 text-[#F3D7A0] text-[10px] font-bold uppercase tracking-wider border border-[#CF9F5D]/40">
                    <Sparkles className="w-3 h-3 text-[#CF9F5D]" />
                    Private Client Privilege
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    100% Confidential
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {vipModalTitle}
                </h3>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  {vipModalSubtitle}
                </p>

                {/* Property highlight preview pill */}
                <div className="my-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <img
                    src={PARKWAYS_TWILIGHT_VILLA_IMAGE}
                    alt="The Parkways Villa"
                    className="w-14 h-12 rounded-lg object-cover border border-white/15 shrink-0"
                  />
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-bold text-white truncate">The Parkways Custom 6-Bed Villa</div>
                    <div className="text-[10px] text-[#CF9F5D] font-medium">11,241 sq. ft. Plot &bull; Dubai Hills Estate</div>
                    <div className="text-[10px] text-white/50">Vacant on Transfer &bull; Ready to Move In</div>
                  </div>
                </div>

                <form onSubmit={handleVipFormSubmit} className="space-y-3">

                  <div>
                    <label className="block text-[11px] font-semibold text-white/70 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Wright"
                      value={vipForm.fullName}
                      onChange={(e) => setVipForm({ ...vipForm, fullName: e.target.value })}
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
                      value={vipForm.phone}
                      onChange={(e) => setVipForm({ ...vipForm, phone: e.target.value })}
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
                      value={vipForm.email}
                      onChange={(e) => setVipForm({ ...vipForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-[#CF9F5D] transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={vipSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#CF9F5D] to-[#E3C38A] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:opacity-95 hover:scale-[1.01] transition-all cursor-pointer shadow-lg shadow-[#CF9F5D]/25 disabled:opacity-50"
                    >
                      {vipSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Instant Access...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Get Instant Access to Dossier</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] text-white/50">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#CF9F5D]" />
                      Direct to Jamoka Properties
                    </span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:underline font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3 fill-[#25D366]" />
                      WhatsApp Shortcut
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          STICKY BOTTOM FLOATING UPSELL BAR (Optimized for Mobile Meta Ads)
         ========================================================================= */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-2 sm:p-3 pointer-events-none animate-slide-up">
          <div className="max-w-5xl mx-auto rounded-2xl bg-[#121212]/95 border border-[#CF9F5D]/40 backdrop-blur-xl p-2.5 sm:p-3 px-3 sm:px-5 shadow-2xl flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={PARKWAYS_TWILIGHT_VILLA_IMAGE}
                alt="The Parkways Villa"
                className="w-10 h-10 rounded-lg object-cover border border-white/15 hidden sm:block shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-white truncate">The Parkways Custom 6-Bed Villa</span>
                  <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                    Vacant
                  </span>
                </div>
                <div className="text-[11px] text-[#CF9F5D] truncate">
                  11,241 sq. ft. Plot &bull; ~10,000 sq. ft. BUA &bull; Dubai Hills Estate
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  openVipModal(
                    'Request Price Guide & Floor Plans',
                    'Direct inquiry for The Parkways Custom 6-Bedroom Villa.',
                    'Sticky Bar Inquire Button'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#CF9F5D] to-[#E3C38A] text-black text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-102"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Get Price</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              <a
                href={`tel:${PHONE_INTL}`}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:inline-flex"
                title="Direct Hotline"
              >
                <Phone className="w-3.5 h-3.5 text-[#CF9F5D]" />
              </a>
            </div>
          </div>
        </div>
      )}

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
            <button
              onClick={prevModalImage}
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all hover:scale-105 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

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
