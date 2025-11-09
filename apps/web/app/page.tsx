import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { ForProjects } from '@/components/ForProjects';
import { CTASection } from '@/components/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: 'url(/bg-1.webp)',
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <ForProjects />
        <CTASection />
      </div>
    </div>
  );
}
