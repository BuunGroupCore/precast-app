import { motion } from "framer-motion";
import { FaExclamationCircle, FaQuestionCircle } from "react-icons/fa";

interface IssueBreakdown {
  label: string;
  name: string;
  open: number;
  closed: number;
  total: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface IssueBreakdownSectionProps {
  issueBreakdown?: IssueBreakdown[];
  loading: boolean;
}

export function IssueBreakdownSection({ issueBreakdown, loading }: IssueBreakdownSectionProps) {
  return (
    <>
      {/* Comic Separator */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className="action-text text-2xl text-comic-blue bg-comic-black px-4 py-1 rounded-full border-4 border-comic-blue">
              ISSUES!
            </div>
          </div>
        </div>
      </div>

      {/* Issue Breakdown Section */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="inline-block">
              <h2 className="action-text text-4xl md:text-6xl text-comic-orange flex items-center gap-4">
                <FaExclamationCircle /> ISSUE BREAKDOWN
              </h2>
            </div>
          </motion.div>

          {/* Issue Type Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {loading && (
              <div className="col-span-3 text-center text-comic-red font-comic text-xl">
                Loading issue data...
              </div>
            )}
            {!loading && (!issueBreakdown || issueBreakdown.length === 0) && (
              <div className="col-span-3 text-center">
                <div className="speech-bubble bg-comic-red text-white p-4 inline-block">
                  <p className="font-comic text-lg">
                    <FaExclamationCircle className="inline mr-2" />
                    GitHub API rate limit reached! Please try again in an hour, or the data shown is
                    cached/fallback data.
                  </p>
                </div>
              </div>
            )}
            {issueBreakdown?.map((issue, index) => {
              const Icon = issue.icon || FaQuestionCircle;
              const completionRate =
                issue.total > 0 ? ((issue.closed / issue.total) * 100).toFixed(0) : 0;

              return (
                <motion.div
                  key={issue.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="comic-panel p-6 bg-comic-white"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`text-3xl ${issue.color || "text-comic-purple"}`} />
                    <h3 className="font-display text-xl text-comic-black">{issue.name}</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-comic text-comic-blue">Total Issues</span>
                      <span className="action-text text-2xl text-comic-red">{issue.total}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-comic text-comic-green">Closed</span>
                      <span className="action-text text-xl text-comic-green">{issue.closed}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-comic text-comic-red">Open</span>
                      <span className="action-text text-xl text-comic-red">{issue.open}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-comic text-comic-purple">Completion Rate</span>
                        <span className="font-comic font-bold text-comic-purple">
                          {completionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-comic-red bg-opacity-20 rounded-full h-3 border-2 border-comic-black">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completionRate}%` }}
                          transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
                          className="bg-comic-green h-full rounded-full border-r-2 border-comic-black"
                          style={{
                            background: `linear-gradient(90deg, #00E676 0%, #4CAF50 100%)`,
                            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }) ||
              // Loading placeholder
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="comic-panel p-6 bg-comic-white"
                >
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                      className="inline-block"
                    >
                      <FaQuestionCircle className="text-4xl text-comic-purple mb-4" />
                    </motion.div>
                    <p className="font-comic text-lg text-comic-black">
                      {loading ? "Loading..." : "No data"}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Issue Summary */}
          {issueBreakdown && issueBreakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
              className="comic-panel p-6 bg-gradient-to-r from-comic-purple to-comic-blue text-white text-center"
            >
              <h3 className="action-text text-3xl mb-4">ISSUE SUMMARY</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="action-text text-4xl mb-2">
                    {issueBreakdown.reduce((sum, issue) => sum + issue.total, 0)}
                  </div>
                  <div className="font-display text-lg">Total Issues</div>
                </div>
                <div>
                  <div className="action-text text-4xl mb-2 text-comic-green">
                    {issueBreakdown.reduce((sum, issue) => sum + issue.closed, 0)}
                  </div>
                  <div className="font-display text-lg">Resolved</div>
                </div>
                <div>
                  <div className="action-text text-4xl mb-2 text-comic-yellow">
                    {issueBreakdown.reduce((sum, issue) => sum + issue.open, 0)}
                  </div>
                  <div className="font-display text-lg">Active</div>
                </div>
                <div>
                  <div className="action-text text-4xl mb-2 text-comic-white">
                    {issueBreakdown.length > 0
                      ? (
                          (issueBreakdown.reduce((sum, issue) => sum + issue.closed, 0) /
                            issueBreakdown.reduce((sum, issue) => sum + issue.total, 0)) *
                          100
                        ).toFixed(0)
                      : 0}
                    %
                  </div>
                  <div className="font-display text-lg">Success Rate</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
