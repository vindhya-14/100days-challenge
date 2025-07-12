import React, { useState, useEffect } from 'react';
import useThrottle from '../hooks/useThrottle';

const ThrottledScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 300);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log('Scroll position:', throttledScrollY);
  }, [throttledScrollY]);

  return (
   <div className="scroll-box">
    <h2>Throttled Scroll</h2>
    <p>Scroll down to see throttled updates in the console.</p>
  </div>
  );
};

export default ThrottledScroll;
