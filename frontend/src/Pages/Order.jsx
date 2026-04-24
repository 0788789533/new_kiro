import { useEffect, useState } from "react";
import axios from "axios";

const ORDERS_API = "http://localhost:9000/api/orders";
const PRODUCTS_API = "http://localhost:9000/api/products";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(ORDERS_API, { headers: headers() });
      setOrders(res.data.orders);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    axios.get(PRODUCTS_API, { headers: headers() }).then((r) => setProducts(r.data.products));
  }, []);

  const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(ORDERS_API, { items, shippingAddress }, { headers: headers() });
      setShowModal(false);
      setItems([{ productId: "", quantity: 1 }]);
      setShippingAddress("");
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await axios.put(`${ORDERS_API}/${id}/cancel`, {}, { headers: headers() });
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Orders</h2>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
          + New Order
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">No orders yet.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm text-gray-700">{o._id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[o.status]}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                  <p className="font-bold text-green-600">${o.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">📍 {o.shippingAddress}</p>
              <div className="border-t pt-3 flex flex-col gap-1">
                {o.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-600">
                    <span>{item.product?.name || "Product"} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {o.status === "pending" && (
                <button onClick={() => handleCancel(o._id)} className="mt-3 text-sm text-red-500 border border-red-300 px-3 py-1 rounded-lg hover:bg-red-50 transition">
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Place New Order</h3>
            {error && <div className="mb-3 p-2 bg-red-100 text-red-600 rounded text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Shipping Address</label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">Items</label>
                {items.map((item, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(i, "productId", e.target.value)}
                      className="flex-1 border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>{p.name} — ${p.price}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value))}
                      className="w-20 border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 px-2">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:underline mt-1">+ Add item</button>
              </div>

              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">Place Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
