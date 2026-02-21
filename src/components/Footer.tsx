// Responsible for rendering the site-wide footer with copyright information.
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="flex justify-center items-center">
          <div className="text-slate-500 text-sm">
            &copy; {currentYear} ResetPower. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
