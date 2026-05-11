'use client';
import { useEffect, useState } from 'react';

const HUBSPOT_PORTAL_ID = '246050824';
const HUBSPOT_FORM_GUID = '87de2666-5e92-470d-bb83-15cc7863142a';

export default function SoleilNacre() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    // Custom cursor
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    if (!cursor || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    };
    document.addEventListener('mousemove', onMove);
    let raf: number;
    const animateRing = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      raf = requestAnimationFrame(animateRing);
    };
    animateRing();
    const hoverEls = document.querySelectorAll('a, button, input');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
    });

    // Navbar scroll
    const navbar = document.getElementById('navbar');
    const onScroll = () => { if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60); };
    window.addEventListener('scroll', onScroll);

    // Reveal on scroll
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));

    return () => {
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleInquiry = async () => {
    if (!email || !email.includes('@')) {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 2000);
      return;
    }
    // Submit to HubSpot
    await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: [{ name: 'email', value: email }], context: { pageUri: window.location.href, pageName: 'Soleil Nacre' } }),
    }).catch(() => {});
    // Trigger itinerary
    fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties: { email, firstname: '', lastname: '', message: 'Initial inquiry from homepage.' } }),
    }).catch(() => {});
    setEmailSent(true);
    setEmail('');
  };

  return (
    <>
      <div className="cursor" id="cursor" />
      <div className="cursor-ring" id="cursorRing" />

      {/* Nav */}
      <nav id="navbar">
        <a href="#" className="nav-logo">Soleil Nacre</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#journeys">Journeys</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#journal">Journal</a></li>
        </ul>
        <a href="#inquiry" className="nav-cta">Begin Inquiry</a>
        <button className="nav-toggle" aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Private Luxury Travel Concierge</p>
          <h1>Journeys shaped by<br /><em>how you wish</em><br />to see the world.</h1>
          <p className="hero-sub">Soleil Nacre crafts bespoke itineraries for those who travel with intention — blending rare access, seamless discretion, and deeply personal curation.</p>
          <div className="hero-actions">
            <a href="#inquiry" className="btn-primary">Begin Your Journey</a>
            <a href="#journeys" className="btn-ghost">Explore Destinations</a>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* About */}
      <section className="philosophy" id="about">
        <div className="philosophy-text">
          <p className="section-label reveal">Our Philosophy</p>
          <h2 className="reveal">Travel designed<br />around <em>you</em>.</h2>
          <p className="reveal">We believe the finest journeys are never assembled from a catalogue. They emerge from understanding — who you are, what moves you, how you wish to feel when you arrive somewhere new.</p>
          <p className="reveal">At Soleil Nacre, every journey begins with a conversation. We listen before we plan, and we refine until the itinerary feels inevitable — as if it could only have been made for you.</p>
          <p className="reveal">Our network spans the world's most coveted properties, private guides, and cultural institutions. We open doors that remain closed to others, and we do it quietly.</p>
          <div className="pillars reveal">
            <div className="pillar"><div className="pillar-icon">I</div><h3>Discretion</h3><p>Your travel is private. Our team operates under strict confidentiality at every stage.</p></div>
            <div className="pillar"><div className="pillar-icon">II</div><h3>Access</h3><p>Exclusive relationships with properties, estates, and experiences unavailable to the public.</p></div>
            <div className="pillar"><div className="pillar-icon">III</div><h3>Precision</h3><p>No detail is too small. Every transfer, reservation, and preference is anticipated.</p></div>
          </div>
        </div>
        <div className="philosophy-image reveal">
          <div className="img-frame">
            <svg viewBox="0 0 500 540" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',opacity:0.4}}>
              <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4c8b8"/><stop offset="100%" stopColor="#a09080"/></linearGradient></defs>
              <rect width="500" height="540" fill="url(#sky)"/>
              <ellipse cx="250" cy="600" rx="300" ry="180" fill="rgba(255,255,255,0.05)"/>
              <rect x="180" y="260" width="3" height="180" fill="rgba(255,255,255,0.2)"/>
              <rect x="200" y="290" width="3" height="160" fill="rgba(255,255,255,0.15)"/>
              <rect x="220" y="270" width="3" height="175" fill="rgba(255,255,255,0.2)"/>
              <circle cx="250" cy="140" r="60" fill="rgba(255,255,255,0.06)"/>
              <circle cx="250" cy="140" r="40" fill="rgba(255,255,255,0.06)"/>
            </svg>
          </div>
          <div className="img-accent" />
        </div>
      </section>

      {/* Journeys */}
      <section className="journeys" id="journeys">
        <div className="journeys-intro">
          <div><p className="section-label reveal">Signature Journeys</p><h2 className="reveal">Rare places,<br />rare <em>perspective</em>.</h2></div>
          <p className="reveal" style={{color:'var(--muted)',lineHeight:1.9}}>From the volcanic shores of the Faroe Islands to private pavilions above the Irrawaddy, our signature journeys are a starting point — a canvas for your own version of extraordinary.</p>
        </div>
        <div className="journey-grid">
          {[
            {cls:'j1',region:'Mediterranean',title:'The Amalfi Retreat',nights:'10 nights · Private villa · Yacht access'},
            {cls:'j2',region:'East Africa',title:'Kenya & Zanzibar',nights:'14 nights · Private conservancy · Island close'},
            {cls:'j3',region:'Southeast Asia',title:'Kyoto & Aman',nights:'12 nights · Ryokan stays · Private tea ceremony'},
          ].map((j,i) => (
            <div key={i} className="journey-card reveal" style={{transitionDelay:`${i*0.1}s`}}>
              <div className={`journey-img ${j.cls}`}>
                <div className="fill" /><div className="journey-img-overlay" />
                <div className="journey-info">
                  <p className="journey-region">{j.region}</p>
                  <h3 className="journey-title">{j.title}</h3>
                  <p className="journey-nights">{j.nights}</p>
                </div>
              </div>
              <a href="#inquiry" className="journey-link">Enquire</a>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="services" id="services">
        <p className="section-label reveal">What We Offer</p>
        <h2 className="reveal">Every dimension<br />of your journey,<br /><em>considered</em>.</h2>
        <div className="services-grid">
          {[
            {n:'01',t:'Bespoke Itinerary Design',p:'We begin with an in-depth discovery conversation, then craft an itinerary built entirely around you — your pace, passions, and aesthetic sensibility. No templates. No compromise.'},
            {n:'02',t:'Exclusive Property Access',p:'Access to private estates, closed-list retreats, and off-market accommodations that are not bookable through conventional channels. Many are available only through long-standing relationships like ours.'},
            {n:'03',t:'Seamless Ground Logistics',p:'Private transfers, chartered aircraft, yacht arrangements, and security liaisons. Every movement is choreographed in advance, with a dedicated point of contact available throughout your journey.'},
            {n:'04',t:'Cultural & Experiential Curation',p:'Private museum tours after-hours, dinners in cellars that are never open to the public, encounters with artisans and scholars in their studios. We turn a destination into a relationship.'},
            {n:'05',t:'Wellness & Retreats',p:'From Ayurvedic sanctuaries in Kerala to silent residencies in the Swiss Alps, we curate immersive wellness experiences that restore as deeply as they inspire.'},
            {n:'06',t:'Ongoing Membership',p:'For clients who prefer a continuous relationship, our retainer programme provides priority planning, an annual review of evolving preferences, and a dedicated travel advisor on call year-round.'},
          ].map((s,i) => (
            <div key={i} className="service-item reveal" style={{transitionDelay:`${i*0.05}s`}}>
              <p className="service-num">{s.n}</p><h3>{s.t}</h3><p>{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <p className="section-label reveal">Client Voices</p>
        <h2 className="reveal">What our clients say</h2>
        <div className="testi-grid">
          {[
            {t:'Soleil Nacre didn\'t just book a trip — they understood exactly the kind of silence and space I was looking for. The Faroe Islands itinerary was like nothing I have experienced before.',a:'C. Whitmore',l:'London, United Kingdom'},
            {t:'From the private cellar dinner in Burgundy to the morning transfers without a single delay, every element reflected a standard we had not encountered with any other concierge.',a:'A. & J. Nakamura',l:'Tokyo, Japan'},
            {t:'We have worked with Soleil Nacre for six years. Each journey has felt genuinely new — they evolve with you, remember every preference, and still manage to surprise.',a:'M. Fontaine',l:'Geneva, Switzerland'},
          ].map((t,i) => (
            <div key={i} className="testi-card reveal" style={{transitionDelay:`${i*0.1}s`}}>
              <div className="testi-quote">"</div>
              <p className="testi-text">{t.t}</p>
              <div className="testi-divider" />
              <p className="testi-author">{t.a}</p>
              <p className="testi-location">{t.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="process">
        <p className="section-label reveal">How It Works</p>
        <h2 className="reveal">From first conversation<br />to <em>departure</em>.</h2>
        <div className="process-steps">
          {[
            {n:'01',t:'Discovery Call',p:'We begin with a 45-minute conversation to understand your travel philosophy, priorities, and the kind of experience you are seeking.'},
            {n:'02',t:'Proposal',p:'Within one week we present a tailored proposal: destinations, properties, experiences, and a narrative that holds it together.'},
            {n:'03',t:'Refinement',p:'We refine the plan together — adjusting, adding, and removing — until it feels entirely yours.'},
            {n:'04',t:'Journey',p:'Your advisor remains available throughout. On return, we debrief to ensure the next journey is even better.'},
          ].map((s,i) => (
            <div key={i} className="step reveal" style={{transitionDelay:`${i*0.1}s`}}>
              <div className="step-num">{s.n}</div>
              <h3>{s.t}</h3><p>{s.p}</p>
              <div className="step-line" />
            </div>
          ))}
        </div>
      </section>

      {/* Journal */}
      <section className="journal" id="journal">
        <p className="section-label reveal">The Journal</p>
        <h2 className="reveal">Notes on travel,<br /><em>beautifully</em> done.</h2>
        <div className="journal-grid">
          <div className="journal-card featured reveal">
            <div className="journal-img ji1"><div className="jimg-fill" /></div>
            <div className="journal-body">
              <p className="journal-cat">Destinations</p>
              <h3 className="journal-title">On the particular quiet of Bhutan in March</h3>
              <p className="journal-excerpt">The kingdom is never crowded, but in early spring something shifts — the passes clear, the monasteries breathe, and the quality of light becomes impossible to describe to anyone who hasn't been.</p>
            </div>
          </div>
          <div className="journal-card reveal" style={{transitionDelay:'0.1s'}}>
            <div className="journal-img ji2"><div className="jimg-fill" /></div>
            <div className="journal-body">
              <p className="journal-cat">Perspective</p>
              <h3 className="journal-title">Why the hotel you choose changes what you see</h3>
              <p className="journal-excerpt">Proximity to a city and immersion in it are very different things. The right address reframes everything.</p>
            </div>
          </div>
          <div className="journal-card reveal" style={{transitionDelay:'0.2s'}}>
            <div className="journal-img ji3"><div className="jimg-fill" /></div>
            <div className="journal-body">
              <p className="journal-cat">Craft</p>
              <h3 className="journal-title">A guide to travelling slowly through Andalusia</h3>
              <p className="journal-excerpt">The south rewards those who resist the temptation to cover too much ground. Two weeks, three towns, one unhurried pace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section className="inquiry" id="inquiry">
        <div className="inquiry-inner">
          <p className="section-label reveal">Begin Your Journey</p>
          <h2 className="reveal">Tell us where<br />your mind <em>wanders</em>.</h2>
          <p className="reveal">Leave your email and we will be in touch within 24 hours to arrange a complimentary discovery conversation.</p>
          <div className="inquiry-form reveal">
            <input
              type="email"
              placeholder={emailError ? 'Please enter a valid email.' : emailSent ? 'Thank you — we will be in touch shortly.' : 'Your email address'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={emailError ? {borderColor:'rgba(184,100,90,0.6)'} : {}}
              onKeyDown={e => e.key === 'Enter' && handleInquiry()}
            />
            <button onClick={handleInquiry} style={emailSent ? {background:'#687058'} : {}}>
              {emailSent ? 'Sent' : 'Reach Out'}
            </button>
          </div>
          <p className="inquiry-note reveal">Alternatively, write to us at hello@soleilnacre.com</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div>
            <p className="footer-brand-name">Soleil Nacre</p>
            <p className="footer-brand-desc">Private luxury travel concierge. Bespoke journeys for those who travel with purpose, taste, and the wish to be genuinely moved.</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#journeys">Journeys</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#journal">Journal</a></li>
              <li><a href="#inquiry">Inquiry</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Destinations</h4>
            <ul>
              <li><a href="#journeys">Mediterranean</a></li>
              <li><a href="#journeys">East Africa</a></li>
              <li><a href="#journeys">South Asia</a></li>
              <li><a href="#journeys">Northern Europe</a></li>
              <li><a href="#journeys">The Americas</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@soleilnacre.com">hello@soleilnacre.com</a></li>
              <li><a href="https://www.instagram.com/soleil_nacre" target="_blank" rel="noopener noreferrer">@soleil_nacre</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-legal">© 2026 Soleil Nacre. All rights reserved. Discretion is our first service.</p>
          <div className="footer-social">
            <a href="https://www.instagram.com/soleil_nacre" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}
