import async_handler from "express-async-handler";
import jwt from "jsonwebtoken";
import Flower from "../models/flower.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import { ApiError } from "../lib/ApiError.js";

export const getAllFlowers = async_handler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query; // pagination and category filter

  const filter = { stock: { $gt: 0 } }; // only get flowers that are in stock or available flowers
  if (category) filter.category = category;

  const flowers = await Flower.find(filter)
    .populate("owner", "userName")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res
    .status(200)
    .json(new ApiResponse(200, { flowers: flowers }, "All flowers"));
});

export const getFlowerById = async_handler(async (req, res) => {
  const flowerId = req.params.flowerId;
  const flower = await Flower.findById(flowerId)
    .populate("owner", "userName")
    .populate({
      path: "reviews",
      populate: { path: "reviewer", select: "userName" },
    });
  if (!flower) {
    throw new ApiError(404, "Flower not found");
  }
  return res.status(200).json(new ApiResponse(200, flower, "Flower details"));
});

export const getMyFlowers = async_handler(async (req, res) => {
  const userId = req.userId;
  const myFlowers = await Flower.find({ owner: userId });
  if (!myFlowers) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No flowers found for this user"));
  }
  return res.status(200).json(
    new ApiResponse( //need a response like total flowers and data
      200,
      { total: myFlowers.length, MyFlowers: myFlowers }, //myFlowers is an array of objects
      "My flowers fetched successfully",
    ),
  );
});

export const createFlower = async_handler(async (req, res) => {
  const userId = req.userId;
  const { name, price, image, description, category, stock } = req.body;
  if (
    [name, price, category].some((field) => field?.toString().trim() === "")
  ) {
    throw new ApiError(400, "Name, price ,category and image are required");
  }
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) throw new ApiError(400, "Flower image is required");

  const imageCloud = await uploadOnCloudinary(imageLocalPath);
  console.log("Cloudinary upload result:", imageCloud);
  if (!imageCloud) throw new ApiError(400, "Error while uploading image");

  const flower = await Flower.create({
    name,
    price,
    image: imageCloud.url, // Cloudinary URL,
    description,
    category,
    stock,
    owner: userId,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, flower, "Flower created successfully"));
});
export const updateFlower = async_handler(async (req, res) => {
  const userId = req.userId;
  const flowerId = req.params.flowerId;
  const userRole = req.user?.role; // Get user role from auth middleware

  const query = { _id: flowerId };
  if (userRole !== "admin") {
    query.owner = userId;
  }

  const flower = await Flower.findOne(query);

  if (!flower) {
    throw new ApiError(404, "Flower not found");
  }
  Object.assign(flower, req.body); // update flower details with request body .
  await flower.save();
  return res
    .status(200)
    .json(new ApiResponse(200, flower, "Flower updated successfully"));
});
export const deleteFlower = async_handler(async (req, res) => {
  const userId = req.userId;
  const flowerId = req.params.flowerId;
  const userRole = req.user?.role;

  const query = { _id: flowerId };
  if (userRole !== "admin") {
    query.owner = userId;
  }

  const flower = await Flower.findOneAndDelete(query);

  if (!flower) {
    throw new ApiError(404, "Flower not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Flower deleted successfully"));
});
