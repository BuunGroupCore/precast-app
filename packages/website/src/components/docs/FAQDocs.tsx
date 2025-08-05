import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Precast?",
    answer:
      "Precast is a CLI tool that helps you quickly scaffold modern full-stack web applications with your preferred technology stack. It sets up everything you need including framework, database, styling, authentication, and more.",
  },
  {
    question: "What are the system requirements?",
    answer: "Precast requires Node.js version 18 or higher to be installed on your system.",
  },
  {
    question: "Which frameworks are supported?",
    answer:
      "Precast supports React, Next.js, Vue, Nuxt, Svelte, SolidJS, Angular, Remix, Astro, Vite, and Vanilla JavaScript/TypeScript.",
  },
  {
    question: "Can I use TypeScript?",
    answer:
      "Yes! TypeScript is enabled by default in all projects. You can disable it by using the --no-typescript flag.",
  },
  {
    question: "How do I add a database?",
    answer:
      "Use the --database flag with postgres, mysql, sqlite, or mongodb. Then choose an ORM with --orm (prisma, drizzle, or mongoose).",
  },
  {
    question: "Which UI component libraries are available?",
    answer:
      "Precast supports shadcn/ui, DaisyUI, Material UI, Chakra UI, Ant Design, Mantine, and Brutalist UI. Use the --ui-library flag to specify one.",
  },
  {
    question: "Can I use Docker?",
    answer: "Yes, add the --docker flag to include Docker configuration files in your project.",
  },
  {
    question: "How do I skip all prompts?",
    answer:
      "Use the --yes flag to skip all prompts and use default values. This is useful for automation or when you know exactly what you want.",
  },
  {
    question: "What if my package manager fails?",
    answer:
      "Precast automatically falls back to npm if your chosen package manager encounters issues with certain packages.",
  },
  {
    question: "Is authentication included?",
    answer:
      "You can add authentication using the --auth flag with options like better-auth, auth.js, clerk, lucia, or passport.",
  },
];

export function FAQDocs() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-8">
      <section id="faq-section" className="comic-panel p-6">
        <h2 className="font-display text-3xl text-comic-blue mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-comic-black rounded-lg overflow-hidden bg-comic-white"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-4 flex items-center justify-between hover:bg-comic-yellow/10 transition-colors"
              >
                <h3 className="font-display text-lg text-left">{faq.question}</h3>
                <div className="ml-2 flex-shrink-0">
                  {openItems.includes(index) ? (
                    <FaChevronDown className="text-comic-black" />
                  ) : (
                    <FaChevronRight className="text-comic-black" />
                  )}
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="p-4 pt-0">
                  <p className="font-comic text-comic-gray">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
