import { IconType } from "react-icons";
import {
  FaUserGraduate,
  FaUserTie,
  FaUserNinja,
  FaDesktop,
  FaMobile,
  FaServer,
  FaShoppingCart,
  FaChartLine,
  FaBlog,
  FaGamepad,
  FaBuilding,
  FaUsers,
  FaRocket,
  FaClock,
  FaShieldAlt,
  FaCode,
  FaDollarSign,
  FaGlobe,
  FaPaintBrush,
  FaLock,
  FaCloud,
  FaRobot,
  FaEnvelope,
  FaLightbulb,
  FaPalette,
} from "react-icons/fa";

export interface SurveyQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type: "single" | "multiple" | "scale";
  options: {
    value: string;
    label: string;
    icon?: IconType;
    description?: string;
  }[];
  category: string;
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    id: "experience",
    question: "What's your experience level?",
    subtitle: "This helps us recommend the right tools for you",
    type: "single",
    category: "profile",
    options: [
      {
        value: "beginner",
        label: "Beginner",
        icon: FaUserGraduate,
        description: "Just starting my coding journey",
      },
      {
        value: "intermediate",
        label: "Intermediate",
        icon: FaUserTie,
        description: "Building projects, learning patterns",
      },
      {
        value: "advanced",
        label: "Advanced",
        icon: FaUserNinja,
        description: "Years of experience, complex systems",
      },
    ],
  },
  {
    id: "projectType",
    question: "What are you building?",
    subtitle: "Select all that apply",
    type: "multiple",
    category: "project",
    options: [
      {
        value: "webapp",
        label: "Web Application",
        icon: FaDesktop,
        description: "Interactive web app",
      },
      {
        value: "mobile",
        label: "Mobile App",
        icon: FaMobile,
        description: "iOS/Android app",
      },
      {
        value: "api",
        label: "API/Backend",
        icon: FaServer,
        description: "REST or GraphQL API",
      },
      {
        value: "ecommerce",
        label: "E-commerce",
        icon: FaShoppingCart,
        description: "Online store",
      },
      {
        value: "dashboard",
        label: "Dashboard",
        icon: FaChartLine,
        description: "Analytics & data viz",
      },
      {
        value: "blog",
        label: "Blog/CMS",
        icon: FaBlog,
        description: "Content platform",
      },
      {
        value: "game",
        label: "Game",
        icon: FaGamepad,
        description: "Interactive game",
      },
      {
        value: "enterprise",
        label: "Enterprise",
        icon: FaBuilding,
        description: "Business application",
      },
    ],
  },
  {
    id: "teamSize",
    question: "How big is your team?",
    type: "single",
    category: "team",
    options: [
      {
        value: "solo",
        label: "Just me",
        icon: FaUserNinja,
        description: "Solo developer",
      },
      {
        value: "small",
        label: "2-5 people",
        icon: FaUsers,
        description: "Small team",
      },
      {
        value: "medium",
        label: "6-20 people",
        icon: FaUsers,
        description: "Medium team",
      },
      {
        value: "large",
        label: "20+ people",
        icon: FaBuilding,
        description: "Large organization",
      },
    ],
  },
  {
    id: "timeline",
    question: "What's your timeline?",
    type: "single",
    category: "constraints",
    options: [
      {
        value: "prototype",
        label: "Quick Prototype",
        icon: FaRocket,
        description: "Need something fast",
      },
      {
        value: "mvp",
        label: "MVP (1-3 months)",
        icon: FaClock,
        description: "Minimum viable product",
      },
      {
        value: "production",
        label: "Production (3-6 months)",
        icon: FaChartLine,
        description: "Full-featured app",
      },
      {
        value: "longterm",
        label: "Long-term (6+ months)",
        icon: FaBuilding,
        description: "Enterprise solution",
      },
    ],
  },
  {
    id: "priorities",
    question: "What matters most to you?",
    subtitle: "Pick your top 3 priorities",
    type: "multiple",
    category: "priorities",
    options: [
      {
        value: "speed",
        label: "Development Speed",
        icon: FaRocket,
        description: "Ship fast",
      },
      {
        value: "performance",
        label: "Performance",
        icon: FaChartLine,
        description: "Lightning fast",
      },
      {
        value: "scalability",
        label: "Scalability",
        icon: FaCloud,
        description: "Handle growth",
      },
      {
        value: "security",
        label: "Security",
        icon: FaShieldAlt,
        description: "Fort Knox level",
      },
      {
        value: "dx",
        label: "Developer Experience",
        icon: FaCode,
        description: "Joy to work with",
      },
      {
        value: "cost",
        label: "Low Cost",
        icon: FaDollarSign,
        description: "Budget friendly",
      },
      {
        value: "seo",
        label: "SEO",
        icon: FaGlobe,
        description: "Search visibility",
      },
      {
        value: "ui",
        label: "Beautiful UI",
        icon: FaPaintBrush,
        description: "Stunning design",
      },
    ],
  },
  {
    id: "features",
    question: "Which features do you need?",
    subtitle: "We'll set these up for you",
    type: "multiple",
    category: "features",
    options: [
      {
        value: "auth",
        label: "Authentication",
        icon: FaLock,
        description: "User login/signup",
      },
      {
        value: "database",
        label: "Database",
        icon: FaServer,
        description: "Store data",
      },
      {
        value: "payments",
        label: "Payments",
        icon: FaDollarSign,
        description: "Accept payments",
      },
      {
        value: "ai",
        label: "AI Integration",
        icon: FaRobot,
        description: "AI-powered features",
      },
      {
        value: "realtime",
        label: "Real-time",
        icon: FaClock,
        description: "Live updates",
      },
      {
        value: "email",
        label: "Email",
        icon: FaEnvelope,
        description: "Send emails",
      },
      {
        value: "storage",
        label: "File Storage",
        icon: FaCloud,
        description: "Upload files",
      },
      {
        value: "analytics",
        label: "Analytics",
        icon: FaChartLine,
        description: "Track metrics",
      },
    ],
  },
  {
    id: "deployment",
    question: "Where will you deploy?",
    type: "single",
    category: "deployment",
    options: [
      {
        value: "vercel",
        label: "Vercel/Netlify",
        icon: FaCloud,
        description: "Edge deployment",
      },
      {
        value: "aws",
        label: "AWS/GCP/Azure",
        icon: FaServer,
        description: "Cloud platforms",
      },
      {
        value: "selfhosted",
        label: "Self-hosted",
        icon: FaServer,
        description: "Own infrastructure",
      },
      {
        value: "unsure",
        label: "Not sure yet",
        icon: FaLightbulb,
        description: "Help me decide",
      },
    ],
  },
  {
    id: "designPreference",
    question: "Design style preference?",
    type: "single",
    category: "design",
    options: [
      {
        value: "minimal",
        label: "Minimal & Clean",
        icon: FaPalette,
        description: "Less is more",
      },
      {
        value: "modern",
        label: "Modern & Bold",
        icon: FaPaintBrush,
        description: "Eye-catching",
      },
      {
        value: "playful",
        label: "Fun & Playful",
        icon: FaGamepad,
        description: "Personality-driven",
      },
      {
        value: "professional",
        label: "Professional",
        icon: FaBuilding,
        description: "Business-ready",
      },
    ],
  },
];
