import { useEffect, useRef, useState } from 'react';

export default function VideoBackground() {
  const videoRef = useRef(null);
  const [shouldPlay, setShouldPlay] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches) {
      setShouldPlay(false);
    } else if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("Autoplay failed, likely due to browser policies:", error);
      });
    }

    const handleChange = (e) => {
      setShouldPlay(!e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
      } else if (!e.matches && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen z-[-1] pointer-events-none bg-brand-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-brand-bg z-10" />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)] z-10" />
      
      {/* 
        User's provided video: Truck_202607121124.mp4 
        Using a placeholder generic truck/road video for the demo.
      */}
      {shouldPlay ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-80"
          poster="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop"
        >
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" type="video/mp4" />
        </video>
      ) : (
        <img 
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop" 
          alt="Truck on highway"
          className="absolute w-full h-full object-cover opacity-80"
        />
      )}
    </div>
  );
}

