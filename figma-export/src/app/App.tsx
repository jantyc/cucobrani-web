import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { CurrentEdition } from "./components/CurrentEdition";
import { Archive } from "./components/Archive";
import { Location } from "./components/Location";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function App() {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#F6F4F1",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Hero onScrollToSection={scrollToSection} />
      <About />
      <CurrentEdition />
      <Archive />
      <Location />
      <Contact />
      <Footer />
    </div>
  );
}