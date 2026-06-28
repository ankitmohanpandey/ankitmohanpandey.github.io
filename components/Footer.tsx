export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950/50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-400">
          <p>© {new Date().getFullYear()} Ankit Mohan Pandey</p>
          <p className="mt-2 text-sm">Senior Data Engineer</p>
        </div>
      </div>
    </footer>
  );
}
