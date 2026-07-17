import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Truck,
  Shield,
  Award,
  Star,
  Mail,
  Send,
  ChevronRight,
  Sparkles,
  BarChart3,
  Users,
  Flower2,
  Gift,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFlower } from "../contexts/FlowerContext";
import { useCart } from "../contexts/CartContext";

// Components
import FilterPanel from "../components/FilterPanel";
import FlowerCard from "../components/FlowerCard";
import SortDropdown from "../components/SortDropdown";
import ExploreBouquets from "../components/ExploreBouquets";
import AIFlowerRecommender from "../components/AIFlowerRecommender";

const CATEGORIES = [
  "All",
  "Roses",
  "Tulips",
  "Daisies",
  "Lilies",
  "Orchids",
  "Sunflowers",
  "Lotus",
  "Hibiscus",
  "Jasmines",
  "Marigolds",
  "Carnations",
  "Mixed Bouquets",
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "A → Z", value: "name_asc" },
];

const PRICE_MAX = 2000;

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹500",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Heart,
    title: "Fresh Flowers",
    description: "Guaranteed quality blooms",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "100% safe transactions",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Trusted by thousands",
    color: "from-amber-500 to-orange-500",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Regular Customer",
    text: "The flowers are absolutely stunning! Best quality I've ever received.",
    rating: 5,
    avatar: "🌸",
  },
  {
    name: "Amit Kumar",
    role: "Corporate Client",
    text: "Exceptional service and delivery. Highly recommended for bulk orders.",
    rating: 5,
    avatar: "🌹",
  },
  {
    name: "Priya Sharma",
    role: "Event Planner",
    text: "Consistent excellence. Our events wouldn't be complete without them!",
    rating: 5,
    avatar: "🌺",
  },
];

const STATS = [
  { label: "Happy Customers", value: "10K+", icon: Users },
  { label: "Flowers Delivered", value: "50K+", icon: Flower2 },
  { label: "Daily Orders", value: "500+", icon: Gift },
  { label: "Years Experience", value: "5+", icon: Award },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    flowers = [],
    filteredFlowers = [],
    search,
    selectedCategory,
    loading,
    currentPage,
    totalFlowers,
    ITEMS_PER_PAGE,
    fetchFlowers,
    searchFlowers,
    filterByCategory,
    setCurrentPage,
  } = useFlower();
  const { addToCart } = useCart();

  const [email, setEmail] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize flowers on first mount
  useEffect(() => {
    if (!hasInitialized) {
      fetchFlowers("All", 1);
      setHasInitialized(true);
    }
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, priceRange, sortBy]);

  // Handle category filter changes
  useEffect(() => {
    if (selectedCategory !== "All") {
      fetchFlowers(selectedCategory, 1);
    }
  }, [selectedCategory]);

  // Combined Filtering & Sorting Logic
  const filteredAndSorted = (
    filteredFlowers.length > 0 ? filteredFlowers : flowers
  )
    .filter((f) => f.price >= priceRange[0] && f.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "newest")
        return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
      return 0;
    });

  // Simple pagination using slice
  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayed = filteredAndSorted.slice(startIndex, endIndex);

  const activeFilters =
    selectedCategory !== "All" ||
    priceRange[0] > 0 ||
    priceRange[1] < PRICE_MAX;

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Newsletter subscription handler
  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeLoading(true);
    try {
      // Simulate subscription (integrate with your backend later)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmail("");
      alert("Thank you for subscribing!");
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Fixed Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-rose-200/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-100/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full">
        {/* ===== HERO BANNER SECTION ===== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 mb-8 sm:mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-rose-50 border border-rose-200/50 rounded-full">
                <Sparkles size={16} className="text-rose-600" />
                <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
                  Premium Flower Collection
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 leading-tight">
                Bloom Your Way to Joy
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Discover our exquisite collection of fresh, handpicked flowers.
                Perfect for every occasion and celebration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    document
                      .querySelector('[id="flowers-grid"]')
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Explore Now <ArrowRight size={20} />
                </motion.button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative h-96 md:h-full hidden md:block"
            >
              <div className="absolute inset-0 bg-linear-to-br from-rose-200/20 to-pink-200/20 rounded-3xl flex items-center justify-center border border-rose-200/50">
                <div className="text-center">
                  <Flower2
                    size={120}
                    className="text-rose-400 mx-auto mb-4 opacity-50"
                  />
                  <p className="text-gray-500 font-semibold">
                    Fresh Flowers Daily
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-2 sm:py-4">
          <AIFlowerRecommender />
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 mb-8 sm:mb-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-rose-200"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${feature.color} p-3 mb-3 text-white`}
                  >
                    <IconComponent size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ===== STATS SECTION ===== */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 mb-8 sm:mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-3">
                    <IconComponent className="text-rose-600" size={32} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ===== TESTIMONIALS SECTION ===== */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 mb-8 sm:mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of happy customers who trust us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ===== EXPLORE BOUQUETS SECTION ===== */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 mb-8 sm:mb-12"
        >
          <ExploreBouquets />
        </motion.section>

        {/* ===== FLOWERS GRID SECTION ===== */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          id="flowers-grid"
          className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 pb-16 sm:pb-20"
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 mb-2 px-4 py-1 bg-rose-50 border border-rose-200/50 rounded-full">
              <Flower2 size={16} className="text-rose-600" />
              <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
                Our Collection
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Explore Flowers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our magnificent selection of fresh, handpicked flowers,
              carefully curated for every special moment
            </p>
          </motion.div>

          {/* Unified Search & Action Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            {/* Search Input */}
            <div className="relative flex-1 min-w-70 group">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors duration-300"
              />
              <input
                type="text"
                placeholder="Search our collection..."
                value={search}
                onChange={(e) => searchFlowers(e.target.value)}
                className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/70 border border-rose-200/50 text-slate-800 placeholder-slate-500 shadow-md focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/50 transition-all backdrop-blur-sm outline-none"
              />
            </div>

            {/* Sort & Filter Group */}
            <div className="flex items-center gap-3">
              <SortDropdown
                options={SORT_OPTIONS}
                activeSort={sortBy}
                onSortChange={setSortBy}
                isOpen={sortOpen}
                setIsOpen={setSortOpen}
              />

              <button
                onClick={() => {
                  setPanelOpen(!panelOpen);
                  setSortOpen(false);
                }}
                className={`h-14 px-8 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                  panelOpen || activeFilters
                    ? "bg-rose-600 border-rose-500 text-white shadow-[0_10px_30px_-5px_rgba(225,29,72,0.4)]"
                    : "bg-white/60 text-slate-600 border-rose-200/50 hover:border-rose-400/50 hover:text-slate-900"
                }`}
              >
                <SlidersHorizontal size={14} strokeWidth={3} />
                {activeFilters ? "Filters Active" : "Filters"}
              </button>

              {activeFilters && (
                <button
                  onClick={() => {
                    filterByCategory("All");
                    setPriceRange([0, PRICE_MAX]);
                    searchFlowers("");
                  }}
                  className="h-14 px-6 rounded-2xl bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-300/50"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {panelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-10 p-6 bg-white/60 border border-rose-200/50 rounded-[2.5rem] backdrop-blur-md shadow-lg"
              >
                <FilterPanel
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onCategoryChange={filterByCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  PRICE_MAX={PRICE_MAX}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flowers Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 bg-linear-to-br from-rose-100/30 to-pink-100/20 rounded-3xl animate-pulse"
                />
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {displayed.length > 0 ? (
                  displayed.map((flower) => (
                    <FlowerCard
                      key={flower._id}
                      flower={flower}
                      onNavigate={() => navigate(`/flowers/${flower._id}`)}
                      onAddToCart={(id) =>
                        user ? addToCart(id, 1) : navigate("/login")
                      }
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-32">
                    <div className="inline-flex p-6 rounded-full bg-rose-100/50 border border-rose-200 mb-4">
                      <Search size={32} className="text-rose-600/60" />
                    </div>
                    <p className="text-slate-600 text-sm font-bold uppercase tracking-widest mb-2">
                      No flowers found
                    </p>
                    <p className="text-slate-500 text-xs">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Flowers Count Info */}
          {!loading && filteredAndSorted.length > 0 && (
            <div className="mt-6 text-center text-sm text-slate-600">
              Showing{" "}
              <span className="font-bold text-rose-700">
                {Math.min(displayed.length, ITEMS_PER_PAGE)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-rose-700">
                {filteredAndSorted.length}
              </span>{" "}
              flowers
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && displayed.length > 0 && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700 hover:shadow-lg"
                }`}
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                        pageNum === currentPage
                          ? "bg-rose-600 text-white shadow-lg"
                          : "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700 hover:shadow-lg"
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
