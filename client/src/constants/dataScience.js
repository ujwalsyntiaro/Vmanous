import { 
  Database, FileCode2, BarChart3, LineChart, 
  BrainCircuit, Bot, Code2, Binary, ListTree, PieChart, Focus, Share2
} from 'lucide-react';

export const dataScienceTools = [
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
  },
  {
    name: "Pandas",
    category: "Data Analysis",
    description: "Manipulate, clean and analyze structured datasets.",
    icon: FileCode2
  },
  {
    name: "NumPy",
    category: "Scientific Computing",
    description: "Perform advanced mathematical and array operations.",
    icon: Binary
  },
  {
    name: "Matplotlib",
    category: "Data Visualization",
    description: "Create static, animated, and interactive visualizations.",
    icon: BarChart3
  },
  {
    name: "Seaborn",
    category: "Data Visualization",
    description: "Draw attractive and informative statistical graphics.",
    icon: LineChart
  },
  {
    name: "Scikit-learn",
    category: "Machine Learning",
    description: "Build and evaluate practical machine learning models.",
    icon: BrainCircuit
  },
  {
    name: "Jupyter Notebook",
    category: "Development",
    description: "Create and share documents with live code, equations, and narrative text.",
    icon: ListTree
  },
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
    name: "TensorFlow",
    category: "Deep Learning",
    description: "Develop and train advanced neural networks for complex tasks.",
    icon: Bot
  },
  {
    name: "Git & GitHub",
    category: "Version Control",
    description: "Collaborate on projects, manage source code, and track changes.",
    icon: Share2
  }
];

export const dataScienceWorkflow = [
  {
    step: "01",
    title: "Collect",
    description: "Gather structured and unstructured data."
  },
  {
    step: "02",
    title: "Clean",
    description: "Handle missing values, duplicates and inconsistencies."
  },
  {
    step: "03",
    title: "Explore",
    description: "Discover patterns and relationships."
  },
  {
    step: "04",
    title: "Visualize",
    description: "Turn data into meaningful visual stories."
  },
  {
    step: "05",
    title: "Model",
    description: "Apply statistical and machine learning techniques."
  },
  {
    step: "06",
    title: "Predict",
    description: "Generate insights and support better decisions."
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
