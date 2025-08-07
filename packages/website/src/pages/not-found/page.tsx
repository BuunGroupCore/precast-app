import { FaHome, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

/**
 * Comic book style 404 page with a complete superhero story
 * Features vertical comic strip layout with all panels visible
 */
export function NotFoundPage() {
  const comicPanels = [
    {
      title: "THE MISSING PAGE MYSTERY",
      subtitle: "Chapter 1: The Discovery",
      text: "Our hero PRECAST discovers that a mysterious page has vanished from the digital realm...",
      image: "/art/6.png",
      soundEffect: "GASP!",
      position: "left",
    },
    {
      title: "THE SEARCH BEGINS",
      subtitle: "Chapter 2: Into the Code",
      text: "Armed with powerful CLI tools, PRECAST dives deep into the codebase to track down the missing 404 page...",
      image: "/art/7.png",
      soundEffect: "ZOOM!",
      position: "right",
    },
    {
      title: "THE DIGITAL DIMENSION",
      subtitle: "Chapter 3: Lost in Cyberspace",
      text: "The page seems to have been trapped in a parallel dimension where broken links roam free!",
      image: "/art/10.png",
      soundEffect: "WHOOSH!",
      position: "left",
    },
    {
      title: "THE FINAL CONFRONTATION",
      subtitle: "Chapter 4: Hero's Return",
      text: "But don't worry! PRECAST has the power to generate new pages and restore order to the web!",
      image: "/art/1.png",
      soundEffect: "POW!",
      position: "right",
    },
  ];

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

      {/* Main container */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Header with 404 */}
        <div className="text-center py-12 mb-8">
          <div className="relative inline-block">
            <h1 className="text-8xl md:text-9xl font-black text-comic-red transform -rotate-3 drop-shadow-lg">
              404
            </h1>
            <div className="absolute -top-4 -right-4 bg-comic-red text-comic-white text-sm font-bold px-3 py-2 rounded-full transform rotate-12">
              ERROR!
            </div>
          </div>
          <h2 className="font-comic text-3xl text-comic-darkBlue font-bold mt-4">
            PAGE NOT FOUND ADVENTURE
          </h2>
          <p className="font-comic text-xl text-comic-gray italic mt-2">
            A Comic Book Story in 4 Chapters
          </p>
        </div>

        {/* Comic panels - vertical layout */}
        <div className="space-y-16">
          {comicPanels.map((panel, index) => (
            <div
              key={index}
              className="border-8 border-comic-black rounded-lg bg-comic-white shadow-2xl p-8"
            >
              {/* Panel header */}
              <div className="text-center mb-8 pb-4 border-b-4 border-comic-black">
                <h3 className="font-comic text-2xl text-comic-red font-bold">{panel.title}</h3>
                <p className="font-comic text-lg text-comic-gray italic">{panel.subtitle}</p>
              </div>

              {/* Panel content */}
              <div
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  panel.position === "right" ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Text content */}
                <div className={`space-y-6 ${panel.position === "right" ? "md:order-2" : ""}`}>
                  {/* Sound effect - clean design */}
                  <div className="mb-8">
                    <div className="inline-block bg-comic-yellow border-4 border-comic-black px-6 py-3 transform -rotate-2 shadow-lg">
                      <span className="font-black text-3xl text-comic-red">
                        {panel.soundEffect}
                      </span>
                    </div>
                  </div>

                  {/* Story text in speech bubble */}
                  <div className="relative border-4 border-comic-black rounded-3xl p-6 shadow-lg bg-opacity-90 bg-comic-white">
                    <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-comic-black"></div>
                    <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white"></div>

                    <p className="font-comic text-xl leading-relaxed text-comic-darkBlue">
                      {panel.text}
                    </p>
                  </div>
                </div>

                {/* Hero image */}
                <div className={`${panel.position === "right" ? "md:order-1" : ""}`}>
                  <div className="relative">
                    {/* Comic panel border */}
                    <div className="border-4 border-comic-black bg-comic-white p-4 transform rotate-1 shadow-2xl">
                      <img
                        src={panel.image}
                        alt={panel.title}
                        className="w-full h-80 object-cover rounded-lg"
                      />

                      {/* Panel frame decoration */}
                      <div className="absolute -top-2 -left-2 w-4 h-4 bg-comic-red rounded-full border-2 border-comic-black"></div>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-comic-blue rounded-full border-2 border-comic-black"></div>
                      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-comic-green rounded-full border-2 border-comic-black"></div>
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-comic-yellow rounded-full border-2 border-comic-black"></div>
                    </div>

                    {/* Comic action lines */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute top-4 right-4 w-20 h-1 bg-comic-black transform rotate-12 opacity-60"></div>
                      <div className="absolute top-8 right-2 w-16 h-1 bg-comic-black transform rotate-12 opacity-40"></div>
                      <div className="absolute top-12 right-6 w-12 h-1 bg-comic-black transform rotate-12 opacity-30"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapter separator */}
              {index < comicPanels.length - 1 && (
                <div className="mt-12 text-center">
                  <div className="inline-block bg-comic-black text-comic-white px-6 py-2 rounded-full font-comic font-bold transform rotate-1">
                    TO BE CONTINUED...
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer with action buttons */}
        <div className="mt-16 p-8 border-8 border-comic-black rounded-lg bg-gradient-to-r from-comic-blue to-comic-purple shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="font-comic text-3xl text-comic-white font-bold mb-2">
              THE END... OR IS IT?
            </h3>
            <p className="font-comic text-comic-white text-xl">
              Ready to create your own superhero project?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <button className="bg-comic-yellow hover:bg-comic-orange text-comic-black border-4 border-comic-black font-comic font-bold px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-lg">
                <FaHome className="text-xl" />
                HOME BASE
              </button>
            </Link>

            <Link to="/builder">
              <button className="bg-comic-red hover:bg-comic-darkRed text-comic-white border-4 border-comic-black font-comic font-bold px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-lg">
                <FaRocket className="text-xl" />
                BUILD POWER
              </button>
            </Link>
          </div>
        </div>

        {/* Comic book style decorative elements */}
        <div className="absolute top-20 left-8 text-comic-red font-black text-2xl transform -rotate-12 opacity-10">
          WHAM!
        </div>
        <div className="absolute top-1/4 right-12 text-comic-blue font-black text-xl transform rotate-12 opacity-10">
          KAPOW!
        </div>
        <div className="absolute bottom-1/4 left-12 text-comic-green font-black text-lg transform -rotate-6 opacity-10">
          BOOM!
        </div>
        <div className="absolute bottom-32 right-8 text-comic-orange font-black text-xl transform rotate-8 opacity-10">
          ZAP!
        </div>
      </div>
    </div>
  );
}
