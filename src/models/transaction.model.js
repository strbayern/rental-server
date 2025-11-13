const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    items: [
      {
        furnitureId: { type: mongoose.Schema.Types.ObjectId, ref: "Furniture" },
        quantity: Number,
        priceAtTime: Number,
      },
    ],
    paymentMethod: { type: String, default: "demo-cash" },
    status: { type: String, default: "successful" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
        