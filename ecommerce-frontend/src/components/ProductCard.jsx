import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productId = product._id || product.id;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: 1,
    }));
  };

  return (
    <div 
      onClick={() => navigate(`/products/${productId}`)}
      className="product-card border border-ink/10 rounded-2xl shadow-sm hover:shadow-md transition-all p-4 bg-white flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="w-full h-48 mb-4 overflow-hidden rounded-xl bg-sand flex items-center justify-center">
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-clay">
          {product.category}
        </span>
        <h3 className="text-base font-bold text-ink mt-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-ink/60 mt-1 line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-ink">
            ₹{product.price}
          </span>
          <div className="text-xs text-amber-500 font-medium">
            ★ {product.rating || product.ratings || 4.5}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-ink hover:bg-plum text-paper px-3 py-2 rounded-full text-xs font-medium transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;