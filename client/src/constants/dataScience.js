import {
  Database, FileCode2, BarChart3, LineChart,
  BrainCircuit, Bot, Code2, Binary, ListTree, PieChart, Focus, Share2
} from 'lucide-react';

export const dataScienceTools = [
  {
    name: "Power BI",
    category: "Business Intelligence",
    description: "Create interactive dashboards and data-driven reports.",
    icon: PieChart
  },
  {
    name: "Tableau",
    category: "Business Intelligence",
    description: "Transform raw data into an understandable format with interactive visualizations.",
    icon: Focus
  },
  {
    name: "Python",
    category: "Programming",
    description: "Build data pipelines, analysis workflows and machine learning applications.",
    icon: Code2
  },
  {
    name: "SQL",
    category: "Database",
    description: "Extract, filter, and aggregate relational data efficiently.",
    icon: Database
  }
];

export const dataScienceWorkflow = [
  {
    step: "01",
    title: "Data mining",
    description: "Gather structured and unstructured data."
  },
  {
    step: "02",
    title: "Data Transformation",
    description: "Handle missing values, duplicates and inconsistencies."
  },
  {
    step: "03",
    title: "Data modeling",
    description: "Design data structures and discover relationships."
  },
  {
    step: "04",
    title: "Data load",
    description: "Load processed data into target systems."
  },
  {
    step: "05",
    title: "Visual",
    description: "Turn data into meaningful visual stories."
  }
];

export const dataScienceLearningPath = [
  {
    stage: "01",
    title: "Python",
    subtitle: "Programming Foundations"
  },
  {
    stage: "02",
    title: "Statistics",
    subtitle: "Understand Data"
  },
  {
    stage: "03",
    title: "SQL",
    subtitle: "Work With Data"
  },
  {
    stage: "04",
    title: "Pandas & NumPy",
    subtitle: "Data Manipulation"
  },
  {
    stage: "05",
    title: "Data Visualization",
    subtitle: "Tell the Story"
  },
  {
    stage: "06",
    title: "Machine Learning",
    subtitle: "Build Models"
  },
  {
    stage: "07",
    title: "AI & Advanced Analytics",
    subtitle: "Build Intelligent Systems"
  }
];

export const dataScienceProjects = [
  {
    title: "User Behavior & Engagement Analytics",
    difficulty: "Foundational",
    tools: ["Python", "Pandas", "Matplotlib"],
    description: "Analyze enterprise user interaction datasets to identify engagement drivers and behavior patterns.",
    skills: ["Data cleaning", "Exploratory Data Analysis", "Behavioral Insights"]
  },
  {
    title: "Customer Churn Prediction",
    difficulty: "Intermediate",
    tools: ["Python", "Pandas", "Scikit-learn"],
    description: "Build a model to predict which customers are likely to stop using a service.",
    skills: ["Data preprocessing", "Feature engineering", "Classification", "Model evaluation"]
  },
  {
    title: "Sales Analytics Dashboard",
    difficulty: "Intermediate",
    tools: ["SQL", "Power BI", "Excel"],
    description: "Create an interactive dashboard to track sales performance across regions.",
    skills: ["Data integration", "DAX", "Dashboard design", "KPI reporting"]
  },
  {
    title: "AI-Based Recommendation System",
    difficulty: "Advanced",
    tools: ["Python", "TensorFlow", "Scikit-learn"],
    description: "Develop a system that recommends products or content based on user behavior.",
    skills: ["Collaborative filtering", "Deep learning", "Model deployment"]
  }
];

export const dataScienceResearchAreas = [
  "Predictive Analytics",
  "Generative AI",
  "Computer Vision",
  "Natural Language Processing",
  "Time Series",
  "Recommendation Systems",
  "Responsible AI",
  "Big Data Analytics"
];

export const dataScienceCareerPaths = [
  {
    role: "Data Analyst",
    skills: "Data Exploration, Dashboarding, Reporting",
    tools: "SQL, Excel, Tableau, Power BI"
  },
  {
    role: "Data Scientist",
    skills: "Statistical Analysis, Machine Learning, Predictive Modeling",
    tools: "Python, R, Scikit-learn, Pandas"
  },
  {
    role: "ML Engineer",
    skills: "Model Deployment, Scalability, Pipeline Optimization",
    tools: "Python, TensorFlow, Docker, Kubernetes"
  },
  {
    role: "BI Analyst",
    skills: "Data Warehousing, Business Strategy, KPI Tracking",
    tools: "SQL, Power BI, Tableau, Snowflake"
  },
  {
    role: "Data Engineer",
    skills: "ETL Processes, Data Architecture, Big Data Tools",
    tools: "Python, Apache Spark, Hadoop, AWS/GCP"
  },
  {
    role: "AI Researcher",
    skills: "Deep Learning, Algorithm Design, NLP/Computer Vision",
    tools: "PyTorch, TensorFlow, Python"
  }
];
