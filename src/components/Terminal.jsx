import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon } from 'lucide-react';

const COMMANDS = {
  'cybertron-construction': {
    title: 'Cybertron Construction',
    description: 'Building a planet-scale technological infrastructure that serves as humanity\'s ultimate achievement in engineering and innovation.',
    details: `
Project: CYBERTRON CONSTRUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are constructing a planet-scale technological infrastructure that will 
serve as humanity's ultimate achievement in engineering and innovation.

Why We Want This:
• To provide unlimited computational resources for global advancement
• To create a self-sustaining technological ecosystem
• To enable processing power for solving humanity's greatest challenges
• To establish a foundation for becoming a Type 1 Civilization

Status: Research Phase
Next Steps: Advanced architectural planning and resource assessment
    `
  },
  'cyborg-technology': {
    title: 'Cyborg Technology',
    description: 'Developing seamless human-machine interfaces that enhance human capabilities while preserving our essential humanity.',
    details: `
Project: CYBORG TECHNOLOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are developing seamless human-machine interfaces that enhance human 
capabilities while preserving our essential humanity and autonomy.

Why We Want This:
• To overcome physical limitations and disabilities
• To augment human intelligence and cognitive abilities
• To enable direct brain-computer communication
• To create a symbiotic relationship between humans and technology

Status: Research phase
Next Steps: Neural interface trials and cognitive enhancement prototypes
    `
  },
  'solar-energy-harvesting': {
    title: 'Solar Energy Harvesting',
    description: 'Harnessing 10% of the sun\'s total energy output to power all of humanity\'s needs sustainably and indefinitely.',
    details: `
Project: SOLAR ENERGY HARVESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are developing technology to harvest 10% of the sun's total energy 
output to power all of humanity's needs sustainably and indefinitely.

Why We Want This:
• To achieve unlimited clean energy for the entire human civilization
• To eliminate fossil fuel dependency permanently
• To power all future technological projects with renewable energy
• To become energy-positive as a species

Status: Research Phase
Next Steps: Orbital construction infrastructure development
    `
  },
  'radiation-as-fuel': {
    title: 'Radiation as Fuel',
    description: 'Transforming harmful radiation into a powerful, clean energy source, revolutionizing how we power our civilization.',
    details: `
Project: RADIATION AS FUEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are transforming harmful radiation into a powerful, clean energy 
source that will revolutionize how we power our civilization.

Why We Want This:
• To harness one of nature's most abundant energy sources
• To solve environmental hazards by converting radiation productively
• To enable deep space exploration with efficient power systems
• To create a redundant power system alongside solar harvesting

Status: Research Phase
Next Steps: Radiation conversion efficiency optimization
    `
  },
  'artificial-ecosystems': {
    title: 'Artificial Ecosystems',
    description: 'Creating self-sustaining biomes and ecosystems that support life beyond Earth, enabling interplanetary colonization.',
    details: `
Project: ARTIFICIAL ECOSYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are creating self-sustaining biomes and ecosystems that support life 
beyond Earth, enabling human colonization across the solar system.

Why We Want This:
• To ensure human survival through multi-planetary presence
• To create closed-loop life support systems for space habitats
• To enable sustainable long-term colonization of other worlds
• To expand the habitable zone for human civilization

Status: Research phase
Next Steps: Zero-gravity ecosystem testing in orbital platforms
    `
  },
  'human-dreams-realized': {
    title: 'Human Dreams Realized',
    description: 'Bringing every ambitious human dream to reality through relentless innovation, research, and technological advancement.',
    details: `
Project: HUMAN DREAMS REALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are committed to bringing every ambitious human dream to reality 
through relentless innovation, research, and technological advancement.

Why We Want This:
• To inspire and empower humanity to achieve the impossible
• To transform science fiction into scientific fact
• To prove that with enough determination, any challenge can be overcome
• To demonstrate that humanity's potential is truly limitless

Status: Research Phase
Next Steps: Research and collaboration with dream-builders worldwide
    `
  },
  'planetary-mining': {
    title: 'Planetaery Mining',
    description: 'Mining planetary bodies for essential resources to fuel humanity\'s expansion into the solar system.',
    details: `
Project: PLANETARY MINING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are mining planetary bodies for essential resources to fuel humanity's 
expansion into the solar system, including metals, minerals, and volatiles.

Why We Want This:
• To secure resources for large-scale space infrastructure
• To reduce dependency on Earth-based materials
• To support sustainable off-world colonies
• To enable advanced manufacturing in space
• To drive economic growth through space resource utilization

Status: Research Phase
    `
  },
};

export default function Terminal({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to United Earth Labs Terminal v1.0' },
    { type: 'output', text: 'Type "help" to see available commands' },
    { type: 'output', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (command) => {
    const trimmedCommand = command.toLowerCase().trim();
    
    // Add command to history
    setHistory(prev => [...prev, { type: 'input', text: `> ${command}` }]);

    if (trimmedCommand === 'help') {
      const helpText = `
Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  cybertron-construction     Build planet-scale technological infrastructure
  cyborg-technology          Develop human-machine interfaces
  solar-energy-harvesting    Harness the sun's unlimited energy
  radiation-as-fuel          Transform radiation into clean power
  artificial-ecosystems      Create sustainable life beyond Earth
  human-dreams-realized      Turn ambitious dreams into reality
  planetary-mining           Mine planetary bodies for essential resources

Type any command name to see detailed information.
Type "clear" to clear terminal history.
Type "exit" to close terminal.
      `;
      setHistory(prev => [...prev, { type: 'output', text: helpText }]);
    } else if (trimmedCommand === 'clear') {
      setHistory([
        { type: 'output', text: 'Terminal cleared.' },
        { type: 'output', text: 'Type "help" for commands' },
      ]);
    } else if (trimmedCommand === 'exit') {
      onClose();
    } else if (COMMANDS[trimmedCommand]) {
      setHistory(prev => [...prev, { type: 'output', text: COMMANDS[trimmedCommand].details }]);
    } else if (trimmedCommand === '') {
      // Empty input, do nothing
    } else {
      setHistory(prev => [...prev, { type: 'output', text: `Command not found: "${command}"\nType "help" for available commands.` }]);
    }

    setInput('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 w-full max-w-2xl max-h-96 z-50"
      >
        <div className="bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-mono font-semibold">UEL Terminal</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Terminal Content */}
          <div
            ref={scrollRef}
            className="bg-gray-950 h-64 overflow-y-auto p-4 font-mono text-sm text-gray-300"
          >
            {history.map((line, idx) => (
              <div key={idx} className="mb-2 whitespace-pre-wrap break-words">
                {line.type === 'input' ? (
                  <span className="text-cyan-400">{line.text}</span>
                ) : (
                  <span className="text-gray-400">{line.text}</span>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-gray-900/80 border-t border-cyan-500/30 px-4 py-3 flex items-center gap-2">
            <span className="text-cyan-400 font-mono">{'>'}</span>
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCommand(input);
                }
              }}
              className="flex-1 bg-transparent text-cyan-400 font-mono outline-none"
              placeholder="Type 'help' for commands..."
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
