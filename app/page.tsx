import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import SocialProof from "@/components/landing/SocialProof";
import Footer from "@/components/landing/Footer";

/**
 * Landing page — assembles all sections in order:
 * 1. Hero (full-viewport with animated chart)
 * 2. Problem Section (3 pain points)
 * 3. How It Works (3-step process)
 * 4. Features Grid (2×3 feature cards)
 * 5. Social Proof (testimonials + stats)
 * 6. Footer (links + disclaimer)
 *
 * The Navbar is rendered persistently via the root layout.
 */

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeaturesGrid />
      <SocialProof />
      <Footer />
    </>
  );
}
