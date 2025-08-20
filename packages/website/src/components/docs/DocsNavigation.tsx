import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface DocsNavigationProps {
  prevPage?: {
    title: string;
    onClick: () => void;
  };
  nextPage?: {
    title: string;
    onClick: () => void;
  };
}

export function DocsNavigation({ prevPage, nextPage }: DocsNavigationProps) {
  return (
    <div className="mt-16 pt-8 border-t-2 border-gray-200">
      <div className="flex justify-between items-center gap-4">
        {prevPage ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevPage.onClick}
            className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <FaArrowLeft className="text-gray-600 group-hover:text-blue-600 transition-colors" />
            <div className="text-left">
              <div className="text-sm text-gray-500 group-hover:text-blue-500">Previous</div>
              <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                {prevPage.title}
              </div>
            </div>
          </motion.button>
        ) : (
          <div />
        )}

        {nextPage ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextPage.onClick}
            className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white border-2 border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-all group"
          >
            <div className="text-right">
              <div className="text-sm text-blue-100">Next</div>
              <div className="font-semibold">{nextPage.title}</div>
            </div>
            <FaArrowRight className="text-white" />
          </motion.button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
