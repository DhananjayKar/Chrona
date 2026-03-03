export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <div className="mx-auto p-2 text-center text-sm text-gray-500 bg-blue-200 rounded-t-2xl">
        © {year} Chrona. All rights reserved.
      </div>
    </footer>
  );
}
