import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTimes, FaClipboardList } from "react-icons/fa";

interface ValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Comic-style validation dialog for required fields
 */
export function ValidationDialog({ isOpen, onClose }: ValidationDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-comic-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Dialog */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="comic-panel bg-comic-white p-8 max-w-md w-full relative"
              style={{ boxShadow: "8px 8px 0 rgba(0,0,0,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-comic-gray hover:text-comic-red transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>

              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="comic-panel bg-comic-yellow p-4">
                  <FaExclamationTriangle className="text-4xl text-comic-black" />
                </div>
              </div>

              {/* Title */}
              <h3 className="action-text text-2xl text-comic-red text-center mb-4">
                HOLD UP, HERO!
              </h3>

              {/* Message */}
              <div className="text-center mb-6">
                <p className="font-comic text-lg text-comic-black mb-4">
                  You need to fill in the required fields before submitting your epic feature
                  request!
                </p>

                <div className="bg-comic-red/10 border-2 border-comic-red rounded-lg p-4">
                  <p className="font-comic text-sm text-comic-black font-bold mb-2 flex items-center gap-2">
                    <FaClipboardList className="text-comic-red" />
                    Required Fields:
                  </p>
                  <ul className="font-comic text-sm text-comic-black space-y-1 text-left">
                    <li>
                      • <span className="font-bold">Feature Name</span> - What should we call it?
                    </li>
                    <li>
                      • <span className="font-bold">Description</span> - What does it do?
                    </li>
                    <li>
                      • <span className="font-bold">Use Case</span> - Why do you need it?
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="btn-comic bg-comic-blue text-comic-white hover:bg-comic-darkBlue w-full"
              >
                GOT IT! LET ME FIX THAT
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
