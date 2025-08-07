import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaStar, FaGithub, FaBolt } from "react-icons/fa";

interface Sponsor {
  login: string;
  name: string;
  avatarUrl: string;
  url: string;
  monthlyAmount: number;
  totalAmount: number;
  tier: string;
  joinedDate: string;
  isOrganization: boolean;
}

/**
 * Sponsors section component displaying GitHub sponsors.
 * Shows sponsor avatars, tiers, and contribution amounts.
 */
export function SponsorsSection() {
  const [sponsors, setSponsors] = useState<{
    list: Sponsor[];
    loading: boolean;
    count: number;
  }>({
    list: [],
    loading: true,
    count: 0,
  });

  const fetchGitHubSponsors = async () => {
    try {
      // Mock sponsors for demonstration with different tiers
      const mockSponsors: Sponsor[] = [
        {
          login: "alex-dev",
          name: "Alex Rodriguez",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/alex-dev",
          monthlyAmount: 100,
          totalAmount: 1200,
          tier: "gold",
          joinedDate: "2024-01-15",
          isOrganization: false,
        },
        {
          login: "tech-corp",
          name: "TechCorp Inc",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/tech-corp",
          monthlyAmount: 500,
          totalAmount: 6000,
          tier: "platinum",
          joinedDate: "2023-11-20",
          isOrganization: true,
        },
        {
          login: "jane-coder",
          name: "Jane Smith",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/jane-coder",
          monthlyAmount: 25,
          totalAmount: 300,
          tier: "silver",
          joinedDate: "2024-03-10",
          isOrganization: false,
        },
        {
          login: "startup-hub",
          name: "StartupHub",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/startup-hub",
          monthlyAmount: 250,
          totalAmount: 3000,
          tier: "gold",
          joinedDate: "2023-12-05",
          isOrganization: true,
        },
        {
          login: "dev-mike",
          name: "Mike Johnson",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/dev-mike",
          monthlyAmount: 10,
          totalAmount: 120,
          tier: "bronze",
          joinedDate: "2024-04-20",
          isOrganization: false,
        },
        {
          login: "enterprise-solutions",
          name: "Enterprise Solutions Ltd",
          avatarUrl: "https://github.com/github.png",
          url: "https://github.com/enterprise-solutions",
          monthlyAmount: 1000,
          totalAmount: 12000,
          tier: "diamond",
          joinedDate: "2023-08-01",
          isOrganization: true,
        },
      ];

      setSponsors({
        list: mockSponsors,
        count: mockSponsors.length,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching GitHub sponsors:", error);
      setSponsors((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchGitHubSponsors();
  }, []);

  const getTierStyle = (tier: string) => {
    switch (tier) {
      case "diamond":
        return "bg-comic-black text-comic-white";
      case "platinum":
        return "bg-comic-purple text-comic-white";
      case "gold":
        return "bg-comic-yellow text-comic-black";
      case "silver":
        return "bg-comic-blue text-comic-white";
      default:
        return "bg-comic-gray text-comic-black";
    }
  };

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "var(--comic-gray)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="action-text text-5xl md:text-7xl text-comic-black mb-4">
            GITHUB SPONSORS
          </h2>
          <p className="font-comic text-lg text-comic-black">Supporting open source development</p>
        </motion.div>

        {sponsors.loading ? (
          <div className="text-center">
            <FaBolt className="animate-spin text-6xl mb-4 text-comic-black mx-auto" />
            <p className="font-comic text-xl text-comic-black">Loading sponsors...</p>
          </div>
        ) : sponsors.count > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {sponsors.list.map((sponsor, index) => (
              <motion.a
                key={sponsor.login}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="block"
              >
                <div className="comic-panel bg-comic-white p-6 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                  <img
                    src={sponsor.avatarUrl}
                    alt={sponsor.name || sponsor.login}
                    className="w-20 h-20 rounded-full mb-3 border-3 border-comic-black"
                  />

                  <h3 className="font-comic font-bold text-sm mb-2">
                    {sponsor.name || sponsor.login}
                  </h3>

                  <div className="action-text text-lg text-comic-red mb-1">
                    ${sponsor.monthlyAmount}
                  </div>
                  <div className="font-comic text-xs text-comic-gray">per month</div>

                  <div className="mt-auto pt-3">
                    <span className={`badge-comic text-xs ${getTierStyle(sponsor.tier)}`}>
                      {sponsor.tier.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="comic-panel p-12 bg-comic-white max-w-2xl mx-auto"
            >
              <FaStar className="text-6xl text-comic-gray mx-auto mb-4" />
              <h3 className="action-text text-3xl text-comic-black mb-4">BE OUR FIRST HERO!</h3>
              <p className="font-comic text-lg text-comic-black mb-6">
                Ready to join the league of heroes supporting open source? Your sponsorship helps us
                keep building amazing tools!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://github.com/sponsors/BuunGroupCore"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-comic bg-comic-red text-comic-white hover:bg-comic-darkRed px-6 py-3 text-lg"
                >
                  <FaGithub className="inline mr-2" />
                  SPONSOR ON GITHUB
                </motion.a>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
