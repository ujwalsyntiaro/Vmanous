import { getSummits, isCollegeMatch } from "./summitService";

const INITIAL_APPLICATIONS = [];

export const getApplications = () => {
  const stored = localStorage.getItem("vmanous_applications");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing stored applications:", e);
    }
  }
  return [];
};

export const saveApplications = (apps) => {
  localStorage.setItem("vmanous_applications", JSON.stringify(apps));
};

export const clearAllApplications = async () => {
  localStorage.removeItem("vmanous_applications");
  localStorage.removeItem("vmanous_students");
  localStorage.removeItem("vmanous_custom_students");

  try {
    await fetch("/api/v1/applications/clear", {
      method: "DELETE",
    });
  } catch (err) {
    console.error("Error calling backend clear applications API:", err);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("applications_updated"));
    window.dispatchEvent(new CustomEvent("summits_updated"));
  }

  return [];
};

/**
 * Computes exact dynamic financial breakdown for an application based on its workshop settings
 */
export const computeAppFinancialBreakdown = (app, summitsList = null) => {
  const isPaid = app.paymentStatus === "Paid";
  const amountPaid = isPaid ? Number(app.amountPaid || 0) : 0;

  // 1. If application already has explicit stored values
  if (
    app.baseAmount !== undefined && app.baseAmount !== null &&
    app.gstAmount !== undefined && app.gstAmount !== null &&
    app.platformFee !== undefined && app.platformFee !== null
  ) {
    return {
      gross: amountPaid,
      base: Number(app.baseAmount),
      gst: Number(app.gstAmount),
      platformFee: Number(app.platformFee),
    };
  }

  // 2. Find matching workshop/summit
  const summits = summitsList || getSummits();
  let matchedSummit = null;
  if (app.summitId && summits && summits.length > 0) {
    matchedSummit = summits.find(
      (s) => s.id === app.summitId || Number(s.id) === Number(app.summitId)
    );
  }
  if (!matchedSummit && summits && summits.length > 0) {
    matchedSummit = summits.find((s) => {
      const prog = (app.programTitle || "").trim().toLowerCase();
      const sum = (s.title || "").trim().toLowerCase();
      const colMatch = isCollegeMatch(app.collegeName, s.college);
      const titleMatch = Boolean(
        prog && sum && (prog === sum || prog.includes(sum) || sum.includes(prog))
      );
      return titleMatch && (!s.college || colMatch);
    });
  }

  if (matchedSummit) {
    const basePrice = matchedSummit.price !== undefined ? Number(matchedSummit.price) : 1999;
    const taxRate = matchedSummit.taxRate !== undefined ? Number(matchedSummit.taxRate) : 18;
    const taxMode = matchedSummit.taxMode || "Exclusive";
    const rawFee =
      matchedSummit.processingFee !== undefined && matchedSummit.processingFee !== null
        ? Number(matchedSummit.processingFee)
        : 0;
    const feeType = matchedSummit.processingFeeType || "Percentage";

    let calcBase = basePrice;
    let calcGst = 0;
    let calcFee = feeType === "Percentage" ? (basePrice * rawFee) / 100 : rawFee;

    if (basePrice === 0 || taxMode === "Free") {
      calcBase = 0;
      calcGst = 0;
      calcFee = 0;
    } else if (taxMode === "Inclusive") {
      calcGst = (basePrice * taxRate) / (100 + taxRate);
      calcBase = basePrice - calcGst;
      if (feeType === "Percentage") {
        calcFee = (calcBase * rawFee) / 100;
      }
    } else {
      // Exclusive
      calcBase = basePrice;
      calcGst = (basePrice * taxRate) / 100;
      if (feeType === "Percentage") {
        calcFee = (calcBase * rawFee) / 100;
      }
    }

    return {
      gross: amountPaid > 0 ? amountPaid : calcBase + calcGst + calcFee,
      base: app.baseAmount !== undefined && app.baseAmount !== null ? Number(app.baseAmount) : calcBase,
      gst: app.gstAmount !== undefined && app.gstAmount !== null ? Number(app.gstAmount) : calcGst,
      platformFee: app.platformFee !== undefined && app.platformFee !== null ? Number(app.platformFee) : calcFee,
    };
  }

  // 3. Fallback when no matching summit is found
  const base =
    app.baseAmount !== undefined && app.baseAmount !== null
      ? Number(app.baseAmount)
      : amountPaid > 0
        ? amountPaid / 1.18
        : 0;
  const gst =
    app.gstAmount !== undefined && app.gstAmount !== null
      ? Number(app.gstAmount)
      : amountPaid > 0
        ? amountPaid - base
        : 0;
  const fee =
    app.platformFee !== undefined && app.platformFee !== null
      ? Number(app.platformFee)
      : 0;

  return {
    gross: amountPaid,
    base: base,
    gst: gst,
    platformFee: fee,
  };
};

export const getFinancialMetrics = (apps = null, summits = null) => {
  const list = apps || getApplications();
  const summitsList = summits || getSummits();
  const paidApps = list.filter((a) => a.paymentStatus === "Paid");

  let grossRevenue = 0;
  let baseRevenue = 0;
  let gstCollected = 0;
  let platformFeeCollected = 0;

  paidApps.forEach((a) => {
    const b = computeAppFinancialBreakdown(a, summitsList);
    grossRevenue += b.gross;
    baseRevenue += b.base;
    gstCollected += b.gst;
    platformFeeCollected += b.platformFee;
  });

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

export const addApplication = (appData, summitDetails = null) => {
  const apps = getApplications();
  const isPaid = appData.paymentStatus === "Paid";

  let base = 0;
  let gst = 0;
  let fee = 0;
  let amount = 0;

  if (isPaid) {
    if (appData.baseAmount !== undefined && appData.gstAmount !== undefined) {
      base = Number(appData.baseAmount);
      gst = Number(appData.gstAmount);
      fee = Number(appData.platformFee || 0);
      amount = Number(appData.amountPaid || base + gst + fee);
    } else {
      const breakdown = computeAppFinancialBreakdown(
        appData,
        summitDetails ? [summitDetails] : null
      );
      base = Number(breakdown.base.toFixed(2));
      gst = Number(breakdown.gst.toFixed(2));
      fee = Number(breakdown.platformFee.toFixed(2));
      amount = Number((appData.amountPaid || breakdown.gross).toFixed(2));
    }
  }

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

  // Sync with MySQL
  try {
    fetch(`/api/v1/applications/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationStatus: status }),
    }).catch((err) => console.log("Backend status update notice:", err));
  } catch (err) {
    console.error("Backend status update error:", err);
  }

  return updated;
};

export const deleteApplication = (id) => {
  const apps = getApplications();
  const updated = apps.filter((app) => app.id !== id);
  saveApplications(updated);

  // Sync with MySQL backend
  try {
    fetch(`/api/v1/applications/${id}`, {
      method: "DELETE",
    }).catch((err) => console.log("Backend delete application notice:", err));
  } catch (err) {
    console.error("Backend delete application error:", err);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("applications_updated"));
    window.dispatchEvent(new CustomEvent("summits_updated"));
  }

  return updated;
};

export const exportGSTFinancialReportToCSV = (apps = null, summits = null) => {
  const list = apps || getApplications();
  const summitsList = summits || getSummits();
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
            <th>GST Liability (INR)</th>
            <th>Platform Fee (INR)</th>
            <th>Student Pass Code</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
  `;

  list.forEach((a) => {
    const paid = a.paymentStatus === "Paid";
    const b = computeAppFinancialBreakdown(a, summitsList);
    const gross = paid ? Math.round(b.gross) : 0;
    const base = paid ? Math.round(b.base) : 0;
    const gst = paid ? Math.round(b.gst) : 0;
    const fee = paid ? Math.round(b.platformFee) : 0;
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

export const exportApplicationsToCSV = (apps = null, summits = null) => {
  exportGSTFinancialReportToCSV(apps, summits);
};
