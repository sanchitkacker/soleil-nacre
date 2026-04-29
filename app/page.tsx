'use client';
import { useState } from 'react';

export default function SoleilNacreWebsite() {
  const [activePage, setActivePage] = useState('home');

  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'journeys', label: 'Journeys' },
    { id: 'services', label: 'Services' },
    { id: 'journal', label: 'Journal' },
    { id: 'contact', label: 'Inquiry' },
  ];

  const journeyData = [
    {
      title: 'Mediterranean Summers',
      location: 'Amalfi • Mykonos • Saint‑Tropez',
      image:
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop',
      description:
        'Private villas, yacht charters, cliffside dining, and elegant coastal escapes designed around effortless luxury.',
    },
    {
      title: 'Alpine Escapes',
      location: 'Swiss Alps • Courchevel • Dolomites',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
      description:
        'Elevated mountain retreats featuring world‑class hospitality, wellness sanctuaries, and refined winter experiences.',
    },
    {
      title: 'Island Hideaways',
      location: 'Maldives • Seychelles • Bali',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      description:
        'Secluded beachfront villas and intimate island experiences crafted for privacy, serenity, and exceptional comfort.',
    },
  ];

  const journalPosts = [
    {
      title: 'The New Era of Quiet Luxury Travel',
      category: 'Editorial',
      image:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Private Villas Worth Escaping To',
      category: 'Destinations',
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    },
    {
      title: 'Designing Journeys Around Emotion',
      category: 'Travel Philosophy',
      image:
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1600&auto=format&fit=crop',
    },
  ];

  const renderHome = () => (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2200&auto=format&fit=crop"
          alt="Luxury destination"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="uppercase tracking-[0.45em] text-white/70 text-sm mb-8">
            Private Luxury Travel Concierge
          </p>

          <h1 className="text-6xl md:text-8xl font-serif text-white leading-tight tracking-wide">
            SOLEIL NACRE
          </h1>

          <p className="mt-10 text-lg md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            Privately curated global journeys shaped by elegance,
            discretion, and exceptional personal attention.
          </p>

          <button
            onClick={() => setActivePage('contact')}
            className="mt-12 px-8 py-4 bg-white text-black rounded-full uppercase tracking-[0.2em] text-sm hover:opacity-90 transition"
          >
            Begin Your Journey
          </button>
        </div>
      </section>

      <section className="py-28 px-6 md:px-16 bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-sm mb-6">
              Our Philosophy
            </p>

            <h2 className="text-5xl md:text-6xl font-serif leading-tight mb-10">
              Travel designed around how you wish to experience the world.
            </h2>

            <p className="text-lg leading-relaxed text-[#444] mb-6">
              Soleil Nacre curates bespoke journeys for discerning travelers who
              value refinement, privacy, and seamless experiences.
            </p>

            <p className="text-lg leading-relaxed text-[#444]">
              Every itinerary is shaped with precision, elevated hospitality,
              and quiet sophistication.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop"
              alt="Luxury resort"
              className="rounded-[2.5rem] h-[700px] w-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>
    </>
  );

  const renderAbout = () => (
    <section className="pt-40 pb-28 px-6 md:px-16 bg-[#F7F3EE] min-h-screen">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <div>
          <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-sm mb-6">
            About Soleil Nacre
          </p>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-10">
            Elevated travel shaped by refinement and emotion.
          </h1>

          <div className="space-y-8 text-lg leading-relaxed text-[#444]">
            <p>
              Soleil Nacre was founded around the belief that luxury travel
              should feel deeply personal, effortless, and emotionally
              unforgettable.
            </p>

            <p>
              We design bespoke global journeys for travelers seeking refined
              hospitality, exceptional destinations, and discreet concierge
              service.
            </p>

            <p>
              From coastal escapes and alpine retreats to private island
              experiences and modern cosmopolitan journeys, every itinerary is
              tailored entirely around your preferences.
            </p>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop"
          className="rounded-[2.5rem] shadow-2xl h-[700px] object-cover w-full"
        />
      </div>
    </section>
  );

  const renderJourneys = () => (
    <section className="pt-40 pb-28 px-6 md:px-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-sm mb-6">
            Signature Journeys
          </p>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight">
            Curated experiences across the world.
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {journeyData.map((journey, index) => (
            <div
              key={index}
              className="group bg-[#F7F3EE] rounded-[2rem] overflow-hidden shadow-lg"
            >
              <div className="overflow-hidden">
                <img
                  src={journey.image}
                  alt={journey.title}
                  className="h-[450px] w-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>

              <div className="p-8">
                <p className="uppercase tracking-[0.25em] text-xs text-[#8A7E73] mb-4">
                  {journey.location}
                </p>

                <h3 className="text-3xl font-serif mb-4">{journey.title}</h3>

                <p className="text-[#555] leading-relaxed text-lg">
                  {journey.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderServices = () => (
    <section className="pt-40 pb-28 px-6 md:px-16 bg-[#111111] text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.35em] text-[#C8B8A6] text-sm mb-6">
            Concierge Services
          </p>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight">
            Every detail considered.
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            'Privately curated itineraries tailored entirely around your travel preferences.',
            'Luxury hotel, villa, and resort partnerships across the world.',
            'Private transfers, chauffeurs, and premium transportation coordination.',
            'Honeymoons, milestone celebrations, and multi‑destination experiences.',
            'Restaurant reservations, private tours, and bespoke local experiences.',
            'Dedicated concierge support before, during, and after travel.',
          ].map((service, index) => (
            <div
              key={index}
              className="border border-white/10 rounded-[2rem] p-10 bg-white/5"
            >
              <div className="text-5xl text-white/20 mb-6">
                0{index + 1}
              </div>

              <p className="text-xl leading-relaxed text-white/85">
                {service}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderJournal = () => (
    <section className="pt-40 pb-28 px-6 md:px-16 bg-[#F7F3EE] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-sm mb-6">
            Journal
          </p>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight">
            Stories, destinations, and travel inspiration.
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {journalPosts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-[2rem] overflow-hidden shadow-lg"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-[380px] w-full object-cover"
              />

              <div className="p-8">
                <p className="uppercase tracking-[0.25em] text-xs text-[#8A7E73] mb-4">
                  {post.category}
                </p>

                <h3 className="text-3xl font-serif leading-snug">
                  {post.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="pt-40 pb-28 px-6 md:px-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-sm mb-6">
          Begin Your Journey
        </p>

        <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-10">
          Let us curate your next extraordinary escape.
        </h1>

        <p className="text-lg text-[#555] leading-relaxed mb-14 max-w-2xl mx-auto">
          Share your preferred destinations, travel style, and desired dates,
          and our concierge team will design an experience tailored entirely to
          you.
        </p>

        <div className="grid gap-5 text-left">
          <input
            type="text"
            placeholder="Full Name"
            className="p-5 rounded-2xl border border-[#DDD] bg-[#F7F3EE] text-lg"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="p-5 rounded-2xl border border-[#DDD] bg-[#F7F3EE] text-lg"
          />

          <input
            type="text"
            placeholder="Preferred Destinations"
            className="p-5 rounded-2xl border border-[#DDD] bg-[#F7F3EE] text-lg"
          />

          <textarea
            rows={7}
            placeholder="Tell us about your ideal journey"
            className="p-5 rounded-2xl border border-[#DDD] bg-[#F7F3EE] text-lg"
          />

          <button className="mt-4 bg-black text-white py-5 rounded-full uppercase tracking-[0.25em] text-sm hover:opacity-90 transition">
            Submit Inquiry
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#111111] overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5 text-white">
          <button
            onClick={() => setActivePage('home')}
            className="text-2xl tracking-[0.35em] font-serif"
          >
            SOLEIL NACRE
          </button>

          <div className="hidden md:flex items-center gap-10 text-sm uppercase tracking-[0.2em] text-white/80">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className="hover:text-white transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {activePage === 'home' && renderHome()}
      {activePage === 'about' && renderAbout()}
      {activePage === 'journeys' && renderJourneys()}
      {activePage === 'services' && renderServices()}
      {activePage === 'journal' && renderJournal()}
      {activePage === 'contact' && renderContact()}

      <footer className="bg-black text-white py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h3 className="text-3xl font-serif tracking-[0.25em]">
              SOLEIL NACRE
            </h3>

            <p className="mt-4 uppercase tracking-[0.25em] text-xs text-white/60">
              Privately Curated Global Journeys
            </p>
          </div>

          <div className="flex gap-8 text-sm uppercase tracking-[0.2em] text-white/70">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Contact</a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-white/40 text-sm">
          © 2026 Soleil Nacre. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
