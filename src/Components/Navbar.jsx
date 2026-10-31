import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { getFavorites, toggleFavorite } from "../utils/favorites";

function Navbar() {
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [isFavOpen, setIsFavOpen] = useState(false);
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Close favorites drawer on route change using React's recommended state adjustment during render
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsFavOpen(false);
  }

  useEffect(() => {
    const handleUpdate = (e) => {
      setFavorites(e.detail || getFavorites());
    };
    window.addEventListener("recipefinder:favorites-changed", handleUpdate);
    return () => {
      window.removeEventListener("recipefinder:favorites-changed", handleUpdate);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border/80 transition-all duration-300 shadow-xs">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex justify-between items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-accent-hover transition-all duration-300">
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-3 18c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl sm:text-2xl text-text tracking-tight group-hover:text-accent transition-colors leading-none">
                Recipe<span className="text-accent italic font-normal">Finder</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted font-semibold mt-0.5">
                Artisan Kitchen
              </span>
            </div>
          </Link>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === "/"
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-text hover:text-accent hover:bg-background"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Explore</span>
            </Link>

            {/* Saved Recipes Trigger */}
            <button
              onClick={() => setIsFavOpen(true)}
              type="button"
              className="relative px-3 py-1.5 rounded-lg text-sm font-medium text-text hover:text-accent hover:bg-background transition-all duration-200 flex items-center gap-1.5 border border-transparent hover:border-border cursor-pointer"
              aria-label="View saved recipes"
            >
              <svg
                className={`w-4 h-4 ${favorites.length > 0 ? "fill-accent text-accent" : "fill-none stroke-current"}`}
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="hidden sm:inline">Saved</span>
              {favorites.length > 0 && (
                <span className="px-1.5 py-0.2 text-[11px] font-bold bg-accent text-white rounded-full leading-tight animate-scale-up">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Saved Recipes Drawer / Modal */}
      {isFavOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsFavOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-fade-in-up">
              {/* Drawer Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-background/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <svg className="w-4 h-4 fill-accent" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-text">
                      Saved Recipes
                    </h3>
                    <p className="text-xs text-muted">
                      {favorites.length} {favorites.length === 1 ? "recipe" : "recipes"} saved
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFavOpen(false)}
                  className="p-2 rounded-lg text-muted hover:text-text hover:bg-background transition-colors"
                  aria-label="Close saved drawer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-border/60">
                {favorites.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <svg className="w-8 h-8 stroke-current fill-none" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-text">
                      No saved recipes yet
                    </h4>
                    <p className="text-sm text-muted max-w-xs leading-relaxed">
                      Tap the heart icon on any recipe card to build your personal cookbook!
                    </p>
                    <button
                      onClick={() => setIsFavOpen(false)}
                      className="mt-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      Start Exploring
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites.map((fav) => (
                      <div
                        key={fav.id}
                        className="group flex items-center gap-3 p-2.5 rounded-xl border border-border/80 hover:border-accent/40 bg-card hover:bg-background/60 transition-all duration-200"
                      >
                        <Link
                          to={`/recipe/${fav.id}`}
                          onClick={() => setIsFavOpen(false)}
                          className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border"
                        >
                          <img
                            src={fav.image}
                            alt={fav.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/recipe/${fav.id}`}
                            onClick={() => setIsFavOpen(false)}
                            className="block font-serif font-semibold text-text group-hover:text-accent transition-colors truncate"
                          >
                            {fav.name}
                          </Link>
                          <p className="text-xs text-muted truncate mt-0.5">
                            {fav.cuisine} • {fav.difficulty}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-accent mt-1">
                            <svg className="w-3.5 h-3.5 fill-accent" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="font-medium text-text">{fav.rating}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(fav)}
                          title="Remove from saved"
                          className="p-2 text-muted hover:text-accent rounded-lg hover:bg-card transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
