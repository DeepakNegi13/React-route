import { Link } from "react-router";

function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
      <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-accent/10 border border-accent/20 text-accent mb-8 shadow-xs animate-float">
        <svg
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          {/* Cloche / Platter SVG */}
          <path d="M12 4V2" strokeLinecap="round" />
          <path d="M4 18h16a2 2 0 0 0 2-2v0a8 8 0 0 0-8-8 8 8 0 0 0-8 8v0a2 2 0 0 0 2 2z" />
          <path d="M2 20h20" strokeLinecap="round" />
          <circle cx="12" cy="13" r="1" fill="currentColor" />
        </svg>
        <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
          404
        </span>
      </div>

      <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-text tracking-tight mb-3">
        Recipe Not Found
      </h1>

      <p className="text-muted text-base max-w-md mx-auto mb-8 leading-relaxed">
        It seems this dish has vanished from our kitchen pantry, or the recipe link took a wrong turn. Let's get you back to cooking!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-7 py-3 text-sm font-semibold shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Return to Kitchen</span>
        </Link>
      </div>

      <div className="pt-8 border-t border-border/80">
        <span className="text-xs text-muted block mb-3 font-medium uppercase tracking-wider">
          Or explore popular culinary specialties:
        </span>
        <div className="flex items-center justify-center flex-wrap gap-2 text-xs">
          {["Pasta", "Pizza", "Salad", "Dessert", "Chicken", "Asian"].map((tag) => (
            <Link
              key={tag}
              to={`/?q=${tag}`}
              className="px-3 py-1.5 rounded-full bg-card border border-border text-text hover:text-accent hover:border-accent transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default NotFound;
