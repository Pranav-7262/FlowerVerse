import { useState } from "react";
import { Bot, Sparkles, Send, Gift, ArrowRight } from "lucide-react";
import api from "../api/axios.js";

const quickPrompts = ["Birthday", "Anniversary", "Wedding", "Just Because"];

export default function AIFlowerRecommender() {
  const [form, setForm] = useState({
    occasion: "Birthday",
    budget: "1000",
    recipient: "Friend",
    style: "Romantic",
    note: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(
    "I can help you pick the perfect bouquet for any special moment.",
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Thinking of the best blooms for you...");

    try {
      const res = await api.post("/ai/recommend", form);
      const recommendations = res.data?.data?.recommendations || [];
      setResults(recommendations);
      setStatus(
        recommendations.length
          ? "Here are my top picks for your occasion:"
          : "I could not find a strong match yet, but I’m still here to help.",
      );
    } catch (error) {
      console.error("AI recommendation failed:", error);
      setStatus(
        "The assistant is offline right now, but your flowers are still ready.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto mb-8 w-full max-w-7xl px-4 py-2 sm:px-6 sm:py-4">
      <div className="overflow-hidden rounded-[32px] border border-rose-200/80 bg-gradient-to-br from-rose-50 via-white to-pink-50 shadow-[0_20px_70px_-25px_rgba(244,114,182,0.45)]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-sm font-semibold text-rose-600 shadow-sm">
              <Sparkles size={16} />
              AI Flower Assistant
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Meet your flower bot
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Tell me the occasion, budget, and vibe, and I’ll suggest flowers
              that feel personal and thoughtful.
            </p>

            <div className="mt-6 rounded-2xl border border-rose-100 bg-white/85 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">BloomBot</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {status}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, occasion: prompt }))
                  }
                  className="rounded-full border border-rose-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-rose-400 hover:text-rose-600"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-rose-100 bg-white/70 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  placeholder="Occasion"
                  value={form.occasion}
                  onChange={(e) =>
                    setForm({ ...form, occasion: e.target.value })
                  }
                />
                <input
                  className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  placeholder="Budget"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
                <input
                  className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  placeholder="Recipient"
                  value={form.recipient}
                  onChange={(e) =>
                    setForm({ ...form, recipient: e.target.value })
                  }
                />
                <input
                  className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  placeholder="Style"
                  value={form.style}
                  onChange={(e) => setForm({ ...form, style: e.target.value })}
                />
              </div>

              <textarea
                className="min-h-[90px] w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                placeholder="Add a little note..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                {loading ? "Thinking..." : "Ask BloomBot"}
                {loading ? <Sparkles size={16} /> : <Send size={16} />}
              </button>
            </form>

            {results.length > 0 && (
              <div className="mt-5 space-y-3">
                {results.map((flower) => (
                  <div
                    key={flower._id}
                    className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {flower.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {flower.reason || "A thoughtful pick for your moment"}
                        </p>
                      </div>
                      <div className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
                        {flower.matchScore}%
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <Gift size={14} />
                      <span>₹{flower.price}</span>
                      <ArrowRight size={14} className="ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
