"use client";
import { useState } from "react";

function WaitlistForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const features = [
    "Offline Map Downloads",
    "Group Trip Planning", 
    "Local Food Recommendations",
    "Budget Tracking",
    "Photo Sharing Stories",
    "Travel Safety Alerts",
    "Local Guide Booking",
    "Custom Travel Challenges"
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
        alert("🎉 Thank you for joining the waitlist! We'll be in touch soon.");
        // Reset form
        setEmail("");
        setSelectedFeatures([]);
        setComments("");
        setStep(1);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 lg:py-40 bg-surface-alt">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-primary mb-8 tracking-tight">
            Shape the App
          </h2>
          <p className="text-2xl text-subtle font-medium max-w-3xl mx-auto leading-relaxed">
            We&apos;ll encourage us - would you like to see in Footsteps?
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-border/30 shadow-sm">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    stepNumber <= step 
                      ? 'bg-brand shadow-md shadow-brand/20' 
                      : 'bg-border'
                  }`}
                />
                {stepNumber < 3 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all duration-500 ${
                    stepNumber < step ? 'bg-brand' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="relative">
          <div className="bg-white/80 backdrop-blur-xl p-10 lg:p-16 rounded-[2rem] border border-white/40 relative overflow-hidden shadow-2xl shadow-brand/5"
               style={{ minHeight: '600px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
            <div className="relative">
            
              {/* Step 1: Email */}
              <div className={`absolute inset-0 p-6 lg:p-10 transition-all duration-500 ${
                step === 1 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}>
                <div className="flex flex-col justify-between h-full min-h-[520px]">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-center mb-12">
                      <h3 className="text-3xl lg:text-4xl font-black text-primary mb-6 tracking-tight">
                        Let&apos;s start with your email
                      </h3>
                      <p className="text-xl text-subtle font-medium">We&apos;ll send you early access when Footsteps is ready</p>
                    </div>
                    
                    <form onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }} className="max-w-md mx-auto w-full space-y-8">
                      <div className="relative">
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full px-8 py-5 rounded-2xl text-primary placeholder-subtle focus:outline-none focus:ring-2 focus:ring-brand/50 border border-white/50 text-lg text-center bg-white/90 backdrop-blur-sm shadow-md focus:shadow-lg transition-all duration-200"
                          required
                        />
                      </div>
                      
                      <div className="text-center pt-6">
                        <button 
                          type="submit"
                          className="bg-brand/80 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:bg-brand transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          Continue →
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Step 2: Features */}
              <div className={`absolute inset-0 p-6 lg:p-10 transition-all duration-500 ${
                step === 2 ? 'translate-x-0 opacity-100' : step < 2 ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'
              }`}>
                <div className="h-full flex flex-col min-h-[520px]">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl lg:text-4xl font-black text-primary mb-4 tracking-tight">
                      What features excite you most?
                    </h3>
                    <p className="text-xl text-subtle font-medium">Select all that interest you (optional)</p>
                  </div>
                  
                  {/* Scrollable feature list */}
                  <div className="flex-1 overflow-y-auto mb-3 px-2" style={{ maxHeight: '280px' }}>
                    <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto pb-2">
                      {features.map((feature) => (
                        <div 
                          key={feature} 
                          className={`flex items-center p-5 rounded-2xl cursor-pointer transition-all border ${
                            selectedFeatures.includes(feature)
                              ? 'bg-white/95 border-brand shadow-md shadow-brand/10'
                              : 'bg-white/70 border-white/50 hover:border-brand/60 hover:bg-white/85'
                          }`}
                          onClick={() => handleFeatureToggle(feature)}
                        >
                          <input 
                            type="checkbox" 
                            checked={selectedFeatures.includes(feature)}
                            onChange={() => {}}
                            className="mr-4 w-5 h-5 text-brand rounded pointer-events-none"
                            tabIndex={-1}
                          />
                          <span className="text-primary font-semibold text-lg">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Fixed continue button at bottom */}
                  <div className="flex-shrink-0 text-center pt-3 border-t border-white/50 bg-white/60 backdrop-blur-sm rounded-xl mx-2">
                    <button 
                      onClick={handleFeaturesSubmit}
                      className="bg-brand/80 text-white px-12 py-4 rounded-2xl font-bold text-xl hover:bg-brand transition-all transform hover:scale-105 shadow-lg hover:shadow-xl w-full md:w-auto my-2"
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Comments */}
              <div className={`absolute inset-0 p-6 lg:p-10 transition-all duration-500 ${
                step === 3 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}>
                <div className="flex flex-col justify-between h-full min-h-[520px]">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-center mb-6">
                      <h3 className="text-3xl lg:text-4xl font-black text-primary mb-4 tracking-tight">
                        Any ideas or feedback?
                      </h3>
                      <p className="text-xl text-subtle font-medium">Help us build the perfect travel companion (optional)</p>
                    </div>
                    
                    <form onSubmit={(e) => { e.preventDefault(); handleFinalSubmit(); }} className="max-w-2xl mx-auto w-full">
                      <div className="relative">
                        <textarea 
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          rows={5}
                          placeholder="Share your travel ideas or what excites you about Footsteps..."
                          className="w-full px-8 py-6 rounded-2xl text-primary placeholder-subtle focus:outline-none focus:ring-2 focus:ring-brand/50 border border-white/50 text-lg resize-none bg-white/90 backdrop-blur-sm shadow-md focus:shadow-lg transition-all duration-200"
                        />
                      </div>
                      
                      <div className="text-center pt-4 space-y-3">
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-16 py-5 rounded-2xl font-bold text-xl transition-all shadow-xl ${
                            isSubmitting 
                              ? 'bg-gray-400 cursor-not-allowed text-white' 
                              : 'bg-brand/80 text-white hover:bg-brand transform hover:scale-105 hover:shadow-2xl'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Joining...
                            </>
                          ) : (
                            '🚀 Join Waitlist'
                          )}
                        </button>
                        <p className="text-subtle text-lg font-medium">
                          🎉 Over 1,000 travelers already joined!
                        </p>
                      </div>
                    </form>
                  </div>
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-alt/95 backdrop-blur-sm border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
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
            <button onClick={() => scrollToSection('demo')} className="text-primary hover:text-brand transition-colors duration-200 font-medium">
              Demo
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-surface-alt border-t border-border/50">
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
                  scrollToSection('demo');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-primary hover:text-brand transition-colors duration-200 font-medium"
              >
                Demo
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
    <div className="min-h-screen bg-surface-alt pt-16">
      {/* Topbar */}
      <TopBar />

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8 lg:py-32 bg-surface-alt">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-black text-primary mb-8 leading-tight tracking-tight">
                Join a global community of travelers to share itineraries, connect deeply, and track every step of your journey.
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => scrollToSection('waitlist')} className="bg-brand/80 text-white hover:bg-brand px-10 py-5 rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-lg">
                  Join the Waitlist
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Mockup */}
                <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                    {/* Beautiful Coastal Background */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'%3E%3Cdefs%3E%3ClinearGradient id='sky' x1='0%25' y1='0%25' x2='0%25' y2='70%25'%3E%3Cstop offset='0%25' style='stop-color:%23E0F2FE'/%3E%3Cstop offset='50%25' style='stop-color:%23BAE6FD'/%3E%3Cstop offset='100%25' style='stop-color:%2338BDF8'/%3E%3C/linearGradient%3E%3ClinearGradient id='water' x1='0%25' y1='70%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2338BDF8'/%3E%3Cstop offset='100%25' style='stop-color:%230EA5E9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='420' fill='url(%23sky)'/%3E%3Crect y='420' width='400' height='180' fill='url(%23water)'/%3E%3Cpath d='M0,280 Q80,200 160,240 T320,220 Q360,210 400,190 L400,420 L0,420 Z' fill='%23065F46' opacity='0.9'/%3E%3Cpath d='M0,320 Q100,250 200,280 T400,260 L400,420 L0,420 Z' fill='%23047857' opacity='0.7'/%3E%3Cpath d='M0,350 Q120,300 240,330 T400,310 L400,420 L0,420 Z' fill='%23059669' opacity='0.5'/%3E%3C/svg%3E")`
                      }}
                    >
                      {/* Subtle overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
                    </div>

                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 text-white text-sm font-medium z-20">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <svg className="w-4 h-4 ml-2" fill="white" viewBox="0 0 24 24">
                          <path d="M3 6l3 1.5L9 6l3 1.5L15 6l3 1.5L21 6v12l-3-1.5L15 18l-3-1.5L9 18l-3-1.5L3 18V6z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* App Header */}
                    <div className="absolute top-16 left-0 right-0 text-center px-6 z-20">
                      <h2 className="text-white text-2xl font-bold drop-shadow-lg">Footsteps</h2>
                    </div>
                    
                    {/* User Stats Card */}
                    <div className="absolute bottom-6 left-4 right-4 bg-white rounded-2xl p-5 shadow-xl z-20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100">
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cdefs%3E%3ClinearGradient id='avatar' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2338BDF8'/%3E%3Cstop offset='100%25' style='stop-color:%230EA5E9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='48' height='48' fill='url(%23avatar)'/%3E%3Cpath d='M24,12 C28,10 32,12 32,18 C32,24 28,26 24,26 C20,26 16,24 16,18 C16,12 20,10 24,12 Z' fill='white' opacity='0.9'/%3E%3Cpath d='M10,38 C16,32 20,30 24,30 C28,30 32,32 38,38 L38,48 L10,48 Z' fill='white' opacity='0.9'/%3E%3C/svg%3E")`
                            }}
                          ></div>
                        </div>
                        <div>
                          <div className="text-primary font-semibold text-lg">Emma Journey</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <div className="text-3xl font-bold text-primary">758 <span className="text-lg text-brand">km</span></div>
                          <div className="text-subtle text-sm">Tracked</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-primary">5</div>
                          <div className="text-subtle text-sm">Connected</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-around pt-4 border-t border-gray-100">
                        <button className="flex flex-col items-center py-2 px-3">
                          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                            </svg>
                          </div>
                          <span className="text-xs text-brand font-medium">Contract</span>
                        </button>
                        <button className="flex flex-col items-center py-2 px-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">Three</span>
                        </button>
                        <button className="flex flex-col items-center py-2 px-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"/>
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">Visiting</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Footsteps Section */}
      <section id="features" className="py-20 lg:py-32 bg-surface-alt">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-primary mb-6 tracking-tight">
              Why Footsteps?
            </h2>
            <p className="text-xl text-subtle max-w-4xl mx-auto leading-relaxed font-medium">
              Footsteps brings travelers together, fostering a sense of connection and community that goes beyond mere travel logs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Interactive Maps */}
            <div className="text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 tracking-tight">Interactive Maps</h3>
                <p className="text-subtle leading-relaxed font-medium">
                  Explore interactive map insights and discover new destinations.
                </p>
              </div>
            </div>

            {/* Friend Visits */}
            <div className="text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 tracking-tight">Friend Visits</h3>
                <p className="text-subtle leading-relaxed font-medium">
                  Connect with fellow travelers and see where they&apos;ve been.
                </p>
              </div>
            </div>

            {/* Itinerary Guides */}
            <div className="text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 tracking-tight">Itinerary Guides</h3>
                <p className="text-subtle leading-relaxed font-medium">
                  Access detailed itineraries and curated travel guides.
                </p>
              </div>
            </div>

            {/* Tribe Updates */}
            <div className="text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white/95 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-brand/10 to-brand/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-3 tracking-tight">Tribe Updates</h3>
                <p className="text-subtle leading-relaxed font-medium">
                  Keep up with insights and updates from your travel community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <WaitlistForm />

      {/* Demo Section */}
      <section id="demo" className="py-20 lg:py-32 bg-surface-alt">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-primary mb-6 tracking-tight">
              See Footsteps in Action
            </h2>
            <p className="text-xl text-subtle max-w-3xl mx-auto mb-10 font-medium">
              Watch how travelers are already using Footsteps to plan their perfect adventures.
            </p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-white/50 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-white/50 to-white/30 flex items-center justify-center">
                <button className="bg-white/95 backdrop-blur-sm p-6 rounded-full hover:bg-white transition-all transform hover:scale-110 shadow-xl hover:shadow-2xl">
                  <svg className="w-12 h-12 text-brand" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <div className="p-8 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-black text-primary mb-4 tracking-tight">Interactive Demo</h3>
                <p className="text-subtle font-medium">
                  Explore hidden gems, connect with fellow travelers, and plan your next adventure with our intuitive mobile app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-alt border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-black text-primary mb-4 tracking-tight">Footsteps</h3>
            <p className="text-subtle mb-6 font-medium">The Strava for travelers. Explore the world, one step at a time.</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-subtle hover:text-brand transition-colors font-medium">Privacy</a>
              <a href="#" className="text-subtle hover:text-brand transition-colors font-medium">Terms</a>
              <a href="#" className="text-subtle hover:text-brand transition-colors font-medium">Contact</a>
            </div>
            <p className="text-subtle text-sm mt-8 opacity-70">© 2024 Footsteps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
