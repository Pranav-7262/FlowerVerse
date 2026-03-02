import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const FlowerContext = createContext();

export const FlowerProvider = ({ children }) => {
  const [flowers, setFlowers] = useState([]);
  const [filteredFlowers, setFilteredFlowers] = useState([]);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchFlowers = async (category = "All") => {
    setLoading(true);
    try {
      const endpoint =
        category === "All" ? "/flowers" : `/flowers?category=${category}`;
      const res = await api.get(endpoint);
      const flowersData = res.data.data.flowers || [];
      setFlowers(flowersData);
      setFilteredFlowers(flowersData);
      return flowersData;
    } catch (err) {
      console.error("Error fetching flowers:", err);
      setFlowers([]);
      setFilteredFlowers([]);
      toast.error("Failed to load flowers");
    } finally {
      setLoading(false);
    }
  };

  const fetchFlowerById = async (flowerId) => {
    setLoading(true);
    try {
      const res = await api.get(`/flowers/${flowerId}`);
      const flower = res.data.data;
      setSelectedFlower(flower);
      return flower;
    } catch (err) {
      console.error("Error fetching flower:", err);
      toast.error("Failed to load flower details");
    } finally {
      setLoading(false);
    }
  };

  const searchFlowers = (query) => {
    setSearch(query);
    const filtered = flowers.filter((flower) =>
      flower.name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredFlowers(filtered);
  };

  const filterByCategory = async (category) => {
    setSelectedCategory(category);
    await fetchFlowers(category);
  };

  const createFlower = async (flowerData) => {
    try {
      const res = await api.post("/flowers/create-flower", flowerData);
      toast.success("Flower created successfully!");
      setFlowers([...flowers, res.data.data]);
      return res.data.data;
    } catch (err) {
      console.error("Error creating flower:", err);
      toast.error(err.response?.data?.message || "Failed to create flower");
      throw err;
    }
  };

  const updateFlower = async (flowerId, flowerData) => {
    try {
      const res = await api.patch(
        `/flowers/update-flower/${flowerId}`,
        flowerData,
      );

      toast.success("Flower updated successfully!");
      const updatedFlowers = flowers.map((f) =>
        f._id === flowerId ? res.data.data : f,
      );
      setFlowers(updatedFlowers);
      setSelectedFlower(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Error updating flower:", err);
      toast.error(err.response?.data?.message || "Failed to update flower");
      throw err;
    }
  };

  const deleteFlower = async (flowerId) => {
    try {
      await api.delete(`/flowers/delete-flower/${flowerId}`);
      toast.success("Flower deleted successfully!");
      const updatedFlowers = flowers.filter((f) => f._id !== flowerId);
      setFlowers(updatedFlowers);
      setFilteredFlowers(updatedFlowers);
      setSelectedFlower(null);
    } catch (err) {
      console.error("Error deleting flower:", err);
      toast.error(err.response?.data?.message || "Failed to delete flower");
      throw err;
    }
  };

  const addToCart = async (flowerId, quantity = 1) => {
    try {
      const res = await api.post("/cart/add", { flowerId, quantity });
      toast.success("Added to cart 🌸");
      return res.data;
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
      throw err;
    }
  };

  return (
    <FlowerContext.Provider
      value={{
        flowers,
        filteredFlowers,
        selectedFlower,
        loading,
        search,
        selectedCategory,
        fetchFlowers,
        fetchFlowerById,
        searchFlowers,
        filterByCategory,
        createFlower,
        updateFlower,
        deleteFlower,
        addToCart,
      }}
    >
      {children}
    </FlowerContext.Provider>
  );
};

export const useFlower = () => {
  const context = useContext(FlowerContext);
  if (!context) {
    throw new Error("useFlower must be used within FlowerProvider");
  }
  return context;
};
