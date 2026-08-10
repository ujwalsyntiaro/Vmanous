export const caseStudiesHeroData = {
  title: "Real Clients. Measurable Results.",
  subtitle: "We let the outcomes speak. Every case study details the challenge, the solution we designed, and the specific business impact delivered."
};

export const impactMetrics = [
  { value: "150+", label: "Clients Served" },
  { value: "$40M+", label: "Business Value Unlocked" },
  { value: "3 wks", label: "Avg. Time to First Dashboard" },
  { value: "98%", label: "Client Retention Rate" }
];

export const caseStudyCategories = [
  "All",
  "Customer Experience",
  "Property Management",
  "Construction",
  "Financial Services"
];

export const caseStudiesData = [
  {
    id: "cs-01",
    category: "Customer Experience",
    categoryLabel: "CUSTOMER EXPERIENCE",
    imagePill: "NPS & Churn Analytics",
    image: "/images/data-science/hero.jpg",
    title: "Strengthening Customer Relationships through Data-Driven NPS Analysis",
    client: "Enterprise Software Co. (Series C SaaS)",
    challenge: "The customer success team was manually exporting NPS survey data into Excel each month. Hidden detractors weren't identified until renewal time – by which point churn was unavoidable.",
    solution: "VMANOUS built a real-time NPS dashboard in Power BI, pulling from Medallia and Salesforce. Detractors were automatically flagged to the CS team within 48 hours of survey submission, with account health scores updated weekly.",
    result: "Revealed hidden detractors & fixed churn fast",
    tags: ["Dashboard Development", "DAX Optimisation", "Salesforce Integration"],
    stats: [
      { value: "57%", label: "Gross Retention Increase" },
      { value: "$2.4M", label: "Revenue Saved via Alerts" },
      { value: "100%", label: "Visibility into Renewal Risks" },
      { value: "3", label: "Weeks to Production" }
    ]
  },
  {
    id: "cs-02",
    category: "Property Management",
    categoryLabel: "PROPERTY MANAGEMENT",
    imagePill: "Operational Risk Analytics",
    image: "/images/ai-summit/gallery-1.jpg",
    title: "Simplified Property Management with Data-Driven Operational Insights",
    client: "National Realty Group (500+ properties)",
    challenge: "Insurance certificates, lease contracts, and mortgage data lived in three separate systems. Property managers couldn't see lapses in coverage before they became legal exposure events.",
    solution: "A unified Power BI semantic model consolidated all three data sources. Automated alerts flagged expiring insurance policies 60 days in advance. Lease renewal pipelines became fully visible to regional directors.",
    result: "Unified insurance, contracts & mortgages to prevent lapses",
    tags: ["Power BI Semantic Model", "Automated Risk Alerts", "Multi-Source Integration"],
    stats: [
      { value: "60 Days", label: "Advance Notice on Expiring Policies" },
      { value: "0", label: "Legal Exposure Lapses Post-Launch" },
      { value: "100%", label: "Portfolio Property Visibility" },
      { value: "4 wks", label: "Implementation Time" }
    ]
  },
  {
    id: "cs-03",
    category: "Construction",
    categoryLabel: "CONSTRUCTION",
    imagePill: "Asset & Equipment Analytics",
    image: "/images/data-science/gallery-1.jpg",
    title: "Optimizing Equipment Utilization & Project Lifecycle Tracking",
    client: "Apex Infrastructure & Commercial Builders",
    challenge: "Equipment downtime and resource misallocation caused project delays and over-budget rental expenses across 14 active job sites.",
    solution: "VMANOUS developed a centralized telemetry analytics dashboard tracking real-time asset utilization, fuel efficiency, and predictive maintenance alerts.",
    result: "Reduced equipment downtime and eliminated rental waste",
    tags: ["IoT Telemetry", "Predictive Maintenance", "Power BI Dashboards"],
    stats: [
      { value: "32%", label: "Equipment Downtime Reduction" },
      { value: "$1.8M", label: "Rental Expense Savings" },
      { value: "14", label: "Active Sites Synced Real-Time" },
      { value: "2 wks", label: "Deploy Time to First Site" }
    ]
  },
  {
    id: "cs-04",
    category: "Financial Services",
    categoryLabel: "FINANCIAL SERVICES",
    imagePill: "Risk & Compliance Analytics",
    image: "/images/ai-summit/gallery-2.jpg",
    title: "Automated Risk Assessment & Compliance Reporting Framework",
    client: "Prism Capital & Wealth Management",
    challenge: "Manual compliance audits took 3 weeks per quarter, slowing regulatory reporting and increasing risk of compliance penalties.",
    solution: "Built an automated risk analytics and audit trail system that dynamically scans portfolio transactions and generates audit-ready compliance reports.",
    result: "Streamlined quarterly audits with zero compliance penalties",
    tags: ["Risk Analytics", "Automated Auditing", "Compliance Reporting"],
    stats: [
      { value: "85%", label: "Faster Audit Preparation" },
      { value: "$3.1M", label: "Risk Exposure Mitigated" },
      { value: "0", label: "Compliance Penalties Post-Launch" },
      { value: "5 wks", label: "Total Rollout Time" }
    ]
  }
];
