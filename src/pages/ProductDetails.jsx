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
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const resProduct = await api.get(`/products/${id}`);
        setProduct(resProduct.data || null);
        setSelectedImage(resProduct.data?.primaryImage);

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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i < Math.floor(rating)) {
        return <span key={i} className="text-yellow-400">★</span>;
      } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
        return <span key={i} className="text-yellow-400">⯪</span>;
      }
      return <span key={i} className="text-gray-300">★</span>;
    });
  };

  const handleAddToCart = () => {
    alert(`${quantity} article(s) ajouté(s) au panier !`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-xl text-gray-600 mb-6">Produit introuvable</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          ← Retour
        </button>
      </div>
    );
  }

  const allImages = [
    product.primaryImage,
    ...(product.secondaryImages || [])
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition">
              Accueil
            </button>
            <span>/</span>
            <button onClick={() => navigate(-1)} className="hover:text-indigo-600 transition">
              Produits
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Galerie d'images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                <img
                  src={
                    selectedImage
                      ? `${import.meta.env.VITE_BASE_URL}${selectedImage}`
                      : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                  }
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80";
                  }}
                />
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <span className={`text-2xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
                    {isFavorite ? '❤️' : '🤍'}
                  </span>
                </button>
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img 
                          ? 'border-indigo-600 scale-95' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${img}`}
                        alt={`Vue ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80&sig=${i}`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informations produit */}
            <div className="flex flex-col">
              <div className="flex-1">
                {/* Badges catégories */}
                {product.categories && product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.categories.map((cat, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Titre */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>

                {/* Note et avis */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center text-lg">
                    {renderStars(averageRating)}
                  </div>
                  <span className="text-gray-600 text-sm font-medium">
                    {averageRating.toFixed(1)} ({reviews.length} avis)
                  </span>
                </div>

                {/* Prix */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-indigo-600">{product.price} MAD</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description || "Aucune description disponible."}
                </p>

                {/* Stock */}
                <div className="flex items-center gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">📦</span>
                  <div>
                    <p className="text-sm text-gray-600">Disponibilité</p>
                    <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                    </p>
                  </div>
                </div>

                {/* Quantité et Ajout au panier */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Quantité :</span>
                    <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100 transition text-lg font-semibold disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-6 py-2 border-x-2 border-gray-300 font-semibold min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-2 hover:bg-gray-100 transition text-lg font-semibold disabled:opacity-50"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    <span className="text-xl">🛒</span>
                    {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                  </button>
                </div>

                {/* Avantages */}
                <div className="grid grid-cols-1 gap-3 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🚚</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Livraison rapide</p>
                      <p className="text-xs">Gratuite à partir de 500 MAD</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🛡️</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Garantie 2 ans</p>
                      <p className="text-xs">Sur tous nos produits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">↩️</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Retour gratuit</p>
                      <p className="text-xs">Sous 30 jours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Avis */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 lg:p-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Avis clients ({reviews.length})
            </h2>
            <button className="px-5 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 active:scale-95 transition-all">
              ✍️ Écrire un avis
            </button>
          </div>

          {/* Résumé des notes */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-6 border-b border-gray-200">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 justify-center md:justify-start mb-1 text-xl">
                {renderStars(averageRating)}
              </div>
              <div className="text-sm text-gray-600">{reviews.length} avis</div>
            </div>

            <div className="flex-1 w-full">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-gray-600 w-16">{star} étoiles</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Liste des avis */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">⭐</span>
              <p className="text-gray-500 mb-2">Aucun avis pour le moment</p>
              <p className="text-sm text-gray-400">Soyez le premier à donner votre avis !</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {review.user.fullname.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1">
                      {/* En-tête */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                        <div>
                          <div className="font-semibold text-gray-900">{review.user.fullname}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-0.5">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Commentaire */}
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}