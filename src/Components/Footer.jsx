import { Link } from "react-router";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="mt-20 border-t border-border bg-card/60 backdrop-blur-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.48l1.43-11.44c.12-.96-.63-1.82-1.63-1.82h-1.92V4.5A2.5 2.5 0 0 0 16.73 2H7.27A2.5 2.5 0 0 0 4.77 4.5v3.75H2.85c-.99 0-1.75.86-1.63 1.82l1.43 11.44c.1.84.79 1.48 1.63 1.48h1.66V15a2 2 0 0 1 2-2h8.12a2 2 0 0 1 2 2v7.99zM6.77 4.5a.5.5 0 0 1 .5-.5h9.46a.5.5 0 0 1 .5.5v3.75H6.77V4.5zm1.19 18.49V15h8.08v7.99H7.96z" />
                </svg>
              </span>
              <span className="font-serif font-bold text-2xl text-text group-hover:text-accent transition-colors">
                Recipe<span className="text-accent italic font-normal">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-muted max-w-sm leading-relaxed">
              Crafting delightful moments around the table with handpicked, chef-inspired recipes, step-by-step guidance, and passion for home cooking.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-muted">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Kitchen open 24/7 • Fresh recipes daily</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-serif font-bold text-text text-sm uppercase tracking-wider mb-3">
              Popular Cuisines
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link to="/?q=Italian" className="hover:text-accent transition-colors inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
                  Italian Classics
                </Link>
              </li>
              <li>
                <Link to="/?q=Asian" className="hover:text-accent transition-colors inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
                  Asian Specialties
                </Link>
              </li>
              <li>
                <Link to="/?q=Mexican" className="hover:text-accent transition-colors inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
                  Mexican Street Food
                </Link>
              </li>
              <li>
                <Link to="/?q=Dessert" className="hover:text-accent transition-colors inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40"></span>
                  Artisan Desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* Culinary Highlights */}
          <div>
            <h4 className="font-serif font-bold text-text text-sm uppercase tracking-wider mb-3">
              Kitchen Perks
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Interactive checklist</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Dynamic servings scaler</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Step-by-step cooking</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Bookmark favorite dishes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/70 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} RecipeFinder. Bon appétit!
          </p>
          <div className="flex items-center gap-4">
            <span className="italic font-serif text-text/80">"Cooking is love made visible."</span>
            <button
              onClick={scrollToTop}
              type="button"
              className="p-2 rounded-full border border-border bg-card hover:bg-accent hover:text-white hover:border-accent text-text transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
              aria-label="Back to top"
              title="Back to top"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

