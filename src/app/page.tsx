import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import { NextPage } from "next";
import projects from "../_data/projects";


const HomePage: NextPage = () => {
  return (
    <main className="flex flex-1 flex-col gap-y-14">
      <Hero title="Proyectos" description="Cosas sueltas que se me van ocurriendo y voy haciendo miniproyectos para poder juntarlos todos en el mismo sitio" />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard project={project} />
        ))}
      </section>
    </main>
  );
};

export default HomePage;
