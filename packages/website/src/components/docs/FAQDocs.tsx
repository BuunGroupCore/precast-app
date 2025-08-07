import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

import { generateFAQFromStackConfig } from "@/utils/stackConfigReader";

interface FAQItem {
  question: string;
  answer: string;
}

// Generate FAQ data dynamically from stack config
const faqs: FAQItem[] = generateFAQFromStackConfig();

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
        <h2 className="font-comic text-3xl text-comic-blue mb-6">Frequently Asked Questions</h2>

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
                <h3 className="font-comic text-lg text-left">{faq.question}</h3>
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
