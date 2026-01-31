import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Terminal as TerminalIcon } from 'lucide-react';

const COMMANDS = {
    'armoris': {
    title: 'Armoris',
    description: 'Your device rolled around your arm, sitting in a band, and  coming out when fingerprint is scanned.',
    details: `
Project: ARMORIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are constructing a device which will be wrapped 
around your arm.

Why We Want This:
• Break rigid device form factors
• Improve on-body ergonomics
• Explore flexible primary interfaces
• Enable secure, instant access

Status: Prototype
Next Steps: Patent
    `
    'augmenta': {
    title: 'Augmenta',
    description: 'Building a gautlet which enhnaces human strength',
    details: `
Project: AUGMENTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are constructing a gautlet which enhances human strength
allowing humans to exert 10x force.

Why We Want This:
• Study safe strength augmentation
• Extend human physical capability
• Reduce strain in force tasks
• Build foundations for future wearables

Status: Research Phase
Next Steps: Prototype and patent
    `
  },
  },
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
  'cybertron-construction': {
    title: 'Cybertron Construction',
    details: `Project: CYBERTRON CONSTRUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are constructing a planet-scale technological infrastructure that will 
serve as humanity's ultimate achievement in engineering and innovation.

Why We Want This:
• To provide unlimited computational resources for global advancement
• To create a self-sustaining technological ecosystem
• To enable processing power for solving humanity's greatest challenges
• To establish a foundation for becoming a Type 1 Civilization

Status: In Early Research Phase
Next Steps: Advanced architectural planning and resource assessment`
  },
  'cyborg-technology': {
    title: 'Cyborg Technology',
    details: `Project: CYBORG TECHNOLOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are developing seamless human-machine interfaces that enhance human 
capabilities while preserving our essential humanity and autonomy.

Why We Want This:
• To overcome physical limitations and disabilities
• To augment human intelligence and cognitive abilities
• To enable direct brain-computer communication
• To create a symbiotic relationship between humans and technology

Status: Active Development
Next Steps: Neural interface trials and cognitive enhancement prototypes`
  },
  'solar-energy-harvesting': {
    title: 'Solar Energy Harvesting',
    details: `Project: SOLAR ENERGY HARVESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are developing technology to harvest 10% of the sun's total energy 
output to power all of humanity's needs sustainably and indefinitely.

Why We Want This:
• To achieve unlimited clean energy for the entire human civilization
• To eliminate fossil fuel dependency permanently
• To power all future technological projects with renewable energy
• To become energy-positive as a species

Status: Theoretical Framework Complete
Next Steps: Orbital construction infrastructure development`
  },
  'radiation-as-fuel': {
    title: 'Radiation as Fuel',
    details: `Project: RADIATION AS FUEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are transforming harmful radiation into a powerful, clean energy 
source that will revolutionize how we power our civilization.

Why We Want This:
• To harness one of nature's most abundant energy sources
• To solve environmental hazards by converting radiation productively
• To enable deep space exploration with efficient power systems
• To create a redundant power system alongside solar harvesting

Status: Experimental Phase
Next Steps: Radiation conversion efficiency optimization`
  },
  'artificial-ecosystems': {
    title: 'Artificial Ecosystems',
    details: `Project: ARTIFICIAL ECOSYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are creating self-sustaining biomes and ecosystems that support life 
beyond Earth, enabling human colonization across the solar system.

Why We Want This:
• To ensure human survival through multi-planetary presence
• To create closed-loop life support systems for space habitats
• To enable sustainable long-term colonization of other worlds
• To expand the habitable zone for human civilization

Status: Prototype Development
Next Steps: Zero-gravity ecosystem testing in orbital platforms`
  },
  'human-dreams-realized': {
    title: 'Human Dreams Realized',
    details: `Project: HUMAN DREAMS REALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
We are committed to bringing every ambitious human dream to reality 
through relentless innovation, research, and technological advancement.

Why We Want This:
• To inspire and empower humanity to achieve the impossible
• To transform science fiction into scientific fact
• To prove that with enough determination, any challenge can be overcome
• To demonstrate that humanity's potential is truly limitless

Status: Ongoing Initiative
Next Steps: Research and collaboration with dream-builders worldwide`
  },
};

export default function TerminalSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

    setHistory(prev => [...prev, { type: 'input', text: `> ${command}` }]);

    if (trimmedCommand === 'help') {
      const helpText = `Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  cybertron-construction     Build planet-scale technological infrastructure
  cyborg-technology          Develop human-machine interfaces
  solar-energy-harvesting    Harness the sun's unlimited energy
  radiation-as-fuel          Transform radiation into clean power
  artificial-ecosystems      Create sustainable life beyond Earth
  human-dreams-realized      Turn ambitious dreams into reality

Type any command name to see detailed information.
Type "clear" to clear terminal history.`;
      setHistory(prev => [...prev, { type: 'output', text: helpText }]);
    } else if (trimmedCommand === 'clear') {
      setHistory([
        { type: 'output', text: 'Terminal cleared.' },
        { type: 'output', text: 'Type "help" for commands' },
      ]);
    } else if (COMMANDS[trimmedCommand]) {
      setHistory(prev => [...prev, { type: 'output', text: COMMANDS[trimmedCommand].details }]);
    } else if (trimmedCommand === '') {
      // Empty input, do nothing
    } else {
      setHistory(prev => [...prev, { type: 'output', text: `Command not found: "${command}"\nType "help" for available commands.` }]);
    }

    setInput('');
  };

  return (
    <section id="terminal" ref={ref} className="relative min-h-screen py-20 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/20 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-6">
            COMMAND CENTER
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our projects and future plans through the terminal. Type "help" to see available commands.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-md border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border-b border-cyan-500/30 px-6 py-4 flex items-center gap-3">
            <TerminalIcon className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-400 font-mono font-semibold text-lg">UEL Terminal</span>
          </div>

          {/* Terminal Content */}
          <div
            ref={scrollRef}
            className="bg-gray-950 h-96 overflow-y-auto p-6 font-mono text-sm text-gray-300"
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
          <div className="bg-gray-900/80 border-t border-cyan-500/30 px-6 py-4 flex items-center gap-3">
            <span className="text-cyan-400 font-mono text-lg flex-shrink-0">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCommand(input);
                }
              }}
              className="flex-1 bg-transparent text-cyan-400 font-mono outline-none placeholder-gray-600"
              placeholder="Type 'help' to see available commands..."
            />
          </div>
        </motion.div>

        {/* Quick Commands */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <p className="text-gray-400 text-center mb-6 font-semibold">Quick Access to Projects:</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(COMMANDS).map(([cmd, data]) => (
              <motion.button
                key={cmd}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCommand(cmd)}
                className="p-4 bg-gray-900/50 border border-cyan-500/20 hover:border-cyan-500/50 rounded-lg text-left transition-all group"
              >
                <p className="text-cyan-400 font-mono text-sm">{`> ${cmd}`}</p>
                <p className="text-gray-400 text-sm mt-2 group-hover:text-gray-300">{data.title}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
