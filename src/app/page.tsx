"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Custom hook for intersection observer
function useIntersectionObserver(options = {}): [React.RefObject<HTMLDivElement | null>, boolean] {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once animation is triggered, we can disconnect the observer
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
}

function WaitlistForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });

  const features = [
    "Write Day-Wise Travel Logs",
    "Join Travel Tribes That Match You", 
    "Track Distance & Earth Rotations",
    "Explore Stories on a Map",
    "Follow the Footsteps of Real Travelers",
    "Save Travel Milestones",
    "Access Your Stories Offline",
  ];

  const handleEmailSubmit = () => {
    if (email) {
      setStep(2);
      
      // Save email in background without blocking UI
      fetch('/api/waitlist/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }).catch(error => {
        // Silently log errors for background submission
        console.error('Background email submission error:', error);
      });
    }
  };

  const handleFeaturesSubmit = () => {
    setStep(3);
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage({ type: null, text: '' }); // Clear any previous messages
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          selectedFeatures,
          comments
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage({ 
          type: 'success', 
          text: "🎉 Thank you for joining the waitlist! We'll be in touch soon." 
        });
        // Reset form after a delay to show success message
        setTimeout(() => {
          setEmail("");
          setSelectedFeatures([]);
          setComments("");
          setStep(1);
          setSubmitMessage({ type: null, text: '' });
        }, 3000);
      } else {
        setSubmitMessage({ 
          type: 'error', 
          text: `Error: ${result.message}` 
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: 'Something went wrong. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-16 lg:py-24" style={{ backgroundColor: '#F6F6F6' }}>
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-primary mb-6 lg:mb-8 tracking-tight">
            Join the Waitlist
          </h2>
          <p className="text-xl lg:text-2xl text-subtle font-medium max-w-2xl mx-auto leading-relaxed">
            Be among the first to experience travel as identity, story, and connection
          </p>
        </div>

        {/* Form Container */}
        <div className="relative">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden">
            <div className="relative p-6 sm:p-8 lg:p-12">
            
              {/* Step 1: Email */}
              <div className={`transition-all duration-500 ${
                step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 translate-x-full pointer-events-none'
              }`}>
                <div className="text-center space-y-8 py-8 lg:py-12">
                  <div className="space-y-4">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">
                      Let&apos;s start with your email
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl text-subtle font-medium max-w-md mx-auto">
                      We&apos;ll send you early access when Footsteps is ready
                    </p>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }} className="max-w-sm mx-auto space-y-6">
                    <div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-6 py-4 lg:py-5 rounded-xl text-primary placeholder-subtle focus:outline-none focus:ring-2 focus:ring-brand/50 border border-gray-200 text-base lg:text-lg text-center bg-white shadow-sm focus:shadow-md transition-all duration-200"
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full bg-brand text-white py-4 lg:py-5 rounded-xl font-bold text-lg lg:text-xl hover:bg-brand/90 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      Continue →
                    </button>
                  </form>
                </div>
              </div>

              {/* Step 2: Features */}
              <div className={`transition-all duration-500 ${
                step === 2 ? 'opacity-100 translate-x-0' : step < 2 ? 'opacity-0 absolute inset-0 translate-x-full pointer-events-none' : 'opacity-0 absolute inset-0 -translate-x-full pointer-events-none'
              }`}>
                <div className="space-y-8 py-6 lg:py-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">
                      What matters most to your journey?
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-subtle font-medium max-w-2xl mx-auto">
                      Select the features that excite you. Your choices help shape the future of Footsteps.
                    </p>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto px-2 -mx-2">
                    <div className="grid gap-3 sm:gap-4">
                      {features.map((feature) => (
                        <div 
                          key={feature} 
                          className={`flex items-center p-4 lg:p-5 rounded-xl cursor-pointer transition-all border-2 ${
                            selectedFeatures.includes(feature)
                              ? 'bg-brand/5 border-brand text-primary shadow-md'
                              : 'bg-white border-gray-200 hover:border-brand/40 hover:bg-brand/5 text-primary'
                          }`}
                          onClick={() => handleFeatureToggle(feature)}
                        >
                          <div className={`w-5 h-5 rounded border-2 mr-4 flex items-center justify-center transition-all ${
                            selectedFeatures.includes(feature)
                              ? 'bg-brand border-brand'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {selectedFeatures.includes(feature) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="font-semibold text-base lg:text-lg">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center pt-4 border-t border-gray-200">
                    <button 
                      onClick={handleFeaturesSubmit}
                      className="w-full sm:w-auto bg-brand text-white px-12 py-4 lg:py-5 rounded-xl font-bold text-lg lg:text-xl hover:bg-brand/90 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Comments */}
              <div className={`transition-all duration-500 ${
                step === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 translate-x-full pointer-events-none'
              }`}>
                <div className="space-y-8 py-8 lg:py-12">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">
                      Any ideas or feedback?
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl text-subtle font-medium">
                      Help us build the perfect travel companion (optional)
                    </p>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleFinalSubmit(); }} className="max-w-2xl mx-auto space-y-6">
                    <div>
                      <textarea 
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={6}
                        placeholder="Share your travel ideas or what excites you about Footsteps..."
                        className="w-full px-6 py-4 lg:py-5 rounded-xl text-primary placeholder-subtle focus:outline-none focus:ring-2 focus:ring-brand/50 border border-gray-200 text-base lg:text-lg resize-none bg-white shadow-sm focus:shadow-md transition-all duration-200"
                      />
                    </div>
                    
                    <div className="text-center space-y-4">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto px-12 lg:px-16 py-4 lg:py-5 rounded-xl font-bold text-lg lg:text-xl transition-all shadow-lg ${
                          isSubmitting 
                            ? 'bg-gray-400 cursor-not-allowed text-white' 
                            : 'bg-brand text-white hover:bg-brand/90 transform hover:scale-[1.02] hover:shadow-xl'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Joining...
                          </div>
                        ) : (
                          '🚀 Join Waitlist'
                        )}
                      </button>
                      
                      {/* Success/Error Message */}
                      {submitMessage.type && (
                        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          submitMessage.type === 'success' 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <p className="font-semibold text-base lg:text-lg">{submitMessage.text}</p>
                        </div>
                      )}
                      
                      <p className="text-subtle text-base lg:text-lg font-medium">
                        🎉 Over 150+ travelers already joined!
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TopBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const topbarHeight = 64; // 16 * 4 = 64px (h-16)
      const elementPosition = element.offsetTop - topbarHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border/50" style={{ backgroundColor: 'rgba(246, 246, 246, 0.95)' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                <Image 
                  src="/mainIcon.png"
                  alt="Footsteps Icon"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover"
                />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">
                Footsteps
              </h1>
            </div>
          </div>

          {/* Desktop Navigation - moved to right side */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-primary hover:text-brand transition-colors duration-200 font-medium">
              Features
            </button>
            <button onClick={() => scrollToSection('waitlist')} className="text-primary hover:text-brand transition-colors duration-200 font-medium">
              Waitlist
            </button>
            {/* CTA Button */}
            <button onClick={() => scrollToSection('waitlist')} className="bg-brand/80 hover:bg-brand text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
              Join Waitlist
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary hover:text-brand p-2 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border/50" style={{ backgroundColor: '#F6F6F6' }}>
              <button 
                onClick={() => {
                  scrollToSection('features');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-primary hover:text-brand transition-colors duration-200 font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  scrollToSection('waitlist');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-primary hover:text-brand transition-colors duration-200 font-medium"
              >
                Waitlist
              </button>
              <div className="pt-2">
                <button 
                  onClick={() => {
                    scrollToSection('waitlist');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full bg-brand/80 hover:bg-brand text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 text-center mx-3"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function Home() {
  const [headerRef, headerInView] = useIntersectionObserver({ threshold: 0.3 });
  const [cardsRef, cardsInView] = useIntersectionObserver({ threshold: 0.2 });
  const [phoneAnimated, setPhoneAnimated] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const topbarHeight = 64; // 16 * 4 = 64px (h-16)
      const elementPosition = element.offsetTop - topbarHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Trigger phone animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhoneAnimated(true);
    }, 300); // Slight delay for better UX
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#F6F6F6' }}>
      {/* Topbar */}
      <TopBar />

      {/* Hero Section */}
      <section className="relative px-6 py-12 lg:px-8 lg:py-20 overflow-hidden">
        {/* Background Video - COMMENTED OUT */}
        {/*
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/TravelImage.png"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 1 }}
          >
            <source src="/TravelVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" style={{ zIndex: 2 }}></div>
        </div>
        */}
        
        {/* Content overlay */}
        <div className="relative mx-auto max-w-7xl" style={{ zIndex: 10 }}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black text-primary mb-6 lg:mb-8 leading-tight tracking-tight">
                Turn your journeys into stories, your stories into tribes, and your path into a travel identity.
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => scrollToSection('waitlist')} className="bg-brand/90 text-white hover:bg-brand px-8 lg:px-10 py-4 lg:py-5 rounded-full text-lg lg:text-xl font-bold transition-all transform hover:scale-105 shadow-xl backdrop-blur-sm border border-white/10">
                  Join the Waitlist
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative" style={{ zIndex: 10 }}>
                {/* Mobile Screen Image */}
                <Image 
                  src="/mobileScreen.jpeg"
                  alt="Footsteps Mobile App Screen"
                  width={368}
                  height={736}
                  className={`w-84 lg:w-96 h-auto rounded-[3rem] transition-all duration-1000 ease-out ${
                    phoneAnimated ? 'opacity-100 animate-[phoneEntrance_1.2s_ease-out_forwards]' : 'opacity-0'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Footsteps Section */}
      <section id="features" className="py-12 lg:py-20" style={{ backgroundColor: '#F6F6F6' }}>
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div ref={headerRef} className="text-center mb-12 lg:mb-16">
            <h2 className={`text-3xl lg:text-4xl xl:text-5xl font-black text-primary mb-4 lg:mb-6 tracking-tight transition-all duration-800 ${
              headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            } ${headerInView ? 'animate-[slideInUp_0.8s_ease-out_0.2s_forwards]' : ''}`}>
              Why Footsteps?
            </h2>
            <p className={`text-md lg:text-xl text-subtle max-w-4xl mx-auto leading-relaxed font-medium transition-all duration-800 delay-200 ${
              headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            } ${headerInView ? 'animate-[slideInUp_0.8s_ease-out_0.4s_forwards]' : ''}`}>
              Because travel is more than just movement—  it&apos;s identity, story, and community!
            </p>
          </div>

          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Your Travel Identity */}
            <div className={`text-center p-6 lg:p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden ${
              cardsInView ? 'opacity-100 translate-y-0 animate-[slideInUp_0.8s_ease-out_0.1s_forwards]' : 'opacity-0 translate-y-8'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-md ${
                  cardsInView ? 'opacity-100 animate-[iconBounce_0.6s_ease-out_0.5s_forwards]' : 'opacity-0'
                }`}>
                  <svg className="w-7 h-7 lg:w-8 lg:h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2 lg:mb-3 tracking-tight">Your Travel Identity</h3>
                <p className="text-sm lg:text-base text-subtle leading-relaxed font-medium">
                  Build a profile that reflects who you are through where you&apos;ve been. Log distances, places, and soul-earned stats like Earth rotations.
                </p>
              </div>
            </div>

            {/* Footsteps Map */}
            <div className={`text-center p-6 lg:p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden ${
              cardsInView ? 'opacity-100 translate-y-0 animate-[slideInUp_0.8s_ease-out_0.3s_forwards]' : 'opacity-0 translate-y-8'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-md ${
                  cardsInView ? 'opacity-100 animate-[iconBounce_0.6s_ease-out_0.7s_forwards]' : 'opacity-0'
                }`}>
                  <svg className="w-7 h-7 lg:w-8 lg:h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2 lg:mb-3 tracking-tight">Footsteps Map</h3>
                <p className="text-sm lg:text-base text-subtle leading-relaxed font-medium">
                  Relive stories across the map—your own, and those who walked paths before you.
                </p>
              </div>
            </div>

            {/* Journey Stories */}
            <div className={`text-center p-6 lg:p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden ${
              cardsInView ? 'opacity-100 translate-y-0 animate-[slideInUp_0.8s_ease-out_0.5s_forwards]' : 'opacity-0 translate-y-8'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-md ${
                  cardsInView ? 'opacity-100 animate-[iconBounce_0.6s_ease-out_0.9s_forwards]' : 'opacity-0'
                }`}>
                  <svg className="w-7 h-7 lg:w-8 lg:h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2 lg:mb-3 tracking-tight">Journey Stories</h3>
                <p className="text-sm lg:text-base text-subtle leading-relaxed font-medium">
                  Turn your trips into day-wise, story-driven travel logs—real journeys written by real people. 
                </p>
              </div>
            </div>

            {/* Tribe Circles */}
            <div className={`text-center p-6 lg:p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden ${
              cardsInView ? 'opacity-100 translate-y-0 animate-[slideInUp_0.8s_ease-out_0.7s_forwards]' : 'opacity-0 translate-y-8'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-md ${
                  cardsInView ? 'opacity-100 animate-[iconBounce_0.6s_ease-out_1.1s_forwards]' : 'opacity-0'
                }`}>
                  <svg className="w-7 h-7 lg:w-8 lg:h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2 lg:mb-3 tracking-tight">Tribe Circles</h3>
                <p className="text-sm lg:text-base text-subtle leading-relaxed font-medium">
                 Find and follow your travel kind—slow walkers, mountain seekers, bikepackers, poetic nomads. Join by spirit, not by algorithm.
                </p>
              </div>
            </div>

            {/* Lived Journeys */}
            <div className={`text-center p-6 lg:p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden ${
              cardsInView ? 'opacity-100 translate-y-0 animate-[slideInUp_0.8s_ease-out_0.9s_forwards]' : 'opacity-0 translate-y-8'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-md ${
                  cardsInView ? 'opacity-100 animate-[iconBounce_0.6s_ease-out_1.3s_forwards]' : 'opacity-0'
                }`}>
                  <svg className="w-7 h-7 lg:w-8 lg:h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2 lg:mb-3 tracking-tight">Lived Journeys</h3>
                <p className="text-sm lg:text-base text-subtle leading-relaxed font-medium">
                  Explore powerful travel stories, curated for depth—not dopamine. Real experiences, slow and intentional.
                </p>
              </div>
            </div>

            {/* Real Connections */}
            <div className={`text-center p-6 lg:p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden ${
              cardsInView ? 'opacity-100 translate-y-0 animate-[slideInUp_0.8s_ease-out_1.1s_forwards]' : 'opacity-0 translate-y-8'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-md ${
                  cardsInView ? 'opacity-100 animate-[iconBounce_0.6s_ease-out_1.5s_forwards]' : 'opacity-0'
                }`}>
                  <svg className="w-7 h-7 lg:w-8 lg:h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-primary mb-2 lg:mb-3 tracking-tight">Real Connections</h3>
                <p className="text-sm lg:text-base text-subtle leading-relaxed font-medium">
                  Follow fellow travelers and explore their lived stories, not just their destinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <WaitlistForm />

      {/* Demo Section */}
      {/* <section id="demo" className="py-12 lg:py-20" style={{ backgroundColor: '#F6F6F6' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-primary mb-4 lg:mb-6 tracking-tight">
              See Footsteps in Action
            </h2>
            <p className="text-lg lg:text-xl text-subtle max-w-3xl mx-auto mb-6 lg:mb-8 font-medium">
              Watch how travelers are already using Footsteps to plan their perfect adventures.
            </p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-white/50 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-white/50 to-white/30 flex items-center justify-center">
                <button className="bg-white/95 backdrop-blur-sm p-5 lg:p-6 rounded-full hover:bg-white transition-all transform hover:scale-110 shadow-xl hover:shadow-2xl">
                  <svg className="w-10 h-10 lg:w-12 lg:h-12 text-brand" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <div className="p-6 lg:p-8 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl lg:text-2xl font-black text-primary mb-3 lg:mb-4 tracking-tight">Interactive Demo</h3>
                <p className="text-sm lg:text-base text-subtle font-medium">
                  Explore hidden gems, connect with fellow travelers, and plan your next adventure with our intuitive mobile app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t border-border py-8 lg:py-12" style={{ backgroundColor: '#F6F6F6' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl lg:text-2xl font-black text-primary mb-3 lg:mb-4 tracking-tight">Footsteps</h3>
            <div className="flex justify-center space-x-4 lg:space-x-6">
              <a href="#" className="text-sm lg:text-base text-subtle hover:text-brand transition-colors font-medium">Privacy</a>
              <a href="#" className="text-sm lg:text-base text-subtle hover:text-brand transition-colors font-medium">Terms</a>
              <a href="#" className="text-sm lg:text-base text-subtle hover:text-brand transition-colors font-medium">Contact</a>
            </div>
            <p className="text-subtle text-xs lg:text-sm mt-6 lg:mt-8 opacity-70">© 2025 Footsteps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
