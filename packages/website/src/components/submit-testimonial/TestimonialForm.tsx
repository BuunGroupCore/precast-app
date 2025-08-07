import { useState, useEffect } from "react";
import {
  FaStar,
  FaGithub,
  FaQuoteLeft,
  FaRocket,
  FaTrophy,
  FaUsers,
  FaPaperPlane,
} from "react-icons/fa";

import { AvatarGenerator } from "./AvatarGenerator";
import { ProjectTypeDropdown } from "./ProjectTypeDropdown";

interface TestimonialFormData {
  name: string;
  role: string;
  company: string;
  githubUsername: string;
  projectType: string;
  testimonial: string;
  rating: string;
  avatarSeed: string;
}

interface TestimonialFormProps {
  onSubmit: (data: TestimonialFormData) => string;
}

/**
 * Testimonial submission form component with all form fields and avatar generation.
 */
export function TestimonialForm({ onSubmit }: TestimonialFormProps) {
  const [avatarSeed, setAvatarSeed] = useState("");
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    githubUsername: "",
    projectType: "",
    testimonial: "",
    rating: "5",
  });

  // Generate initial avatar seed
  useEffect(() => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  }, []);

  const handleGenerateAvatar = () => {
    setIsAvatarLoading(true);
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const getSubmitUrl = () => {
    return onSubmit({ ...formData, avatarSeed });
  };

  return (
    <div className="comic-panel p-8 bg-comic-white">
      <h2 className="font-display text-3xl text-comic-black mb-6 text-center">YOUR HERO DETAILS</h2>

      <AvatarGenerator
        avatarSeed={avatarSeed}
        isLoading={isAvatarLoading}
        onGenerateNew={handleGenerateAvatar}
        onLoadComplete={() => setIsAvatarLoading(false)}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block font-comic text-lg text-comic-black mb-2">
            <FaStar className="inline mr-2 text-comic-yellow" />
            Your Hero Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg"
            style={{
              backgroundColor: "var(--comic-white)",
              borderColor: "var(--comic-black)",
              boxShadow: "2px 2px 0 var(--comic-black)",
            }}
            placeholder="John Doe"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block font-comic text-lg text-comic-black mb-2">
            <FaTrophy className="inline mr-2 text-comic-purple" />
            Your Role *
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg"
            style={{
              backgroundColor: "var(--comic-white)",
              borderColor: "var(--comic-black)",
              boxShadow: "2px 2px 0 var(--comic-black)",
            }}
            placeholder="Senior Developer"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block font-comic text-lg text-comic-black mb-2">
            <FaUsers className="inline mr-2 text-comic-blue" />
            Your Organization *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg"
            style={{
              backgroundColor: "var(--comic-white)",
              borderColor: "var(--comic-black)",
              boxShadow: "2px 2px 0 var(--comic-black)",
            }}
            placeholder="Awesome Corp"
          />
        </div>

        {/* GitHub Username */}
        <div>
          <label className="block font-comic text-lg text-comic-black mb-2">
            <FaGithub className="inline mr-2" />
            GitHub Username *
          </label>
          <input
            type="text"
            value={formData.githubUsername}
            onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
            className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg"
            style={{
              backgroundColor: "var(--comic-white)",
              borderColor: "var(--comic-black)",
              boxShadow: "2px 2px 0 var(--comic-black)",
            }}
            placeholder="johndoe"
          />
        </div>
      </div>

      {/* Project Type */}
      <div className="mt-6">
        <label className="block font-comic text-lg text-comic-black mb-2">
          <FaRocket className="inline mr-2 text-comic-red" />
          Project Type *
        </label>
        <ProjectTypeDropdown
          value={formData.projectType}
          onChange={(value) => setFormData({ ...formData, projectType: value })}
        />
      </div>

      {/* Testimonial */}
      <div className="mt-6">
        <label className="block font-comic text-lg text-comic-black mb-2">
          <FaQuoteLeft className="inline mr-2 text-comic-purple" />
          Your Hero Story *
        </label>
        <textarea
          value={formData.testimonial}
          onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
          rows={6}
          className="w-full p-3 border-4 border-comic-black rounded-lg font-comic text-lg resize-none"
          style={{
            backgroundColor: "var(--comic-white)",
            borderColor: "var(--comic-black)",
            boxShadow: "2px 2px 0 var(--comic-black)",
          }}
          placeholder="Tell us about your experience with PRECAST! What problems did it solve? How did it help you? What features did you love?"
        />
      </div>

      {/* Rating */}
      <div className="mt-6">
        <label className="block font-comic text-lg text-comic-black mb-3 text-center">
          <FaStar className="inline mr-2 text-comic-yellow" />
          Hero Rating *
        </label>
        <div className="flex items-center justify-center gap-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star.toString() })}
                className="text-4xl transition-all transform hover:scale-110"
              >
                <FaStar
                  className={
                    star <= parseInt(formData.rating) ? "text-comic-yellow" : "text-comic-gray"
                  }
                />
              </button>
            ))}
          </div>
          <span className="font-comic text-xl text-comic-black">{formData.rating} stars</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-8">
        <a
          href={getSubmitUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pow inline-flex items-center gap-3 text-2xl px-12 py-6"
        >
          <FaPaperPlane className="text-2xl" />
          SUBMIT TESTIMONIAL
        </a>
        <p className="font-comic text-sm text-comic-black/70 mt-3">
          This will open GitHub with your testimonial pre-filled
        </p>
      </div>
    </div>
  );
}
