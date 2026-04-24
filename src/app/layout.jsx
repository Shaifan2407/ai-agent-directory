"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import "./globals.css";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Smooth scroll to top
    const handleScrollToTop = () => {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: 0 },
        ease: "power2.inOut",
      });
    };

    // Add event listener to the window object
    window.addEventListener("scrolltotop", handleScrollToTop);

    // Smooth scroll on mouse wheel
    const smoothScroll = (event) => {
      event.preventDefault();
      const delta = Math.max(
        -1,
        Math.min(1, event.wheelDelta || -event.detail)
      );
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const finalScroll = scrollTop - delta * 30;
      gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: finalScroll, autoKill: true },
        ease: "power2.out",
        overwrite: 5,
      });
    };

    // Add event listener for mouse wheel
    window.addEventListener("mousewheel", smoothScroll, { passive: false });
    window.addEventListener("DOMMouseScroll", smoothScroll, { passive: false });

    // Show/hide scroll-to-top button
    ScrollTrigger.create({
      start: 100,
      onEnter: () => setShowScrollTop(true),
      onLeaveBack: () => setShowScrollTop(false),
    });

    // Initial loading animation
    const tl = gsap.timeline();
    tl.to(".loading-overlay", {
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => setIsLoading(false),
    }).from(
      "body > *",
      { opacity: 0, y: 20, stagger: 0.2, ease: "power2.out" },
      "-=0.5"
    );

    // Background animation
    gsap.to(".bg-gradient", {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Page transition
    const pageTransition = () => {
      const tl = gsap.timeline();
      tl.to("body > *", {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.in",
      }).from(
        "body > *",
        { opacity: 0, y: 20, duration: 0.3, stagger: 0.1, ease: "power2.out" },
        "+=0.1"
      );
    };

    window.addEventListener("beforeunload", pageTransition);

    // Cleanup
    return () => {
      window.removeEventListener("scrolltotop", handleScrollToTop);
      window.removeEventListener("mousewheel", smoothScroll);
      window.removeEventListener("DOMMouseScroll", smoothScroll);
      window.removeEventListener("beforeunload", pageTransition);
    };
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://db.onlinewebfonts.com/a/Aw0g00aa7qbFk0nqosz2w1ENV81cB3N3Y0JrZ0b2"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico.png" sizes="any" />
      </head>
      <body className="font-suisse-regular min-h-screen bg-black relative">
        <div className="bg-gradient absolute inset-0 opacity-20 pointer-events-none"></div>
        {isLoading && (
          <div className="loading-overlay fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="loading-spinner"></div>
          </div>
        )}
        <Navbar />
        <Toaster
          position="top-right"
          theme="light"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "white",
              color: "black",
              border: "1px solid #E5E7EB",
              marginTop: "80px",
            },
            success: {
              icon: "✓",
            },
            error: {
              icon: "✕",
            },
          }}
        />
        <main>{children}</main>
        <Footer />
        {showScrollTop && (
          <button
            onClick={() => window.dispatchEvent(new Event("scrolltotop"))}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Scroll to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </body>
    </html>
  );
}
