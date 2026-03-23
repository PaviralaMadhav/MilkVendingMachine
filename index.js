const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Razorpay setup
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Store orders (temporary memory)
let orders = {};

// ---------------- HOME ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Milk Vending Backend is Live 🚀");
});


// ---------------- CREATE ORDER ----------------
app.get("/create-order", async (req, res) => {
  try {
    const amount = parseInt(req.query.amount);

    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100,
      currency: "INR",
      description: "Milk Payment",

      customer: {
        name: "Milk User",
        email: "test@test.com",
        contact: "9999999999",
      },

      notify: {
        sms: true,
        email: false,
      },

      reminder_enable: true,
    });

    // Save status
    orders[paymentLink.id] = "PENDING";

    res.json({
      order_id: paymentLink.id,
      qr_link: paymentLink.short_url   // 🔥 THIS IS REAL LINK
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating payment");
  }
});

// ---------------- WEBHOOK ----------------
app.post("/webhook", (req, res) => {
  const event = req.body;

  console.log("Webhook received:", event.event);

  if (event.event === "payment.captured") {
    const order_id = event.payload.payment.entity.order_id;

    if (orders[order_id]) {
      orders[order_id] = "SUCCESS";
      console.log("Payment SUCCESS:", order_id);
    } else {
      console.log("Order not found:", order_id);
    }
  }

  res.status(200).send("OK");
});


// ---------------- CHECK STATUS ----------------
app.get("/check-status", (req, res) => {
  const order_id = req.query.order_id;

  const status = orders[order_id] || "PENDING";

  res.json({
    status: status,
  });
});


// ---------------- START SERVER ----------------
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running 🚀");
});
