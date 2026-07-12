export default function TrustLogos() {
  return (
    <div className="w-full max-w-5xl mx-auto py-24 px-6 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 opacity-70 grayscale">
        {/* Placeholder Logos styling mimicking the reference */}
        <div className="flex items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:grayscale-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-white rotate-45" />
            <span className="font-display font-bold text-xl text-white">LogisticsCo</span>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:grayscale-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">FreightRun</span>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:grayscale-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-4 bg-white skew-x-12" />
            <div className="w-4 h-4 bg-white skew-x-12 -ml-2" />
            <span className="font-display font-bold text-xl text-white">TransNat</span>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm transition-all hover:bg-white/10 hover:grayscale-0">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-1 rotate-45">
              <div className="w-3 h-3 bg-white" />
              <div className="w-3 h-3 bg-white" />
              <div className="w-3 h-3 bg-white" />
              <div className="w-3 h-3 bg-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">BoxMove</span>
          </div>
        </div>
      </div>
    </div>
  );
}
