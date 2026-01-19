import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative border-t border-purple-500/20 bg-gray-900/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} United Earth Labs. All rights reserved.
          </div>
          <div className="text-gray-400 text-sm">
            Advancing humanity to Type 1 Civilization
          </div>
          <div className="flex space-x-6">
            <a href="#hero" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Home
            </a>
            <a href="#vision" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Vision
            </a>
            <a href="#goals" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Goals
            </a>
            <a href="#contact" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
