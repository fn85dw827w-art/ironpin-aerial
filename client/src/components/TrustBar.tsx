const TRUST_ITEMS = [
  "FAA Part 107",
  "OSHA 30 Construction",
  "$1M Aviation Liability",
  "Network RTK Mapping",
  "Enterprise Mapping Aircraft",
  "Private Client Delivery Portal",
];

export default function TrustBar() {
  return (
    <div style={{ backgroundColor: "#0e1318", padding: "1rem clamp(1.5rem, 5vw, 5rem)" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          rowGap: "0.5rem",
        }}
      >
        {TRUST_ITEMS.map((item, i) => (
          <span key={item} style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#D6D9DC",
              }}
            >
              {item}
            </span>
            {i < TRUST_ITEMS.length - 1 && (
              <span style={{ color: "#E8500F", margin: "0 0.875rem", fontSize: "0.7rem" }}>
                •
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
