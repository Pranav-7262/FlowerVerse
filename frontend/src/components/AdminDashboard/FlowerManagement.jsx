import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FlowerManagement = ({
  flowers,
  loading,
  formatDate,
  handleDeleteFlower,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-xl border border-rose-200/50 bg-white/70">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-white/50 to-white/30 border-b border-rose-200/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-900">
                Flower Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                  </div>
                </td>
              </tr>
            ) : flowers.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-slate-600 font-medium"
                >
                  No flowers listed yet
                </td>
              </tr>
            ) : (
              flowers.map((flower) => (
                <tr
                  key={flower._id}
                  className="border-b border-rose-200/50 hover:bg-white/50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">>
                    {flower.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="bg-rose-100/50 text-rose-700 px-3 py-1 rounded-full text-xs font-medium border border-rose-200/50">
                      {flower.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-rose-600">
                    ₹{flower.price.toLocaleString()}/kg
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        flower.stock > 0
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {flower.stock} items
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    {formatDate(flower.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => navigate(`/flowers/edit/${flower._id}`)}
                      className="p-2.5 text-blue-600 hover:bg-blue-100/50 rounded-lg transition-all font-medium hover:scale-110 hover:shadow-md border border-blue-200/50"
                      title="Edit flower"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteFlower(flower._id)}
                      className="p-2.5 text-red-600 hover:bg-red-100/50 rounded-lg transition-all font-medium hover:scale-110 hover:shadow-md border border-red-200/50"
                      title="Delete flower"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlowerManagement;
