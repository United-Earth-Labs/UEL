import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';
import ApplicationForm from './ApplicationForm';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section id="contact" ref={ref} className="relative min-h-screen py-20 px-6 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/20 z-0" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-6">
            JOIN THE MISSION
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-8" />
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Be part of the generation that transforms humanity. Whether you're a scientist,
            engineer, dreamer, or visionary—your contribution matters in building our future.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-md border border-purple-500/30 rounded-3xl">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">Get in Touch</h3>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {[
                  { icon: Mail, label: 'Email', href: 'mailto:adityaraaj11d@gmaail.com' },
                  { icon: Github, label: 'GitHub', href: 'https://github.com/United-Earth-Labs' },
                  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/united-earth-labs-6506533a6' },
                ].map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-3 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-purple-500/30 hover:border-purple-500/50 rounded-full transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-cyan-400" />
                      <span className="text-gray-300 font-semibold">{social.label}</span>
                    </motion.a>
                  );
                })}
              </div>

              <motion.button
                onClick={() => setIsFormOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300"
              >
                Apply to Join the Team
              </motion.button>
            </div>

            <div className="mt-12">
              <p className="text-gray-400 text-sm">
                United Earth Labs • Building Tomorrow, Today
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Application Form Modal */}
      <ApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </section>
  );
}
