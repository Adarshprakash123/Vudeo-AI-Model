const PaymentTransaction = require("../models/PaymentTransaction");
const {
  generatePaymentHash,
  generateReverseHash,
  generateTxnId,
  getPayuBaseUrl,
  getServerBaseUrl,
  normalizeAmount,
  verifyPaymentWithPayu
} = require("../utils/payu");

const getCheckoutConfig = (req) => {
  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;

  if (!key || !salt) {
    const error = new Error("PayU is not configured. Add PAYU_KEY and PAYU_SALT in backend/.env");
    error.statusCode = 500;
    throw error;
  }

  const serverBaseUrl = getServerBaseUrl(req);
  const clientBaseUrl = (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");

  return {
    key,
    salt,
    payuUrl: `${getPayuBaseUrl()}/_payment`,
    surl: process.env.PAYU_SUCCESS_URL || `${serverBaseUrl}/api/payments/payu/callback/success`,
    furl: process.env.PAYU_FAILURE_URL || `${serverBaseUrl}/api/payments/payu/callback/failure`,
    clientBaseUrl
  };
};

const initiatePayuPayment = async (req, res) => {
  const { key, salt, payuUrl, surl, furl } = getCheckoutConfig(req);
  const { amount = 99, productInfo = "QRT Studio Pro Plan", phone = "" } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: "A valid payment amount is required" });
  }

  const firstname = req.user.name.trim();
  const email = req.user.email.trim().toLowerCase();
  const txnid = generateTxnId();
  const normalizedAmount = normalizeAmount(amount);
  const sanitizedPhone = `${phone || ""}`.trim();
  const udf1 = req.user._id.toString();
  const udf2 = "qrt-studio";
  const udf3 = "dashboard";

  const hash = generatePaymentHash({
    key,
    salt,
    txnid,
    amount: normalizedAmount,
    productinfo: productInfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3
  });

  const payment = await PaymentTransaction.create({
    userId: req.user._id,
    txnid,
    amount: Number(normalizedAmount),
    productInfo,
    firstname,
    email,
    phone: sanitizedPhone,
    udf1,
    udf2,
    udf3
  });

  return res.status(201).json({
    message: "PayU checkout initialized",
    payment: {
      id: payment._id,
      txnid: payment.txnid,
      amount: payment.amount,
      status: payment.status
    },
    checkout: {
      action: payuUrl,
      method: "POST",
      fields: {
        key,
        txnid,
        amount: normalizedAmount,
        productinfo: productInfo,
        firstname,
        email,
        phone: sanitizedPhone,
        surl,
        furl,
        hash,
        service_provider: "payu_paisa",
        udf1,
        udf2,
        udf3,
        udf4: "",
        udf5: ""
      }
    }
  });
};

const syncTransactionStatus = async (transaction) => {
  try {
    const verificationResponse = await verifyPaymentWithPayu(transaction.txnid);
    transaction.verificationResponse = verificationResponse;

    const paymentDetails = verificationResponse?.transaction_details?.[transaction.txnid];

    if (paymentDetails?.status === "success") {
      transaction.status = "success";
    } else if (paymentDetails?.status) {
      transaction.status = "failure";
    }

    if (paymentDetails?.status) {
      transaction.gatewayStatus = paymentDetails.status;
    }

    if (paymentDetails?.mihpayid) {
      transaction.payuPaymentId = `${paymentDetails.mihpayid}`;
    }
  } catch (error) {
    transaction.verificationResponse = {
      error: error.message
    };
  }
};

const handlePayuCallback = async (req, res, forcedStatus) => {
  const { key, salt, clientBaseUrl } = getCheckoutConfig(req);
  const payload = req.body || {};
  const txnid = payload.txnid;

  if (!txnid) {
    return res.status(400).json({ message: "Missing transaction id in PayU callback" });
  }

  const transaction = await PaymentTransaction.findOne({ txnid });

  if (!transaction) {
    return res.status(404).json({ message: "Payment transaction not found" });
  }

  const expectedHash = generateReverseHash({
    key,
    salt,
    status: payload.status,
    txnid: payload.txnid,
    amount: payload.amount,
    productinfo: payload.productinfo,
    firstname: payload.firstname,
    email: payload.email,
    udf1: payload.udf1,
    udf2: payload.udf2,
    udf3: payload.udf3,
    udf4: payload.udf4,
    udf5: payload.udf5,
    additionalCharges: payload.additionalCharges
  });

  const status = forcedStatus || (payload.status === "success" ? "success" : "failure");

  transaction.status = status;
  transaction.gatewayStatus = payload.status || status;
  transaction.hashVerified = expectedHash === payload.hash;
  transaction.payuPaymentId = payload.mihpayid || transaction.payuPaymentId;
  transaction.paymentMode = payload.mode || transaction.paymentMode;
  transaction.unmappedStatus = payload.unmappedstatus || transaction.unmappedStatus;
  transaction.gatewayResponse = payload;
  transaction.callbackReceivedAt = new Date();

  await syncTransactionStatus(transaction);
  await transaction.save();

  const redirectUrl = new URL("/dashboard", clientBaseUrl);
  redirectUrl.searchParams.set("payment", transaction.status);
  redirectUrl.searchParams.set("txnid", transaction.txnid);
  redirectUrl.searchParams.set("hashVerified", transaction.hashVerified ? "1" : "0");

  if (transaction.payuPaymentId) {
    redirectUrl.searchParams.set("mihpayid", transaction.payuPaymentId);
  }

  if (payload.error_Message) {
    redirectUrl.searchParams.set("reason", payload.error_Message);
  }

  return res.redirect(302, redirectUrl.toString());
};

const payuSuccessCallback = async (req, res) => handlePayuCallback(req, res, "success");

const payuFailureCallback = async (req, res) => handlePayuCallback(req, res, "failure");

const getPaymentStatus = async (req, res) => {
  const transaction = await PaymentTransaction.findOne({
    txnid: req.params.txnid,
    userId: req.user._id
  }).select("-gatewayResponse -verificationResponse");

  if (!transaction) {
    return res.status(404).json({ message: "Payment transaction not found" });
  }

  return res.status(200).json({ payment: transaction });
};

module.exports = {
  getPaymentStatus,
  initiatePayuPayment,
  payuFailureCallback,
  payuSuccessCallback
};
