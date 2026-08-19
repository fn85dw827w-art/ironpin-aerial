/**
 * IronPin Aerial — Services Page
 * Operator's Ledger: dark charcoal, orange accent, Oswald/Inter
 * Sections: Mini Hero, 4 Services, Process, FAQ Accordion, CTA
 */
import { useState, useEffect, useRef } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Link } from "wouter";
import Layout from "@/components/Layout";

function useFadeUp(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useFadeUp(ref as React.RefObject<HTMLElement>);
  return (
    <div ref={ref} className="fade-up" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

// FAQPage JSON-LD schema — generated from FAQ_ITEMS so they never drift apart
function buildFaqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a },
    })),
  };
}

const FAQ_ITEMS = [
  {
    q: "Do you provide surveys?",
    a: "No. IronPin Aerial provides aerial imaging and visualization. Our maps and models are for documentation and planning, not boundary determination or survey work. When a project needs a licensed surveyor, we're glad to work alongside yours.",
  },
  {
    q: "Where do you fly?",
    a: "Based in Orlando and serving properties across Florida. Central Florida, the coasts, and everywhere between.",
  },
  {
    q: "How fast are deliverables?",
    a: "Photo reports typically arrive within two business days of the flight. Maps and 3D models take three to five, depending on site size. If you need it faster, ask when you request the quote.",
  },
  {
    q: "What about weather?",
    a: "Florida weather runs the schedule. If conditions aren't safe or won't produce usable data, we don't fly. Re-flights due to weather are at no charge.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes, we carry a dedicated aviation insurance policy providing $1 million in third-party liability coverage, which fully protects against property damage, bodily injury, and personal or advertising injury claims. Our pilots are vetted and carry FAA Part 107 certifications for sUAS operators.",
  },
  {
    q: "Do you work with homeowners?",
    a: "Our core work is commercial: associations, property managers, contractors, resorts, and businesses. That said, we take residential projects when the scope fits what we do, such as large properties, acreage, mapping, or construction documentation on private land. If you're not sure whether your project qualifies, give us a call.",
  },
];

const FAQ_SCHEMA = buildFaqSchema(FAQ_ITEMS);

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`faq-answer-${id}`}
        id={`faq-btn-${id}`}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: open ? "#E8500F" : "#FFFFFF",
            transition: "color 150ms ease",
          }}
        >
          {q}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 250ms cubic-bezier(0.23, 1, 0.32, 1)",
            color: "#E8500F",
          }}
        >
          <path d="M3 6l5 5 5-5" stroke="#E8500F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div
        id={`faq-answer-${id}`}
        role="region"
        aria-labelledby={`faq-btn-${id}`}
        style={{
          overflow: "hidden",
          maxHeight: open ? "400px" : "0",
          transition: "max-height 300ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "#D6D9DC",
            margin: "0 0 1.25rem",
            paddingRight: "2rem",
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function Services() {
  usePageTitle("Services");
  // Inject FAQPage JSON-LD schema into <head> for AI search engines
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.textContent = JSON.stringify(FAQ_SCHEMA);
    document.head.appendChild(script);
    return () => { document.getElementById('faq-schema')?.remove(); };
  }, []);

  return (
    <Layout>
      {/* ── MINI HERO ── */}
      <section
        style={{
          position: "relative",
          backgroundColor: "#141a1f",
          padding: "5rem 0 4rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Background image with heavy overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/assets/images/rooftopscan_bbb8d628.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-label">Services</div>
          <h1
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: 0,
              maxWidth: "700px",
            }}
          >
            What We Fly,<br />What You Get
          </h1>
        </div>
      </section>

      {/* ── SERVICE 1: INSPECTIONS ── */}
      <section id="inspections" style={{ backgroundColor: "#1E252B", padding: "5rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <FadeUp>
              <div>
                <div className="section-label">01</div>
                <h2
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    margin: "0 0 1.25rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  Roof & Building Inspections
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#D6D9DC", margin: "0 0 1rem" }}>
                  A full exterior look at your property without renting a lift or putting anyone on a ladder. We fly the roofline, facades, and hard-to-reach areas, then deliver an annotated photo report: what we saw, where it is, and the complete image set. as a PDF and a share link.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#D6D9DC", margin: 0 }}>
                  Built for maintenance planning, insurance files, board packets, and vendor scoping. You'll know what's up there before anyone climbs.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={120}>
              <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3", backgroundColor: "#141a1f" }}>
                <img
                  src="/assets/images/rooftopscan_bbb8d628.webp"
                  alt="Aerial roof inspection view"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", top: 0, right: 0, width: "4px", height: "60px", backgroundColor: "#E8500F" }} />
                <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "4px", backgroundColor: "#E8500F" }} />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── SERVICE 2: MAPPING ── */}
      <section id="mapping" style={{ backgroundColor: "#141a1f", padding: "5rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <FadeUp delay={120} style={{ order: 2 }}>
              <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3", backgroundColor: "#1E252B" }}>
                <img
                  src="/assets/images/resortscan_8116f107.webp"
                  alt="Aerial orthomosaic mapping view"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "4px", height: "60px", backgroundColor: "#E8500F" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "60px", height: "4px", backgroundColor: "#E8500F" }} />
              </div>
            </FadeUp>
            <FadeUp style={{ order: 1 }}>
              <div>
                <div className="section-label">02</div>
                <h2
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    margin: "0 0 1.25rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  Mapping & 3D
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#D6D9DC", margin: "0 0 1rem" }}>
                  A measurable, to-scale map of your entire site, built from hundreds of overlapping aerial images. Orthomosaic maps, elevation views, 3D models, and stockpile volume measurements. delivered as standard files (GeoTIFF, PDF) plus a web link anyone on your team can open in a browser. No special software on your end.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#D6D9DC", margin: 0 }}>
                  For planning, documentation, and measurement. When a project calls for a licensed surveyor, we work alongside yours.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── SERVICE 3: PROGRESS DOCUMENTATION ── */}
      <section id="construction" style={{ backgroundColor: "#1E252B", padding: "5rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <FadeUp delay={120} style={{ order: 2 }}>
              <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3", backgroundColor: "#141a1f" }}>
                <img
                  src="/assets/images/construction-progress-scan_d69d8f48.webp"
                  alt="Aerial construction site progress view"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "4px", height: "60px", backgroundColor: "#E8500F" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "60px", height: "4px", backgroundColor: "#E8500F" }} />
              </div>
            </FadeUp>
            <FadeUp style={{ order: 1 }}>
              <div>
                <div className="section-label">03</div>
                <h2
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    margin: "0 0 1.25rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  Construction Progress Documentation
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#D6D9DC", margin: "0 0 1rem" }}>
                  A monthly record of your active site: one scheduled flight, one current site map, one edited photo set. delivered the same way, every month. Owners, lenders, and project teams see progress without a site visit.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#D6D9DC", margin: 0 }}>
                  Sold as an ongoing program with consistent flight paths, so month-over-month comparison means something.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── SERVICE 4: PHOTO & VIDEO ── */}
      <section id="photo-video" style={{ backgroundColor: "#141a1f", padding: "5rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <FadeUp delay={120} style={{ order: 2 }}>
              <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3", backgroundColor: "#1E252B" }}>
                <img
                  src="/assets/images/about-aerial_c7747871.jpg"
                  alt="Aerial photo and video for commercial properties"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "4px", height: "60px", backgroundColor: "#E8500F" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "60px", height: "4px", backgroundColor: "#E8500F" }} />
              </div>
            </FadeUp>
            <FadeUp style={{ order: 1 }}>
              <div>
                <div className="section-label">04</div>
                <h2
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    margin: "0 0 1.25rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  Aerial Photo & Video
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#D6D9DC", margin: 0 }}>
                  Marketing stills and edited video for property marketing, resort amenities, and business features. Shot to your spec, edited, delivered through a client gallery your team can download from directly.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* —— SERVICE 5: POST-STORM —— */}
      <section id="post-storm" style={{ backgroundColor: "#1E252B", padding: "5rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <FadeUp delay={120} style={{ order: 2 }}>
              <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3", backgroundColor: "#141a1f" }}>
                <img
                  src="/assets/images/poststorm-aerial_9093e7ec.jpg"
                  alt="Aerial post-storm property condition documentation"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "4px", height: "60px", backgroundColor: "#E8500F" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "60px", height: "4px", backgroundColor: "#E8500F" }} />
              </div>
            </FadeUp>
            <FadeUp style={{ order: 1 }}>
              <div>
                <div className="section-label">05</div>
                <h2
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    margin: "0 0 1.25rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  Post-Storm Condition Documentation
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#D6D9DC", margin: "0 0 1rem" }}>
                  Dated pre-season baselines and fast post-event condition documentation, organized and timestamped. We fly the property after a storm and deliver a complete visual record of exterior condition: rooflines, facades, common areas, and any visible damage.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem", lineHeight: 1.75, color: "#D6D9DC", margin: 0 }}>
                  We document conditions. We don't handle claims.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* —— PROCESS —— */}
      <section style={{ backgroundColor: "#1E252B", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div className="section-label">How It Works</div>
            <h2
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 600,
                color: "#FFFFFF",
                margin: "0 0 3rem",
                letterSpacing: "0.04em",
              }}
            >
              Three Steps
            </h2>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5px", backgroundColor: "rgba(255,255,255,0.06)" }}>
            {[
              {
                num: "1",
                title: "Tell us the property",
                body: "Send the address and the problem you're solving. We'll scope it and send a quote, usually within one business day.",
              },
              {
                num: "2",
                title: "We fly it",
                body: "Scheduled around your site and your tenants. FAA Part 107 certified pilot, coordinated airspace, OSHA 30 trained, weather-smart scheduling.",
              },
              {
                num: "3",
                title: "You get a link",
                body: "Reports typically within two business days of the flight. Maps and models within three to five, depending on site size.",
              },
            ].map((step, i) => (
              <FadeUp key={step.num} delay={i * 100}>
                <div style={{ backgroundColor: "#141a1f", padding: "2.5rem 2rem" }}>
                  <div
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "3rem",
                      fontWeight: 700,
                      color: "#E8500F",
                      lineHeight: 1,
                      marginBottom: "1rem",
                      opacity: 0.6,
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      margin: "0 0 0.75rem",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.65, color: "#D6D9DC", margin: 0 }}>
                    {step.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ backgroundColor: "#141a1f", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div className="section-label">FAQ</div>
            <h2
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 600,
                color: "#FFFFFF",
                margin: "0 0 2.5rem",
                letterSpacing: "0.04em",
              }}
            >
              Common Questions
            </h2>
          </FadeUp>

          <FadeUp delay={100}>
            <div style={{ maxWidth: "760px" }}>
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ backgroundColor: "#1E252B", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div style={{ maxWidth: "640px" }}>
              <div className="section-label">Get Started</div>
              <h2
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  margin: "0 0 1.25rem",
                  letterSpacing: "0.04em",
                }}
              >
                Ready to put a drone over your property?
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.7, color: "#D6D9DC", margin: "0 0 2.5rem" }}>
                Tell us what you're working with. We'll respond within one business day.
              </p>
              <Link href="/contact" className="btn-primary">
                Request a Quote
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </Layout>
  );
}
