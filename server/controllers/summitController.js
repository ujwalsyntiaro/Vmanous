const fs = require('fs');
const path = require('path');
const prisma = require('../config/prisma');
const { 
  sendAdminOtpEmail, 
  sendSecurityEmailChangeOtpEmail,
  sendStudentRescheduleEmail 
} = require('../services/emailService');

const otpStore = new Map();
const emailChangeOtpStore = new Map();

const configFilePath = path.join(__dirname, '../data/securityConfig.json');

const getAuthorizedEmail = () => {
  try {
    if (fs.existsSync(configFilePath)) {
      const raw = fs.readFileSync(configFilePath, 'utf8');
      const data = JSON.parse(raw);
      if (data && data.authorizedEmail) return String(data.authorizedEmail).trim().toLowerCase();
    }
  } catch (e) {
    console.error('Error reading securityConfig.json:', e);
  }
  return (process.env.AUTHORIZED_ADMIN_EMAIL || 'am@vmanous.com').trim().toLowerCase();
};

const setAuthorizedEmail = (newEmail) => {
  try {
    const dir = path.dirname(configFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(configFilePath, JSON.stringify({ 
      authorizedEmail: String(newEmail).trim().toLowerCase(), 
      updatedAt: new Date().toISOString() 
    }, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing securityConfig.json:', e);
  }
};


const isCollegeMatch = (colA, colB) => {
  if (!colA || !colB) return false;
  const a = colA.trim().toLowerCase();
  const b = colB.trim().toLowerCase();

  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;

  const keywordsMap = [
    { keys: ['nit', 'national institute of technology'] },
    { keys: ['iit', 'indian institute of technology'] },
    { keys: ['dtu', 'delhi technological university'] },
    { keys: ['d y patil', 'd.y. patil', 'dypatil', 'dyp'] },
    { keys: ['raisoni', 'ghraisoni', 'ghrcem'] },
    { keys: ['kdk'] },
    { keys: ['priyadarshini', 'priyadhrshini', 'pce'] },
    { keys: ['palloti', 'pallotti', 'st. vincent pallotti', 'st vincent pallotti'] },
    { keys: ['ramdeo', 'ramdeobaba', 'rknec'] }
  ];

  for (const group of keywordsMap) {
    const hasA = group.keys.some(k => a.includes(k));
    const hasB = group.keys.some(k => b.includes(k));
    if (hasA && hasB) {
      return true;
    }
  }

  const genericWords = [
    'college', 'engineering', 'institute', 'technology', 'university',
    'campus', 'auditorium', 'main'
  ];

  const wordsA = a.split(/[\s,.-]+/).filter(w => w.length >= 3 && !genericWords.includes(w));
  const wordsB = b.split(/[\s,.-]+/).filter(w => w.length >= 3 && !genericWords.includes(w));

  if (wordsA.length === 0 || wordsB.length === 0) return false;

  return wordsA.some(w => wordsB.includes(w) || wordsB.some(wb => wb.includes(w) || w.includes(wb)));
};

const getSummits = async (req, res) => {
  try {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    let summits = await prisma.summit.findMany({
      orderBy: { createdAt: 'desc' },
      include: { applications: true }
    });

    const paidApplications = await prisma.application.findMany({
      where: { paymentStatus: 'Paid' }
    });

    const data = summits.map(summit => {
      const sumTitle = (summit.title || '').trim().toLowerCase();

      const matched = paidApplications.filter(app => {
        if (app.paymentStatus && app.paymentStatus !== 'Paid') return false;

        // 1. Explicit summitId match (highest priority)
        if (app.summitId !== null && app.summitId !== undefined && Number(app.summitId) === Number(summit.id)) {
          return true;
        }

        // 2. Exact Title + College match
        const progTitle = (app.programTitle || '').trim().toLowerCase();
        const titleMatches = progTitle && sumTitle && (progTitle === sumTitle || progTitle.includes(sumTitle) || sumTitle.includes(progTitle));

        if (titleMatches) {
          if (!summit.college || !app.collegeName || isCollegeMatch(app.collegeName, summit.college)) {
            return true;
          }
        }

        // 3. College match (if program title is generic or matching)
        if (summit.college && isCollegeMatch(app.collegeName, summit.college)) {
          if (!app.summitId && (titleMatches || !app.programTitle || progTitle.includes('ai') || sumTitle.includes('ai') || sumTitle === 'eeee')) {
            return true;
          }
        }

        return false;
      });

      const seatCapacity = summit.seatCapacity !== undefined ? Number(summit.seatCapacity) : 100;
      const enrolledCount = matched.length;
      const isCompleted = summit.status === 'Event Completed' || summit.status === 'Completed';
      const isFull = enrolledCount >= seatCapacity;
      const isClosed = summit.status === 'Closed' || summit.status === 'Registration Closed' || isFull;
      const dynamicStatus = isCompleted
        ? summit.status
        : (isClosed ? 'Registration Closed' : (enrolledCount >= seatCapacity * 0.8 ? 'Filling Fast' : (summit.status === 'Filling Fast' ? 'Filling Fast' : 'Registration Open')));

      let totalHours = '';
      if (summit.duration) {
        const hMatch = String(summit.duration).match(/(\d+)\s*(?:hrs|hours)/i);
        if (hMatch) totalHours = hMatch[1];
      }

      return {
        ...summit,
        totalHours: totalHours,
        status: dynamicStatus,
        seatCapacity: seatCapacity,
        enrolledCount: enrolledCount,
        applications: matched
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching summits:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const createSummit = async (req, res) => {
  try {
    const {
      id,
      durationDays,
      startTime,
      startAmPm,
      endTime,
      endAmPm,
      applications,
      enrolledCount,
      ...validData
    } = req.body;

    const baseDuration = validData.duration || "1-Day Live Workshop";
    const durationWithHours = validData.totalHours
      ? `${baseDuration.replace(/\s*\(\d+\s*(?:hrs|hours)\)/i, '')} (${validData.totalHours} Hrs)`
      : baseDuration;

    const normalizedEntryCode = validData.entryCode ? String(validData.entryCode).trim().toUpperCase() : null;

    // Check for duplicate entry code across other summits
    if (normalizedEntryCode) {
      const existingWithCode = await prisma.summit.findFirst({
        where: { entryCode: normalizedEntryCode }
      });
      if (existingWithCode) {
        return res.status(400).json({
          success: false,
          error: `Entry code '${normalizedEntryCode}' is already assigned to "${existingWithCode.college || existingWithCode.title}". Please use a unique code.`
        });
      }
    }

    const newSummit = await prisma.summit.create({
      data: {
        title: validData.title || "New Workshop",
        subtitle: validData.subtitle || "",
        type: validData.type || "Flagship Event",
        college: validData.college || "University",
        address: validData.address || "",
        price: validData.price !== undefined && validData.price !== null ? Number(validData.price) : 1999,
        originalPrice: validData.originalPrice !== undefined && validData.originalPrice !== null ? Number(validData.originalPrice) : 4999,
        taxRate: validData.taxRate !== undefined && validData.taxRate !== null ? Number(validData.taxRate) : 18,
        taxMode: validData.taxMode || "Exclusive",
        processingFee: validData.processingFee !== undefined && validData.processingFee !== null ? Number(validData.processingFee) : 0,
        processingFeeType: validData.processingFeeType || "Percentage",
        duration: durationWithHours,
        time: validData.time || "10:00 AM - 05:00 PM",
        startDate: validData.startDate || "",
        endDate: validData.endDate || "",
        date: validData.date || "",
        seatCapacity: Number(validData.seatCapacity || 100),
        status: validData.status || "Registration Open",
        entryCode: normalizedEntryCode || null,
        features: Array.isArray(validData.features) ? validData.features : []
      }
    });
    res.status(201).json({ success: true, data: { ...newSummit, totalHours: validData.totalHours || '' } });
  } catch (error) {
    console.error('Error creating summit:', error);
    res.status(500).json({ success: false, error: error.message || 'Create failed' });
  }
};

const updateSummit = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id: bodyId,
      durationDays,
      startTime,
      startAmPm,
      endTime,
      endAmPm,
      applications,
      enrolledCount,
      ...validData
    } = req.body;

    const baseDuration = validData.duration || "1-Day Live Workshop";
    const durationWithHours = validData.totalHours
      ? `${baseDuration.replace(/\s*\(\d+\s*(?:hrs|hours)\)/i, '')} (${validData.totalHours} Hrs)`
      : baseDuration;

    const normalizedEntryCode = validData.entryCode ? String(validData.entryCode).trim().toUpperCase() : null;

    // Check for duplicate entry code across other summits
    if (normalizedEntryCode) {
      const existingWithCode = await prisma.summit.findFirst({
        where: {
          entryCode: normalizedEntryCode,
          NOT: { id: Number(id) }
        }
      });
      if (existingWithCode) {
        return res.status(400).json({
          success: false,
          error: `Entry code '${normalizedEntryCode}' is already assigned to "${existingWithCode.college || existingWithCode.title}". Please use a unique code.`
        });
      }
    }

    const updated = await prisma.summit.update({
      where: { id: Number(id) },
      data: {
        title: validData.title !== undefined ? validData.title : undefined,
        subtitle: validData.subtitle !== undefined ? validData.subtitle : undefined,
        type: validData.type !== undefined ? validData.type : undefined,
        college: validData.college !== undefined ? validData.college : undefined,
        address: validData.address !== undefined ? validData.address : undefined,
        price: validData.price !== undefined && validData.price !== null && validData.price !== '' ? Number(validData.price) : undefined,
        originalPrice: validData.originalPrice !== undefined && validData.originalPrice !== null && validData.originalPrice !== '' ? Number(validData.originalPrice) : undefined,
        taxRate: validData.taxRate !== undefined && validData.taxRate !== null && validData.taxRate !== '' ? Number(validData.taxRate) : undefined,
        taxMode: validData.taxMode !== undefined ? validData.taxMode : undefined,
        processingFee: validData.processingFee !== undefined && validData.processingFee !== null && validData.processingFee !== '' ? Number(validData.processingFee) : undefined,
        processingFeeType: validData.processingFeeType !== undefined ? validData.processingFeeType : undefined,
        duration: durationWithHours,
        time: validData.time !== undefined ? validData.time : undefined,
        startDate: validData.startDate !== undefined ? validData.startDate : undefined,
        endDate: validData.endDate !== undefined ? validData.endDate : undefined,
        date: validData.date !== undefined ? validData.date : undefined,
        seatCapacity: validData.seatCapacity !== undefined && validData.seatCapacity !== null && validData.seatCapacity !== '' ? Number(validData.seatCapacity) : undefined,
        status: validData.status !== undefined ? validData.status : undefined,
        entryCode: normalizedEntryCode || null,
        features: validData.features !== undefined ? (Array.isArray(validData.features) ? validData.features : []) : undefined
      }
    });
    res.json({ success: true, data: { ...updated, totalHours: validData.totalHours || '' } });
  } catch (error) {
    console.error('Error updating summit:', error);
    res.status(500).json({ success: false, error: error.message || 'Update failed' });
  }
};

const deleteSummit = async (req, res) => {
  try {
    const { id } = req.params;
    const summitIdNum = Number(id);
    await prisma.application.updateMany({
      where: { summitId: summitIdNum },
      data: { summitId: null }
    });
    await prisma.summit.delete({ where: { id: summitIdNum } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting summit:', error);
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
};

const sendRescheduleOtp = async (req, res) => {
  try {
    const { summitId, newData, email } = req.body;
    
    if (!summitId || !newData) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const adminEmail = (email && String(email).trim()) || getAuthorizedEmail();

    // Generate a 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store it for 10 minutes
    otpStore.set(String(summitId), {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
      newData
    });

    // Send email to Admin
    const emailRes = await sendAdminOtpEmail(otp, newData, adminEmail);
    
    if (emailRes.success) {
      return res.status(200).json({ success: true, message: `OTP sent to ${adminEmail}`, authorizedEmail: adminEmail });
    } else {
      return res.status(500).json({ success: false, error: emailRes.error });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: 'Server error generating OTP' });
  }
};

const verifyEntryCode = async (req, res) => {
  try {
    const { summitId, entryCode } = req.body;
    if (!summitId) {
      return res.status(400).json({ success: false, valid: false, error: 'Summit ID is required' });
    }

    const summit = await prisma.summit.findUnique({
      where: { id: Number(summitId) }
    });

    if (!summit) {
      return res.status(404).json({ success: false, valid: false, error: 'Workshop / Summit not found' });
    }

    // If summit does not require an entry code
    if (!summit.entryCode) {
      return res.status(200).json({
        success: true,
        valid: true,
        message: 'No entry code required'
      });
    }

    const submittedCode = String(entryCode || '').trim().toUpperCase();
    const actualCode = String(summit.entryCode).trim().toUpperCase();

    if (submittedCode === actualCode) {
      return res.status(200).json({
        success: true,
        valid: true,
        message: 'Entry code verified successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        valid: false,
        error: 'Invalid Entry Code. Please enter the valid code provided by your college/institution.'
      });
    }
  } catch (error) {
    console.error('Error verifying entry code:', error);
    res.status(500).json({ success: false, valid: false, error: 'Server error verifying entry code' });
  }
};

const verifyRescheduleOtp = async (req, res) => {
  try {
    const { summitId, otp } = req.body;
    if (!summitId || !otp) {
      return res.status(400).json({ success: false, error: 'Summit ID and OTP are required' });
    }

    const storedData = otpStore.get(String(summitId));
    if (!storedData) {
      return res.status(400).json({ success: false, error: 'OTP expired or not requested' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(String(summitId));
      return res.status(400).json({ success: false, error: 'OTP has expired' });
    }

    const currentAuthorizedMail = getAuthorizedEmail();

    if (storedData.otp !== String(otp).trim()) {
      return res.status(400).json({ success: false, error: `Invalid OTP. Please check your webmail (${currentAuthorizedMail}) and enter the correct 6-digit code.` });
    }

    const { newData } = storedData;
    const baseDuration = newData.duration || "1-Day Live Workshop";
    const durationWithHours = newData.totalHours
      ? `${baseDuration.replace(/\s*\(\d+\s*(?:hrs|hours)\)/i, '')} (${newData.totalHours} Hrs)`
      : baseDuration;

    const normalizedEntryCode = newData.entryCode ? String(newData.entryCode).trim().toUpperCase() : undefined;

    const updated = await prisma.summit.update({
      where: { id: Number(summitId) },
      data: {
        title: newData.title !== undefined ? newData.title : undefined,
        subtitle: newData.subtitle !== undefined ? newData.subtitle : undefined,
        type: newData.type !== undefined ? newData.type : undefined,
        college: newData.college !== undefined ? newData.college : undefined,
        address: newData.address !== undefined ? newData.address : undefined,
        price: newData.price !== undefined && newData.price !== null && newData.price !== '' ? Number(newData.price) : undefined,
        originalPrice: newData.originalPrice !== undefined && newData.originalPrice !== null && newData.originalPrice !== '' ? Number(newData.originalPrice) : undefined,
        taxRate: newData.taxRate !== undefined && newData.taxRate !== null && newData.taxRate !== '' ? Number(newData.taxRate) : undefined,
        taxMode: newData.taxMode !== undefined ? newData.taxMode : undefined,
        processingFee: newData.processingFee !== undefined && newData.processingFee !== null && newData.processingFee !== '' ? Number(newData.processingFee) : undefined,
        processingFeeType: newData.processingFeeType !== undefined ? newData.processingFeeType : undefined,
        duration: durationWithHours,
        time: newData.time !== undefined ? newData.time : undefined,
        startDate: newData.startDate !== undefined ? newData.startDate : undefined,
        endDate: newData.endDate !== undefined ? newData.endDate : undefined,
        date: newData.date !== undefined ? newData.date : undefined,
        seatCapacity: newData.seatCapacity !== undefined && newData.seatCapacity !== null && newData.seatCapacity !== '' ? Number(newData.seatCapacity) : undefined,
        status: (newData.scheduleStatus || newData.status) !== undefined ? (newData.scheduleStatus || newData.status) : undefined,
        entryCode: normalizedEntryCode || undefined,
        features: newData.features !== undefined ? (Array.isArray(newData.features) ? newData.features : []) : undefined
      }
    });

    otpStore.delete(String(summitId));

    // Automated Student Notification Dispatch
    let notifiedStudentsCount = 0;
    try {
      const allPaidApplications = await prisma.application.findMany({
        where: { paymentStatus: 'Paid' }
      });

      const enrolledStudents = allPaidApplications.filter(app => {
        if (app.summitId !== null && app.summitId !== undefined && Number(app.summitId) === Number(summitId)) {
          return true;
        }
        if (updated.college && isCollegeMatch(app.collegeName, updated.college)) {
          return true;
        }
        if (!updated.college && updated.title) {
          const progTitle = (app.programTitle || '').trim().toLowerCase();
          const sumTitle = (updated.title || '').trim().toLowerCase();
          return Boolean(progTitle && sumTitle && progTitle === sumTitle);
        }
        return false;
      });

      // Deduplicate by email
      const uniqueStudentsMap = new Map();
      for (const student of enrolledStudents) {
        const emailKey = (student.email || '').trim().toLowerCase();
        if (emailKey && !uniqueStudentsMap.has(emailKey)) {
          uniqueStudentsMap.set(emailKey, student);
        }
      }
      const uniqueStudents = Array.from(uniqueStudentsMap.values());
      notifiedStudentsCount = uniqueStudents.length;

      const actionStatus = newData.scheduleStatus || updated.status || 'Rescheduled';
      console.log(`[Reschedule Alert Dispatch] Triggering notifications for ${uniqueStudents.length} enrolled student(s)...`);

      // Fire asynchronous email dispatch
      Promise.allSettled(
        uniqueStudents.map(student => sendStudentRescheduleEmail(student, updated, actionStatus))
      ).then(results => {
        const successCount = results.filter(r => r.status === 'fulfilled' && r.value && r.value.success).length;
        console.log(`[Reschedule Alert Dispatch] Successfully dispatched emails to ${successCount}/${uniqueStudents.length} students.`);
      }).catch(err => {
        console.error('[Reschedule Alert Dispatch Error]:', err);
      });
    } catch (dispatchErr) {
      console.error('Error fetching students for reschedule dispatch:', dispatchErr);
    }

    res.json({
      success: true,
      message: `Workshop marked as ${updated.status || 'Updated'}! Automated email notification sent to ${notifiedStudentsCount} registered student(s).`,
      notifiedStudentsCount,
      data: { ...updated, totalHours: newData.totalHours || '' }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error verifying OTP' });
  }
};

/**
 * Get the currently active authorized webmail
 */
const getAuthorizedEmailConfig = async (req, res) => {
  try {
    const authorizedEmail = getAuthorizedEmail();
    res.json({ success: true, authorizedEmail });
  } catch (error) {
    console.error('Error getting authorized email config:', error);
    res.status(500).json({ success: false, error: 'Server error retrieving security configuration' });
  }
};

/**
 * Step 1: Request Email Change -> Sends OTP to Current Authorized Email
 */
const requestEmailChangeOtp = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail || !String(newEmail).trim()) {
      return res.status(400).json({ success: false, error: 'New Authorized Webmail is required' });
    }

    const cleanedNewEmail = String(newEmail).trim().toLowerCase();

    // Standard email format validation (allows any valid domain)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanedNewEmail)) {
      return res.status(400).json({ success: false, error: 'Invalid email address format' });
    }

    const currentEmail = getAuthorizedEmail();
    if (cleanedNewEmail === currentEmail) {
      return res.status(400).json({ success: false, error: 'Proposed new email is already the active authorized webmail.' });
    }

    // Generate 6-digit Security OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in memory for 10 minutes
    emailChangeOtpStore.set('EMAIL_CHANGE_REQUEST', {
      otp,
      newEmail: cleanedNewEmail,
      currentEmail,
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    // Send Alert & OTP to CURRENT OWNER
    const emailRes = await sendSecurityEmailChangeOtpEmail(otp, cleanedNewEmail, currentEmail);

    if (emailRes.success) {
      return res.status(200).json({ 
        success: true, 
        message: `Security OTP sent to current owner (${currentEmail}). Please enter it to authorize the change.`,
        currentEmail,
        newEmail: cleanedNewEmail
      });
    } else {
      return res.status(500).json({ success: false, error: emailRes.error || 'Failed to dispatch security alert email' });
    }
  } catch (error) {
    console.error('Error requesting email change OTP:', error);
    res.status(500).json({ success: false, error: 'Server error processing email change request' });
  }
};

/**
 * Step 2: Verify Security OTP and Update Active Authorized Webmail
 */
const verifyEmailChangeOtp = async (req, res) => {
  try {
    const { otp, newEmail } = req.body;
    if (!otp || !String(otp).trim()) {
      return res.status(400).json({ success: false, error: 'Security OTP is required' });
    }

    const stored = emailChangeOtpStore.get('EMAIL_CHANGE_REQUEST');
    if (!stored) {
      return res.status(400).json({ success: false, error: 'No active email change request found or OTP has expired.' });
    }

    if (Date.now() > stored.expiresAt) {
      emailChangeOtpStore.delete('EMAIL_CHANGE_REQUEST');
      return res.status(400).json({ success: false, error: 'Security OTP has expired. Please initiate a new request.' });
    }

    if (stored.otp !== String(otp).trim()) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid Security OTP. Please check the alert sent to ${stored.currentEmail}.` 
      });
    }

    const targetEmail = stored.newEmail;
    setAuthorizedEmail(targetEmail);
    emailChangeOtpStore.delete('EMAIL_CHANGE_REQUEST');

    res.json({
      success: true,
      message: `Authorized Webmail successfully updated to ${targetEmail}!`,
      authorizedEmail: targetEmail
    });
  } catch (error) {
    console.error('Error verifying email change OTP:', error);
    res.status(500).json({ success: false, error: 'Server error updating authorized email' });
  }
};

module.exports = {
  getSummits,
  createSummit,
  updateSummit,
  deleteSummit,
  verifyEntryCode,
  sendRescheduleOtp,
  verifyRescheduleOtp,
  getAuthorizedEmailConfig,
  requestEmailChangeOtp,
  verifyEmailChangeOtp
};
