import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import {
  Sparkles,
  TrendingUp,
  Map,
  Heart,
  Share2,
  UserPlus,
  Loader2,
  CheckCircle2,
  Send,
  X,
  Mail,
  ArrowRight,
  Globe,
  DollarSign
} from "lucide-react";

export default function About() {
  const [subject, setSubject] = useState("Just saying hi");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("10");
  const [customAmount, setCustomAmount] = useState("");
  const [isCustomDonation, setIsCustomDonation] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const [shareToast, setShareToast] = useState(false);
  
  const contactFormRef = useRef(null);

  // Pre-fill subject and smooth scroll to form
  const handleConnectClick = () => {
    setSubject("Introduce a venue/artist");
    contactFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "LocalScene.ca",
          text: "Centralizing the Canadian music and art scene! Stop hunting, start creating.",
          url: window.location.origin,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 3000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);

    // Retrieve Web3Forms access key from environment or fallback placeholder
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";

    if (accessKey === "YOUR_ACCESS_KEY_HERE") {
      setIsSubmitting(false);
      alert("Web3Forms Access Key is not configured yet!\n\nTo receive real emails:\n1. Go to web3forms.com (it's 100% free and takes 5 seconds).\n2. Register your email to get your Access Key.\n3. Create a '.env' file in the 'localscene' root directory and add:\n   VITE_WEB3FORMS_ACCESS_KEY=your-key-here\n\nOr paste it directly in src/pages/About.jsx on line 71!");
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New LocalScene Contact Message - [${subject}]`,
          from_name: "LocalScene.ca Portal",
          selected_subject: subject,
          message: message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setMessage("");
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        console.error("Web3Forms Submission Error:", data);
        alert("Failed to send message: " + (data.message || "Error submitting form."));
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    setIsDonating(true);
    setTimeout(() => {
      setIsDonating(false);
      setDonationSuccess(true);
      setTimeout(() => {
        setDonationSuccess(false);
        setDonationModalOpen(false);
        setIsCustomDonation(false);
        setDonationAmount("10");
        setCustomAmount("");
      }, 2500);
    }, 1200);
  };

  // Close modals on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDonationModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0914] text-white relative overflow-hidden pb-12" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <Header />

      {/* Decorative Glow Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#ff37d7]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[35%] right-1/4 w-[600px] h-[600px] bg-[#4e148c]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-1/3 w-[400px] h-[400px] bg-[#e21313]/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ff37d7] animate-ping" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-300">ABOUT LOCALSCENE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter leading-none">
            Stop hunting.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff37d7] via-[#e21313] to-[#4e148c]">
              Start creating.
            </span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Centralizing the Canadian music and art scene so you don't have to spend hours digging through dead-end social media pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-20 max-w-6xl mx-auto items-stretch">
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col justify-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff37d7]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="text-[10px] font-bold text-[#ff37d7] tracking-widest uppercase mb-4">THE REALITY</span>
            <p className="text-xl sm:text-2xl font-light leading-relaxed text-gray-200">
              "Let’s be real: trying to find a venue, meeting reliable collaborators, or even just getting noticed in Canada can feel like a <span className="text-[#ff37d7] font-medium">full-time job</span> before you even pick up your instrument or brush."
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col justify-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e21313]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="text-[10px] font-bold text-[#e21313] tracking-widest uppercase mb-4">OUR MISSION</span>
            <p className="text-lg leading-relaxed text-gray-400">
              <strong className="text-white font-semibold">LocalScene (LS)</strong> was built to cut through that noise. We’re centralizing the Canadian scene so you don't have to spend hours digging. We’re here to be the home base for our country’s artists and venues—a single spot to find your people, book your gigs, and actually get seen.
            </p>
          </div>
        </div>
      </section>

      {/* Why We're Here Section */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">OUR FOUNDATIONS</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why We’re <span className="text-[#ff37d7]">Here</span></h2>
          <p className="text-gray-400 text-sm">Building real tools to shift the default paradigm for Canadian talent.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Giving you a head start",
              desc: "Starting out is intimidating. We want to be the 'green light' that encourages you to finally launch that project you’ve been sitting on.",
              icon: Sparkles,
              glowColor: "group-hover:border-[#ff37d7]/30",
              iconBg: "bg-[#ff37d7]/10 text-[#ff37d7]",
              accentLine: "bg-[#ff37d7]"
            },
            {
              title: "Making a living, not just a hobby",
              desc: "We believe 'starving artist' shouldn't be the default. We’re building tools to help you find more paid work and real-world opportunities.",
              icon: TrendingUp,
              glowColor: "group-hover:border-[#00ce7f]/30",
              iconBg: "bg-[#00ce7f]/10 text-[#00ce7f]",
              accentLine: "bg-[#00ce7f]"
            },
            {
              title: "One map for everyone",
              desc: "No more fragmented searches. Whether you're in a big city or a small town, we’re putting every Canadian province on the same digital stage.",
              icon: Map,
              glowColor: "group-hover:border-[#e21313]/30",
              iconBg: "bg-[#e21313]/10 text-[#e21313]",
              accentLine: "bg-[#e21313]"
            }
          ].map((card, idx) => (
            <div
              key={idx}
              className={`group relative p-8 bg-white/[0.02] rounded-[2rem] border border-white/5 ${card.glowColor} transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between overflow-hidden`}
              style={{ backdropFilter: "blur(8px)" }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                <div className={`w-full h-full ${card.accentLine}`} />
              </div>

              <div>
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6`}>
                  <card.icon className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#ff37d7] transition-colors">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Show Some Love Section */}
      <section className="relative py-24 bg-white/[0.01] border-y border-white/5 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">SUPPORT THE ENGINE</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Show Some <span className="text-[#ff37d7]">Love</span></h2>
            <p className="text-gray-400 text-sm">We're built on connection. Help us keep LocalScene thriving, reliable, and free for all.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Fuel the engine */}
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-[#ff37d7]/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-[#ff37d7] flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-xl font-bold text-white">Fuel the engine</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  If you find value in what we’re building, a small donation goes a long way in keeping the servers running and the maps active.
                </p>
              </div>
              <button 
                onClick={() => setDonationModalOpen(true)}
                className="mt-8 w-full py-3.5 px-5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-[#ff37d7] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
              >
                Support LocalScene
              </button>
            </div>

            {/* Spread the word */}
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-[#00ce7f]/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 text-[#00ce7f] flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Spread the word</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  The more people use LS, the better it works for everyone. Share the home base with your creative circle or local scene.
                </p>
              </div>
              <button 
                onClick={handleShareClick}
                className="mt-8 w-full py-3.5 px-5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-[#00ce7f] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
              >
                Share the Scene
              </button>
            </div>

            {/* Connect us */}
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-[#e21313]/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#e21313] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">Connect us</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Know a killer venue or an artist that everyone needs to hear? Let us know, introduce us, and we will get them on the map.
                </p>
              </div>
              <button 
                onClick={handleConnectClick}
                className="mt-8 w-full py-3.5 px-5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-[#e21313] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
              >
                Make an Intro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={contactFormRef} className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto items-center">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-2 space-y-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">LET'S CHAT</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Say Hello</h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Got a suggestion? Found a bug? Just want to vent about the Canadian music industry? Drop us a line below—<strong className="text-white font-medium">we actually read these.</strong>
            </p>
            
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-[#ff37d7]" />
                <span>info@localscene.ca</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Globe className="w-4 h-4 text-[#e21313]" />
                <span>Across Canada • Coast to Coast</span>
              </div>
            </div>

            {/* Canada CSS-based Decorative Badge */}
            <div className="relative h-20 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff37d7]/10 via-[#e21313]/10 to-transparent flex items-center px-6 border border-white/5">
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase tracking-wider">100% Canadian Owned & Operated</p>
                <p className="text-[10px] text-gray-400">Supporting creators from Vancouver to St. John's</p>
              </div>
              <div className="absolute right-6 opacity-20 text-3xl font-bold select-none text-white pointer-events-none">
                🍁
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-3">
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden" style={{ backdropFilter: "blur(12px)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff37d7]/5 rounded-full blur-2xl pointer-events-none" />

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Subject Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-xs font-bold text-gray-300 tracking-wider uppercase block">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#130d1d] border border-white/10 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#ff37d7]/50 focus:ring-1 focus:ring-[#ff37d7]/50 text-sm text-white transition-all cursor-pointer"
                  >
                    <option value="Just saying hi" className="bg-[#0e0914] text-white">Just saying hi</option>
                    <option value="I'm an artist" className="bg-[#0e0914] text-white">I'm an artist</option>
                    <option value="I run a venue" className="bg-[#0e0914] text-white">I run a venue</option>
                    <option value="Introduce a venue/artist" className="bg-[#0e0914] text-white">Introduce a venue/artist</option>
                    <option value="Found a bug" className="bg-[#0e0914] text-white">Found a bug</option>
                  </select>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="message" className="text-xs font-bold text-gray-300 tracking-wider uppercase block">
                      What’s on your mind?
                    </label>
                    <span className={`text-[10px] font-bold ${message.length >= 500 ? 'text-[#e21313]' : 'text-gray-500'}`}>
                      {message.length} / 500
                    </span>
                  </div>
                  <textarea
                    id="message"
                    required
                    maxLength={500}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you're thinking, how we can help, or give us your suggestions..."
                    rows={5}
                    className="w-full bg-[#130d1d] border border-white/10 rounded-xl py-3.5 px-4 focus:outline-none focus:border-[#ff37d7]/50 focus:ring-1 focus:ring-[#ff37d7]/50 text-sm text-white transition-all placeholder:text-gray-600 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 text-white shadow-lg ${
                    !message.trim() 
                      ? "bg-white/5 border border-white/5 cursor-not-allowed opacity-50" 
                      : "bg-[#ff37d7] hover:bg-[#ff37d7]/90 hover:shadow-[0_0_30px_rgba(255,55,215,0.4)] active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Submit Success Message */}
                {submitSuccess && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400 flex items-center gap-3 animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <strong className="font-bold block text-white mb-0.5">Message Sent!</strong>
                      Thanks for reaching out! We read every single message and will get back to you soon.
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Simplified Footer */}
      <footer className="mt-20 pt-12 pb-6 border-t border-white/5 text-center px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-xs">
          <p>© 2026 LocalScene.ca. Built to support Canadian arts & venues.</p>
          <div className="flex gap-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/artists" className="hover:text-white transition-colors">Artists</a>
            <a href="/venues" className="hover:text-white transition-colors">Venues</a>
            <a href="/gigs" className="hover:text-white transition-colors">Gigs</a>
          </div>
        </div>
      </footer>

      {/* Donation Modal (Fuel the engine) */}
      {donationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-md rounded-[2.5rem] bg-[#110b1a] border border-white/10 p-8 sm:p-10 relative overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setDonationModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing spot */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#ff37d7]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-[#ff37d7] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 fill-current text-[#ff37d7]" />
              </div>
              <h3 className="text-2xl font-bold text-white">Fuel the Engine</h3>
              <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">
                LocalScene is fully independent. Your contributions go directly towards maintaining our platform and promoting local Canadian talents.
              </p>
            </div>

            {donationSuccess ? (
              <div className="py-8 text-center space-y-4 animate-scaleIn">
                <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-400 mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">Thank you so much! 💖</h4>
                <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
                  Your generous contribution of <strong className="text-white">${isCustomDonation ? customAmount : donationAmount}</strong> keeps our map active and servers running. We appreciate you!
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonationSubmit} className="space-y-6">
                
                {/* Predefined Amounts */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block text-left">
                    Select Contribution Amount
                  </span>
                  <div className="grid grid-cols-4 gap-3">
                    {["5", "10", "25", "50"].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setIsCustomDonation(false);
                          setDonationAmount(amt);
                        }}
                        className={`py-3.5 rounded-xl font-bold text-xs transition-all border ${
                          !isCustomDonation && donationAmount === amt
                            ? "bg-[#ff37d7] border-transparent text-white"
                            : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Selection */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setIsCustomDonation(true)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all border text-center ${
                      isCustomDonation
                        ? "bg-[#ff37d7] border-transparent text-white"
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    Custom Amount
                  </button>

                  {isCustomDonation && (
                    <div className="relative mt-2 animate-slideDown">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-[#130d1d] border border-white/10 rounded-xl py-3.5 pl-10 pr-4 focus:outline-none focus:border-[#ff37d7]/50 focus:ring-1 focus:ring-[#ff37d7]/50 text-sm text-white transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Contribution */}
                <button
                  type="submit"
                  disabled={isDonating || (isCustomDonation && !customAmount)}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 text-white shadow-lg ${
                    isCustomDonation && !customAmount
                      ? "bg-white/5 border border-white/5 cursor-not-allowed opacity-50"
                      : "bg-[#ff37d7] hover:bg-[#ff37d7]/90 hover:shadow-[0_0_30px_rgba(255,55,215,0.4)] active:scale-[0.98]"
                  }`}
                >
                  {isDonating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Contribute $${isCustomDonation ? customAmount || "0" : donationAmount}`
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Share Success Toast */}
      {shareToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#00ce7f]/10 border border-[#00ce7f]/20 text-xs text-[#00ce7f] flex items-center gap-3 animate-slideUp shadow-2xl">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong className="font-bold block text-white mb-0.5">Link Copied!</strong>
            LocalScene url has been copied to your clipboard. 🚀
          </div>
        </div>
      )}
    </div>
  );
}