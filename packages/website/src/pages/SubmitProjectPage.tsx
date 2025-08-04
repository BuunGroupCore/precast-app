import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaRocket,
  FaGithub,
  FaArrowLeft,
  FaCheckCircle,
  FaCode,
  FaUsers,
  FaStar,
  FaEye,
  FaLink,
  FaTag,
  FaPaperPlane,
} from "react-icons/fa";

export function SubmitProjectPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    demoUrl: "",
    repoUrl: "",
    techStack: "",
    completed: false,
    featured: false,
    additionalLabels: "",
  });

  const generateGitHubUrl = () => {
    const labels = ["showcase"];
    if (formData.completed) labels.push("completed");
    if (formData.featured) labels.push("featured");
    if (formData.additionalLabels) {
      labels.push(
        ...formData.additionalLabels
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean)
      );
    }

    const title = `[Showcase] ${formData.projectName || "New Project"}`;

    const body = `**Project Name:** ${formData.projectName}

**Description:** ${formData.description}

**Demo URL:** ${formData.demoUrl}

**Repository:** ${formData.repoUrl}

**Tech Stack:** ${formData.techStack}

**Additional Info:**
- Built with Precast CLI
- Ready for showcase display
- All requirements met

---
*This project was submitted via the Precast website showcase form*`;

    const params = new URLSearchParams({
      title,
      body,
      labels: labels.join(","),
      template: "showcase.md",
    });

    return `https://github.com/BuunGroupCore/precast-app/issues/new?${params.toString()}`;
  };

  const requirements = [
    "Built with Precast CLI",
    "Publicly accessible (demo or repository)",
    "Complete and functional project",
    "Appropriate content (family-friendly)",
  ];

  const benefits = [
    "Get featured on the Precast website",
    "Inspire other developers",
    "Show off your skills",
    "Build your developer portfolio",
    "Join the community of Precast heroes",
  ];

  return (
    <div className="min-h-screen pt-40 pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <button
          onClick={() => navigate("/showcase")}
          className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow flex items-center gap-2"
        >
          <FaArrowLeft />
          BACK TO SHOWCASE
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="action-text text-6xl md:text-8xl text-comic-red mb-8">
            SUBMIT YOUR PROJECT
          </h1>
          <div className="speech-bubble max-w-4xl mx-auto mb-12">
            <p className="font-comic text-xl md:text-2xl">
              <FaRocket className="inline text-comic-red mr-2" />
              Ready to join the <strong>HALL OF HEROES?</strong> Show off your amazing project built
              with Precast CLI and inspire other developers in the community!
            </p>
          </div>

          {/* Project Submission Form */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="comic-panel p-8 bg-comic-white">
              <h2 className="font-display text-3xl text-comic-black mb-6 text-center">
                PROJECT DETAILS
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Project Name */}
                <div>
                  <label className="block font-comic text-lg text-comic-black mb-2">
                    <FaRocket className="inline mr-2" />
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg"
                    style={{
                      backgroundColor: "var(--comic-white)",
                      borderColor: "var(--comic-black)",
                      boxShadow: "2px 2px 0 var(--comic-black)",
                    }}
                    placeholder="My Awesome Precast Project"
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block font-comic text-lg text-comic-black mb-2">
                    <FaCode className="inline mr-2" />
                    Tech Stack *
                  </label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg"
                    style={{
                      backgroundColor: "var(--comic-white)",
                      borderColor: "var(--comic-black)",
                      boxShadow: "2px 2px 0 var(--comic-black)",
                    }}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>

                {/* Demo URL */}
                <div>
                  <label className="block font-comic text-lg text-comic-black mb-2">
                    <FaEye className="inline mr-2" />
                    Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg"
                    style={{
                      backgroundColor: "var(--comic-white)",
                      borderColor: "var(--comic-black)",
                      boxShadow: "2px 2px 0 var(--comic-black)",
                    }}
                    placeholder="https://myproject.com"
                  />
                </div>

                {/* Repository URL */}
                <div>
                  <label className="block font-comic text-lg text-comic-black mb-2">
                    <FaGithub className="inline mr-2" />
                    Repository URL *
                  </label>
                  <input
                    type="url"
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg"
                    style={{
                      backgroundColor: "var(--comic-white)",
                      borderColor: "var(--comic-black)",
                      boxShadow: "2px 2px 0 var(--comic-black)",
                    }}
                    placeholder="https://github.com/user/project"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block font-comic text-lg text-comic-black mb-2">
                  <FaStar className="inline mr-2" />
                  Project Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg resize-none"
                  style={{
                    backgroundColor: "var(--comic-white)",
                    borderColor: "var(--comic-black)",
                    boxShadow: "2px 2px 0 var(--comic-black)",
                  }}
                  placeholder="Describe your awesome project and what makes it special..."
                />
              </div>

              {/* Labels and Options */}
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-comic text-lg text-comic-black mb-3">
                    <FaTag className="inline mr-2" />
                    Project Status
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.completed}
                        onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="font-comic">Project is completed and ready</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="font-comic">Consider for featured showcase</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-comic text-lg text-comic-black mb-2">
                    <FaTag className="inline mr-2" />
                    Additional Labels
                  </label>
                  <input
                    type="text"
                    value={formData.additionalLabels}
                    onChange={(e) => setFormData({ ...formData, additionalLabels: e.target.value })}
                    className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg"
                    style={{
                      backgroundColor: "var(--comic-white)",
                      borderColor: "var(--comic-black)",
                      boxShadow: "2px 2px 0 var(--comic-black)",
                    }}
                    placeholder="e-commerce, mobile, ai (comma separated)"
                  />
                  <p className="text-sm font-comic text-comic-black/70 mt-1">
                    Separate multiple labels with commas
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center mt-8">
                <motion.a
                  href={generateGitHubUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-pow inline-flex items-center gap-3 text-2xl px-12 py-6"
                >
                  <FaPaperPlane className="text-2xl" />
                  CREATE GITHUB ISSUE
                </motion.a>
                <p className="font-comic text-sm text-comic-black/70 mt-3">
                  This will open GitHub with your project details pre-filled
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="action-text text-4xl md:text-6xl text-comic-blue text-center mb-12">
            HOW IT WORKS
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="comic-panel p-8 bg-comic-red text-comic-white relative">
                <div className="absolute -top-2 -right-2 action-text text-xl text-comic-yellow z-10">
                  STEP 1!
                </div>
                <div className="bg-comic-white text-comic-red rounded-full w-16 h-16 flex items-center justify-center font-display text-3xl font-bold mx-auto mb-6">
                  1
                </div>
                <FaCode className="text-6xl mx-auto mb-4" />
                <h3 className="font-display text-2xl mb-4">BUILD SOMETHING AWESOME</h3>
                <p className="font-comic">
                  Create an amazing project using Precast CLI with your favorite tech stack and make
                  it shine!
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="comic-panel p-8 bg-comic-blue text-comic-white relative">
                <div className="absolute -top-2 -right-2 action-text text-xl text-comic-yellow z-10">
                  STEP 2!
                </div>
                <div className="bg-comic-white text-comic-blue rounded-full w-16 h-16 flex items-center justify-center font-display text-3xl font-bold mx-auto mb-6">
                  2
                </div>
                <FaGithub className="text-6xl mx-auto mb-4" />
                <h3 className="font-display text-2xl mb-4">SUBMIT VIA GITHUB</h3>
                <p className="font-comic">
                  Click the submit button to create a GitHub issue with your project details using
                  our template.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="comic-panel p-8 bg-comic-green text-comic-black relative">
                <div className="absolute -top-2 -right-2 action-text text-xl text-comic-red z-10">
                  STEP 3!
                </div>
                <div className="bg-comic-black text-comic-green rounded-full w-16 h-16 flex items-center justify-center font-display text-3xl font-bold mx-auto mb-6">
                  3
                </div>
                <FaStar className="text-6xl mx-auto mb-4" />
                <h3 className="font-display text-2xl mb-4">GET FEATURED</h3>
                <p className="font-comic">
                  Your project will appear in our Hall of Heroes for other developers to see and get
                  inspired!
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Requirements & Benefits */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="comic-panel p-8 bg-comic-purple text-comic-white">
              <h3 className="font-display text-3xl mb-6 flex items-center gap-3">
                <FaCheckCircle />
                REQUIREMENTS
              </h3>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <FaCheckCircle className="text-comic-green mt-1 flex-shrink-0" />
                    <span className="font-comic text-lg">{req}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="comic-panel p-8 bg-comic-yellow text-comic-black">
              <h3 className="font-display text-3xl mb-6 flex items-center gap-3">
                <FaStar />
                BENEFITS
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <FaStar className="text-comic-red mt-1 flex-shrink-0" />
                    <span className="font-comic text-lg">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

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

            <FaUsers className="text-8xl mx-auto mb-6 text-comic-red" />
            <h2 className="action-text text-4xl md:text-6xl mb-6">JOIN THE HEROES!</h2>

            <p className="font-comic text-xl mb-8 max-w-3xl mx-auto">
              Your project could be the next inspiration for thousands of developers.
              <strong className="text-comic-yellow"> Show the world what you've built!</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                href={generateGitHubUrl()}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-comic bg-comic-red text-comic-white hover:bg-comic-darkRed inline-flex items-center gap-3 text-xl px-8 py-4"
              >
                <FaRocket />
                SUBMIT NOW
              </motion.a>

              <motion.button
                onClick={() => navigate("/showcase")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow inline-flex items-center gap-3 text-xl px-8 py-4"
              >
                <FaEye />
                VIEW SHOWCASE
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
