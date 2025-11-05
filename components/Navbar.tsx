'use client';
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useClerk } from "@clerk/nextjs";
import { Heart, ShoppingCart, Store, Search, User, Phone, X, Menu, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/types";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔹 Live-sök med debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sok?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Fel vid sökning:", error);
      }
    }, 300);
  }, [query]);

  // 🔹 Stäng overlay och menus vid klick utanför
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
        setResults([]);
      }
    };
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // 🔹 Rensa sökfält och resultat vid navigering
  useEffect(() => {
    setQuery("");
    setResults([]);
    setMobileMenuOpen(false);
  }, [pathname]);

  // 🔹 Låsa scroll när mobile menu är öppen
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // 🔹 Hantera utloggning för mobile
  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 relative">

        {/* 🔹 Logo */}
        <div className="flex items-center gap-4 z-60">
          <Link 
            href="/" 
            className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight hover:opacity-80 transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Chique<span className="text-blue-600">Butik</span>
          </Link>
        </div>

        {/* 🔹 Live Search Overlay */}
        {searchOpen && (
          <div
            ref={searchRef}
            className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700 z-40 p-4 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-3">
              <Search size={20} className="text-gray-500" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök produkter..."
                className="w-full bg-transparent outline-none border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white py-1"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                  setResults([]);
                }}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-2">
              {results.length > 0 ? (
                results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                      setResults([]);
                      router.push(`/produkter/${product.id}`);
                    }}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition"
                  >
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{product.title}</p>
                      <p className="text-sm text-gray-500">{product.price} kr</p>
                    </div>
                  </div>
                ))
              ) : query.length > 1 ? (
                <p className="text-gray-500 text-sm px-2">Inga produkter hittades.</p>
              ) : null}
            </div>
          </div>
        )}

        {/* 🔹 Desktop navigation - ORIGINAL med Clerk UserButton */}
        <nav className="hidden md:flex items-center gap-5">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
          >
            <Search size={22} /> Sök
          </button>

          <Link href="/produkter" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            <Store size={20} /> Produkter
          </Link>

          <Link href="/favoriter" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            <Heart size={20} /> Favoriter
          </Link>

          <Link href="/varukorg" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            <ShoppingCart size={20} /> Varukorg
          </Link>

          <Link href="/kontakt" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            <Phone size={20} /> Kontakt
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-md hover:opacity-90 transition">
                Logga in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {/* ORIGINAL Clerk UserButton för desktop */}
            <UserButton
              appearance={{ 
                elements: { 
                  avatarBox: "w-9 h-9 border-2 border-blue-500 rounded-full shadow-md",
                  userButtonTrigger: "focus:shadow-none"
                } 
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </nav>

        {/* 🔹 Mobile navigation - FORTFARANDE med vår anpassade menu */}
        <div className="flex md:hidden items-center gap-4">
          {/* Sök-knappen - alltid synlig till höger */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition p-2 z-60"
          >
            <Search size={24} />
          </button>

          {/* Hamburger menu knapp */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition p-2 z-60 relative"
          >
            <Menu size={24} />
          </button>

          {/* Fullscreen Mobile Overlay Menu */}
          {mobileMenuOpen && (
            <>
              {/* Overlay bakgrund med blur effect */}
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Mobile menu panel - kommer från höger */}
              <div
                ref={mobileMenuRef}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
              >
                {/* Header med stäng-knapp */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Meny</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                  >
                    <X size={24} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Navigationslänkar */}
                <div className="flex flex-col p-6 space-y-2">
                  <Link 
                    href="/produkter" 
                    className="flex items-center gap-4 px-4 py-4 text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:translate-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Store size={24} className="text-blue-600" />
                    <span>Produkter</span>
                  </Link>

                  <Link 
                    href="/favoriter" 
                    className="flex items-center gap-4 px-4 py-4 text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:translate-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart size={24} className="text-red-500" />
                    <span>Favoriter</span>
                  </Link>

                  <Link 
                    href="/varukorg" 
                    className="flex items-center gap-4 px-4 py-4 text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:translate-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart size={24} className="text-green-600" />
                    <span>Varukorg</span>
                  </Link>

                  <Link 
                    href="/kontakt" 
                    className="flex items-center gap-4 px-4 py-4 text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:translate-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Phone size={24} className="text-purple-600" />
                    <span>Kontakt</span>
                  </Link>
                </div>

                {/* Auth section */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button 
                        className="flex items-center gap-4 w-full px-4 py-4 text-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all duration-200 mb-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User size={24} className="text-gray-600 dark:text-gray-400" />
                        <span>Logga in</span>
                      </button>
                    </SignInButton>
                    <div className="text-xs text-gray-500 text-center">
                      Logga in för att spara dina favoriter
                    </div>
                  </SignedOut>

                  <SignedIn>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 px-4 py-3">
                        {/* ✅ FIXAD: Bytte ut img mot Image komponent */}
                        <Image 
                          src={user?.imageUrl || "/default-avatar.png"} 
                          alt="Profile" 
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full border-2 border-blue-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      >
                        <LogOut size={20} />
                        <span className="text-lg">Logga ut</span>
                      </button>
                    </div>
                  </SignedIn>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}