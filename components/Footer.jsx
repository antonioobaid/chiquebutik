export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 py-6 mt-auto border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto text-center text-sm">
        <p className="mb-2">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-500">ChiqueButik</span>. Alla
          rättigheter förbehållna.
        </p>
      </div>
    </footer>
  );
}

