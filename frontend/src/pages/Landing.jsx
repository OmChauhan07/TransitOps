import Navbar from '../components/Navbar';
import VideoBackground from '../components/VideoBackground';
import Hero from '../components/Hero';
import TrustLogos from '../components/TrustLogos';
import CTABanner from '../components/CTABanner';
import PlatformPreview from '../components/PlatformPreview';
import Benefits from '../components/Benefits';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen font-sans selection:bg-brand-accent selection:text-white">
      <VideoBackground />
      <Navbar />
      
      <main>
        <Hero />
        <TrustLogos />
        <CTABanner />
        <PlatformPreview />
        <Benefits />
      </main>

      <Footer />
    </div>
  );
}
