import { useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { NAV_ITEMS } from "../utils/constants";

export default function Navbar() {
  const { unit, setUnit } = useSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      const marker = window.scrollY + 140;
      let current = "home";

      NAV_ITEMS.forEach((item) => {
        const section = document.getElementById(item.id);
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) current = item.id;
      });

      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeOnResize = () => setOpen(false);
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container">
        <div className="nav-inner">
          <a className="brand" href="#home" onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="" width="42" height="42" />
            <span>
              Weather<span className="brand__dot">.</span>
            </span>
          </a>

          <nav
            id="main-menu"
            className={`nav-menu ${open ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            <ul className="nav-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={active === item.id ? "is-active" : ""}
                    aria-current={active === item.id ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-actions">
            <div
              className="unit-toggle"
              role="group"
              aria-label="Temperature units"
            >
              <button
                type="button"
                className={unit === "c" ? "is-active" : ""}
                aria-pressed={unit === "c"}
                onClick={() => setUnit("c")}
              >
                °C
              </button>
              <button
                type="button"
                className={unit === "f" ? "is-active" : ""}
                aria-pressed={unit === "f"}
                onClick={() => setUnit("f")}
              >
                °F
              </button>
            </div>

            <button
              type="button"
              className="nav-toggle"
              aria-expanded={open}
              aria-controls="main-menu"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setOpen((current) => !current)}
            >
              <i
                className={`fa-solid ${open ? "fa-xmark" : "fa-bars"}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
