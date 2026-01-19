import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Sun, Zap, Atom, Leaf, Rocket } from 'lucide-react';

const goals = [
  {
    title: 'Cybertron Construction',
    icon: Rocket,
    description: 'Building a planet-scale technological infrastructure that serves as humanity\'s ultimate achievement in engineering and innovation.',
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.1,
  },
  {
    title: 'Cyborg Technology',
    icon: Cpu,
    description: 'Developing seamless human-machine interfaces that enhance human capabilities while preserving our essential humanity.',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0.2,
  },
  {
    title: 'Solar Energy Harvesting',
    icon: Sun,
    description: 'Harnessing 10% of the sun\'s total energy output to power all of humanity\'s needs sustainably and indefinitely.',
    gradient: 'from-yellow-500 to-orange-500',
    delay: 0.3,
  },
  {
    title: 'Radiation as Fuel',
    icon: Atom,
    description: 'Transforming harmful radiation into a powerful, clean energy source, revolutionizing how we power our civilization.',
    gradient: 'from-green-500 to-emerald-500',
    delay: 0.4,
  },
  {
    title: 'Artificial Ecosystems',
    icon: Leaf,
    description: 'Creating self-sustaining biomes and ecosystems that support life beyond Earth, enabling interplanetary colonization.',
    gradient: 'from-teal-500 to-green-500',
    delay: 0.5,
  },
  {
    title: 'Human Dreams Realized',
    icon: Zap,
    description: 'Bringing every ambitious human dream to reality through relentless innovation, research, and technological advancement.',
    gradient: 'from-indigo-500 to-purple-500',
    delay: 0.6,
  },
];

export default function Goals() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="goals" ref={ref} className="relative min-h-screen py-20 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-blue-900/20 z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-6">
            OUR ULTIMATE GOALS
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            These are not just projects—they are the milestones that will define humanity's future
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.map((goal, index) => {
            const Icon = goal.icon;
            return (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: goal.delay }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative"
              >
                <div className="relative h-full p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-md border border-purple-500/20 rounded-3xl overflow-hidden transition-all duration-300 hover:border-purple-500/50">
                  {/* Animated gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${goal.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Glowing corner effect */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${goal.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex p-4 bg-gradient-to-br ${goal.gradient} rounded-2xl mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {goal.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {goal.description}
                    </p>
                  </div>

                  {/* Animated border */}
                  <motion.div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${goal.gradient} opacity-0 group-hover:opacity-20 blur-xl`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1.2 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional vision text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-md border border-purple-500/30 rounded-3xl max-w-4xl">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
              "The future belongs to those who believe in the beauty of their dreams."
              <br />
              <span className="text-cyan-400 font-semibold">— United Earth Labs</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
