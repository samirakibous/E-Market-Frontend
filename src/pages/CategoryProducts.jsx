import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const CategoryProducts = () => {
  const { id } = useParams(); // récupère l'ID de la catégorie
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/category/${id}`);
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  if (loading) return <p className="text-center py-8">Chargement...</p>;

  return (
    <section className="py-10 px-6 md:px-12">
      <h2 className="text-2xl font-semibold mb-6">Produits de la catégorie</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="border rounded-xl p-4 shadow hover:shadow-lg transition block"
                >
            {/* <div key={p._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4"> */}
              <img
                src={p.primaryImage ? `${import.meta.env.VITE_BASE_URL}${p.primaryImage}` : "https://via.placeholder.com/300"}
                alt={p.title}
              />
              <h3 className="text-gray-800 dark:text-gray-100 font-medium truncate">
                {p.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{p.price} €</p>
             </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Aucun produit trouvé pour cette catégorie.
        </p>
      )}
    </section>
  );
};

export default CategoryProducts;
