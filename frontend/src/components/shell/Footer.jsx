import { Link } from '../../context/RouterContext';

export function Footer() {
  const LAST_UPDATED = '29 September 2026';

  return (
    <footer className="gov-footer" role="contentinfo">
      <div className="ui-container ui-container--xl">
        {/* Four Plain Institutional Columns */}
        <div className="gov-footer__grid">
          {/* Column 1: About the Prototype */}
          <div>
            <div className="gov-footer__column-title">About the Prototype</div>
            <ul className="gov-footer__links">
              <li>
                <Link to="/sources" className="gov-footer__link">
                  System Overview
                </Link>
              </li>
              <li>
                <Link to="/classification" className="gov-footer__link">
                  Classification Framework
                </Link>
              </li>
              <li>
                <a href="#disclaimer" className="gov-footer__link">
                  SIH 2026 Evaluation Scope
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Sources & Repositories */}
          <div>
            <div className="gov-footer__column-title">Sources &amp; Authority</div>
            <ul className="gov-footer__links">
              <li>
                <Link to="/sources" className="gov-footer__link">
                  Statutory Sources
                </Link>
              </li>
              <li>
                <Link to="/sources" className="gov-footer__link">
                  Traditional Knowledge References
                </Link>
              </li>
              <li>
                <Link to="/sources" className="gov-footer__link">
                  Regulatory Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Accessibility Statement */}
          <div id="accessibility">
            <div className="gov-footer__column-title">Accessibility Statement</div>
            <ul className="gov-footer__links">
              <li>
                <a href="#main-content" className="gov-footer__link">
                  Keyboard Navigation Support
                </a>
              </li>
              <li>
                <a href="#main-content" className="gov-footer__link">
                  Visible Focus Indicators
                </a>
              </li>
              <li>
                <a href="#main-content" className="gov-footer__link">
                  Text Resizing (A- / A / A+)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Disclaimer & Non-Affiliation */}
          <div id="disclaimer">
            <div className="gov-footer__column-title">Disclaimer</div>
            <ul className="gov-footer__links">
              <li>
                <a href="#disclaimer" className="gov-footer__link">
                  Non-Affiliation Notice
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="gov-footer__link">
                  Assistive Pre-Filing Advice Only
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="gov-footer__link">
                  No Legal Guarantee
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Institutional Bar */}
        <div className="gov-footer__bottom">
          <div className="gov-footer__statement">
            Prototype developed for Smart India Hackathon 2026. Not an official government website.
          </div>
          <div className="gov-footer__meta">
            <span>
              Disclaimer: IP-SAKTI Sahayak is an assistive research prototype for patent screening and regulatory classification. Outputs do not constitute formal legal advice or substitute for official searches by registered patent agents.
            </span>
            <span>
              Last updated: {LAST_UPDATED}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
