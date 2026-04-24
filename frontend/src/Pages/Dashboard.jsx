import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Routes, Route } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Profile from "./Profile";
import Product from "./Product";
import Order from "./Order";
import History from "./History";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }

    axios
      .get("http://localhost:9000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            Welcome back, <span className="font-semibold text-gray-800">{user.firstname} {user.lastname}</span>
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </header>

        <main className="p-8 flex-1">
          <Routes>
            <Route path="profile" element={<Profile user={user} />} />
            <Route path="product" element={<Product />} />
            <Route path="order" element={<Order />} />
            <Route path="history" element={<History />} />
            <Route path="*" element={<Profile user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
