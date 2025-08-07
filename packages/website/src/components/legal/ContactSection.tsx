import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { EXTERNAL_LINKS, INTERNAL_LINKS, EMAILS } from "@/config/constants";

interface ContactSectionProps {
  delay?: number;
  emailType: keyof typeof EMAILS;
  title?: string;
}

export function ContactSection({
  delay = 0.5,
  emailType = "LEGAL",
  title = "CONTACT US",
}: ContactSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="border-8 border-comic-black rounded-lg bg-comic-white shadow-2xl p-8"
    >
      <h2 className="font-comic text-3xl font-bold text-comic-red mb-6">{title}</h2>
      <div className="space-y-4">
        <p className="font-comic text-lg text-comic-darkBlue leading-relaxed">
          If you have any questions, please contact us at:
        </p>
        <div className="bg-comic-white p-6 rounded-lg border-4 border-comic-black">
          <ul className="font-comic text-lg text-comic-darkBlue space-y-3">
            <li>
              <strong>Email:</strong> {EMAILS[emailType]}
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              <a
                href={`${EXTERNAL_LINKS.GITHUB}/issues`}
                className="text-comic-red font-bold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open an Issue
              </a>
            </li>
            <li>
              <strong>Website:</strong>{" "}
              <a
                href={`${INTERNAL_LINKS.PRECAST_URL}/support`}
                className="text-comic-red font-bold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {INTERNAL_LINKS.PRECAST_URL}/support
              </a>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-comic-gray bg-opacity-20 rounded border-2 border-comic-black">
            <p className="font-comic text-lg text-comic-darkBlue mb-3">
              <strong>For transparency, you can also:</strong>
            </p>
            <ul className="font-comic text-lg text-comic-darkBlue space-y-2">
              <li>
                • View our telemetry collection code on{" "}
                <a
                  href={EXTERNAL_LINKS.GITHUB}
                  className="text-comic-red font-bold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                • See aggregated usage statistics on our{" "}
                <Link to="/metrics" className="text-comic-red font-bold hover:underline">
                  metrics page
                </Link>
              </li>
              <li>• Review our data processing in our open-source codebase</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
