import { motion } from "framer-motion";
import { FaHeart, FaArrowLeft, FaStar, FaQuoteLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { TestimonialForm, HowItWorks, BenefitsSection } from "@/components/submit-testimonial";
import { EXTERNAL_LINKS } from "@/config/constants";

/**
 * Testimonial submission page for sharing hero stories.
 * Generates a pre-filled GitHub issue for testimonial submissions.
 */
export function SubmitTestimonialPage() {
  const navigate = useNavigate();

  const generateGitHubUrl = (data: {
    name: string;
    role: string;
    company: string;
    githubUsername: string;
    projectType: string;
    testimonial: string;
    rating: string;
    avatarSeed: string;
  }): string => {
    // Return empty string if no data provided (prevents error on initial render)
    if (!data) return "#";

    const title = `[Testimonial] ${data.name || "New Hero Story"}`;

    const body = `## 🦸 Welcome to the Hero League!

Thank you for sharing your PRECAST success story! Your testimonial helps inspire other developers to become coding superheroes.

### 📝 Your Information

**Your Hero Name:** ${data.name}

**Your Role:** ${data.role}

**Your Organization:** ${data.company}

**GitHub Username:** ${data.githubUsername}

**Avatar Seed:** ${data.avatarSeed}

### 🚀 Project Details

**Project Type:** ${data.projectType}

### 💬 Your Hero Story

**Tell us about your experience with PRECAST:**
${data.testimonial}

### ⭐ Hero Rating

**How many stars would you give PRECAST?**
${"⭐".repeat(parseInt(data.rating))} (${data.rating} stars)

### ✅ Consent

Please confirm by checking these boxes:
- [x] I give permission to display this testimonial on the PRECAST website
- [x] I confirm this is my genuine experience with PRECAST

---
*Once submitted, a maintainer will review your testimonial and add the \`testimonial-approved\` label to include it on the website!*`;

    const params = new URLSearchParams({
      title,
      body,
      labels: "testimonial,hero-league",
      template: "testimonial.md",
    });

    return `${EXTERNAL_LINKS.GITHUB}/issues/new?${params.toString()}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate("/")}
          className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow flex items-center gap-2"
        >
          <FaArrowLeft />
          BACK TO HOME
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="action-text text-6xl md:text-8xl text-comic-purple mb-12">
            SHARE YOUR HERO STORY
          </h1>
          <div className="speech-bubble max-w-4xl mx-auto mb-12">
            <p className="font-comic text-xl md:text-2xl">
              <FaHeart className="inline text-comic-red mr-2" />
              Ready to join the <strong>HERO LEAGUE?</strong> Share how PRECAST helped you build
              something amazing and inspire fellow developers!
            </p>
          </div>

          {/* Comic Separator */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="h-2 bg-comic-black rounded-full"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
                <div className="action-text text-2xl text-comic-yellow bg-comic-purple px-4 py-1 rounded-full border-4 border-comic-yellow">
                  LEGENDARY!
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Submission Form */}
          <div className="max-w-4xl mx-auto mb-16">
            <TestimonialForm onSubmit={generateGitHubUrl} />
          </div>
        </motion.div>

        {/* How It Works */}
        <HowItWorks />

        {/* Benefits */}
        <BenefitsSection />

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="comic-panel p-12 bg-comic-black text-comic-white relative">
            <div className="absolute -top-4 -left-4 action-text text-3xl text-comic-yellow z-10">
              READY?
            </div>

            <FaHeart className="text-8xl mx-auto mb-6 text-comic-red animate-pulse" />
            <h2 className="action-text text-4xl md:text-6xl mb-6">YOUR STORY MATTERS!</h2>

            <p className="font-comic text-xl mb-8 max-w-3xl mx-auto">
              Every hero has a story. Share yours and help other developers discover the
              <strong className="text-comic-yellow"> power of PRECAST!</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="#testimonial-form"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn-comic bg-comic-purple text-comic-white hover:bg-comic-darkPurple inline-flex items-center gap-3 text-xl px-8 py-4"
              >
                <FaQuoteLeft />
                SHARE YOUR STORY
              </a>

              <button
                onClick={() => navigate("/testimonials")}
                className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow inline-flex items-center gap-3 text-xl px-8 py-4"
              >
                <FaStar />
                READ TESTIMONIALS
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
