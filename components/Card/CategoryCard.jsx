"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import categoryIcon3 from "../../public/assets/categoryIcon3.png";
import { fetchCategories } from "@/utils/category/helper";

export default function CategoryCard() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const titles = await fetchCategories();
        setCategories(titles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const handleGo = () => {
    if (selected) {
      // router.push(`/user?category=${selected.toLowerCase()}`);
      router.push(`/user?category=${selected}`);
    }
  };

  return (
    <div className="relative w-full max-w-4xl lg:min-h-[420px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">

      <div className="md:w-1/2 h-56 md:h-auto bg-gradient-to-br from-indigo-500/80 to-purple-700/80 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-900/40" />
        <div className="relative text-center text-white px-8 z-10">
          <Image src={categoryIcon3} alt="categoryIcon" width={130} height={130} priority loading="eager" className="mx-auto mb-5" />
          <h2 className="text-2xl font-bold">Find What You Love</h2>
          <p className="text-indigo-200 text-sm mt-2">Pick a category to get started</p>
        </div>
      </div>

      <div className="md:w-1/2 flex flex-col justify-center px-8 py-12 lg:py-16">
        <h1 className="text-2xl font-bold text-white mb-1">Choose a Category</h1>
        <p className="text-white/40 text-sm mb-8">
          Select one category and we'll take you there.
        </p>

        <label className="text-xs font-semibold text-white/50 mb-2 block">
          Category
        </label>

        {error ? (
          <p className="text-red-400 text-sm mb-4">⚠ {error}</p>
        ) : (
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={loading}
            className="w-full bg-white/10 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          >
            <option value="" disabled className="bg-[#1a1a2e]">
              {loading ? "Loading categories..." : "Select a category..."}
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category.title} className="bg-[#1a1a2e]">
                {category.title}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleGo}
          disabled={!selected || loading}
          className={`mt-5 w-full py-3 rounded-xl text-sm font-semibold transition-colors
            ${selected && !loading
              ? "bg-indigo-600 text-white hover:bg-indigo-500"
              : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
        >
          {loading ? "Loading..." : selected ? "Go" : "Select to continue"}
        </button>
      </div>
    </div>
  );
}
