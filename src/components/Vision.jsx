import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Vision() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="vision" ref={ref} className="relative min-h-screen py-20 px-6 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/20 z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-6">
            OUR VISION
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">
              The Path to Type 1
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Humanity stands at the threshold of an evolutionary leap. At United Earth Labs,
              we envision a future where humanity harnesses the full potential of our planet's
              energy, achieving the status of a Type 1 Civilization on the Kardashev Scale.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              This isn't science fiction—it's our mission. Through revolutionary technology,
              sustainable innovation, and unwavering dedication, we are turning humanity's
              grandest dreams into reality.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Every breakthrough brings us closer to a world where energy is unlimited,
              technology is seamlessly integrated with biology, and humans transcend
              their current limitations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md border border-purple-500/30 rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-cyan-500/10 to-blue-500/0 rounded-3xl blur-xl" />
              <div className="relative space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-cyan-300 font-semibold">Type 1 Civilization Status</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "15%" } : {}}
                    transition={{ duration: 2, delay: 0.6 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Current progress: 15% • Target: 100% Type 1 Civilization
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
