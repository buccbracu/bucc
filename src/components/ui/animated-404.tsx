"use client";

import Link from "next/link";
import "./animated-404.css";

interface Animated404Props {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  homeButtonText?: string;
}

export default function Animated404({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or hasn't been implemented yet.",
  showHomeButton = true,
  homeButtonText = "Go Back Home",
}: Animated404Props) {
  return (
    <div className="animated-404-container">
      <div className="rail-404">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="stamp-404"
            style={{ animationDelay: `${-2000 * (i + 1)}ms` }}
          >
            {i % 2 === 0 ? "4" : "0"}
          </div>
        ))}
      </div>

      <div className="world-404">
        <div className="forward-404">
          <div className="box-404">
            <div className="wall-404"></div>
            <div className="wall-404"></div>
            <div className="wall-404"></div>
            <div className="wall-404"></div>
            <div className="wall-404"></div>
            <div className="wall-404"></div>
          </div>
        </div>
      </div>

      <div className="content-overlay-404">
        <h1 className="error-title-404">{title}</h1>
        <p className="error-message-404">{message}</p>
        {showHomeButton && (
          <Link href="/" className="home-button-404">
            {homeButtonText}
          </Link>
        )}
      </div>
    </div>
  );
}
