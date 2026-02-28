import { Link } from '@tanstack/react-router';
import { Heart, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = typeof window !== 'undefined' ? encodeURIComponent(window.location.hostname) : 'vivah-connect';

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-400">
                <img src="/assets/generated/logo.dim_256x256.png" alt="Vivah Connect" className="w-full h-full object-cover" />
              </div>
              <span className="font-serif text-xl font-bold text-gold-400">Vivah Connect</span>
            </div>
            <p className="font-body text-sm opacity-75 mb-4 max-w-xs">
              A trusted, privacy-first matrimonial platform connecting hearts with tradition, trust, and technology.
            </p>
            <div className="flex items-center gap-2 text-gold-400">
              <Phone className="w-4 h-4" />
              <a href="tel:6370081492" className="font-body text-sm hover:text-gold-300 transition-colors">
                6370081492 (Mediator)
              </a>
            </div>
            <div className="flex items-center gap-2 text-gold-400 mt-2">
              <Mail className="w-4 h-4" />
              <span className="font-body text-sm opacity-75">panigrahianita729@gmail.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/register', label: 'Register Free' },
                { to: '/services', label: 'Services & Charges' },
                { to: '/dashboard', label: 'My Dashboard' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="font-body text-sm opacity-75 hover:opacity-100 hover:text-gold-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-base font-semibold text-gold-400 mb-4">Our Services</h4>
            <ul className="space-y-2 font-body text-sm opacity-75">
              <li>View Phone Number — ₹250</li>
              <li>Home Visit — ₹550</li>
              <li>Rishta Finalization — ₹1,000</li>
              <li>After Ring Ceremony — ₹15,000</li>
              <li>After Marriage — ₹15,000</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs opacity-60">
            © {year} Vivah Connect. All rights reserved. All payments are non-refundable.
          </p>
          <p className="font-body text-xs opacity-60 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
