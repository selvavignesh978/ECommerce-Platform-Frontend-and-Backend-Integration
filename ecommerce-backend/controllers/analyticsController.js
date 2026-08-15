const Product = require("../models/product");
const Order = require("../models/order");



const callRapidMiner = async (payload) => {
  if (!process.env.RAPIDMINER_ENDPOINT) return null;

  try {
    const response = await fetch(process.env.RAPIDMINER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.RAPIDMINER_API_KEY && { Authorization: `Bearer ${process.env.RAPIDMINER_API_KEY}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.recommendedProductIds || null; 
  } catch (err) {
    console.warn("RapidMiner service unreachable, using local fallback:", err.message);
    return null;
  }
};

const scoreSimilarity = (source, candidate) => {
  let score = 0;
  if (candidate.category === source.category) score += 3;
  const sharedTags = (candidate.tags || []).filter((t) => (source.tags || []).includes(t));
  score += sharedTags.length;
  const priceDiff = Math.abs(candidate.price - source.price);
  const priceScore = Math.max(0, 1 - priceDiff / (source.price || 1));
  score += priceScore;
  score += (candidate.ratings || 0) * 0.5;
  return score;
};

const getProductRecommendations = async (req, res, next) => {
  try {
    const source = await Product.findById(req.params.productId);
    if (!source) return res.status(404).json({ success: false, message: "Product not found" });

    const catalog = await Product.find({ _id: { $ne: source._id } });

    const rmIds = await callRapidMiner({
      type: "product_similarity",
      productId: source._id,
      category: source.category,
      price: source.price,
      tags: source.tags,
    });

    let recommendations;
    let engine = "rapidminer";

    if (rmIds && rmIds.length > 0) {
      recommendations = await Product.find({ _id: { $in: rmIds } });
    } else {
      engine = "local-fallback";
      recommendations = catalog
        .map((p) => ({ product: p, score: scoreSimilarity(source, p) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((r) => r.product);
    }

    res.status(200).json({ success: true, engine, count: recommendations.length, recommendations });
  } catch (error) {
    next(error);
  }
};

const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    const purchasedProductIds = orders.flatMap((o) => o.items.map((i) => i.product.toString()));

    if (purchasedProductIds.length === 0) {
      const popular = await Product.find().sort({ ratings: -1 }).limit(6);
      return res.status(200).json({ success: true, engine: "popularity", count: popular.length, recommendations: popular });
    }

    const purchasedProducts = await Product.find({ _id: { $in: purchasedProductIds } });
    const preferredCategories = [...new Set(purchasedProducts.map((p) => p.category))];

    const rmIds = await callRapidMiner({
      type: "user_recommendation",
      userId: req.user._id,
      purchasedProductIds,
      preferredCategories,
    });

    let recommendations;
    let engine = "rapidminer";

    if (rmIds && rmIds.length > 0) {
      recommendations = await Product.find({ _id: { $in: rmIds } });
    } else {
      engine = "local-fallback";
      recommendations = await Product.find({
        category: { $in: preferredCategories },
        _id: { $nin: purchasedProductIds },
      })
        .sort({ ratings: -1 })
        .limit(6);
    }

    res.status(200).json({ success: true, engine, count: recommendations.length, recommendations });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductRecommendations, getPersonalizedRecommendations };
