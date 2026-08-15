import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/thunks/orderThunks";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders = [], loading = false, error = null } = useSelector(
    (state) => state.orders || {}
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-8">Your Orders</h1>

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : !orders || orders.length === 0 ? (
        <p className="text-ink/50">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id || Math.random()}
              className="bg-white border border-ink/10 rounded-2xl p-5"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-ink/50">
                  Order #{order._id ? order._id.slice(-8) : "N/A"}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    statusColors[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status || "pending"}
                </span>
              </div>
              <div className="divide-y divide-ink/5">
                {order.items?.map((item, i) => (
                  <div key={item._id || i} className="flex justify-between py-2 text-sm">
                    <span>
                      {item.name || "Item"} × {item.quantity || 1}
                    </span>
                    <span>₹{(item.price || 0) * (item.quantity || 1)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-semibold pt-3 border-t border-ink/10 mt-2">
                <span>Total</span>
                <span>₹{order.totalAmount || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;