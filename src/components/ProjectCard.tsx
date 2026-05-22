import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

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
      className="group relative block outline-none h-full"
    >
      <Card className="h-full flex flex-col group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <div className="h-48 w-full bg-[#111] relative overflow-hidden border-b border-[#222]">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#111] to-[#000] text-[#555] text-sm">
              No Image Provided
            </div>
          )}
        </div>
        <CardContent className="p-6 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-medium text-white group-hover:text-accent transition-colors">
              {title}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-[#666] group-hover:text-accent transition-colors" />
          </div>
          <p className="text-[#888] text-sm mb-6 line-clamp-3 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="hover:bg-[#222] bg-[#111] text-[#aaa] border-[#333] font-normal text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.a>
  );
};

