import async_handler from "express-async-handler";
import Flower from "../models/flower.model.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import { askOllama } from "../lib/ollama.js";

export const getFallbackRecommendations = (flowers, form = {}) => {
  const query =
    `${form.occasion || ""} ${form.style || ""} ${form.recipient || ""} ${form.note || ""}`
      .toLowerCase()
      .split(/\W+/)
      .filter(Boolean);
  const budget = Number(form.budget);

  return flowers
    .map((flower) => {
      const searchableText = [
        flower.name,
        flower.category,
        flower.description,
        flower.color,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const keywordScore = query.filter((word) =>
        searchableText.includes(word),
      ).length;
      const budgetScore = Number.isFinite(budget)
        ? Math.max(0, 10 - Math.abs(Number(flower.price) - budget) / 100)
        : 0;
      const score = Math.round(keywordScore * 15 + budgetScore);

      return { ...flower.toObject(), matchScore: Math.min(score, 99) };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
};

export const projectSearch = async_handler(async (req, res) => {
  const { question } = req.body || {};

  if (!question?.trim()) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "A question is required"));
  }

  const flowers = await Flower.find({ stock: { $gt: 0 } }).limit(30);
  const catalog = flowers
    .map(
      (flower) =>
        `id: ${flower._id} | name: ${flower.name} | category: ${flower.category} | price: ${flower.price} | stock: ${flower.stock} | description: ${flower.description || ""}`,
    )
    .join("\n");
  try {
    const answer = await askOllama({
      temperature: 0.5,
      maxTokens: 180,
      messages: [
        {
          role: "system",
          content: `You are BloomBot, a friendly flower-shop assistant. Answer using only the live flower catalog below for product names, prices, availability, and descriptions. Never invent products or details. If a requested product is not in the catalog, say it is not currently available and suggest searching the catalog. For orders, delivery, payments, and general support, provide concise helpful guidance. Keep answers short, useful, and warm.

Live flower catalog:
${catalog}`,
        },
        { role: "user", content: question },
      ],
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { answer }, "Flower assistant answer"));
  } catch (error) {
    console.error("Ollama flower assistant request failed:", error.message);
    return res
      .status(503)
      .json(
        new ApiResponse(
          503,
          null,
          "The Ollama assistant is unavailable. Please make sure Ollama is running with the configured model.",
        ),
      );
  }
});
