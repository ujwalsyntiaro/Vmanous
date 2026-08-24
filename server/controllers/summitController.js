const prisma = require('../config/prisma');

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
      const isClosed = summit.status === 'Closed' || isFull;
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
        features: Array.isArray(validData.features) ? validData.features : []
      }
    });
    res.status(201).json({ success: true, data: { ...newSummit, totalHours: validData.totalHours || '' } });
  } catch (error) {
    console.error('Error creating summit:', error);
    res.status(500).json({ success: false, error: 'Create failed' });
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

    const updated = await prisma.summit.update({
      where: { id: Number(id) },
      data: {
        title: validData.title,
        subtitle: validData.subtitle,
        type: validData.type,
        college: validData.college,
        address: validData.address,
        price: Number(validData.price),
        originalPrice: Number(validData.originalPrice),
        taxRate: Number(validData.taxRate),
        taxMode: validData.taxMode,
        processingFee: Number(validData.processingFee),
        processingFeeType: validData.processingFeeType,
        duration: durationWithHours,
        time: validData.time,
        startDate: validData.startDate,
        endDate: validData.endDate,
        date: validData.date,
        seatCapacity: Number(validData.seatCapacity),
        status: validData.status,
        features: Array.isArray(validData.features) ? validData.features : []
      }
    });
    res.json({ success: true, data: { ...updated, totalHours: validData.totalHours || '' } });
  } catch (error) {
    console.error('Error updating summit:', error);
    res.status(500).json({ success: false, error: 'Update failed' });
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

module.exports = {
  getSummits,
  createSummit,
  updateSummit,
  deleteSummit
};
