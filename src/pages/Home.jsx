import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router";
import axios from "axios";
import RecipeCard from "../Components/Recipecard";

const POPULAR_TAGS = [
  "All",
  "Italian",
  "Pizza",
  "Pasta",
  "Chicken",
  "Salad",
  "Dessert",
  "Asian",
];

const DEFAULT_FEATURED = {
  id: 1,
  name: "Classic Margherita Pizza",
  image: "https://cdn.dummyjson.com/recipe-images/1.webp",
  cuisine: "Italian",
  difficulty: "Easy",
  rating: 4.9,
  prepTimeMinutes: 20,
  cookTimeMinutes: 15,
  caloriesPerServing: 300,
  tags: ["Pizza", "Italian", "Classic"],
};

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQ = searchParams.get("q") || "";
  const [prevQ, setPrevQ] = useState(currentQ);
  const [searchQuery, setSearchQuery] = useState(currentQ);
  const [activeTag, setActiveTag] = useState(() => (POPULAR_TAGS.includes(currentQ) ? currentQ : "All"));
  const [recipe, setRecipe] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const inputRef = useRef(null);

  // Sync state when URL searchParams change during render
  if (currentQ !== prevQ) {
    setPrevQ(currentQ);
    setSearchQuery(currentQ);
    setActiveTag(POPULAR_TAGS.includes(currentQ) ? currentQ : "");
  }

  // Fetch data whenever searchParams changes
  useEffect(() => {
    let ignore = false;
    const q = searchParams.get("q");

    const endpoint = q
      ? `https://dummyjson.com/recipes/search?q=${encodeURIComponent(q.trim())}`
      : "https://dummyjson.com/recipes?limit=6&skip=0";

    axios
      .get(endpoint)
      .then(({ data }) => {
        if (!ignore) {
          setRecipe(data.recipes || []);
          setTotal(data.total || 0);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (!ignore) {
          console.error("Failed to load recipes:", error);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      setLoading(true);
      setActiveTag(POPULAR_TAGS.includes(query) ? query : "");
      setSearchParams({ q: query });
    } else {
      resetToAll();
    }
  };

  const handleTagClick = (tag) => {
    if (tag === "All") {
      resetToAll();
    } else {
      setLoading(true);
      setActiveTag(tag);
      setSearchQuery(tag);
      setSearchParams({ q: tag });
    }
  };

  const resetToAll = () => {
    setLoading(true);
    setSearchQuery("");
    setActiveTag("All");
    setSearchParams({});
    if (inputRef.current) inputRef.current.value = "";
  };

  const fetchMore = async () => {
    setLoadingMore(true);
    try {
      const q = searchParams.get("q");
      const url = q
        ? `https://dummyjson.com/recipes/search?q=${encodeURIComponent(q.trim())}&limit=6&skip=${recipe.length}`
        : `https://dummyjson.com/recipes?limit=6&skip=${recipe.length}`;
      const { data } = await axios.get(url);
      setRecipe((prev) => [...prev, ...(data.recipes || [])]);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to load more recipes:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const featured = recipe.length > 0 ? recipe[0] : DEFAULT_FEATURED;
  const progressPercent = total > 0 ? Math.min(100, Math.round((recipe.length / total) * 100)) : 0;
  const featuredTotalTime = (featured.prepTimeMinutes || 0) + (featured.cookTimeMinutes || 0);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-card to-background border border-border/80 p-6 sm:p-10 lg:p-12 mb-12 shadow-xs">
        {/* Subtle decorative culinary background glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Text & Callouts */}
          <div className="max-w-xl text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <span>Curated Kitchen Classics</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-extrabold text-text tracking-tight leading-[1.15]">
              Discover Flavors, <br />
              <span className="text-accent italic font-normal">Master the Craft</span> of Cooking.
            </h1>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Explore step-by-step recipes tested by home chefs. From quick weeknight dinners to artisan weekend spreads, your next culinary adventure begins here.
            </p>

            {/* Quick Hero Highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-text/80">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-medium">4.8+ Chef Rating</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-medium">Fast &amp; Tested Steps</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="font-medium">100% Free Access</span>
              </div>
            </div>
          </div>

          {/* Right: Featured Dish Interactive Showcase Card (Replaces the awkward placeholder graphic) */}
          <div className="relative shrink-0 w-full sm:w-80 lg:w-96">
            {/* Background layered accent frame for depth */}
            <div className="absolute inset-0 bg-accent/15 rounded-3xl transform rotate-3 scale-95 transition-transform duration-300 pointer-events-none" />

            {/* Main Interactive Spotlight Card */}
            <Link
              to={`/recipe/${featured.id}`}
              className="group relative block bg-card border border-border/90 rounded-3xl p-4 shadow-xl hover:shadow-2xl hover:border-accent/60 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Recipe Image with Overlays */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-background mb-4">
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay for Readability */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                {/* Top Spotlight Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-card/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-border/80 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                    Chef's Spotlight
                  </span>
                </div>

                {/* Star Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{featured.rating}</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white font-medium">
                  <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {featured.cuisine}
                  </span>
                  <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 stroke-white fill-none" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{featuredTotalTime} mins</span>
                  </span>
                </div>
              </div>

              {/* Recipe Meta Info */}
              <div className="px-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif font-bold text-lg text-text group-hover:text-accent transition-colors line-clamp-1">
                    {featured.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                    {featured.difficulty}
                  </span>
                </div>

                <p className="text-xs text-muted line-clamp-1">
                  {featured.tags?.join(" • ") || "Artisan recipe ready in under 45 minutes"}
                </p>

                {/* Action CTA Ribbon */}
                <div className="pt-2 border-t border-border/70 flex items-center justify-between text-xs font-semibold text-accent group-hover:text-accent-hover">
                  <span className="inline-flex items-center gap-1.5">
                    <span>View Recipe Guide</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                  <span className="text-muted font-normal text-[11px]">
                    Tap to cook →
                  </span>
                </div>
              </div>
            </Link>

            {/* Floating Mini Experience Badge */}
            <div className="absolute -bottom-3 -left-3 bg-card border border-border/90 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2.5 pointer-events-none animate-float hidden sm:flex">
              <span className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-base">
                🍳
              </span>
              <div>
                <p className="text-[10px] text-muted uppercase font-semibold leading-none">Trending Dish</p>
                <p className="text-xs font-bold text-text mt-0.5">Tested &amp; Loved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Search & Filter Bar */}
      <section className="mb-10 space-y-4">
        <form
          onSubmit={handleSearchSubmit}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative flex items-center bg-card border border-border/90 rounded-2xl p-1.5 shadow-sm hover:border-accent/50 focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/15 transition-all duration-300">
            {/* Search Icon */}
            <div className="pl-3.5 pr-2 text-muted">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              name="query"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, cuisines, or ingredients (e.g. Pasta, Pizza, Chicken)..."
              className="w-full bg-transparent text-text placeholder:text-muted/70 text-sm sm:text-base outline-none py-2 px-1 font-sans"
            />

            {/* Clear button if text exists */}
            {searchQuery && (
              <button
                type="button"
                onClick={resetToAll}
                className="p-1.5 text-muted hover:text-text rounded-full hover:bg-background transition-colors mr-1 cursor-pointer"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>Search</span>
              <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </form>

        {/* Quick Filter Tag Chips */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          <span className="text-xs text-muted font-medium mr-1 hidden sm:inline">
            Trending:
          </span>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-accent text-white shadow-xs scale-105"
                    : "bg-card border border-border/80 text-muted hover:text-text hover:border-accent/40 hover:bg-background"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Header with Count & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border/80 mb-8">
        <div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-text">
            {searchQuery && activeTag !== "All" ? `Results for "${searchQuery}"` : "Featured Recipe Collection"}
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Showing {recipe.length} of {total} authentic recipes
          </p>
        </div>

        {/* Progress pill indicator */}
        <div className="flex items-center gap-3">
          <div className="w-28 sm:w-36 h-2 bg-border/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-muted">
            {progressPercent}%
          </span>
          {searchQuery && (
            <button
              onClick={resetToAll}
              className="text-xs font-medium text-accent hover:underline ml-2 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-xs"
            >
              <div className="aspect-[16/11] w-full shimmer-skeleton" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 shimmer-skeleton rounded-md" />
                <div className="h-3 w-1/2 shimmer-skeleton rounded-md" />
                <div className="pt-4 border-t border-border flex justify-between">
                  <div className="h-4 w-12 shimmer-skeleton rounded-md" />
                  <div className="h-4 w-16 shimmer-skeleton rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-card border border-dashed border-border rounded-3xl animate-scale-up">
          <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
            <svg className="w-10 h-10 stroke-current fill-none" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <h3 className="font-serif font-bold text-2xl text-text mb-2">
            No recipes found
          </h3>
          <p className="text-sm text-muted max-w-md mb-6 leading-relaxed">
            We couldn't find any dishes matching "{searchQuery}". Try exploring our popular categories like Pasta, Pizza, or Salad.
          </p>
          <button
            onClick={resetToAll}
            type="button"
            className="bg-accent hover:bg-accent-hover text-white rounded-xl px-6 py-2.5 text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            Show All Recipes
          </button>
        </div>
      ) : (
        /* Recipe Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {recipe.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(index % 6) * 60}ms` }}
            >
              <RecipeCard recipe={item} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination / Load More Section */}
      {!loading && recipe.length < total && (
        <div className="text-center mt-12 pt-6 flex flex-col items-center gap-3">
          <button
            onClick={fetchMore}
            disabled={loadingMore}
            type="button"
            className="group bg-accent hover:bg-accent-hover text-white rounded-xl px-8 py-3.5 font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading more recipes...</span>
              </>
            ) : (
              <>
                <span>Load More Recipes</span>
                <span className="text-white/80 text-xs font-normal">
                  ({total - recipe.length} remaining)
                </span>
                <svg
                  className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </>
            )}
          </button>
          <p className="text-xs text-muted">
            Viewing {recipe.length} of {total} dishes
          </p>
        </div>
      )}

      {/* Reached End Indicator */}
      {!loading && total > 0 && recipe.length >= total && (
        <div className="text-center mt-12 py-6 border-t border-border/70 text-sm text-muted font-medium flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>You have explored all {total} recipes in our collection!</span>
        </div>
      )}
    </main>
  );
}

export default Home;
