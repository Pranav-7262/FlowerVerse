import { useState } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Flower2,
  CreditCard,
  Truck,
  MessageCircleMore,
} from "lucide-react";
import api from "../api/axios";

const starterPrompts = [
  "Which flowers are best for birthdays?",
  "How do I place an order?",
  "How are payments handled?",
  "What flowers are good for anniversaries?",
  "How does delivery work?",
];

export default function AiAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Hello! I can help with flower choices, order placement, delivery, and payments.",
  );
  const [loading, setLoading] = useState(false);
  const [featuredPrompt, setFeaturedPrompt] = useState(
    () => starterPrompts[Math.floor(Math.random() * starterPrompts.length)],
  );

  const handleAsk = async (input) => {
    const query = input || question;
    if (!query?.trim()) return;

    setLoading(true);
    setAnswer("Thinking of the best flower-friendly answer...");
    try {
      const res = await api.post("/ai/flower-assistant", { question: query });
      setAnswer(res.data?.data?.answer);
    } catch (error) {
      console.error("Assistant request failed:", error);
      setAnswer(
        error.response?.data?.message ||
          "The assistant is temporarily unavailable. Please try again shortly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[32px] border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-pink-50 shadow-[0_20px_80px_-25px_rgba(244,114,182,0.45)]">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-sm font-semibold text-rose-600 shadow-sm">
              <Sparkles size={16} />
              AI Flower Assistant
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ask about flowers, orders, delivery, and payments
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              This assistant is focused only on flower shopping support so the
              experience stays simple and useful.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-rose-600">
                  <Flower2 size={16} />
                  <span className="font-semibold">Flower guidance</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Get suggestions for birthdays, anniversaries, and special
                  occasions.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-rose-600">
                  <Truck size={16} />
                  <span className="font-semibold">Delivery support</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Ask about delivery timing, shipping, and order tracking.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-rose-600">
                  <CreditCard size={16} />
                  <span className="font-semibold">Payments</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Get quick help with checkout and payment questions.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-rose-600">
                  <MessageCircleMore size={16} />
                  <span className="font-semibold">Order help</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Ask about placing orders or checking what is available.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-rose-100 bg-white/70 p-8 sm:p-10 lg:border-l lg:border-t-0">
            <div className="rounded-[24px] border border-rose-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Bloom Assistant
                  </p>
                  <p className="text-sm text-slate-500">Flower support bot</p>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAsk(featuredPrompt)}
                  className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm text-slate-700 transition hover:border-rose-400 hover:text-rose-600"
                >
                  {featuredPrompt}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFeaturedPrompt(
                      starterPrompts[
                        Math.floor(Math.random() * starterPrompts.length)
                      ],
                    )
                  }
                  className="text-sm font-medium text-rose-600 transition hover:text-rose-700"
                >
                  Try another
                </button>
              </div>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about flowers, orders, delivery, or payments..."
                className="min-h-[100px] w-full rounded-2xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-400"
              />

              <button
                type="button"
                onClick={() => handleAsk(question)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                {loading ? "Thinking..." : "Ask Assistant"}
                {loading ? <Sparkles size={16} /> : <Send size={16} />}
              </button>

              <div className="mt-4 rounded-2xl border border-rose-100 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {loading ? "Searching support answers..." : answer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
