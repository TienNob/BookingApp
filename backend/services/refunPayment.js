const axios = require("axios");

async function initiateRefund(transactionId, amount) {
  try {
    console.log(transactionId, amount);

    // Replace with your actual API endpoint and authorization details
    const response = await axios.post(
      "https://payment-gateway.com/api/refund",
      {
        transactionId: transactionId,
        amount: amount,
      }
    );

    if (response.data.success) {
      return { success: true };
    } else {
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  initiateRefund,
};
