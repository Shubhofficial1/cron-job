import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import mongoose from "mongoose";
import cron from "node-cron";
import colors from "colors";
import Subscription from "./models/subscription.js";

connectDb();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home route");
});

app.get("/api/courses", (req, res) => {
  const courses = [
    { id: 1, name: "Course 1", price: 10 },
    { id: 2, name: "Course 2", price: 20 },
    { id: 3, name: "Course 3", price: 30 },
  ];
  res.json(courses);
});

app.post("/api/subscribe", async (req, res) => {
  const { userId, courseId } = req.body;

  // Create a new subscription with an expiration date one year from now
  const expirationDate = new Date();
  console.log(expirationDate);
  expirationDate.setMinutes(expirationDate.getMinutes() + 2);
  console.log(expirationDate);
  const subscription = new Subscription({
    userId,
    courseId,
    expirationDate,
  });

  // Save the subscription to the database
  await subscription.save();

  res.json(subscription);
});

// Schedule the cron job to run every day at midnight
cron.schedule("* * * * *", async () => {
  console.log("Running cron job...");

  // Get all expired subscriptions from the database
  const expiredSubscriptions = await Subscription.find({
    expirationDate: { $lt: new Date() },
  });

  console.log(expiredSubscriptions);

  // Remove the expired subscriptions from the database
  await Subscription.deleteMany({
    _id: { $in: expiredSubscriptions.map((subscription) => subscription._id) },
  });

  console.log(`Removed ${expiredSubscriptions.length} expired subscriptions`);
});

const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE || "development";

app.listen(5000, () => {
  console.log(`Server is running on Port ${PORT} in ${MODE} mode`);
});
