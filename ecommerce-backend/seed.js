require("dotenv").config("https://e-commerce-platform-frontend-and-ba.vercel.app/");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/dbConnection");
const User = require("./models/user");
const Product = require("./models/product");

const run = async () => {
  await connectDB();

  await User.deleteMany();
  await Product.deleteMany();

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const userPassword = await bcrypt.hash("User@123", 10);

  const admin = await User.create({ name: "Admin User", email: "admin@shop.com", password: adminPassword, role: "admin" });
  await User.create({ name: "Demo User", email: "user@shop.com", password: userPassword, role: "user" });

  const products = [
    { name: "Wireless Headphones", description: "Over-ear Bluetooth headphones with noise cancellation.", price: 2999, category: "Electronics", brand: "SoundCore", stock: 40, images: [], ratings: 4.3, tags: ["audio", "wireless", "bluetooth"], createdBy: admin._id },
    { name: "Smart Watch", description: "Fitness tracking smart watch with heart-rate monitor.", price: 3499, category: "Electronics", brand: "FitTrack", stock: 25, images: [], ratings: 4.1, tags: ["wearable", "fitness"], createdBy: admin._id },
    { name: "Running Shoes", description: "Lightweight breathable running shoes.", price: 1999, category: "Footwear", brand: "Stride", stock: 60, images: [], ratings: 4.5, tags: ["sports", "running"], createdBy: admin._id },
    { name: "Yoga Mat", description: "Non-slip eco-friendly yoga mat.", price: 899, category: "Fitness", brand: "ZenFit", stock: 80, images: [], ratings: 4.6, tags: ["fitness", "yoga"], createdBy: admin._id },
    { name: "Backpack", description: "Water-resistant laptop backpack, 30L.", price: 1599, category: "Accessories", brand: "UrbanCarry", stock: 50, images: [], ratings: 4.2, tags: ["travel", "bag"], createdBy: admin._id },
    { name: "Coffee Maker", description: "Programmable drip coffee maker, 12-cup.", price: 2499, category: "Home Appliances", brand: "BrewMaster", stock: 20, images: [], ratings: 4.0, tags: ["kitchen", "coffee"], createdBy: admin._id },
    { name: "Bluetooth Speaker", description: "Portable waterproof speaker with 12hr battery.", price: 1799, category: "Electronics", brand: "SoundCore", stock: 35, images: [], ratings: 4.4, tags: ["audio", "wireless", "portable"], createdBy: admin._id },
    { name: "Desk Lamp", description: "LED desk lamp with adjustable brightness.", price: 799, category: "Home Appliances", brand: "BrightLite", stock: 45, images: [], ratings: 3.9, tags: ["home", "lighting"], createdBy: admin._id },
  ];

  await Product.insertMany(products);

  console.log("Seed data inserted successfully");
  console.log("Admin login: admin@shop.com / Admin@123");
  console.log("User login:  user@shop.com / User@123");
  mongoose.connection.close();
};

run();
