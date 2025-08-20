import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaRocket,
  FaDatabase,
  FaServer,
  FaPaintBrush,
  FaShieldAlt,
  FaCode,
  FaClock,
  FaFlask,
  FaTools,
  FaMobile,
  FaBriefcase,
  FaExternalLinkAlt,
  FaUser,
} from "react-icons/fa";

import { ComicPageSeparator } from "@/components/home";
import { ClerkIcon } from "@/components/icons/ClerkIcon";
import { ConvexIcon } from "@/components/icons/ConvexIcon";
import { NeonIcon } from "@/components/icons/NeonIcon";
import { PassportIcon } from "@/components/icons/PassportIcon";
import { PlanetScaleIcon } from "@/components/icons/PlanetScaleIcon";
import { TursoIcon } from "@/components/icons/TursoIcon";
import {
  roadmapItems,
  statusConfig,
  type RoadmapCategory,
  type RoadmapStatus,
  type CustomIconName,
} from "@/config/roadmap";

/**
 * Map custom icon names to their components
 */
const customIconMap: Record<CustomIconName, React.ComponentType<{ className?: string }>> = {
  ClerkIcon,
  ConvexIcon,
  NeonIcon,
  PassportIcon,
  PlanetScaleIcon,
  TursoIcon,
};

/**
 * Helper function to get the icon component
 */
function getIconComponent(
  icon: React.ComponentType<{ className?: string }> | CustomIconName
): React.ComponentType<{ className?: string }> {
  if (typeof icon === "string" && icon in customIconMap) {
    return customIconMap[icon as CustomIconName];
  }
  return icon as React.ComponentType<{ className?: string }>;
}

/**
 * Category filter options
 */
const categoryFilters: {
  id: RoadmapCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { id: "all", label: "ALL", icon: FaRocket, color: "bg-comic-yellow" },
  { id: "frameworks", label: "FRAMEWORKS", icon: FaCode, color: "bg-comic-red" },
  { id: "backend", label: "BACKEND", icon: FaServer, color: "bg-comic-blue" },
  { id: "database", label: "DATABASE", icon: FaDatabase, color: "bg-comic-green" },
  { id: "ui", label: "UI LIBRARIES", icon: FaPaintBrush, color: "bg-comic-purple" },
  { id: "auth", label: "AUTHENTICATION", icon: FaShieldAlt, color: "bg-comic-orange" },
  { id: "mobile", label: "MOBILE", icon: FaMobile, color: "bg-comic-pink" },
];

/**
 * Roadmap section component displaying future support for disabled tools
 */
export function RoadmapSection() {
  const [selectedCategory, setSelectedCategory] = useState<RoadmapCategory>("all");
  const [selectedStatus, setSelectedStatus] = useState<RoadmapStatus | "all">("all");

  const filteredItems = roadmapItems.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const statusMatch = selectedStatus === "all" || item.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const groupedByStatus = {
    testing: filteredItems.filter((item) => item.status === "testing"),
    "coming-soon": filteredItems.filter((item) => item.status === "coming-soon"),
    planned: filteredItems.filter((item) => item.status === "planned"),
  };

  return (
    <div className="min-h-screen bg-comic-dots">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-4 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center mb-12"
          >
            <h1 className="action-text text-6xl md:text-8xl text-comic-black mb-4">ROADMAP</h1>
            <p className="font-comic text-xl md:text-2xl text-comic-black">
              Future support and testing for upcoming tools and frameworks
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categoryFilters.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg border-3 border-comic-black font-display text-sm flex items-center gap-2 transition-all ${
                    selectedCategory === category.id
                      ? `${category.color} text-comic-white`
                      : "bg-comic-white text-comic-black hover:bg-comic-yellow"
                  }`}
                  style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
                >
                  <Icon className="text-lg" />
                  {category.label}
                </motion.button>
              );
            })}
          </div>

          <div className="flex justify-center gap-3 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-lg border-2 border-comic-black font-comic text-sm transition-all ${
                selectedStatus === "all"
                  ? "bg-comic-black text-comic-white"
                  : "bg-comic-white text-comic-black hover:bg-comic-gray hover:text-comic-white"
              }`}
            >
              ALL STATUS
            </motion.button>
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              return (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStatus(status as RoadmapStatus)}
                  className={`px-4 py-2 rounded-lg border-2 border-comic-black font-comic text-sm flex items-center gap-2 transition-all ${
                    selectedStatus === status
                      ? config.color
                      : "bg-comic-white text-comic-black hover:bg-comic-gray hover:text-comic-white"
                  }`}
                >
                  <Icon />
                  {config.label}
                </motion.button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="comic-panel bg-comic-yellow p-4 text-center"
            >
              <div className="action-text text-3xl text-comic-black">
                {roadmapItems.filter((i) => i.status === "testing").length}
              </div>
              <div className="font-comic text-sm text-comic-black">IN TESTING</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="comic-panel bg-comic-blue p-4 text-center"
            >
              <div className="action-text text-3xl text-comic-white">
                {roadmapItems.filter((i) => i.status === "coming-soon").length}
              </div>
              <div className="font-comic text-sm text-comic-white">COMING SOON</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="comic-panel bg-comic-gray p-4 text-center"
            >
              <div className="action-text text-3xl text-comic-black">
                {roadmapItems.filter((i) => i.status === "planned").length}
              </div>
              <div className="font-comic text-sm text-comic-black">PLANNED</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="comic-panel bg-comic-purple p-4 text-center"
            >
              <div className="action-text text-3xl text-comic-white">{roadmapItems.length}</div>
              <div className="font-comic text-sm text-comic-white">TOTAL</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {groupedByStatus.testing.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="action-text text-3xl md:text-4xl text-comic-yellow mb-8 flex items-center gap-3"
            >
              <FaFlask /> IN TESTING
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedByStatus.testing.map((item, index) => {
                const Icon = getIconComponent(item.icon);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`comic-panel ${item.colorClass} p-6 relative overflow-hidden`}
                  >
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-comic-yellow text-comic-black text-xs font-comic font-bold rounded-full border-2 border-comic-black">
                        {item.progress}% COMPLETE
                      </span>
                    </div>

                    <div className="mb-4">
                      <Icon className="text-4xl text-comic-white" />
                    </div>

                    <h3 className="font-display text-2xl text-comic-white mb-2">{item.name}</h3>
                    <p className="font-comic text-sm text-comic-white/90 mb-3">
                      {item.description}
                    </p>

                    {item.expectedRelease && (
                      <div className="font-comic text-xs text-comic-white/80 mb-3">
                        Expected: {item.expectedRelease}
                      </div>
                    )}

                    {item.notes && (
                      <div className="bg-comic-black/20 rounded-lg p-3 border-2 border-comic-black">
                        <p className="font-comic text-xs text-comic-white">{item.notes}</p>
                        <p className="font-comic text-xs text-comic-yellow font-bold mt-2">
                          ⚠️ Requires major testing and compatibility review
                        </p>
                      </div>
                    )}

                    {item.progress !== undefined && (
                      <div className="mt-4 bg-comic-black/30 rounded-full h-3 overflow-hidden border-2 border-comic-black">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-comic-white"
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {groupedByStatus["coming-soon"].length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="action-text text-3xl md:text-4xl text-comic-blue mb-8 flex items-center gap-3"
            >
              <FaClock /> COMING SOON
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedByStatus["coming-soon"].map((item, index) => {
                const Icon = getIconComponent(item.icon);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="comic-panel bg-comic-white p-6 border-3 border-comic-blue"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className={`text-4xl ${item.colorClass.replace("bg-", "text-")}`} />
                      <span className="px-2 py-1 bg-comic-blue text-comic-white text-xs font-comic font-bold rounded-full">
                        {item.expectedRelease}
                      </span>
                    </div>

                    <h3 className="font-display text-xl text-comic-black mb-2">{item.name}</h3>
                    <p className="font-comic text-sm text-comic-gray mb-3">{item.description}</p>

                    {item.notes && (
                      <div className="bg-comic-blue/10 rounded-lg p-3 border border-comic-blue">
                        <p className="font-comic text-xs text-comic-darkBlue">{item.notes}</p>
                        <p className="font-comic text-xs text-comic-blue font-bold mt-2">
                          ⚠️ Requires major testing and compatibility review
                        </p>
                      </div>
                    )}

                    {item.progress !== undefined && (
                      <div className="mt-4 bg-comic-gray/20 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-comic-blue"
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {groupedByStatus.planned.length > 0 && (
        <section className="py-12 px-4 pb-20">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="action-text text-3xl md:text-4xl text-comic-black mb-8 flex items-center gap-3"
            >
              <FaTools /> PLANNED
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedByStatus.planned.map((item, index) => {
                const Icon = getIconComponent(item.icon);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="comic-panel bg-comic-gray/10 p-6 border-2 border-comic-gray border-dashed"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className="text-4xl text-comic-gray" />
                      {item.expectedRelease && (
                        <span className="px-2 py-1 bg-comic-gray/20 text-comic-gray text-xs font-comic rounded-full">
                          {item.expectedRelease}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl text-comic-black mb-2">{item.name}</h3>
                    <p className="font-comic text-sm text-comic-black/80 mb-3">
                      {item.description}
                    </p>

                    {item.notes && (
                      <div className="bg-comic-gray/10 rounded-lg p-3 border border-comic-gray/30">
                        <p className="font-comic text-xs text-comic-black">{item.notes}</p>
                        <p className="font-comic text-xs text-comic-red font-bold mt-2">
                          ⚠️ Requires major testing and compatibility review
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Comic Page Separator */}
      <ComicPageSeparator
        topColor="transparent"
        bottomColor="var(--comic-red)"
        text="HELP US BUILD!"
        icon={<FaTools />}
        pageNumber={1}
        textBgColor="var(--comic-yellow)"
        textColor="var(--comic-red)"
      />

      <section className="py-20 px-4 bg-comic-red">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="action-text text-4xl md:text-5xl text-comic-yellow mb-4">
              HELP US BUILD!
            </h2>
            <p className="font-comic text-xl text-comic-white mb-8">
              Vote for features, contribute code, or sponsor development
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="/request-feature"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-white inline-flex items-center gap-3"
              >
                <FaTools className="text-2xl" />
                REQUEST FEATURE
              </motion.a>
              <motion.a
                href="https://github.com/BuunGroupCore/precast-app/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow inline-flex items-center gap-3"
              >
                <FaCode className="text-2xl" />
                CONTRIBUTE
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comic Page Separator */}
      <div style={{ marginTop: "-1px" }}>
        <ComicPageSeparator
          topColor="var(--comic-red)"
          bottomColor="var(--comic-blue)"
          text="HIRE ME!"
          icon={<FaBriefcase />}
          pageNumber={2}
          textBgColor="var(--comic-yellow)"
          textColor="var(--comic-orange)"
        />
      </div>

      {/* Hire Me Section */}
      <section className="py-16 px-4 bg-comic-blue">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="comic-panel bg-comic-yellow p-4">
                <FaUser className="text-4xl text-comic-black" />
              </div>
            </div>
            <h2 className="action-text text-4xl md:text-5xl text-comic-yellow mb-4">
              LIKE MY WORK?
            </h2>
            <p className="font-comic text-xl text-comic-white mb-8">
              If you like my web design, automation, and AI integration skills, let&apos;s work
              together!
            </p>
            <motion.a
              href="https://sacha.roussakis-notter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-white inline-flex items-center gap-3 text-lg"
            >
              <FaBriefcase className="text-2xl" />
              HIRE ME
              <FaExternalLinkAlt className="text-lg" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
