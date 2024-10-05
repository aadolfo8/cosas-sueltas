import { FC } from "react";
import TypewriterEffect from "./TypeWriterEffect";

interface HeroProps {
  title: string;
  description: string;
}

const Hero: FC<HeroProps> = ({ title, description }) => {
  return (
    <section className="flex flex-1 justify-center flex-col items-center">
      <TypewriterEffect text={title} speed={200} />
      <p>{description}</p>
    </section>
  );
};

export default Hero;
