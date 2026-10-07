import { useEffect, useState } from "react";
import { X } from "lucide-react";

const BG_URL =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85";

const PORTRAIT_URL = "/landing/assets/haris-portrait.jpg";

const NAV = ["Story", "Work", "Message"] as const;
const SOCIAL = ["Instagram", "LinkedIn", "AutoAny"] as const;

const SITE_NAV = [
  { label: "Index", href: "/landing/index.html" },
  { label: "About", href: "/landing/about/index.html" },
  { label: "Works", href: "/landing/works/index.html" },
  { label: "Team", href: "/landing/team/index.html" },
  { label: "Archive", href: "/landing/archive/index.html" },
  { label: "Contact", href: "/landing/contact/index.html" },
] as const;

const EASE_DRAWER = "cubic-bezier(0.76, 0, 0.24, 1)";

export function MarcusPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Haris — Wassan";
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-black font-hn text-cream">
      {/* BG image */}
      <img
        src={BG_URL}
        alt=""
        className="anim-fade-in absolute inset-0 h-full w-full object-cover"
      />

      {/* Marquee */}
      <div
        className="anim-fade-up absolute inset-x-0 top-[16vh] z-10 overflow-hidden sm:top-[14vh]"
        style={{ animationDelay: "500ms" }}
      >
        <div className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] leading-none text-cream sm:text-[26vh]">
          <span className="pr-[6vw]">Haris&nbsp;&mdash;&nbsp;Wassan&nbsp;</span>
          <span className="pr-[6vw]">Haris&nbsp;&mdash;&nbsp;Wassan&nbsp;</span>
        </div>
      </div>

      {/* Cream rule */}
      <div className="anim-line absolute inset-x-6 bottom-[5.5rem] z-10 h-0.5 bg-cream sm:inset-x-10 sm:bottom-28" />

      {/* Desktop footer */}
      <footer className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-5 font-hn text-xs leading-relaxed sm:z-10 sm:px-10 sm:pb-8 sm:text-sm">
        <div className="anim-fade-up" style={{ animationDelay: "1400ms" }}>
          <p>AI Consultant</p>
          <p>Co-Founder @ AutoAny</p>
          <p>Production AI Systems</p>
        </div>
        <div
          className="anim-fade-up text-right"
          style={{ animationDelay: "1550ms" }}
        >
          <p>A homage to</p>
          <p>Haris Wassan</p>
        </div>
      </footer>

      {/* Front portrait — original photo, face/hair preserved */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
        <img
          src={`${PORTRAIT_URL}?v=4`}
          alt="Haris Wassan"
          className="anim-rise-in max-h-[100dvh] w-auto max-w-[min(100vw,560px)] select-none object-contain sm:max-w-[min(48vw,520px)]"
        />
      </div>

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <a
          href="#"
          className="anim-fade-up font-hn text-lg tracking-wide text-cream"
          style={{ animationDelay: "800ms" }}
        >
          Haris
        </a>

        <div className="hidden items-start gap-16 sm:flex lg:gap-24">
          <span
            className="anim-fade-up text-sm text-cream"
            style={{ animationDelay: "900ms" }}
          >
            2025
          </span>
          <nav className="flex flex-col gap-0.5 text-sm">
            {NAV.map((label, i) => (
              <a
                key={label}
                href="#"
                className="anim-fade-up text-cream transition-opacity duration-300 hover:opacity-60"
                style={{ animationDelay: `${1000 + i * 80}ms` }}
              >
                {label}
              </a>
            ))}
          </nav>
          <nav className="flex flex-col gap-0.5 text-sm">
            {SOCIAL.map((label, i) => (
              <a
                key={label}
                href="#"
                className="anim-fade-up text-cream transition-opacity duration-300 hover:opacity-60"
                style={{ animationDelay: `${1150 + i * 80}ms` }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Hamburger / close control */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="anim-fade-up relative z-50 flex h-10 w-10 items-center justify-center sm:hidden"
          style={{ animationDelay: "900ms" }}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="relative h-4 w-6">
            <span
              className="absolute left-0 top-0 block h-[1.5px] w-6 bg-cream transition-transform duration-500"
              style={{
                transitionTimingFunction: EASE_DRAWER,
                transform: menuOpen
                  ? "translateY(7.25px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              className="absolute left-0 top-1/2 block h-[1.5px] w-6 -translate-y-1/2 bg-cream transition-opacity duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="absolute bottom-0 left-0 block h-[1.5px] w-6 bg-cream transition-transform duration-500"
              style={{
                transitionTimingFunction: EASE_DRAWER,
                transform: menuOpen
                  ? "translateY(-7.25px) rotate(-45deg)"
                  : "none",
              }}
            />
          </span>
        </button>
      </header>

      {/* Mobile drawer */}
      <div className="sm:hidden" aria-hidden={!menuOpen}>
        <button
          type="button"
          aria-label="Close menu backdrop"
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          className={`fixed inset-y-0 right-0 z-40 flex w-[80%] max-w-sm flex-col bg-[#141414] px-8 py-10 transition-transform duration-[600ms] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ transitionTimingFunction: EASE_DRAWER }}
        >
          <button
            type="button"
            aria-label="Close menu"
            className="absolute right-6 top-6 text-cream transition-[opacity,transform] duration-300"
            style={{
              transitionDelay: menuOpen ? "300ms" : "0ms",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "rotate(0deg)" : "rotate(90deg)",
            }}
            onClick={() => setMenuOpen(false)}
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          <div className="mt-10 flex flex-col gap-10">
            <div>
              <p
                className="mb-6 text-xs uppercase tracking-[0.2em] text-cream/50 transition-[opacity,transform] duration-500"
                style={{
                  transitionDelay: menuOpen ? "250ms" : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(12px)",
                }}
              >
                Site Index
              </p>
              <nav className="flex flex-col gap-2">
                {NAV.map((label, i) => (
                  <a
                    key={label}
                    href="#"
                    className="text-4xl text-cream transition-[opacity,transform] duration-500"
                    style={{
                      transitionDelay: menuOpen ? `${300 + i * 80}ms` : "0ms",
                      opacity: menuOpen ? 1 : 0,
                      transform: menuOpen
                        ? "translateY(0)"
                        : "translateY(1.5rem)",
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <p
                className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/50 transition-[opacity,transform] duration-500"
                style={{
                  transitionDelay: menuOpen ? "500ms" : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(12px)",
                }}
              >
                Find Me
              </p>
              <nav className="flex flex-wrap gap-x-5 gap-y-2">
                {SOCIAL.map((label, i) => (
                  <a
                    key={label}
                    href="#"
                    className="text-sm text-cream transition-[opacity,transform] duration-500"
                    style={{
                      transitionDelay: menuOpen ? `${550 + i * 60}ms` : "0ms",
                      opacity: menuOpen ? 1 : 0,
                      transform: menuOpen
                        ? "translateY(0)"
                        : "translateY(1rem)",
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>
      </div>

      {/* Page Transitions/8 site nav — keep Index / About / … */}
      <nav
        className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-5 rounded-[2em] bg-[#72706c]/95 px-6 py-3 sm:gap-6 sm:px-8"
        aria-label="Site"
      >
        {SITE_NAV.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="font-hn text-[11px] text-white/85 transition-colors duration-200 hover:text-white sm:text-xs"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </section>
  );
}
