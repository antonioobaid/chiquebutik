'use client';
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Heart, ShoppingCart, Store, Search, User, Phone, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/types";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
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
    }, 300); // 300ms debounce
  }, [query]);

  // 🔹 Stäng sök overlay vid klick utanför
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery(""); // rensa sökfältet när overlay stängs
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Rensa sökfält och resultat vid navigering
  useEffect(() => {
    setQuery("");
    setResults([]);
  }, [pathname]);

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 relative">

        {/* 🔹 Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight hover:opacity-80 transition">
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
                  setQuery(""); // rensa när man klickar X
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
                      setQuery(""); // rensa vid navigering
                      setResults([]);
                      router.push(`/produkter/${product.id}`);
                    }}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition"
                  >
                    <img
                      src={product.image_url}
                      alt={product.title}
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

        {/* 🔹 Desktop navigation */}
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
            <UserButton
              appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-blue-500 rounded-full shadow-md" } }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </nav>

        {/* 🔹 Mobile navigation */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
          >
            <Search size={24} />
          </button>

          <Link href="/produkter" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            <Store size={24} />
          </Link>

          <Link href="/favoriter" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            <Heart size={24} />
          </Link>

          <Link href="/varukorg" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            <ShoppingCart size={24} />
          </Link>

          <Link href="/kontakt" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            <Phone size={24} />
          </Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
                <User size={24} />
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-blue-500 rounded-full shadow-md" } }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
