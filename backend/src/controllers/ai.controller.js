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
