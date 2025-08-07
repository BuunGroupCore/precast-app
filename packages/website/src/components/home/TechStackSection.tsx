import { motion } from "framer-motion";
import {
  FaReact,
  FaVuejs,
  FaAngular,
  FaNodeJs,
  FaDatabase,
  FaPalette,
  FaCode,
  FaBolt,
  FaRocket,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiExpress,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiSupabase,
  SiTailwindcss,
  SiSass,
} from "react-icons/si";
import { useNavigate } from "react-router-dom";

/**
 * Tech stack section component showcasing available technologies.
 * Displays frontend, backend, database, and styling options in a visually appealing grid.
 */
export function TechStackSection() {
  const navigate = useNavigate();

  const techCategories = [
    {
      title: "FRONTEND",
      icon: FaReact,
      color: "var(--comic-red)",
      effect: "POW!",
      position: { top: -3, right: -3 },
      technologies: [
        { name: "React", icon: FaReact },
        { name: "Vue", icon: FaVuejs },
        { name: "Angular", icon: FaAngular },
        { name: "Next.js", icon: SiNextdotjs },
      ],
    },
    {
      title: "BACKEND",
      icon: FaNodeJs,
      color: "var(--comic-blue)",
      effect: "ZAP!",
      position: { top: -3, left: -3 },
      technologies: [
        { name: "Node.js", icon: FaNodeJs },
        { name: "Express", icon: SiExpress },
        { name: "FastAPI", icon: SiFastapi },
        { name: "Hono", icon: FaCode },
      ],
    },
    {
      title: "DATABASE",
      icon: FaDatabase,
      color: "var(--comic-green)",
      effect: "BAM!",
      position: { top: -3, right: -3 },
      technologies: [
        { name: "PostgreSQL", icon: SiPostgresql },
        { name: "MongoDB", icon: SiMongodb },
        { name: "MySQL", icon: SiMysql },
        { name: "Supabase", icon: SiSupabase },
      ],
    },
    {
      title: "STYLING",
      icon: FaPalette,
      color: "var(--comic-purple)",
      effect: "BOOM!",
      position: { top: -3, left: -3 },
      technologies: [
        { name: "Tailwind CSS", icon: SiTailwindcss },
        { name: "CSS/SCSS", icon: SiSass },
        { name: "Styled Components", icon: FaCode },
        { name: "CSS Modules", icon: FaPalette },
      ],
    },
  ];

  return (
    <section className="py-20 px-4 relative" style={{ backgroundColor: "var(--comic-gray)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="action-text text-5xl md:text-7xl text-comic-purple mb-6">
              CHOOSE YOUR ARSENAL
            </span>
          </h2>
          <div className="speech-bubble max-w-2xl mx-auto">
            <p className="font-comic text-lg md:text-xl">
              Mix and match from our <strong>POWERFUL COLLECTION</strong> of technologies to create
              your perfect tech stack!
            </p>
          </div>
        </motion.div>

        <div className="mb-16">
          <div className="relative">
            <div className="h-2 bg-comic-black rounded-full"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
              <div className="action-text text-2xl text-comic-purple bg-comic-black px-4 py-1 rounded-full border-4 border-comic-purple">
                ASSEMBLE!
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {techCategories.map((category, index) => {
            const Icon = category.icon;
            const effectColor =
              category.title === "FRONTEND"
                ? "text-comic-red"
                : category.title === "BACKEND"
                  ? "text-comic-blue"
                  : category.title === "DATABASE"
                    ? "text-comic-green"
                    : "text-comic-purple";

            return (
              <motion.div key={category.title} whileHover={{ y: -8 }} className="relative group">
                <div
                  className={`absolute action-text text-base ${effectColor} z-30`}
                  style={category.position}
                >
                  {category.effect}
                </div>
                <div
                  className="comic-panel p-8 text-center h-full relative overflow-hidden transition-shadow hover:shadow-2xl"
                  style={{ backgroundColor: category.color, color: "var(--comic-white)" }}
                >
                  <div className="relative z-10">
                    <Icon
                      className={`text-6xl mx-auto mb-4 ${
                        index === 0
                          ? "group-hover:animate-spin"
                          : index === 1
                            ? "group-hover:animate-pulse"
                            : index === 2
                              ? "group-hover:animate-bounce"
                              : "group-hover:animate-pulse"
                      }`}
                    />
                    <div className="action-text text-2xl mb-6">{category.title}</div>
                    <div className="space-y-4">
                      {category.technologies.map((tech) => {
                        const TechIcon = tech.icon;
                        return (
                          <div
                            key={tech.name}
                            className="flex items-center justify-center gap-3 font-comic font-bold text-lg"
                          >
                            <TechIcon className="text-xl" />
                            <span>{tech.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 text-6xl opacity-10">
                    <Icon />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="text-center">
          <motion.button
            onClick={() => navigate("/builder")}
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center gap-4 px-10 py-5 text-2xl font-comic font-bold rounded-full border-6 border-comic-black transition-all"
            style={{
              backgroundColor: "var(--comic-yellow)",
              borderColor: "var(--comic-black)",
              color: "var(--comic-black)",
              boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0, 0, 0, 0.3)",
            }}
          >
            <FaBolt className="text-3xl animate-pulse" />
            <span>BUILD YOUR STACK NOW!</span>
            <FaRocket className="text-3xl" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
