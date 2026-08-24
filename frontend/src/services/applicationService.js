// Application & Financial Revenue Analytics Service




const INITIAL_APPLICATIONS = [];

export const getApplications = () => {
  const stored = localStorage.getItem("vmanous_applications");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing stored applications:", e);
    }
  }
  localStorage.setItem(
    "vmanous_applications",
    JSON.stringify(INITIAL_APPLICATIONS),
  );
  return INITIAL_APPLICATIONS;
};

export const saveApplications = (apps) => {
  localStorage.setItem("vmanous_applications", JSON.stringify(apps));
};

export const getFinancialMetrics = (apps = null) => {
  const list = apps || getApplications();
  const paidApps = list.filter((a) => a.paymentStatus === "Paid");

  const grossRevenue = paidApps.reduce(
    (sum, a) => sum + (Number(a.amountPaid) || 0),
    0,
  );

  const baseRevenue = paidApps.reduce((sum, a) => {
    if (a.baseAmount) return sum + Number(a.baseAmount);
    return sum + Number(a.amountPaid || 0) / 1.18;
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
    failedCount: list.filter((a) => a.paymentStatus === "Failed").length,
    pendingAuditCount: list.filter(
      (a) => a.verificationStatus === "Pending Audit",
    ).length,
  };
};

export const addApplication = (appData) => {
  const apps = getApplications();
  const isPaid = appData.paymentStatus === "Paid";
  const amount = isPaid ? Number(appData.amountPaid || 2359) : 0;
  const base = isPaid ? Number((amount / 1.18).toFixed(2)) : 0;
  const gst = isPaid ? Number((amount - base).toFixed(2)) : 0;
  const fee = isPaid ? Number(appData.platformFee || 99) : 0;

  const newApp = {
    id: `app_${Date.now()}`,
    createdAt: new Date().toISOString(),
    verificationStatus: isPaid ? "Verified" : "Pending Audit",
    amountPaid: amount,
    baseAmount: base,
    gstAmount: gst,
    platformFee: fee,
    transactionId:
      appData.transactionId ||
      `TXN_${isPaid ? "" : "FAIL_"}${Math.floor(10000000 + Math.random() * 90000000)}`,
    paymentFailureReason: isPaid
      ? null
      : appData.paymentFailureReason ||
      "Bank Server Timeout / Transaction Cancelled",
    ...appData,
  };
  const updated = [newApp, ...apps];
  saveApplications(updated);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("applications_updated"));
    window.dispatchEvent(new CustomEvent("summits_updated"));
  }

  // Send to MySQL backend DB server
  try {
    fetch("/api/v1/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newApp),
    }).then(() => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("applications_updated"));
        window.dispatchEvent(new CustomEvent("summits_updated"));
      }
    }).catch((err) => console.log("MySQL API sync notice:", err));
  } catch (err) {
    console.error("MySQL API post error:", err);
  }

  return newApp;
};

export const updateVerificationStatus = (id, status) => {
  const apps = getApplications();
  const updated = apps.map((app) =>
    app.id === id ? { ...app, verificationStatus: status } : app,
  );
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

  list.forEach((a) => {
    const paid = a.paymentStatus === "Paid";
    const gross = paid ? Number(a.amountPaid) || 0 : 0;
    const base = paid
      ? a.baseAmount
        ? Number(a.baseAmount)
        : Math.round(gross / 1.18)
      : 0;
    const gst = paid ? Math.round(gross - base) : 0;
    const fee = paid ? (a.platformFee ? Number(a.platformFee) : 99) : 0;
    const dateStr = a.createdAt
      ? new Date(a.createdAt).toLocaleDateString("en-IN")
      : "";

    html += `
      <tr>
        <td style="mso-number-format:'\\@'; font-weight:bold;">${a.transactionId || "N/A"}</td>
        <td>${a.studentName || ""}</td>
        <td>${a.email || ""}</td>
        <td style="mso-number-format:'\\@';">${a.phone || ""}</td>
        <td>${a.collegeName || ""}</td>
        <td>${a.programTitle || ""}</td>
        <td style="font-weight:bold; color:${paid ? "#065F46" : "#991B1B"};">${a.paymentStatus || ""}</td>
        <td class="num-cell">${gross}</td>
        <td class="num-cell">${base}</td>
        <td class="num-cell">${gst}</td>
        <td class="num-cell">${fee}</td>
        <td style="mso-number-format:'\\@';">${a.passCode || "N/A"}</td>
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

  const blob = new Blob(["\uFEFF" + html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `VMANOUS_GST_Financial_Report_${new Date().toISOString().slice(0, 10)}.xls`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportApplicationsToCSV = (apps = null) => {
  exportGSTFinancialReportToCSV(apps);
};
