// Application & Financial Revenue Analytics Service

// Clean legacy stale localStorage cache on load
if (typeof window !== 'undefined') {
  ['vmanous_applications', 'vmanous_students', 'vmanous_colleges', 'vmanous_custom_students'].forEach(key => {
    localStorage.removeItem(key);
  });
}

const INITIAL_APPLICATIONS = [
  {
    id: 'app_101',
    studentName: 'Ujwal Durgaprasad Bramhnote',
    email: 'ujwalbramhnote@gmail.com',
    phone: '+91 9876543210',
    programTitle: 'AI SUMMIT WORKSHOP',
    collegeName: 'G H RAISONI',
    venueLocation: 'Shradhhaa park Nagpur',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    degree: 'B.Tech',
    marksTenth: '88.5%',
    marksTwelfth: '85.0%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124871',
    amountPaid: 2359.00,
    baseAmount: 1999.15,
    gstAmount: 359.85,
    platformFee: 99.00,
    passCode: 'PASS-6816',
    createdAt: '2026-08-18T10:15:30Z'
  },
  {
    id: 'app_102',
    studentName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 9876543210',
    programTitle: 'AI SUMMIT WORKSHOP',
    collegeName: 'G H RAISONI',
    venueLocation: 'Shradhhaa park Nagpur',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    degree: 'B.Tech',
    marksTenth: '92.0%',
    marksTwelfth: '91.4%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124872',
    amountPaid: 2359.00,
    baseAmount: 1999.15,
    gstAmount: 359.85,
    platformFee: 99.00,
    passCode: 'PASS-GHRCEM-801',
    createdAt: '2026-08-18T11:20:00Z'
  },
  {
    id: 'app_103',
    studentName: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 9823456789',
    programTitle: 'AI SUMMIT WORKSHOP',
    collegeName: 'KDK College of Engineering',
    venueLocation: 'Sakardhara Auditorium, Nagpur',
    branch: 'Artificial Intelligence & Data Science',
    year: '4th Year',
    degree: 'B.Tech',
    marksTenth: '82.0%',
    marksTwelfth: '80.5%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124873',
    amountPaid: 2359.00,
    baseAmount: 1999.15,
    gstAmount: 359.85,
    platformFee: 99.00,
    passCode: 'PASS-KDK-802',
    createdAt: '2026-08-18T12:00:00Z'
  },
  {
    id: 'app_104',
    studentName: 'Ananya Verma',
    email: 'ananya.v@example.com',
    phone: '+91 9654321098',
    programTitle: 'AI SUMMIT WORKSHOP',
    collegeName: 'Indian Institute of Technology Bombay',
    venueLocation: 'Victor Menezes Convention Centre',
    branch: 'Computer Science',
    year: '3rd Year',
    degree: 'B.Tech',
    marksTenth: '95.6%',
    marksTwelfth: '94.2%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124874',
    amountPaid: 2359.00,
    baseAmount: 1999.15,
    gstAmount: 359.85,
    platformFee: 99.00,
    passCode: 'PASS-IITB-804',
    createdAt: '2026-08-18T14:30:00Z'
  },
  {
    id: 'app_105',
    studentName: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91 9432109876',
    programTitle: 'Data Science',
    collegeName: 'D Y PATIL',
    summitId: 3,
    venueLocation: 'Akurdi pune',
    branch: 'Information Technology',
    year: '2nd Year',
    degree: 'B.Tech',
    marksTenth: '87.0%',
    marksTwelfth: '84.0%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124875',
    amountPaid: 5902.00,
    baseAmount: 5001.69,
    gstAmount: 900.31,
    platformFee: 99.00,
    passCode: 'PASS-DYP-805',
    createdAt: '2026-08-18T15:45:00Z'
  },
  {
    id: 'app_106',
    studentName: 'Sneha Kulkarni',
    email: 'sneha.k@example.com',
    phone: '+91 9765432109',
    programTitle: 'AI SUMMIT WORKSHOP',
    collegeName: 'Delhi Technological University',
    venueLocation: 'Delhi Campus Auditorium',
    branch: 'Computer Science',
    year: '3rd Year',
    degree: 'B.Tech',
    marksTenth: '91.2%',
    marksTwelfth: '89.0%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124876',
    amountPaid: 5902.00,
    baseAmount: 5001.69,
    gstAmount: 900.31,
    platformFee: 99.00,
    passCode: 'PASS-DTU-806',
    createdAt: '2026-08-18T16:10:00Z'
  },
  {
    id: 'app_107',
    studentName: 'Vikramaditya Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 9812345678',
    programTitle: 'Workshop Agentic AI',
    collegeName: 'KDK College of Engineering',
    venueLocation: 'Sakardhara Campus Complex',
    branch: 'Data Science',
    year: '4th Year',
    degree: 'B.Tech',
    marksTenth: '89.0%',
    marksTwelfth: '87.5%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124877',
    amountPaid: 5902.00,
    baseAmount: 5001.69,
    gstAmount: 900.31,
    platformFee: 99.00,
    passCode: 'PASS-KDK-807',
    createdAt: '2026-08-18T17:25:00Z'
  },
  {
    id: 'app_108',
    studentName: 'Neha Sharma',
    email: 'neha.s@example.com',
    phone: '+91 9923456781',
    programTitle: 'Data Science',
    collegeName: 'D Y PATIL',
    summitId: 3,
    venueLocation: 'Akurdi pune',
    branch: 'Artificial Intelligence',
    year: '2nd Year',
    degree: 'B.Tech',
    marksTenth: '93.5%',
    marksTwelfth: '92.1%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124878',
    amountPaid: 2359.00,
    baseAmount: 1999.15,
    gstAmount: 359.85,
    platformFee: 99.00,
    passCode: 'PASS-DYP-808',
    createdAt: '2026-08-18T18:00:00Z',
  },
  {
    id: 'app_109',
    studentName: 'Aditya Deshmukh',
    email: 'aditya.d@example.com',
    phone: '+91 9834567892',
    programTitle: 'AI SUMMIT WORKSHOP',
    collegeName: 'G H RAISONI',
    summitId: 1,
    venueLocation: 'Shradhhaa park Nagpur',
    branch: 'Computer Engineering',
    year: '3rd Year',
    degree: 'B.Tech',
    marksTenth: '86.4%',
    marksTwelfth: '84.8%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124879',
    amountPaid: 2359.00,
    baseAmount: 1999.15,
    gstAmount: 359.85,
    platformFee: 99.00,
    passCode: 'PASS-GHRCEM-809',
    createdAt: '2026-08-18T19:15:00Z'
  },
  {
    id: 'app_110',
    studentName: 'Riya Sen',
    email: 'riya.sen@example.com',
    phone: '+91 9745678903',
    programTitle: 'AI SUMMIT WORKSHOP',
    collegeName: 'Indian Institute of Technology Bombay',
    venueLocation: 'Mumbai Campus',
    branch: 'Information Technology',
    year: '4th Year',
    degree: 'B.Tech',
    marksTenth: '90.1%',
    marksTwelfth: '88.9%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124880',
    amountPaid: 5359.00,
    baseAmount: 4541.53,
    gstAmount: 817.47,
    platformFee: 99.00,
    passCode: 'PASS-IITB-810',
    createdAt: '2026-08-18T20:30:00Z'
  },
  {
    id: 'app_111',
    studentName: 'Tanmay Joshi',
    email: 'tanmay.j@example.com',
    phone: '+91 9656789014',
    programTitle: 'Workshop Agentic AI',
    collegeName: 'Delhi Technological University',
    venueLocation: 'Delhi Campus',
    branch: 'Computer Science',
    year: '3rd Year',
    degree: 'B.Tech',
    marksTenth: '87.9%',
    marksTwelfth: '86.2%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124881',
    amountPaid: 5359.00,
    baseAmount: 4541.53,
    gstAmount: 817.47,
    platformFee: 99.00,
    passCode: 'PASS-DTU-811',
    createdAt: '2026-08-18T21:40:00Z'
  },
  {
    id: 'app_112',
    studentName: 'Kunal Patil',
    email: 'kunal.p@example.com',
    phone: '+91 9567890125',
    programTitle: 'AI SUMMIT WORKSHOP',
    collegeName: 'G H Raisoni College of Engineering',
    venueLocation: 'Nagpur Campus',
    branch: 'Computer Science',
    year: '3rd Year',
    degree: 'B.Tech',
    marksTenth: '85.0%',
    marksTwelfth: '83.0%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Failed',
    paymentFailureReason: 'Bank Server Timeout / Payment Cancelled',
    verificationStatus: 'Pending Audit',
    transactionId: 'TXN_FAIL_99182',
    amountPaid: 0,
    baseAmount: 0,
    gstAmount: 0,
    platformFee: 0,
    passCode: null,
    createdAt: '2026-08-18T22:00:00Z'
  }
];

export const getApplications = () => {
  const stored = localStorage.getItem('vmanous_applications');
  if (stored) {
    const parsed = JSON.parse(stored);
    // If stored applications array has fewer than 11 paid items, update it with fresh complete dataset
    if (parsed.filter(a => a.paymentStatus === 'Paid').length < 11) {
      localStorage.setItem('vmanous_applications', JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return parsed;
  }
  localStorage.setItem('vmanous_applications', JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
};

export const saveApplications = (apps) => {
  localStorage.setItem('vmanous_applications', JSON.stringify(apps));
};

export const getFinancialMetrics = (apps = null) => {
  const list = apps || getApplications();
  const paidApps = list.filter(a => a.paymentStatus === 'Paid');

  const grossRevenue = paidApps.reduce((sum, a) => sum + (Number(a.amountPaid) || 0), 0);

  const baseRevenue = paidApps.reduce((sum, a) => {
    if (a.baseAmount) return sum + Number(a.baseAmount);
    return sum + (Number(a.amountPaid || 0) / 1.18);
  }, 0);

  const gstCollected = grossRevenue - baseRevenue;
  const platformFeeCollected = paidApps.reduce((sum, a) => {
    if (a.platformFee) return sum + Number(a.platformFee);
    return sum + 99;
  }, 0);

  const totalPaidCount = paidApps.length;
  const aov = totalPaidCount > 0 ? grossRevenue / totalPaidCount : 0;

  return {
    grossRevenue: Math.round(grossRevenue),
    baseRevenue: Math.round(baseRevenue),
    gstCollected: Math.round(gstCollected),
    platformFeeCollected: Math.round(platformFeeCollected),
    aov: Math.round(aov),
    totalPaidCount,
    failedCount: list.filter(a => a.paymentStatus === 'Failed').length,
    pendingAuditCount: list.filter(a => a.verificationStatus === 'Pending Audit').length
  };
};

export const addApplication = (appData) => {
  const apps = getApplications();
  const isPaid = appData.paymentStatus === 'Paid';
  const amount = isPaid ? Number(appData.amountPaid || 2359) : 0;
  const base = isPaid ? Number((amount / 1.18).toFixed(2)) : 0;
  const gst = isPaid ? Number((amount - base).toFixed(2)) : 0;
  const fee = isPaid ? Number(appData.platformFee || 99) : 0;

  const newApp = {
    id: `app_${Date.now()}`,
    createdAt: new Date().toISOString(),
    verificationStatus: isPaid ? 'Verified' : 'Pending Audit',
    amountPaid: amount,
    baseAmount: base,
    gstAmount: gst,
    platformFee: fee,
    transactionId: appData.transactionId || `TXN_${isPaid ? '' : 'FAIL_'}${Math.floor(10000000 + Math.random() * 90000000)}`,
    paymentFailureReason: isPaid ? null : (appData.paymentFailureReason || 'Bank Server Timeout / Transaction Cancelled'),
    ...appData
  };
  const updated = [newApp, ...apps];
  saveApplications(updated);

  // Send to MySQL backend DB server
  try {
    fetch('http://localhost:5000/api/v1/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApp)
    }).catch(err => console.log('MySQL API sync notice:', err));
  } catch (err) {
    console.error('MySQL API post error:', err);
  }

  return newApp;
};

export const updateVerificationStatus = (id, status) => {
  const apps = getApplications();
  const updated = apps.map((app) => (app.id === id ? { ...app, verificationStatus: status } : app));
  saveApplications(updated);
  return updated;
};

export const deleteApplication = (id) => {
  const apps = getApplications();
  const updated = apps.filter((app) => app.id !== id);
  saveApplications(updated);
  return updated;
};

export const exportGSTFinancialReportToCSV = (apps = null) => {
  const list = apps || getApplications();
  if (!list || list.length === 0) return;

  let html = `
    <html xmlns:o="urn:schemas-microsoft-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>GST Financial Report</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 10pt; }
        th { background-color: #2D73B4; color: #ffffff; font-weight: bold; border: 1px solid #1E5282; padding: 8px 14px; text-align: left; white-space: nowrap; }
        td { border: 1px solid #CBD5E1; padding: 6px 12px; white-space: nowrap; vertical-align: middle; }
        .text-cell { mso-number-format:"\\@"; }
        .num-cell { text-align: right; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Student Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>College / University Name</th>
            <th>Program Track</th>
            <th>Payment Status</th>
            <th>Gross Amount Paid (INR)</th>
            <th>Base Net Value (INR)</th>
            <th>GST 18% Liability (INR)</th>
            <th>Platform Fee (INR)</th>
            <th>Student Pass Code</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
  `;

  list.forEach(a => {
    const paid = a.paymentStatus === 'Paid';
    const gross = paid ? (Number(a.amountPaid) || 0) : 0;
    const base = paid ? (a.baseAmount ? Number(a.baseAmount) : Math.round(gross / 1.18)) : 0;
    const gst = paid ? Math.round(gross - base) : 0;
    const fee = paid ? (a.platformFee ? Number(a.platformFee) : 99) : 0;
    const dateStr = a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN') : '';

    html += `
      <tr>
        <td style="mso-number-format:'\\@'; font-weight:bold;">${a.transactionId || 'N/A'}</td>
        <td>${a.studentName || ''}</td>
        <td>${a.email || ''}</td>
        <td style="mso-number-format:'\\@';">${a.phone || ''}</td>
        <td>${a.collegeName || ''}</td>
        <td>${a.programTitle || ''}</td>
        <td style="font-weight:bold; color:${paid ? '#065F46' : '#991B1B'};">${a.paymentStatus || ''}</td>
        <td class="num-cell">${gross}</td>
        <td class="num-cell">${base}</td>
        <td class="num-cell">${gst}</td>
        <td class="num-cell">${fee}</td>
        <td style="mso-number-format:'\\@';">${a.passCode || 'N/A'}</td>
        <td style="text-align:center;">${dateStr}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `VMANOUS_GST_Financial_Report_${new Date().toISOString().slice(0, 10)}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportApplicationsToCSV = (apps = null) => {
  exportGSTFinancialReportToCSV(apps);
};
