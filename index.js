const express = require("express");
const Razorpay = require("razorpay");
const app = express();

const razorpay = new Razorpay({
  RAZORPAY_KEY_ID: process.env.rzp_test_S7lwWBgRLyAgDJ,
  RAZORPAY_KEY_SECRET: process.env.w7VSaK5Vx9AaIBm9dCAy1hGz
});

app.get("/create_payment", async (req, res) => {
  const amount = parseInt(req.query.amount);

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });

  // Razorpay hosted payment link
  const paymentLink = `https://api.razorpay.com/v1/checkout/embedded?key_id=${process.env.rzp_test_S7lwWBgRLyAgDJ}&order_id=${order.id}`;

  res.send(paymentLink);
});

app.listen(process.env.PORT || 3000);
