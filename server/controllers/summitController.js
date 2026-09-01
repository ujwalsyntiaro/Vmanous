const prisma = require('../config/prisma');
const { sendAdminOtpEmail } = require('../services/emailService');

const otpStore = new Map();


const isCollegeMatch = (colA, colB) => {
  if (!colA || !colB) return false;
  const a = colA.trim().toLowerCase();
  const b = colB.trim().toLowerCase();

  if (a === b) return true;

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

  const stopWords = [
    'college', 'engineering', 'institute', 'technology', 'university',
    'nagpur', 'pune', 'delhi', 'mumbai', 'campus', 'nagar', 'city',
    'road', 'park', 'center', 'centre', 'main', 'auditorium', 'subhash', 'lokmanya', 'midc'
  ];

  const wordsA = a.split(/\s+/).filter(w => w.length >= 3 && !stopWords.includes(w));
  const wordsB = b.split(/\s+/).filter(w => w.length >= 3 && !stopWords.includes(w));

  if (wordsA.length === 0 || wordsB.length === 0) return false;

  return wordsA.some(w => wordsB.includes(w));
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

        // 1. Explicit summitId match
        if (app.summitId !== null && app.summitId !== undefined && Number(app.summitId) === Number(summit.id)) {
          return true;
        }

        // 2. Primary College match (when summit specifies a college)
        if (summit.college && isCollegeMatch(app.collegeName, summit.college)) {
          return true;
        }

        // 3. Fallback for Flagship Card 1 (G H Raisoni)
        if (Number(summit.id) === 1 || (summit.college && summit.college.toUpperCase().includes('RAISONI'))) {
          const matchesOtherCollege = [
            'kdk', 'd y patil', 'dypatil', 'iit', 'dtu', 'delhi technological', 'priyadarshini', 'priyadhrshini', 'pce', 'palloti'
          ].some(colKey => (app.collegeName || '').toLowerCase().includes(colKey));

          if (!matchesOtherCollege) {
            return true;
          }
        }

        // 4. Fallback exact title match ONLY if summit has no specific college set
        const progTitle = (app.programTitle || '').trim().toLowerCase();
        return Boolean(progTitle && sumTitle && progTitle === sumTitle);
      });

      const seatCapacity = summit.seatCapacity !== undefined ? Number(summit.seatCapacity) : 100;
      const isCompleted = summit.status === 'Event Completed' || summit.status === 'Completed';
      const isFull = matched.length >= seatCapacity;
      const isClosed = summit.status === 'Closed' || summit.status === 'Registration Closed' || isFull;
      const dynamicStatus = isCompleted
        ? summit.status
        : (isClosed ? 'Registration Closed' : (summit.status === 'Filling Fast' ? 'Filling Fast' : 'Registration Open'));

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
        enrolledCount: matched.length,
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

    const adminEmail = email || 'am@vmanous.com';

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
      return res.status(200).json({ success: true, message: `OTP sent to ${adminEmail}` });
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

    if (storedData.otp !== String(otp)) {
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    const { newData } = storedData;
    const updated = await prisma.summit.update({
      where: { id: Number(summitId) },
      data: newData
    });

    otpStore.delete(String(summitId));

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, error: 'Server error verifying OTP' });
  }
};

module.exports = {
  getSummits,
  createSummit,
  updateSummit,
  deleteSummit,
  verifyEntryCode,
  sendRescheduleOtp,
  verifyRescheduleOtp
};
