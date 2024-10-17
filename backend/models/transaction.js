const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    totalRevenue: {
      type: Number,
      default: 0, // Sum of all transaction amounts
    },
    totalRefunds: {
      type: Number,
      default: 0, // Sum of all refunded amounts
    },
    profit: {
      type: Number,
      default: 0, // Revenue - Refunds
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
