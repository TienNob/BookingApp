const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");

// GET all transactions
router.get("/", async (req, res) => {
  try {
    // Fetch all transaction data from the database
    const transactions = await Transaction.find();

    // Respond with the transaction data
    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving transactions",
      error: error.message,
    });
  }
});

module.exports = router;
