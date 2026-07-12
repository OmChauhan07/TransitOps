export default function Benefits() {
  return (
    <div id="benefits" className="w-full bg-brand-bg relative z-30 pt-32 pb-40 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-display font-medium text-center text-white mb-20 tracking-tight">
          Our Benefits
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Card 1 */}
          <div className="bg-brand-card rounded-[32px] p-8 md:p-10 border border-white/5 flex flex-col justify-start">
            <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-6 pr-8">
              Real-time fleet visibility
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mt-auto pt-12">
              Track every vehicle, driver, and trip status in one unified dashboard. No more messy spreadsheets or disjointed tools to figure out where your assets are.
            </p>
          </div>

          {/* Card 2 (Elevated Center Card) */}
          <div className="bg-brand-card rounded-[32px] p-8 md:p-10 border border-white/10 md:-translate-y-12 relative overflow-hidden group flex flex-col shadow-2xl">
            {/* Background Map/Route visual accent */}
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-accent" strokeDasharray="4 4" />
                <circle cx="50" cy="50" r="2" className="fill-brand-accent" />
                <circle cx="100" cy="50" r="2" className="fill-brand-accent" />
              </svg>
            </div>
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-brand-accent/10 to-transparent pointer-events-none" />
            
            <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-6 relative z-10">
              Automatic compliance guardrails
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mt-auto pt-12 relative z-10">
              Expired licenses, missing certifications, and suspended drivers are blocked from dispatch automatically, not caught after the fact when it's too late.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-brand-card rounded-[32px] p-8 md:p-10 border border-white/5 flex flex-col justify-start">
            <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-6 pr-8">
              Cost & efficiency insight
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mt-auto pt-12">
              Automatically calculate fuel efficiency, asset utilization, and ROI per vehicle in real-time, rather than reconstructing it manually at month-end.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
