import { motion } from "framer-motion";
import { FaQuoteLeft, FaGithub, FaTrophy } from "react-icons/fa";

/**
 * How It Works section explaining the testimonial submission process.
 */
export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "SHARE YOUR STORY",
      description:
        "Tell us how PRECAST helped you become a coding superhero and save development time!",
      icon: FaQuoteLeft,
      bgColor: "bg-comic-purple",
      textColor: "text-comic-white",
      iconBgColor: "bg-comic-white",
      iconTextColor: "text-comic-purple",
      tagColor: "text-comic-yellow",
    },
    {
      number: 2,
      title: "SUBMIT VIA GITHUB",
      description:
        "Your story creates a GitHub issue for review. Once approved, it joins our hero testimonials!",
      icon: FaGithub,
      bgColor: "bg-comic-yellow",
      textColor: "text-comic-black",
      iconBgColor: "bg-comic-black",
      iconTextColor: "text-comic-yellow",
      tagColor: "text-comic-red",
    },
    {
      number: 3,
      title: "JOIN THE LEAGUE",
      description:
        "Your testimonial appears on our website, inspiring developers worldwide to use PRECAST!",
      icon: FaTrophy,
      bgColor: "bg-comic-red",
      textColor: "text-comic-white",
      iconBgColor: "bg-comic-white",
      iconTextColor: "text-comic-red",
      tagColor: "text-comic-yellow",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <h2 className="action-text text-4xl md:text-6xl text-comic-purple text-center mb-12">
        HOW IT WORKS
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{
              opacity: 0,
              ...(index === 0 ? { x: -50 } : index === 2 ? { x: 50 } : { y: 50 }),
            }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="text-center"
          >
            <div className={`comic-panel p-8 ${step.bgColor} ${step.textColor} relative h-full`}>
              <div className={`absolute -top-2 -right-2 action-text text-xl ${step.tagColor} z-10`}>
                STEP {step.number}!
              </div>
              <div
                className={`${step.iconBgColor} ${step.iconTextColor} rounded-full w-16 h-16 flex items-center justify-center font-display text-3xl font-bold mx-auto mb-6`}
              >
                {step.number}
              </div>
              <step.icon className="text-6xl mx-auto mb-4" />
              <h3 className="font-display text-2xl mb-4">{step.title}</h3>
              <p className="font-comic">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
