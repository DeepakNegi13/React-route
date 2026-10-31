import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "axios";
import { isFavorite, toggleFavorite } from "../utils/favorites";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [copiedToast, setCopiedToast] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let ignore = false;

    axios
      .get(`https://dummyjson.com/recipes/${id}`)
      .then(({ data }) => {
        if (!ignore) {
          setRecipe(data);
          setFavorite(isFavorite(data.id));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load recipe:", err);
          setError("Unable to load recipe details. Please check your connection.");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    const handleFavChange = () => {
      if (recipe?.id) setFavorite(isFavorite(recipe.id));
    };
    window.addEventListener("recipefinder:favorites-changed", handleFavChange);
    return () => {
      window.removeEventListener("recipefinder:favorites-changed", handleFavChange);
    };
  }, [recipe?.id]);

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleStepComplete = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyIngredients = () => {
    if (!recipe?.ingredients) return;
    const text =
      `Ingredients for ${recipe.name}:\n\n` +
      recipe.ingredients.map((ing) => `• ${ing}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  const handleFavoriteToggle = () => {
    if (!recipe) return;
    const newState = toggleFavorite(recipe);
    setFavorite(newState);
  };

  // Skeleton Loader for Detail Page
  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="h-4 w-32 shimmer-skeleton rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="h-80 sm:h-96 rounded-3xl shimmer-skeleton" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 shimmer-skeleton rounded" />
            <div className="h-4 w-1/3 shimmer-skeleton rounded" />
            <div className="grid grid-cols-2 gap-3 pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-2xl shimmer-skeleton" />
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
          <div className="h-64 rounded-2xl shimmer-skeleton" />
          <div className="h-64 rounded-2xl shimmer-skeleton" />
        </div>
      </main>
    );
  }

  // Error State
  if (error || !recipe) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-accent flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold text-text mb-2">Recipe Not Available</h2>
        <p className="text-muted text-sm mb-6">{error || "Could not retrieve recipe information."}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back to Recipe Collection</span>
        </Link>
      </main>
    );
  }

  const baseServings = recipe.servings || 4;
  const currentServings = Math.round(baseServings * servingsMultiplier);
  const checkedIngredientsCount = Object.values(checkedIngredients).filter(Boolean).length;
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const totalSteps = recipe.instructions?.length || 0;
  const totalIngredients = recipe.ingredients?.length || 0;
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-text text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium animate-scale-up">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Copied to clipboard!</span>
        </div>
      )}

      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-accent transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-card border border-border group-hover:border-accent flex items-center justify-center transition-colors">
            <svg
              className="w-4 h-4 stroke-current fill-none group-hover:-translate-x-0.5 transition-transform"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </span>
          <span>Back to Collection</span>
        </Link>

        {/* Share & Favorite Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-card border border-border hover:border-accent/40 text-text hover:text-accent text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Share Recipe Link"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share</span>
          </button>

          <button
            onClick={handleFavoriteToggle}
            type="button"
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              favorite
                ? "bg-accent text-white border-accent"
                : "bg-card border-border hover:border-accent/40 text-text hover:text-accent"
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 ${favorite ? "fill-white" : "fill-none stroke-current"}`}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{favorite ? "Saved" : "Save Recipe"}</span>
          </button>
        </div>
      </div>

      {/* Main Recipe Header & Hero Showcase */}
      <section className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 mb-10 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Recipe Image with Frame */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-background border border-border shadow-sm group">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Top Cuisine Badge */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-card/90 backdrop-blur-md text-text text-xs font-bold px-3 py-1 rounded-full border border-border shadow-xs">
                {recipe.cuisine}
              </span>
              <span className="bg-accent/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {recipe.difficulty}
              </span>
            </div>
            {/* Total Time Overlay */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{totalTime} mins total</span>
            </div>
          </div>

          {/* Recipe Overview */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-accent uppercase tracking-wider">
                <span>{recipe.cuisine} Culinary Tradition</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text tracking-tight leading-tight">
                {recipe.name}
              </h1>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-lg font-bold text-sm">
                <svg className="w-4 h-4 fill-accent" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{recipe.rating}</span>
              </div>
              <span className="text-xs text-muted font-medium">
                Based on {recipe.reviewCount || 48} authentic home cook reviews
              </span>
            </div>

            {/* Key Metrics Grid (4 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
              <div className="p-3 rounded-xl bg-background border border-border text-center">
                <span className="text-[11px] font-medium text-muted block mb-0.5">Prep Time</span>
                <span className="font-serif font-bold text-base text-text">{recipe.prepTimeMinutes}m</span>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border text-center">
                <span className="text-[11px] font-medium text-muted block mb-0.5">Cook Time</span>
                <span className="font-serif font-bold text-base text-text">{recipe.cookTimeMinutes}m</span>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border text-center">
                <span className="text-[11px] font-medium text-muted block mb-0.5">Servings</span>
                <span className="font-serif font-bold text-base text-text">{recipe.servings}</span>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border text-center">
                <span className="text-[11px] font-medium text-muted block mb-0.5">Calories</span>
                <span className="font-serif font-bold text-base text-text">{recipe.caloriesPerServing} kcal</span>
              </div>
            </div>

            {/* Tags & Meal Type */}
            <div className="space-y-2 pt-2 text-xs">
              {recipe.mealType?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-text">Meal Type:</span>
                  {recipe.mealType.map((m, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              )}
              {recipe.tags?.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-text">Tags:</span>
                  {recipe.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-card border border-border text-muted font-normal">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cooking Experience: Ingredients + Instructions Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ingredients Column (5 cols) */}
        <section className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-xs lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-border mb-5">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-text">
                Ingredients
              </h2>
              <p className="text-xs text-muted mt-0.5">
                {checkedIngredientsCount} of {totalIngredients} prepared
              </p>
            </div>

            {/* Servings Adjuster Controls */}
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl p-1">
              <button
                type="button"
                onClick={() => setServingsMultiplier((prev) => Math.max(0.5, prev - 0.5))}
                className="w-6 h-6 rounded-lg bg-card border border-border hover:bg-accent hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                title="Decrease Servings"
              >
                -
              </button>
              <span className="text-xs font-bold px-1 text-text min-w-10 text-center">
                {currentServings} svg
              </span>
              <button
                type="button"
                onClick={() => setServingsMultiplier((prev) => Math.min(3, prev + 0.5))}
                className="w-6 h-6 rounded-lg bg-card border border-border hover:bg-accent hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                title="Increase Servings"
              >
                +
              </button>
            </div>
          </div>

          {/* Interactive Checklist Notice */}
          <div className="bg-background/80 rounded-xl p-3 mb-4 text-xs text-muted flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Tap an ingredient to check it off</span>
            </span>
            <button
              onClick={handleCopyIngredients}
              type="button"
              className="text-accent hover:underline font-semibold cursor-pointer"
            >
              Copy List
            </button>
          </div>

          {/* Ingredients Checklist */}
          <ul className="space-y-2.5">
            {recipe.ingredients?.map((item, index) => {
              const isChecked = !!checkedIngredients[index];
              return (
                <li
                  key={index}
                  onClick={() => toggleIngredientCheck(index)}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                    isChecked
                      ? "bg-background/40 border-border/50 text-muted"
                      : "bg-card border-border/70 hover:border-accent/40 text-text hover:bg-background/30"
                  }`}
                >
                  <div
                    className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-colors ${
                      isChecked
                        ? "bg-accent border-accent text-white"
                        : "border-border group-hover:border-accent bg-card"
                    }`}
                  >
                    {isChecked && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm leading-relaxed transition-all ${
                      isChecked ? "line-through text-muted/70" : "font-medium"
                    }`}
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>

          {checkedIngredientsCount > 0 && (
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setCheckedIngredients({})}
                className="text-xs text-muted hover:text-accent font-medium underline cursor-pointer"
              >
                Reset Checklist
              </button>
            </div>
          )}
        </section>

        {/* Instructions Column (7 cols) */}
        <section className="lg:col-span-7 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-border mb-6">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-text">
                Cooking Instructions
              </h2>
              <p className="text-xs text-muted mt-0.5">
                {completedStepsCount} of {totalSteps} steps completed
              </p>
            </div>

            {/* Cooking Progress Badge */}
            <div className="flex items-center gap-2">
              <div className="w-20 sm:w-28 h-2 bg-background border border-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300 rounded-full"
                  style={{
                    width: `${totalSteps > 0 ? (completedStepsCount / totalSteps) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-xs font-bold text-accent">
                {totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-4">
            {recipe.instructions?.map((step, index) => {
              const isDone = !!completedSteps[index];
              return (
                <div
                  key={index}
                  onClick={() => toggleStepComplete(index)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isDone
                      ? "bg-background/40 border-border/60 text-muted opacity-80"
                      : "bg-card border-border hover:border-accent/50 shadow-xs hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Number Badge */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                        isDone
                          ? "bg-emerald-600 text-white"
                          : "bg-accent text-white shadow-xs"
                      }`}
                    >
                      {isDone ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-text">
                          Step {index + 1}
                        </span>
                        <span className="text-[11px] font-medium text-muted">
                          {isDone ? "Done" : "Tap to complete"}
                        </span>
                      </div>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          isDone ? "line-through text-muted/70" : "text-text/90"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {completedStepsCount === totalSteps && totalSteps > 0 && (
            <div className="mt-8 p-6 rounded-2xl bg-accent/10 border border-accent/20 text-center space-y-2 animate-scale-up">
              <span className="text-3xl">🎉</span>
              <h3 className="font-serif font-bold text-xl text-text">Dish Complete!</h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                All steps finished. Plate with care, garnish to taste, and savor every bite. Bon appétit!
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Bottom Back Button */}
      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border hover:border-accent text-text hover:text-accent font-semibold text-sm shadow-xs transition-all hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Discover More Recipes</span>
        </Link>
      </div>
    </main>
  );
}

export default RecipeDetail;
