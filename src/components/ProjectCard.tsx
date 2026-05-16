import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: string[];
  delay?: number;
}

export const ProjectCard = ({ title, description, imageUrl, link, tags, delay = 0 }: ProjectCardProps) => {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative block glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-[16/9] w-full bg-zinc-900 relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-700">
            [Image Placeholder]
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
        </div>
        <p className="text-zinc-400 mb-6 line-clamp-2">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
};
