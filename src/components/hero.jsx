"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

const TypewriterEffect = dynamic(
  () => import("./TypewriterEffect").then((mod) => mod.TypewriterEffect),
  {
    ssr: false,
    loading: () => (
      <span className="inline-block">
        <span className="inline-block">Ultimate</span>
        <span className="font-instrument italic bg-gradient-to-r from-sky-400 via-sky-300 to-white text-transparent bg-clip-text">
          Directory
        </span>
      </span>
    ),
  }
);

export function Hero() {
  const heroRef = useRef(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce(async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/tools/search?q=${encodeURIComponent(query)}`
      );
      setSearchResults(response.data.data);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the grid
      gsap.from(".perspective-grid", {
        rotationX: 0,
        scale: 1,
        duration: 2,
        ease: "power3.inOut",
      });

      // Animate text elements with upward motion
      gsap.from(".hero-text > *:not(.search-input)", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      });

      // Animate the search input
      gsap.from(".search-input", {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1.5,
        ease: "power3.out",
      });

      // Animate gradient sources
      gsap.to([".gradient-source-left", ".gradient-source-right"], {
        opacity: 0.8,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleSearchClick = (category, toolName) => {
    setShowResults(false);
    setSearchQuery("");

    // Capitalize first letter of each word
    const capitalizeWords = (str) => {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const formattedCategory = capitalizeWords(category);
    const formattedToolName = capitalizeWords(toolName);

    router.push(
      `/${encodeURIComponent(formattedCategory)}/${encodeURIComponent(
        formattedToolName
      )}`
    );
  };

  return (
    <div
      ref={heroRef}
      className="relative min-h-[600px] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
    >
      <div className="grid-perspective">
        <div className="perspective-grid">
          <div className="horizontal-lines" />
        </div>
      </div>

      {/* Gradient sources */}
      <div className="gradient-source-left" />
      <div className="gradient-source-right" />

      {/* Gradient overlay */}
      <div className="gradient-overlay" />

      <div className="relative z-10 w-full max-w-4xl mx-auto hero-text">
        <div className="relative flex flex-col items-center mb-8">
          {/* Top Glowing Line */}
          <div className="w-full max-w-[250px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent mb-2"></div>

          {/* Text in the Center */}
          <span className="text-white/70 text-xs sm:text-sm bg-black px-4 py-1 rounded-full">
            🔥 1000+ AI tools added last month
          </span>

          {/* Bottom Glowing Line */}
          <div className="w-full max-w-[250px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent mt-2"></div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 font-suisse-light">
          <TypewriterEffect />
        </h1>

        <p className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-suisse-medium text-white mb-10">
          Your One Stop for AI Tools
        </p>

        <div className="relative w-full max-w-2xl mx-auto z-50">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI tools..."
            className="w-full h-12 pl-12 pr-4 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#2EFFD5] transition-all bg-white/10 backdrop-blur-sm focus:border-none"
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="h-4 w-4 text-white animate-spin" />
            ) : (
              <Search className="text-white w-4 h-4" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults &&
            searchResults &&
            Object.keys(searchResults).length > 0 && (
              <div className="absolute mt-2 w-full bg-black/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  {Object.entries(searchResults).map(([category, tools]) => (
                    <div
                      key={category}
                      className="border-b border-white/10 last:border-none"
                    >
                      <div className="px-4 py-2 bg-white/5">
                        <h3 className="text-sm font-medium text-white/70">
                          {category}
                        </h3>
                      </div>
                      <div className="divide-y divide-white/10">
                        {tools.map((tool) => (
                          <button
                            key={tool._id}
                            onClick={() =>
                              handleSearchClick(category, tool.name)
                            }
                            className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors"
                          >
                            <div className="text-white font-medium">
                              {tool.name}
                            </div>
                            <div className="text-sm text-white/50">
                              {tool.tagline}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
