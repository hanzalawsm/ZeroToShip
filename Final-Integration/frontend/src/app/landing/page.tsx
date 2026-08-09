"use client";

import React, { useEffect, useRef } from 'react';
import './page.css';

interface LandingPageProps {
  onOpenAuth: () => void;
}

export default function LandingPage({ onOpenAuth }: LandingPageProps) {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-container">
      {/* Background Decorative Elements */}
      <div className="bg-gradient-orb orb-1"></div>
      <div className="bg-gradient-orb orb-2"></div>
      <div className="bg-gradient-orb orb-3"></div>

      {/* Hero Section */}
      <section className="hero-section" ref={(el) => { sectionsRef.current[0] = el; }}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-gradient">Find the Right Pro,</span><br /> Instantly
          </h1>
          <p className="hero-subtitle">
            AI-powered service matching for Karachi. Describe what you need, and we'll find the best-rated professional in your neighborhood.
          </p>
          <div className="hero-cta-group">
            <button className="btn-primary" onClick={onOpenAuth}>
              Get Started
            </button>
            <button className="btn-secondary" onClick={scrollToHowItWorks}>
              See How It Works
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="mock-chat-card glass-panel floating-animation">
            <div className="chat-message user-message">
              <div className="chat-avatar user-avatar">U</div>
              <div className="chat-bubble">I need a plumber in Gulshan for a leaking pipe.</div>
            </div>
            <div className="chat-message ai-message">
              <div className="chat-avatar ai-avatar">✨</div>
              <div className="chat-bubble">
                Found 3 top-rated plumbers near Gulshan-e-Iqbal! 
                <br />
                <br />
                <strong>1. Kamran P. (4.9★)</strong> - 10 mins away
                <br />
                <strong>2. Ali R. (4.8★)</strong> - 15 mins away
                <br />
                <button className="chat-action-btn">Book Kamran</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section fade-in-section" ref={(el) => { sectionsRef.current[1] = el; }}>
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step-card glass-panel">
            <div className="step-number">1</div>
            <div className="step-icon">💬</div>
            <h3 className="step-title">Describe Your Need</h3>
            <p className="step-desc">
              Tell us what service you need, where, and when — in English, Urdu, or Roman Urdu.
            </p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card glass-panel">
            <div className="step-number">2</div>
            <div className="step-icon">🧠</div>
            <h3 className="step-title">AI Finds the Best Match</h3>
            <p className="step-desc">
              Our AI analyzes ratings, availability, response times, and location to rank providers.
            </p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card glass-panel">
            <div className="step-number">3</div>
            <div className="step-icon">📅</div>
            <h3 className="step-title">Book Instantly</h3>
            <p className="step-desc">
              Confirm your booking with one tap. Track status directly in your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="services-section fade-in-section" ref={(el) => { sectionsRef.current[2] = el; }}>
        <h2 className="section-title">Services We Offer</h2>
        <div className="services-grid">
          <div className="service-card glass-panel hover-lift">
            <div className="service-icon">🔧</div>
            <h3 className="service-name">Plumber</h3>
            <p className="service-desc">Pipe repairs, installations, leak fixes</p>
          </div>
          <div className="service-card glass-panel hover-lift">
            <div className="service-icon">⚡</div>
            <h3 className="service-name">Electrician</h3>
            <p className="service-desc">Wiring, fixtures, electrical repairs</p>
          </div>
          <div className="service-card glass-panel hover-lift">
            <div className="service-icon">🪚</div>
            <h3 className="service-name">Carpenter</h3>
            <p className="service-desc">Furniture, doors, woodwork</p>
          </div>
          <div className="service-card glass-panel hover-lift">
            <div className="service-icon">🎨</div>
            <h3 className="service-name">Painter</h3>
            <p className="service-desc">Interior, exterior, decorative painting</p>
          </div>
          <div className="service-card glass-panel hover-lift">
            <div className="service-icon">✨</div>
            <h3 className="service-name">Cleaner</h3>
            <p className="service-desc">Deep cleaning, regular maintenance</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section fade-in-section" ref={(el) => { sectionsRef.current[3] = el; }}>
        <div className="stats-grid">
          <div className="stat-card glass-panel">
            <h4 className="stat-value text-gradient">50+</h4>
            <p className="stat-label">Verified Pros</p>
          </div>
          <div className="stat-card glass-panel">
            <h4 className="stat-value text-gradient">8</h4>
            <p className="stat-label">Neighborhoods</p>
          </div>
          <div className="stat-card glass-panel">
            <h4 className="stat-value text-gradient">4.8★</h4>
            <p className="stat-label">Avg Rating</p>
          </div>
          <div className="stat-card glass-panel">
            <h4 className="stat-value text-gradient">AI</h4>
            <p className="stat-label">Powered Matching</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section fade-in-section" ref={(el) => { sectionsRef.current[4] = el; }}>
        <div className="cta-content glass-panel">
          <h2 className="cta-title">Ready to get started?</h2>
          <p className="cta-subtitle">
            Join thousands of Karachi residents who trust us for their home service needs.
          </p>
          <button className="btn-primary cta-btn" onClick={onOpenAuth}>
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  );
}
