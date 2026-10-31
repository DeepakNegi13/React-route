import { useState, useEffect } from "react";
import { Link } from "react-router";
import { isFavorite, toggleFavorite } from "../utils/favorites";

function RecipeCard({ recipe }) {
  const [favorite, setFavorite] = useState(() => isFavorite(recipe.id));
  const [imgLoaded, setImgLoaded] = useState(false);
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  useEffect(() => {
    const handleFavChange = () => setFavorite(isFavorite(recipe.id));
    window.addEventListener("recipefinder:favorites-changed", handleFavChange);
    return () => {
      window.removeEventListener("recipefinder:favorites-changed", handleFavChange);
    };
  }, [recipe.id]);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleFavorite(recipe);
    setFavorite(newState);
  };

  const getDifficultyColor = (diff) => {
    const d = (diff || "").toLowerCase();
    if (d === "easy") return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (d === "medium") return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-rose-50 text-rose-800 border-rose-200";
  };

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group bg-card border border-border/80 hover:border-accent/60 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative focus:outline-hidden"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-background">
        {/* Shimmer placeholder before image loads */}
        {!imgLoaded && (
          <div className="absolute inset-0 shimmer-skeleton" />
        )}

        <img
          src={recipe.image}
          alt={recipe.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Subtle Dark Gradient at bottom of image for contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-center pointer-events-none">
          <span className="bg-card/90 backdrop-blur-md text-text text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs border border-border/60 pointer-events-auto">
            {recipe.cuisine || "Global"}
          </span>

          {/* Favorite Toggle Button */}
          <button
            onClick={handleHeartClick}
            type="button"
            className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-md border border-border/60 text-text hover:text-accent flex items-center justify-center shadow-xs transition-transform duration-200 hover:scale-110 active:scale-90 pointer-events-auto cursor-pointer"
            aria-label={favorite ? "Remove from saved" : "Save recipe"}
            title={favorite ? "Remove from saved" : "Save recipe"}
          >
            <svg
              className={`w-4 h-4 transition-colors ${
                favorite ? "fill-accent text-accent" : "fill-none stroke-current"
              }`}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Bottom Floating Badges on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border shadow-xs backdrop-blur-xs ${getDifficultyColor(
              recipe.difficulty
            )}`}
          >
            {recipe.difficulty}
          </span>
          {recipe.caloriesPerServing ? (
            <span className="text-[11px] font-medium text-white/95 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
              <svg className="w-3 h-3 fill-accent" viewBox="0 0 24 24">
                <path d="M12 23c-4.97 0-9-3.58-9-8 0-4.08 3.05-8.25 6.08-11.8.44-.52 1.25-.49 1.66.05.58.77 1.15 1.58 1.69 2.42.27.42.86.5 1.23.16.51-.47 1.04-.98 1.58-1.54.43-.45 1.16-.36 1.48.18C18.66 8.5 21 12.08 21 15c0 4.42-4.03 8-9 8z" />
              </svg>
              {recipe.caloriesPerServing} kcal
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-lg text-text group-hover:text-accent transition-colors duration-200 line-clamp-1 mb-1.5">
          {recipe.name}
        </h3>

        {/* Tags / Meal type row */}
        <p className="text-xs text-muted mb-4 line-clamp-1">
          {recipe.mealType?.length ? recipe.mealType.join(" • ") : `${recipe.cuisine} Kitchen`}
        </p>

        {/* Stats Divider & Row */}
        <div className="mt-auto pt-3 border-t border-border/70 flex justify-between items-center text-xs">
          {/* Star Rating */}
          <span className="flex items-center gap-1.5 font-semibold text-text">
            <span className="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <svg className="w-3 h-3 fill-accent" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            <span>{recipe.rating}</span>
            {recipe.reviewCount ? (
              <span className="text-muted font-normal text-[11px]">
                ({recipe.reviewCount})
              </span>
            ) : null}
          </span>

          {/* Cooking Time */}
          <span className="flex items-center gap-1 text-muted font-medium">
            <svg
              className="w-3.5 h-3.5 stroke-muted fill-none"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{totalTime} mins</span>
          </span>

          {/* Action indicator */}
          <span className="text-accent group-hover:translate-x-1 transition-transform duration-200 font-semibold flex items-center gap-0.5">
            <span>View</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
