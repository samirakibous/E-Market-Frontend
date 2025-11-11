// src/pages/CategoryProducts.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function CategoryProducts() {
  const { id } = useParams(); // Récupérer l'ID de la catégorie depuis l'URL
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔎 Catégorie sélectionnée :", id);

        // 🔹 Récupérer tous les produits publiés
        const res = await api.get(`/products/published`);
        console.log("🧾 Tous les produits :", res.data);

        // 🔹 Filtrer les produits par catégorie côté frontend
        const filteredProducts = res.data.data.filter((p) =>
          p.categories.some((c) => (c._id ? c._id.toString() : c.toString()) === id)
        );
        console.log("✅ Produits filtrés :", filteredProducts);
        setProducts(filteredProducts);

        // 🔹 Récupérer le nom de la catégorie
        const catRes = await api.get(`/categories`);
        const currentCat = catRes.data.categories.find((c) => c._id === id);
        setCategoryName(currentCat?.name || "Produits");
      } catch (error) {
        console.error("❌ Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Chargement des produits...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        {categoryName}
      </h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow hover:shadow-lg p-4 cursor-pointer hover:-translate-y-1 transition"
            >
              <img
                src={
                  product.primaryImage
                    ? `http://16.16.253.155:8000${product.primaryImage}`
                    : "https://source.unsplash.com/400x300/?product"
                }
                alt={product.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-gray-800 font-medium truncate">
                {product.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1 truncate">
                {product.description || "Aucune description"}
              </p>
              <p className="text-indigo-600 font-semibold mt-2">
                {product.price} MAD
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Aucun produit trouvé pour cette catégorie.
        </p>
      )}
    </div>
  );
}
