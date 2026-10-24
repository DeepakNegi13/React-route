import { Routes, Route } from "react-router";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { useParams } from "react-router";
import Recipe from "./pages/Recipe";

function RecipePage() {
	const { id } = useParams();
  return id;
}
function App() {
	return (
		<div className="min-h-screen bg-background text-text font-sans">
			<Navbar />
			<Routes>
				<Route path="/Home" element={<Home />}></Route>
				<Route path="/home/recipe/:id" element={<Recipe id={RecipePage}/>}></Route>
				<Route path="*" element={<NotFound />}></Route>
			</Routes>
		</div>
	);
}
export default App;
