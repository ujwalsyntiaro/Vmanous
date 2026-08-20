const prisma = require('../config/prisma');

const isCollegeMatch = (colA, colB) => {
  if (!colA || !colB) return false;
  const a = colA.trim().toLowerCase();
  const b = colB.trim().toLowerCase();

  if (a === b || a.includes(b) || b.includes(a)) return true;

  const keywordsMap = [
    { keys: ['nit', 'national institute of technology'] },
    { keys: ['iit', 'indian institute of technology'] },
    { keys: ['dtu', 'delhi technological university'] },
    { keys: ['d y patil', 'd.y. patil', 'dypatil', 'dyp'] },
    { keys: ['raisoni', 'ghraisoni', 'ghrcem'] },
    { keys: ['kdk'] }
  ];

  for (const group of keywordsMap) {
    const hasA = group.keys.some(k => a.includes(k));
    const hasB = group.keys.some(k => b.includes(k));
    if (hasA && hasB) return true;
  }

  const wordsA = a.split(/\s+/).filter(w => w.length >= 4 && !['college', 'engineering', 'institute', 'technology', 'university'].includes(w));
  const wordsB = b.split(/\s+/).filter(w => w.length >= 4 && !['college', 'engineering', 'institute', 'technology', 'university'].includes(w));

  return wordsA.some(w => wordsB.includes(w));
};

const getSummits = async (req, res) => {
  try {
    const summits = await prisma.summit.findMany({
      orderBy: { createdAt: 'desc' },
      include: { applications: true }
    });

    const paidApplications = await prisma.application.findMany({
      where: { paymentStatus: 'Paid' }
    });

    const data = summits.map(summit => {
      const sumTitle = (summit.title || '').trim().toLowerCase();

      const matched = paidApplications.filter(app => {
        // 1. Exclude non-paid applications
        if (app.paymentStatus && app.paymentStatus !== 'Paid') return false;

        // 2. Validate college match
        const collegeMatches = isCollegeMatch(app.collegeName, summit.college);

        // 3. If summitId matches AND college matches, count it
        if (app.summitId && (app.summitId === summit.id || Number(app.summitId) === Number(summit.id))) {
          if (!summit.college || collegeMatches) {
            return true;
          }
        }

        // 4. Otherwise, BOTH program title AND college must match
        const progTitle = (app.programTitle || '').trim().toLowerCase();
        const titleMatches = Boolean(progTitle && sumTitle && (progTitle === sumTitle || progTitle.includes(sumTitle) || sumTitle.includes(progTitle)));

        return titleMatches && collegeMatches;
      });

      return {
        ...summit,
        enrolledCount: matched.length
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
    const summitData = req.body;
    const newSummit = await prisma.summit.create({
      data: {
        ...summitData,
        price: Number(summitData.price || 1999),
        originalPrice: Number(summitData.originalPrice || 4999),
        taxRate: Number(summitData.taxRate || 18),
        seatCapacity: Number(summitData.seatCapacity || 100),
        features: Array.isArray(summitData.features) ? summitData.features : []
      }
    });
    res.status(201).json({ success: true, data: newSummit });
  } catch (error) {
    console.error('Error creating summit:', error);
    res.status(500).json({ success: false, error: 'Create failed' });
  }
};

const updateSummit = async (req, res) => {
  try {
    const { id } = req.params;
    const summitData = req.body;
    const updated = await prisma.summit.update({
      where: { id: Number(id) },
      data: {
        ...summitData,
        price: Number(summitData.price),
        originalPrice: Number(summitData.originalPrice),
        taxRate: Number(summitData.taxRate),
        seatCapacity: Number(summitData.seatCapacity)
      }
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating summit:', error);
    res.status(500).json({ success: false, error: 'Update failed' });
  }
};

const deleteSummit = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.summit.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Summit deleted' });
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
