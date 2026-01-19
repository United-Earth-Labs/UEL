import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-blue-900/40 z-0" />
      
      {/* Animated gradient orb that follows mouse */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 blur-[100px] z-0"
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />

      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-4">
            UNITED EARTH
            <br />
            <span className="inline-block mt-2">LABS</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-full mb-6">
            <span className="text-purple-300 text-sm font-semibold tracking-widest uppercase">
              ADVANCING HUMANITY TO TYPE 1 CIVILIZATION
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light max-w-4xl mx-auto leading-relaxed"
        >
          Bringing the future to reality. We are working tirelessly to transform
          <span className="text-cyan-400 font-semibold"> human dreams </span>
          into technological achievements that will elevate humanity to a
          <span className="text-purple-400 font-semibold"> Type 1 Civilization</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
            onClick={() => {
              document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Our Vision
          </motion.button>
        </motion.div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => {
            const randomX = typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1000;
            const randomY = typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 1000;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{
                  x: randomX,
                  y: randomY,
                  opacity: 0,
                }}
                animate={{
                  y: [null, typeof window !== 'undefined' ? Math.random() * window.innerHeight : randomY],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
