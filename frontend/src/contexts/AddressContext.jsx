import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/get-address");
      setAddress(res.data.data || []);
      return res.data.data;
    } catch (error) {
      console.error("Fetch Address Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const updateAddress = async (addressData) => {
    setLoading(true);
    try {
      const res = await api.put("/auth/update-address", addressData);

      setAddress(res.data.data);
      toast.success("Address updated successfully! 🌸");
      setIsEditing(false);
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };
  const deleteAddress = async () => {
    setLoading(true);
    try {
      await api.delete("/auth/delete-address");
      setAddress([]);
      toast.success("Address removed! 🗑️");
    } catch (error) {
      toast.error("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };
  return (
    <AddressContext.Provider
      value={{
        fetchAddress,
        updateAddress,
        deleteAddress,
        address,
        loading,
        isEditing,
        setIsEditing,
        setAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAdress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useFlower must be used within FlowerProvider");
  }
  return context;
};
