import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <main className="flex-grow p-8 sm:p-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <section className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Välkommen till ChiqueButik!
          </h1>
          <p className="text-lg sm:text-xl mb-8">
            Upptäck våra fantastiska klänningar för alla tillfällen.
          </p>

          {/* Clerk login/logout */}
          <div className="space-x-4">
            <SignedOut>
              <SignInButton>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Logga in
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <SignOutButton>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  Logga ut
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </section>
      </main>

    </div>
  );
}
