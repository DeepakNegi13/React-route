import { Routes, Route } from "react-router";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Recipe from "./pages/RecipeDetail";

function App() {
  return (
    <div className="min-h-screen bg-background text-text font-sans flex flex-col selection:bg-accent selection:text-white">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<Recipe />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
