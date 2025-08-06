import { motion } from "framer-motion";
import {
  FaHeart,
  FaGithub,
  FaStar,
  FaShare,
  FaCode,
  FaBug,
  FaLightbulb,
  FaCoffee,
  FaRocket,
  FaCog,
  FaUsers,
} from "react-icons/fa";

export function SupportPage() {
  const freeSupport = [
    {
      icon: FaStar,
      title: "STAR THE REPO",
      description:
        "Give us a star on GitHub to show your support and help others discover Precast!",
      action: "Star on GitHub",
      url: "https://github.com/BuunGroupCore/precast-app",
      color: "var(--comic-yellow)",
      effect: "STAR!",
    },
    {
      icon: FaShare,
      title: "SHARE THE POWER",
      description: "Tell other developers about Precast on social media, blogs, or at meetups!",
      action: "Share Precast",
      url: "https://twitter.com/intent/tweet?text=Check%20out%20Precast%20CLI%20-%20the%20superhero%20tool%20for%20fast%20project%20setup!&url=https://precast.dev",
      color: "var(--comic-blue)",
      effect: "SHARE!",
    },
    {
      icon: FaCode,
      title: "CONTRIBUTE CODE",
      description:
        "Help make Precast even better by contributing features, fixes, or documentation!",
      action: "View Contributing Guide",
      url: "https://github.com/BuunGroupCore/precast-app/blob/main/CONTRIBUTING.md",
      color: "var(--comic-green)",
      effect: "CODE!",
    },
    {
      icon: FaBug,
      title: "REPORT BUGS",
      description: "Found a bug or have a feature idea? Let us know by creating an issue!",
      action: "Report Issue",
      url: "https://github.com/BuunGroupCore/precast-app/issues/new",
      color: "var(--comic-red)",
      effect: "HELP!",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="action-text text-6xl md:text-8xl text-comic-red mb-16">
            SUPPORT THE MISSION
          </h1>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Comic Art */}
            <div className="flex justify-center order-2 md:order-1">
              <motion.div
                animate={{ rotate: [0, -2, 2, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="relative"
              >
                <div
                  className="relative border-6 border-comic-black rounded-2xl p-6 bg-comic-white transform rotate-3"
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
                    width: "400px",
                    height: "400px",
                  }}
                >
                  <div className="absolute inset-2 border-2 border-comic-black rounded-xl opacity-30"></div>

                  <img
                    src="/art/3.png"
                    alt="Comic book hero supporting the mission"
                    className="w-full h-full object-cover rounded-xl border-2 border-comic-black"
                    style={{
                      filter: "contrast(1.2) saturate(1.3)",
                      imageRendering: "crisp-edges",
                      maxWidth: "360px",
                      maxHeight: "360px",
                    }}
                  />

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
                      HELP!
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Speech Bubble */}
            <div className="order-1 md:order-2">
              <div className="speech-bubble max-w-2xl mx-auto">
                <p className="font-comic text-xl md:text-2xl">
                  <FaHeart className="inline text-comic-red mr-2" />
                  Help us keep Precast <strong>FREE and AWESOME</strong> for all developers! Your
                  support helps us maintain the project, add new features, and
                  <span className="text-comic-red font-bold"> SAVE EVEN MORE DEVELOPER TIME!</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Comic Separator */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className="action-text text-2xl text-comic-yellow bg-comic-black px-4 py-1 rounded-full border-4 border-comic-yellow">
              BOOM!
            </div>
          </div>
        </div>
      </div>

      {/* Free Ways to Support */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="action-text text-4xl md:text-6xl text-comic-green text-center mb-12">
            FREE WAYS TO HELP
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {freeSupport.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                className="relative group h-full"
              >
                <div className="absolute -top-2 -right-2 action-text text-xl text-comic-yellow z-10">
                  {item.effect}
                </div>

                <div
                  className="comic-panel p-6 text-center relative overflow-hidden h-full flex flex-col"
                  style={{ backgroundColor: item.color, color: "var(--comic-white)" }}
                >
                  <item.icon className="text-6xl mx-auto mb-4" />
                  <h3 className="font-display text-xl mb-3">{item.title}</h3>
                  <p className="font-comic text-sm mb-4 leading-relaxed flex-grow">
                    {item.description}
                  </p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow inline-flex items-center gap-2 text-sm px-4 py-2 justify-center"
                  >
                    {item.action}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Comic Separator */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className="action-text text-2xl text-comic-purple bg-comic-black px-4 py-1 rounded-full border-4 border-comic-purple">
              ZAP!
            </div>
          </div>
        </div>
      </div>

      {/* Support the Project */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="action-text text-4xl md:text-6xl text-comic-purple text-center mb-12">
            SUPPORT THE PROJECT
          </h2>

          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -top-4 -right-4 action-text text-3xl text-comic-yellow z-10">
              DONATE!
            </div>

            <div
              className="relative border-6 border-comic-black rounded-2xl p-8 md:p-12 text-center overflow-hidden"
              style={{
                backgroundColor: "var(--comic-purple)",
                color: "var(--comic-white)",
                borderColor: "var(--comic-black)",
                boxShadow: "8px 8px 0 var(--comic-black), 16px 16px 0 rgba(0,0,0,0.3)",
                background: `
                  var(--comic-purple) 
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 20px,
                    rgba(255,255,255,0.1) 20px,
                    rgba(255,255,255,0.1) 40px
                  )
                `,
              }}
            >
              {/* Comic panel border effect */}
              <div className="absolute inset-3 border-2 border-white rounded-xl opacity-20"></div>

              {/* Icon */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <FaHeart className="text-8xl mx-auto" />
              </motion.div>

              {/* Content */}
              <h3 className="font-display text-3xl md:text-4xl mb-6">EVERY CONTRIBUTION HELPS!</h3>

              <p className="font-comic text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Your donation helps us maintain Precast, add new features, and keep it
                <span className="text-comic-yellow font-bold"> FREE AND OPEN SOURCE</span> for
                everyone! Whether it&apos;s $1 or $100, every contribution makes a difference.
              </p>

              <p className="font-comic text-base md:text-lg mb-8 opacity-90">
                Donate any amount you want to support the development of Precast.
              </p>

              {/* Donation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://github.com/sponsors/BuunGroupCore"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-white text-xl px-8 py-4 inline-flex items-center gap-3 justify-center"
                >
                  <FaGithub className="text-2xl" />
                  GITHUB SPONSORS
                </motion.a>

                <motion.a
                  href="https://www.buymeacoffee.com/buungroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow text-xl px-8 py-4 inline-flex items-center gap-3 justify-center"
                >
                  <FaCoffee className="text-2xl" />
                  BUY ME A COFFEE
                </motion.a>
              </div>

              {/* Background Icon */}
              <div className="absolute bottom-6 right-6 text-6xl opacity-10">
                <FaHeart />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Comic Separator */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className="action-text text-2xl text-comic-red bg-comic-black px-4 py-1 rounded-full border-4 border-comic-red">
              POW!
            </div>
          </div>
        </div>
      </div>

      {/* Why Support Section */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="comic-panel p-12 bg-comic-black text-comic-white relative">
            <div className="absolute -top-4 -left-4 action-text text-3xl text-comic-yellow z-10">
              WHY?
            </div>

            <FaLightbulb className="text-8xl mx-auto mb-6 text-comic-yellow" />
            <h2 className="action-text text-4xl md:text-6xl mb-8">YOUR IMPACT</h2>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FaRocket className="text-2xl text-comic-red" />
                  <h3 className="font-display text-2xl text-comic-red">Faster Development</h3>
                </div>
                <p className="font-comic">
                  Your support helps us maintain and improve the CLI, making project setup even
                  faster for thousands of developers.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FaCog className="text-2xl text-comic-blue" />
                  <h3 className="font-display text-2xl text-comic-blue">New Features</h3>
                </div>
                <p className="font-comic">
                  Sponsorship allows us to dedicate time to adding new frameworks, tools, and
                  integrations that developers need.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FaUsers className="text-2xl text-comic-green" />
                  <h3 className="font-display text-2xl text-comic-green">Community Growth</h3>
                </div>
                <p className="font-comic">
                  With your help, we can create better documentation, tutorials, and support to grow
                  the Precast community.
                </p>
              </div>
            </div>

            <p className="font-comic text-xl mt-8 text-comic-yellow">
              <strong>Together, we can save millions of developer hours worldwide!</strong>
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
