import { Routes, Route } from "react-router";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Recipe from "./pages/RecipeDetail";

function App() {
	return (
		<div className="min-h-screen bg-background text-text font-sans">
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />}></Route>
				<Route
					path="/recipe/:id"
					element={
						<Recipe  />
					}></Route>
				<Route path="*" element={<NotFound />}></Route>
			</Routes>
		</div>
	);
}
export default App;
