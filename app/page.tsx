'use client';
import { useEffect, useState } from 'react';

const HUBSPOT_PORTAL_ID = '246050824';
const HUBSPOT_FORM_GUID = '87de2666-5e92-470d-bb83-15cc7863142a';

const IMAGES = {
  hero:      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=2000&q=85',
  about:     'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=85',
  amalfi:    'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=900&q=85',
  kenya:     'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=85',
  kyoto:     'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=85',
  bhutan:    'https://images.unsplash.com/photo-1553856622-d1b352e9a211?w=1200&q=85',
  hotel:     'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=85',
  andalusia: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=900&q=85',
};

const DESTINATIONS: Record<string, {
  id: string; title: string; region: string; tagline: string;
  hero: string; gallery: string[]; nights: string;
  intro: string; sections: { heading: string; body: string }[];
  hotels: { name: string; desc: string }[];
  experiences: string[];
}> = {
  amalfi: {
    id: "amalfi", title: "The Amalfi Retreat", region: "Mediterranean, Italy",
    tagline: "Clifftop villas, sapphire waters, and the scent of lemons in the morning air.",
    hero: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=900&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=80",
      "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=900&q=80",
    ],
    nights: "10 nights recommended",
    intro: "The Amalfi Coast is one of the world's most breathtaking stretches of coastline — a vertical landscape of pastel villages, ancient lemon groves, and water so blue it seems invented. Soleil Nacre curates this journey around privacy, pace, and the particular pleasure of being somewhere extraordinary without effort.",
    sections: [
      { heading: "Positano", body: "Begin in Positano, the jewel of the coast. Your private villa sits above the town, with uninterrupted sea views and a terrace made for lingering. Mornings are for the beach before the day-trippers arrive; evenings for candlelit dinners at Le Sirenuse or Da Adolfo, reached by boat." },
      { heading: "Ravello", body: "Midway through, ascend to Ravello — 365 metres above the sea, cooler, quieter, and ravishingly beautiful. Villa Rufolo and its gardens, where Wagner composed, are yours in the early morning before the crowds. Dinner at Rossellinis, one of the finest tables in the south, rounds the day perfectly." },
      { heading: "Capri", body: "A day trip to Capri by private tender brings you to the Blue Grotto, the Gardens of Augustus, and lunch at a terrace restaurant above the Faraglioni. The island rewards those who stay until the afternoon crowds have left — which is precisely what we arrange." },
    ],
    hotels: [
      { name: "Le Sirenuse, Positano", desc: "The definitive Amalfi address. 58 rooms of hand-painted tiles, antique furniture, and a terrace that overlooks the entire bay." },
      { name: "Monastero Santa Rosa, Conca dei Marini", desc: "A former 17th-century monastery perched on a cliff, with one of the coast's most spectacular infinity pools." },
      { name: "Belmond Hotel Caruso, Ravello", desc: "Ravello's most celebrated property, with gardens, a converted pool, and views that justify the journey entirely." },
    ],
    experiences: [
      "Private dawn boat tour of the Blue Grotto before public access opens",
      "Hands-on pasta and limoncello class with a local family in their hillside home",
      "Sunset aperitivo on the water, anchored between Positano and Praiano",
      "After-hours visit to Villa Cimbrone's Terrace of Infinity",
      "Market morning in Amalfi town with a private chef selecting ingredients for dinner",
    ],
  },
  kenya: {
    id: "kenya", title: "Kenya & Zanzibar", region: "East Africa",
    tagline: "The savanna at first light. The Indian Ocean at dusk. Africa in full.",
    hero: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=900&q=80",
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=900&q=80",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=80",
    ],
    nights: "14 nights recommended",
    intro: "Kenya offers something few places on earth can match: the sight of ten thousand wildebeest moving across the Maasai Mara at dawn, witnessed from a canvas chair with coffee in hand and no one else in view. We pair this with Zanzibar's spice-scented Stone Town and the powder-white beaches of the north coast — a journey of profound contrast and lasting memory.",
    sections: [
      { heading: "Maasai Mara", body: "Your base is a private conservancy bordering the Mara — not a shared game reserve, but a concession where your vehicle is the only one in the landscape. Game drives are conducted by a dedicated ranger and Maasai guide who has tracked these animals for decades. Sundowners happen wherever the light is best that evening." },
      { heading: "Amboseli", body: "Two nights in Amboseli, where vast herds of elephant move against the backdrop of Kilimanjaro. The mountain is shy — it reveals itself only when it wishes — which gives every morning a particular anticipation. Your camp here is intimate, solar-powered, and entirely without pretension." },
      { heading: "Zanzibar", body: "The journey ends at the sea. Stone Town's labyrinthine streets and its fusion of Arab, Persian, and Swahili architecture reward an unhurried morning's walk. Then north to the beaches: long, empty, and fringed with palms. Snorkelling at Mnemba Atoll, a seafood dinner at sunset, and silence." },
    ],
    hotels: [
      { name: "Angama Mara, Maasai Mara", desc: "Tented suites perched on the edge of the Great Rift Valley, with views across the Mara triangle that are genuinely without equal." },
      { name: "Tortilis Camp, Amboseli", desc: "Classic East African elegance: spacious tents, a saltwater pool, and Kilimanjaro visible from your outdoor shower on a clear morning." },
      { name: "The Palms, Zanzibar", desc: "Six beachfront villas on the quieter southeast coast. Butler service, private pool, and a beach that feels entirely yours." },
    ],
    experiences: [
      "Dawn balloon safari over the Maasai Mara with champagne landing breakfast",
      "Walking safari with a senior Maasai ranger in the private conservancy",
      "Spice farm tour and cooking class in Zanzibar's interior",
      "Snorkelling at Mnemba Atoll, one of the Indian Ocean's finest dive sites",
      "Sundowner ceremony with local Maasai elders under an acacia tree",
    ],
  },
  kyoto: {
    id: "kyoto", title: "Kyoto & Aman", region: "Japan",
    tagline: "Where temples breathe, moss gardens hold centuries, and time moves differently.",
    hero: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=2000&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80",
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=900&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&q=80",
    ],
    nights: "12 nights recommended",
    intro: "Japan rewards patience and preparation more than almost any destination on earth. Kyoto in particular — with its 1,600 temples, its ryokan culture, its seasonal rhythms of cherry blossom and autumn fire — requires the right introduction. Soleil Nacre has spent years cultivating the relationships that turn this extraordinary city from a tourist destination into a personal one.",
    sections: [
      { heading: "Higashiyama", body: "Your base in Kyoto's most atmospheric district, a short walk from Kiyomizudera and the stone-paved lanes of Ninenzaka. Your ryokan — a converted machiya townhouse — has been in the same family for four generations. Breakfast is kaiseki; the cedar bath is filled at the hour you specify." },
      { heading: "Arashiyama", body: "An afternoon in Arashiyama requires only a bamboo grove, a boat on the Oi River, and the Tenryu-ji garden at closing time, when the last visitors have left and the raked gravel holds the light differently. We arrange access to Jojakko-ji, a moss-garden temple closed to general visitors." },
      { heading: "Nara & Beyond", body: "A half-day in Nara — deer and the great Buddha — followed by the hidden Kasuga Taisha lantern paths at dusk. For those who wish to continue south, a night at Amanemu in Ise-Shima offers contemporary ryokan luxury at its most refined." },
    ],
    hotels: [
      { name: "Aman Kyoto", desc: "Hidden at the foot of the Kitayama mountains, Aman Kyoto is reached through a forest path. The property feels like a secret the city keeps for those who know to ask." },
      { name: "Tawaraya Ryokan, Kyoto", desc: "The oldest and most celebrated ryokan in Japan, operating since the early 18th century. Discretion, ceremony, and impeccable kaiseki cuisine." },
      { name: "Amanemu, Ise-Shima", desc: "On a secluded bay two hours south, this resort combines traditional Japanese aesthetics with Aman's signature spaciousness and onsen baths fed by natural hot springs." },
    ],
    experiences: [
      "Private tea ceremony with a licensed tea master in a garden pavilion",
      "After-hours access to Fushimi Inari — the thousand torii gates at night",
      "Nishiki Market at dawn with a private chef, followed by a cooking class",
      "Ikebana (flower arrangement) lesson with a master practitioner",
      "Kodo (incense ceremony) session at a 400-year-old merchant house",
    ],
  },
};


export default function SoleilNacre() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeDestination, setActiveDestination] = useState<string | null>(null);
  const [backTarget, setBackTarget] = useState<string>('journeys');

  const goBack = (target = backTarget) => {
    setActiveDestination(null);
    setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };
  const [toast, setToast]         = useState('');
  const [formSent, setFormSent]   = useState(false);
  const [formFields, setFormFields] = useState({
    firstname: '', lastname: '', email: '', destination: '', message: ''
  });
  const [formError, setFormError] = useState('');
  // Keep simple email state for hero quick-capture (unused now but kept for future)
  const [email, setEmail]         = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  useEffect(() => {
    // Cursor tracking removed

    // Navbar scroll
    const navbar  = document.getElementById('navbar');
    const onScroll = () => { if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60); };
    window.addEventListener('scroll', onScroll);

    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [activeDestination]);

  // Close mobile menu on nav click
  const closeMenu = () => setMenuOpen(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInquiry = async () => {
    if (!formFields.email || !formFields.email.includes('@')) {
      setFormError('Please enter a valid email address.');
      showToast('Please enter a valid email address.');
      return;
    }
    if (!formFields.firstname.trim()) {
      setFormError('Please enter your first name.');
      showToast('Please enter your first name.');
      return;
    }
    setFormError('');

    const messageBody = `Destination: ${formFields.destination}\n\n${formFields.message}`;

    // Fire itinerary FIRST — don't let HubSpot block it
    fetch('/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: {
          firstname: formFields.firstname,
          lastname:  formFields.lastname,
          email:     formFields.email,
          message:   messageBody,
        }
      }),
    }).then(r => r.json()).then(d => {
      if (!d.success) console.warn('Itinerary API issue:', d);
    }).catch(e => console.warn('Itinerary fetch error:', e));

    // Submit to HubSpot in parallel — non-blocking
    fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
      {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [
            { name: 'firstname', value: formFields.firstname },
            { name: 'lastname',  value: formFields.lastname },
            { name: 'email',     value: formFields.email },
            { name: 'message',   value: messageBody },
          ],
          context: { pageUri: typeof window !== 'undefined' ? window.location.href : '', pageName: 'Soleil Nacre — Inquiry' }
        })
      }
    ).catch(() => {});

    // Show success immediately — don't wait for either request
    setFormSent(true);
    setFormFields({ firstname: '', lastname: '', email: '', destination: '', message: '' });
    showToast('Thank you — your bespoke itinerary is on its way!');
  };

  const journeys = [
    { id: 'amalfi', img: IMAGES.amalfi,    region: 'Mediterranean', title: 'The Amalfi Retreat',  nights: '10 nights · Private villa · Yacht access' },
    { id: 'kenya',  img: IMAGES.kenya,     region: 'East Africa',   title: 'Kenya & Zanzibar',    nights: '14 nights · Private conservancy · Island close' },
    { id: 'kyoto',  img: IMAGES.kyoto,     region: 'Southeast Asia',title: 'Kyoto & Aman',        nights: '12 nights · Ryokan stays · Private tea ceremony' },
  ];

  const services = [
    { n:'01', t:'Bespoke Itinerary Design',        p:'We begin with an in-depth discovery conversation, then craft an itinerary built entirely around you — your pace, passions, and aesthetic sensibility. No templates. No compromise.' },
    { n:'02', t:'Exclusive Property Access',        p:'Access to private estates, closed-list retreats, and off-market accommodations not bookable through conventional channels. Many are available only through long-standing relationships like ours.' },
    { n:'03', t:'Seamless Ground Logistics',        p:'Private transfers, chartered aircraft, yacht arrangements, and security liaisons. Every movement is choreographed in advance, with a dedicated point of contact available throughout.' },
    { n:'04', t:'Cultural & Experiential Curation', p:'Private museum tours after-hours, dinners in cellars never open to the public, encounters with artisans in their studios. We turn a destination into a relationship.' },
    { n:'05', t:'Wellness & Retreats',              p:'From Ayurvedic sanctuaries in Kerala to silent residencies in the Swiss Alps, we curate immersive wellness experiences that restore as deeply as they inspire.' },
    { n:'06', t:'Ongoing Membership',               p:'Our retainer programme provides priority planning, an annual review of evolving preferences, and a dedicated travel advisor on call year-round.' },
  ];

  const testimonials = [
    { t:"Soleil Nacre didn't just book a trip — they understood exactly the kind of silence and space I was looking for. The Faroe Islands itinerary was like nothing I have experienced before.", a:'C. Whitmore',    l:'London, United Kingdom' },
    { t:'From the private cellar dinner in Burgundy to the morning transfers without a single delay, every element reflected a standard we had not encountered with any other concierge.',    a:'A. & J. Nakamura',l:'Tokyo, Japan' },
    { t:'We have worked with Soleil Nacre for six years. Each journey has felt genuinely new — they evolve with you, remember every preference, and still manage to surprise.',               a:'M. Fontaine',    l:'Geneva, Switzerland' },
  ];

  const journalPosts = [
    { img: IMAGES.bhutan,    featured: true,  cat: 'Destinations', title: 'On the particular quiet of Bhutan in March',    excerpt: "The kingdom is never crowded, but in early spring something shifts — the passes clear, the monasteries breathe, and the quality of light becomes impossible to describe." },
    { img: IMAGES.hotel,     featured: false, cat: 'Perspective',  title: 'Why the hotel you choose changes what you see', excerpt: 'Proximity to a city and immersion in it are very different things. The right address reframes everything.' },
    { img: IMAGES.andalusia, featured: false, cat: 'Craft',        title: 'A guide to travelling slowly through Andalusia',excerpt: 'The south rewards those who resist the temptation to cover too much ground. Two weeks, three towns, one unhurried pace.' },
  ];

  // ── Destination detail page ────────────────────────────────────────
  if (activeDestination) {
    const d = DESTINATIONS[activeDestination];
    if (!d) { setActiveDestination(null); return null; }
    return (
      <div style={{background:'var(--ivory)',minHeight:'100vh',color:'var(--warm)',fontFamily:"'Tenor Sans',sans-serif"}}>

        {/* Back nav */}
        <nav className="dest-nav" style={{position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 60px',background:'rgba(250,248,243,0.96)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--border)'}}>
          <button onClick={() => goBack('home')} style={{background:'none',border:'none',fontFamily:"'Cormorant Garamond',serif",fontSize:'19px',fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--deep)',cursor:'pointer'}}>Soleil Nacre</button>
          <button onClick={() => goBack('journeys')} style={{background:'none',border:'none',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--muted)',cursor:'pointer'}}>← All Journeys</button>
        </nav>

        {/* Hero */}
        <div className="dest-hero" style={{height:'100svh',position:'relative',display:'flex',alignItems:'flex-end',padding:'0 60px 80px'}}>
          <div style={{position:'absolute',inset:0,backgroundImage:`url(${d.hero})`,backgroundSize:'cover',backgroundPosition:'center'}} />
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(26,22,18,0.82) 0%,rgba(26,22,18,0.1) 65%,transparent 100%)'}} />
          <div className="dest-hero-content" style={{position:'relative',zIndex:2,maxWidth:'720px',padding:'0 0 48px 0'}}>
            <p style={{fontSize:'10px',letterSpacing:'0.4em',textTransform:'uppercase',color:'var(--gold-light)',marginBottom:'16px'}}>{d.region}</p>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(44px,6vw,86px)',fontWeight:300,color:'#faf8f3',lineHeight:1.0,marginBottom:'20px'}}>{d.title}</h1>
            <p style={{fontSize:'15px',color:'rgba(245,240,232,0.75)',lineHeight:1.85,maxWidth:'500px',marginBottom:'36px',fontStyle:'italic'}}>{d.tagline}</p>
            <div style={{display:'flex',gap:'20px',alignItems:'center',flexWrap:'wrap'}}>
              <button onClick={() => goBack('inquiry')} style={{background:'var(--gold)',color:'#faf8f3',border:'none',padding:'14px 36px',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',cursor:'pointer'}}>Begin Inquiry</button>
              <span style={{fontSize:'11px',color:'rgba(245,240,232,0.45)',letterSpacing:'0.1em'}}>{d.nights}</span>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="dest-intro" style={{padding:'100px 60px 48px',maxWidth:'860px'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'20px'}}>Overview</p>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(20px,2.4vw,28px)',fontWeight:300,lineHeight:1.65,color:'var(--deep)'}}>{d.intro}</p>
        </div>

        {/* Gallery */}
        <div className="dest-gallery" style={{padding:'0 60px 80px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
          {d.gallery.map((img,i) => (
            <div key={i} className="dest-gallery-img" style={{height:'260px',backgroundImage:`url(${img})`,backgroundSize:'cover',backgroundPosition:'center',borderRadius:'2px'}} />
          ))}
        </div>

        {/* Journey sections */}
        <div className="dest-sections" style={{padding:'80px 60px',background:'var(--sand)'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'52px'}}>The Journey</p>
          <div className="dest-sections-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'48px'}}>
            {d.sections.map((s,i) => (
              <div key={i}>
                <div style={{width:'32px',height:'1px',background:'var(--gold)',marginBottom:'20px'}} />
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'26px',fontWeight:300,color:'var(--deep)',marginBottom:'14px'}}>{s.heading}</h3>
                <p style={{fontSize:'14px',color:'var(--muted)',lineHeight:1.9}}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hotels */}
        <div className="dest-hotels" style={{padding:'80px 60px',background:'var(--deep)'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'52px'}}>Where You Stay</p>
          <div className="dest-hotels-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'2px'}}>
            {d.hotels.map((h,i) => (
              <div key={i} className="dest-hotel-card" style={{background:'var(--deep)',padding:'40px 36px',borderTop:'2px solid var(--gold)'}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'22px',fontWeight:300,color:'#faf8f3',marginBottom:'12px',lineHeight:1.3}}>{h.name}</h3>
                <p style={{fontSize:'13px',color:'rgba(245,240,232,0.45)',lineHeight:1.85}}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experiences */}
        <div className="dest-experiences" style={{padding:'80px 60px',background:'var(--ivory)'}}>
          <p style={{fontSize:'10px',letterSpacing:'0.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'52px'}}>Signature Experiences</p>
          <div className="dest-experiences-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0',maxWidth:'860px'}}>
            {d.experiences.map((e,i) => (
              <div key={i} style={{padding:'24px 20px 24px 0',borderBottom:'1px solid var(--border)',display:'flex',gap:'20px',alignItems:'flex-start'}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'20px',color:'var(--gold)',opacity:0.45,flexShrink:0}}>0{i+1}</span>
                <p style={{fontSize:'14px',color:'var(--muted)',lineHeight:1.8}}>{e}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="dest-cta" style={{padding:'100px 60px',background:'var(--deep)',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'50%',left:'50%',width:'600px',height:'600px',border:'1px solid rgba(184,150,90,0.08)',borderRadius:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none'}} />
          <div style={{position:'relative',zIndex:2}}>
            <p style={{fontSize:'10px',letterSpacing:'0.35em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'20px'}}>Reserve This Journey</p>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'clamp(32px,4vw,54px)',fontWeight:300,color:'#faf8f3',marginBottom:'16px',lineHeight:1.15}}>Begin your <em style={{fontStyle:'italic',color:'var(--gold)'}}>{d.title}</em></h2>
            <p style={{color:'rgba(245,240,232,0.4)',maxWidth:'440px',margin:'0 auto 40px',lineHeight:1.9,fontSize:'14px'}}>Our concierge team will be in touch within 24 hours to discuss your dates, preferences, and any questions.</p>
            <button onClick={() => goBack('inquiry')} style={{background:'var(--gold)',color:'#faf8f3',border:'none',padding:'16px 44px',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',cursor:'pointer'}}>
              Submit an Inquiry
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="dest-footer" style={{background:'#100e0b',color:'#faf8f3',padding:'36px 60px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'18px',fontWeight:300,letterSpacing:'0.2em',textTransform:'uppercase'}}>Soleil Nacre</p>
          <p style={{fontSize:'11px',color:'rgba(245,240,232,0.2)'}}>© 2026 Soleil Nacre. All rights reserved.</p>
          <div style={{display:'flex',gap:'20px'}}>
            <a href="https://www.instagram.com/soleil_nacre" target="_blank" rel="noopener noreferrer" style={{fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(245,240,232,0.3)',textDecoration:'none'}}>Instagram</a>
            <a href="mailto:sanchit@soleilnacre.com" style={{fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(245,240,232,0.3)',textDecoration:'none'}}>Contact</a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <>

      {/* Toast — Fix 12 */}
      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>

      {/* Nav — Fix 1: working hamburger */}
      <nav id="navbar" role="navigation" aria-label="Main navigation">
        <a href="#home" className="nav-logo">Soleil Nacre</a>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`} role="list">
          <li><a href="#about"    onClick={closeMenu}>About</a></li>
          <li><a href="#journeys" onClick={closeMenu}>Journeys</a></li>
          <li><a href="#services" onClick={closeMenu}>Services</a></li>
          <li><a href="#journal"  onClick={closeMenu}>Journal</a></li>
          <li><a href="#inquiry"  onClick={closeMenu}>Inquiry</a></li>
        </ul>
        <a href="#inquiry" className="nav-cta" onClick={closeMenu}>Begin Inquiry</a>
        <button className="nav-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
          <span /><span /><span />
        </button>
        {menuOpen && <button className="nav-close visible" onClick={closeMenu} aria-label="Close menu">✕</button>}
      </nav>

      {/* Hero */}
      <section className="hero" id="home" aria-label="Hero">
        <div className="hero-bg" style={{ backgroundImage:`url(${IMAGES.hero})`, backgroundSize:'cover', backgroundPosition:'center' }} />
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
        <div className="hero-scroll" aria-hidden="true"><div className="scroll-line" /><span>Scroll</span></div>
      </section>

      {/* About */}
      <section className="philosophy" id="about" aria-label="Our philosophy">
        <div className="philosophy-text">
          <p className="section-label reveal">Our Philosophy</p>
          <h2 className="reveal">Travel designed<br />around <em>you</em>.</h2>
          <p className="reveal">We believe the finest journeys are never assembled from a catalogue. They emerge from understanding — who you are, what moves you, how you wish to feel when you arrive somewhere new.</p>
          <p className="reveal">At Soleil Nacre, every journey begins with a conversation. We listen before we plan, and we refine until the itinerary feels inevitable — as if it could only have been made for you.</p>
          <p className="reveal">Our network spans the world\'s most coveted properties, private guides, and cultural institutions. We open doors that remain closed to others, and we do it quietly.</p>
          <div className="pillars reveal">
            <div className="pillar"><div className="pillar-icon" aria-hidden="true">I</div><h3>Discretion</h3><p>Your travel is private. Our team operates under strict confidentiality at every stage.</p></div>
            <div className="pillar"><div className="pillar-icon" aria-hidden="true">II</div><h3>Access</h3><p>Exclusive relationships with properties, estates, and experiences unavailable to the public.</p></div>
            <div className="pillar"><div className="pillar-icon" aria-hidden="true">III</div><h3>Precision</h3><p>No detail is too small. Every transfer, reservation, and preference is anticipated.</p></div>
          </div>
        </div>
        <div className="philosophy-image reveal">
          <div className="img-frame" role="img" aria-label="Luxury hotel interior" style={{ backgroundImage:`url(${IMAGES.about})`, backgroundSize:'cover', backgroundPosition:'center' }} />
        </div>
      </section>

      {/* Journeys */}
      <section className="journeys" id="journeys" aria-label="Signature journeys">
        <div className="journeys-intro">
          <div><p className="section-label reveal">Signature Journeys</p><h2 className="reveal">Rare places,<br />rare <em>perspective</em>.</h2></div>
          <p className="reveal" style={{color:'var(--muted)',lineHeight:1.9}}>From the volcanic shores of the Faroe Islands to private pavilions above the Irrawaddy, our signature journeys are a starting point — a canvas for your own version of extraordinary.</p>
        </div>
        <div className="journey-grid">
          {journeys.map((j,i) => (
            <div key={i} className="journey-card reveal" style={{transitionDelay:`${i*0.1}s`}}>
              <div className="journey-img" role="img" aria-label={j.title + ' — ' + j.region} style={{ backgroundImage:`url(${j.img})`, backgroundSize:'cover', backgroundPosition:'center' }}>
                <div className="journey-img-overlay" aria-hidden="true" />
                <div className="journey-info">
                  <p className="journey-region">{j.region}</p>
                  <h3 className="journey-title">{j.title}</h3>
                  <p className="journey-nights">{j.nights}</p>
                </div>
              </div>
              <button className="journey-link" onClick={() => { setBackTarget('journeys'); setActiveDestination(j.id); window.scrollTo({top:0,behavior:'smooth'}); }}>Explore Destination</button>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="services" id="services" aria-label="Our services">
        <p className="section-label reveal">What We Offer</p>
        <h2 className="reveal">Every dimension<br />of your journey,<br /><em>considered</em>.</h2>
        <div className="services-grid">
          {services.map((s,i) => (
            <div key={i} className="service-item reveal" style={{transitionDelay:`${i*0.05}s`}}>
              <p className="service-num" aria-hidden="true">{s.n}</p><h3>{s.t}</h3><p>{s.p}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:'56px'}}>
          <a href="#inquiry" className="btn-primary" style={{display:'inline-block'}}>Begin Your Journey</a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" aria-label="Client testimonials">
        <p className="section-label reveal">Client Voices</p>
        <h2 className="reveal">What our clients say</h2>
        <div className="testi-grid">
          {testimonials.map((t,i) => (
            <blockquote key={i} className="testi-card reveal" style={{transitionDelay:`${i*0.1}s`}}>
              <div className="testi-quote" aria-hidden="true">"</div>
              <p className="testi-text">{t.t}</p>
              <div className="testi-divider" aria-hidden="true" />
              <cite className="testi-author">{t.a}</cite>
              <p className="testi-location">{t.l}</p>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="process" aria-label="How it works">
        <p className="section-label reveal">How It Works</p>
        <h2 className="reveal">From first conversation<br />to <em>departure</em>.</h2>
        <div className="process-steps">
          {[
            {n:'01',t:'Discovery Call', p:'We begin with a 45-minute conversation to understand your travel philosophy, priorities, and the kind of experience you are seeking.'},
            {n:'02',t:'Proposal',       p:'Within one week we present a tailored proposal: destinations, properties, experiences, and a narrative that holds it together.'},
            {n:'03',t:'Refinement',     p:'We refine the plan together — adjusting, adding, and removing — until it feels entirely yours.'},
            {n:'04',t:'Journey',        p:'Your advisor remains available throughout. On return, we debrief to ensure the next journey is even better.'},
          ].map((s,i) => (
            <div key={i} className="step reveal" style={{transitionDelay:`${i*0.1}s`}}>
              <div className="step-num" aria-hidden="true">{s.n}</div><h3>{s.t}</h3><p>{s.p}</p>
              <div className="step-line" aria-hidden="true" />
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:'56px'}}>
          <a href="#inquiry" className="btn-primary" style={{display:'inline-block',background:'var(--gold)',color:'var(--ivory)'}}>Start a Conversation</a>
        </div>
      </section>

      {/* Journal — Fix 8: links to #inquiry with clear read more */}
      <section className="journal" id="journal" aria-label="Journal">
        <p className="section-label reveal">The Journal</p>
        <h2 className="reveal">Notes on travel,<br /><em>beautifully</em> done.</h2>
        <div className="journal-grid">
          {journalPosts.map((j,i) => (
            <article key={i} className={`journal-card${j.featured?' featured':''} reveal`} style={{transitionDelay:`${i*0.1}s`}}>
              <div className="journal-img" role="img" aria-label={j.title} style={{ backgroundImage:`url(${j.img})`, backgroundSize:'cover', backgroundPosition:'center' }} />
              <div className="journal-body">
                <p className="journal-cat">{j.cat}</p>
                <h3 className="journal-title">{j.title}</h3>
                <p className="journal-excerpt">{j.excerpt}</p>
                <a href="#inquiry" style={{display:'inline-block',marginTop:'12px',fontSize:'10px',letterSpacing:'0.25em',textTransform:'uppercase',color:'var(--gold)',textDecoration:'none'}}>
                  Enquire about this journey →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Inquiry — full HubSpot form with itinerary trigger */}
      <section className="inquiry" id="inquiry" aria-label="Begin your journey">
        <div className="inquiry-inner">
          <p className="section-label reveal">Begin Your Journey</p>
          <h2 className="reveal">Tell us where<br />your mind <em>wanders</em>.</h2>
          <p className="reveal">Share your details and we will craft a bespoke itinerary — delivered to your inbox within minutes.</p>

          {formSent ? (
            <div className="reveal" style={{maxWidth:'540px',margin:'0 auto',padding:'48px 36px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(184,150,90,0.2)',textAlign:'center'}}>
              <p style={{fontSize:'32px',marginBottom:'16px'}}>✦</p>
              <p style={{fontFamily:"'Cormorant Garamond', serif",fontSize:'24px',color:'var(--ivory)',marginBottom:'12px',fontWeight:300}}>Thank you, {formFields.firstname || 'for reaching out'}.</p>
              <p style={{fontSize:'13px',color:'rgba(245,240,232,0.5)',lineHeight:1.8}}>Your bespoke itinerary is being crafted and will arrive in your inbox shortly. Our concierge team will follow up within 24 hours.</p>
            </div>
          ) : (
            <div className="reveal" style={{maxWidth:'540px',margin:'0 auto'}}>
              <div className="inq-name-row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                <div>
                  <label htmlFor="firstname" style={{display:'block',fontSize:'9px',letterSpacing:'0.25em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:'6px'}}>First Name *</label>
                  <input
                    id="firstname" name="firstname" type="text" required
                    value={formFields.firstname} onChange={handleFormChange}
                    placeholder="Jane"
                    style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(184,150,90,0.3)',color:'var(--ivory)',padding:'12px 16px',fontFamily:"'Tenor Sans', sans-serif",fontSize:'13px',outline:'none',boxSizing:'border-box'}}
                  />
                </div>
                <div>
                  <label htmlFor="lastname" style={{display:'block',fontSize:'9px',letterSpacing:'0.25em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:'6px'}}>Last Name</label>
                  <input
                    id="lastname" name="lastname" type="text"
                    value={formFields.lastname} onChange={handleFormChange}
                    placeholder="Doe"
                    style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(184,150,90,0.3)',color:'var(--ivory)',padding:'12px 16px',fontFamily:"'Tenor Sans', sans-serif",fontSize:'13px',outline:'none',boxSizing:'border-box'}}
                  />
                </div>
              </div>
              <div style={{marginBottom:'12px'}}>
                <label htmlFor="inq-email" style={{display:'block',fontSize:'9px',letterSpacing:'0.25em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:'6px'}}>Email Address *</label>
                <input
                  id="inq-email" name="email" type="email" required
                  value={formFields.email} onChange={handleFormChange}
                  placeholder="jane@example.com"
                  style={{width:'100%',background:'rgba(255,255,255,0.06)',border:`1px solid ${formError && !formFields.email ? 'rgba(220,100,90,0.6)' : 'rgba(184,150,90,0.3)'}`,color:'var(--ivory)',padding:'12px 16px',fontFamily:"'Tenor Sans', sans-serif",fontSize:'13px',outline:'none',boxSizing:'border-box'}}
                />
              </div>
              <div style={{marginBottom:'12px'}}>
                <label htmlFor="destination" style={{display:'block',fontSize:'9px',letterSpacing:'0.25em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:'6px'}}>Preferred Destinations</label>
                <input
                  id="destination" name="destination" type="text"
                  value={formFields.destination} onChange={handleFormChange}
                  placeholder="Amalfi, Maldives, Kyoto…"
                  style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(184,150,90,0.3)',color:'var(--ivory)',padding:'12px 16px',fontFamily:"'Tenor Sans', sans-serif",fontSize:'13px',outline:'none',boxSizing:'border-box'}}
                />
              </div>
              <div style={{marginBottom:'20px'}}>
                <label htmlFor="message" style={{display:'block',fontSize:'9px',letterSpacing:'0.25em',textTransform:'uppercase',color:'rgba(245,240,232,0.4)',marginBottom:'6px'}}>Tell Us About Your Ideal Journey</label>
                <textarea
                  id="message" name="message" rows={5}
                  value={formFields.message} onChange={handleFormChange}
                  placeholder="Travel style, special occasions, dates, number of guests…"
                  style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(184,150,90,0.3)',color:'var(--ivory)',padding:'12px 16px',fontFamily:"'Tenor Sans', sans-serif",fontSize:'13px',outline:'none',resize:'vertical',boxSizing:'border-box'}}
                />
              </div>
              {formError && <p style={{fontSize:'12px',color:'rgba(220,100,90,0.9)',marginBottom:'12px'}}>{formError}</p>}
              <button
                onClick={handleInquiry}
                style={{width:'100%',background:'var(--gold)',color:'var(--ivory)',border:'none',padding:'16px',fontFamily:"'Tenor Sans', sans-serif",fontSize:'11px',letterSpacing:'0.25em',textTransform:'uppercase',cursor:'pointer',transition:'background 0.25s'}}
                onMouseEnter={e => (e.currentTarget.style.background='var(--gold-light)')}
                onMouseLeave={e => (e.currentTarget.style.background='var(--gold)')}
              >
                Submit Inquiry & Receive Itinerary
              </button>
              <p style={{fontSize:'11px',color:'rgba(245,240,232,0.2)',letterSpacing:'0.05em',marginTop:'16px',textAlign:'center'}}>
                A bespoke itinerary will be emailed to you automatically. Alternatively,{' '}
                <a href="mailto:sanchit@soleilnacre.com" style={{color:'rgba(245,240,232,0.4)',textDecoration:'underline'}}>sanchit@soleilnacre.com</a>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer — Fix 7: Privacy + Terms restored */}
      <footer>
        <div className="footer-top">
          <div>
            <p className="footer-brand-name">Soleil Nacre</p>
            <p className="footer-brand-desc">Private luxury travel concierge. Bespoke journeys for those who travel with purpose, taste, and the wish to be genuinely moved.</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#home">Home</a></li>
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
              <li><button onClick={() => { setBackTarget('journeys'); setActiveDestination('amalfi'); window.scrollTo({top:0,behavior:'smooth'}); }} style={{background:'none',border:'none',padding:0,color:'rgba(245,240,232,0.4)',fontSize:'13px',cursor:'pointer',textAlign:'left',transition:'color 0.25s'}} onMouseEnter={e=>(e.currentTarget.style.color='#faf8f3')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(245,240,232,0.4)')}>Mediterranean</button></li>
              <li><button onClick={() => { setBackTarget('journeys'); setActiveDestination('kenya'); window.scrollTo({top:0,behavior:'smooth'}); }} style={{background:'none',border:'none',padding:0,color:'rgba(245,240,232,0.4)',fontSize:'13px',cursor:'pointer',textAlign:'left',transition:'color 0.25s'}} onMouseEnter={e=>(e.currentTarget.style.color='#faf8f3')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(245,240,232,0.4)')}>East Africa</button></li>
              <li><button onClick={() => { setBackTarget('journeys'); setActiveDestination('kyoto'); window.scrollTo({top:0,behavior:'smooth'}); }} style={{background:'none',border:'none',padding:0,color:'rgba(245,240,232,0.4)',fontSize:'13px',cursor:'pointer',textAlign:'left',transition:'color 0.25s'}} onMouseEnter={e=>(e.currentTarget.style.color='#faf8f3')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(245,240,232,0.4)')}>South Asia</button></li>
              <li><a href="#journeys">Northern Europe</a></li>
              <li><a href="#journeys">The Americas</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:sanchit@soleilnacre.com">sanchit@soleilnacre.com</a></li>
              <li><a href="https://www.instagram.com/soleil_nacre" target="_blank" rel="noopener noreferrer">@soleil_nacre</a></li>
              <li><a href="#inquiry">Begin an Inquiry</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-legal">© 2026 Soleil Nacre. All rights reserved. Discretion is our first service.</p>
          <div className="footer-social">
            <a href="https://www.instagram.com/soleil_nacre" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="mailto:sanchit@soleilnacre.com">Contact</a>
            <a href="#inquiry">Privacy Policy</a>
            <a href="#inquiry">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}
