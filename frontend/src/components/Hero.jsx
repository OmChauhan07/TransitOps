import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

function StatBadge({ value, label, className = '', lineDirection = 'bl' }) {
  return (
    <div className={`absolute flex flex-col ${className}`}>
      {/* Visual leader line */}
      <div className={`absolute w-12 h-[1px] bg-white/30 ${
        lineDirection === 'bl' ? '-left-14 top-1/2 -rotate-12' :
        lineDirection === 'tr' ? '-right-14 top-1/2 rotate-12' :
        lineDirection === 'tl' ? '-left-14 -top-4 -rotate-45' :
        '-right-14 -bottom-4 rotate-45'
      }`} />
      
      <span className="font-display font-medium text-2xl text-white tracking-tight">{value}</span>
      <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function Hero() {
  return (
    <div className="relative min-h-screen pt-40 pb-20 px-6 flex flex-col items-center">
      {/* Scattered Headline Container */}
      <div className="relative w-full max-w-4xl mx-auto h-[60vh] min-h-[500px] flex items-center justify-center">
        
        {/* Top Left Text */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-10 md:top-20 left-0 max-w-[220px] text-sm text-gray-400 leading-relaxed z-20"
        >
          Track every vehicle, driver, and trip in real time — no spreadsheets, no blind spots.
        </motion.div>

        {/* Scattered Word 1 */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute top-20 md:top-32 left-10 md:left-20 text-[15vw] md:text-[130px] leading-none font-display font-bold tracking-tighter z-10 drop-shadow-2xl"
        >
          move
        </motion.h1>

        {/* Scattered Word 2 */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute top-36 md:top-52 right-5 md:right-10 text-[18vw] md:text-[150px] leading-none font-display font-bold tracking-tighter text-white z-20 drop-shadow-2xl mix-blend-overlay opacity-90"
          style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}
        >
          your fleet
        </motion.h1>

        {/* Scattered Word 3 */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-[280px] md:top-[380px] left-1/2 -translate-x-1/2 md:-translate-x-3/4 text-[16vw] md:text-[140px] leading-none font-display font-bold tracking-tighter text-white z-30 drop-shadow-2xl"
        >
          forward
        </motion.h1>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <StatBadge 
            value="+150" 
            label="fleets managed" 
            className="top-10 md:top-20 right-10 md:right-32"
            lineDirection="bl"
          />
          <StatBadge 
            value="+10k" 
            label="trips dispatched" 
            className="top-[320px] md:top-[400px] -left-4 md:left-10"
            lineDirection="tr"
          />
          <StatBadge 
            value="99.8%" 
            label="on-time delivery" 
            className="bottom-10 right-10 md:right-20"
            lineDirection="tl"
          />
        </motion.div>
      </div>

      {/* CTA Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-12 flex flex-col md:flex-row items-center gap-4 z-20"
      >
        <div className="flex items-center rounded-full bg-white/5 border border-white/10 p-1 backdrop-blur-sm">
          <button className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-300 hover:text-white transition-colors">
            see it in action
          </button>
          <Link to="/signup" className="px-6 py-2.5 rounded-full bg-brand-accent text-white text-sm font-medium hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(245,124,0,0.4)]">
            try demo
          </Link>
        </div>
      </motion.div>
      
      {/* Descriptive Paragraph below Hero */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-20 max-w-2xl text-center text-gray-400 leading-relaxed text-sm md:text-base z-20"
      >
        Centralize your vehicle registry, driver compliance, dispatch operations, and maintenance schedules in one unified platform. Move beyond disparate spreadsheets and isolated tools.
      </motion.div>
    </div>
  );
}
