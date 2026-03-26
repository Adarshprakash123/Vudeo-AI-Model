"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import { submitPayuForm } from "@/lib/utils/submitPayuForm";

export function PaymentPanel({ user, paymentQuery }) {
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const paymentStatus = paymentQuery.get("payment");
  const txnid = paymentQuery.get("txnid");
  const hashVerified = paymentQuery.get("hashVerified");
  const reason = paymentQuery.get("reason");

  useEffect(() => {
    if (!paymentStatus) {
      return;
    }

    if (paymentStatus === "success") {
      const verifiedText = hashVerified === "1" ? "Hash verified." : "Hash verification is pending.";
      toast.success(`Payment completed. ${verifiedText}`);
      return;
    }

    toast.error(reason || "Payment was not completed.");
  }, [hashVerified, paymentStatus, reason]);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!txnid) {
        setPaymentDetails(null);
        return;
      }

      setIsLoadingDetails(true);
      try {
        const { data } = await api.get(`/payments/${txnid}`);
        setPaymentDetails(data.payment);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to fetch payment details");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchPaymentDetails();
  }, [txnid]);

  const handleCheckout = async () => {
    setIsStartingCheckout(true);

    try {
      const { data } = await api.post("/payments/payu/initiate", {
        amount: 99,
        productInfo: "QRT Studio Pro Plan"
      });

      submitPayuForm(data.checkout);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to start PayU checkout");
      setIsStartingCheckout(false);
    }
  };

  return (
    <section
      id="payu-payment-panel"
      className="mb-5 rounded-[28px] border border-line bg-[#111111] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] md:p-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#2d2d2d] bg-[#171717] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#9f9f9f]">
            <Wallet className="h-3.5 w-3.5" />
            PayU Integration
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
            Turn on a PayU-hosted checkout from your QRT Studio dashboard
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-subtle">
            This button creates a PayU transaction on the backend, signs the request with your merchant
            key and salt, and forwards {user?.email || "your customer"} to PayU&apos;s hosted payment page.
          </p>
        </div>

        <div className="rounded-[24px] border border-[#262626] bg-[#0b0b0b] p-4 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-[#7f7f7f]">Current demo checkout</p>
          <p className="mt-1 text-3xl font-semibold text-white">Rs. 99</p>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isStartingCheckout}
            className="mt-4 inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isStartingCheckout ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            {isStartingCheckout ? "Redirecting to PayU..." : "Pay with PayU"}
          </button>
        </div>
      </div>

      {(txnid || isLoadingDetails) && (
        <div className="mt-5 rounded-[22px] border border-[#252525] bg-[#0c0c0c] p-4 text-sm text-subtle">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-white">Latest payment</span>
            {paymentDetails?.status === "success" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#122515] px-2.5 py-1 text-xs text-[#9aefaa]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Success
              </span>
            )}
            {paymentDetails?.status && paymentDetails.status !== "success" && (
              <span className="rounded-full bg-[#261313] px-2.5 py-1 text-xs text-[#ffafaf]">
                {paymentDetails.status}
              </span>
            )}
          </div>

          {isLoadingDetails ? (
            <p className="mt-3">Fetching transaction details...</p>
          ) : paymentDetails ? (
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <p>Transaction ID: <span className="text-white">{paymentDetails.txnid}</span></p>
              <p>Gateway status: <span className="text-white">{paymentDetails.gatewayStatus}</span></p>
              <p>Amount: <span className="text-white">Rs. {paymentDetails.amount}</span></p>
              <p>Hash verified: <span className="text-white">{paymentDetails.hashVerified ? "Yes" : "No"}</span></p>
            </div>
          ) : (
            <p className="mt-3">We received the callback, but the transaction could not be loaded for this user.</p>
          )}
        </div>
      )}
    </section>
  );
}
