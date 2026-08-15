import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink/50 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-clay underline">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-6 h-fit sticky top-24">
            <h3 className="font-display text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink/60">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-ink/60">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-display font-semibold text-lg border-t border-ink/10 pt-4 mb-6">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
            <button onClick={handleCheckout} className="w-full bg-ink text-paper rounded-full py-3 hover:bg-plum transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
