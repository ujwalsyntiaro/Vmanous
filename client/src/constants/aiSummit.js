export const aiSummit = {
  id: "ai-summit-2026",
  slug: "ai-summit",
  title: "VMANOUS AI Summit 2026",
  theme: "Where Students Build With AI.",
  description: "An immersive AI experience combining practical learning, innovation, research and industry-focused projects.",
  
  images: {
    hero: "/images/ai-summit/hero.jpg",
    gallery: [
      "/images/ai-summit/gallery-1.jpg",
      "/images/ai-summit/gallery-2.jpg",
      "/images/ai-summit/gallery-3.jpg",
      "/images/ai-summit/gallery-4.jpg",
      "/images/ai-summit/gallery-5.jpg",
      "/images/ai-summit/gallery-6.jpg",
      "/images/ai-summit/gallery-7.jpg",
      "/images/ai-summit/gallery-1.jpg" // Fallback since I couldn't generate 8
    ]
  },

  programs: [
    {
      id: "program-01",
      title: "Artificial Intelligence Workshop",
      duration: "5 Days",
      description: "Build strong foundations in Artificial Intelligence, Machine Learning and Deep Learning.",
      topics: ["Python", "Machine Learning", "Deep Learning", "AI Fundamentals", "Generative AI"],
      cta: "Explore Program",
      link: "/ai-summit"
    },
    {
      id: "program-02",
      title: "AI Research & Development",
      duration: "10 Days",
      description: "Explore real-world AI problems using structured research.",
      topics: ["Research", "Experimentation", "Problem Solving", "AI Applications"],
      cta: "Explore Research",
      link: "#"
    },
    {
      id: "program-03",
      title: "AI Innovation Lab",
      duration: "Ongoing",
      description: "Build, prototype, test and improve practical AI projects.",
      topics: ["AI Assistant", "Recommendation System", "Predictive Model", "Computer Vision Application"],
      cta: "Explore Lab",
      link: "#"
    },
    {
      id: "program-04",
      title: "Industry Internship Pathway",
      duration: "1–3 Months",
      description: "Eligible participants may be considered for internship opportunities based on performance, evaluation and available opportunities.",
      topics: ["Real-world experience", "Mentorship", "Projects", "Industry exposure"],
      cta: "Explore Pathway",
      link: "#"
    }
  ],

  technologies: [
    { name: "Python", category: "Programming" },
    { name: "Scikit-learn", category: "Machine Learning" },
    { name: "TensorFlow", category: "Deep Learning" },
    { name: "PyTorch", category: "Deep Learning" },
    { name: "Neural Networks", category: "Deep Learning" },
    { name: "Jupyter", category: "Development" },
    { name: "Generative AI", category: "Generative AI" },
    { name: "LLMs", category: "Generative AI" },
    { name: "Computer Vision", category: "AI Applications" },
    { name: "NLP", category: "AI Applications" },
    { name: "Git", category: "Development" },
    { name: "GitHub", category: "Development" }
  ],

  projects: [
    {
      title: "AI Student Performance Predictor",
      type: "Predictive Analytics",
      difficulty: "Beginner",
      tools: ["Python", "Scikit-learn", "AI Models"],
      skills: ["Data preprocessing", "Classification", "Evaluation"]
    },
    {
      title: "Customer Churn Prediction",
      type: "Machine Learning",
      difficulty: "Intermediate",
      tools: ["Python", "Random Forest", "Scikit-learn"],
      skills: ["Feature engineering", "Model tuning", "Evaluation"]
    },
    {
      title: "AI Recommendation Engine",
      type: "Recommendation Systems",
      difficulty: "Advanced",
      tools: ["Python", "TensorFlow", "Scikit-learn"],
      skills: ["Collaborative filtering", "Deep learning", "Model deployment"]
    },
    {
      title: "Computer Vision Classifier",
      type: "Computer Vision",
      difficulty: "Intermediate",
      tools: ["Python", "OpenCV", "TensorFlow"],
      skills: ["Image processing", "CNNs", "Transfer Learning"]
    },
    {
      title: "Generative AI Assistant",
      type: "Generative AI",
      difficulty: "Intermediate",
      tools: ["Python", "LLM", "API", "Prompt Engineering"],
      skills: ["Prompt engineering", "API integration", "NLP"]
    }
  ],

  researchAreas: [
    "Generative AI",
    "Computer Vision",
    "NLP",
    "Predictive Analytics",
    "Recommendation Systems",
    "AI Automation",
    "Responsible AI",
    "Deep Neural Networks"
  ],

  timeline: [
    { day: "DAY 01", topic: "AI Foundations" },
    { day: "DAY 02", topic: "Python & Neural Networks" },
    { day: "DAY 03", topic: "Machine Learning" },
    { day: "DAY 04", topic: "Generative AI" },
    { day: "DAY 05", topic: "AI Applications" },
    { phase: "RESEARCH PHASE", duration: "10 Days" },
    { phase: "EVALUATION", duration: "Project + Assessment" },
    { phase: "INTERNSHIP PATHWAY", duration: "1–3 Months" }
  ],

  experience: [
    { title: "Hands-on Workshops", desc: "Learn by doing with interactive sessions." },
    { title: "AI Experiments", desc: "Explore AI behaviors in sandbox environments." },
    { title: "Practical Projects", desc: "Build portfolios with real-world use cases." },
    { title: "Research Exposure", desc: "Understand how to approach unsolved problems." },
    { title: "Mentor Guidance", desc: "Get feedback from experienced professionals." },
    { title: "Industry Perspective", desc: "Learn what companies actually use and value." },
    { title: "Team Collaboration", desc: "Work effectively in modern technical teams." },
    { title: "Problem Solving", desc: "Develop analytical and structural thinking." }
  ],

  faq: [
    { q: "What is VMANOUS AI Summit?", a: "An immersive AI experience combining practical learning, innovation, research and industry-focused projects." },
    { q: "Who can participate?", a: "Computer Science Students, Engineering Students, AI Learners, AI Enthusiasts, Students Interested in Research, and Students Building AI Projects." },
    { q: "What AI topics are covered?", a: "Topics range from Artificial Intelligence, Machine Learning, and Neural Networks to Generative AI, Computer Vision, and NLP." },
    { q: "Is the Summit hands-on?", a: "Yes, it focuses heavily on practical AI projects, coding, and real-world models." },
    { q: "What technologies can students explore?", a: "Technology areas may include Python, Scikit-learn, TensorFlow, PyTorch, Neural Networks, LLMs, and more." },
    { q: "Is there a project component?", a: "Yes, students participate in an AI Innovation Lab building practical projects." },
    { q: "Is there an assessment?", a: "Yes, participants are evaluated based on their projects and research outcomes." },
    { q: "Is a certificate provided?", a: "Participants who successfully complete the applicable program requirements and assessment criteria may receive a VMANOUS certificate." },
    { q: "Does completing the Summit guarantee an internship?", a: "No. Internship opportunities depend on eligibility, performance, evaluation and available opportunities." }
  ],

  registration: {
    status: "coming-soon",
    fee: "TBD"
  }
};
