import { NextPage } from "next";
import Hero from "./_components/Hero";
import ProjectCard from "./_components/ProjectCard";
import projects from "./_data/projects";

const HomePage: NextPage = () => {
  return (
    <main className="flex flex-1 flex-col gap-y-14">
      <Hero title="Cosas sueltas" description="Cosas sueltas by Adolfo" />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard project={project} />
        ))}
      </section>
    </main>
  );
};

export default HomePage;
