const API_BASE_URL = "/api/v1/payments";

/**
 * 1. Initiate PhonePe Payment Session
 */
export const initiatePhonePePayment = async (formData, summitDetails = null) => {
  try {
    const payload = {
      studentName:
        `${formData.firstName || ""} ${formData.middleName ? formData.middleName + " " : ""}${formData.lastName || ""}`.trim() ||
        "Student Applicant",
      email: formData.email,
      phone: formData.phone,
      collegeName: formData.institution,
      venueLocation: formData.collegeAddress,
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
      programTitle: formData.programInterest || "AI Summit Workshop 2026",
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
      "[Frontend Payment Service] Sending order payload to backend:",
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
      console.error("[Frontend Payment Service] Response JSON parse error:", parseErr);
      return {
        success: false,
        error: `Server responded with status ${response.status} (${response.statusText || 'Non-JSON response'})`,
      };
    }

    return result;
  } catch (error) {
    console.error("Error initiating PhonePe payment:", error);
    return {
      success: false,
      error: error.message || "Network / Server Error initiating payment",
    };
  }
};

/**
 * 2. Verify PhonePe Payment Status after Callback
 */
export const verifyPhonePeStatus = async (
  merchantTransactionId,
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
        merchantTransactionId,
        formData: cachedFormData,
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch (parseErr) {
      console.error("[Frontend Payment Service] Verify status JSON parse error:", parseErr);
      return {
        success: false,
        error: `Server status ${response.status} verifying payment`,
      };
    }

    return result;
  } catch (error) {
    console.error("Error verifying PhonePe payment status:", error);
    return {
      success: false,
      error: error.message || "Failed to verify payment status with server",
    };
  }
};
