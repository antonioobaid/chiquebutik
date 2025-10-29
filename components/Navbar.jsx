'use client';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Heart, ShoppingCart, Store, Search, User, Phone } from "lucide-react";

export default function Navbar() {
   const router = useRouter();

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

        {/* 🔹 Left side (Logo) */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight hover:opacity-80 transition"
          >
            Chique<span className="text-blue-600">Butik</span>
          </Link>
        </div>

        {/* 🔹 Desktop navigation */}
        <nav className="hidden md:flex items-center gap-5">
          {/* 🔹 Search first */}
          <button 
          onClick={() => router.push("/sok")}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
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

          {/* ✅ Kontakt-sidan */}
          <Link href="/kontakt" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            <Phone size={20} /> Kontakt
          </Link>

          {/* 🔹 Auth buttons */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-md hover:opacity-90 transition">
                Logga in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: { avatarBox: "w-9 h-9 border-2 border-blue-500 rounded-full shadow-md" },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </nav>

        {/* 🔹 Mobile navigation (only icons) */}
        <div className="flex md:hidden items-center gap-4">
          <button
           onClick={() => router.push("/sok")}
           className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
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

          {/* ✅ Kontakt ikon i mobilvy */}
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
              appearance={{
                elements: { avatarBox: "w-9 h-9 border-2 border-blue-500 rounded-full shadow-md" },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
