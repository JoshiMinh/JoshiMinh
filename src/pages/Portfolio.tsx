import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Terminal } from '../components/Terminal';
import { ProjectCard } from '../components/ProjectCard';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { portfolioData } from '../../data';

const Github = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const iconMap: Record<string, React.ReactNode> = {
  github: <Github className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />
};

function App() {
  return (
    <div className="min-h-screen bg-black text-[#ededed] font-sans selection:bg-accent/30 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/15 rounded-[100%] blur-[120px] pointer-events-none -z-10" />

      {/* Header Navigation Area (Minimal) */}
      <header className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="font-bold text-xl tracking-tighter text-white">JM.</div>
        <div className="flex gap-4">
          {portfolioData.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666] hover:text-white transition-colors"
              aria-label={social.name}
            >
              {iconMap[social.icon.toLowerCase()]}
            </a>
          ))}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="z-10 w-full max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge variant="outline" className="mb-6 border-[#333] text-[#aaa] bg-[#111]">
              Available for new opportunities
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gradient mb-6">
              {portfolioData.personalInfo.name}
            </h1>
            <p className="text-xl md:text-2xl text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              {portfolioData.personalInfo.bio}
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-16">
              <Button variant="default" size="lg" className="font-semibold px-8" asChild>
                <a href="#projects">View Projects</a>
              </Button>
              <Button variant="secondary" size="lg" className="font-semibold px-8" asChild>
                <a href={portfolioData.socials[0].url} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
            </div>
          </motion.div>

          <Terminal />
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-24 px-6 max-w-7xl mx-auto border-t border-[#111]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Featured Work</h2>
          <p className="text-[#888] max-w-2xl text-lg">A selection of my recent engineering projects and creative experiments.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.projects.map((project, index) => (
            <ProjectCard 
              key={project.id}
              {...project}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Fun Games Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#111]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Interactive Experiences</h2>
          <p className="text-[#888] max-w-2xl text-lg">
            Complex simulations and games built entirely with web technologies.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.games.map((game, index) => (
            <ProjectCard 
              key={game.id}
              {...game}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center border-t border-[#111]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Technologies</h2>
          <p className="text-[#888] text-lg">The stack I use to build scalable, high-performance applications.</p>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-3">
          {portfolioData.techStack.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <Badge variant="outline" className="px-4 py-2 text-sm text-[#aaa] border-[#333] hover:border-accent hover:text-white transition-colors bg-black cursor-default">
                {tech}
              </Badge>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-[#111]">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="font-bold text-2xl tracking-tighter text-white">JM.</div>
          <p className="text-[#666] text-sm">© {new Date().getFullYear()} Joshi Minh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
