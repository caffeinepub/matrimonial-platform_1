import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ServicesPage from './pages/ServicesPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Wrapper for RegisterPage since it requires props but TanStack Router passes none
function RegisterPageWrapper() {
  const [done, setDone] = useState(false);

  if (done) {
    // Navigate to dashboard after successful registration
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <RegisterPage
      onSuccess={() => setDone(true)}
      onLoginClick={() => { window.location.href = '/dashboard'; }}
    />
  );
}

// Root layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPageWrapper,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  dashboardRoute,
  adminRoute,
  servicesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
