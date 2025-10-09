export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        &copy; {new Date().getFullYear()} ChiqueButik. Alla rättigheter förbehållna.
      </div>
    </footer>
  );
}
