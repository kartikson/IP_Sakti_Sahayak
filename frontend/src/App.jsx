import { RouterProvider, useLocation } from './context/RouterContext';
import { AuthProvider } from './auth';
import { ConsultationProvider } from './context/ConsultationContext';
import { AppShell } from './components/shell/AppShell';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AssistantPage } from './pages/AssistantPage';
import { ClassificationPage } from './pages/ClassificationPage';
import { SourcesPage } from './pages/SourcesPage';
import { NotFoundPage } from './pages/NotFoundPage';

function RouterOutlet() {
  const { pathname } = useLocation();

  // Normalize trailing slashes for routing
  const normalizedPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  switch (normalizedPath) {
    case '/':
      return (
        <AppShell showWorkspaceChrome={false}>
          <LandingPage />
        </AppShell>
      );
    case '/login':
      return (
        <AppShell showWorkspaceChrome={false}>
          <LoginPage />
        </AppShell>
      );
    case '/register':
      return (
        <AppShell showWorkspaceChrome={false}>
          <RegisterPage />
        </AppShell>
      );
    case '/assistant':
    case '/workspace':
      return (
        <AppShell>
          <AssistantPage />
        </AppShell>
      );
    case '/classification':
      return (
        <AppShell>
          <ClassificationPage />
        </AppShell>
      );
    case '/sources':
      return (
        <AppShell showWorkspaceChrome={false}>
          <SourcesPage />
        </AppShell>
      );
    default:
      return (
        <AppShell showWorkspaceChrome={false}>
          <NotFoundPage />
        </AppShell>
      );
  }
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <ConsultationProvider>
          <RouterOutlet />
        </ConsultationProvider>
      </AuthProvider>
    </RouterProvider>
  );
}


