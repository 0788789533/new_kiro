import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:9000/api/history";
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const ACTION_COLORS = {
  CREATE_PRODUCT: "bg-green-100 text-green-700",
  UPDATE_PRODUCT: "bg-blue-100 text-blue-700",
  DELETE_PRODUCT: "bg-red-100 text-red-600",
  CREATE_ORDER: "bg-purple-100 text-purple-700",
  UPDATE_ORDER_STATUS: "bg-yellow-100 text-yellow-700",
  CANCEL_ORDER: "bg-red-100 text-red-600",
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await axios.get(API, { headers: headers() });
      setHistory(res.data.history);
    } catch {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleClear = async () => {
    if (!confirm("Clear all history?")) return;
    try {
      await axios.delete(API, { headers: headers() });
      setHistory([]);
    } catch {
      setError("Failed to clear history");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Activity History</h2>
        {history.length > 0 && (
          <button onClick={handleClear} className="text-sm text-red-500 border border-red-300 px-4 py-1.5 rounded-lg hover:bg-red-50 transition">
            Clear All
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">{error}</div>}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">No activity yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((h) => (
            <div key={h._id} className="bg-white rounded-2xl shadow px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${ACTION_COLORS[h.action] || "bg-gray-100 text-gray-600"}`}>
                  {h.action.replace(/_/g, " ")}
                </span>
                <p className="text-sm text-gray-700">{h.description}</p>
              </div>
              <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {new Date(h.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
