import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useCurrentProfile, useIsCurrentUserAdmin, useLogout } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, LayoutDashboard, Shield, Heart } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: userProfile } = useCurrentProfile();
  const { data: isAdmin } = useIsCurrentUserAdmin();
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useLogout();

  const isAuthenticated = !!userProfile;

  const handleLogout = async () => {
    await logout.mutateAsync();
    queryClient.clear();
    router.navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b-2 border-primary/30 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 shadow-sm">
            <img
              src="/assets/generated/logo.dim_256x256.png"
              alt="Vivah Connect"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-serif text-xl font-bold text-primary tracking-wide">Vivah Connect</span>
            <p className="text-xs text-muted-foreground hidden sm:block">Trusted Matrimonial Service</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/services" className="text-sm text-foreground hover:text-primary transition-colors">
            Services &amp; Charges
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-sm text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm text-foreground hover:text-primary transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary/30">
                  <User className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{userProfile?.fullName || 'Account'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.navigate({ to: '/dashboard' })}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.navigate({ to: '/admin' })}>
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild className="border-primary/30 text-primary">
                <Link to="/dashboard">Login</Link>
              </Button>
              <Button asChild className="btn-matrimonial">
                <Link to="/register">Register Free</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm text-foreground hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link to="/services" className="block text-sm text-foreground hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
            Services &amp; Charges
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="block text-sm text-foreground hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="block text-sm text-foreground hover:text-primary py-2" onClick={() => setMobileOpen(false)}>
              Admin Panel
            </Link>
          )}
          <div className="pt-2 border-t border-border">
            {isAuthenticated ? (
              <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="w-full btn-matrimonial">
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Register Free</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
