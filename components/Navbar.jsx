import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link
          href="/"
          className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight hover:opacity-80 transition"
        >
          Chique<span className="text-blue-500">Butik</span>
        </Link>

        <nav className="flex items-center space-x-6">
          {["produkter", "favoriter", "varukorg", "kontakt"].map((page) => (
            <Link
              key={page}
              href={`/${page}`}
              className="relative text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition font-medium"
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
              <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full"></span>
            </Link>
          ))}

           <SignedOut >
            <SignInButton mode="modal"   >
              <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-blue-600 text-white font-semibold shadow-md hover:opacity-90 transition">
                Logga in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-2">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border-2 border-blue-500 rounded-full shadow-md ",
                  },
                }}
                afterSignOutUrl="/"
              />
            </div>
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}

