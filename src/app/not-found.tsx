import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="rail">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="stamp" style={{ animationDelay: `${-2000 * (i + 1)}ms` }}>
            {i % 2 === 0 ? "4" : "0"}
          </div>
        ))}
      </div>

      <div className="world">
        <div className="forward">
          <div className="box">
            <div className="wall"></div>
            <div className="wall"></div>
            <div className="wall"></div>
            <div className="wall"></div>
            <div className="wall"></div>
            <div className="wall"></div>
          </div>
        </div>
      </div>

      <div className="content-overlay">
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been implemented yet.
        </p>
        <Link href="/" className="home-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
