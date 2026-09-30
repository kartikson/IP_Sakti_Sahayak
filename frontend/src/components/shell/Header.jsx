import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from '../../context/RouterContext';
import { useAuth } from '../../auth';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fontSizeStep, setFontSizeStep] = useState('normal'); // 'small' (14px), 'normal' (16px), 'large' (18px)
  const [language, setLanguage] = useState('en');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleSignOut = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Consultation', to: '/assistant' },
    { label: 'Classification', to: '/classification' },
    { label: 'Sources', to: '/sources' },
    isAuthenticated
      ? { label: 'Sign out', to: '/', onClick: handleSignOut }
      : { label: 'Login', to: '/login' },
  ];

  // Apply root font-size when text size control is clicked
  useEffect(() => {
    const root = document.documentElement;
    if (fontSizeStep === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSizeStep === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSizeStep]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="gov-header-wrapper" role="banner">
      {/* 1. Utility Top Bar */}
      <div className="gov-utility-bar">
        <div className="ui-container ui-container--xl">
          <div className="gov-utility-bar__inner">
            <div className="gov-utility-bar__left">
              {/* Skip to Main Content (Visible on Focus) */}
              <a href="#main-content" className="gov-skip-link">
                Skip to main content
              </a>
              <span className="gov-utility-bar__disclaimer">
                Prototype developed for Smart India Hackathon 2026. Not an official government website.
              </span>
            </div>

            <div className="gov-utility-bar__right">
              {/* Text Size Controls: A-  A  A+ */}
              <div className="gov-text-resizer" role="group" aria-label="Text size controls">
                <button
                  type="button"
                  className={`gov-text-resizer__btn ${fontSizeStep === 'small' ? 'gov-text-resizer__btn--active' : ''}`}
                  onClick={() => setFontSizeStep('small')}
                  title="Decrease text size"
                  aria-label="Decrease text size"
                  aria-pressed={fontSizeStep === 'small'}
                >
                  A-
                </button>
                <button
                  type="button"
                  className={`gov-text-resizer__btn ${fontSizeStep === 'normal' ? 'gov-text-resizer__btn--active' : ''}`}
                  onClick={() => setFontSizeStep('normal')}
                  title="Default text size"
                  aria-label="Default text size"
                  aria-pressed={fontSizeStep === 'normal'}
                >
                  A
                </button>
                <button
                  type="button"
                  className={`gov-text-resizer__btn ${fontSizeStep === 'large' ? 'gov-text-resizer__btn--active' : ''}`}
                  onClick={() => setFontSizeStep('large')}
                  title="Increase text size"
                  aria-label="Increase text size"
                  aria-pressed={fontSizeStep === 'large'}
                >
                  A+
                </button>
              </div>

              {/* Language Selector */}
              <label htmlFor="portal-lang-select" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
                Select Language
              </label>
              <select
                id="portal-lang-select"
                className="gov-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select portal language"
              >
                <option value="en">English</option>
                <option value="hi" disabled title="Coming soon">
                  हिन्दी (Hindi) — Coming soon
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header (White, left wordmark with plain square "IP" mark, 3px #B08D57 bottom rule) */}
      <div className="gov-header">
        <div className="ui-container ui-container--xl">
          <div className="gov-header__inner">
            <Link to="/" className="gov-brand" onClick={closeMobileMenu}>
              <div className="gov-brand__mark" aria-hidden="true">
                IP
              </div>
              <div className="gov-brand__text">
                <span className="gov-brand__title">IP-SAKTI Sahayak</span>
                <span className="gov-brand__tagline">
                  Intellectual Property &amp; Regulatory Guidance for Ayurveda
                </span>
              </div>
            </Link>

            <div className="gov-header__right">
              <span className="gov-header__prototype-tag">
                SIH 2026 Innovation Prototype
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary Navigation Bar (Solid #1F3D2B, white text, 3px #B08D57 active underline) */}
      <nav className="gov-nav-bar" aria-label="Primary Navigation">
        <div className="ui-container ui-container--xl">
          <div className="gov-nav-bar__inner">
            <ul className="gov-nav">
              {navLinks.map((link) => {
                const isActive = pathname === link.to && link.label !== 'Sign out';
                return (
                  <li key={link.label} className="gov-nav__item">
                    <Link
                      to={link.to}
                      onClick={link.onClick}
                      className={`gov-nav__link ${isActive ? 'gov-nav__link--active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Toggle Button */}
            <button
              type="button"
              className="gov-nav-toggle"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? 'Close Menu' : 'Menu'}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="gov-mobile-menu gov-mobile-menu--open">
            {navLinks.map((link) => {
              const isActive = pathname === link.to && link.label !== 'Sign out';
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    closeMobileMenu();
                  }}
                  className={`gov-mobile-menu__link ${isActive ? 'gov-mobile-menu__link--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
