export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#87CEFA] via-[#E0FFFF] to-[#1877F2]">
      {children}
    </div>
  );
}
