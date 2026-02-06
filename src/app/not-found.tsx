import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAF7F2",
            padding: "1.5rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "28rem" }}>
            <h1
              style={{
                fontSize: "4.5rem",
                fontWeight: 300,
                color: "#A0845C",
                marginBottom: "1rem",
                lineHeight: 1,
              }}
            >
              404
            </h1>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 300,
                color: "#2C1810",
                marginBottom: "1rem",
              }}
            >
              Page not found
            </h2>
            <p
              style={{
                color: "#6B5E54",
                fontWeight: 300,
                marginBottom: "2.5rem",
              }}
            >
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.875rem 2rem",
                fontSize: "0.875rem",
                fontWeight: 300,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                backgroundColor: "#A0845C",
                color: "#FAF7F2",
                border: "1px solid #A0845C",
                textDecoration: "none",
              }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
