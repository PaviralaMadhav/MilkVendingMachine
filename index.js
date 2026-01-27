const express = require("express");
const Razorpay = require("razorpay");
const app = express();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Health check / home route
app.get("/", (req, res) => {
  res.send("Milk Vending Backend is Live 🚀");
});

// Create payment
app.get("/create_payment", async (req, res) => {
  try {
    const amount = parseInt(req.query.amount);

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    const paymentLink = `https://api.razorpay.com/v1/checkout/embedded?key_id=${process.env.RAZORPAY_KEY_ID}&order_id=${order.id}`;

    res.send(paymentLink);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating payment");
  }
});

// Start server (ONLY ONCE)
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
