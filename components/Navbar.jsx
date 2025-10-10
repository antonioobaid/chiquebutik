import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          ChiqueButik
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            href="/produkter"
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition"
          >
            Produkter
          </Link>
          <Link
            href="/favoriter"
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition"
          >
            Favoriter
          </Link>
          <Link
            href="/varukorg"
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition"
          >
            Varukorg
          </Link>
          <Link
            href="/kontakt"
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition"
          >
            Kontakt
          </Link>

          {/* Clerk Login / User */}
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Logga in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
