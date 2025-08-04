import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface ComicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export function ComicDialog({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OKAY!",
  cancelText,
  onConfirm,
}: ComicDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const titleColors = {
    success: "text-comic-green",
    error: "text-comic-red",
    info: "text-comic-blue",
  };

  const effectText = {
    success: "SUCCESS!",
    error: "OH NO!",
    info: "INFO!",
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="comic-dialog-overlay" onClick={onClose}>
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: -1 }}
            exit={{ scale: 0, rotate: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="comic-dialog"
          >
            {/* Comic Effect */}
            <div className="absolute -top-8 -right-8 action-text text-5xl text-comic-yellow opacity-80">
              {effectText[type]}
            </div>

            <h2 className={`comic-dialog-title ${titleColors[type]}`}>{title}</h2>

            <p className="comic-dialog-content">{message}</p>

            <div className="comic-dialog-buttons">
              <button onClick={handleConfirm} className="btn-pow">
                {confirmText}
              </button>
              {cancelText && (
                <button onClick={onClose} className="btn-bam">
                  {cancelText}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
