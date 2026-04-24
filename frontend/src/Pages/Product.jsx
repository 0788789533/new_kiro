import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:9000/api/products";
const token = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${token()}` });

const empty = { name: "", description: "", price: "", stock: "", category: "", image: "" };

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API, { headers: headers() });
      setProducts(res.data.products);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (p) => { setEditing(p._id); setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, image: p.image }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, form, { headers: headers() });
      } else {
        await axios.post(API, form, { headers: headers() });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/${id}`, { headers: headers() });
      fetchProducts();
    } catch {
      setError("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Products</h2>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
          + Add Product
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">No products yet. Add one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{p.name}</p>
                  <p className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">{p.category}</p>
                </div>
                <p className="text-lg font-bold text-green-600">${p.price}</p>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
              <p className="text-xs text-gray-400">Stock: <span className="font-medium text-gray-700">{p.stock}</span></p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => openEdit(p)} className="flex-1 text-sm border border-blue-500 text-blue-600 py-1.5 rounded-lg hover:bg-blue-50 transition">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="flex-1 text-sm border border-red-400 text-red-500 py-1.5 rounded-lg hover:bg-red-50 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{editing ? "Edit Product" : "Add Product"}</h3>
            {error && <div className="mb-3 p-2 bg-red-100 text-red-600 rounded text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {[
                { label: "Name", name: "name", type: "text" },
                { label: "Category", name: "category", type: "text" },
                { label: "Price", name: "price", type: "number" },
                { label: "Stock", name: "stock", type: "number" },
                { label: "Image URL", name: "image", type: "text" },
              ].map((f) => (
                <div key={f.name}>
                  <label className="text-sm text-gray-600 mb-1 block">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required={f.name !== "image"}
                  />
                </div>
              ))}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700">{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
