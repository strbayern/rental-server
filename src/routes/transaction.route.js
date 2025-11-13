const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction.model");
const Furniture = require("../models/furniture.model");

// POST /api/transaction/process
router.post("/process", async (req, res) => {
  try {
    const { email, items, paymentMethod } = req.body;

    // Validate request
    if (!email || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid transaction data" });
    }

    let totalAmount = 0;
    const transactionItems = [];

    // Loop through each furniture item in the cart
    for (const item of items) {
      const furniture = await Furniture.findById(item.furnitureId);
      if (!furniture) {
        return res
          .status(404)
          .json({ message: `Furniture with ID ${item.furnitureId} not found` });
      }

      if (furniture.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient quantity available for ${furniture.name}`,
        });
      }

      const itemTotal = furniture.price * item.quantity;
      totalAmount += itemTotal;

      transactionItems.push({
        furnitureId: furniture._id,
        quantity: item.quantity,
        priceAtTime: furniture.price,
      });
    }

    // Create and save transaction
    const transaction = new Transaction({
      email,
      amount: totalAmount,
      items: transactionItems,
      paymentMethod: paymentMethod || "demo-cash", // default payment method
      status: "successful",
      createdAt: new Date(),
    });

    await transaction.save();

    // Update furniture quantities
    for (const item of items) {
      await Furniture.findByIdAndUpdate(item.furnitureId, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.status(201).json({
      message: "Transaction completed successfully!",
      transactionId: transaction._id,
      totalAmount,
      paymentMethod: transaction.paymentMethod,
      status: transaction.status,
    });
  } catch (error) {
    console.error("Transaction processing error:", error);
    res.status(500).json({
      message: "Error processing transaction",
      error: error.message,
    });
  }
});

// GET /api/transaction/history/:email
router.get("/history/:email", async (req, res) => {
  try {
    const transactions = await Transaction.find({ email: req.params.email })
      .populate("items.furnitureId", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({
      message: "Error fetching transaction history",
      error: error.message,
    });
  }
});

module.exports = router;