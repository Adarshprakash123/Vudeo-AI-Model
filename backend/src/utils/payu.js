const crypto = require("crypto");
const https = require("https");

const sha512 = (value) => crypto.createHash("sha512").update(value).digest("hex");

const getPayuBaseUrl = () =>
  process.env.PAYU_BASE_URL ||
  (process.env.PAYU_ENV === "production" ? "https://secure.payu.in" : "https://test.payu.in");

const getServerBaseUrl = (req) => {
  if (process.env.SERVER_URL) {
    return process.env.SERVER_URL.replace(/\/$/, "");
  }

  return `${req.protocol}://${req.get("host")}`;
};

const generateTxnId = () => `TXN${Date.now()}${Math.floor(Math.random() * 100000)}`;

const normalizeAmount = (amount) => Number.parseFloat(Number(amount).toFixed(2)).toFixed(2);

const generatePaymentHash = ({
  key,
  salt,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = ""
}) => {
  const hashString = [
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    "",
    "",
    "",
    "",
    "",
    salt
  ].join("|");

  return sha512(hashString);
};

const generateReverseHash = ({
  key,
  salt,
  status = "",
  txnid = "",
  amount = "",
  productinfo = "",
  firstname = "",
  email = "",
  udf1 = "",
  udf2 = "",
  udf3 = "",
  udf4 = "",
  udf5 = "",
  additionalCharges = ""
}) => {
  const baseParts = [
    salt,
    status,
    "",
    "",
    "",
    "",
    "",
    udf5,
    udf4,
    udf3,
    udf2,
    udf1,
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key
  ];

  const hashString = additionalCharges ? [additionalCharges, ...baseParts].join("|") : baseParts.join("|");
  return sha512(hashString);
};

const postForm = (url, payload) =>
  new Promise((resolve, reject) => {
    const body = new URLSearchParams(payload).toString();
    const request = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body)
        }
      },
      (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error(`Unable to parse PayU response: ${data}`));
          }
        });
      }
    );

    request.on("error", reject);
    request.write(body);
    request.end();
  });

const verifyPaymentWithPayu = async (txnid) => {
  const key = process.env.PAYU_KEY;
  const salt = process.env.PAYU_SALT;

  if (!key || !salt) {
    throw new Error("Missing PAYU_KEY or PAYU_SALT");
  }

  const command = "verify_payment";
  const hash = sha512([key, command, txnid, salt].join("|"));
  const url = `${getPayuBaseUrl()}/merchant/postservice?form=2`;

  return postForm(url, {
    key,
    command,
    var1: txnid,
    hash
  });
};

module.exports = {
  generatePaymentHash,
  generateReverseHash,
  generateTxnId,
  getPayuBaseUrl,
  getServerBaseUrl,
  normalizeAmount,
  verifyPaymentWithPayu
};
