import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-6 relative z-20 flex flex-col md:flex-row items-center justify-between">
      <p className="text-gray-400 text-sm md:text-base max-w-sm mb-6 md:mb-0">
        Empowering your fleet with real-time operations tech, protecting your bottom line everywhere.
      </p>
      
      <Link to="/signup" className="px-8 py-3 rounded-full border border-white text-white text-sm font-medium hover:bg-white hover:text-black transition-colors w-full md:w-auto text-center">
        Try Demo
      </Link>
    </div>
  );
}
