export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-4">
      <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
        © {year} Chrona. All rights reserved.
      </div>
    </footer>
  );
}
