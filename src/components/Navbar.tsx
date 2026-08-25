import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Logo } from './Logo';
import { SERVER_CONFIG } from '../config/server';
import { useRouter } from '../hooks/useRouter';
import { supabase } from '../lib/supabase';
import {
  Menu,
  X,
  Disc as DiscordIcon,
  Play,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  LogIn,
  User,
  LogOut,
  Star,
  TerminalSquare,
  Image as ImageIcon,
  Users,
  FileText,
  Info,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenPlayModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPlayModal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [minecraftUsername, setMinecraftUsername] = useState('');

  const { path, navigate } = useRouter();

  // =========================
  // Load Profile
  // =========================

  const loadProfile = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setIsLoggedIn(false);
      setUsername('');
      setMinecraftUsername('');
      return;
    }

    setIsLoggedIn(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('username, minecraft_username')
      .eq('id', session.user.id)
      .single();

    if (!error && data) {
      setUsername(data.username ?? '');
      setMinecraftUsername(data.minecraft_username ?? '');
    } else {
      setUsername('');
      setMinecraftUsername('');
    }
  }, []);

  // =========================
  // Scroll
  // =========================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // =========================
  // Auth State
  // =========================

  useEffect(() => {
    let mounted = true;

    const loadAuthState = async () => {
      await loadProfile();

      if (!mounted) return;
    };

    loadAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        await loadProfile();
      } else {
        setIsLoggedIn(false);
        setUsername('');
        setMinecraftUsername('');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // =========================
  // Refresh profile when route changes
  // =========================

  useEffect(() => {
    if (isLoggedIn) {
      loadProfile();
    }
  }, [path, isLoggedIn, loadProfile]);

  // =========================
  // Listen for profile updates
  // =========================

  useEffect(() => {
    const handleProfileUpdate = () => {
      loadProfile();
    };

    window.addEventListener(
      'butterfly-profile-updated',
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        'butterfly-profile-updated',
        handleProfileUpdate
      );
    };
  }, [loadProfile]);

  // =========================
  // Close mobile menu
  // =========================

  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    setMobileMoreOpen(false);
  }, [path]);

  // =========================
  // Minecraft Head URL
  // =========================

  const getMinecraftHead = (name: string) => {
    if (!name) return '';

    return `https://mc-heads.net/avatar/${encodeURIComponent(
      name
    )}/64`;
  };

  const minecraftHeadUrl = getMinecraftHead(minecraftUsername);

  // =========================
  // Navigation
  // =========================

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Games', href: '/games' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
  ];

  // "More" dropdown links — important secondary pages grouped together
  const moreLinks = [
    { label: 'Features', href: '/#features', icon: Star },
    { label: 'Commands', href: '/commands', icon: TerminalSquare },
    { label: 'Gallery', href: '/gallery', icon: ImageIcon },
    { label: 'Staff', href: '/staff', icon: Users },
    { label: 'Rules', href: '/rules', icon: FileText },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: Mail },
  ];

  const handleNavClick = (
    href: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    setMobileMoreOpen(false);

    if (href.startsWith('/#')) {
      if (path !== '/') {
        navigate('/');

        setTimeout(() => {
          const target = document.querySelector(
            href.replace('/', '')
          );

          target?.scrollIntoView({
            behavior: 'smooth',
          });
        }, 150);
      } else {
        const target = document.querySelector(
          href.replace('/', '')
        );

        target?.scrollIntoView({
          behavior: 'smooth',
        });
      }

      return;
    }

    navigate(href);
  };

  const isActive = (href: string) => {
    if (href === '/') return path === '/';

    if (href.startsWith('/#')) return false;

    return path.startsWith(href);
  };

  const isMoreActive = moreLinks.some((link) => isActive(link.href));

  // =========================
  // Close "More" dropdown on outside click
  // =========================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =========================
  // Login
  // =========================

  const handleLogin = () => {
    setMobileMenuOpen(false);
    navigate('/login');
  };

  // =========================
  // Profile
  // =========================

  const handleProfile = () => {
    setMobileMenuOpen(false);
    navigate('/profile');
  };

  // =========================
  // Logout
  // =========================

  const handleLogout = async () => {
    setMobileMenuOpen(false);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return;
    }

    setIsLoggedIn(false);
    setUsername('');
    setMinecraftUsername('');

    navigate('/');
  };

  // =========================
  // Minecraft Head Component
  // =========================

  const MinecraftHead = ({
    size = 'sm',
  }: {
    size?: 'sm' | 'md';
  }) => {
    if (!minecraftUsername) {
      return (
        <User
          className={
            size === 'md'
              ? 'w-5 h-5 text-purple-400'
              : 'w-4 h-4 text-purple-400'
          }
        />
      );
    }

    return (
      <img
        src={minecraftHeadUrl}
        alt={`${minecraftUsername} Minecraft head`}
        className={
          size === 'md'
            ? 'w-8 h-8 rounded-md object-cover pixelated border border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
            : 'w-5 h-5 rounded-[4px] object-cover pixelated border border-purple-400/30'
        }
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-purple-500/15 py-3 shadow-lg shadow-black/40'
            : 'bg-transparent py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => handleNavClick('/', e)}
            className="focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-xl"
            aria-label="Butterfly Network Home"
          >
            <Logo size="md" showText={false} />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.07] backdrop-blur-md px-3">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) =>
                    handleNavClick(link.href, e)
                  }
                  className={`relative px-4 py-2 text-sm font-medium transition-all rounded-full ${
                    active
                      ? 'text-white font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  aria-current={
                    active ? 'page' : undefined
                  }
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-violet-600/60 rounded-full border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)] -z-10"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {link.label}
                </a>
              );
            })}

            {/* More Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all rounded-full ${
                  isMoreActive || moreMenuOpen
                    ? 'text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                aria-haspopup="true"
                aria-expanded={moreMenuOpen}
              >
                {isMoreActive && !moreMenuOpen && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-violet-600/60 rounded-full border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)] -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    moreMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl bg-[#0b0b10]/98 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 p-2 z-50"
                  >
                    {moreLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.href);

                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={(e) => handleNavClick(link.href, e)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            active
                              ? 'bg-purple-600/20 text-purple-200'
                              : 'text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                          <span>{link.label}</span>
                        </a>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">

            {/* Auth Button */}
            {!isLoggedIn ? (
              <button
                onClick={handleLogin}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-400/40 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-purple-400" />
                <span>Login</span>
              </button>
            ) : (
              <>
                {/* Profile */}
                <button
                  onClick={handleProfile}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-200 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 hover:border-purple-400/60 rounded-xl transition-all active:scale-95 cursor-pointer"
                >

                  {/* Minecraft Head */}
                  <MinecraftHead size="sm" />

                  <span>
                    {username
                      ? `@${username}`
                      : 'Profile'}
                  </span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-300 bg-white/[0.03] hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl transition-all active:scale-95 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Discord */}
            <a
              href={SERVER_CONFIG.discordUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-200 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 hover:border-purple-400/60 rounded-xl transition-all shadow-sm active:scale-95"
              aria-label="Join Butterfly Network Discord"
            >
              <DiscordIcon className="w-4 h-4 text-purple-400" />
              <span>Discord</span>
            </a>

            {/* Play Now */}
            <button
              onClick={onOpenPlayModal}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 rounded-xl transition-all shadow-lg shadow-purple-950/50 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play Now</span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">

            {/* Mobile Minecraft Head */}
            {isLoggedIn && minecraftUsername && (
              <button
                onClick={handleProfile}
                className="flex items-center justify-center"
                title={`Minecraft: ${minecraftUsername}`}
              >
                <MinecraftHead size="md" />
              </button>
            )}

            <button
              onClick={onOpenPlayModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm"
              aria-label="Play Now"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Play</span>
            </button>

            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label={
                mobileMenuOpen
                  ? 'Close Navigation Menu'
                  : 'Open Navigation Menu'
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] z-30 md:hidden bg-[#050505]/98 backdrop-blur-2xl border-b border-purple-500/20 shadow-2xl p-6 space-y-5"
          >

            {/* Navigation */}
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) =>
                      handleNavClick(link.href, e)
                    }
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      active
                        ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>

                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </a>
                );
              })}

              {/* Mobile More Toggle */}
              <button
                onClick={() => setMobileMoreOpen((prev) => !prev)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isMoreActive
                    ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                aria-expanded={mobileMoreOpen}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-4 h-4 opacity-70 transition-transform ${
                    mobileMoreOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {mobileMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-2 flex flex-col gap-1"
                  >
                    {moreLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.href);

                      return (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={(e) => handleNavClick(link.href, e)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            active
                              ? 'bg-purple-600/15 text-purple-200'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                          <span>{link.label}</span>
                        </a>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Mobile Auth */}
              {!isLoggedIn ? (
                <button
                  onClick={handleLogin}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-400/40 text-slate-200 transition-all"
                >
                  <LogIn className="w-4 h-4 text-purple-400" />
                  <span>Login</span>
                </button>
              ) : (
                <>
                  {/* Profile */}
                  <button
                    onClick={handleProfile}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-purple-950/60 border border-purple-500/40 text-purple-200 transition-all"
                  >
                    <MinecraftHead size="sm" />

                    <span>
                      {username
                        ? `@${username}`
                        : 'My Profile'}
                    </span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-300 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {/* Discord */}
              <a
                href={SERVER_CONFIG.discordUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-purple-950/60 border border-purple-500/40 text-purple-200"
              >
                <DiscordIcon className="w-4 h-4 text-purple-400" />

                <span>Join Discord</span>

                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              {/* Play Now */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPlayModal();
                }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/50 sm:col-span-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Now</span>
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};