import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  titleColor: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  description,
  icon,
  iconColor,
  titleColor,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Comic book halftone pattern background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-8 mb-8">
        <Link to="/">
          <button className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow flex items-center gap-2">
            <FaArrowLeft />
            BACK TO HOME
          </button>
        </Link>
      </div>

      {/* Main container */}
      <div className="max-w-6xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="text-center py-12 mb-12">
          <div className="relative inline-block mb-8">
            <div className="relative">
              <div
                className={`absolute inset-0 ${iconColor} rounded-full blur-xl opacity-30 animate-pulse`}
              ></div>
              <div className="relative bg-comic-white rounded-full p-6 border-8 border-comic-black shadow-2xl">
                {icon}
              </div>
            </div>
          </div>

          <h1 className={`action-text text-5xl md:text-7xl ${titleColor} mb-12`}>{title}</h1>
          <div className="speech-bubble max-w-4xl mx-auto">
            <p className="font-comic text-xl md:text-2xl text-comic-darkBlue">{description}</p>
          </div>
          <div
            className={`mt-6 ${iconColor} text-comic-white border-4 border-comic-black px-6 py-2 rounded-full font-comic font-bold inline-block transform rotate-1`}
          >
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">{children}</div>
      </div>
    </div>
  );
}
