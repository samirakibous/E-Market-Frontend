import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const toggleDark = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem("darkMode", newDark);
    document.documentElement.classList.toggle("dark", newDark);
  };

  return (
    <header className="bg-black text-white p-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
      <h1 className="text-xl font-bold">
        <Link to="/">skommerce</Link>
      </h1>

      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-2 py-1 rounded text-black focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          🔍
        </button>
      </form>

      <nav className="space-x-4">
        <Link className="hover:underline" to="/">Home</Link>
        <Link className="hover:underline" to="/shop">Shop</Link>
        <Link className="hover:underline" to="/cart">Cart</Link>
        <Link className="hover:underline" to="/login">Login</Link>
        <button
          onClick={toggleDark}
          className="ml-4 px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-900 transition"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </nav>
    </header>
  );
}
