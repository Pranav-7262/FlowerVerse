import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js"; // axios instance
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [flowers, setFlowers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        const res = await api.get("/flowers");
        // console.log("res :", res.data.data.flowers);
        setFlowers(res.data.data.flowers);
      } catch (err) {
        console.error("Failed to load flowers", err);
        setFlowers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowers();
  }, []);

  const filteredFlowers = flowers.filter((flower) =>
    flower.name.toLowerCase().includes(search.toLowerCase()),
  );
  const handleBuyNow = (id) => {
    if (!user) {
      return navigate("/login");
    }
    navigate(`/flowers/${id}`);
  };
  const handleAddToCart = async (flowerId) => {
    if (!user) {
      return navigate("/login");
    }
    try {
      await api.post("/cart/add", {
        flowerId,
        quantity: 1,
      });
      alert("Added to cart 🌸");
    } catch (err) {
      alert("Failed to add to cart");
    }
  };
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl text-white p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Fresh Flowers, Delivered with Love 🌸
          </h1>
          <p className="text-lg text-green-50 max-w-xl">
            Discover beautiful flowers from independent sellers. Buy, gift, or
            add charm to your moments.
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-xl text-lg font-semibold whitespace-nowrap">
          🌼 100% Fresh & Handpicked
        </div>
      </section>

      {/* Search */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search flowers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Products */}
      {loading ? (
        <p className="text-center text-gray-500">Loading flowers...</p>
      ) : filteredFlowers.length === 0 ? (
        <p className="text-center text-gray-500">No flowers found 🌼</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFlowers.map((flower) => (
            <div
              key={flower._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={flower?.image}
                alt={flower?.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold truncate">
                  {flower?.name}
                </h3>

                <p className="text-sm text-gray-500">
                  By{" "}
                  <span className="font-medium">{flower.owner?.userName}</span>
                </p>

                <p className="text-green-600 font-bold">₹{flower.price}</p>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleBuyNow(flower._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Buy
                  </button>

                  <button
                    onClick={() => handleAddToCart(flower._id)}
                    className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg hover:bg-green-50 transition"
                  >
                    Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
