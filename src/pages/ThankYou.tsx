/**
 * IronPin Aerial — Thank You Page (unlinked, /thank-you)
 * Shown after form submission
 */
import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function ThankYou() {
  return (
    <Layout>
      <section
        style={{
          backgroundColor: "#1E252B",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          padding: "5rem 0",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "560px" }}>
            {/* Orange checkmark icon */}
            <div style={{ marginBottom: "2rem" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" stroke="#E8500F" strokeWidth="2" fill="none"/>
                <path d="M14 24l7 7 13-14" stroke="#E8500F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="section-label" style={{ marginBottom: "1.5rem" }}>Received</div>

            <h1
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                margin: "0 0 1.25rem",
              }}
            >
              Thanks — We're On It
            </h1>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "#D6D9DC",
                margin: "0 0 0.75rem",
              }}
            >
              We'll respond within one business day.
            </p>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "#D6D9DC",
                margin: "0 0 2.5rem",
              }}
            >
              If it's time-sensitive, call{" "}
              <a
                href="tel:+14078879889"
                style={{
                  color: "#E8500F",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "opacity 150ms ease",
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "0.8"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
              >
                (407) 887-9889
              </a>
              .
            </p>

            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
