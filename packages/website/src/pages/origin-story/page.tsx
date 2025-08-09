import { motion } from "framer-motion";
import {
  FaRocket,
  FaClock,
  FaLightbulb,
  FaUsers,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaBolt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * Origin story page explaining the motivation behind creating Precast.
 * Highlights common development problems and how Precast solves them.
 */
export function OriginStoryPage() {
  const navigate = useNavigate();

  const problems = [
    "Hours wasted setting up the same boilerplate configurations",
    "Copy-pasting configs from old projects and hoping they work",
    "Debugging build tools instead of building features",
    "Inconsistent project structures across teams",
    "Outdated dependencies and security vulnerabilities",
    "Missing best practices and optimization opportunities",
  ];

  const solutions = [
    "Zero-config setup with modern best practices",
    "Pre-configured linting, testing, and build tools",
    "Consistent project structure and conventions",
    "Latest dependency versions with security patches",
    "Performance optimizations built-in",
    "TypeScript-first approach for better DX",
  ];

  return (
    <div className="min-h-screen pt-8 pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3"
        >
          <FaArrowLeft className="text-sm sm:text-base" />
          <span>BACK TO HOME</span>
        </button>
      </div>

      {/* Comic-style separator below back button */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full border-2 border-comic-black shadow-lg"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-3 sm:-top-4">
            <div className="action-text text-base sm:text-xl text-comic-white bg-comic-red px-3 sm:px-4 py-1 rounded-full border-2 sm:border-4 border-comic-black shadow-lg transform rotate-2">
              STORY TIME!
            </div>
          </div>
          {/* Comic dots decoration */}
          <div className="absolute left-0 sm:-left-3 -top-1 w-3 sm:w-4 h-3 sm:h-4 bg-comic-yellow rounded-full border-2 border-comic-black"></div>
          <div className="absolute right-0 sm:-right-3 -top-1 w-3 sm:w-4 h-3 sm:h-4 bg-comic-blue rounded-full border-2 border-comic-black"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="action-text text-5xl sm:text-6xl md:text-8xl text-comic-red mb-8">
            ORIGIN STORY
          </h1>
          <div className="speech-bubble max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto mb-12 mx-4 sm:mx-auto">
            <p className="font-comic text-lg sm:text-xl md:text-2xl">
              <FaRocket className="inline text-comic-red mr-2" />
              Every superhero has an origin story. Here&apos;s how <strong>PRECAST</strong> was born
              from the frustration of repetitive development setup and the dream of
              <span className="text-comic-red font-bold"> LIGHTNING-FAST PROJECT CREATION!</span>
            </p>
          </div>
        </motion.div>

        {/* Comic Separator */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <div className="relative">
            <div className="h-2 bg-comic-black rounded-full"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
              <div className="action-text text-2xl text-comic-red bg-comic-black px-4 py-1 rounded-full border-4 border-comic-red">
                KAPOW!
              </div>
            </div>
          </div>
        </div>

        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center order-2 md:order-1">
              <motion.div
                animate={{ rotate: [0, -2, 2, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="relative"
              >
                {/* Comic Book Panel Frame */}
                <div
                  className="relative border-4 sm:border-6 border-comic-black rounded-2xl p-4 sm:p-6 bg-comic-white transform rotate-3 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]"
                  style={{
                    backgroundColor: "var(--comic-white)",
                    borderColor: "var(--comic-black)",
                    boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0, 0, 0, 0.3)",
                    background: `
                      var(--comic-white) 
                      repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(0,0,0,0.03) 10px,
                        rgba(0,0,0,0.03) 20px
                      )
                    `,
                  }}
                >
                  {/* Comic panel border effect */}
                  <div className="absolute inset-2 border-2 border-comic-black rounded-xl opacity-30"></div>

                  {/* The actual comic art */}
                  <img
                    src="/art/1.png"
                    alt="Comic book hero character"
                    className="w-full h-full object-cover rounded-xl border-2 border-comic-black"
                    style={{
                      filter: "contrast(1.2) saturate(1.3)",
                      imageRendering: "crisp-edges",
                    }}
                  />

                  {/* Comic book effect overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-comic-black opacity-20"
                      style={{ backgroundColor: "var(--comic-white)" }}
                    ></div>
                    <div
                      className="absolute bottom-2 left-2 w-6 h-6 rounded-full border-2 border-comic-black opacity-15"
                      style={{ backgroundColor: "var(--comic-white)" }}
                    ></div>
                  </div>

                  {/* Action text bubble */}
                  <div className="absolute -top-4 -right-4 z-10">
                    <div
                      className="action-text text-lg px-3 py-1 rounded-full border-3 border-comic-black transform rotate-12"
                      style={{
                        backgroundColor: "var(--comic-red)",
                        color: "var(--comic-white)",
                        borderColor: "var(--comic-black)",
                        boxShadow: "3px 3px 0 var(--comic-black)",
                      }}
                    >
                      ARGH!
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="action-text text-4xl md:text-6xl text-comic-red mb-8">THE PROBLEM</h2>

              <div className="relative">
                <div
                  className="relative border-6 border-comic-black rounded-2xl p-6 bg-comic-red text-comic-white overflow-hidden"
                  style={{
                    backgroundColor: "var(--comic-red)",
                    borderColor: "var(--comic-black)",
                    boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0, 0, 0, 0.3)",
                    background: `
                    var(--comic-red) 
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 15px,
                      rgba(255,255,255,0.1) 15px,
                      rgba(255,255,255,0.1) 30px
                    )
                  `,
                  }}
                >
                  {/* Comic panel border effect */}
                  <div className="absolute inset-3 border-2 border-comic-white rounded-xl opacity-20"></div>

                  {/* Header section */}
                  <div className="text-center mb-8">
                    <FaClock className="text-5xl sm:text-6xl md:text-7xl mb-4 mx-auto" />
                    <h3 className="font-display text-3xl md:text-4xl mb-4 text-comic-white">
                      TIME WASTED
                    </h3>
                    <div
                      className="mx-auto w-24 h-1 rounded-full mb-6"
                      style={{ backgroundColor: "var(--comic-yellow)" }}
                    ></div>
                  </div>

                  {/* Description */}
                  <div className="text-center mb-8">
                    <p className="font-comic text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                      Developers spend{" "}
                      <span className="text-comic-yellow font-bold text-2xl">HOURS</span> setting up
                      the same configurations over and over. Time that could be spent building
                      amazing features!
                    </p>
                  </div>

                  {/* Problems list with better styling */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {problems.map((problem, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <FaTimesCircle className="text-comic-yellow text-xl mt-1 flex-shrink-0" />
                        <span className="font-comic text-sm md:text-base leading-relaxed">
                          {problem}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action text bubble - positioned outside */}
                <div className="absolute -top-4 -right-4 z-30">
                  <div
                    className="action-text text-2xl px-4 py-2 rounded-full border-4 border-comic-black transform rotate-12"
                    style={{
                      backgroundColor: "var(--comic-yellow)",
                      color: "var(--comic-red)",
                      borderColor: "var(--comic-black)",
                      boxShadow: "4px 4px 0 var(--comic-black)",
                    }}
                  >
                    UGH!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Eureka Moment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="relative">
            <div
              className="relative border-6 border-comic-black rounded-2xl p-12 bg-comic-yellow overflow-hidden"
              style={{
                backgroundColor: "var(--comic-yellow)",
                borderColor: "var(--comic-black)",
                boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0, 0, 0, 0.3)",
                background: `
                  var(--comic-yellow) 
                  repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 20px,
                    rgba(0,0,0,0.05) 20px,
                    rgba(0,0,0,0.05) 40px
                  )
                `,
              }}
            >
              {/* Comic panel border effect */}
              <div className="absolute inset-3 border-2 border-comic-black rounded-xl opacity-15"></div>

              {/* Header section */}
              <div className="mb-8">
                <FaLightbulb className="text-6xl sm:text-8xl md:text-9xl text-comic-red mx-auto mb-6 animate-pulse" />
                <h2 className="action-text text-3xl sm:text-4xl md:text-6xl text-comic-black mb-4">
                  THE LIGHTBULB MOMENT
                </h2>
                <div
                  className="mx-auto w-32 h-1 rounded-full mb-6"
                  style={{ backgroundColor: "var(--comic-red)" }}
                ></div>
              </div>

              {/* Description with better formatting */}
              <div className="max-w-4xl mx-auto">
                <p className="font-comic text-lg sm:text-xl md:text-2xl text-comic-black leading-relaxed mb-6">
                  What if we could create a{" "}
                  <span className="text-comic-red font-bold text-xl sm:text-2xl md:text-3xl">
                    SUPERHERO CLI
                  </span>{" "}
                  that handles all the boring setup stuff, follows best practices, and gets
                  developers straight to the fun part...
                </p>
                <div
                  className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-full border-2 sm:border-4 border-comic-black transform -rotate-2"
                  style={{
                    backgroundColor: "var(--comic-red)",
                    color: "var(--comic-white)",
                    borderColor: "var(--comic-black)",
                    boxShadow: "4px 4px 0 var(--comic-black)",
                  }}
                >
                  <span className="action-text text-lg sm:text-2xl">BUILDING AWESOME STUFF!</span>
                </div>
              </div>
            </div>

            {/* Action text bubble - positioned outside */}
            <div className="absolute -top-4 sm:-top-6 right-0 sm:-right-6 z-30">
              <div
                className="action-text text-xl sm:text-3xl px-3 sm:px-5 py-2 sm:py-3 rounded-full border-3 sm:border-4 border-comic-black transform rotate-12"
                style={{
                  backgroundColor: "var(--comic-red)",
                  color: "var(--comic-white)",
                  borderColor: "var(--comic-black)",
                  boxShadow: "4px 4px 0 var(--comic-black)",
                }}
              >
                EUREKA!
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center order-2 md:order-1">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                {/* Comic Book Panel Frame - Success Version */}
                <div
                  className="relative border-4 sm:border-6 border-comic-black rounded-2xl p-4 sm:p-6 bg-comic-white transform -rotate-2 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]"
                  style={{
                    backgroundColor: "var(--comic-white)",
                    borderColor: "var(--comic-black)",
                    boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0, 0, 0, 0.3)",
                    background: `
                      var(--comic-white) 
                      repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 10px,
                        rgba(0,128,0,0.05) 10px,
                        rgba(0,128,0,0.05) 20px
                      )
                    `,
                  }}
                >
                  {/* Comic panel border effect */}
                  <div className="absolute inset-2 border-2 border-comic-black rounded-xl opacity-30"></div>

                  {/* The actual comic art - success version */}
                  <img
                    src="/art/2.png"
                    alt="Comic book hero character - victorious"
                    className="w-full h-full object-cover rounded-xl border-2 border-comic-black"
                    style={{
                      filter: "contrast(1.3) saturate(1.4)",
                      imageRendering: "crisp-edges",
                    }}
                  />

                  {/* Success effect overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-comic-black opacity-25"
                      style={{ backgroundColor: "var(--comic-green)" }}
                    ></div>
                    <div
                      className="absolute bottom-3 left-3 w-4 h-4 rounded-full border-2 border-comic-black opacity-20"
                      style={{ backgroundColor: "var(--comic-green)" }}
                    ></div>
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full opacity-10"
                      style={{ backgroundColor: "var(--comic-green)" }}
                    ></div>
                  </div>

                  {/* Success action text bubble */}
                  <div className="absolute -top-4 -left-4 z-10">
                    <div
                      className="action-text text-lg px-3 py-1 rounded-full border-3 border-comic-black transform -rotate-12"
                      style={{
                        backgroundColor: "var(--comic-green)",
                        color: "var(--comic-white)",
                        borderColor: "var(--comic-black)",
                        boxShadow: "3px 3px 0 var(--comic-black)",
                      }}
                    >
                      YEAH!
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="action-text text-4xl md:text-6xl text-comic-green mb-8">
                THE SOLUTION
              </h2>

              <div className="relative">
                <div
                  className="relative border-6 border-comic-black rounded-2xl p-8 bg-comic-white text-comic-black overflow-hidden"
                  style={{
                    backgroundColor: "var(--comic-white)",
                    borderColor: "var(--comic-black)",
                    boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0, 0, 0, 0.3)",
                    background: `
                      var(--comic-white) 
                      repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 15px,
                        rgba(0,128,0,0.1) 15px,
                        rgba(0,128,0,0.1) 30px
                      )
                    `,
                  }}
                >
                  {/* Comic panel border effect */}
                  <div className="absolute inset-3 border-2 border-comic-black rounded-xl opacity-15"></div>

                  {/* Header section */}
                  <div className="text-center mb-8">
                    <FaBolt className="text-5xl sm:text-6xl md:text-7xl mb-4 mx-auto text-comic-green" />
                    <h3 className="font-display text-3xl md:text-4xl mb-4 text-comic-black">
                      PRECAST POWER
                    </h3>
                    <div
                      className="mx-auto w-24 h-1 rounded-full mb-6"
                      style={{ backgroundColor: "var(--comic-green)" }}
                    ></div>
                  </div>

                  {/* Description */}
                  <div className="text-center mb-8">
                    <p className="font-comic text-lg md:text-xl leading-relaxed max-w-2xl mx-auto text-comic-black">
                      A CLI that automates the boring stuff and delivers
                      <span className="text-comic-green font-bold text-2xl">
                        {" "}
                        PRODUCTION-READY PROJECTS
                      </span>{" "}
                      in minutes, not hours!
                    </p>
                  </div>

                  {/* Solutions list with better styling */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {solutions.map((solution, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg"
                        style={{
                          backgroundColor: "rgba(0, 128, 0, 0.1)",
                          border: "2px solid rgba(0, 128, 0, 0.2)",
                        }}
                      >
                        <FaCheckCircle className="text-comic-green text-xl mt-1 flex-shrink-0" />
                        <span className="font-comic text-sm md:text-base leading-relaxed text-comic-black">
                          {solution}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action text bubble - positioned outside */}
                <div className="absolute -top-4 -left-4 z-30">
                  <div
                    className="action-text text-2xl px-4 py-2 rounded-full border-4 border-comic-black transform -rotate-12"
                    style={{
                      backgroundColor: "var(--comic-green)",
                      color: "var(--comic-white)",
                      borderColor: "var(--comic-black)",
                      boxShadow: "4px 4px 0 var(--comic-black)",
                    }}
                  >
                    YES!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Mission */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative">
            <div
              className="relative border-6 border-comic-black rounded-2xl p-12 bg-comic-yellow text-comic-black overflow-hidden"
              style={{
                backgroundColor: "var(--comic-yellow)",
                borderColor: "var(--comic-black)",
                boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0, 0, 0, 0.3)",
                background: `
                  var(--comic-yellow) 
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 20px,
                    rgba(0,0,0,0.05) 20px,
                    rgba(0,0,0,0.05) 40px
                  )
                `,
              }}
            >
              {/* Comic panel border effect */}
              <div className="absolute inset-3 border-2 border-comic-black rounded-xl opacity-15"></div>

              {/* Header section */}
              <div className="mb-10">
                <FaUsers className="text-6xl sm:text-8xl md:text-9xl mx-auto mb-6 text-comic-red" />
                <h2 className="action-text text-4xl md:text-6xl mb-4 text-comic-black">
                  OUR MISSION
                </h2>
                <div
                  className="mx-auto w-32 h-1 rounded-full mb-8"
                  style={{ backgroundColor: "var(--comic-red)" }}
                ></div>
              </div>

              {/* Mission statement with better formatting */}
              <div className="max-w-5xl mx-auto mb-10">
                <p className="font-comic text-xl md:text-2xl leading-relaxed mb-6 text-comic-black">
                  To empower developers everywhere with{" "}
                  <span className="text-comic-red font-bold text-3xl">SUPERHERO PRODUCTIVITY</span>{" "}
                  by eliminating setup friction and promoting best practices.
                </p>
                <div
                  className="inline-block px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-full border-2 sm:border-4 border-comic-black transform rotate-1 mb-8"
                  style={{
                    backgroundColor: "var(--comic-red)",
                    color: "var(--comic-white)",
                    borderColor: "var(--comic-black)",
                    boxShadow: "4px 4px 0 var(--comic-black)",
                  }}
                >
                  <span className="action-text text-lg sm:text-2xl">
                    CREATING, NOT CONFIGURING!
                  </span>
                </div>
              </div>
            </div>

            {/* Action text bubble - positioned outside */}
            <div className="absolute -top-4 sm:-top-6 left-0 sm:-left-6 z-30">
              <div
                className="action-text text-xl sm:text-3xl px-3 sm:px-5 py-2 sm:py-3 rounded-full border-3 sm:border-4 border-comic-black transform -rotate-12"
                style={{
                  backgroundColor: "var(--comic-red)",
                  color: "var(--comic-white)",
                  borderColor: "var(--comic-black)",
                  boxShadow: "4px 4px 0 var(--comic-black)",
                }}
              >
                MISSION!
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to action button - moved outside Mission container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            onClick={() => {
              navigate("/builder");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 sm:gap-4 px-6 sm:px-12 py-3 sm:py-6 rounded-lg sm:rounded-full border-2 sm:border-4 border-comic-black font-comic font-bold text-lg sm:text-2xl transition-all"
            style={{
              backgroundColor: "var(--comic-red)",
              borderColor: "var(--comic-black)",
              color: "var(--comic-white)",
              boxShadow: "6px 6px 0 var(--comic-black)",
            }}
          >
            <FaRocket className="text-xl sm:text-3xl" />
            <span>JOIN THE MISSION!</span>
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
