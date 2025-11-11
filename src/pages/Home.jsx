import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // 🔹 Récupérer les catégories
    api
      .get("/categories")
      .then((res) => {
        setCategories(res.data.categories || []);
      })
      .catch((err) => console.error("Erreur récupération catégories :", err));

    // 🔹 Récupérer tous les produits publiés
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        console.log("product res", res);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Erreur récupération produits :", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div
        className="w-full h-96 bg-cover bg-center relative dark:bg-gray-800"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80')",
        }}
      >
  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-pink-900/60 dark:from-purple-950/80 dark:to-pink-950/80 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg mb-4 dark:text-yellow-300">
              Bienvenue sur <span className="text-yellow-400">Skommerce</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto px-4 dark:text-white/80">
              Découvrez nos produits exceptionnels à des prix imbattables
            </p>
          </div>
        </div>
      </div>

      {/* Catégories */}
  <section className="py-10 px-6 md:px-12 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Parcourez les catégories
          </h2>
          <button
            className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
            onClick={() => navigate("/categories")}
          >
            Voir tout
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <div
                key={cat._id}
                className="flex-shrink-0 w-44 h-48 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
                onClick={() => navigate(`/category/${cat._id}`)}
              >
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 rounded-t-2xl overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${cat._id}/500/400`}
                    alt={cat.name || "Category"}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&size=500&background=random`;
                    }}
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-gray-800 dark:text-gray-100 font-medium truncate">
                    {cat.name || "Nom catégorie"}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Aucune catégorie trouvée.</p>
            </div>
          )}
        </div>
      </section>

      {/* Tous les produits */}
  <section className="py-10 px-6 md:px-12 dark:bg-gray-900">
  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Tous les produits
        </h2>

        {loadingProducts ? (
          <div className="flex items-center justify-center min-h-40 text-gray-500 dark:text-gray-400">
            Chargement des produits...
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg p-4 cursor-pointer hover:-translate-y-1 transition"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={
                    product.primaryImage
                    //   ? `http://16.16.253.155:8000${product.primaryImage}`
                      ? `${import.meta.env.VITE_BASE_URL}${product.primaryImage}`
                      : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
                  }
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="text-gray-800 dark:text-gray-100 font-medium truncate">
                  {product.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 truncate">
                  {product.description || "Aucune description"}
                </p>
                <p className="text-indigo-600 dark:text-yellow-300 font-semibold mt-2">
                  {product.price} MAD
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Aucun produit disponible.</p>
        )}
      </section>
    </div>
  );
}