import { useState } from 'react';
import { Menu, X, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-6 py-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Truck className="w-6 h-6 text-brand-accent" />
          <span className="font-display font-bold text-xl tracking-tight text-white">TransitOps</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#platform" className="text-sm text-gray-300 hover:text-white transition-colors">Platform</a>
          <a href="#benefits" className="text-sm text-gray-300 hover:text-white transition-colors">Benefits</a>
          <a href="#partners" className="text-sm text-gray-300 hover:text-white transition-colors">Partners</a>
          <a href="#contact" className="text-sm text-gray-300 hover:text-white transition-colors">Contact</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors font-medium">
            Log in
          </Link>
          <Link to="/signup" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors">
            Get Started
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-4 p-4 rounded-2xl bg-[#141416] border border-white/10 flex flex-col gap-4 md:hidden"
        >
          <a href="#platform" className="text-gray-300 hover:text-white p-2" onClick={() => setIsOpen(false)}>Platform</a>
          <a href="#benefits" className="text-gray-300 hover:text-white p-2" onClick={() => setIsOpen(false)}>Benefits</a>
          <a href="#partners" className="text-gray-300 hover:text-white p-2" onClick={() => setIsOpen(false)}>Partners</a>
          <a href="#contact" className="text-gray-300 hover:text-white p-2" onClick={() => setIsOpen(false)}>Contact</a>
          <Link to="/login" className="text-center w-full px-5 py-3 text-gray-300 hover:text-white text-sm font-medium">
            Log in
          </Link>
          <Link to="/signup" className="text-center w-full px-5 py-3 rounded-full bg-white text-black text-sm font-medium">
            Get Started
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
