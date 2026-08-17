/**
 * IronPin Aerial — Contact Page
 * Operator's Ledger: dark charcoal, orange accent, Oswald/Inter
 * Quote form: Name, Email, Company, Property Type, Service Needed, Message
 * Submissions: POST to /api/trpc/contact.submit → email via Resend → redirect /thank-you
 * On failure: inline error with phone number (407) 887-9889
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { usePageTitle } from "@/hooks/usePageTitle";

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

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#141a1f",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "2px",
  padding: "0.75rem 1rem",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.9375rem",
  color: "#FFFFFF",
  outline: "none",
  transition: "border-color 150ms ease",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#D6D9DC",
  marginBottom: "0.5rem",
};

export default function Contact() {
  usePageTitle("Request a Quote");
  const [, navigate] = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const formLoadTime = useRef(Date.now());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    propertyAddress: "",
    serviceNeeded: "",
    message: "",
    // honeypot — must stay empty
    website: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts editing again
    if (formError) setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Honeypot check — bots fill hidden fields
    if (formData.website) return;
    // Minimum time-on-page check — bots submit instantly
    if (Date.now() - formLoadTime.current < 3000) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, formStartedAt: formLoadTime.current }),
      });
      if (!response.ok) throw new Error(`Contact request failed: ${response.status}`);
      navigate("/thank-you");
    } catch (error) {
      console.error("[Contact] Submission error:", error);
      setFormError(
        "We couldn't send your message right now. Please call us directly at (407) 887-9889 or email info@ironpinaerial.com."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const focusStyle = { borderColor: "#E8500F" };

  return (
    <Layout>
      {/* ── MINI HERO ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "6rem 0 5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "#141a1f",
        }}
      >
        {/* Background image. responsive WebP with JPG fallback */}
        <picture style={{ position: "absolute", inset: 0, display: "block" }}>
          <source media="(max-width: 768px)" srcSet="/assets/images/contact-bg-mobile_f59b5c69.webp" type="image/webp" />
          <source media="(max-width: 768px)" srcSet="/assets/images/contact-bg-mobile_f23652a3.jpg" type="image/jpeg" />
          <source srcSet="/assets/images/contact-bg-desktop_5aaf5370.webp" type="image/webp" />
          <img
            src="/assets/images/contact-bg-desktop_72badfeb.jpg"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
            }}
          />
        </picture>
        {/* Dark overlay. strong left for text legibility, lighter right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(20,26,31,0.92) 0%, rgba(20,26,31,0.80) 50%, rgba(20,26,31,0.50) 100%)",
          }}
        />
        {/* Bottom fade into contact section */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to top, rgba(30,37,43,1) 0%, transparent 100%)",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="section-label">Contact</div>
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
            Tell Us What You're Working With
          </h1>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section style={{ backgroundColor: "#1E252B", padding: "5rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "5rem",
              alignItems: "start",
            }}
          >
            {/* Left: contact info */}
            <FadeUp>
              <div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "#D6D9DC",
                    margin: "0 0 2.5rem",
                  }}
                >
                  Send the property and the problem. We'll respond within one business day.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D6D9DC", margin: "0 0 0.375rem", opacity: 0.6 }}>
                      Phone
                    </p>
                    <a
                      href="tel:+14078879889"
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: "1.5rem",
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
                  </div>

                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D6D9DC", margin: "0 0 0.375rem", opacity: 0.6 }}>
                      Email
                    </p>
                    <a
                      href="mailto:info@ironpinaerial.com"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "1rem",
                        color: "#D6D9DC",
                        textDecoration: "none",
                        transition: "color 150ms ease",
                      }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#E8500F"; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#D6D9DC"; }}
                    >
                      info@ironpinaerial.com
                    </a>
                  </div>

                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D6D9DC", margin: "0 0 0.375rem", opacity: 0.6 }}>
                      Service Area
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", color: "#D6D9DC", margin: 0 }}>
                      Based in Orlando. Serving all of Florida.
                    </p>
                  </div>
                </div>

                {/* Coverage note */}
                <div
                  style={{
                    marginTop: "2.5rem",
                    padding: "1.25rem 1.5rem",
                    backgroundColor: "#141a1f",
                    borderLeft: "2px solid rgba(232,80,15,0.4)",
                  }}
                >
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8125rem", color: "#D6D9DC", margin: 0, lineHeight: 1.65, opacity: 0.8 }}>
                    Based in Orlando and serving properties across Florida. Central Florida, the coasts, and everywhere between.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Right: Quote form */}
            <FadeUp delay={120}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Name */}
                <div>
                  <label htmlFor="name" style={labelStyle}>Name <span style={{ color: "#E8500F" }}>*</span></label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => { Object.assign(e.target.style, focusStyle); }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" style={labelStyle}>Email <span style={{ color: "#E8500F" }}>*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => { Object.assign(e.target.style, focusStyle); }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    placeholder="you@company.com"
                  />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" style={labelStyle}>Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => { Object.assign(e.target.style, focusStyle); }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    placeholder="Company or association name"
                  />
                </div>

                {/* Phone (optional) */}
                <div>
                  <label htmlFor="phone" style={labelStyle}>Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => { Object.assign(e.target.style, focusStyle); }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    placeholder="(407) 000-0000"
                  />
                </div>

                {/* Property Address (optional) */}
                <div>
                  <label htmlFor="propertyAddress" style={labelStyle}>Property Address</label>
                  <input
                    id="propertyAddress"
                    name="propertyAddress"
                    type="text"
                    value={formData.propertyAddress}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => { Object.assign(e.target.style, focusStyle); }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    placeholder="Street address or city"
                  />
                </div>

                {/* Honeypot. hidden from real users, bots fill it */}
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" } as React.CSSProperties} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Service Needed */}
                <div>
                  <label htmlFor="serviceNeeded" style={labelStyle}>Service Needed</label>
                  <select
                    id="serviceNeeded"
                    name="serviceNeeded"
                    value={formData.serviceNeeded}
                    onChange={handleChange}
                    style={{ ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23D6D9DC' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
                    onFocus={(e) => { Object.assign(e.target.style, focusStyle); }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                  >
                    <option value="" style={{ backgroundColor: "#141a1f" }}>Select service</option>
                    <option value="Inspections" style={{ backgroundColor: "#141a1f" }}>Inspections</option>
                    <option value="Mapping & 3D" style={{ backgroundColor: "#141a1f" }}>Mapping & 3D</option>
                    <option value="Progress Documentation" style={{ backgroundColor: "#141a1f" }}>Progress Documentation</option>
                    <option value="Photo & Video" style={{ backgroundColor: "#141a1f" }}>Photo & Video</option>
                    <option value="Post-Storm Condition Docs" style={{ backgroundColor: "#141a1f" }}>Post-Storm Condition Docs</option>
                    <option value="Not Sure Yet" style={{ backgroundColor: "#141a1f" }}>Not Sure Yet</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" style={labelStyle}>Message <span style={{ color: "#E8500F" }}>*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                    onFocus={(e) => { Object.assign(e.target.style, focusStyle); }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
                    placeholder="Tell us about the property and what you need..."
                  />
                </div>

                {/* Inline error message */}
                {formError && (
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      backgroundColor: "rgba(232,80,15,0.1)",
                      border: "1px solid rgba(232,80,15,0.4)",
                      borderRadius: "2px",
                    }}
                  >
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#E8500F", margin: "0 0 0.5rem", fontWeight: 600 }}>
                      Submission failed
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#D6D9DC", margin: 0, lineHeight: 1.6 }}>
                      {formError}
                    </p>
                    <a
                      href="tel:+14078879889"
                      style={{
                        display: "inline-block",
                        marginTop: "0.75rem",
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        color: "#FFFFFF",
                        textDecoration: "none",
                      }}
                    >
                      (407) 887-9889
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: "100%", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? "Sending..." : "Request a Quote"}
                </button>

                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#D6D9DC", margin: 0, opacity: 0.6, lineHeight: 1.6 }}>
                  We respond within one business day. No spam, no automated follow-ups.
                </p>
              </form>
            </FadeUp>
          </div>
        </div>
      </section>
    </Layout>
  );
}
