/**
 * IronPin Aerial — Who We Serve Page
 * Operator's Ledger: dark charcoal, orange accent, Oswald/Inter
 * Sections: Mini Hero, 5 audience sections, CTA
 */
import { useEffect, useRef } from "react";
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

const AUDIENCES = [
  {
    label: "Contractors & PMs",
    title: "General Contractors & Project Managers",
    body: [
      "Progress records on your reporting cadence, stockpile and cut/fill numbers, site logistics maps that refresh with every flight.",
    ],
    image: "/assets/images/construction-progress-scan_d69d8f48.webp",
    imageAlt: "Aerial view of active construction site",
    accent: "top-right",
  },
  {
    label: "Developers & Lenders",
    title: "Developers, Owners & Lenders",
    body: [
      "One shared link per flight date. See the site without a site visit. Draw-request and investor-update ready.",
    ],
    image: "/assets/images/resortscan_8116f107.webp",
    imageAlt: "Aerial view of land and site development",
    accent: "bottom-left",
  },
  {
    label: "Landscape & Site",
    title: "Landscape & Site Contractors",
    body: [
      "Area takeoffs across 50-plus acres in a morning: sod, beds, pavers, edging, clearing limits. A measurement table your estimator can load, and a current image instead of a three-year-old satellite tile.",
    ],
    image: "/assets/images/construction-progress-scan_d69d8f48.webp",
    imageAlt: "Aerial view of land clearing and site work",
    accent: "top-right",
  },
  {
    label: "Property Owners",
    title: "Commercial Property Owners & Managers",
    body: [
      "Roof and facade documentation, pre-season baselines, portfolio media.",
    ],
    image: "/assets/images/property-management-scan_48f04043.webp",
    imageAlt: "Aerial view of resort and property complex",
    accent: "bottom-left",
  },
  {
    label: "Community Associations",
    title: "Community Associations",
    body: [
      "Annual documentation, board-packet inspections, storm baselines. Written for how boards budget.",
    ],
    image: "/assets/images/community-associations-scan_e8f4a7ab.webp",
    imageAlt: "Aerial view of community association complex",
    accent: "top-right",
  },
];

export default function WhoWeServe() {
  usePageTitle("Who We Serve");
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/assets/images/hero-aerial-edited_00778fce.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-label">Clients</div>
          <h1
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Who We Serve
          </h1>
        </div>
      </section>

      {/* ── AUDIENCE SECTIONS ── */}
      {AUDIENCES.map((audience, i) => {
        const isEven = i % 2 === 0;
        const bg = isEven ? "#1E252B" : "#141a1f";
        return (
          <section key={audience.label} style={{ backgroundColor: bg, padding: "5rem 0" }}>
            <div className="container">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "4rem",
                  alignItems: "center",
                }}
              >
                {/* Text. left on even, right on odd (via order) */}
                <FadeUp style={{ order: isEven ? 1 : 2 }}>
                  <div>
                    <div className="section-label">{audience.label}</div>
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
                      {audience.title}
                    </h2>
                    {audience.body.map((para, pi) => (
                      <p
                        key={pi}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.9375rem",
                          lineHeight: 1.75,
                          color: "#D6D9DC",
                          margin: pi < audience.body.length - 1 ? "0 0 1rem" : 0,
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </FadeUp>

                {/* Image */}
                <FadeUp delay={120} style={{ order: isEven ? 2 : 1 }}>
                  <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3", backgroundColor: "#141a1f" }}>
                    <img
                      src={audience.image}
                      alt={audience.imageAlt}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    {audience.accent === "top-right" ? (
                      <>
                        <div style={{ position: "absolute", top: 0, right: 0, width: "4px", height: "60px", backgroundColor: "#E8500F" }} />
                        <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "4px", backgroundColor: "#E8500F" }} />
                      </>
                    ) : (
                      <>
                        <div style={{ position: "absolute", bottom: 0, left: 0, width: "4px", height: "60px", backgroundColor: "#E8500F" }} />
                        <div style={{ position: "absolute", bottom: 0, left: 0, width: "60px", height: "4px", backgroundColor: "#E8500F" }} />
                      </>
                    )}
                  </div>
                </FadeUp>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CTA ── */}
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
                Serving your properties or your portfolio?
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
