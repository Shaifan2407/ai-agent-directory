"use client";

import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

export function TypewriterEffect() {
  const el = useRef(null);
  const typed = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !el.current) return;

    const options = {
      strings: ["Ultimate AI", "Powerful AI", "AI Tools"],
      typeSpeed: 80,
      backSpeed: 60,
      backDelay: 1000,
      startDelay: 100,
      loop: true,
      showCursor: true,
      cursorChar: "|",
      autoInsertCss: true,
    };

    typed.current = new Typed(el.current, options);

    return () => {
      if (typed.current) {
        typed.current.destroy();
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <span className="inline-block">
        <span className="inline-block">Ultimate</span>
        <span className="font-instrument italic bg-gradient-to-r from-sky-400 via-sky-300 to-white text-transparent bg-clip-text ml-2">
          Directory
        </span>
      </span>
    );
  }

  return (
    <span className="inline-block">
      <span ref={el} className="inline-block"></span>
      <span className="font-instrument italic bg-gradient-to-r from-sky-400 via-sky-300 to-white text-transparent bg-clip-text ml-2">
        Directory
      </span>
    </span>
  );
}
