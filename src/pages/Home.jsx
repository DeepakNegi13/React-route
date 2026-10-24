import axios from "axios";
import { useEffect, useState } from "react";
import RecipeCard from "../Components/Recipecard";
async function fetchApi(setRecipe) {
	try {
		const { data } = await axios.get("https://dummyjson.com/recipes");
		setRecipe(data);
	} catch (error) {
		console.error("Failed to load recipes:", error);
	}
}

function Home() {
	const [recipe, setRecipe] = useState(null);
	useEffect(() => {
		fetchApi(setRecipe);
	}, []);
	return (
		<main className="max-w-6xl mx-auto px-4 py-8">
			<form className="flex gap-2 max-w-md mx-auto mb-8">
				<input
					type="text"
					placeholder="Search recipes..."
					className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
				/>
				<button
					type="button"
					className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium">
					Search
				</button>
			</form>

			{recipe ?
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{recipe.recipes.map((recipe) => (
						<RecipeCard key={recipe.id} recipe={recipe} />
					))}
				</div>
			:	null}
			<div className="text-center mt-8">
				<button
					type="button"
					className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium">
					Load More
				</button>
			</div>
		</main>
	);
}

export default Home;
