const express = require("express")
const router = express.Router()

var instance = new Razorpay({
    key_id: 'rzp_test_AszvNUfgcpmdKq',
    key_secret: '5c2rkenfZmbS8osMLFib8Col',
  });

module.exports = router