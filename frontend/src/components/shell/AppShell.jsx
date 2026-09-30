import { Header } from './Header';
import { WorkspaceChrome } from './WorkspaceChrome';
import { Footer } from './Footer';
import { Link, useLocation } from '../../context/RouterContext';

export function AppShell({
  children,
  showWorkspaceChrome = undefined,
}) {
  const { pathname } = useLocation();

  // Normalize path
  const normalizedPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  const isHome = normalizedPath === '/';

  // Map route to breadcrumb title
  const getBreadcrumbLabel = (path) => {
    switch (path) {
      case '/assistant':
      case '/workspace':
        return 'Consultation';
      case '/classification':
        return 'Classification';
      case '/sources':
        return 'Sources';
      case '/login':
        return 'Login';
      case '/register':
        return 'Register';
      default:
        return 'Page';
    }
  };

  // Only workspace routes show the workspace chrome; public pages render nothing in the reserved slot
  const isWorkspaceRoute = ['/assistant', '/workspace', '/classification'].includes(normalizedPath);
  const shouldShowChrome = showWorkspaceChrome !== undefined ? showWorkspaceChrome : isWorkspaceRoute;

  return (
    <div className="app-layout">
      {/* 1-3: Utility bar, Main Header, Primary Nav */}
      <Header />

      {/* 4. Breadcrumb row below nav on all inner pages (Home > Page) */}
      {!isHome && (
        <div className="gov-breadcrumb-row" aria-label="Breadcrumb Navigation">
          <div className="ui-container ui-container--xl">
            <ol className="gov-breadcrumbs">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="gov-breadcrumbs__sep" aria-hidden="true">&gt;</li>
              <li className="gov-breadcrumbs__current" aria-current="page">
                {getBreadcrumbLabel(normalizedPath)}
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* 5. Reserved slot in shell (under breadcrumb) for persistent Jurisdiction chip & step indicator */}
      <div className="gov-shell-slot">
        {shouldShowChrome ? (
          <WorkspaceChrome />
        ) : null}
      </div>

      {/* 6. Main Content */}
      <main className="app-main" id="main-content">
        {children}
      </main>

      {/* 7. Institutional Footer */}
      <Footer />
    </div>
  );
}
