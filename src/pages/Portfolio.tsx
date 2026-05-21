import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Terminal } from '../components/Terminal';
import { ProjectCard } from '../components/ProjectCard';
import portfolioData from '../../data/portfolio.json';

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
    <div className="min-h-screen selection:bg-blue-500/30 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="z-10 w-full max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              {portfolioData.personalInfo.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-lg md:text-xl text-zinc-400 mb-8 font-medium">
              {portfolioData.personalInfo.roles.map((role, index) => (
                <React.Fragment key={role}>
                  <span>{role}</span>
                  {index < portfolioData.personalInfo.roles.length - 1 && (
                    <span className="text-blue-500">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10">
              {portfolioData.personalInfo.bio}
            </p>
          </motion.div>

          <Terminal />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-12"
          >
            {portfolioData.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white hover:scale-110 transition-all duration-300"
                aria-label={social.name}
              >
                {iconMap[social.icon.toLowerCase()]}
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-zinc-600"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-blue-500 rounded-full mx-auto md:mx-0"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-24 px-6 max-w-6xl mx-auto relative border-t border-zinc-800/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Fun Games</h2>
          <div className="w-20 h-1 bg-blue-500 rounded-full mx-auto md:mx-0"></div>
          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto md:mx-0">
            A collection of interactive games and simulations I built. Take a break and have some fun!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      <section className="py-24 px-6 max-w-4xl mx-auto text-center border-t border-zinc-800/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tech Stack</h2>
          <p className="text-zinc-500">The tools I use to build modern experiences</p>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {portfolioData.techStack.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass px-6 py-3 rounded-full text-zinc-300 font-medium hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors cursor-default"
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-600 text-sm border-t border-zinc-800/50">
        <p>© {new Date().getFullYear()} Joshi Minh. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
