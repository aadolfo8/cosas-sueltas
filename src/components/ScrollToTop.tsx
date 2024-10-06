'use client';

import { ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <React.Fragment>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-lg transition-all duration-300"
          aria-label="Volver arriba">
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </React.Fragment>
  );
};

export default ScrollToTop;
