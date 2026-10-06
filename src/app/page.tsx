import Navigation from "@/components/Navigation/Navigation";
import Hero from "@/components/Hero/Hero";
import BlackProductStory from "@/components/BlackProductStory/BlackProductStory";
import FeatureExperience from "@/components/Features/FeatureExperience";
import FinalCinematic from "@/components/FinalCinematic/FinalCinematic";
import FinalStatement from "@/components/FinalStatement/FinalStatement";
import BuySection from "@/components/BuySection/BuySection";
import Footer from "@/components/Footer/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <Navigation />
      <main>
        <Hero />
        <BlackProductStory />
        <FeatureExperience />
        <FinalCinematic />
        <FinalStatement />
        <BuySection />
      </main>
      <Footer />
    </SmoothScroll>
  );
}