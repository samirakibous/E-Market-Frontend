// src/pages/Shop.jsx
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../services/api";

export default function Shop() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const searchTerm = params.get("search"); // Récupère ?search=...

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Si on a un mot-clé, on appelle l'endpoint de recherche
        const res = searchTerm
          ? await api.get(
              `/products/search?title=${encodeURIComponent(searchTerm)}`
            )
          : await api.get("/products");

        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Erreur de récupération des produits :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Chargement des produits...</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {searchTerm ? `Résultats pour "${searchTerm}"` : "Tous les produits"}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition block"
            >
              <img
                src={
                  product.primaryImage
                    ? `${import.meta.env.VITE_BASE_URL}${product.primaryImage}`
                    : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
                }
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="font-semibold text-lg">{product.title}</h2>
              <p className="text-gray-600">{product.price} MAD</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
