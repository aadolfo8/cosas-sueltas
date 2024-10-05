"use client";

import { FC, useEffect, useState } from "react";

interface TypewriterEffectProps {
  text: string;
  speed?: number;
}

const TypewriterEffect: FC<TypewriterEffectProps> = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
      {displayText}
      <span className="inline-block w-1 h-8 bg-primary ml-1 animate-blink"></span>
    </h1>
  );
};

export default TypewriterEffect;
