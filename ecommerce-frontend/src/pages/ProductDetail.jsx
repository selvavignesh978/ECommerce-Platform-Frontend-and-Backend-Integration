import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchRecommendations } from "../redux/thunks/productThunks";
import { clearSelectedProduct } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import ProductCard from "../components/ProductCard";

import {
  FiStar,
  FiShoppingBag,
  FiArrowLeft,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiMessageSquare,
  FiSend,
  FiUser,
} from "react-icons/fi";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct: product, recommendations, loading } = useSelector(
    (state) => state.products
  );

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Local state for interactive public reviews
  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewer: "Ramesh Kumar",
      rating: 5,
      comment: "Absolutely amazing product! Exceeded my expectations, and shipping was fast.",
      date: "12/06/2026",
    },
    {
      id: 2,
      reviewer: "Sneha J.",
      rating: 4,
      comment: "Very solid build quality. Highly recommended for daily use.",
      date: "10/06/2026",
    },
  ]);

  // Review Form Controls
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewerRating] = useState(5);
  const [reviewComment, setReviewerComment] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchRecommendations(id));
    }
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0] || "",
        stock: product.stock,
        quantity: qty,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newReview = {
      id: Date.now(),
      reviewer: reviewerName.trim() || "Anonymous Shopper",
      rating: Number(reviewRating),
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString("en-IN"),
    };

    setReviews([newReview, ...reviews]);
    setReviewerName("");
    setReviewerComment("");
    setReviewerRating(5);
  };

  if (loading || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-ink/50 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ink"></div>
        <span>Loading product details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink transition-colors font-medium"
      >
        <FiArrowLeft /> Back to Previous View
      </button>

      {/* Main Product Showcase Card */}
      <div className="bg-white border border-ink/10 rounded-3xl p-6 md:p-10 shadow-sm grid md:grid-cols-2 gap-10">
        {/* Left Visual Preview Box */}
        <div className="aspect-square bg-sand rounded-2xl flex items-center justify-center overflow-hidden border border-ink/5">
          {product.image || product.images?.[0] ? (
            <img
              src={product.image || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/500x500?text=Image+Unavailable";
              }}
            />
          ) : (
            <span className="font-display text-7xl text-ink/20 uppercase">
              {product.name?.charAt(0)}
            </span>
          )}
        </div>

        {/* Right Metadata Workspace */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="inline-block text-xs uppercase tracking-widest text-clay font-bold bg-sand px-3 py-1 rounded-full mb-3">
              {product.category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-sm text-ink/70 mb-4">
              <span className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-bold text-xs border border-amber-200/60">
                <FiStar className="fill-amber-400 text-amber-400" />
                {product.ratings ? product.ratings.toFixed(1) : "4.2"}
              </span>
              <span className="text-xs text-ink/50">
                ({product.numReviews || reviews.length} verified reviews)
              </span>
            </div>

            <p className="text-ink/80 leading-relaxed text-sm sm:text-base mb-6">
              {product.description}
            </p>

            <div className="border-t border-b border-ink/10 py-4 mb-4">
              <p className="font-display text-3xl font-bold">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
              <p
                className={`text-xs mt-1 font-semibold ${
                  product.stock > 0 ? "text-moss" : "text-red-500"
                }`}
              >
                {product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
              </p>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-ink/20 rounded-full bg-sand/30">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 hover:bg-ink/5 rounded-l-full font-bold transition"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                  className="w-10 h-10 hover:bg-ink/5 rounded-r-full font-bold transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-ink text-paper rounded-full py-3.5 px-6 flex items-center justify-center gap-2 hover:bg-plum transition-all font-semibold shadow-sm active:scale-[0.98] disabled:opacity-40"
              >
                <FiShoppingBag /> {added ? "Added to Cart!" : "Add to Cart"}
              </button>
            </div>

            {/* Service Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center text-xs text-ink/60 border-t border-ink/10 font-medium">
              <div className="flex flex-col items-center gap-1">
                <FiTruck className="text-clay text-base" />
                <span>Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FiRefreshCw className="text-clay text-base" />
                <span>7-Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FiShield className="text-clay text-base" />
                <span>Verified Brand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Reviews Section */}
      <div className="bg-white border border-ink/10 rounded-3xl p-6 md:p-10 space-y-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2 border-b border-ink/10 pb-4">
          <FiMessageSquare className="text-clay" /> Public Reviews & Feedback
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <form
            onSubmit={handleReviewSubmit}
            className="lg:col-span-1 bg-sand/40 p-5 rounded-2xl border border-ink/10 space-y-4 h-fit"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink/70">
              Write a Review
            </h3>

            <div>
              <label className="block text-xs font-semibold text-ink/60 mb-1">Your Name</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Selva Vignesh"
                className="w-full p-2.5 text-sm border border-ink/15 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/60 mb-1">Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewerRating(Number(e.target.value))}
                className="w-full p-2.5 text-sm border border-ink/15 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-ink font-medium"
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐★ 4 Stars</option>
                <option value="3">⭐⭐⭐★★ 3 Stars</option>
                <option value="2">⭐⭐★★★ 2 Stars</option>
                <option value="1">⭐★★★★ 1 Star</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/60 mb-1">Comments</label>
              <textarea
                rows="3"
                required
                value={reviewComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-2.5 text-sm border border-ink/15 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-ink resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-ink text-paper py-2.5 rounded-xl text-sm font-semibold hover:bg-plum transition flex items-center justify-center gap-2"
            >
              <FiSend className="text-xs" /> Submit Review
            </button>
          </form>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4 max-h-[420px] overflow-y-auto pr-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Latest Reviews ({reviews.length})
            </h3>
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="border border-ink/10 bg-white p-4 rounded-2xl flex gap-3 items-start"
              >
                <div className="p-2 bg-sand text-ink rounded-full shrink-0">
                  <FiUser className="text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-ink truncate">{rev.reviewer}</h4>
                    <span className="text-xs text-ink/40">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 my-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FiStar
                        key={idx}
                        className={`text-xs ${
                          idx < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-ink/15"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-ink/75 leading-relaxed">{rev.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <section className="pt-6">
          <h2 className="font-display text-2xl font-semibold mb-1">You might also like</h2>
          <p className="text-xs text-ink/50 mb-6">
            Recommendations powered by the RapidMiner similarity model
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {recommendations.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;