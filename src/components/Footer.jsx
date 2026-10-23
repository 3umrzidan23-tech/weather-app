import { useState } from "react";
import { NAV_ITEMS } from "../utils/constants";

const SOCIAL_LINKS = [
  { icon: "fa-facebook-f", label: "Facebook", href: "https://facebook.com" },
  { icon: "fa-x-twitter", label: "X (Twitter)", href: "https://x.com" },
  { icon: "fa-instagram", label: "Instagram", href: "https://instagram.com" },
  { icon: "fa-github", label: "GitHub", href: "https://github.com" },
];

export default function Footer({ onSubscribe }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!valid) {
      setError("Enter a valid email address, e.g. you@example.com.");
      return;
    }

    setError("");
    onSubscribe(trimmed);
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#home">
              <img src="/logo.png" alt="" width="42" height="42" />
              <span>
                Weather<span className="brand__dot">.</span>
              </span>
            </a>
            <p>
              Live weather intelligence for the moments that matter — from your
              morning commute to the weekend ahead.
            </p>
            <div className="footer-social">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                >
                  <i
                    className={`fa-brands ${social.icon}`}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            <h3>Explore</h3>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-newsletter">
            <h3>Weather in your inbox</h3>
            <p>A short daily forecast digest. No spam, unsubscribe anytime.</p>
            <form onSubmit={handleSubmit} noValidate>
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <div className="newsletter-row">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error ? "newsletter-error" : "newsletter-hint"
                  }
                />
                <button type="submit" className="btn-accent">
                  Subscribe
                </button>
              </div>
              {error ? (
                <p id="newsletter-error" className="form-error" role="alert">
                  {error}
                </p>
              ) : (
                <p id="newsletter-hint" className="form-hint">
                  Demo form — no email is stored.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Weather. All rights reserved.</p>
          <p>
            Data by{" "}
            <a
              href="https://www.weatherapi.com/"
              target="_blank"
              rel="noreferrer"
            >
              WeatherAPI.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
