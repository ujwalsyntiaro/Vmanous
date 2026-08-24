import { load } from "@cashfreepayments/cashfree-js";

const API_BASE_URL = "/api/v1/payments";

/**
 * 1. Initiate Cashfree Live Payment Order
 */
export const initiateCashfreePayment = async (formData, summitDetails = null) => {
  try {
    const payload = {
      studentName:
        `${formData.firstName || ""} ${formData.middleName ? formData.middleName + " " : ""}${formData.lastName || ""}`.trim() ||
        formData.studentName ||
        "Student Applicant",
      email: formData.email,
      phone: formData.phone || formData.mobileNumber,
      collegeName: formData.institution || formData.collegeName,
      venueLocation: formData.collegeAddress || formData.venueLocation,
      branch: formData.branch || formData.specialization,
      year: formData.semester || formData.year || formData.yearOfStudy,
      bloodGroup: formData.bloodGroup,
      degree: formData.degree || formData.qualification,
      marksTenth: formData.tenthPercentage,
      marksTwelfth: formData.twelfthPercentage,
      selfiePhotoUrl:
        formData.selfie ||
        formData.selfiePhotoUrl ||
        formData.photoPreview ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
      programTitle: formData.programInterest || formData.programTitle || "AI Summit Workshop 2026",
      summitId: formData.summitId ? Number(formData.summitId) : (summitDetails?.id ? Number(summitDetails.id) : null),
      baseAmount: formData.baseAmount !== undefined ? Number(formData.baseAmount) : null,
      gstAmount: formData.gstAmount !== undefined ? Number(formData.gstAmount) : null,
      platformFee: formData.platformFee !== undefined ? Number(formData.platformFee) : null,
      amountPaid:
        Number(formData.totalAmount || formData.amountPaid) || 2358.82,
    };

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "vmanous_pending_payment",
          JSON.stringify({
            ...formData,
            ...payload,
            summitDetails: summitDetails || formData.summitDetails || null
          }),
        );
      } catch (e) {
        console.warn("Could not save pending payment to sessionStorage", e);
      }
    }

    console.log(
      "[Cashfree Payment Service] Creating order on server:",
      payload,
    );

    const response = await fetch(`${API_BASE_URL}/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let result;
    try {
      result = await response.json();
    } catch (parseErr) {
      console.error("[Cashfree Payment Service] Response JSON parse error:", parseErr);
      return {
        success: false,
        error: `Server responded with status ${response.status} (${response.statusText || 'Non-JSON response'})`,
      };
    }

    return result;
  } catch (error) {
    console.error("Error initiating Cashfree payment:", error);
    return {
      success: false,
      error: error.message || "Network / Server Error initiating payment",
    };
  }
};

/**
 * 2. Launch Cashfree Live Checkout UI
 */
export const openCashfreeCheckout = async (paymentSessionId, orderId = null, mode = "production") => {
  try {
    const cashfree = await load({
      mode: mode === "sandbox" ? "sandbox" : "production"
    });

    return cashfree.checkout({
      paymentSessionId: paymentSessionId,
      redirectTarget: "_modal"
    }).then((result) => {
      console.log("[Cashfree Checkout Result]:", result);
      if (result && result.paymentDetails) {
        const targetOrderId = orderId || result.paymentDetails.orderId;
        window.location.href = `/payment-callback?order_id=${targetOrderId}`;
      }
      return result;
    });
  } catch (error) {
    console.error("Error opening Cashfree checkout:", error);
    throw error;
  }
};

/**
 * 3. Verify Cashfree Payment Status after Callback
 */
export const verifyCashfreeStatus = async (
  orderId,
  extraFormData = null,
) => {
  try {
    let cachedFormData = extraFormData;
    if (!cachedFormData && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("vmanous_pending_payment");
        if (stored) cachedFormData = JSON.parse(stored);
      } catch (e) {
        console.warn("Could not read pending payment from sessionStorage", e);
      }
    }

    const response = await fetch(`${API_BASE_URL}/verify-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        merchantTransactionId: orderId,
        formData: cachedFormData,
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch (parseErr) {
      console.error("[Cashfree Payment Service] Verify status JSON parse error:", parseErr);
      return {
        success: false,
        error: `Server status ${response.status} verifying payment`,
      };
    }

    return result;
  } catch (error) {
    console.error("Error verifying Cashfree payment status:", error);
    return {
      success: false,
      error: error.message || "Failed to verify payment status with server",
    };
  }
};

// Aliases for compatibility
export const initiatePhonePePayment = initiateCashfreePayment;
export const verifyPhonePeStatus = verifyCashfreeStatus;

