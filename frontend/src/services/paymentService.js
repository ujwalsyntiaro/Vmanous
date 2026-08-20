const API_BASE_URL = 'http://localhost:5000/api/v1/payments';

/**
 * 1. Initiate PhonePe Payment Session
 */
export const initiatePhonePePayment = async (formData) => {
  try {
    const payload = {
      studentName: `${formData.firstName || ''} ${formData.middleName || ''} ${formData.lastName || ''}`.trim() || 'Student Applicant',
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
      selfiePhotoUrl: formData.selfie || formData.selfiePhotoUrl || formData.photoPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
      programTitle: formData.programInterest || 'AI Summit Workshop 2026',
      amountPaid: Number(formData.totalAmount || formData.amountPaid) || 2358.82
    };

    console.log('[Frontend Payment Service] Sending order payload to backend:', payload);

    const response = await fetch(`${API_BASE_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error initiating PhonePe payment:', error);
    return { success: false, error: 'Network / Server Error initiating payment' };
  }
};

/**
 * 2. Verify PhonePe Payment Status after Callback
 */
export const verifyPhonePeStatus = async (merchantTransactionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ merchantTransactionId })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying PhonePe payment status:', error);
    return { success: false, error: 'Failed to verify payment status with server' };
  }
};
