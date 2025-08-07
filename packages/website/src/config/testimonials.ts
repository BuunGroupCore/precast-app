export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  date: string;
  projectType?: string;
  highlighted?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "TechFlow Inc",
    avatar: "https://github.com/github.png",
    content:
      "PRECAST saved me HOURS of setup time! I launched my full-stack app in minutes instead of days. The comic book theme makes development FUN again!",
    rating: 5,
    date: "2024-01-15",
    projectType: "Full-Stack SaaS",
    highlighted: true,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Lead Engineer",
    company: "StartupHub",
    avatar: "https://github.com/github.png",
    content:
      "Finally, a CLI that understands developers! No more copy-pasting configs or debugging build tools. PRECAST is my new superhero sidekick!",
    rating: 5,
    date: "2024-02-20",
    projectType: "E-commerce Platform",
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "Full-Stack Developer",
    company: "DevCraft Studios",
    avatar: "https://github.com/github.png",
    content:
      "The best practices baked into every project are AMAZING. TypeScript-first, modern tooling, and everything just works. This is the future of project scaffolding!",
    rating: 5,
    date: "2024-03-10",
    projectType: "React + Node.js App",
  },
  {
    id: "4",
    name: "David Kim",
    role: "CTO",
    company: "InnovateTech",
    avatar: "https://github.com/github.png",
    content:
      "Our team's productivity skyrocketed after adopting PRECAST. Consistent project structure across all repos, latest dependencies, and zero configuration headaches!",
    rating: 5,
    date: "2024-03-25",
    projectType: "Enterprise Dashboard",
    highlighted: true,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "Frontend Architect",
    company: "PixelPerfect",
    avatar: "https://github.com/github.png",
    content:
      "PRECAST's attention to detail is incredible. From Tailwind configs to testing setups, everything is production-ready out of the box. Absolute game-changer!",
    rating: 5,
    date: "2024-04-05",
    projectType: "Design System",
  },
  {
    id: "6",
    name: "Alex Patel",
    role: "Indie Developer",
    company: "Solo Ventures",
    avatar: "https://github.com/github.png",
    content:
      "As a solo dev, PRECAST is like having a senior engineer setting up my projects. The time saved lets me focus on building features that matter!",
    rating: 5,
    date: "2024-04-18",
    projectType: "Mobile PWA",
  },
];
