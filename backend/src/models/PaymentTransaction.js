const mongoose = require("mongoose");

const paymentTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    provider: {
      type: String,
      default: "payu"
    },
    txnid: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    productInfo: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "success", "failure"],
      default: "pending"
    },
    gatewayStatus: {
      type: String,
      default: "pending"
    },
    hashVerified: {
      type: Boolean,
      default: false
    },
    payuPaymentId: {
      type: String,
      default: ""
    },
    paymentMode: {
      type: String,
      default: ""
    },
    unmappedStatus: {
      type: String,
      default: ""
    },
    udf1: {
      type: String,
      default: ""
    },
    udf2: {
      type: String,
      default: ""
    },
    udf3: {
      type: String,
      default: ""
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    verificationResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    callbackReceivedAt: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("PaymentTransaction", paymentTransactionSchema);
