import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { Project } from '../_types/project';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={project.href}>
    <Card
      key={project.title}
      className="flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-gray-800">
      <Image
        src={project.image}
        alt={project.title}
        width={300}
        height={200}
        className="object-cover w-full h-48 rounded-t-xl"
      />
      <CardHeader>
        <CardTitle className="text-xl text-white font-semibold">{project.title}</CardTitle>
        <CardDescription className="text-gray-400">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Aquí puedes añadir más detalles del proyecto si lo deseas */}
      </CardContent>
    </Card>
    </Link>
  );
};

export default ProjectCard;
