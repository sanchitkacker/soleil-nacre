'use client';
import { useState } from 'react';

const HUBSPOT_PORTAL_ID = '246050824';
const HUBSPOT_FORM_GUID = '87de2666-5e92-470d-bb83-15cc7863142a';

const journalPosts = [
  {
    id: 'quiet-luxury-travel',
    title: 'The New Era of Quiet Luxury Travel',
    category: 'Editorial',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
    excerpt: 'How the world\'s most discerning travelers are redefining what it means to travel well.',
    readTime: '6 min read',
    content: [
      { type: 'intro', text: 'There is a shift happening in the world of luxury travel — one that is less about spectacle and more about depth. The era of ostentatious opulence, of gold-plated lobbies and extravagant excess, is quietly giving way to something far more refined. Today\'s most discerning travelers are not seeking to be seen. They are seeking to feel.' },
      { type: 'heading', text: 'The Turn Away from Noise' },
      { type: 'text', text: 'Quiet luxury is not a trend born from aesthetics alone — though its visual language is unmistakably beautiful. It is a philosophy rooted in intentionality. It asks: what truly matters when you step away from your ordinary life? The answer, increasingly, is connection. To place. To culture. To the rare stillness that only the most thoughtfully curated experiences can offer.' },
      { type: 'text', text: 'Think of a private villa perched above the Amalfi Coast, where the only sounds are the sea and the wind threading through lemon groves. Or a ryokan in Kyoto\'s Higashiyama district, where every wooden detail has been considered over centuries. These are not experiences designed to impress others. They are designed to impress upon you.' },
      { type: 'heading', text: 'Privacy as the Ultimate Luxury' },
      { type: 'text', text: 'What unites the new quiet luxury traveler is a fierce prioritization of privacy. Not secrecy — but the freedom to experience the world on one\'s own terms, without the choreography of public-facing performance. Private transfers. Exclusive villa rentals. After-hours museum access. Chef\'s table dinners in cellars not open to the general public.' },
      { type: 'text', text: 'At Soleil Nacre, we have long believed that the greatest gift we can offer our clients is the freedom to be entirely themselves — unhurried, unobserved, and deeply present. That is the essence of what we curate.' },
      { type: 'heading', text: 'Material Quality, Immaterial Value' },
      { type: 'text', text: 'The fabrics are exceptional. The thread counts are extraordinary. The champagne is vintage and the chef has a Michelin star. But none of that is the point. The point is how you feel when you wake up in those sheets, in that room, and realize that every single detail has been attended to so that your only obligation is to be present.' },
      { type: 'text', text: 'That is the new era of quiet luxury travel. And for those who have experienced it, nothing else will quite do.' },
    ],
  },
  {
    id: 'private-villas',
    title: 'Private Villas Worth Escaping To',
    category: 'Destinations',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    excerpt: 'Six extraordinary private residences across three continents — each one a world unto itself.',
    readTime: '8 min read',
    content: [
      { type: 'intro', text: 'A private villa is more than a place to sleep. At its finest, it is a stage upon which the entire experience of travel unfolds — a home that is not yours, yet somehow feels more you than home itself. These are three of the world\'s most extraordinary private residences, chosen not merely for their beauty, but for the irreplaceable feeling they leave behind.' },
      { type: 'heading', text: 'Villa Aurora — Positano, Amalfi Coast' },
      { type: 'text', text: 'Carved into the cliff face above Positano\'s cerulean waters, Villa Aurora is the kind of place that seems to exist outside of time. Twelve rooms, each with uninterrupted sea views, are decorated in the restrained palette of the Mediterranean — whitewash and terracotta, linen and stone. A private chef prepares breakfast on the sun-drenched terrace each morning. A vintage wooden tender is at your disposal for spontaneous escapes to secluded coves. The bougainvillea is perpetually in bloom.' },
      { type: 'heading', text: 'Domaine des Oliviers — Saint-Rémy-de-Provence' },
      { type: 'text', text: 'A nineteenth-century mas converted into a masterpiece of Provençal luxury, Domaine des Oliviers sits amid sixty acres of lavender fields and ancient olive groves. The interiors are a collaboration between the building\'s storied history and impeccably contemporary sensibility — rough stone walls draped with antique linens, original terracotta floors warmed by underfloor heating. The pool, hewn from local limestone, seems to melt into the landscape. This is France at its most quietly magnificent.' },
      { type: 'heading', text: 'Puri Harmoni — Ubud, Bali' },
      { type: 'text', text: 'Perched above a river gorge in the sacred heart of Ubud, Puri Harmoni is both a residence and a philosophy. Traditional Balinese architecture — carved timber, pavilion-style living spaces, ornate stone water features — coexists with every modern comfort. Mornings begin with guided meditation in the open-air yoga pavilion. Afternoons dissolve into the sound of the river below. A resident healer offers ancient Balinese treatments by candlelight. Time, here, moves differently.' },
      { type: 'heading', text: 'The Full Collection' },
      { type: 'text', text: 'These three represent only a fragment of the private residences Soleil Nacre works with across the Mediterranean, Indian Ocean, and beyond. Each property is personally vetted — we stay in them, we speak with their staff, we understand their rhythms and their light at different times of year. Only then do we match them to our clients.' },
      { type: 'text', text: 'To inquire about any of these properties, or to begin the conversation about which villa might be right for your next journey, we invite you to reach out to our concierge team directly.' },
    ],
  },
  {
    id: 'journeys-around-emotion',
    title: 'Designing Journeys Around Emotion',
    category: 'Travel Philosophy',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1600&auto=format&fit=crop',
    excerpt: 'The itinerary is only the beginning. The best journeys are built around how you want to feel.',
    readTime: '5 min read',
    content: [
      { type: 'intro', text: 'When a new client first reaches out to us, we rarely begin with destinations. We begin with a question: how do you want to feel? It is a question that catches people off guard. They arrive prepared to speak of places — of specific hotels, of coastlines and mountain ranges. And we will get there. But first, we want to understand the emotional territory of the journey.' },
      { type: 'heading', text: 'The Feeling First' },
      { type: 'text', text: 'Do you want to feel expansive — freed from obligation, opened to the largeness of the world? Or do you want to feel held — cocooned in warmth, in intimacy, in the particular softness that comes from being exquisitely cared for? Are you seeking adventure tempered by elegance? Solitude tempered by connection? The answer shapes everything.' },
      { type: 'text', text: 'A couple seeking renewal after a difficult year does not need the same Amalfi Coast as a pair of friends celebrating a milestone birthday. The geography may overlap. The emotional architecture is entirely different. One calls for stillness and privacy — long mornings, quiet dinners, unhurried days. The other calls for movement and joy — boat trips, discovery, tables shared with strangers who become friends.' },
      { type: 'heading', text: 'The Architecture of a Perfect Day' },
      { type: 'text', text: 'Once we understand the emotional destination, we begin constructing the days. Not hour by hour — rigidity is the enemy of wonder — but in broad, beautiful movements. A morning with intention. An afternoon with freedom. An evening that feels inevitable in the best possible way. We think about pacing the way a composer thinks about a symphony. There must be moments of crescendo and moments of silence. There must be surprise.' },
      { type: 'text', text: 'The private dinner on the rooftop of a Marrakech riad, arranged just so, on just that evening, because we knew the moon would be full and the air would be warm with the last breath of summer. The spontaneous detour to a vineyard in the Luberon, because our driver mentioned it and we had built enough white space into the day for such things. These are not accidents. They are designed.' },
      { type: 'heading', text: 'What We Remember' },
      { type: 'text', text: 'Research in the psychology of memory tells us that we remember peak moments and endings — not the cumulative average of an experience. A journey can have an imperfect middle and still be unforgettable, if its peaks are extraordinary and its ending is right. We keep this in mind always.' },
      { type: 'text', text: 'The last dinner. The final morning. The drive to the airport, which we try to route — always — past something beautiful. We want the last thing you see to be worthy of everything that came before it. Because how you feel when you return home is, in the end, the true measure of a journey.' },
    ],
  },
];

export default function SoleilNacreWebsite() {
  const [activePage, setActivePage] = useState('home');
  const [activeJournalPost, setActiveJournalPost] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formFields, setFormFields] = useState({ firstname: '', lastname: '', email: '', destination: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormError('');
    const payload = {
      fields: [
        { name: 'firstname', value: formFields.firstname },
        { name: 'lastname', value: formFields.lastname },
        { name: 'email', value: formFields.email },
        { name: 'message', value: `Destination: ${formFields.destination}\n\n${formFields.message}` },
      ],
      context: { pageUri: typeof window !== 'undefined' ? window.location.href : '', pageName: 'Soleil Nacre — Inquiry' },
    };
    try {
      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || 'Submission failed'); }
      setFormStatus('success');
      setFormFields({ firstname: '', lastname: '', email: '', destination: '', message: '' });
    } catch (err: unknown) {
      setFormStatus('error');
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'journeys', label: 'Journeys' },
    { id: 'services', label: 'Services' },
    { id: 'journal', label: 'Journal' },
    { id: 'contact', label: 'Inquiry' },
  ];

  const journeyData = [
    { title: 'Mediterranean Summers', location: 'Amalfi • Mykonos • Saint‑Tropez', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop', description: 'Private villas, yacht charters, cliffside dining, and elegant coastal escapes designed around effortless luxury.' },
    { title: 'Alpine Escapes', location: 'Swiss Alps • Courchevel • Dolomites', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop', description: 'Elevated mountain retreats featuring world‑class hospitality, wellness sanctuaries, and refined winter experiences.' },
    { title: 'Island Hideaways', location: 'Maldives • Seychelles • Bali', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop', description: 'Secluded beachfront villas and intimate island experiences crafted for privacy, serenity, and exceptional comfort.' },
  ];

  const navigateTo = (page: string, journalId?: string) => {
    setActivePage(page);
    setActiveJournalPost(journalId || null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderHome = () => (
    <>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2200&auto=format&fit=crop" alt="Luxury destination" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="uppercase tracking-[0.3em] md:tracking-[0.45em] text-white/70 text-xs md:text-sm mb-6 md:mb-8">Private Luxury Travel Concierge</p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif text-white leading-tight tracking-wide">SOLEIL NACRE</h1>
          <p className="mt-6 md:mt-10 text-base md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            Privately curated global journeys shaped by elegance, discretion, and exceptional personal attention.
          </p>
          <button onClick={() => navigateTo('contact')} className="mt-8 md:mt-12 px-7 py-4 bg-white text-black rounded-full uppercase tracking-[0.2em] text-sm hover:opacity-90 transition">
            Begin Your Journey
          </button>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 md:py-28 px-6 md:px-16 bg-[#F7F3EE]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div>
            <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-xs md:text-sm mb-4 md:mb-6">Our Philosophy</p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif leading-tight mb-6 md:mb-10">
              Travel designed around how you wish to experience the world.
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-[#444] mb-4 md:mb-6">
              Soleil Nacre curates bespoke journeys for discerning travelers who value refinement, privacy, and seamless experiences.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-[#444]">
              Every itinerary is shaped with precision, elevated hospitality, and quiet sophistication.
            </p>
            <button onClick={() => navigateTo('about')} className="mt-8 md:mt-10 px-7 py-4 border border-black text-black rounded-full uppercase tracking-[0.2em] text-sm hover:bg-black hover:text-white transition">
              Our Philosophy
            </button>
          </div>
          <div className="mt-4 md:mt-0">
            <img src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop" alt="Luxury resort" className="rounded-[2rem] h-[320px] sm:h-[480px] md:h-[700px] w-full object-cover shadow-2xl" />
          </div>
        </div>
      </section>
    </>
  );

  const renderAbout = () => (
    <section className="pt-28 md:pt-40 pb-16 md:pb-28 px-6 md:px-16 bg-[#F7F3EE] min-h-screen">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-xs md:text-sm mb-4 md:mb-6">About Soleil Nacre</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight mb-8 md:mb-10">
            Elevated travel shaped by refinement and emotion.
          </h1>
          <div className="space-y-5 md:space-y-8 text-base md:text-lg leading-relaxed text-[#444]">
            <p>Soleil Nacre was founded around the belief that luxury travel should feel deeply personal, effortless, and emotionally unforgettable.</p>
            <p>We design bespoke global journeys for travelers seeking refined hospitality, exceptional destinations, and discreet concierge service.</p>
            <p>From coastal escapes and alpine retreats to private island experiences and modern cosmopolitan journeys, every itinerary is tailored entirely around your preferences.</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop" className="rounded-[2rem] shadow-2xl h-[300px] sm:h-[450px] md:h-[700px] object-cover w-full" alt="Luxury interior" />
        </div>
      </div>
    </section>
  );

  const renderJourneys = () => (
    <section className="pt-28 md:pt-40 pb-16 md:pb-28 px-6 md:px-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-xs md:text-sm mb-4 md:mb-6">Signature Journeys</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight">Curated experiences across the world.</h1>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {journeyData.map((journey, index) => (
            <div key={index} className="group bg-[#F7F3EE] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-lg">
              <div className="overflow-hidden">
                <img src={journey.image} alt={journey.title} className="h-[260px] md:h-[450px] w-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-5 md:p-8">
                <p className="uppercase tracking-[0.25em] text-xs text-[#8A7E73] mb-3 md:mb-4">{journey.location}</p>
                <h3 className="text-2xl md:text-3xl font-serif mb-3 md:mb-4">{journey.title}</h3>
                <p className="text-[#555] leading-relaxed text-base md:text-lg">{journey.description}</p>
                <button onClick={() => navigateTo('contact')} className="mt-5 md:mt-6 text-sm uppercase tracking-[0.2em] underline underline-offset-4 text-[#8A7E73] hover:text-black transition">
                  Enquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderServices = () => (
    <section className="pt-28 md:pt-40 pb-16 md:pb-28 px-6 md:px-16 bg-[#111111] text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <p className="uppercase tracking-[0.35em] text-[#C8B8A6] text-xs md:text-sm mb-4 md:mb-6">Concierge Services</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight">Every detail considered.</h1>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-8">
          {[
            'Privately curated itineraries tailored entirely around your travel preferences.',
            'Luxury hotel, villa, and resort partnerships across the world.',
            'Private transfers, chauffeurs, and premium transportation coordination.',
            'Honeymoons, milestone celebrations, and multi‑destination experiences.',
            'Restaurant reservations, private tours, and bespoke local experiences.',
            'Dedicated concierge support before, during, and after travel.',
          ].map((service, index) => (
            <div key={index} className="border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 bg-white/5">
              <div className="text-4xl md:text-5xl text-white/20 mb-4 md:mb-6">0{index + 1}</div>
              <p className="text-base md:text-xl leading-relaxed text-white/85">{service}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 md:mt-16">
          <button onClick={() => navigateTo('contact')} className="px-8 md:px-10 py-4 md:py-5 bg-white text-black rounded-full uppercase tracking-[0.2em] text-sm hover:opacity-90 transition">
            Begin Your Journey
          </button>
        </div>
      </div>
    </section>
  );

  const renderJournal = () => (
    <section className="pt-28 md:pt-40 pb-16 md:pb-28 px-6 md:px-16 bg-[#F7F3EE] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-xs md:text-sm mb-4 md:mb-6">Journal</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight">Stories, destinations, and travel inspiration.</h1>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {journalPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => navigateTo('journal-post', post.id)}
              className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-lg text-left group hover:shadow-xl transition-shadow duration-300 w-full"
            >
              <div className="overflow-hidden">
                <img src={post.image} alt={post.title} className="h-[220px] md:h-[380px] w-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-5 md:p-8">
                <p className="uppercase tracking-[0.25em] text-xs text-[#8A7E73] mb-3 md:mb-4">{post.category}</p>
                <h3 className="text-2xl md:text-3xl font-serif leading-snug mb-3 md:mb-4">{post.title}</h3>
                <p className="text-[#777] text-sm md:text-base leading-relaxed mb-4 md:mb-6">{post.excerpt}</p>
                <span className="text-sm uppercase tracking-[0.2em] underline underline-offset-4 text-[#8A7E73] group-hover:text-black transition">
                  Read More →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  const renderJournalPost = () => {
    const post = journalPosts.find((p) => p.id === activeJournalPost);
    if (!post) return null;
    return (
      <article className="pt-28 md:pt-40 pb-16 md:pb-28 px-6 md:px-16 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigateTo('journal')} className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#8A7E73] hover:text-black transition mb-10 md:mb-14">
            ← Back to Journal
          </button>
          <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-xs md:text-sm mb-4 md:mb-6">{post.category}</p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif leading-tight mb-4 md:mb-6">{post.title}</h1>
          <p className="text-[#999] text-xs md:text-sm uppercase tracking-[0.15em] mb-8 md:mb-12">{post.readTime}</p>
          <img src={post.image} alt={post.title} className="w-full h-[240px] sm:h-[360px] md:h-[500px] object-cover rounded-[1.5rem] md:rounded-[2rem] mb-10 md:mb-16 shadow-xl" />
          <div className="space-y-6 md:space-y-8">
            {post.content.map((block, i) => {
              if (block.type === 'intro') return <p key={i} className="text-xl md:text-2xl leading-relaxed text-[#222] font-serif italic">{block.text}</p>;
              if (block.type === 'heading') return <h2 key={i} className="text-2xl md:text-3xl font-serif mt-10 md:mt-14 mb-2 text-[#111]">{block.text}</h2>;
              return <p key={i} className="text-base md:text-lg leading-relaxed text-[#444]">{block.text}</p>;
            })}
          </div>
          <div className="mt-16 md:mt-20 pt-10 md:pt-12 border-t border-[#EEE] text-center">
            <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-xs md:text-sm mb-4 md:mb-6">Ready to Experience This?</p>
            <h3 className="text-3xl md:text-4xl font-serif mb-6 md:mb-8">Let us craft your perfect journey.</h3>
            <button onClick={() => navigateTo('contact')} className="px-8 md:px-10 py-4 md:py-5 bg-black text-white rounded-full uppercase tracking-[0.2em] text-sm hover:opacity-90 transition">
              Begin Your Journey
            </button>
          </div>
        </div>
      </article>
    );
  };

  const renderContact = () => (
    <section className="pt-28 md:pt-40 pb-16 md:pb-28 px-6 md:px-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <p className="uppercase tracking-[0.35em] text-[#8A7E73] text-xs md:text-sm mb-4 md:mb-6">Begin Your Journey</p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight mb-6 md:mb-10">
          Let us curate your next extraordinary escape.
        </h1>
        <p className="text-base md:text-lg text-[#555] leading-relaxed mb-10 md:mb-14 max-w-2xl mx-auto">
          Share your preferred destinations, travel style, and desired dates, and our concierge team will design an experience tailored entirely to you.
        </p>
        {formStatus === 'success' ? (
          <div className="py-12 md:py-16 px-6 md:px-10 bg-[#F7F3EE] rounded-[1.5rem] md:rounded-[2rem] text-center">
            <div className="text-5xl mb-6">✓</div>
            <h2 className="text-2xl md:text-3xl font-serif mb-4">Thank you for reaching out.</h2>
            <p className="text-base md:text-lg text-[#555]">Our concierge team will be in touch within 24 hours to begin crafting your journey.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 md:gap-5 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              <input type="text" name="firstname" placeholder="First Name" required value={formFields.firstname} onChange={handleFieldChange} className="p-4 md:p-5 rounded-2xl border border-[#DDD] bg-[#F7F3EE] text-base md:text-lg focus:outline-none focus:border-[#8A7E73]" />
              <input type="text" name="lastname" placeholder="Last Name" required value={formFields.lastname} onChange={handleFieldChange} className="p-4 md:p-5 rounded-2xl border border-[#DDD] bg-[#F7F3EE] text-base md:text-lg focus:outline-none focus:border-[#8A7E73]" />
            </div>
            <input type="email" name="email" placeholder="Email Address" required value={formFields.email} onChange={handleFieldChange} className="p-4 md:p-5 rounded-2xl border border-[#DDD] bg-[#F7F3EE] text-base md:text-lg focus:outline-none focus:border-[#8A7E73]" />
            <input type="text" name="destination" placeholder="Preferred Destinations" value={formFields.destination} onChange={handleFieldChange} className="p-4 md:p-5 rounded-2xl border border-[#DDD] bg-[#F7F3EE] text-base md:text-lg focus:outline-none focus:border-[#8A7E73]" />
            <textarea rows={6} name="message" placeholder="Tell us about your ideal journey" value={formFields.message} onChange={handleFieldChange} className="p-4 md:p-5 rounded-2xl border border-[#DDD] bg-[#F7F3EE] text-base md:text-lg focus:outline-none focus:border-[#8A7E73]" />
            {formStatus === 'error' && <p className="text-red-600 text-sm">⚠ {formError}</p>}
            <button type="submit" disabled={formStatus === 'loading'} className="mt-2 md:mt-4 bg-black text-white py-4 md:py-5 rounded-full uppercase tracking-[0.25em] text-sm hover:opacity-90 transition disabled:opacity-50">
              {formStatus === 'loading' ? 'Sending…' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#111111] overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:py-5 text-white">
          <button onClick={() => navigateTo('home')} className="text-xl md:text-2xl tracking-[0.35em] font-serif">
            SOLEIL NACRE
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10 text-sm uppercase tracking-[0.2em] text-white/80">
            {navigation.map((item) => (
              <button key={item.id} onClick={() => navigateTo(item.id)} className={`hover:text-white transition ${activePage === item.id ? 'text-white' : ''}`}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`block w-full text-left px-6 py-4 text-sm uppercase tracking-[0.2em] border-b border-white/10 transition ${activePage === item.id ? 'text-white' : 'text-white/70 hover:text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {activePage === 'home' && renderHome()}
      {activePage === 'about' && renderAbout()}
      {activePage === 'journeys' && renderJourneys()}
      {activePage === 'services' && renderServices()}
      {activePage === 'journal' && renderJournal()}
      {activePage === 'journal-post' && renderJournalPost()}
      {activePage === 'contact' && renderContact()}

      {/* Footer */}
      <footer className="bg-black text-white py-10 md:py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 text-center md:text-left">
          <div>
            <h3 className="text-2xl md:text-3xl font-serif tracking-[0.25em]">SOLEIL NACRE</h3>
            <p className="mt-3 md:mt-4 uppercase tracking-[0.25em] text-xs text-white/60">Privately Curated Global Journeys</p>
          </div>
          <div className="flex gap-6 md:gap-8 text-sm uppercase tracking-[0.2em] text-white/70">
            <a href="https://www.instagram.com/soleil_nacre" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Instagram</a>
            <button onClick={() => navigateTo('contact')} className="hover:text-white transition">Contact</button>
          </div>
        </div>
        <div className="mt-8 md:mt-12 border-t border-white/10 pt-6 md:pt-8 text-center text-white/40 text-xs md:text-sm">
          © 2026 Soleil Nacre. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
