import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const emptyProduct = { name: "", description: "", price: "", category: "", stock: "", brand: "" };

const Admin = () => {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    const { data } = await axiosInstance.get("/products", { params: { limit: 50 } });
    setProducts(data.products);
  };

  const loadOrders = async () => {
    const { data } = await axiosInstance.get("/orders");
    setOrders(data.orders);
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/products", { ...form, price: Number(form.price), stock: Number(form.stock) });
      setForm(emptyProduct);
      setMessage("Product created");
      loadProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/products/${id}`);
    loadProducts();
  };

  const handleStatusChange = async (id, status) => {
    await axiosInstance.put(`/orders/${id}/status`, { status });
    loadOrders();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-8 border-b border-ink/10">
        {["products", "orders"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-2 capitalize text-sm font-medium ${tab === t ? "border-b-2 border-clay text-clay" : "text-ink/50"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="grid md:grid-cols-3 gap-8">
          <form onSubmit={handleCreate} className="bg-white border border-ink/10 rounded-2xl p-5 space-y-3 h-fit">
            <h3 className="font-semibold mb-2">Add Product</h3>
            {message && <p className="text-xs text-moss">{message}</p>}
            {Object.keys(emptyProduct).map((field) => (
              <input
                key={field}
                required={field !== "brand"}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-ink/15 rounded-xl px-3 py-2 text-sm"
              />
            ))}
            <button type="submit" className="w-full bg-ink text-paper rounded-full py-2 text-sm">Create</button>
          </form>

          <div className="md:col-span-2 space-y-2">
            {products.map((p) => (
              <div key={p._id} className="flex justify-between items-center bg-white border border-ink/10 rounded-xl px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-ink/50">{p.category} · ₹{p.price} · stock {p.stock}</p>
                </div>
                <button onClick={() => handleDelete(p._id)} className="text-red-500">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-ink/10 rounded-xl px-4 py-3 flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">#{order._id.slice(-8)} — {order.user?.name}</p>
                <p className="text-ink/50">₹{order.totalAmount} · {order.items.length} item(s)</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border border-ink/15 rounded-full px-3 py-1"
              >
                {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
