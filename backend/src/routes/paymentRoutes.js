const express = require("express");
const protect = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const {
  getPaymentStatus,
  initiatePayuPayment,
  payuFailureCallback,
  payuSuccessCallback
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/payu/callback/success", asyncHandler(payuSuccessCallback));
router.post("/payu/callback/failure", asyncHandler(payuFailureCallback));

router.use(protect);
router.post("/payu/initiate", asyncHandler(initiatePayuPayment));
router.get("/:txnid", asyncHandler(getPaymentStatus));

module.exports = router;
