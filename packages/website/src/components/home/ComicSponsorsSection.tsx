import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaStar,
  FaGithub,
  FaBolt,
  FaTrophy,
  FaHeart,
  FaCrown,
  FaMedal,
  FaGem,
  FaFire,
  FaRocket,
} from "react-icons/fa";

type TabType = "heroes" | "sidekicks" | "legends" | "all";

interface GitHubSponsor {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  url: string;
  bio?: string;
  company?: string;
  location?: string;
  twitterUsername?: string;
  websiteUrl?: string;
  monthlyAmount: number;
  totalAmount: number;
  tier: "diamond" | "platinum" | "gold" | "silver" | "bronze";
  isActive: boolean;
  isFeatured: boolean;
  sponsorshipDate: string;
  endDate?: string;
  isOrganization: boolean;
}

interface SponsorsData {
  current: GitHubSponsor[];
  past: GitHubSponsor[];
  featured: GitHubSponsor[];
  totalSponsors: number;
  totalMonthlyAmount: number;
  totalLifetimeAmount: number;
}

/**
 * Displays GitHub sponsors in a comic book style with tabs and pagination.
 * Fetches sponsor data from /sponsors.json and falls back to empty state if no sponsors exist.
 * The component features animated sponsor cards, comic-themed styling, and interactive elements.
 * @returns Comic book themed sponsors section component
 */
export function ComicSponsorsSection() {
  const [sponsors, setSponsors] = useState<SponsorsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("heroes");
  const [hoveredSponsor, setHoveredSponsor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadSponsors = async () => {
      try {
        const response = await fetch("/sponsors.json");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            const sponsorsData = processSponsorsArray(data);
            setSponsors(sponsorsData);
          } else {
            setSponsors(data);
          }
        } else {
          setSponsors(getMockSponsorsData());
        }
      } catch (error) {
        console.error("Error loading sponsors:", error);
        setSponsors(getMockSponsorsData());
      } finally {
        setLoading(false);
      }
    };

    loadSponsors();
  }, []);

  /**
   * Converts an array of sponsors into categorized SponsorsData format
   */
  const processSponsorsArray = (sponsorsArray: GitHubSponsor[]): SponsorsData => {
    const featured = sponsorsArray.filter((s) => s.isFeatured && s.isActive);
    const current = sponsorsArray.filter((s) => s.isActive && !s.isFeatured);
    const past = sponsorsArray.filter((s) => !s.isActive);

    const totalSponsors = sponsorsArray.filter((s) => s.isActive).length;
    const totalMonthlyAmount = sponsorsArray
      .filter((s) => s.isActive)
      .reduce((sum, s) => sum + s.monthlyAmount, 0);
    const totalLifetimeAmount = sponsorsArray.reduce((sum, s) => sum + s.totalAmount, 0);

    return {
      featured,
      current,
      past,
      totalSponsors,
      totalMonthlyAmount,
      totalLifetimeAmount,
    };
  };

  /**
   * Returns empty sponsors data structure for fallback
   */
  const getMockSponsorsData = (): SponsorsData => {
    return {
      featured: [],
      current: [],
      past: [],
      totalSponsors: 0,
      totalMonthlyAmount: 0,
      totalLifetimeAmount: 0,
    };
  };

  /**
   * Formats monetary amounts with k suffix for thousands
   */
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount}`;
  };

  /**
   * Returns appropriate icon component for sponsor tier
   */
  const getTierIcon = (tier: GitHubSponsor["tier"]) => {
    switch (tier) {
      case "diamond":
        return <FaGem className="text-4xl" style={{ color: "var(--comic-blue)" }} />;
      case "platinum":
        return <FaCrown className="text-3xl" style={{ color: "var(--comic-purple)" }} />;
      case "gold":
        return <FaTrophy className="text-3xl" style={{ color: "var(--comic-yellow)" }} />;
      case "silver":
        return <FaMedal className="text-2xl" style={{ color: "var(--comic-gray)" }} />;
      default:
        return <FaStar className="text-2xl" style={{ color: "var(--comic-orange)" }} />;
    }
  };

  /**
   * Returns CSS classes for tier badge styling
   */
  const getTierStyle = (tier: GitHubSponsor["tier"]) => {
    switch (tier) {
      case "diamond":
        return "bg-comic-blue text-comic-white";
      case "platinum":
        return "bg-comic-purple text-comic-white";
      case "gold":
        return "bg-comic-yellow text-comic-black";
      case "silver":
        return "bg-comic-gray text-comic-black";
      default:
        return "bg-comic-orange text-comic-white";
    }
  };

  /**
   * Returns action text for featured sponsor badges
   */
  const getTierActionText = (tier: GitHubSponsor["tier"]) => {
    switch (tier) {
      case "diamond":
        return "LEGENDARY!";
      case "platinum":
        return "HEROIC!";
      case "gold":
        return "SUPER!";
      case "silver":
        return "MIGHTY!";
      default:
        return "AWESOME!";
    }
  };

  /**
   * Filters sponsors based on active tab selection
   */
  const getSponsorsByTab = (): GitHubSponsor[] => {
    if (!sponsors) return [];
    switch (activeTab) {
      case "heroes":
        return sponsors.featured;
      case "sidekicks":
        return sponsors.current;
      case "legends":
        return sponsors.past;
      case "all":
        return [...sponsors.featured, ...sponsors.current, ...sponsors.past];
      default:
        return [];
    }
  };

  /**
   * Returns paginated subset of sponsors for current page
   */
  const getPaginatedSponsors = (): GitHubSponsor[] => {
    const allSponsors = getSponsorsByTab();
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return allSponsors.slice(start, end);
  };

  /**
   * Calculates total number of pages based on sponsors count
   */
  const getTotalPages = (): number => {
    const allSponsors = getSponsorsByTab();
    return Math.ceil(allSponsors.length / itemsPerPage);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab]);

  /**
   * Renders individual sponsor card with comic book styling
   */
  const renderSponsorCard = (sponsor: GitHubSponsor, index: number) => (
    <motion.div
      key={sponsor.id}
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      onMouseEnter={() => setHoveredSponsor(sponsor.id)}
      onMouseLeave={() => setHoveredSponsor(null)}
      className="relative h-full"
    >
      <motion.a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
        whileHover={{ y: -10, rotate: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className={`
          comic-panel p-6 h-full flex flex-col
          ${sponsor.isFeatured ? "border-6" : "border-4"}
          ${hoveredSponsor === sponsor.id ? "shadow-2xl" : ""}
        `}
          style={{ minHeight: "280px" }}
        >
          <div className="absolute top-4 left-4 z-10">{getTierIcon(sponsor.tier)}</div>
          {sponsor.isFeatured && (
            <div className="absolute -top-3 -right-3 z-20">
              <div className="action-burst" style={{ backgroundColor: "var(--comic-red)" }}>
                <span className="action-text text-comic-white text-xs">
                  {getTierActionText(sponsor.tier)}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center text-center flex-1 justify-center">
            <div className="relative mb-4 mt-8">
              <div className="comic-avatar-wrapper">
                <img
                  src={sponsor.avatarUrl}
                  alt={sponsor.name || sponsor.login}
                  className="w-20 h-20 rounded-full border-4 border-comic-black"
                  style={{
                    boxShadow: "3px 3px 0 var(--comic-black)",
                  }}
                />
                {sponsor.isActive && (
                  <motion.div
                    className="absolute -bottom-2 -right-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <FaHeart className="text-comic-red text-xl" />
                  </motion.div>
                )}
              </div>
            </div>

            <h3 className="font-comic font-bold text-lg mb-2 text-comic-black">
              {sponsor.name || sponsor.login}
            </h3>

            {sponsor.company && (
              <p className="font-comic text-xs text-comic-gray mb-3">{sponsor.company}</p>
            )}

            <div className="mt-auto mb-3">
              <span className="action-text text-2xl" style={{ color: "var(--comic-red)" }}>
                {formatAmount(sponsor.monthlyAmount)}
              </span>
              <span className="font-comic text-xs text-comic-black ml-1">
                {sponsor.isActive ? "/MONTH" : "TOTAL"}
              </span>
            </div>

            <div className="mb-3">
              <span className={`badge-comic ${getTierStyle(sponsor.tier)}`}>
                {sponsor.tier.toUpperCase()}
              </span>
            </div>
            {!sponsor.isActive && (
              <div className="mt-auto pt-3 border-t-2 border-dashed border-comic-black">
                <span className="font-comic text-xs text-comic-gray">
                  HERO FROM {sponsor.sponsorshipDate} TO {sponsor.endDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.a>

      {hoveredSponsor === sponsor.id && sponsor.isFeatured && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-2 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 4px,
              var(--comic-yellow) 4px,
              var(--comic-yellow) 8px
            )`,
            opacity: 0.3,
            animation: "speedLinesMove 0.5s linear infinite",
          }}
        />
      )}
    </motion.div>
  );

  return (
    <section className="py-20 px-4" style={{ backgroundColor: "var(--comic-gray)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block relative">
            <h2 className="action-text text-6xl md:text-8xl text-comic-black mb-6">
              SPONSOR HEROES!
            </h2>
            <motion.div
              className="absolute -top-8 -right-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <FaHeart className="text-5xl text-comic-red" />
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-8"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
            >
              <FaStar className="text-5xl text-comic-yellow" />
            </motion.div>
          </div>

          <p className="font-comic text-xl text-comic-black mb-8">
            The legendary heroes supporting our open source adventure!
          </p>

          {sponsors && sponsors.totalSponsors > 0 && (
            <div className="flex justify-center gap-4 mt-8">
              <motion.div className="comic-panel p-4" whileHover={{ rotate: -2 }}>
                <div className="action-text text-3xl text-comic-red">{sponsors.totalSponsors}</div>
                <div className="font-comic text-sm">HEROES</div>
              </motion.div>
              <motion.div className="comic-panel p-4" whileHover={{ rotate: 2 }}>
                <div className="action-text text-3xl text-comic-green">
                  {formatAmount(sponsors.totalMonthlyAmount)}
                </div>
                <div className="font-comic text-sm">MONTHLY POWER</div>
              </motion.div>
              <motion.div className="comic-panel p-4" whileHover={{ rotate: -2 }}>
                <div className="action-text text-3xl text-comic-blue">
                  {formatAmount(sponsors.totalLifetimeAmount)}
                </div>
                <div className="font-comic text-sm">TOTAL IMPACT</div>
              </motion.div>
            </div>
          )}
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="comic-panel p-2 inline-flex gap-2">
            {(
              [
                { key: "heroes", label: "HEROES", icon: <FaCrown /> },
                { key: "sidekicks", label: "SIDEKICKS", icon: <FaRocket /> },
                { key: "legends", label: "LEGENDS", icon: <FaStar /> },
                { key: "all", label: "ALL", icon: <FaFire /> },
              ] as const
            ).map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 font-comic font-bold text-sm transition-all
                  flex items-center gap-2
                  ${
                    activeTab === tab.key
                      ? "bg-comic-red text-comic-white shadow-lg"
                      : "bg-comic-white text-comic-black hover:bg-comic-yellow"
                  }
                  border-2 border-comic-black
                `}
                style={{
                  boxShadow: activeTab === tab.key ? "2px 2px 0 var(--comic-black)" : "none",
                }}
              >
                {tab.icon}
                {tab.label}
                {sponsors && (
                  <span className="badge-comic bg-comic-black text-comic-white text-xs ml-2">
                    {tab.key === "heroes"
                      ? sponsors.featured.length
                      : tab.key === "sidekicks"
                        ? sponsors.current.length
                        : tab.key === "legends"
                          ? sponsors.past.length
                          : sponsors.featured.length +
                            sponsors.current.length +
                            sponsors.past.length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <FaBolt className="text-6xl text-comic-black mx-auto mb-4" />
            </motion.div>
            <p className="action-text text-3xl text-comic-black">LOADING HEROES...</p>
          </div>
        ) : sponsors && getSponsorsByTab().length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${currentPage}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`grid gap-6 ${
                  activeTab === "heroes"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {getPaginatedSponsors().map((sponsor, index) => renderSponsorCard(sponsor, index))}
              </motion.div>
            </AnimatePresence>

            {getTotalPages() > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <motion.button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  whileHover={{ scale: currentPage === 0 ? 1 : 1.1 }}
                  whileTap={{ scale: currentPage === 0 ? 1 : 0.9 }}
                  className={`
                    btn-comic px-4 py-2 font-bold
                    ${
                      currentPage === 0
                        ? "bg-comic-gray text-comic-black opacity-50 cursor-not-allowed"
                        : "bg-comic-yellow text-comic-black hover:bg-comic-darkYellow"
                    }
                  `}
                >
                  PREV
                </motion.button>

                <div className="flex gap-2">
                  {Array.from({ length: getTotalPages() }, (_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`
                        w-10 h-10 font-comic font-bold border-2 border-comic-black
                        ${
                          currentPage === i
                            ? "bg-comic-red text-comic-white"
                            : "bg-comic-white text-comic-black hover:bg-comic-yellow"
                        }
                      `}
                      style={{
                        boxShadow: currentPage === i ? "2px 2px 0 var(--comic-black)" : "none",
                      }}
                    >
                      {i + 1}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={() => setCurrentPage((prev) => Math.min(getTotalPages() - 1, prev + 1))}
                  disabled={currentPage === getTotalPages() - 1}
                  whileHover={{ scale: currentPage === getTotalPages() - 1 ? 1 : 1.1 }}
                  whileTap={{ scale: currentPage === getTotalPages() - 1 ? 1 : 0.9 }}
                  className={`
                    btn-comic px-4 py-2 font-bold
                    ${
                      currentPage === getTotalPages() - 1
                        ? "bg-comic-gray text-comic-black opacity-50 cursor-not-allowed"
                        : "bg-comic-yellow text-comic-black hover:bg-comic-darkYellow"
                    }
                  `}
                >
                  NEXT
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="comic-panel p-12 bg-comic-white max-w-2xl mx-auto">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FaStar className="text-8xl text-comic-yellow mx-auto mb-4" />
              </motion.div>
              <h3 className="action-text text-4xl text-comic-black mb-4">BE OUR FIRST HERO!</h3>
              <p className="font-comic text-xl text-comic-black mb-6">
                Join the league of legendary developers supporting our mission!
              </p>
              <motion.a
                href="https://github.com/sponsors/BuunGroupCore"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-comic bg-comic-red text-comic-white hover:bg-comic-darkRed px-8 py-4 text-xl inline-flex items-center gap-3"
              >
                <FaGithub className="text-2xl" />
                BECOME A SPONSOR HERO
              </motion.a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
