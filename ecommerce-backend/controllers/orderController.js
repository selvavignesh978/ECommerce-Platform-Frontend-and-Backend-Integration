const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item" });
    }

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      let product = null;

      // Only attempt database lookup if the product ID is a valid 24-character hex ObjectId
      const isHexId = typeof item.product === "string" && /^[0-9a-fA-F]{24}$/.test(item.product);
      if (isHexId) {
        product = await Product.findById(item.product);
      }

      if (product) {
        // Real database product: validate stock and deduct inventory
        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
        }
        
        const price = Number(product.price);
        const qty = Number(item.quantity);
        totalAmount += price * qty;

        const imageUrl =
          (Array.isArray(product.images) && product.images[0]) ||
          product.image ||
          product.imageUrl ||
          item.image ||
          "";

        validatedItems.push({
          product: product._id,
          name: product.name,
          price: price,
          quantity: qty,
          image: imageUrl,
        });

        product.stock -= qty;
        await product.save();
      } else {
        // Fallback for mock/preview products: accept details from frontend without throwing 404
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 1;
        totalAmount += price * qty;

        validatedItems.push({
          product: item.product || null,
          name: item.name || "Product",
          price: price,
          quantity: qty,
          image: item.image || "",
        });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalAmount,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    if (status === "delivered") {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Verify user authorization
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    // Only pending orders can be cancelled
    if (order.status?.toLowerCase() !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status '${order.status}'. Only pending orders can be cancelled.`,
      });
    }

    // Restore stock if product exists in MongoDB
    for (const item of order.items) {
      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = "cancelled";
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};