import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Prizes", href: "#prizes" },
  { label: "Tracks", href: "#tracks" },
  { label: "Why Us", href: "#why" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-hero/80 backdrop-blur-md border-b border-foreground/10">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#" className="text-hero-foreground font-heading font-bold text-xl tracking-tight">
          Tech<span className="text-primary">Assasin</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-hero-muted hover:text-hero-foreground transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#hero"
            className="bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Register Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-hero-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-hero border-t border-foreground/10 px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-hero-muted hover:text-hero-foreground transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#hero"
            className="block mt-2 bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold text-center hover:bg-primary/90 transition-colors"
          >
            Register Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
