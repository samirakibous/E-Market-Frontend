import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const resProduct = await api.get(`/products/${id}`);
        setProduct(resProduct.data || null);

        const resReviews = await api.get(`/reviews/product/${id}`);
        console.log("reviews res", resReviews);
        setReviews(resReviews.data.data || []);
        setAverageRating(resReviews.data.averageRating || 0);
      } catch (err) {
        console.error("Erreur récupération produit ou reviews :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Chargement du produit...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500">
        <p>Produit introuvable 😕</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Retour
        </button>
      </div>
    );
  }

  // Fonction pour afficher les étoiles avec demi-étoile
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) return <span key={i}>★</span>;
      if (i === fullStars && hasHalfStar) return <span key={i}>⯪</span>; // demi-étoile
      return <span key={i}>☆</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-12">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-2xl p-6 md:p-10 grid md:grid-cols-2 gap-8">
        {/* Images du produit */}
        <div>
          <img
            src={
              product.primaryImage
                ? `${import.meta.env.VITE_BASE_URL}${product.primaryImage}`
                : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
            }
            alt={product.title}
            className="w-full h-80 object-cover rounded-xl mb-4"
          />

          {product.secondaryImages && product.secondaryImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.secondaryImages.map((img, i) => (
                <img
                  key={i}
                  src={`${import.meta.env.VITE_BASE_URL}${img}`}
                  alt={`image-${i}`}
                  className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                />
              ))}
            </div>
          )}
        </div>

        {/* Détails du produit */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            {product.title}
          </h1>
         <p className="text-gray-600 text-sm mb-4">
  Catégories :{" "}
  <span className="font-medium text-gray-800">
    {product.categories && product.categories.length > 0
      ? product.categories.map((cat) => cat.name).join(", ")
      : "Inconnue"}
  </span>
</p>

          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description || "Aucune description disponible."}
          </p>

          <p className="text-2xl font-semibold text-indigo-600 mb-6">
            {product.price} MAD
          </p>
          <p className="text-gray-700 mb-2">
  Stock :{" "}
  <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
    {product.stock > 0 ? `${product.stock} disponible(s)` : "Rupture de stock"}
  </span>
</p>


          <button
            onClick={() => alert("Ajouté au panier !")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Section Reviews */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-2">Avis ({reviews.length})</h2>

        <div className="flex items-center mb-4 text-yellow-500 text-lg">
          {renderStars(averageRating)}
          <span className="ml-2 text-gray-600 text-base">
            ({averageRating.toFixed(1)} / 5)
          </span>
        </div>

        {reviews.length === 0 ? (
          <p className="text-gray-500">Aucun avis pour ce produit.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border p-4 rounded-lg bg-gray-50"
              >
                <div className="flex items-center mb-2">
                  {review.user.avatar && (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}${review.user.avatar}`}
                      alt={review.user.fullname}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <span className="font-semibold">{review.user.fullname}</span>
                </div>

                <div className="mb-2 text-yellow-500 text-lg">
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-700">{review.comment}</p>
                <small className="text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
