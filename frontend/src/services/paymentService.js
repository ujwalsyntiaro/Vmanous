const API_BASE_URL = 'http://localhost:5000/api/v1/payments';

/**
 * 1. Initiate PhonePe Payment Session
 */
export const initiatePhonePePayment = async (formData) => {
  try {
    const payload = {
      studentName: `${formData.firstName || ''} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName || ''}`.trim() || 'Student Applicant',
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

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('vmanous_pending_payment', JSON.stringify({ ...formData, ...payload }));
      } catch (e) {
        console.warn('Could not save pending payment to sessionStorage', e);
      }
    }

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
export const verifyPhonePeStatus = async (merchantTransactionId, extraFormData = null) => {
  try {
    let cachedFormData = extraFormData;
    if (!cachedFormData && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('vmanous_pending_payment');
        if (stored) cachedFormData = JSON.parse(stored);
      } catch (e) {
        console.warn('Could not read pending payment from sessionStorage', e);
      }
    }

    const response = await fetch(`${API_BASE_URL}/verify-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        merchantTransactionId,
        formData: cachedFormData
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying PhonePe payment status:', error);
    return { success: false, error: 'Failed to verify payment status with server' };
  }
};

