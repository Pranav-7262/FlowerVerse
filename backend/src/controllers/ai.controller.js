import async_handler from "express-async-handler";
import OpenAI from "openai";
import Flower from "../models/flower.model.js";
import { ApiResponse } from "../lib/ApiResponse.js";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const getFallbackRecommendations = (flowers, form = {}) => {
  //this endpoint used for ,when openai is not available, it will use a simple scoring system to recommend flowers based on the form inputs.
  const keywordMap = {
    birthday: ["birthday", "celebration", "joy", "cheerful"],
    anniversary: ["love", "romantic", "anniversary"],
    wedding: ["elegant", "wedding", "special"],
    condolence: ["comfort", "peace", "sympathy"],
    default: ["beautiful", "gift"],
  };

  const query =
    `${form.occasion || ""} ${form.style || ""} ${form.recipient || ""} ${form.note || ""}`.toLowerCase();
  const firstKeyword = query.split(/\s+/)[0] || "default";
  const preferred = keywordMap[firstKeyword] || keywordMap.default;

  return flowers
    .map((flower) => {
      let score = 0;
      const lowerName = flower.name.toLowerCase();
      const lowerCategory = flower.category.toLowerCase();

      if (
        preferred.some(
          (word) => lowerName.includes(word) || lowerCategory.includes(word),
        )
      ) {
        score += 25;
      }
      if (lowerCategory.includes("rose") || lowerName.includes("rose"))
        score += 20;
      if (lowerCategory.includes("orchid") || lowerName.includes("orchid"))
        score += 15;
      if (lowerCategory.includes("lily") || lowerName.includes("lily"))
        score += 12;
      if (
        lowerCategory.includes("sunflower") ||
        lowerName.includes("sunflower")
      )
        score += 10;
      if (Number(form.budget || 0) > 1000) score += 8;
      if (Number(form.budget || 0) < 600) score += 4;

      return { ...flower.toObject(), matchScore: Math.min(score + 40, 99) };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);
};

const buildCatalogReply = (question = "", flowers = []) => {
  const text = (question || "").trim().toLowerCase();

  // Route based on question intent
  if (
    text.includes("order") ||
    text.includes("place") ||
    text.includes("checkout")
  ) {
    return "To place an order, browse our flowers, add them to your cart, and proceed to checkout where you can confirm delivery details and payment.";
  }
  if (
    text.includes("delivery") ||
    text.includes("ship") ||
    text.includes("track")
  ) {
    return "Delivery timing depends on your location. You can select your preferred delivery date during checkout and track your order status.";
  }
  if (
    text.includes("payment") ||
    text.includes("pay") ||
    text.includes("card")
  ) {
    return "We accept various payment methods during checkout. Your payment is processed securely.";
  }
  if (
    text.includes("price") ||
    text.includes("cost") ||
    text.includes("cheap")
  ) {
    return "Prices vary depending on the bouquet. You can browse our collection to see options at different price points.";
  }

  // Default: return flower recommendations
  const tokens = text.split(/\W+/).filter(Boolean);
  const rankedFlowers = flowers
    .map((flower) => {
      const haystack = [
        flower.name,
        flower.category,
        flower.description,
        flower.color,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      let score = 0;
      for (const token of tokens) {
        if (haystack.includes(token)) score += 3;
      }

      return { ...flower.toObject(), score };
    })
    .filter((flower) => flower.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!rankedFlowers.length && flowers.length) {
    const sample = flowers
      .slice(0, 3)
      .map((flower) => flower.name)
      .join(", ");
    return `I can help you find the perfect flowers. Our catalog includes ${sample} and more. What occasion are you shopping for?`;
  }

  const featured = rankedFlowers
    .map((flower) => `${flower.name} (₹${flower.price})`)
    .join(", ");

  return `Here are some options: ${featured}. Would you like to know more about any of these?`;
};

export const projectSearch = async_handler(async (req, res) => {
  const { question } = req.body || {};

  if (!question?.trim()) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "A question is required"));
  }

  const flowers = await Flower.find({ stock: { $gt: 0 } }).limit(20);
  const fallbackAnswer = buildCatalogReply(question, flowers);

  if (!openai) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { answer: fallbackAnswer },
          "AI service unavailable",
        ),
      );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content:
            "You are BloomBot, a friendly flower-shop assistant. Answer questions about flowers, bouquets, orders, delivery, payments, gift ideas, and general shopping support. If the user asks something unrelated, gently guide the conversation back to flower shopping and offer help with flowers, orders, delivery, or payments. Keep the answer short, useful, and warm.",
        },
        { role: "user", content: question },
      ],
    });

    const answer =
      completion.choices[0].message.content?.trim() || fallbackAnswer;
    return res
      .status(200)
      .json(new ApiResponse(200, { answer }, "Flower assistant answer"));
  } catch (error) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { answer: fallbackAnswer }, "AI request failed"),
      );
  }
});

export const recommendFlowers = async_handler(async (req, res) => {
  const form = req.body || {};
  const flowers = await Flower.find({ stock: { $gt: 0 } }).limit(50);

  if (!flowers.length) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { recommendations: [] }, "No flowers available"),
      );
  }

  if (!openai) {
    const recommendations = getFallbackRecommendations(flowers, form);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { recommendations },
          "AI recommendations generated locally",
        ),
      );
  }

  try {
    const catalog = flowers
      .map(
        (flower) =>
          `${flower.name} | category: ${flower.category} | price: ${flower.price} | description: ${flower.description || ""}`,
      )
      .join("\n");

    const prompt = `
      Recommend 4 flowers from this catalog for:
      occasion: ${form.occasion || "gift"}
      budget: ${form.budget || "any"}
      recipient: ${form.recipient || "friend"}
      style: ${form.style || "beautiful"}
      note: ${form.note || ""}

      Return valid JSON:
      {
        "recommendations": [
          { "flowerName": "Rose", "reason": "Romantic and elegant", "matchScore": 95 }
        ]
      }

      Catalog:
      ${catalog}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a helpful florist assistant." },
        { role: "user", content: prompt },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    const recommended = parsed.recommendations || [];

    const matchedFlowers = recommended
      .map((item) => {
        const match = flowers.find(
          (flower) =>
            flower.name.toLowerCase() === item.flowerName?.toLowerCase(),
        );
        if (!match) return null;
        return {
          ...match.toObject(),
          reason: item.reason,
          matchScore: item.matchScore,
        };
      })
      .filter(Boolean);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { recommendations: matchedFlowers },
          "AI recommendations generated",
        ),
      );
  } catch (error) {
    const recommendations = getFallbackRecommendations(flowers, form);
    return res
      .status(200)
      .json(new ApiResponse(200, { recommendations }, "AI fallback used"));
  }
});
