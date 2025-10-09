import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          ChiqueButik
        </Link>
        <nav className="space-x-4">
          <Link href="/produkter" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
            Produkter
          </Link>
          <Link href="/varukorg" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
            Varukorg
          </Link>
          <Link href="/favoriter" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
            Favoriter
          </Link>
          <Link href="/kontakt" className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
            Kontakt
          </Link>
        </nav>
      </div>
    </header>
  );
}
