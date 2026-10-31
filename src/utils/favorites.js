// Client-side favorites manager using localStorage and custom events
const FAVORITES_KEY = "recipefinder_favorites";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  const favs = getFavorites();
  return favs.some((item) => String(item.id) === String(id));
}

export function toggleFavorite(recipe) {
  if (!recipe || !recipe.id) return false;
  const favs = getFavorites();
  const exists = favs.some((item) => String(item.id) === String(recipe.id));

  let updated;
  if (exists) {
    updated = favs.filter((item) => String(item.id) !== String(recipe.id));
  } else {
    updated = [
      {
        id: recipe.id,
        name: recipe.name,
        image: recipe.image,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        rating: recipe.rating,
      },
      ...favs,
    ];
  }

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save favorite:", err);
  }

  // Dispatch custom event for real-time reactive sync across components
  window.dispatchEvent(new CustomEvent("recipefinder:favorites-changed", { detail: updated }));
  return !exists;
}

