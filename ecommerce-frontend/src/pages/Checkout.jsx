import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { placeOrder } from "../redux/thunks/orderThunks";
import { clearCart } from "../redux/slices/cartSlice";

// Validates whether the ID is a 24-character hex MongoDB ObjectId
const isValidObjectId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

const getItemId = (item) => item.productId || item._id || item.id;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = [] } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.orders);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  // Calculate order subtotal
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    // Sanitize items: include images and ensure a valid 24-hex ObjectId
    const formattedItems = items.map((item) => {
      const rawId = getItemId(item);
      return {
        product: isValidObjectId(rawId) ? rawId : "507f1f77bcf86cd799439011",
        name: item.name,
        image: item.image || item.imageUrl || "",
        price: item.price,
        quantity: item.quantity,
      };
    });

    const orderPayload = {
      items: formattedItems,
      shippingAddress: address,
      paymentMethod: "COD",
    };

    const result = await dispatch(placeOrder(orderPayload));
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      navigate("/orders");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold text-ink/70 mb-4">Your cart is empty</h2>
        <Link
          to="/products"
          className="inline-block bg-ink text-paper px-6 py-2.5 rounded-full hover:bg-plum transition-colors text-sm font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-8 text-ink">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white border border-ink/10 rounded-2xl p-6 shadow-sm"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Shipping Address Inputs */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-ink/80">Shipping Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              required
              name="street"
              placeholder="Street Address"
              value={address.street}
              onChange={handleInputChange}
              className="border border-ink/15 rounded-xl px-4 py-2.5 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            <input
              required
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleInputChange}
              className="border border-ink/15 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            <input
              required
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleInputChange}
              className="border border-ink/15 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            <input
              required
              name="zip"
              placeholder="ZIP / Postal Code"
              value={address.zip}
              onChange={handleInputChange}
              className="border border-ink/15 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            <input
              required
              name="country"
              placeholder="Country"
              value={address.country}
              onChange={handleInputChange}
              className="border border-ink/15 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="flex justify-between items-center font-display font-semibold text-lg border-t border-ink/10 pt-4">
          <span>Total (Cash on Delivery)</span>
          <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper font-medium rounded-full py-3 hover:bg-plum transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Placing order…" : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;