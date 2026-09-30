import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RouterContext = createContext(null);

export function RouterProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return (window.location.pathname || '/') + (window.location.search || '') + (window.location.hash || '');
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath((window.location.pathname || '/') + (window.location.search || '') + (window.location.hash || ''));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (typeof window === 'undefined') return;
    
    if (replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }
    setCurrentPath(to);
    window.scrollTo(0, 0);
  }, []);

  const value = {
    currentPath,
    navigate,
  };

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocation() {
  const { currentPath } = useRouter();
  const [pathnameAndQuery, hashPart = ''] = currentPath.split('#');
  const [rawPath = '/', queryPart = ''] = pathnameAndQuery.split('?');
  const search = queryPart ? `?${queryPart}` : '';
  const searchParams = new URLSearchParams(search);
  const hash = hashPart ? `#${hashPart}` : '';

  return {
    pathname: rawPath || '/',
    search,
    searchParams,
    hash,
    fullPath: currentPath,
  };
}

export function Link({ to, children, className = '', activeClassName = '', onClick, ...rest }) {
  const { currentPath, navigate } = useRouter();
  const isActive = currentPath === to;

  const handleClick = (e) => {
    if (onClick) onClick(e);

    // Allow default browser behavior for modifier keys (new tab, new window, etc.)
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      if (!isActive) {
        navigate(to);
      }
    }
  };

  const combinedClass = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a
      href={to}
      onClick={handleClick}
      className={combinedClass}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
