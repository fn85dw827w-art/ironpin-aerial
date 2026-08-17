/**
 * IronPin Aerial — Layout Component
 * Operator's Ledger design: dark charcoal, orange accent, Oswald/Inter
 * Header: logo left, nav center-right, CTA button far right
 * Footer: contact info, disclaimer, copyright
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Who We Serve", href: "/who-we-serve" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "background-color 200ms ease, box-shadow 200ms ease",
        backgroundColor: scrolled ? "rgba(20,26,31,0.97)" : "rgba(20,26,31,0.85)",
        backdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", height: "68px", gap: "2rem" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0, textDecoration: "none" }}>
          <img
            src="/assets/images/ironpin-logo-dark_f37a36c2.png"
            alt="IronPin Aerial"
            style={{ height: "40px", width: "auto" }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "auto" }} className="hidden-mobile">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  color: isActive ? "#E8500F" : "#D6D9DC",
                  textDecoration: "none",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "2px",
                  transition: "color 150ms ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.target as HTMLElement).style.color = "#FFFFFF"; }}
                onMouseLeave={(e) => { if (!isActive) (e.target as HTMLElement).style.color = "#D6D9DC"; }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button — desktop */}
        <Link href="/contact" className="btn-primary hidden-mobile" style={{ marginLeft: "1rem", flexShrink: 0 }}>
          Request a Quote
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="show-mobile"
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            cursor: "pointer",
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "22px",
                height: "2px",
                backgroundColor: "#FFFFFF",
                borderRadius: "1px",
                transition: "transform 200ms ease, opacity 200ms ease",
                transform:
                  menuOpen
                    ? i === 0 ? "translateY(7px) rotate(45deg)" : i === 2 ? "translateY(-7px) rotate(-45deg)" : "none"
                    : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: "#141a1f",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "1rem 0 1.5rem",
          }}
        >
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {NAV_LINKS.map((link) => {
              const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: isActive ? "#E8500F" : "#D6D9DC",
                    textDecoration: "none",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn-primary" style={{ marginTop: "1rem", textAlign: "center" }}>
              Request a Quote
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#141a1f", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="container" style={{ padding: "3rem 0 2rem" }}>
        {/* Footer main */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
          {/* Brand */}
          <div>
            <img
              src="/assets/images/ironpin-logo-dark_f37a36c2.png"
              alt="IronPin Aerial"
              style={{ height: "36px", width: "auto", marginBottom: "1rem" }}
            />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#D6D9DC", lineHeight: 1.6, margin: 0 }}>
              Aerial imaging and data collection for Florida's commercial properties.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", marginBottom: "1rem" }}>
              Pages
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#D6D9DC", textDecoration: "none", transition: "color 150ms ease" }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#E8500F"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#D6D9DC"; }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", marginBottom: "1rem" }}>
              Contact
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <a
                href="tel:+14078879889"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#D6D9DC", textDecoration: "none", transition: "color 150ms ease" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#E8500F"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#D6D9DC"; }}
              >
                (407) 887-9889
              </a>
              <a
                href="mailto:info@ironpinaerial.com"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#D6D9DC", textDecoration: "none", transition: "color 150ms ease" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#E8500F"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#D6D9DC"; }}
              >
                info@ironpinaerial.com
              </a>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#D6D9DC", margin: 0 }}>
                Based in Orlando. Serving all of Florida.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)", marginBottom: "1.5rem" }} />

        {/* Disclaimer + copyright */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#D6D9DC", lineHeight: 1.6, margin: 0, opacity: 0.7 }}>
            IronPin Aerial provides aerial imaging and data collection. Deliverables are not certified surveys and do not establish legal property boundaries.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#D6D9DC", margin: 0, opacity: 0.5 }}>
            © 2026 IronPin Aerial LLC
          </p>
        </div>
      </div>
    </footer>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#1E252B" }}>
      <Header />
      <main style={{ flex: 1, paddingTop: "68px" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
