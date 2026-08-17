/**
 * IronPin Aerial — About Page
 * Operator's Ledger: dark charcoal, orange accent, Oswald/Inter
 * Sections: Mini Hero, Founder Story, CTA
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

export default function About() {
  usePageTitle("About");
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
            backgroundImage: "url('/assets/images/rooftopscan_bbb8d628.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-label">About</div>
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
            The Operator<br />Behind the Aircraft
          </h1>
        </div>
      </section>

      {/* ── FOUNDER STORY ── */}
      <section style={{ backgroundColor: "#1E252B", padding: "5rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "5rem",
              alignItems: "start",
            }}
          >
            {/* Story text */}
            <FadeUp>
              <div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    color: "#D6D9DC",
                    margin: "0 0 1.5rem",
                  }}
                >
                  IronPin Aerial exists because of a simple gap: most people flying drones over commercial properties have never run one.
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    color: "#D6D9DC",
                    margin: "0 0 1.5rem",
                  }}
                >
                  I spent more than 15 years operating resorts and multi-property portfolios across Florida. I've worked with HOA boards, managed capital projects and hurricane recoveries, and sat through the budget meetings where all of it gets decided. I know what a board needs in the packet, what a manager needs before the vendor call, and what an owner needs to see before signing off.
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    color: "#D6D9DC",
                    margin: "0 0 1.5rem",
                  }}
                >
                  That's what IronPin Aerial delivers: aerial data built for the people who have to use it.
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    color: "#D6D9DC",
                    margin: "0 0 2.5rem",
                  }}
                >
                  The name comes from the iron pin. the monument at a property's corner, the point everything else is measured from. That's how we work. Start from the point that matters, and build from there.
                </p>

                {/* Signature block */}
                <div
                  style={{
                    borderLeft: "3px solid #E8500F",
                    paddingLeft: "1.25rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      margin: "0 0 0.25rem",
                    }}
                  >
                    Dallas Hobbs
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#D6D9DC",
                      margin: "0 0 0.125rem",
                      opacity: 0.8,
                    }}
                  >
                    Owner, IronPin Aerial
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.8125rem",
                      color: "#E8500F",
                      margin: "0.375rem 0 0.125rem",
                      opacity: 0.9,
                      letterSpacing: "0.03em",
                    }}
                  >
                    FAA Part 107 Remote Pilot &nbsp;&middot;&nbsp; OSHA 30
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#D6D9DC",
                      margin: 0,
                      opacity: 0.6,
                    }}
                  >
                    Based in Orlando. Serving all of Florida.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Image placeholder. real photo of Dallas goes here */}
            <FadeUp delay={120}>
              <div
                style={{
                  position: "relative",
                  borderRadius: "2px",
                  overflow: "hidden",
                  backgroundColor: "#141a1f",
                  aspectRatio: "3/4",
                  maxWidth: "420px",
                }}
              >
                <img
                  src="/assets/images/dallas-headshot-real_9a49ebc4.jpg"
                  alt="Dallas Hobbs. Owner, IronPin Aerial"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                />
                {/* Orange corner accent */}
                <div style={{ position: "absolute", top: 0, right: 0, width: "4px", height: "60px", backgroundColor: "#E8500F" }} />
                <div style={{ position: "absolute", top: 0, right: 0, width: "60px", height: "4px", backgroundColor: "#E8500F" }} />
              </div>

              {/* FAA compliance note */}
              <div
                style={{
                  marginTop: "2rem",
                  padding: "1.25rem 1.5rem",
                  backgroundColor: "#141a1f",
                  borderLeft: "2px solid rgba(232,80,15,0.4)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8125rem",
                    color: "#D6D9DC",
                    margin: 0,
                    lineHeight: 1.65,
                    opacity: 0.8,
                  }}
                >
                  FAA Part 107 certified. OSHA 30 trained. Based in Orlando and serving properties across Florida -- Central Florida, the coasts, and everywhere between.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

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
                Have a property that needs a closer look?
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
