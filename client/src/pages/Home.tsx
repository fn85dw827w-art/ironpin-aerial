/**
 * IronPin Aerial — Home Page
 * Hero matches the provided banner sample:
 * - Full-bleed aerial background (right side photo, left side dark overlay)
 * - Large logo upper-left
 * - Big "FROM THE CORNER UP" headline
 * - Tagline with orange dash
 * - 7-service icon strip
 * - Market strip at bottom
 */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";

function useFadeUp(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.disconnect(); } },
      { threshold: 0.12 }
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

// 5 services matching the official taxonomy
const HERO_SERVICES = [
  {
    href: "/services#inspections",
    label: "Roof & Building\nInspections",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="30" height="22" rx="2" stroke="white" strokeWidth="1.8" fill="none"/>
        <path d="M3 12h30" stroke="white" strokeWidth="1.8"/>
        <path d="M12 20h12M12 24h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="28" cy="9" r="3" fill="#E8500F"/>
      </svg>
    ),
  },
  {
    href: "/services#mapping",
    label: "Mapping &\n3D Models",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 30V10l6-6h12l6 6v20H6z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
        <path d="M14 4v8H6" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M18 16v8M14 20h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/services#construction",
    label: "Construction\nProgress Docs",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 4l14 8v12L18 32 4 24V12L18 4z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
        <path d="M18 4v28M4 12l14 8 14-8" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "/services#post-storm",
    label: "Post-Storm\nCondition Docs",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="28" height="28" rx="2" stroke="white" strokeWidth="1.8" fill="none"/>
        <path d="M4 16h28M4 24h28M16 4v28M24 4v28" stroke="white" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    href: "/services#photo-video",
    label: "Aerial Photo\n& Video",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 14c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M6 18c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4v-2z" stroke="white" strokeWidth="1.8" fill="none"/>
        <path d="M14 28v4M18 28v4M22 28v4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="18" cy="19" r="2" fill="#E8500F"/>
      </svg>
    ),
  },
];

// Services for the grid section below the hero
const SERVICES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="24" height="24" rx="2" stroke="#E8500F" strokeWidth="1.5" fill="none"/>
        <path d="M8 14h12M14 8v12" stroke="#E8500F" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="3" stroke="#E8500F" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    title: "Roof & Building Inspections",
    body: "Exterior inspections without ladders, lifts, or disruption. Annotated photo reports your board or team can keep on file.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 24L14 4l10 20H4z" stroke="#E8500F" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
        <path d="M4 24h20" stroke="#E8500F" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 16h10" stroke="#E8500F" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Mapping & 3D",
    body: "Site maps and 3D models you can open in a browser. Measurable, to scale, delivered as files and share links.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="6" width="22" height="16" rx="2" stroke="#E8500F" strokeWidth="1.5" fill="none"/>
        <path d="M8 12h12M8 16h8" stroke="#E8500F" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="22" cy="8" r="3" fill="#E8500F"/>
      </svg>
    ),
    title: "Progress Documentation",
    body: "Monthly flights on active sites. A current site map and an edited photo set, on schedule, every time.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="22" height="16" rx="2" stroke="#E8500F" strokeWidth="1.5" fill="none"/>
        <path d="M11 9l8 4-8 4V9z" fill="#E8500F"/>
        <path d="M3 21h22" stroke="#E8500F" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Aerial Photo & Video",
    body: "Marketing stills and edited video for properties, resorts, and businesses.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 10c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#E8500F" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M4 14c0-1.7 1.3-3 3-3h14c1.7 0 3 1.3 3 3v1.5c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V14z" stroke="#E8500F" strokeWidth="1.5" fill="none"/>
        <path d="M10 21v3M14 21v3M18 21v3" stroke="#E8500F" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="14" cy="14.5" r="1.5" fill="#E8500F"/>
      </svg>
    ),
    title: "Post-Storm Condition Docs",
    body: "Dated pre-season baselines and fast post-event documentation. We fly after the storm, you have the record.",
  },
];

export default function Home() {
  return (
    <Layout>
      {/* ── SECTION 1: HERO — matches banner sample ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#141a1f",
        }}
      >
        {/* Full-bleed aerial background — responsive WebP with JPG fallback */}
        <picture
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
          }}
        >
          {/* Mobile: 1080px WebP */}
          <source
            media="(max-width: 768px)"
            srcSet="/assets/images/hero-light-mobile_f9410014.webp"
            type="image/webp"
          />
          {/* Mobile: 1080px JPG fallback */}
          <source
            media="(max-width: 768px)"
            srcSet="/assets/images/hero-light-mobile_b0ed3f06.jpg"
            type="image/jpeg"
          />
          {/* Desktop: 1920px WebP */}
          <source
            srcSet="/assets/images/hero-light-desktop_44785f55.webp"
            type="image/webp"
          />
          {/* Desktop: 1920px JPG fallback */}
          <img
            src="/assets/images/hero-light-desktop_717f31b8.jpg"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              /* Desktop: show full composition; Mobile: anchor right so pin stays visible */
              objectPosition: "var(--hero-obj-pos, 60% center)",
            }}
          />
        </picture>
        <style>{`
          @media (max-width: 768px) {
            img[aria-hidden="true"] { --hero-obj-pos: center center !important; object-position: center center !important; }
          }
        `}</style>
        {/* Left-heavy dark overlay — strong left, fades to right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(20,26,31,0.88) 0%, rgba(20,26,31,0.82) 38%, rgba(20,26,31,0.55) 62%, rgba(20,26,31,0.15) 100%)",
          }}
        />
        {/* Bottom fade for service strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "220px",
            background: "linear-gradient(to top, rgba(20,26,31,0.98) 0%, rgba(20,26,31,0.6) 60%, transparent 100%)",
          }}
        />

        {/* Main hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "0",
          }}
        >
          {/* ── TOP: Large logo — upper left, same width as headline ── */}
          <div
            style={{
              padding: "clamp(4.5rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem) 0",
            }}
          >
            {/* The logo width tracks the headline width.
                The headline uses font-size clamp(2.75rem,9vw,8rem) and spans ~10 chars.
                On mobile (375px): font ≈ 44px, headline ≈ 310px wide → logo should be ~310px.
                On desktop (1280px): font ≈ 8rem=128px, headline ≈ 900px wide.
                Using width:100% on a container that matches the headline's max-width. */}
            <img
              src="/assets/images/ironpin-logo-white-tight_d7f9b5d1.png"
              alt="IronPin Aerial"
              style={{
                display: "block",
                width: "100%",
                maxWidth: "clamp(300px, 85vw, 900px)",
                height: "auto",
                filter: "drop-shadow(0 2px 16px rgba(0,0,0,0.7))",
              }}
            />
          </div>

          {/* ── MIDDLE: Headline + tagline + CTA ── */}
          <div
            style={{
              padding: "clamp(1.25rem, 3vh, 2.5rem) clamp(1.5rem, 5vw, 5rem)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Big headline */}
            <h1
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "clamp(2.75rem, 9vw, 8rem)",
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                margin: "0 0 1.25rem",
              }}
            >
              From the{" "}
              <span style={{ color: "#E8500F" }}>Corner Up</span>
            </h1>

            {/* Tagline with orange dash */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                marginBottom: "2.5rem",
                maxWidth: "520px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "3px",
                  backgroundColor: "#E8500F",
                  marginTop: "0.6rem",
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: "#D6D9DC",
                  margin: 0,
                }}
              >
                Aerial imaging and mapping for Florida's commercial properties, measured from the point that matters.
              </p>
            </div>

            <Link href="/contact" className="btn-primary" style={{ alignSelf: "flex-start", fontSize: "0.9rem" }}>
              Request a Quote
            </Link>
          </div>

          {/* ── BOTTOM: 6-service icon strip ── */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              borderTop: "1px solid rgba(255,255,255,0.12)",
              backgroundColor: "rgba(20,26,31,0.85)",
              backdropFilter: "blur(8px)",
              padding: "1.25rem clamp(1rem, 4vw, 5rem)",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(90px, 1fr))",
                gap: "0.25rem",
                minWidth: "540px",
              }}
            >
              {HERO_SERVICES.map((svc, i) => (
                <Link
                  key={i}
                  href={svc.href}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.75rem 0.5rem",
                      borderRight: i < HERO_SERVICES.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                      cursor: "pointer",
                      transition: "opacity 150ms ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    <div style={{ opacity: 0.9 }}>{svc.icon}</div>
                    <div
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                        textAlign: "center",
                        lineHeight: 1.3,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {svc.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── MARKET STRIP ── */}
          <div
            style={{
              backgroundColor: "#0e1318",
              borderTop: "1px solid rgba(232,80,15,0.3)",
              padding: "0.875rem clamp(1.5rem, 5vw, 5rem)",
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            {/* IronPin mark */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 19V3h16" stroke="#E8500F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 14V3" stroke="#E8500F" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 2"/>
              <circle cx="9" cy="13" r="3" stroke="#E8500F" strokeWidth="1.8" fill="none"/>
              <path d="M9 19h10" stroke="#E8500F" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2 2"/>
            </svg>
            <div
              style={{
                display: "flex",
                gap: "0",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {["Florida Statewide", "Commercial", "Construction", "Community Associations"].map((market, i) => (
                <span key={market} style={{ display: "flex", alignItems: "center", gap: "0" }}>
                  <span
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#D6D9DC",
                    }}
                  >
                    {market}
                  </span>
                  {i < 3 && (
                    <span
                      style={{
                        color: "#E8500F",
                        margin: "0 0.75rem",
                        fontSize: "0.7rem",
                      }}
                    >
                      •
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: SERVICES GRID ── */}
      <section style={{ backgroundColor: "#141a1f", padding: "5rem 0" }}>
        <div className="container">
          <FadeUp>
            <div className="section-label">What We Do</div>
            <h2
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 600,
                color: "#FFFFFF",
                margin: "0 0 3rem",
                letterSpacing: "0.04em",
              }}
            >
              Five Services. One Vendor.
            </h2>
          </FadeUp>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5px",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            {SERVICES.map((service, i) => (
              <FadeUp key={service.title} delay={i * 80}>
                <Link
                  href="/services"
                  style={{ textDecoration: "none", display: "block", height: "100%" }}
                >
                  <div
                    style={{
                      backgroundColor: "#1E252B",
                      padding: "2.5rem 2.25rem",
                      height: "100%",
                      boxSizing: "border-box",
                      transition: "background-color 200ms ease",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#242d35"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#1E252B"; }}
                  >
                    <div style={{ marginBottom: "1.25rem" }}>{service.icon}</div>
                    <div
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#E8500F",
                        margin: "0 0 0.5rem",
                        opacity: 0.8,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "#FFFFFF",
                        margin: "0 0 0.875rem",
                        flex: 1,
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        lineHeight: 1.65,
                        color: "#D6D9DC",
                        margin: 0,
                      }}
                    >
                      {service.body}
                    </p>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={320}>
            <div style={{ marginTop: "2.5rem" }}>
              <Link href="/services" className="btn-outline">
                See All Services
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 3: ABOUT PREVIEW ── */}
      <section style={{ backgroundColor: "#1E252B", padding: "5rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            {/* Text */}
            <FadeUp>
              <div>
                <div className="section-label">About</div>
                <h2
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    margin: "0 0 1.5rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  Built by an operator,<br />not a photographer
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "#D6D9DC",
                    margin: "0 0 2rem",
                  }}
                >
                  IronPin Aerial was founded after 15 years running resorts, multi-property portfolios, and community associations. FAA Part 107 certified and OSHA 30 trained. We know what boards, managers, and project teams need from aerial data because we've sat on your side of the table.
                </p>
                <Link href="/about" className="btn-outline">
                  More About Us
                </Link>
              </div>
            </FadeUp>

            {/* Image */}
            <FadeUp delay={120}>
              <div
                style={{
                  position: "relative",
                  borderRadius: "2px",
                  overflow: "hidden",
                  aspectRatio: "4/3",
                  backgroundColor: "#141a1f",
                }}
              >
                <img
                  src="/assets/images/about-aerial_c7747871.jpg"
                  alt="Aerial view of Florida resort complex"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Orange corner accent */}
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "4px", height: "60px", backgroundColor: "#E8500F" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "60px", height: "4px", backgroundColor: "#E8500F" }} />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: REQUEST A QUOTE CTA ── */}
      <section style={{ backgroundColor: "#141a1f", padding: "5rem 0" }}>
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
                Need eyes on a roof, a site, or a whole property?
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "#D6D9DC",
                  margin: "0 0 2.5rem",
                }}
              >
                Tell us what you're working with. We'll respond within one business day.
              </p>
              <Link href="/contact" className="btn-primary">
                Request a Quote
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 5: CONTACT STRIP ── */}
      <section style={{ backgroundColor: "#1E252B", padding: "3rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem" }}>
              <a
                href="tel:+14078879889"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#E8500F"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#FFFFFF"; }}
              >
                (407) 887-9889
              </a>
              <a
                href="mailto:info@ironpinaerial.com"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                  color: "#D6D9DC",
                  textDecoration: "none",
                  alignSelf: "center",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#E8500F"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#D6D9DC"; }}
              >
                info@ironpinaerial.com
              </a>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#D6D9DC",
                  margin: 0,
                  alignSelf: "center",
                  opacity: 0.7,
                }}
              >
                Based in Orlando. Serving all of Florida.
              </p>
            </div>
            <Link href="/contact" className="btn-primary">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
