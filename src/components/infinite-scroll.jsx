
"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function InfiniteScroll({
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) {
  const [items, setItems] = useState([]);
  const [start, setStart] = useState(false);
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  // Fetch tools from API
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/promotion`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setItems(data);
        }
      } catch (error) {
        console.error("Error fetching AI tools:", error);
      }
    };
    fetchTools();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      addAnimation();
    }
  }, [items]);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      let duration = "40s";
      if (speed === "fast") duration = "20s";
      if (speed === "slow") duration = "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="w-[350px] max-w-full relative rounded-2xl flex-shrink-0 border-slate-700 px-8 py-6 md:w-[200px] transparent"
            // style={{
            //   background: "linear-gradient(180deg, var(--slate-800), var(--slate-900))",
            // }}
            key={item.name}
          >
            <blockquote>
              <div className="relative z-20 flex items-center gap-4">
                <img
                  src={item.logo}
                  alt={item.name}
                  className="w-12 h-12 rounded-full border border-gray-400"
                />
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}

