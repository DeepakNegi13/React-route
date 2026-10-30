import axios from "axios";
import { useEffect, useState } from "react";
import RecipeCard from "../Components/Recipecard";

function Home() {
	const [recipe, setRecipe] = useState([]);
	const [total, setTotal] = useState(0);
	async function fetchApi(skip) {
		try {
			const { data } = await axios.get(
				`https://dummyjson.com/recipes?limit=6&skip=${skip}`,
			);
			
			setRecipe((prev)=>[...prev,...data.recipes]);
			setTotal(data.total);
			
		} catch (error) {
			console.error("Failed to load recipes:", error);
		}
	}

	async function searchRecipies(query) {
		try {
			const { data } = await axios.get(`https://dummyjson.com/recipes/search?q=${query}`);
			setRecipe(data.recipes);
			setTotal(data.total);
		} catch (error) {
			console.error("Failed to search recipes:", error);
		}
	}
	
	function search(e){
		e.preventDefault();
		const formData = new FormData(e.target)
		const input = formData.get("query")
		console.log(input);
		searchRecipies(input);
	}

	useEffect(() => {
		fetchApi(0);
	}, []);

	return (
		<main className="max-w-6xl mx-auto px-4 py-8">
			<form onSubmit={search} className="flex gap-2 max-w-md mx-auto mb-8">
				<input
					type="text"
					name = "query"
					placeholder="Search recipes..."
					className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
				/>
				<button
					type="submit"
					className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium">
					Search
				</button>
			</form>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{recipe.map((recipe) => (
					<RecipeCard key={recipe.id} recipe={recipe} />
				))}
			</div>

			{recipe.length<total?<div className="text-center mt-8">
				<button
					onClick={() => {
						fetchApi(recipe.length);
					}}
					type="button"
					className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium">
					Load More
				</button>
			</div>:<div className=""></div>}
		</main>
	);
}

export default Home;
